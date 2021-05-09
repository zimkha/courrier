<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Outil;
use App\Chantier;
use Illuminate\Support\Facades\DB;
use PDF;
use App\ContratExecution;
class ChantierController extends Controller
{
    protected  $queryName = "chantiers";

    public function save(Request $request)
    {
        
        return DB::transaction(function() use($request)
        {
            try {
                $errors = null;
                $item = new Chantier();
                 if(isset($request->id))
                 {
                     $item = Chantier::find($request->id);
                 }
                if(empty($request->user))
                {
                    $errors = "Erreur Server: client introuvable";
                }
                if(empty($request->fichier))
                {
                    $errors = "Veuillez renseigner le fichier du plan (seule les PDFs sont accepte)";
                }
               
                if (!isset($errors) && $request->hasFile('fichier'))
                {
                    
                    $item->user_id = $request->user;
                    $fichier = $_FILES['fichier']['name'];
                    $fichier_tmp = $_FILES['fichier']['tmp_name'];
                    $ext = explode('.', $fichier);
    
                    if (end($ext) == "pdf" ) 
                    {
                            $count = count(Chantier::all());
                            $rename = config('view.uploads')['piecejointes'] . "/piecejointe_chantier" . ($count + 1) . "." . end($ext);
                            move_uploaded_file($fichier_tmp, $rename);
                            $item->fichier = $rename;
                            $item->save(); 
                            // return response()->json(array(
                            //     "data"  => 1
                            // ));

                         return response()->json($item);
                    }
                    else
                    {
                       $errors = "Ce type de fichier n'est pas pris en charge.";
                    }
                    throw new \Exceprion($erros);
                }
                    throw new \Exceprion($erros);
            } catch (\Exception $e) 
            {
                return response()->json(array(
                    'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                    'errors_debug'    => [$e->getMessage()],
                ));
            }
        });
    }

    public function delete($id)
    {
        return DB::transaction(function() use($id)
        {
            try
            {
            $errors = null;
            $data = 0;
            if(!isset($id))
            {
              $errors = "Impossible de faire cette opération des données sont manquantes";
            }
            else{
                $item = Chantier::find($id);
                if(!isset($item))
                {
                    $errors ="Plan Chantier introuvable";
                }
                else
                    {
                       $result_check = Chantier::checkifExist($item->id);
                       if($result_check == false)
                       {
                          
                       $item->delete();
                       $data = 1;
                       $retour = array(
                        'data'          => $data,
                    );
                        return response()->json($retour);
                       } 
                       else   $errors ="Impossible de supprimer cette chantier car déjà liée ";
                     
                    }
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
  
    public function enableChantier($id)
    {
        
        return DB::transaction(function() use($id){
            try
            {
               $errors = null;
               $data = 0;
               if(isset($id))
               {
                 $item = Chantier::find($id);
                 if(isset($item))
                 {
                    $item->etat = 1;
                    $item->save();
                    $data = 1;
                    $retour = array(
                        "data" => $data
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

    public function makeDate(Request $request)
    {
        return DB::transaction(function() use($request){
            try
            {
               
                $errors = null;
                if(empty($request->id))  $errors = "Données manquantes";
            
                if(empty($request->date)) $errors = "Veuillez definir une date pour cette Opération";

                if(empty($errors))
                {
                    $item = Chantier::find($request->id);
                    if(!isset($item)) $errors = "Impossible de faire cette operation, données introuvable";
                    else
                    {
                        $item->date_begin = $request->date;
                        // dd($item);
                        $item->save();
                        return $retour = array(
                            "data" => 1,
                            "success" => true
                        );
                    }
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

     public function getContrat($id)
    {
        try
        {
            $errors = null;
            $item = ContratExecution::where('etat', true)->where('chantier_id', $id)->get()->first();
            if(isset($item))
            {
                $chantier = Chantier::find($id);
                $client   = $chantier->user();
                $pdf = PDF::loadview('pdf.contratExeSigner', ['item' => $item, 'chantier' => $chantier, 'client' => $client]);

            }
            else
            {
                $errors = "Impossible d'avoir un contrat pour ces données";
            }
        }
        catch(\Exception $e)
        {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));  
        }   
    }
    
}
