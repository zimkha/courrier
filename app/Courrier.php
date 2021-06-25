<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Service;
use Illuminate\Support\Facades\DB;

class Courrier extends Model
{
  public function services()
  {
      return $this->hasMany(Service::class);
  }

  public  static function getTotalCourrier() {
    $items = Courrier::all()->count();
  }

  public static function getNbByType($type) {
     
      $count = Courrier::where('type', '=', $type)->count();
      return $count;
     
  }

  public  static function getNbByStatus ($status) {

    return Courrier::where('status', '=', $status)->count();


      
  }
 
}
