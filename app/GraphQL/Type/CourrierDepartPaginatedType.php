<?php
namespace App\GraphQL\Type;

use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use Illuminate\Support\Arr;

class CourrierDepartPaginatedType extends  GraphQLType
{
    protected $attributes = [
        'name'  => 'courrierdepartpaginated'
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
                        'type' => Type::listOf(GraphQL::type('Courrierdepart')),
                        'resolve' => function ($root)
                        {
                            return $root;
                        }
                    ]
            ];
    }
}
