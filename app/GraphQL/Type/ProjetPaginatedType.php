<?php
/**
 * Created by PhpStorm.
 * User: khazimndiaye
 * Date: 6/19/19
 * Time: 9:24 AM
 */


namespace App\GraphQL\Type;

use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use Illuminate\Support\Arr;
class ProjetPaginatedType extends  GraphQLType
{
    protected $attributes = [
        'name'  => 'projetpaginated'
    ];

    public function fields(): array
    {
        return
            [
                'metadata' =>
                    [
                        'type' => GraphQL::type('Metadata'),
                        'resolve' => function ($root)
                        {
                            return Arr::except($root->toArray(), ['data']);
                        }
                    ],
                'data' =>
                    [
                        'type' => Type::listOf(GraphQL::type('Projet')),
                        'resolve' => function ($root)
                        {
                            return $root;
                        }
                    ]
            ];
    }
}
