<?php

namespace App\Http\Controllers;

use App\Pays;
use App\User;
use App\Outil;
use App\MessageSend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Mail;

class UserController extends Controller
{
    private $queryName = "users";

    public function save(Request $request)
    {
        try
        {
            return DB::transaction(function () use ($request)
            {
                // dd($request->all());
                $errors=null;
                $user = new User();
                if (!empty($request->id))
                {
                    $user = User::find($request->id);
                }


               if(empty($request->nom) || empty($request->prenom) || empty($request->telephone) ||  empty($request->email) || empty($request->confirmemail))
               {
                   $errors = "Veuillez remplire tous les champs du formulaire";
               }

                    if (empty($request->password) || empty($request->confirmpassword))
                    {
                        $errors = "Veuillez remplir tous les mots de passe";
                    }
                    if(empty($request->nci))
                    {
                        $errors = "Veuillez renseigner votre numéro de carte identitite national";
                    }


                if(!empty($request->password) && $request->password!= $request->confirmpassword)
                {
                    $errors = "les deux mots de passe ne correspondent pas";
                }
                if(!empty($request->email) && $request->email!= $request->confirmemail)
                {
                    $errors = "L'email de confirmation n'est pas le même email";
                }

                if (empty($request->id))
                {
                    if(!Outil::isUnique(['email'], [$request->email], $request->id, User::class))
                    {
                        $errors = "Cet email existe déja";
                    }
                    if(!Outil::isUnique(['telephone'], [$request->telephone], $request->id, User::class))
                    {
                        $errors = "Ce numéro téléphone existe déja";
                    }
                    if(!Outil::isUnique(['nci'], [$request->nci], $request->id, User::class))
                    {
                        $errors = "Ce numéro de carte d'identité existe déja";
                    }
                }
               


                  $user->name               = $request->nom;
                  $user->nom                = $request->nom;
                 if($request->nci)  $user->nci                = $request->nci;
                  $user->prenom             = $request->prenom;
                  $user->telephone          = $request->telephone;
                  $user->email              = $request->email;
                  $user->adresse_complet    = $request->adresse_complet;
                  $user->is_client          = true;
                  $user->active             = true;
                !empty($request->password) ? $user->password = bcrypt($request->password) : '' ;

                $role = Role::find($request->role);
                if (!isset($errors) && $user->save())
                {

                    $user->save();
                    $id = $user->id;
                    return response()->json(array(
                        'data' => $user,
                        'success' => "inscription réussi",
                    ));

                    $tableau = [
                        'title' => "Message de confirmation",
                        'body'  => "Votre demande de création de projet a été bien prise en charge. Veuillez vous connecter sur votre espace personnelle pour procéder au paiment"
                    ];
                    \Mail::to("zimkhandiaye@gmail.com")->send(new \App\Mail\SendSubscritionConfirm($tableau));
                     return Outil::redirectgraphql($this->queryName, "id:{$id}", Outil::$queries[$this->queryName]);
                }
                return response()->json(['errors' => $errors]);
            });
        }
        catch (\Exception $e)
        {
            return response()->json(['errors' => $e->getMessage()]);
        }
    }

