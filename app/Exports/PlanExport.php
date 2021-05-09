<?php

namespace App\Exports;

use App\Plan;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;
class PlanExport implements FromView
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
    }
}
