<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\UniteMesure;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class UniteMesureQuery extends Query
{
    protected $attributes = [
        'name' => 'unitemesures'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Unitemesure'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id(), 'description' => ''],
            'name'                => ['type' => Type::string()],
           'plans'                  => ['type' => Type::listOf(GraphQL::type('Plan')), 'description' => ''],


            'created_at'             => [ 'type' => Type::string(), 'description' => ''],
            'created_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            'updated_at'             => [ 'type' => Type::string(), 'description' => ''],
            'updated_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            'deleted_at'             => [ 'type' => Type::string(), 'description' => ''],
            'deleted_at_fr'          => [ 'type' => Type::string(), 'description' => ''],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = TypeRemarque::query();

       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['name']))
       {
          $query = $query->where('name', $args['name']);
       }
      
      
       $query = $query->get();
       return $query->map(function (UniteMesure $item)
       {
           return 
           [
            'id'                     => $item->id,
            'name'                   => $item->name,
          
            'created_at'             => $item->created_at,
            'updated_at'             => $item->updated_at,
        ];
      });
    }
}
