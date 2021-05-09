<?php

namespace App\GraphQL\Query;

use App\Plan;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Carbon\Carbon;

class PlanQuery extends Query
{
    protected $attributes = [
        'name' => 'plans'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Plan'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'fichier'                => [ 'type' => Type::string(), 'description' => ''],
            'code'                   => [ 'type' => Type::string(), 'description' => ''],
            'unite_mesure_id'        => ['type' => Type::id()],
            'user_id'                => ['type' => Type::int()],
            'user_name'              => ['type' => Type::string()],
            'superficie'             => ['type' => Type::int()],
            'longeur'                => ['type' => Type::int()],
            'largeur'                => ['type' => Type::int()],
            'fichier'                => ['type' => Type::string()],
            'piscine'                => ['type' => Type::int()],
            'nb_pieces'              => ['type' => Type::int()],
            'nb_chambre'             => ['type' => Type::int()],
            'nb_toillette'           => ['type' => Type::int()],
            'nb_salon'               => ['type' => Type::int()],
            'nb_cuisine'             => ['type' => Type::int()],
            'nb_etage'               => ['type' => Type::int()],
            'garage'                 => ['type' => Type::boolean()],

            
          
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = Plan::with('niveau_plans');

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['superficie']))
       {
          $query = $query->where('superficie', $args['superficie']);
       }
       if (isset($args['longeur']))
       {
          $query = $query->where('longeur', $args['longeur']);
       }
       if (isset($args['largeur']))
       {
          $query = $query->where('largeur', $args['largeur']);
       }
       if (isset($args['piscine']))
       {
          $query = $query->where('piscine', $args['piscine']);
       }
       if(isset($args['user_name']))
       {
          $plans_id = Plan::SelecvByName($args['user_name']);
          $query    = $query->where('id', $plans_id);
       }
       if (isset($args['nb_pieces'])) {
          $attribut = "piece";
          $array = Plan::getNbAttribut($attribut);
          $query = $query->whereIn('id',$array);
       }
       if(isset($args['nb_toillette']))
       {
         $attribut = "toillette";
         $array = Plan::getNbAttribut($attribut);
         $query = $query->whereIn('id',$array);
       }
      
       if(isset($args['nb_salon']))
       {
          $attribut = "salon";
          $array = Plan::getNbAttribut($attribut);
          $query = $query->whereIn('id',$array); 
       }
       if(isset($args['nb_cuisine']))
       {
         $attribut = "cusine";
         $array = Plan::getNbAttribut($attribut);
         $query = $query->whereIn('id',$array);
       }
       $query = $query->get();
       return $query->map(function (Plan $item)
       {
           return 
           [
            'id'                     => $item->id,
            'fichier'                => $item->fichier,
            'code'                   => $item->code,
            'unite_mesure_id'        => $item->unite_mesure_id,
            'unite_mesure'           => $item->unite_mesure,
            'code'                   => $item->code,
            'superficie'             => $item->superficie,
            'longeur'                => $item->longeur,
            'largeur'                => $item->largeur,
            'piscine'                => $item->piscine,
            'fichier'                => $item->fichier,
            'niveau_plans'           => $item->niveau_plans,
            'plan_projets'           => $item->plan_projets,
            'garage'                 => $item->garage,
            'created_at'             => $item->created_at,
            'joineds'                => $item->joineds,
        ];
      });
    }
}
