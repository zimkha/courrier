<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\DeviseFinance;
use App\DeviseEstime;
use App\ContratExecution;
use App\Payed;
use App\PlanningPrevisionnel;
use App\PlanningFond;
use Illuminate\Support\Facades\DB;
class Chantier extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contrat_execution()
    {
        return $this->hasMany(ContraExecution::class);
    }

    public function devise_estime()
    {
        return $this->hasMany(DeviseEstime::class);
    }

    public function devise_finance()
    {
        return $this->hasMany(DeviseFinance::class);
    }

    public function payed()
    {
        return $this->hasMany(Payed::class);
    }

    public function planning_fond()
    {
        return $this->hasMany(PlanningFond::class);
    }

    public function planning_previsionnel()
    {
        return $this->hasMany(PlanningPrevisionnel::class);
    }

    public static function checkifExist($id)
    {
        $item = Chantier::find($id);
        $exist = false;
        if(isset($item))
        {
           $devise_f = DeviseFinance::where('chantier_id', $item->id)->get();
           $devise_e = DeviseEstime::where('chantier_id', $item->id)->get();
           $payed    = Payed::where('chantier_id', $item->id)->get();
           $plan_f   = PlanningFond::where('chantier_id', $item->id)->get();
           $plan_p   = PlanningPrevisionnel::where('chantier_id', $item->id)->get();
           $contrat  = ContratExecution::where('chantier_id', $item->id)->get();
           
           $array = [
               $devise_e,
               $devise_f,
               $payed,
               $plan_f,
               $plan_p,
               $contrat,
           ];
          
           foreach($array as $items)
           {
               if(count($items) > 0 )
               {
                   $exist = true;
               }
           }
          
           return $exist;
        }
        return null;
    }
    public  static function CheckExist($id,$model)
    {

        if(isset($id))
        {
            $exist   = false;
            $item    = app($model)->where('chantier_id', $id)->get();
            if(count($item) > 0)
            {
                $exist = true;
            }  
            return $exist;
        }
        return null;
    }
    public static  function genereta_date($id)
    {
        $item = Chantier::find($id);
        if(!isset($item)) return null;

        else if(isset($item->date_begin))
         {
             $date_begin = $item->date_begin;
            return  $array_apple = [
                 "reservation"  => $date_begin,
                 "fondation"    => date('Y-m-d', strtotime($date_begin . " +1 month")),
                 "elevation"    => date('Y-m-d', strtotime($date_begin . " +3 month")),
                 "coulage"      => date('Y-m-d', strtotime($date_begin . " +4 month")),
                 "menuisier"     => date('Y-m-d', strtotime($date_begin . " +5 month")),
                 "finition"     => date('Y-m-d', strtotime($date_begin . " +6 month")),
                 "reception"    => date('Y-m-d', strtotime($date_begin . " +7 month")),
            ];
         }
         return null;
    }
    public static function getPourcentage($id)
    {
       $item = Chantier::find($id);

       if(isset($item))
       {
         $devis_finance = \App\DeviseFinance::where('chantier_id', $id)->get()->first();
         if(isset($devis_finance))
         {
             $payed = DB::select(DB::raw("
               select sum(p.montant) somme from payeds p where p.chantier_id = '$id'
            "));
            $montant_paye = 0;
            if($payed[0]->somme != null)
             $montant_paye = $payed[0]->somme; 
            
             $restant = $devis_finance->montant - $montant_paye;

           return  $array_paye = [
                 "paye"           => $montant_paye,
                 "restant"        => $restant, 
                 "pourcent_paye"  => ($montant_paye * 100) / $devis_finance->montant,
                 "pourcent_rest"  => ($restant * 100) / $devis_finance->montant
             ];
         }
       }
       return null;
    } 
    public static  function getRestant($id)
    {
        $devis_finance = \App\DeviseFinance::where('chantier_id', $id)->get()->first();
        $payed = DB::select(DB::raw("
        select sum(p.montant) somme from payeds p where p.chantier_id = '$id'
     "));
     $montant_paye = 0;
     if($payed[0]->somme != null)
      $montant_paye = $payed[0]->somme;
      $restant = $devis_finance->montant - $montant_paye;

        return $restant;
    } 

    public static function dejaPyed($id, $etape)
    {
        $deja = false;
        $payed = DB::select(DB::raw("
        select  * from payeds p where p.chantier_id = '$id' and p.etape = '$etape'
     "));  
     if($payed != null) $deja = true;

     return $deja;

    }
}
