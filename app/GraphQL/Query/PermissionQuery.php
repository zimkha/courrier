<?php

namespace App\GraphQL\Query;

use App\Outil;
use \Spatie\Permission\Models\Permission;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class PermissionQuery extends Query
{
    protected $attributes = [
        'name' => 'permissions'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Permission'));
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
        $query = Permission::with('roles');

        if (isset($args['id']))
        {
            $query = $query->where('id', $args['id']);
        }

        $query = $query->get();

        return $query->map(function (Permission $item)
        {
            return
            [
                'id'                     => $item->id,
                'name'                   => $item->name,
                'display_name'           => $item->display_name,
                'guard_name'             => $item->guard_name,
                'roles'                  => $item->roles,

                'created_at'             => $item->created_at->format(Outil::formatdate()),
                'updated_at'             => $item->updated_at->format(Outil::formatdate()),
                'deleted_at'             => empty($item->deleted_at) ? $item->deleted_at : $item->deleted_at->format(Outil::formatdate()),
            ];
        });
    }
}
