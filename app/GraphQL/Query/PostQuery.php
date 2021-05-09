<?php

namespace App\GraphQL\Query;

use App\Post;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class PostQuery extends Query
{
    protected $attributes = [
        'name' => 'posts'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Post'));
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'fichier'                => [ 'type' => Type::string(), 'description' => ''],
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
       $query = Post::query();

      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
      
       $query = $query->get();
       return $query->map(function (Post $item)
       {
           return 
           [
            'id'                     => $item->id,
            'fichier'                => $item->fichier,
            'description'                 => $item->description,
            
        ];
      });
    }
}
