<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use App\PlanProjet;
use App\Projet;

class Plan extends Model
{
    use SoftDeletes;

    public function niveau_plans()
    {
        return $this->hasMany(NiveauPlan::class);
    }
    public function plan_projets()
    {
        return $this->hasMany(PlanProjet::class);
    }
    public function unite_mesure()
    {
        return $this->belongsTo(UniteMesure::class);
    }
    public function joineds()
    {
        return $this->hasMany(Joined::class);
    }


    public static function makeCode()
    {
        $last = Plan::all()->last();
        $nume = null;
        $code = "PL";
        if (isset($last)) {
            $nume = $last->id;
        }
        else $nume = 0;
        $nume = $nume + 1;
        
        if ($nume >= 1  && $nume <= 9) 
        {
          $code = $code ."000".$nume;
        }
        if ($nume > 9 && $nume <= 99)
        {
            $code = $code ."00".$nume;
        }
        return $code;

    }
    public static function SelecvByName($char)
    {
        $plans_id = DB::select(DB::raw("
        SELECT DISTINCT p.id as plan_id from plans p, plan_projets pp, projets pr, users us 
        where pp.plan_id = p.id and pp.projet_id = pr.id and us.id = pr.user_id
         and us.prenom LIKE  '$char%'
        ")); 
        $tab = array();
        foreach($plans_id as $item)
        {
            array_push($tab, $item->plan_id);
        }
        return $tab;
    }
    public static function plan_by_user($char)
    {
        $users = User::where('prenom',  Outil::getOperateurLikeDB(), '%'.$char.'%')->get();
        $array =array();
        $tab = [];
        foreach($users as $item)
        {
            $all_projets_plan = PlanProjet::whereIn('projet_id', Projet::where('user_id', $item->id)->get(['id']))->get();
      
            foreach($all_projets_plan as $plan)
            {
                array_push($array, $plan->plan_id);
            }
            $all_plan = Plan::whereIn('id', $array)->get();
          
            foreach($all_plan as $plan)
            {
                array_push($tab, $plan->id);
            }
            if($tab == null)
            {
                $tab = [0];
            }
           
        }
        return $tab;
       
    }
    public static function nb_attribut($id, $attribut)
    {
        $item = Plan::find($id);
        $nb_attribut = 0;
        if (isset($item)) {
            // le plan Existe 
           $nb =  DB::select(DB::raw("
           select sum(np.$attribut) as nbr from niveau_plans np where np.plan_id = '$id'
        "));
        if ($nb[0]->nbr != null)
           {
            $nb_attribut = $nb[0]->nbr;
           }
        }
        return $nb_attribut;
    }
    public static function getNbAttribut($attribut, $nb_attribut)
    {
        $tab = DB::select(DB::raw("
        select sum(n.$attribut) as attr , n.plan_id as id from niveau_plans n GROUP By n.plan_id
        "));
        $array = array();
        foreach($tab as $element)
        {
           if($elment->attr == $nb_attribt)
           {
            array_push($array, $element->id);
           }
        }
        return $array;
    }
    
}
