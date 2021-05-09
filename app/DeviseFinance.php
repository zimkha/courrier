<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeviseFinance extends Model
{
    
    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }
    public static function generate($id)
    {
        $item = DeviseFinance::find($id);
        $array = array();
        if(isset($item))
        {
            if($item->montant != null && $item->montant != 0)
            {
                $montant = $item->montant;
              return   $array = [
                    "reservation"   => ($montant  * 10) /100,
                    "fondation"     => ($montant  * 15) /100,
                    "elevation"     => ($montant  * 15) /100,
                    "coulage"       => ($montant  * 20) /100,
                    "menuisier"     => ($montant  * 15) /100,
                    "finition"      => ($montant  * 20) /100,
                    "reception"     => ($montant  * 5) /100,
                ];
            }
        }
        return null;
    }
   
}
