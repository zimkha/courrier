<?php

namespace App\GraphQL\Query;

use App\ServiceDroite;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Arr;
use App\Outil;

class ServiceDroiteQuery extends Query
{
    protected $attributes = [
        'name' => 'servicedroites'
    ];

    public function type(): Type
    {

      return Type::listOf(GraphQL::type('Servicedroite'));
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
        $query = ServiceDroite::query();
      
        if (isset($args['id']))
        {
           $query = $query->where('id', $args['id']);
        }
       
      
        if (isset($args['name']))
        {
           $query = $query->where('name', $args['name']);
        }
     
      
        $query = $query->get();

        return $query->map(function (ServiceDroite $item)
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
