<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\DeviseEstime;
use PDF;
use App\Outil;
use App\User;
use App\Chantier;
class DeviseEstimeController extends Controller
{
    
    public function save(Request $request)
    {
        return DB::transaction(function() use($request)
        {
            try {
                $errors = null;
                $item = new DeviseEstime();
                if(isset($request->id))
                {
                    $item = DeviseEstime::find($request->id);
                }
                if(empty($request->chantier))
                {
                    $errors = "Veuillez definir le chantier pour cette type d'opération";
                }
                else
                {
                    $chantier = \App\Chantier::find($request->chantier);
                    if(!isset($chantier))
                    {
                        $errors = "Un chantier avec cette ID {$request->chantier} n'existe pas dans la base";
                    }
                    else
                    {
                         if(empty($request->id))
                         {
                             $old_devis = DeviseEstime::where('chantier_id', $request->chantier)->get();
                             if(count($old_devis) > 0)
                             {
                                 $errors = "Le chantier à déjà un devis estimé à son compte";
                             }
                         }
                    }
                }
               
                if(empty($request->fichier))
                {
                    $errors = "Veuilles definir une piece jointe pour le devis estimé";
                }
                if(empty($request->montant))
                {
                    $errors = "Veuilles définir le montant approximative de cette dévis estimé";
                }
                if ($request->hasFile('fichier'))
                {
                   
                    $fichier = $_FILES['fichier']['name'];
                    $fichier_tmp = $_FILES['fichier']['tmp_name'];
                    $k = rand(100, 9999);
                    $ext = explode('.',$fichier);
                    $rename = config('view.uploads')['piecejointes']."/devis_estime_".$k.".".end($ext);
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
                       $item->montant     = $request->montant;
                       $item->save();
                       return 1;
                   }

                   throw new \Exception($errors);
            } catch (\Exception $e) {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }

    /**
     * @var $id | int
     */
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
                 $item = DeviseEstime::where('chantier_id', $id)->get();
                
                 if(isset($item))
                 {
                    $chantier = Chantier::find($id);
                    $client = User::find($chantier->user_id);
                    $pdf = PDF::loadview('pdf.devise_estime', ['item' => $item, 'chantier' => $chantier, 'client' => $client]);
                    return  $pdf->setPaper('orientation')->stream();
                 }
                 else {
                     $errors = "Le chantier n'a pas encore de devise etimé";
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

    /**
     * @var $id | int
     */
    public function delete($id)
    {
        return DB::transaction(function() use($id)
        {
            try {
                $errors = null;
                $data   = 0;
                if(isset($id))
                {
                    $item = DeviseEstime::find($id);
                    if(isset($item))
                    {
                      $item->delete();
                      $data = 1;
                      $retour = array(
                          'data' => $data,
                      );
                      return response()->json($retour);
                    }
                    else{
                        $errors = "Données introuvable";
                    }
                }
                else{
                    $errors = "Données manquantes";
                }
                throw new \Exception($errors);
            } catch (\Exception $e) {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }

    public function enable($id)
    {
        return DB::transaction(function() use($id){
            try
            {
               $errors = null;
               $data = 0;
               if(isset($id))
               {
                 $item = DeviseEstime::find($id);
                 if(isset($item))
                 {
                    $item->etat = true;
                    $item->save();
                    $data = 1;
                    $retour = array(
                        "data" => $data,
                        "success"  => "success"
                    );
                    return response()->json($retour);
                 }
                 else
                 {
                     $errors = "Impossible de faire cette opération, données introuvable.";
                 }
               }
               else
               {
                   $errors = "Impossible de faire cette opération données manquantes.";
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
