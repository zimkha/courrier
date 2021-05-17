<?php

namespace App\GraphQL\Type;


use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;;
use App\Outil;

class UserType extends GraphQLType
{
    protected $attributes = [
        'name' => 'User',
     
    ];
   public function fields(): array
   {
       return  [
           'id'                            => ['type' => Type::int()],
           'name'                          => ['type' => Type::string()],
           'active'                        => ['type' => Type::boolean(), 'description' => ''],
           'email'                         => ['type' => Type::string()],
           'password'                      => ['type' => Type::string()],
           'nci'                           => ['type' => Type::string()],
           'last_login'                    => ['type' => Type::string(), 'description' => ''],
           'last_login_ip'                 => ['type' => Type::string(), 'description' => ''],
           'image'                         => ['type' => Type::string(), 'description' => ''],
           'is_client'                     => ['type' => Type::boolean(), 'description' => ''],
           'nom'                           => ['type' => Type::string(), 'description' => ''],
           'prenom'                        => ['type' => Type::string(), 'description' => ''],
           'telephone'                     => ['type' => Type::string(), 'description' => ''],
           'pays'                          => ['type' => Type::string(), 'description' => ''],
           'adresse_complet'                => ['type' => Type::string(), 'description' => ''],
           'code_postal'                   => ['type' => Type::string(), 'description' => ''],

           'roles'                         => ['type' =>Type::listOf(GraphQL::type('Role')), 'description' => ''],
           'projets'                       => ['type'  => Type::listOf(GraphQL::type('Projet'))],
        //    'plan_chantiers'                => ['type'  => Type::listOf(GraphQL::type('Planchantier'))],


           'created_at'                    => [ 'type' => Type::string(), 'description' => ''],
           'created_at_fr'                 => [ 'type' => Type::string(), 'description' => ''],
           'updated_at'                    => [ 'type' => Type::string(), 'description' => ''],
           'updated_at_fr'                 => [ 'type' => Type::string(), 'description' => ''],
           'deleted_at'                    => [ 'type' => Type::string(), 'description' => ''],
           'deleted_at_fr'                 => [ 'type' => Type::string(), 'description' => ''],
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
        return Carbon::parse($created_at)->format('d/m/Y h:i:s');
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

    protected function resolveUpdatedAtFrField($root, $args)
    {
        if (!isset($root['created_at']))
        {
            $date_at = $root->created_at;
        }
        else
        {
            $date_at = $root['created_at'];
        }
        return Carbon::parse($date_at)->format('d/m/Y h:i:s');
    }

    protected function resolveDeletedAtField($root, $args)
    {
        if (!isset($root['deleted_at']))
        {
            $date_at = $root->updated_at;
        }
        else
        {
            $date_at = is_string($root['deleted_at']) ? $root['deleted_at'] : $root['deleted_at']->format(Outil::formatdate());
        }
        return $date_at;
    }


    protected function resolveDeletedAtFrField($root, $args)
    {
        if (!isset($root['deleted_at']))
        {
            $date_at = $root->created_at;
        }
        else
        {
            $date_at = $root['deleted_at'];
        }
        return Carbon::parse($date_at)->format('d/m/Y h:i:s');
    }

    protected function resolveLastLoginField($root, $args)
    {
        if (isset($args['last_login']))
        {
            $last_login = $root->last_login;
        }
        else
        {
            $last_login = $root['last_login'];
        }
        return Carbon::parse($last_login)->format('d/m/Y h:i:s');
    }


    public function resolveImageField($root, $args)
    {
        if (isset($args['image']))
        {
            $image = $root->image;
        }
        else
        {
            $image = $root['image'];
        }
        if ($image==null)
        {
            $image = "assets/images/upload.jpg";
        }
        else
        {
            // Dans le cas où une image existe en base, en versionnise
            $image = $image.'?date='.(date('Y-m-d H:i'));
        }

        if (isset($image))
            return Outil::getAPI().$image;
        return $image;
    }

 
}
