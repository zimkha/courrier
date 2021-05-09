<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Projet extends Model
{
    use SoftDeletes;

    public function user()
    {
         return $this->belongsTo(User::class);
    }
    public function niveau_projets()
    {
        return $this->hasMany(NiveauProjet::class);
    }
    public function positions()
    {
        return $this->hasMany(Position::class);
    }
    public function remarques()
    {
         return $this->hasMany(Remarque::class);
    }
    public function plan_projets()
    {
        return $this->hasMany(PlanProjet::class);
    }
    public static function get_garage($id)
    {
        $res ="NON";
        if(isset($id))
        {
            $item  = Projet::find($id);
            if(isset($item))
            {
                if($item->garage == true || $item->garage == 1) $res = "OUI";
                return $res;
            }
        }
        return false;
    }

    public static function get_piscine($id)
    {
        $res ="NON";
        if(isset($id))
        {
            $item  = Projet::find($id);
            if(isset($item))
            {
                if($item->piscine == true || $item->piscine == 1) $res = "OUI";
                return $res;
            }
        }
        return false;
    }
    public static function a_valider($id)
    {
         $item = Projet::find($id);
         if(isset($item))
         {
             $date = $item->updated_at;
             $date = date('Y-m-d', strtotime($date. '15 days'));
             $date_now =  new \DateTime();
             $date = date($date. '23:59:59');
             $date = new \DateTime($date);
             $response = null;
             $response = date_diff($date,$date_now);
            if($response->d >0)
            {
                return $response->d;
            }
            else
            return null;
         }

    }
     public static function nb_attribut($id, $attribut)
    {
        $item = Projet::find($id);
        $nb_attribut = 0;
        if (isset($item)) {
            // le plan Existe
           $nb =  DB::select(DB::raw("
           select sum(np.$attribut) as nbr from niveau_projets np where np.projet_id = '$id'
        "));
        if ($nb[0]->nbr != null)
           {
            $nb_attribut = $nb[0]->nbr;
           }
        }
        return $nb_attribut;
    }
    public static function getNumbeeremarque($id)
    {
        return Remarque::where('projet_id', $id)->count();
    }
    public static function makeCode()
    {
        $last = Projet::all()->last();
        $nume = null;
        $code = "PR";
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

    public static function plan_active($id)
    {
      $isActive = false;
      $item = Projet::find($id);
      if(isset($item))
      {
          $plan_active = PlanProjet::where('projet_id', $item->id)->where('active', true)->count();

          if($plan_active != 0)
          {
            $isActive = true;
          }
      }
      return $isActive;
    }

}
