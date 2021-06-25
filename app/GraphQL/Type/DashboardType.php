<?php

namespace App\GraphQL\Type;

use GraphQL;
use App\Courrier;
use Carbon\Carbon;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class DashboardType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Dashboard',
    ];

    public function fields(): array
    {
      return
      [
          'depart'                    => ['type' => Type::string(), 'description' => ''],
          'arrive'                    => ['type' => Type::string(), 'description' => ''],
          'encours'                   => ['type' => Type::string(), 'description' => ''],
          'total'                     => ['type' => Type::string(), 'description' => ''],

      ];
    }

}