<?php

namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use App\Outil;

class ServiceGaucheType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Servicegauche',
    ];

    public function fields(): array
    {
        return [
            'id'                     => ['type' => Type::id(), 'description' => ''],
            'name'                   => ['type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            
            
        ];
    }
   
    protected function resolveCreatedAtFrField($root, $args)
    {
        if (!isset($root['created_at']))
        {
            $created_at = $root->created_at;

        }
        else
        {
            $created_at = $root['created_at'];
        }
        return Carbon::parse($created_at)->format('d/m/Y H:i');
    }


}