        public function resave(Request $request)
        {
            try
            {
                return DB::transaction(function () use($request){
                    $errors = null;
                    if (empty($request->id))
                    {
                        $errors = "veuillez contacter le service technique";
                    }

                    $item = User::find($request->id);
                    if(isset($item))
                    {
                        if(isset($request->nom))
                        {
                            $item->nom = $request->nom;
                        }
                        if(isset($request->prenom))
                        {
                            $item->prenom = $request->prenom;
                        }
                        if(isset($request->code_postal))
                        {
                            $item->code_postal = $request->code_postal;
                        }
                        if(isset($request->telephone))
                        {
                            $item->telephone = $request->telephone;
                        }
                        if(isset($request->pays))
                        {
                            $pays = Pays::find($request->pays);
                            if ($pays) {
                                $item->pays = $pays->nom_fr_fr;
                            }
                        }
                        if(isset($request->adresse_complet))
                        {
                            $item->adresse_complet = $request->adresse_complet;
                        }

                    }
                    if(!isset($errors))
                    {
                        $item->save();
                        $tableau = [
                            'title' => "Message de confirmation",
                            'body'  => "Votre compte client chez samakeur a été bien creer. Merci de votre confiance à SAMAKEUR"
                        ];
                        \Mail::to($item->email)->send(new \App\Mail\SendMessageConfirm($tableau));
                        return Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);

                    }
                    throw new \Exception($errors);
                });
            }catch(\Exception $e)
            {
                return response()->json(['errors' => $e->getMessage()]);
            }
        }
    public function statut(Request $request)
    {
        $errors = null;
        $data = 0;

        try
        {
            // dd($request->all());
            $user = User::find($request->id);
            if ($user != null)
            {
                $user->active = $request->etat;
            }
            else
            {
                $errors = "Cet utilisateur n'existe pas";
            }

            // dd($user->active);
            if (!isset($errors) && $user->save())
            {
                $data = 1;
            }
            else
                throw new \Exception($errors);
        }
        catch (\Exception $e)
        {
            $errors = "Vérifier les données fournies";
        }
        return response('{"data":' . $data . ', "errors": "'. $errors .'" }')->header('Content-Type','application/json');
    }

    public function delete($id)
    {
        try
        {
            return DB::transaction(function () use ($id)
            {
                $errors = null;
                $data = 0;

                if($id)
                {
                    $user = User::with('projets')->find($id);
                    if ($user!=null && $user->is_client == 1)
                    {
                        $dataliason = true;
                        if (count($user->projets)==0)
                        {
                            $user->delete();
                            $user->forceDelete();
                            $data = 1;
                            $dataliason = false;
                        }

                        if ($dataliason)
                        {
                            $data = 0;
                            $errors = "Cet utilisateur à des données à son actif:  ".count($user->projets)." projets";
                        }
                    }
                    else
                    {
                        $data = 0;
                        $errors = "Utilisateur inexistant";
                    }
                }
                else
                {
                    $errors = "Données manquantes";
                }

                if (isset($errors))
                {
                    throw new \Exception('{"data": null, "errors": "'. $errors .'" }');
                }
                return response('{"data":' . $data . ', "errors": "'. $errors .'" }')->header('Content-Type','application/json');
            });
        }
        catch (\Exception $e)
        {
            return response($e->getMessage())->header('Content-Type','application/json');
        }
    }
    public function  testesave(Request $request)
    {

       /* $this->validate($request, [

            'name' => 'required',

            'email' => 'required|email|unique:users,email',

            'password' => 'required|same:confirm-password',

            'roles' => 'required'

        ]);

*/

        $input = $request->all();

        $input['password'] = Hash::make($input['password']);


        $user = User::create($input);
        $user->save();
        $user->assignRole($request->input('roles'));

        return 'ok';
        //  return redirect()->route('users.index')

        //       ->with('success','User created successfully');
    }

    public function update(Request $request, $id)

    {

       try{
            return DB::transaction(function ()use($request, $id){
                $errors = null;
                $input = $request->all();

                if(!empty($input['password'])){

                    $input['password'] = Hash::make($input['password']);

                }else{

                    $input = array_except($input,array('password'));

                }
                if(!Outil::isUnique(['email'], [$request->email], $request->id, User::class))
                {
                    $errors = "Cet email existe déja";
                    return $errors;
                }


                $user = User::find($id);
                if ($user==null)
                    return "Impossible de trouve cette utilsateur avec ces identifiants";

                $user->update($input);

                DB::table('model_has_roles')->where('model_id',$id)->delete();


                $user->assignRole($request->input('roles'));
                return $user;
               // return Outil::redirectgraphql($this->queryName, "id:{$user->id}", Outil::$queries[$this->queryName])
            });
       }catch(\Exception $e)
       {
         return response()->json($e->getMessage())->header('Content-Type', 'application/json');
       }

    }
    public function resetpassword(Request $request)
    {
        try
        {
            return
            DB::transaction(function() use($request)
            {
                $errors = null;
                if(isset($request->email))
                {
                    $user =  User::where('email', $request->email)->get()->first();
                    if(isset($user))
                    {
                        if(!empty($request->password) && !empty($request->confirmpassword))
                        {
                            if($request->password == $request->confirmpassword)
                            {
                                $user->password = Hash::make($request->password);

                            }
                            else
                            {
                                $errors = "Les mots de pass ne sont pas identiques";
                            }
                        }
                        else
                        {
                            $errors = "Veuillez renseigner les deux mots de passe";
                        }
                    }
                    else
                    {
                        $errors = "Un utilsateur avec cette mot de passe n'existe pas dans la base de donnée";
                    }

                }
                else
                {
                    $errors = "Veuillez renseigner l'email";
                }
                if(!isset($errors))
                    {
                        $user->save();
                        return Outil::redirectgraphql($this->queryName, "id:{$user->id}", Outil::$queries[$this->queryName]);

                    }
                    throw new \Exception($errors);
                });
            }catch(\Exception $e)
            {
                return response()->json(['errors' => $e->getMessage()]);
            }
    }
    public function sendMessage(Request $request)
    {
      
        try
        {
            return DB::transaction(function() use($request){
                $errors =  null;
                if(empty($request->message) || empty($request->nom) || empty($request->telephone) || empty($request->objet) || empty($request->email))
                {
                    $errors = "Veuillez precisez tous les champs du formulaire";
                
                }
                if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) 
                {
                    $errors = "Email invalide";
                }
                if(!isset($errors))
                {
                    
                    $item               = new MessageSend();
                    $item->message      = $request->message;
                    $item->nom          = $request->nom;
                    $item->email        = $request->email;
                    $item->objet        = $request->objet;
                    $item->telephone    = $request->telephone;
                    $item->save();
                    $retour = array(
                        'success'          => 1,
                    );
                    //         \Mail::send(['page' => 'mails.contact_email'],
                    // array(
                    //     'nom' => $request->nom,
                    //     'email' => $request->email,
                    //     'objet' => $request->objet,
                    //     'telephone' => $request->telephone,
                    //     'message' => $request->message,
                    // ), function($message) use ($item)
                    // {
                    //     $message->from($item->email);
                    //     $message->to('zimkhandiaye@gmail.com.com');
                    // });
                    return response()->json($retour);

                }
                throw new \Exception($errors);
            });
        }
        catch(\Exception $e)
        {
            return response()->json(['errors' => $e->getMessage()]);

        }
    }
    public function deleteMessage($id)
    {
       try
       {
        DB::transaction(function() use($id){
            // Pour supprimer un message ou email
            $errors = null;
            $data = 1;
            if(isset($id))
            {
                $item_message = MessageSend::find($id);
                if(isset($item_message))
                {
                    $item_message->forceDelete();
                    $item_message->delete();
                    $data = 1;
                    $retour = array(
                        'success'          => $data,
                    );
                return response()->json($retour);
                }
                else
                {
                    $errors = "Impossible de trouver les données";
                }
            }
            else
            {
                $errors = "Données manquantes";
            }
             if(isset($errors))
             {
                throw new \Exception($errors);
             }
        });
       } 
       catch(\Exception $e)
       {
        return response()->json(array(
            'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
            'errors_debug'    => [$e->getMessage()],
        ));
       }
    }

    public function saveNci(Request $request)
    {
        try {
            return DB::transaction(function() use($request)
            {
                $errors = null;
                if(empty($request->user_id))
                {
                    $errors = "Données manquantes";
                }
                if(empty($request->nci))
                {
                    $errors = "Veuillez précisez le numéro de la carte d'identité";
                }

                if(empty($errors))
                {
                    $user = User::find($request->user_id);
                    if(isset($user))
                    {
                        $user->nci  = $request->nci;
                        $user->save();
                        return Outil::redirectgraphql($this->queryName, "id:{$user->id}", Outil::$queries[$this->queryName]);
                    }
                }
            });
        } catch (\Exception $e) {
            return response()->json(['errors' => $e->getMessage()]);
        }
    }

    public function deleteContact($id)
    {
      try {
        return DB::transaction(function() use($id) {
          $errors = null;
          $data = 1;
          if(iiset($id))
          {
            $item_message = MessageSend::find($id);
            if(isset($item_message))
            {
                $item_message->forceDelete();
                $item_message->delete();
                $data = 1;
                $retour = array(
                    'success'          => $data,
                );
            return response()->json($retour);
            }
            else
            {
                $errors = "Impossible de trouver les données";
            }
          }
          else
          {
              $errors = "Données manquantes";
          }
           if(isset($errors))
           {
              throw new \Exception($errors);
           }

        });
      }  catch (\Exception $e) {
        return response()->json(['errors' => $e->getMessage()]);
    }
    }
}
