<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class NiveauProjet extends Model
{
    use SoftDeletes;
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
