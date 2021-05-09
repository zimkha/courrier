<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanProjet extends Model
{
    use SoftDeletes;

    public function plan()
    {
         return $this->belongsTo(Plan::class);
    }
    public function projet()
    {
         return $this->belongsTo(Projet::class);
    }
}
