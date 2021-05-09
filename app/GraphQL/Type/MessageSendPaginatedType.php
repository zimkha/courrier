<?php
namespace App\GraphQL\Type;

use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use Illuminate\Support\Arr;

class MessageSendPaginatedType extends  GraphQLType
{
    protected $attributes = [
        'name'  => 'messagesendpaginated'
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
                        'type' => Type::listOf(GraphQL::type('Messagesend')),
                        'resolve' => function ($root)
                        {
                            return $root;
                        }
                    ]
            ];
    }
}
