<?php

namespace App\Http\Controllers;

use App\Outil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    private $queryName = "roles";


    public function save(Request $request)
    {
        try
        {
            return DB::transaction(function () use ($request)
            {
                $errors = null;

                $role = new Role();
                if (!empty($request->id))
                {
                    $role = Role::with('users')->find($request->id);

                    if ($role->name!=$request->name)
                    {
                        if ($role->users > 0)
                        {
                            $errors = "Ce role est déjà lié à des utilisateurs, vous ne pouvez pas le modifier";
                        }
                    }
                }
                $role->name = $request->name;
                if(!Outil::isUnique(['name'], [$request->name], $request->id, Role::class))
                {
                    $errors = "Le nom de ce profil existe déja";
                }

                $role_permissions = Input::get('permissions');
                if (isset($role_permissions))
                {
                    try
                    {
                        $role_permissions = explode(',', $role_permissions);
                    }
                    catch (\Exception $e)
                    {
                        $role_permissions = (!empty($role_permissions)) ? array($role_permissions) : array();
                    }
                }

                try
                {
                    if (!isset($errors) && $role->save())
                    {
                        $id = $role->id;
                        $role->syncPermissions($role_permissions);
                        return Outil::redirectgraphql($this->queryName, "id:{$id}", Outil::$queries[$this->queryName]);
                    }
                    return response()->json(['errors' => $errors]);
                }
                catch (\Exception $e)
                {
                    throw new \Exception('{"data": null, "errors": "'.$e->getMessage().'" }');
                }
            });
        }
        catch (\Exception $e)
        {
            return response()->json(['errors' => $e->getMessage()]);
        }
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
                    $role = Role::find($id);
                    if ($role!=null)
                    {
                        if(count($role->users) > 0)
                        {
                            $data = 0;
                            $errors = "Ce profil est déjà lié à des utilisateurs";
                        }
                        else
                        {
                            $role->delete();
                            $data = 1;
                        }
                    }
                    else
                    {
                        $data = 0;
                        $errors = "Role inexistant";
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
