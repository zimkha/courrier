<?php

namespace App\GraphQL\Query;

use App\Chantier;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Arr;

class ChantierPaginatedQuery extends Query
{
    protected $attributes = [
        'name' => 'chantierspaginated'
    ];

    public function type(): Type
    {

        return GraphQL::type('chantierpaginated');
    }

    public function args(): array 
    {
        return
        [
            'id'                     => [ 'type' => Type::int()],
            'etat'                   => [ 'type' => Type::int()],
            'user_id'                => [ 'type' => Type::int()],
            'fichier'                => [ 'type' => Type::string(),],
            'date_begin'             => [ 'type' => Type::string()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
                     
            'page'                   => ['type' => Type::int()],
            'count'                  => ['type' => Type::int()]
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
       
       
       $count = Arr::get($args, 'count', 10);
       $page  = Arr::get($args, 'page', 1);

       return $query->orderBy('created_at', 'desc')->paginate($count, ['*'], 'page', $page);
       
    }
}
