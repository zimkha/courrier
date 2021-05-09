<?php

namespace App\GraphQL\Query;

use App\Contact;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class ContactQuery extends Query
{
    protected $attributes = [
        'name' => 'contacts'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Contact'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'email'                 => [ 'type' => Type::string()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],

           
        ];
        
    }

    public function resolve($root, $args)
    {
       $query = Contact::query();

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['email']))
       {
          $query = $query->where('email', $args['email']);
       }
      
       $query = $query->get();
       return $query->map(function (Contact $item)
       {
           return 
           [
            'id'                           => $item->id,
            'email'                        => $item->email,
            'message'                      => $item->active,
            'created_at'                   => $item->created_at,
            'updated_at'                   => $item->updated_at,
        ];
      });
    }
}
