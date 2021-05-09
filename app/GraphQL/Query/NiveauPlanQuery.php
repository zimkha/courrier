<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\NiveauPlan;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class NiveauPlanQuery extends Query
{
    protected $attributes = [
        'name' => 'niveauplans'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Niveauplan'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id(), 'description' => ''],
            'niveau'                 => [ 'type' => Type::string(), 'description' => ''],
            'plan_id'                => ['type' => Type::int()],
            'piece'                 => ['type' => Type::int()],
            'chambre'                => ['type' => Type::int()],
            'salon'                  => ['type' => Type::int()],
            'cuisine'                => ['type' => Type::int()],
            'garage'                 => ['type' => Type::int()],
            'bureau'                 => ['type' => Type::int()],
            'toillette'              => ['type' => Type::int()],

           

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
       $query = NiveauPlan::with('plan');

       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['plan_id']))
       {
          $query = $query->where('plan_id', $args['plan_id']);
       }
      
       $query = $query->get();
       return $query->map(function (NiveauPlan $item)
       {
           return 
           [
            'id'                    => $item->id,
            'plan_id'               => $item->plan_id,
            'niveau'                => $item->niveau,
            'plan'                  => $item->plan,
            'piece'                 => $item->piece,
            'chambre'               => $item->chambre,
            'salon'                 => $item->salon,
            'cusine'                => $item->cusine,
            'garage'                => $item->garage,
            'toillette'             => $item->toillette,
            'bureau'                => $item->bureau,
            'created_at'            => $item->created_at,
            'updated_at'            => $item->updated_at,
        ];
      });
    }
}
