<?php

namespace App\Http\Controllers;

use App\User;
use App\Outil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Redirect;


class ClientController extends Controller
{
    private $queryName = "users";

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/login');
    }
    public function connexion(Request $request)
    {

       try
       {
            $errors = null;
            $data = null;
          
            $user_email = $request->email;
            $password   = $request->password;
            $user = User::where('email', $user_email)->first();
            if(isset($user))
            {
                if(Hash::check($password, $user->password))
                {
                    //Projetdd($user);
                    if($user->active == 0 || $user->active == false)
                    {
                    $errors = "votre compte n'est pas encore activé";
                    return response()->json([
                        'data' => null,
                        'errors_debug' => $errors
                    ], 200);
                    }
                    else
                    {
                
                    return response()->json([
                        'data' => $user,
                        'message' => ["connexion réussi"],
                        'errors_debug' => null
                    ], 200);
                    }
                }
                
                else
                {
                    return response()->json([
                        'data'   => null,
                        'errors_debug' => ["mot de passe incorrect"]
                    ], 200);
                }
            }
            else
                {
                    return response()->json([
                        'data' => null,
                        'errors_debug' => ["email incorrecte"]
                    ], 200);
                }
            

       }
       catch(\Exception $e)
       {
        return Outil::getResponseError($e);
       }
    }

    public function login(Request $request)
    {
        $email    = $request->email;
        $password = $request->password;

        $client = User::where('email', $email)->first();
       
        if (!isset($client))
        {
            return response()->json(array(
                'data' => NULL,
                'errors' => 'Aucun compte associé à cet email',
            ));
        }
        else if (!Hash::check($password,$client->password))
        {
            return  response()->json(array(
                'data' => NULL,
                'errors' => 'login ou mot de passe incorrect',
            ));
        }
      
        if ($client->active==false)
        {
            return  response()->json(array(
                'data' => NULL,
                'errors' => 'Votre compte n\'a pas encore été activé<br><br>Un lien d\'activation vous a été envoyé dans votre boite mail',
            ));
        }

        $client = Outil::getOneItemWithGraphQl($this->queryName, $client->id, true);;

        return  response()->json(array(
            'data' => $client,
            'success' => 'Vous etes connecté',

        ));
    }
    public function resetPassword(Request $request)
    {
        try{
            DB::transaction(function() use($request)
            {
                if(isset($request->email))
                {
                    $user = User::where('email', $request->email)->where('active', '=', 1)->get();
                    if(isset($user))
                    {
                        // Si l'utililsateur exist et l'utilisateur est active
                        if(isset($request->password) && isset($request->confirmpassword))
                        {
                            if($request->password == $request->confirmpassword)
                            {
                                $password = Hash::make($request->password);
                                $user->password = $password;
                                $user->save();
                }
                        }
                        else
                        {
                            $errors = "Veuillez renseigne les deux mot de passe";
                        }
                    }
                    else
                    {
                        $errors = "Email introuvable ou utilisateur désactiver";
                    }
                }
                else
                {
                    $errors = "veuillez preciser votre email";
                }
                if(!isset($errors))
                {
                    return Outil::redirectgraphql($this->queryName, "id:{$user->id}", Outil::$queries[$this->queryName]);
                }
                return response()->json(['errors' => $errors]);

            });
                    
        }
        catch(\Exception $e)
        {
            return response()->json(['errors' => $e->getMessage()]);
        }
    }

}
