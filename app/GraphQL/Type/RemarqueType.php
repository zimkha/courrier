<?php

namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class RemarqueType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Remarque',
    ];

    public function fields(): array
    {
        return [
            
            'id'                     => ['type'  => Type::id()],
            'projet_id'              => ['type'  => Type::int()],
            'type_remarque_id'       => ['type'  => Type::int()],
            
            'projet'                 => ['type' => GraphQL::type('Projet')],
            'type_remarque'          => ['type' => GraphQL::type('Typeremarque')],
            'fichier'                => ['type'  => Type::string()],
            'demande_text'           => ['type'  => Type::string()],

            'created_at'             => ['type'  => Type::string()],
            'created_at_fr'          => ['type'  => Type::string()],
            'updated_at'             => ['type'  => Type::string()],
            'updated_at_fr'          => ['type'  => Type::string()],
            'deleted_at'             => ['type'  => Type::string()],
           
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