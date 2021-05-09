<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ContratExecution;
use App\Outil;
use Illuminate\Support\Facades\DB;
use App\Chantier;
use App\User;
use PDF;
class ContratExecutionController extends Controller
{
    protected  $queryName = "contratexecutions";

    /**
     * 
     * @var $request | Illuminate\Http\Request
     * 
     * @return {} 
     */
    public function save(Request $request)
    {
        return DB::transaction(function() use($request)
        {
            try {
                $errors = null;
                $item = new ContratExecution();
                if(isset($request->id))
                {
                    $item = ContratExecution::find($request->id);
                }
                if(empty($request->chantier))
                {
                    $errors = "Veuillez definir le chantier pour cette type d'opération";
                }
                if(empty($request->fichier))
                {
                    $errors = "Veuilles definir une piece jointe pour le contrat d'exécution";
                }
                else
                {
                    $chantier = Chantier::find($request->chantier);
                    if(!isset($chantier))
                    {
                        $errors = "Un chantier avec cette ID {$request->chantier} n'existe pas dans la base";
                    }
                    else
                    {
                         if(empty($request->id))
                         {
                             $old_devis = ContratExecution::where('chantier_id', $request->chantier)->get();
                             if(count($old_devis) > 0)
                             {
                                 $errors = "Le chantier à déjà un contrat d'exécution à son compte";
                             }
                         }
                    }
                }
                if ($request->hasFile('fichier'))
                {
                    $fichier = $_FILES['fichier']['name'];
                   
                    $fichier_tmp = $_FILES['fichier']['tmp_name'];
                    $k = rand(100, 9999);
                    $ext = explode('.',$fichier);
                    $rename = config('view.uploads')['piecejointes']."/contratexecute_".$k.".".end($ext);
                    move_uploaded_file($fichier_tmp,$rename);
                    $item->fichier = $rename;
                }
                else
                   {
                     $errors = "Piece jointe manquante ou le fichier ne peut pas être envoyer au niveau du server ";
                   }
                   if(!isset($errors))
                   {
                       $item->chantier_id = $request->chantier;
                       $item->save();
                       return 1;
                   }

                   throw new \Exceprion($erros);
            } catch (\Exception $e) {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }
    public function getPdf($id)
    {
        try {
            $errors = null;
             if(!isset($id))
             {
                $errors = "Impossible d'exécuter cette operation, données manquantes";
             }
             else
             { 
                 $item = ContratExecution::where('chantier_id', $id)->get();
                 if(isset($item))
                 {
                    $pdf = PDF::loadview('pdf.contrat_execution', ['item' => $item]);
                    return  $pdf->setPaper('orientation')->stream();
                 }
                 else {
                     $errors = "Le chantier n'a pas encore de devis finance";
                 }
             }
             throw new \Exception($errors);
        } catch (\Exception $e) {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));
        }
    }

    public function delete($id)
    {
        return DB::transaction(function() use($id)
        {
            try {
                $errors = null;
                $data = 0;
                if(isset($id))
                {
                    $item = ContratExecution::find($id);
               if(isset($item))
               {
                  $item->delete();
                  $item->forceDelete();
                  $data = 1;
                  $retour = array(
                    'data'          => $data,
                    "success"        => "success"
                );
                    return response()->json($retour);
               } 
               else
               { 
                   $errors = "Données introuvable";
               }
                }
                else
                {
                     $errors ="Données manquantes";
                }
               throw new \Exception($errors);
            } catch (\Exception $th) {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }

    public function enable($id)
    {
        return DB::transaction(function() use($id)
        {
            try {
                $errors = null;
                $data = 0;
                if(isset($id))
                {
                    $item = ContratExecution::find($id);
               if(isset($item))
               {
                  $item->etat = 1;
                  $data = 1;
                  $retour = array(
                    'data'          => $data,
                    "success"        => "success"
                );
                    return response()->json($retour);
               } 
               else
               { 
                   $errors = "Données introuvable";
               }
                }
                else
                {
                     $errors ="Données manquantes";
                }
               throw new \Exception($errors);
            } catch (\Exception $th) {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }

    public function invalidevalidation($id)
    {
        return DB::transaction(function() use($id)
        {
            try {
                $errors = null;
                $data = 0;
                if(isset($id))
                {
                    $item = Chantier::find($id);
               if(isset($item))
               {
                  $item->etat = 2;
                  $data = 1;
                  $retour = array(
                    'data'          => $data,
                );
                    return response()->json($retour);
               } 
               else
               { 
                   $errors = "Données introuvable";
               }
                }
                else
                {
                     $errors ="Données manquantes";
                }
               throw new \Exception($errors);
            } catch (\Exception $th) {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }

    public function payed($id)
    {
        return DB::transaction(function() use($id){
            try{
                $errors = null;
                $data = 0;
                if(isset($id))
                {
                    $item  = ContratExecution::find($id);
                    if(isset($item))
                    {
                        if($item->etat != 1)
                        {
                            throw new \Exception("Le contrat d'exécution doit être validé avant d'être payé");
                        }
                        $item->payed = 1;
                        $item->save();
                        $data = 1;
                        $retour = array(
                            "data"  => $data,
                            "success"   => "success"
                        );
                    }
                    else
                     $errors = "Impossible de faire cette opération, donées introuvable";
                }
                else
                {
                    $errors = "Impossible de faire cette opération, Données manquantes";
                }
                throw new \Exception($errors);
            }
            catch(\Exception $e)
            {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));  
            }
        });
    }

      
}
