<?php

namespace App\GraphQL\Query;

use App\Joined;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class PositionQuery extends Query
{
    protected $attributes = [
        'name' => 'positions'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Position'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'position'               => [ 'type' => Type::boolean()],
            'nom_position'           => ['type' => Type::string()], 
            'projet_id'              => [ 'type' => Type::int()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = Position::with('projet');

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['position']))
       {
          $query = $query->where('position', $args['position']);
       }
       if (isset($args['projet_id']))
       {
          $query = $query->where('projet_id', $args['projet_id']);
       }
       $query = $query->get();
       return $query->map(function (Position $item)
       {
           return 
           [
            'id'                     => $item->id,
            'position'               => $item->position,
            'nom_position'           => $item->nom_position,
            'projet_id'              => $item->projet_id,
            'projet'                 => $item->projet,
        ];
      });
    }
}
