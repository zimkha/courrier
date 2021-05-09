<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExcelController extends Controller
{
    public function projet($id,$model)
    {
        ini_set('max_execution_time', -1);
        if (!isset($id)) {
            throw new Exception("Error Processing Request", 1);
        }
        $class = app($model);
        $class = $class.'Excel';
        return Excel::download(new $class($id), '{$model}'.'_excel.xlsx');
    }
   
}
