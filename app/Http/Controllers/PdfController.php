<?php

namespace App\Http\Controllers;
use App\Plan;
use App\Outil;
use App\Projet;
use PDF;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    public function pdf_plan($id)
    {
        try
        {
            $errors = null;
            if(isset($id))
            {
                $item = Plan::find($id);
                if(isset($item))
                {
                    $piece     = Plan::nb_attribut($item->id, 'piece');
                    $chambre   = Plan::nb_attribut($item->id, 'chambre');
                    $toillette = Plan::nb_attribut($item->id, 'toillette');
                    $cuisine   = Plan::nb_attribut($item->id, 'toillette');
                    $salon     = Plan::nb_attribut($item->id, 'salon');
                    $sdb       = Plan::nb_attribut($item->id, 'sdb');
                    $pdf       = PDF::loadView('pdf.plan_pdf', array(
                    'plan'      => $item,
                    'salon'     => $salon,
                    'piece'     => $piece,
                    'cuisine'   => $cuisine,
                    'toillette' => $toillette,
                    'sdb'       => $sdb,
                    'chambre'   => $chambre));
                    return $pdf->setPaper( 'orientation')->stream();
                }
            }
        }
        catch(\Exception $e)
        {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));
        }
    }

    public function contrat($user, $projet)
    {

    }
    public function pdf_projet($id)
    {

    }
}
