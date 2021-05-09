<?php

namespace App\GraphQL\Query;

use App\MessageSend;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Arr;

class MessageSendPaginatedQuery extends Query
{
    protected $attributes = [
        'name' => 'messagesendspaginated'
    ];

    public function type(): Type
    {

        return GraphQL::type('messagesendpaginated');
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'nom'                    => [ 'type' => Type::string()],
            'objet'                  => ['type' => Type::string()], 
            'message'                => [ 'type' => Type::string()],
            'email'                  => [ 'type' => Type::string()],
            'telephone'              => [ 'type' => Type::string()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],
                     
            'page'                   => ['type' => Type::int()],
            'count'                  => ['type' => Type::int()]
        ];
        
    }

    public function resolve($root, $args)
    {
        $query = MessageSend::query();

      
       
        if (isset($args['id']))
        {
           $query = $query->where('id', $args['id']);
        }
        if (isset($args['email']))
        {
           $query = $query->where('email', $args['email']);
        }
        if (isset($args['nom']))
        {
           $query = $query->where('nom', $args['nom']);
        }
        if (isset($args['telephone']))
        {
           $query = $query->where('telephone', $args['telephone']);
        }
       
       
       $count = Arr::get($args, 'count', 10);
       $page  = Arr::get($args, 'page', 1);

       return $query->orderBy('created_at', 'desc')->paginate($count, ['*'], 'page', $page);
       
    }
}
