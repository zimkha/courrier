<?php

namespace App\GraphQL\Query;

use App\Service;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Arr;
use App\Outil;

class ServiceQuery extends Query
{
    protected $attributes = [
        'name' => 'services'
    ];

    public function type(): Type
    {

      return Type::listOf(GraphQL::type('Service'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => [ 'type' => Type::int()],
            'service'                   => [ 'type' => Type::int()],
            'courrier_id'            => ['type' => Type::int()],
            'service_gauche_id'      => ['type' => Type::int()],
            'service_droite_id'      => ['type' => Type::int()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
        ];
        
    }

    public function resolve($root, $args)
    {
        $query = Service::with('courrier');
      
        if (isset($args['id']))
        {
           $query = $query->where('id', $args['id']);
        }
        if (isset($args['service_gauche_id']))
        {
           $query = $query->where('service_gauche_id', $args['service_gauche_id']);
        }
        if (isset($args['service_droite_id']))
        {
           $query = $query->where('service_droite_id', $args['service_droite_id']);
        }
      
        if (isset($args['name']))
        {
           $query = $query->where('name', $args['name']);
        }
     
      
        $query = $query->get();

        return $query->map(function (Service $item)
        {
            return
                [
                    'id'                  => $item->id,
                    'service'                => $item->service,
                    'service_droite_id'   => $item->service_droite_id,
                    'service_gauche_id'   => $item->service_gauche_id,
                    'service_droite'      => $item->service_droite,
                    'service_gauche'      => $item->service_gauche,
                    'created_at'          => $item->created_at,
                    'updated_at'          => $item->updated_at,
                   
                ];
        });       
    }
}
