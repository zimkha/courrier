<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Service;
class ServiceGauche extends Model
{
    public function services()
    {
      return $this->hasMany(Service::class);
    }
}
