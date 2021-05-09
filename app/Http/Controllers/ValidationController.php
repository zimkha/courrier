<?php

namespace App\Http\Controllers;

use App\Projet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ValidationController extends Controller
{
    public function status($id, $model)
    {
        try {
             return DB::transaction(function () {
                 $errors = null;
                 $data = 0;
                 if (empty($id))
                 {
                    $item = app($model)->where('id',$id)->get(); 
                    if (isset($item)) {
                        // On active le projet
                         $item->active = true;
                         $item->save();
                         $data = 1;
                    }
                    else {
                        $errors = "Un {$model} avec ces donnée n'existe pas dans la base";
                    }
                 }
                  else
                    $errors = "Erreur server, veuillez contacter le service technique";
             });
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
