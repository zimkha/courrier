<?php

namespace App\GraphQL\Type;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use GraphQL;


class Metadata extends GraphQLType
{
    protected $attributes = [
        'name' => 'Metadata'
    ];

    public function fields(): array
    {
        return [
            'total' => [
                'type' => Type::int(),
                'description' => 'The total number of items'
            ],
            'per_page' => [
                'type' => Type::int(),
                'description' => 'The count on a page'
            ],
            'current_page' => [
                'type' => Type::int(),
                'description' => 'The current page'
            ],
            'last_page' => [
                'type' => Type::int(),
                'description' => 'The last page'
            ]
        ];
    }
}
