<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PDF;
use App\Outil;
use App\Courrier;
use App\Service;

class CourrierController extends Controller
{
    protected $queryName = "courriers";

    public function save(Request $request) {
        return DB::transaction(function() use($request) {
          try {
           // dd($request->all());
              $tab = [];
              $errors = null;
              $item  = new Courrier();
              if(isset($request->id)) {
                $item = Courrier::find($request->id);
                Service::where('courrier_id', $request->id)->delete();
                Service::where('courrier_id', $request->id)->forceDelete();
              }
              if(empty($request->reference)) {
                $errors = "Veuillez renseigner la référence";
              }
              if(empty($request->date_courrier)) {
                $errors = "Veuillez renseigner la date du courrier";
              }
              if(empty($request->date_arrive)) {
                $errors = "Veuillez renseigner la date d'arrivée";
              }
              if(empty($request->expediteur)) {
                $errors = "Veuillez renseigner l'éxpéditeur";
              }
              if(empty($request->numero)) {
                $errors = "Veuillez renseigner le numéro du courrier";
              }
             
              if(!$errors) {
                $item->reference = $request->reference;
                $item->date_courrier = $request->date_courrier." 00:00:00";
                $item->numero = $request->numero;
                $item->objet = $request->objet;
                $item->date_arrive = $request->date_arrive." 00:00:00";
                $item->autre_instruction = $request->autre_instruction;
               
                $item->expediteur = $request->expediteur;
                
                 $services = json_decode($request->services);
                // dd($services);
                foreach($services as $service) {
                 
                  $item_service = new Service();
                  $item_service->service_gauche_id  =  $service->service_gauche ? (int) $service->service_gauche : null;
                
                  $item_service->service = $service->service;
                  $item_service->service_droite_id =  $service->service_droite ? (int) $service->service_droite : null;
                 
                 array_push($tab, $item_service);
                }
              
                $item->save();
                foreach($tab as $el) {

                  $el->courrier_id = $item->id;
                  $el->save();
                }
                return  Outil::redirectgraphql($this->queryName, "numero:{$item->id}", Outil::$queries[$this->queryName]);
            
              }
              throw new \Exception($errors);
              
          } 
          catch (\Exception $e) {
                return response()->json(array(
                  'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                  'errors_debug'    => [$e->getMessage()],
              ));
          }
        });
    }

    public function delete($id) {
      return DB::transaction(function() use($id) {
        try {
          $errors = null;
           if(isset($id)) {
             $item = Courrier::find($id);
             if($item->id) {
              Service::where('courrier_id', $item->id)->delete();
              Service::where('courrier_id', $item->id)->forceDelete();
              $item->delete();
              $retour = array(
                'data'          => 1,
                );
            return response()->json($retour);
             }
             $errors = "item is not found in this database";
           }
           $errors = "Unexpected Id for the request";
           if($errors) {
            throw new \Exception($errors);
 
           }
        } catch (\Exception $e) {
          return response()->json(array(
            'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
            'errors_debug'    => [$e->getMessage()],
        ));
        }
      });
    }
    public function pdf($id) {
      try {
           $item = Courrier::find($id);
           if(isset($item->id)) {
             //dd($item);
            $services = Service::with('courrier', 'service_gauche', 'service_droite');
            $services = $services->where('courrier_id', $item->id);
            $services = $services->get();

            
            $pdf        = PDF::loadView('pdf.courrier',
            [
              'courrier'  => $item,
              'services' => $services,
            ]
          );
              return  $pdf->setPaper('orientation')->stream();
           }
           throw new \Exception("Error Processing Request");
           
       
      } catch (\Exception $e) {
        return response()->json(array(
          'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
          'errors_debug'    => [$e->getMessage()],
      ));
      }
    }
}
