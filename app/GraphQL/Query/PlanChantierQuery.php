<?php

namespace App\GraphQL\Query;

use App\PlanChantier;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class PlanChantierQuery extends Query
{
    protected $attributes = [
        'name' => 'planchantiers'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Planchantier'));
    }

    public function fields(): array
    {
        return [

            'id'                     => [ 'type' => Type::id()],
            'use_id'                 => [ 'type' => Type::int()],
            'fichier'                => [ 'type' => Type::string(),],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
                     
        ];
    }
    public function resolve($root, $args)
    {
       $query = PlanChantier::with('user');

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['user_id']))
       {
          $query = $query->where('user_id', $args['user_id']);
       }
      
      
       $query = $query->get();
       return $query->map(function (PlanChantier $item)
       {
           return 
           [
            'id'                     => $item->id,
            'fichier'                => $item->fichier,
            'etat'                   => $item->etat,
            'user_id'                => $item->user_id,
            'user'                   => $item->user,
        ];
      });
    }
  
}