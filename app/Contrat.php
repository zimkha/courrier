<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    protected $fillable = ['projet_id'];

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
