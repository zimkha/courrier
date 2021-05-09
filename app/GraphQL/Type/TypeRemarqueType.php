<?php

namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class TypeRemarqueType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Typeremarque',
    ];

    public function fields(): array
    {
        return [
            'id'                     => ['type' => Type::id(), 'description' => ''],
            'name'                => ['type' => Type::string()],
            // 'remarques'           => ['type' => Type::listOf(GraphQL::type('Remarque')), 'description' => ''],


            'created_at'             => [ 'type' => Type::string(), 'description' => ''],
            'created_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            'updated_at'             => [ 'type' => Type::string(), 'description' => ''],
            'updated_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
            'deleted_at'             => [ 'type' => Type::string(), 'description' => ''],
            'deleted_at_fr'          => [ 'type' => Type::string(), 'description' => ''],
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