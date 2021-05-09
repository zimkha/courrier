<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\DeviseFinance;
use PDF;
use App\Chantier;
use App\User;
use App\Outil;
class DeviseFinanceController extends Controller
{
    
    public function save(Request $request)
    {
        return DB::transaction(function() use($request)
        {
            try {
                $errors = null;
                $item = new DeviseFinance();
                if(isset($request->id))
                {
                    $item = DeviseFinance::find($request->id);
                }
                if(empty($request->chantier))
                {
                    $errors = "Veuillez definir le chantier pour cette type d'opération";
                }
                if(isset($request->montant))
                {
                    $item->montant = $request->montant;
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
                             $old_devis = DeviseFinance::where('chantier_id', $request->chantier)->get();
                             if(count($old_devis) > 0)
                             {
                                 $errors = "Le chantier à déjà un devis finance à son compte";
                             }
                         }
                    }
                }
               
                if(empty($request->fichier))
                {
                    $errors = "Veuilles definir une piece jointe pour le devis finance";
                }
               
                if ($request->hasFile('fichier'))
                {
                   
                    $fichier = $_FILES['fichier']['name'];
                    $fichier_tmp = $_FILES['fichier']['tmp_name'];
                    $k = rand(100, 9999);
                    $ext = explode('.',$fichier);
                    $rename = config('view.uploads')['piecejointes']."/devis_finance_".$k.".".end($ext);
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
    public function getPdf($id) // C'est le pdf appel de fond
    {
        try {
            $errors = null;
             if(!isset($id))  $errors = "Impossible d'exécuter cette operation, données manquantes";
             else
             { 
                 $item = DeviseFinance::where('chantier_id', $id)->get()->first();
                 if(isset($item))
                 {
                    $array_appel = DeviseFinance::generate($item->id);
                    $chantier    = Chantier::find($id);
                    $array_date  = Chantier::genereta_date($chantier->id);
                    $pdf         = PDF::loadview('pdf.devise_finance', 
                                            [
                                                "item"       => $item,
                                                "tableau"    => $array_appel,
                                                "chantier"   => $chantier,
                                                "array_date" => $array_date
                                                
                                            ]);
                    return  $pdf->setPaper('orientation')->stream();
                 }
                 else $errors = "Le chantier n'a pas encore de devis finance";
                     
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
                    $item = DeviseFinance::find($id);
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
                 $item = DeviseFinance::find($id);
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
