<?php

namespace App\Http\Controllers;

use App\Outil;
use App\User;
use App\UserHoraire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    private $queryName = "users";

    public function save(Request $request)
    {
        try
        {
            return DB::transaction(function () use ($request)
            {
                $errors=null;
                $user = new User();

                if (!empty($request->id))
                {
                    $user = User::find($request->id);
                }
                else
                {
                    $user->active = true;
                }
                //dd($request->all());
                // Si au moins un champ est vide?
                if(empty($request->name) || empty($request->email))
                {

                    $errors = "Veuillez remplir tous les champs";
                }
                else if (empty($request->id))
                {
                    if (empty($request->password) || empty($request->confirmpassword))
                    {
                        $errors = "Veuillez remplir tous les mots de passe";
                    }
                }

                if(!empty($request->password) && $request->password!= $request->confirmpassword)
                {
                    $errors = "les deux mots de passe ne correspondent pas";
                }
                if (empty($request->id))
                {
                    if(!Outil::isUnique(['email'], [$request->email], $request->id, User::class))
                    {
                        $errors = "Cet email existe déja";
                    }
                }

                $user->name = $request->name;
                $user->email = $request->email;
                $user->restaurant_id = $request->resto;
                !empty($request->password) ? $user->password = bcrypt($request->password) : '' ;
                $role = Role::find($request->input('role'));
                if (!isset($errors) && $user->save())
                {
                    if (isset($user->id))
                    {
                        if ($role!=null)
                        {
                            $user->syncRoles($role);
                        }

                    }
                    else
                    {
                        $user->id = DB::select('SELECT id FROM users ORDER BY id DESC LIMIT 1')[0]->id;
                    }

                    // Dans le cas de la modification d'un profil
                    if ($role!=null)
                        $user->assignRole($role);

                    // Pour upload d'une image
                    if (!isset($errors) && !empty(Input::file('image')) )
                    {
                        // upload file
                        $fichier = $_FILES['image']['name'];
                        $fichier_tmp = $_FILES['image']['tmp_name'];
                        $ext = explode('.',$fichier);
                        $rename = config('view.uploads')['users']."/user_".$user->id.".".end($ext);
                        move_uploaded_file($fichier_tmp,$rename);
                        $user->image = $rename;
                    }
                    else if (Input::get('image_erase')) // Permet de supprimer l'image de l'utilisateur
                    {
                        $user->image = null;
                    }
                    $user->save();
                    $id = $user->id;
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


    public function statut(Request $request)
    {
        $errors = null;
        $data = 0;

        try
        {

            $user = User::find($request->id);
            if ($user != null)
            {
                $user->active = $request->status;
            }
            else
            {
                $errors = "Cet utilisateur n'existe pas";
            }


            if (!isset($errors) && $user->save())
            {
                $data = 1;
            }
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
                    $user = User::with('commandes')->find($id);
                    if ($user!=null)
                    {
                        $dataliason = true;
                        if (count($user->commandes)==0 && count($user->depenses)==0)
                        {
                            $user->delete();
                            $user->forceDelete();
                            $data = 1;
                            $dataliason = false;
                        }

                        if ($dataliason)
                        {
                            $data = 0;
                            $errors = "Cet utilisateur à des données à son actif:  ".count($user->commandes)." commandes -> ".count($user->depenses)." dépenses";
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



  

}
