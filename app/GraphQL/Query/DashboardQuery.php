<?php


namespace App\GraphQL\Query;
use App\Outil;
use App\Courrier;
use App\User;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use function GuzzleHttp\json_encode;
use Illuminate\Support\Facades\DB;


class DashboardQuery extends  Query
{

    protected $attributes = [
        'name' => 'dashboards'
    ];

    public function type(): Type
        {
        return Type::listOf(GraphQL::type('Dashboard'));
    }

    public function args(): array
    {
        return
            [
               
                'status'             => ['type' => Type::int()],
                'type'               => ['type' => Type::string()],

            ];
    }
    public function resolve($root, $args)
    {

        $total    = 0;
        $depart   = 0;
        $arrive   = 0;
        $encour   = 0;
        $finalise = 0;

       if(isset($args['type']))
     
      
         return
         [
          
              'total'     =>json_encode(10),
              'depart'    => json_encode(20),
              'arrive'         => json_encode(20),
              'encour'      => json_encode(20),
          
         ];


    }

}
