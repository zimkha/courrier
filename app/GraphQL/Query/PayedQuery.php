<?php

namespace App\GraphQL\Query;

use App\DeviseEstime;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class PayedQuery extends Query
{
    protected $attributes = [
        'name' => 'payeds'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Payed'));
    }

    public function fields(): array
    {
        return [

            'id'                     => [ 'type' => Type::id()],
            'chantier_id'            => [ 'type' => Type::int()],
            'etape'                   => [ 'type' => Type::int()],
            'montant'                => [ 'type' => Type::string(),],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
                     
        ];
    }
    public function resolve($root, $args)
    {
       $query = Payed::with('chantier');

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
     
       if (isset($args['chantier_id']))
       {
          $query = $query->where('chantier_id', $args['chantier_id']);
       }
      
       $query = $query->get();
       return $query->map(function (Payed $item)
       {
           return 
           [
            'id'                     => $item->id,
            'montant'                => $item->montant,
            'etape'                   => $item->etat,
            'chantier_id'            => $item->chantier_id,
            'chantier'               => $item->chantier,
        ];
      });
    }
  
}