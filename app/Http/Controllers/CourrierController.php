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
             //dd($request->all());
              $tab = [];
              $errors = null;
              $item  = new Courrier();
              if(isset($request->id)) {
                $item = Courrier::find((int) $request->id);
                Service::where('courrier_id', $request->id)->delete();
                Service::where('courrier_id', $request->id)->forceDelete();
              }

              //dd($item);
              
              $services = json_decode($request->services);
              if($services == [] || sizeof($services) == 0 ) 
              {
               $errors = "Le tableau de courrier ne doit pas être vide";
              }
              if(isset($request->date_courrier) && $request->date_courrier == "NaN-NaN-NaN" )
              {
                $errors = "Veuillez renseigne la date du courrier SVP";
              }
              if(isset($request->date_arrive) && $request->date_arrive == "NaN-NaN-NaN" )
              {
                $errors = "Veuillez renseigne la date d'arrivée du courrier SVP";
              }
              if(!$errors) {
                // $item->date_courrier = (isset($request->date_courrier )&& $request->date_courrier != "Nan Nan Nan") ? $request->date_courrier." 00:00:00": null;
                // $item->date_arrive = (isset($request->date_arrive) && $request->date_arrive != "Nan Nan Nan" ) ? $request->date_arrive." 00:00:00": '';
                if(isset($request->date_courrier) && $request->date_courrier!= "NaN-NaN-NaN" )
                    $item->date_courrier = $request->date_courrier;
                if(isset( $request->date_arrive) && $request->date_arrive!= "NaN-NaN-NaN")    
                   $item->date_arrive  =  $request->date_arrive; 
                $item->expediteur = (isset($request->expediteur)) ? $request->expediteur : null;
                $item->numero = (isset($request->numero)) ? $request->numero: null;
                $item->reference = (isset($request->reference)) ? $request->reference: null;
                $item->objet = (isset($request->objet)) ? $request->objet: null;
                $item->autre_instruction = (isset($request->autre_instruction)) ? $request->autre_instruction: null;
                //dd($item);
             
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
                return  Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);            
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

    public function changeStatusCourrier(Request $request) {
      try {
        //code...
        //dd($request->all());
        $errors = null;
        if(empty($request->id)) {
          $errors = "Une erreur est survenu l'or de l'envoi des données";
        }
        $item = Courrier::find($request->id);
        if(!isset($item)) $errors = "Impossible de touver cette courrier veuillez rafraichire la page SVP!";
        if(!$errors) {
            if($item->status == 0) {
              $item->status = 1;
            }
            elseif($item->status == 1) $item->status = 2;
            $item->save();
            return  Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);            

        }
        throw new \Exception($errors);

      } catch (\Exception $e) {
        return response()->json(array(
          'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
          'errors_debug'    => [$e->getMessage()],
      ));
      }
    }
}
