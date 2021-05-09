<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\PlanChantier;
use Illuminate\Support\Facades\DB;
use App\Chantier;
use App\Outil;
use Barryvdh\DomPDF\Facade as PDF;
class PlanChantierController extends Controller
{
    protected  $queryName = "planchantiers";
    public function save(Request $request)
    {
        
        return DB::transaction(function() use($request)
        {
            try
            {
                $errors = null;
                $item = new PlanChantier();
                if(empty($request->user))
                {
                    $errors = "Erreur Server: client introuvable";
                }
                if(empty($request->fichier))
                {
                    $errors = "Veuillez renseigner le fichier du plan (seule les PDFs sont accepte)";
                }
               
                    // Enregistrement des données provenat du client
                    $item->user_id = $request->user;
                    $fichier = $_FILES['fichier']['name'];
                    $fichier_tmp = $_FILES['fichier']['tmp_name'];
                    $ext = explode('.', $fichier);
    
                    if (end($ext) == "pdf" ) 
                    {
                            $count = count(PieceJointe::all());
                            $rename = config('view.uploads')['piecejointes'] . "/piecejointe_planchantier" . ($count + 1) . "." . end($ext);
                            move_uploaded_file($fichier_tmp, $rename);
                            $item->fichier = $rename;
                            $item->save(); 
                        return Outil::redirectgraphql($this->queryName, "id:{$item['id']}", Outils::$queries[$this->queryName]);
                    }
                    else
                    {
                       $errors = "Ce type de fichier n'est pas pris en charge.";
                    }
                    throw new \Exceprion($erros);
            }
            catch(\Exception $e)
            {
                return response()->json( array('errors' => [$e->getMessage()]) );
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
                $item = PlanChantier::find($id);
                if(!isset($item))
                {
                    $errors ="Plan Chantier introuvable";
                }
                else
                    {
                       Chantier::where('plan_chantier', $item->id)->delete();
                       $item->delete();
                       $data = 1;
                       $retour = array(
                        'data'          => $data,
                    );
                    return response()->json($retour);
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
}
