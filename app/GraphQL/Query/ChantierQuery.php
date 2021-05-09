<?php

namespace App\GraphQL\Query;

use App\Chantier;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class ChantierQuery extends Query
{
    protected $attributes = [
        'name' => 'chantiers'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Chantier'));
    }

    public function fields(): array
    {
        return [

            'id'                     => [ 'type' => Type::int()],
            'etat'                   => [ 'type' => Type::int()],
            'user_id'                => [ 'type' => Type::int()],
            'date_begin'             => [ 'type' => Type::string()],
            'fichier'                => [ 'type' => Type::string(),],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],

                     
        ];
    }
    public function resolve($root, $args)
    {
       $query = Chantier::with('user');

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
     
       if (isset($args['etat']))
       {
          $query = $query->where('etat', $args['etat']);
       }
       if (isset($args['user_id']))
       {
          $query = $query->where('user_id', $args['user_id']);
       }
      
       $query = $query->get();
       return $query->map(function (Chantier $item)
       {
           return 
           [
            'id'                     => $item->id,
            'fichier'                => $item->fichier,
            'etat'                   => $item->etat,
            'user_id'                => $item->user_id,
            'user'                   => $item->user,
            'date_begin'             => $item->date_begin,
        ];
      });
    }
  
}