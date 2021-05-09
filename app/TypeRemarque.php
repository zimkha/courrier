<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class TypeRemarque extends Model
{
    use SoftDeletes;
    public function remarques()
    {
        return $this->hasMany(Remarque::class);
    }
}
