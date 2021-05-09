<?php

namespace App\GraphQL\Type;

use GraphQL;
use App\Chantier;
use Carbon\Carbon;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
class ChantierType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Chantier',
    ];

    public function fields(): array
    {
        return [

            'id'                     => [ 'type' => Type::int()],
            'user_id'                => [ 'type' => Type::int()],
            'etat'                   => [ 'type' => Type::int()],
            'fichier'                => [ 'type' => Type::string(),],
            'user'                   => [ 'type' => GraphQL::type('User')], 
            'date_begin'             => [ 'type' => Type::string()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'estime'                 => [ 'type' => Type::boolean()],
            'finance'                => [ 'type' => Type::boolean()],
            'contrat'                => [ 'type' => Type::boolean()],


                     
        ];
    }

    public function resolveEstimeField($root,$args)
    {
        $model = "DeviseEstime";
        if (!isset($root['id']))
        {
            $chantier_id = $root->id;
        }
        else
        {
            $chantier_id = $root['id'];
        }
        $exist = Chantier::CheckExist($chantier_id,$moodel);
        return $exist;
    }
    public function resolveFinanceField($root,$args)
    {
        $model = "DeviseFinance";
        if (!isset($root['id']))
        {
            $chantier_id = $root->id;
        }
        else
        {
            $chantier_id = $root['id'];
        }
        $exist = Chantier::CheckExist($chantier_id,$moodel);
        return $exist;
    }
    public function resolveContratField($root,$args)
    {
        $model = "ContratExecution";
        if (!isset($root['id']))
        {
            $chantier_id = $root->id;
        }
        else
        {
            $chantier_id = $root['id'];
        }
        $exist = Chantier::CheckExist($chantier_id,$moodel);
        return $exist;
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
    protected function resolveDateBeginField($root, $args)
    {
        if (!isset($root['date_begin']))
        {
            $date_at = $root->date_begin;
        }
        else
        {
            $date_at = is_string($root['date_begin']) ? $root['date_begin'] : $root['date_begin']->format(Outil::formatdate());
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