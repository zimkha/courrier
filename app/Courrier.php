<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Service;
class Courrier extends Model
{
  public function services()
  {
      return $this->hasMany(Service::class);
  }
 
}
