<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Contrat;
use App\Projet;
use App\User;
use Barryvdh\DomPDF\Facade as PDF;
class ContratController extends Controller
{
    public function test()
    {
        $message = "je suis la";
        $pdf = PDF::setOptions(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true])->loadView('pdf.contrat',compact('message'));
        return $pdf->stream();

    }
    public function save(Request $request)
    {
        try
        {
            return DB::transaction(function() use($request)
            {
                $errors = null;
                $user = Auth::user();
                if(empty($request->projet))
                {
                    $errors = "Veuillez preciser un projet valide";
                }
                else
                {
                    $item = Projet::find($request->projet);
                    if(isset($item))
                   {
                       $item->contrat = true;
                   }
                }
                if(empty($request->ref_cadastral))
                {
                    $errors = "veuillez preciser le référence cadastral";
                }
                else
                {
                    $item->ref_cadastral = $request->ref_cadastral;
                }
                $user = User::find($item->user_id);
                $niveau = $item->niveau_projets;
                $pdf  = PDF::loadView('pdf.contrat', [
                    'item'   => $item,
                ]);
                return $pdf->setPaper( 'orientation')->stream();

            });
        }
        catch(\Exception $e)
        {

        }
    }
}
