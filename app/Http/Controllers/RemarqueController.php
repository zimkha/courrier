<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Outil;
use App\Remarque;
use App\Projet;

class RemarqueController extends Controller
{
    protected $queryName = "remarques";
    public function save(Request $request)
    {
       try
       {
        return DB::transaction(function () use($request) {
           $errors = null;
           $item = new Remarque();
                  
           if(isset($request->id))
           {
               $item = Remarque::find($request->id);
           }
           if(empty($request->projet))
           {
               $errors = "Une remarque concerne un projet client";
           }

          
           if (empty($request->remarque_text)) {

            $errors = "Veuillez renseigner vos remarques";
           }
           $count = Projet::getNumberRemarque($request->projet);
           if($count == 3)
           {
               $errors = "Votre nombre maximum de remarques est atteint";
           }
           if (!isset($errors)) {
               $item->demande_text      = $request->remarque_text;
               $item->projet_id         = $request->projet;
               if (!isset($errors) && $request->hasFile('fichier') )
                    {

                         if ($item->fichier == null)
                         {

                            $fichier = $_FILES['fichier']['name'];
                            $fichier_tmp = $_FILES['fichier']['tmp_name'];
                            $k = rand(100, 9999);
                            $ext = explode('.',$fichier);
                            $rename = config('view.uploads')['remarques']."/remarques_".$k.".".end($ext);
                            move_uploaded_file($fichier_tmp,$rename);
                            //$path = $request->fichier->storeAs('uploads/plans', $rename);
                            $item->fichier = $rename;
                         }


                    }

               $item->save();
                return Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);
           }
           throw new \Exception($errors);

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
    public function delete($id)
    {
        try{
            return DB::transaction(function () use($id) {
                $errors = null;
                $data = 0;
                if (isset($id)) {
                    $item = Remarque::find($id);
                     if (isset($item)){
                         $item->delete();
                         $item->forceDelete();
                         $data = 1;
                     }
                     else
                        $errors = "Impossible de supprimer, la donnée est introuvable";
                }
                else
                    $errors = "Données manquante";
                    if (isset($errors))
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
        }catch(\Exception $e)
        {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));
        }
    }
}
