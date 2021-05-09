<?php

namespace App\GraphQL\Query;

use App\Joined;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class JoinedQuery extends Query
{
    protected $attributes = [
        'name' => 'joineds'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Joined'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'fichier'                => [ 'type' => Type::string(), 'description' => ''],
            'active'                 => ['type' => Type::boolean()], 
            'description'            => [ 'type' => Type::string()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = Joined::with('plan');

      
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
       return $query->map(function (Joined $item)
       {
           return 
           [
            'id'                     => $item->id,
            'fichier'                => $item->fichier,
            'active'                 => $item->active,
            'plan_id'                => $item->plan_id,
            'plan'                   => $item->plan,
        ];
      });
    }
}
