<?php

namespace App\GraphQL\Query;

use App\Outil;
use Spatie\Permission\Models\Role;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;


class RoleQuery extends Query
{
    protected $attributes = [
        'name' => 'roles'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Role'));
    }

    public function args(): array 
    {
        return
        [
            'id'       => ['type' => Type::int()],
        ];
    }

    public function resolve($root, $args)
    {
        $query = Role::with('permissions');

        if (isset($args['id']))
        {
            $query = $query->where('id', $args['id']);
        }

        $query = $query->get();

        return $query->map(function (Role $item)
        {
            return
            [
                'id'                     => $item->id,
                'name'                   => $item->name,
                'guard_name'             => $item->guard_name,
                'permissions'            => $item->permissions,

                'created_at'             => $item->created_at->format(Outil::formatdate()),
                'updated_at'             => $item->updated_at->format(Outil::formatdate()),
                'deleted_at'             => empty($item->deleted_at) ? $item->deleted_at : $item->deleted_at->format(Outil::formatdate()),
            ];
        });
    }
}
