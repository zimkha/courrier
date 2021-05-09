<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Remarque extends Model
{
    use SoftDeletes;

    public function type_remarque()
    {
        return $this->belongsTo(TypeRemarque::class);
    }
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
