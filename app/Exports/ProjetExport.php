<?php

namespace App\Exports;

use App\Projet;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class ProjetExport implements FromView
{
    /**
    * @return \Maatwebsite\Excel\Concerns\FromView
    */
    protected $id;
    public function __construct($id)
    {
        $this->id = $id;
    }
    public  function view(): View
    {
      if (isset($this->id)) {
          $item = Projet::with('niveau_projets')->where('id', $this->id)->get();
          if (isset($item)) {
              $niveaux = $item->niveau_projets;
              $user = $item->user;
              $array_level = array();
              array_push($array_level, [
                  'user'            => $item->user,
                  'level'           => $item->niveau_projets,
                  'remarques'       => $item->remarques,
                  'plan_lies'        =>$item->plan_projets
              ]);

              
          }
      } 
      return view('excel.projetExcel', [
          $array_level
      ]);
    }
}
