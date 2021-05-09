<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PlanningFondController extends Controller
{
    
    public function save(Request $request)
    {
        return DB::transaction(function() use($request)
        {

        });
    }

    public function delete($id)
    {
        return DB::transaction(function() use($id)
        {

        });
    }
}
