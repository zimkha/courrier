<?php

namespace App\GraphQL\Query;

use App\Courrier;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class CourrierQuery extends Query
{
    protected $attributes = [
        'name' => 'courriers'
    ];

    public function type(): Type
    {
      return Type::listOf(GraphQL::type('Courrier'));
    }

    public function args(): array
    {
        return [
 
            'id'                     => ['type' => Type::int()],
            'reference'              => [ 'type' => Type::string()],
            'date_courrier'          => [ 'type' => Type::string()],
            'objet'                  => [ 'type' => Type::string()],
            'date_arrive'            => [ 'type' => Type::string()],
            'autre_instruction'      => [ 'type' => Type::string()],
            'expediteur'             => [ 'type' => Type::string(),],
            'numero'                 => [ 'type' => Type::int(),],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
        ];
    }
    public function resolve($root, $args)
    {
      
       $query = Courrier::query();
      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['reference']))
       {
          $query = $query->where('reference', $args['reference']);
       }
       if (isset($args['date_arrive']))
       {
          $query = $query->where('date_arrive', $args['date_arrive']);
       }
       if (isset($args['autre_instruction']))
       {
          $query = $query->where('autre_instruction', $args['autre_instruction']);
       }
       if (isset($args['expediteur']))
       {
          $query = $query->where('expediteur', $args['expediteur']);
       }
       if (isset($args['numero']))
       {
          $query = $query->where('numero', $args['numero']);
       }
      
       $query = $query->get();
       return $query->map(function (Courrier $item)
       {
           return 
           [
            'id'                       => $item->id,
            'reference'                => $item->reference,
            'numero'                   => $item->numero,
            'expediteur'               => $item->expediteur,
            'date_courrier'            => $item->date_courrier,
            'objet'                    => $item->objet,
            'date_arrive'              => $item->date_arrive,
            'autre_instruction'        => $item->autre_instruction,
            'created_at'               => $item->created_at,
            'services'                 => $item->services
        ];
      });
    }
  
}