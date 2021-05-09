<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
