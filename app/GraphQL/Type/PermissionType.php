<?php

namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;


class PermissionType extends GraphQLType
{

    protected $attributes = [
        'name' => 'Permission',
        'description' => ''
    ];

    public function fields(): array
    {
        return
        [
            'id'                    => ['type' => Type::id(), 'description' => ''],
            'name'                  => ['type' => Type::string(), 'description' => ''],
            'display_name'          => ['type' => Type::string(), 'description' => ''],
            'guard_name'            => ['type' => Type::string(), 'description' => ''],
            'roles'                 => ['type' => Type::listOf(GraphQL::type('Role')), 'description' => ''],

            'created_at'            => [ 'type' => Type::string(), 'description' => ''],
            'created_at_fr'         => [ 'type' => Type::string(), 'description' => ''],
            'updated_at'            => [ 'type' => Type::string(), 'description' => ''],
            'updated_at_fr'         => [ 'type' => Type::string(), 'description' => ''],
            'deleted_at'            => [ 'type' => Type::string(), 'description' => ''],
            'deleted_at_fr'         => [ 'type' => Type::string(), 'description' => ''],
        ];
    }
}
