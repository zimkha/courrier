<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Outil;
class TypeRemarqueController extends Controller
{
    protected $queryName = "typeremarques";

    public function save(Request $request)
    {
        try
        {
          return DB::transaction(function() use($request)
          {
              $errors = null;
              $item = new TypeRemarque();
              if (isset($request->id))
              {
                  $item = TypeRemarque::find($request->id);
              }
              if(empty($request->name))
              {
                  $errors = "veuillez donner un nom a ce type de remarque";
              }
              if(!Outil::isUnique(['name'], [$request->name], $request->id, TypeRemarque::class))
              {
                  $errors = "Le nom de ce type de remarque existe déja";
              }
              if (!isset($errors))
              {
                   // Si la variable $errors est null
                   $item->name = $request->name;
                   $item->save();
                   $id = $item->id;
                   return Outil::redirectgraphql($this->queryName, "id:{$id}", Outil::$queries[$this->queryName]);
              }
              return response()->json(['errors' => $errors]);

          });
        } catch(\Exception $ex)
        {
            throw new \Exception('{"data": null, "errors": "'.$e->getMessage().'" }');
        }
    }

    public function delete($id)
    {
        try
        {
            return DB::transaction(function () use($id)
            {
                $errors = null;
                $data = 0;
                if($id)
                {
                    $item = TypeRemarques::with('remarques')->find($id);
                    if(isset($item))
                    {
                        $remarques = Remarque::where('type_remarque_id', $id)->get();
                        if (count($remarques) > 0 )
                        {
                            $errors ="Impossible de supprimer des données liées au système";
                        }
                        else
                        {
                            $item->delete();
                            $item->forceDelete();
                            $data = 1 ;
                        }
                    }
                    else $errors = "Type de remarque inexistante";
                }
                else $errors = "Données manquantes";


                if ($errors)
                {
                    throw new \Exception($errors);
                }
                else
                {
                    $retour = array(
                        'data'          => $data,
                    );
                }

                return response()->json($retour);
            });
        }
        catch(\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }
}
