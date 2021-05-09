<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NiveauPlan extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'piece', 'chambre', 'cuisine', 'toillette','salon', 'niveau'
    ];
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
