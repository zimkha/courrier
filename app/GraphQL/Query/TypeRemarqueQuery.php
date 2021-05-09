<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\TypeRemarque;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class TypeRemarqueQuery extends Query
{
    protected $attributes = [
        'name' => 'typeremarques'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Typeremarque'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id(), 'description' => ''],
            'name'                => ['type' => Type::string()],
            // 'remarques'           => ['type' => Type::listOf(GraphQL::type('Remarque')), 'description' => ''],


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
       return $query->map(function (TypeRemarque $item)
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
