<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Courrier;
use App\ServiceGauche;
use App\ServiceDroite;
class Service extends Model
{
    public function service_gauche() {
      return $this->belongsTo(ServiceGauche::class);
    }
    public function service_droite() {
      return $this->belongsTo(ServiceDroite::class);
    }
    public function courrier() {
      return $this->belongsTo(Courrier::class);
    }
}
