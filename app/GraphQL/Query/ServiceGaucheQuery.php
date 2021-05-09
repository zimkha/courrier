<?php

namespace App\GraphQL\Query;

use App\ServiceGauche;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Arr;
use App\Outil;

class ServiceGaucheQuery extends Query
{
    protected $attributes = [
        'name' => 'servicegauches'
    ];

    public function type(): Type
    {

      return Type::listOf(GraphQL::type('Servicegauche'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => [ 'type' => Type::int()],
            'name'                   => [ 'type' => Type::int()],
          
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
        ];
        
    }

    public function resolve($root, $args)
    {
        $query = ServiceGauche::query();
      
        if (isset($args['id']))
        {
           $query = $query->where('id', $args['id']);
        }
       
      
        if (isset($args['name']))
        {
           $query = $query->where('name', $args['name']);
        }
     
      
        $query = $query->get();

        return $query->map(function (ServiceGauche $item)
        {
            return
                [
                    'id'                  => $item->id,
                    'name'                => $item->name,
                    'created_at'          => $item->created_at,
                    'updated_at'          => $item->updated_at,
                   
                ];
        });       
    }
}
