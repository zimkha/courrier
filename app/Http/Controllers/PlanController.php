<?php

namespace App\Http\Controllers;

use App\NiveauPlan;
use App\Outil;
use App\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\PlanProjet;
use App\Joined;
class PlanController extends Controller
{
    protected $queryName = "plans";
    public function test()
    {
        $attribut = "salon";
        $nb = Plan::getNbAttribut($attribut);
        return $nb;
    }
    public function active_plan($id)
    {
        try
        {
            $data = 0;
            $errors = null;
            if(isset($id))
            {
                $item = Joined::find($id);
                if(isset($item))
                {
                    $item->active = 1;
                    $item->save;
                    $data = 1;
                }
                else
                {
                    $errors = "Impossible de trouver les données";
                }
            }
            else
            {
                $errors = "Impossible d'effectuer cette opération, données manquantes";
            }
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
        }
        catch(\Exception $e)
        {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));
        }
    }


    public function joined(Request $request)
    {
      try
      {
          return DB::transaction(function() use($request)
          {
              $errors = null;
              $item = new Joined();
              if(isset($request->id))
              {
                  $item = Joined::find($request->id);
              }
             if(empty($request->plan))
             {
                 $errors = "Veuillez contacter le service technique";
             }
             if(empty($request->fichier))
             {
                 $errors = "Veuillez choisir un fichier a joindre au plan";
             }
             if(empty($errors) && $request->hasfile('fichier'))
             {
                 $tab = json_decode($request->plan);

                 $item->plan_id         = (int)$tab;
                 $fichier               = $_FILES['fichier']['name'];
                 $fichier_tmp           = $_FILES['fichier']['tmp_name'];
                 $k                     = rand(1, 9999);
                 $ext                   = explode('.',$fichier);
                 $rename                = config('view.uploads')['fichierplans']."/fichier_plans_".$k.".".end($ext);
                 move_uploaded_file($fichier_tmp,$rename);
                 $item->fichier = $rename;
                 if(isset($request->description))
                 {
                     $item->description = $request->description;
                 }

                 $item->save();
                 return Outil::redirectgraphql($this->queryName, "id:{$item->plan_id}", Outil::$queries[$this->queryName]);

             }
             throw new \Exception($errors);
          });
      }
      catch(\Exception $e)
      {
        return Outil::getResponseError($e);
      }
    }
    public function cloner(Request $request)
    {
        try {
            return DB::transaction(function () use($request) {
                 $errors = null;
                 $item = new Plan();
                 $code = Plan::makeCode();

                 $item->code = $code;
                 if (empty($request->superficie)) {
                    $errors = "Veuillez preciser la superficie pour ce plan";
                 }
                 if (empty($request->longeur)) {
                     # code...
                     $errors = "Veuillez preciser la longeur";

                 }
                 if (empty($request->largeur)) {
                     # code...
                     $errors = "Veuillez preciser la largeur";
                 }
                 if (empty($request->tab_plan)) {
                    $errors = "Veuillez preciser au moins le RDC pour ce plan";
                 }
                 if (empty($request->unite_mesure)) {
                     $errors = "Veuillez preciser l'unité de mesur du terrain";

                 }
                 if (isset($request->superficie) && isset($request->longeur) && isset($request->largeur))
                  {
                     $sup = $request->longeur  * $request->largeur;
                     if ( $sup != $request->superficie) {
                         $errors = "Veuillez preciser des valeurs correctes au niveau des longeurs et largeurs";
                     }
                  }
                  if (isset($request->superficie) && $request->superficie <= 0) {
                     $errors = "Veuillez preciser une bonne valeur pour la superficie";

                  }
                  if (isset($request->longeur) && $request->longeur <= 0) {
                     $errors = "Veuillez preciser une bonne valeur pour la longeur";

                  }
                  if (empty($request->fichier)) {
                     $errors = "Un fichier du plan est manquant";
                  }
                  if (isset($request->largeur) && $request->largeur <= 0) {
                     $errors = "Veuillez preciser une bonne valeur pour la largeur";

                  }
                 if (isset($errors))
                 {
                     throw new \Exception($errors);
                 }

                
                 $data       = json_decode($request->tab_plan, true);
                 $tableau    = array();
                 $n = 0;
                 foreach ($data as $datum) {
                     $n = $n + 1;
                     $niveau = new NiveauPlan();

                    //  if (empty($datum['piece']))
                    //  {
                    //      $errors = "Veuillez renseigner au moins le nombre de pièces pour ce niveau";
                    //  }
                    //  if (isset($datum['piece']) && $datum['piece'] <= 0) {
                    //      $errors = "Veuillez verifier le nombre de pieces  à la ligne n°".$n;
                    //  }
                     if (isset($datum['chambre']) && $datum['chambre'] < 0) {
                         $errors = "Veuillez verifier le nombre de chambre à la ligne n°".$n;
                     }
                     if (isset($datum['salon']) && $datum['salon'] < 0) {
                         $errors = "Veuillez verifier le nombre de salon  à la ligne n°".$n;
                     }
                     if (isset($datum['bureau']) && $datum['bureau'] < 0) {
                         $errors = "Veuillez verifier le nombre de bureau  à la ligne n°".$n;
                     }
                     if (isset($datum['toillette']) && $datum['toillette'] < 0) {
                         $errors = "Veuillez verifier le nombre de toillettes  à la ligne n°".$n;
                     }
                    //  $niveau->piece          = $datum['piece'];
                     $niveau->chambre        = $datum['chambre'];
                     $niveau->salon          = $datum['salon'];
                     $niveau->cuisine        = $datum['cuisine'];
                     $niveau->bureau         = $datum['bureau'];
                     $niveau->toillette      = $datum['toillette'];
                     $niveau->niveau         = $datum['niveau'];
                    
                    //  $total_pieces = $niveau->chambre + $niveau->salon + $niveau->cuisine + $niveau->bureau + $niveau->toillette + $niveau->sdb;
                  
                    //  if ($total_pieces != (int) $datum['piece']) {
                    //      $errors = "Veuillez verifier si le total des pieces est repecter  à la ligne n°".$n;
                    //  }
                     if (isset($errors)) {
                         throw new \Exception($errors);
                     }
                     array_push($tableau, $niveau);
                 }
                 if (!isset($errors)) {
                     $item->superficie       = $request->superficie;
                     $item->longeur          = $request->longeur;
                     $item->largeur          = $request->largeur;
                     $item->unite_mesure_id  = $request->unite_mesure;
                    
                     //dd($request->file('fichier'));
                     if (!isset($errors) && $request->hasFile('fichier') )
                     {
                          if ($item->fichier == null)
                          {
                             $fichier = $_FILES['fichier']['name'];
                             $fichier_tmp = $_FILES['fichier']['tmp_name'];
                             $k = rand(100, 9999);
                             $ext = explode('.',$fichier);
                             $rename = config('view.uploads')['plans']."/plans_".$k.".".end($ext);
                             move_uploaded_file($fichier_tmp,$rename);
                             //$path = $request->fichier->storeAs('uploads/plans', $rename);
                             $item->fichier = $rename;
                          }


                     }
                     if (!isset($request->piscine)) {
                         $item->piscine = 0;
                     }
                     else
                     {
                         $item->piscine= 1;
                     }
                     $item->save();
                     foreach($tableau as $var)
                     {
                         $var->plan_id = $item->id;
                         $var->save();
                     }
                     if (isset($request->projet)) {
                         $plan_projet              = new PlanProjet();
                         $plan_projet->plan_id     = $item->id;
                         $plan_projet->projet_id   = $request->id;
                         $plan_projet->etat_active = false;
                         $plan_projet->etat        = 0;
                         $plan_projet->save();
                     }
                     return Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);

                 }
                 throw new \Exception($errors);

            });
         } catch (\Exception $e) {
             return Outil::getResponseError($e);

         }
    }
    public function save(Request $request)
    {
       // dd($request->all());
        try {
           return DB::transaction(function () use($request) {
                $errors = null;
                $item = new Plan();
                $code = Plan::makeCode();
                if (isset($request->id)) {
                    $item = Plan::find($request->id);
                    $code = $item->code;
                    NiveauPlan::where('plan_id', $request->id)->delete();
                    NiveauPlan::where('plan_id', $request->id)->forceDelete();
                }

                $item->code = $code;
                if (empty($request->superficie)) {
                   $errors = "Veuillez preciser la superficie pour ce plan";
                }
                if (empty($request->longeur)) {
                    # code...
                    $errors = "Veuillez preciser la longeur";

                }
                if (empty($request->largeur)) {
                    # code...
                    $errors = "Veuillez preciser la largeur";
                }
                if (empty($request->tab_plan)) {
                   $errors = "Veuillez preciser au moins le RDC pour ce plan";
                }
                if (empty($request->unite_mesure)) {
                    $errors = "Veuillez preciser l'unité de mesur du terrain";

                }
                if (isset($request->superficie) && isset($request->longeur) && isset($request->largeur))
                 {
                    $sup = $request->longeur  * $request->largeur;
                    if ( $sup != $request->superficie) {
                        $errors = "Veuillez preciser des valeurs correctes au niveau des longeurs et largeurs";
                    }
                 }
                 if (isset($request->superficie) && $request->superficie <= 0) {
                    $errors = "Veuillez preciser une bonne valeur pour la superficie";

                 }
                 if (isset($request->longeur) && $request->longeur <= 0) {
                    $errors = "Veuillez preciser une bonne valeur pour la longeur";

                 }
                 if (empty($request->fichier)) {
                    $errors = "Un fichier du plan est manquant";
                 }
                 if (isset($request->largeur) && $request->largeur <= 0) {
                    $errors = "Veuillez preciser une bonne valeur pour la largeur";

                 }
                 if(isset( $request->residence_location))
                 {
                    $item->residence_location = 1;
                 }
                 else{
                    $item->residence_location = 0;

                 }
                 if(isset( $request->residence_personnel))
                 {
                    $item->residence_personnel = 1;
  
                 }
                 else{
                    $item->residence_personnel = 0;
  
                 }
                 if(isset( $request->zone_assainie))
                 {
                    $item->zone_assainie = 1;
 
                 }
                 else{
                    $item->zone_assainie = 0;

                 }
                 if(isset( $request->zone_electrifie))
                 {
                    $item->zone_electrifie = 1;
                 }
                 else{
                    $item->zone_electrifie = 0;
                     
                 }
                 
                if (isset($errors))
                {
                    throw new \Exception($errors);
                }

                $data       = json_decode($request->tab_plan, true);
                //$data = $request->tab_plan;
                $tableau    = array();
                $n = 0;
                foreach ($data as $datum) {
                    $n = $n + 1;
                    $niveau = new NiveauPlan();

                   
                    if (isset($datum['chambre']) && $datum['chambre'] < 0) {
                        $errors = "Veuillez verifier le nombre de chambre à la ligne n°".$n;
                    }
                    if (isset($datum['salon']) && $datum['salon'] < 0) {
                        $errors = "Veuillez verifier le nombre de salon  à la ligne n°".$n;
                    }
                    if (isset($datum['bureau']) && $datum['bureau'] < 0) {
                        $errors = "Veuillez verifier le nombre de bureau  à la ligne n°".$n;
                    }
                    if (isset($datum['toillette']) && $datum['toillette'] < 0) {
                        $errors = "Veuillez verifier le nombre de toillettes  à la ligne n°".$n;
                    }
                  
                    // $niveau->piece          = $datum['piece'];
                    $niveau->chambre        = $datum['chambre'];
                    $niveau->salon          = $datum['salon'];
                    $niveau->cuisine        = $datum['cuisine'];
                    $niveau->bureau         = $datum['bureau'];
                    $niveau->toillette      = $datum['toillette'];
                    $niveau->niveau         = $datum['niveau'];
                    $niveau->sdb            = $datum['sdb'];
                    $niveau->niveau         = "R +".$n;

                  
                    if (isset($errors)) {
                        throw new \Exception($errors);
                    }
                    array_push($tableau, $niveau);
                }
                if (!isset($errors)) {
                    $item->superficie       = $request->superficie;
                    $item->longeur          = $request->longeur;
                    $item->largeur          = $request->largeur;
                    $item->unite_mesure_id  = $request->unite_mesure;
                    $item->garage           = $request->garage;

                    //dd($request->file('fichier'));
                    if (!isset($errors) && $request->hasFile('fichier') )
                    {
                         if ($item->fichier == null)
                         {
                            $fichier = $_FILES['fichier']['name'];
                            $fichier_tmp = $_FILES['fichier']['tmp_name'];
                            $k = rand(100, 9999);
                            $ext = explode('.',$fichier);
                            $rename = config('view.uploads')['plans']."/plans_".$k.".".end($ext);
                            move_uploaded_file($fichier_tmp,$rename);
                            //$path = $request->fichier->storeAs('uploads/plans', $rename);
                            $item->fichier = $rename;
                         }


                    }
                    // dd($item);
                    if (!isset($request->piscine)) {
                        $item->piscine = 0;
                    }
                    else
                    {
                        $item->piscine= 1;
                    }
                    $item->save();
                    foreach($tableau as $var)
                    {
                        $var->plan_id = $item->id;
                        $var->save();
                    }
                    if (isset($request->projet)) {
                        $plan_projet              = new PlanProjet();
                        $plan_projet->plan_id     = $item->id;
                        $plan_projet->projet_id   = $request->id;
                        $plan_projet->etat_active = false;
                        $plan_projet->etat        = 0;
                        $plan_projet->save();
                    }
                    return Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);

                }
                throw new \Exception($errors);

           });
        } catch (\Exception $e) {
            return Outil::getResponseError($e);

        }
    }
    public function delete($id)
    {
        try
        {
            return DB::transaction(function () use($id) {
                $errors = null;
                $data   = 0;
                $item   = Plan::find($id);
                if (isset($item)) {
                     $items = PlanProjet::where('plan_id', $id)->get();
                     if (count($items) > 0) {
                         $errors = "Impossible de supprimer un plan lié à des projets";
                     }
                     else
                       {
                           NiveauPlan::where('plan_id', $id)->delete();
                           NiveauPlan::where('plan_id', $id)->forceDelete();
                           $item->delete();
                           $item->forceDelete();
                           $data = 1;
                       }
                } else
                    $errors = "Impossible de supprimer le plan, donnée introuvable";
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
