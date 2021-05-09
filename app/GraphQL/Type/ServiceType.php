<?php

namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class ServiceType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Service',
    ];

    public function fields(): array
    {
        return [
            'id'                     => ['type' => Type::id(), 'description' => ''],
            'service'                   => ['type' => Type::string()],
            'courrier_id'            => [ 'type' => Type::int()],
            'service_gauche_id'      => [ 'type' => Type::int()],
            'service_droite_id'      => [ 'type' => Type::int()],

            'courrier'               => ['type' => GraphQL::type('Courrier')],
            'service_gauche'         => ['type' => GraphQL::type('Servicegauche')],
            'service_droite'         => ['type' => GraphQL::type('Servicedroite')],

            'created_at'             => [ 'type' => Type::string(), 'description' => ''],
            'created_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            'updated_at'             => [ 'type' => Type::string(), 'description' => ''],
            'updated_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            
        ];
    }
    protected function resolveCreatedAtField($root, $args)
    {
        if (!isset($root['created_at']))
        {
            $date_at = $root->created_at;
        }
        else
        {
            $date_at = is_string($root['created_at']) ? $root['created_at'] : $root['created_at']->format(Outil::formatdate());
        }
        return $date_at;
    }
    protected function resolveUpdatedAtField($root, $args)
    {
        if (!isset($root['updated_at']))
        {
            $date_at = $root->updated_at;
        }
        else
        {
            $date_at = is_string($root['updated_at']) ? $root['updated_at'] : $root['updated_at']->format(Outil::formatdate());
        }
        return $date_at;
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