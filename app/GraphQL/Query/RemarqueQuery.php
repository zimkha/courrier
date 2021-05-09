<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\Remarque;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class RemarqueQuery extends Query
{
    protected $attributes = [
        'name' => 'remarques'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Remarque'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type'  => Type::id()],
            'projet_id'              => ['type'  => Type::int()],
            'type_remarque_id'       => ['type'  => Type::int()],
            
            
            'fichier'                => ['type'  => Type::string()],
            'demande_text'           => ['type'  => Type::string()],

            'created_at'             => ['type'  => Type::string()],
            'created_at_fr'          => ['type'  => Type::string()],
            'updated_at'             => ['type'  => Type::string()],
            'updated_at_fr'          => ['type'  => Type::string()],
            'deleted_at'             => ['type'  => Type::string()],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = Remarque::with('projet');

       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['projet_id']))
       {
          $query = $query->where('projet_id', $args['projet_id']);
       }
       if (isset($args['type_remarque_id']))
       {
          $query = $query->where('type_remarque_id', $args['type_remarque_id']);
       }
      
       $query = $query->get();
       return $query->map(function (Remarque $item)
       {
           return 
           [
            'id'                     => $item->id,
            'projet_id'              => $item->projet_id,
            'type_remarque_id'       => $item->type_remarque_id,
            'demande_text'           => $item->demande_text,
            'projet'                 => $item->projet,
            'fichier'                => $item->fichier,
            'type_remarque'          => $item->type_remarque,
            'created_at'             => $item->created_at,
            'updated_at'             => $item->updated_at,
        ];
      });
    }
}
