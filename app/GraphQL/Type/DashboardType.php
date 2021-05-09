<?php
namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;


class DashboardType extends  GraphQLType
{
    protected $attributes = [
        'name' => 'Dashboard',
        'description' => ''
    ];

    public function fields()
    {
        return
            [
                'projets'                        => ['type' => Type::string(), 'description' => ''],
                'encours'                        => ['type' => Type::string(), 'description' => ''],
                'finalise'                       => ['type' => Type::string(), 'description' => ''],
            ];
    }
}
