<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\NiveauProjet;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class NiveauProjetQuery extends Query
{
    protected $attributes = [
        'name' => 'niveauprojets'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Niveauprojet'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => [ 'type' => Type::id()],
            'plan_id'                => [ 'type' => Type::int()],
            'piece'                 => [ 'type' => Type::int()],
            'chambre'                => [ 'type' => Type::int()],
            'salon'                  => [ 'type' => Type::int()],
            'cuisine'                => [ 'type' => Type::int()],
            'bureau'                => ['type' => Type::int()],

            'garage'                 => [ 'type' => Type::int()],
            'toillette'              => [ 'type' => Type::int()],
            'niveau_name'            => [ 'type'=> Type::string()],
            'sdb'                    => [ 'type' => Type::int()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],
            'deleted_at_fr'          => [ 'type' => Type::string()], 
        ];   
    }
    public function resolve($root, $args)
    {
       $query = NiveauProjet::with('projet');
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['projet_id']))
       {
          $query = $query->where('projet_id', $args['projet_id']);
       }
      
       $query = $query->get();
       return $query->map(function (NiveauProjet $item)
       {
           return 
           [
            'id'                    => $item->id,
            'projet_id'             => $item->projet_id,
            'projet'                => $item->projet,
            'piece'                 => $item->piece,
            'chambre'               => $item->chambre,
            'salon'                 => $item->salon,
            'cusine'                => $item->cusine,
            'bureau'                => $item->bureau,
            'garage'                => $item->garage,
            'niveau_name'           => $item->niveau_name,
            'sdb'                   => $item->sdb,
            'bureau'                => $item->bureau,
            'toillette'             => $item->toillette,
            'created_at'            => $item->created_at,
            'updated_at'            => $item->updated_at,
        ];
      });
    }
}
