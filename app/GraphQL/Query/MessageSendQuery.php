<?php

namespace App\GraphQL\Query;

use App\MessageSend;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class MessageSendQuery extends Query
{
    protected $attributes = [
        'name' => 'messagesends'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Messagesend'));
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
            $query = $query->get();
       return $query->map(function (MessageSend $item)
       {
           return 
           [
            'id'                     => $item->id,
            'nom'                    => $item->nom,
            'objet'                  => $item->objet,
            'email'                  => $item->email,
            'telephone'              => $item->telephone,
            "message"                => $item->message,
        ];
      });
    }
}
