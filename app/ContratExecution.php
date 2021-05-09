<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContratExecution extends Model
{
    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }
}
