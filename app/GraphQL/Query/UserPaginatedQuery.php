<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Arr;


class UserPaginatedQuery extends Query
{
    protected $attributes = [
        'name' => 'userspaginated'
    ];

    public function type(): Type
    {
        return GraphQL::type('userpaginated');
    }

    public function args(): array
    {
        return
            [
                'id'                           => ['type' => Type::int()],
                'name'                         => ['type' => Type::string()],
                'email'                        => ['type' => Type::string()],
                'search'                       => ['type' => Type::string()],
                'role_id'                      => ['type' => Type::int()],
                'nci'                   => ['type' => Type::string()],
                'is_client'                    => ['type' => Type::boolean(), 'description' => ''],
                'nom'                          => ['type' => Type::string(), 'description' => ''],
                'prenom'                       => ['type' => Type::string(), 'description' => ''],
                'telephone'                    => ['type' => Type::string(), 'description' => ''],
                'pays'                         => ['type' => Type::string(), 'description' => ''],
                'adresse_complet'               => ['type' => Type::string(), 'description' => ''],
                'code_postal'                  => ['type' => Type::string(), 'description' => ''],
                'page'                         => ['type' => Type::int()],
                'count'                        => ['type' => Type::int()],
            ];
    }

    public function resolve($root, $args)
    {
        $query = User::with('roles')->where('is_client', '!=', false);

        if(isset($args['id']))
        {
            $query = $query->where('id', $args['id']);
        }
         if (isset($args['is_client']))
        {
            $query = $query->where('is_client', $args['is_client']);
        }
        if (isset($args['role_id']))
        {
            $role_id = $args['role_id'];
            $query = $query->whereHas('roles', function ($query) use ($role_id)
            {
                $query->where('id', $role_id);
            });
        }
        if (isset($args['name']))
        {
            $query = $query->where('name', Outil::getOperateurLikeDB(), '%'.$args['name'].'%');
        }
        if (isset($args['email']))
        {
            $query = $query->where('email', Outil::getOperateurLikeDB(), '%'.$args['email'].'%');
        }
        if (isset($args['search']))
        {
            $query = $query->where('name', Outil::getOperateurLikeDB(),'%'. $args['search'] . '%')
                ->orWhere('email', Outil::getOperateurLikeDB(),'%'. $args['search'] . '%');
        }
         if (isset($args['nom']))
        {
            $query = $query->where('nom', Outil::getOperateurLikeDB(), '%'.$args['nom'].'%');
        }
         if (isset($args['prenom']))
        {
            $query = $query->where('prenom', Outil::getOperateurLikeDB(), '%'.$args['prenom'].'%');
        }
         if (isset($args['pays']))
        {
            $query = $query->where('pays', Outil::getOperateurLikeDB(), '%'.$args['pays'].'%');
        }
         if (isset($args['telephone']))
        {
            $query = $query->where('telephone', Outil::getOperateurLikeDB(), '%'.$args['telephone'].'%');
        }
        if (isset($args['code_postal']))
        {
            $query = $query->where('code_postal', Outil::getOperateurLikeDB(), '%'.$args['code_postal'].'%');
        }
        if (isset($args['adress_complet']))
        {
            $query = $query->where('adress_complet', Outil::getOperateurLikeDB(), '%'.$args['adress_complet'].'%');
        }


        $count = Arr::get($args, 'count', 10);
        $page  = Arr::get($args, 'page', 1);


        return $query->orderBy('id', 'desc')->paginate($count, ['*'], 'page', $page);
    }


}
