<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlanningFond extends Model
{
    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }
}
