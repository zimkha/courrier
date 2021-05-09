<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Payed;
use App\Chantier;
use App\DeviseFinance;
use Illuminate\Support\Facades\DB;
class PayedController extends Controller
{
    
    public function save(Request $request)
    {
        return DB::transaction(function() use($request)
        {
            try
            {
                $errors = null;
                $item = new Payed();
                if(isset($request->id))
                {
                    $item = Payed::find($request->id);
                }
                if(empty($request->chantier))  $errors = "Données manquantes, Veuillez contacter le service technique";

                if(empty($request->montant))  $errors = "Données manquantes, Veuillez preciser le montant";

               
                    $chantier = Chantier::find($request->chantier);
                    $devis = DeviseFinance::where('chantier_id', $request->chantier)->get()->first();
                 
                    if(isset($chantier) && isset($devis))
                    {
                       
                        $restant = Chantier::getRestant($request->chantier);
                        if(!empty($request->etape))
                        {
                            $deja = Chantier::dejaPyed($request->chantier, $request->etape);
                            if($deja == true) $errors = "L'etape {$request->etape} a été déjà payée";
                        }
                        if($request->montant > $restant)
                        {
                            $errors = "Le montant entré est supérieur au montant restant";
                        }
                        
                    }
                    if(!isset($errors))
                    {   
                        $item->chantier_id  = $request->chantier;
                        $item->montant      = $request->montant;
                        $item->etape        = $request->etape;
                        $item->save();
                        return array(
                            "data"  => $item,
                            "success" => true
                        );    
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

    public function delete($id)
    {
        return DB::transaction(function() use($id)
        {
            try
            {
                $errors = null;
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
