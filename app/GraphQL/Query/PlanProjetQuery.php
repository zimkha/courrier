<?php

namespace App\GraphQL\Query;


use App\PlanProjet;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class PlanProjetQuery extends Query
{
    protected $attributes = [
        'name' => 'planprojets'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Planprojet'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'plan_id'                => ['type' => Type::int()],
            'projet_id'              => ['type' => Type::int()],
            'plan'                   => ['type' => GraphQL::type('Plan')],
            'projet'                 => ['type' => GraphQL::type('Projet')],
            'message'                => ['type' => Type::string()],
            'etat_active'            => ['type' => Type::int()],
            'active'                 => ['type'   => Type::boolean()],
 
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = PlanProjet::with('niveaus');

       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['projet_id']))
       {
          $query = $query->where('projet_id', $args['projet_id']);
       }
       if (isset($args['plan_id']))
       {
          $query = $query->where('plan_id', $args['plan_id']);
       }
       if (isset($args['etat_active']))
       {
          $query = $query->where('etat_active', $args['etat_active']);
       }
       if (isset($args['active']))
       {
          $query = $query->where('active', $args['active']);
       }
       $query = $query->get();
       return $query->map(function (PlanProjet $item)
       {
           return 
           [
            'id'                     => $item->id,
            'projet_id'              => $item->projet_id,
            'plan_id'                => $item->plan_id,
            'etat_active'            => $item->largetat_activeeur,
            'active'                 => $item->active,
            'projet'                 => $item->projet,
            'plan'                   => $item->plan,
            'created_at'             => $item->created_at,
            'updated_at'             => $item->updated_at,
        ];
      });
    }
}
