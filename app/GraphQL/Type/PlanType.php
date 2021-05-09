<?php

namespace App\GraphQL\Type;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use App\Plan;
use App\NiveauPlan;
use Carbon\Carbon;
class PlanType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Plan',
        'description' => 'Plan de projet'
    ];

    public function fields(): array
    {
        return [
            'id'                     => ['type' => Type::id()],
            'unite_mesure_id'        => ['type' => Type::id()],
            'fichier'                => [ 'type' => Type::string(), 'description' => ''],
            'code'                   => [ 'type' => Type::string(), 'description' => ''],

            'superficie'             => ['type' => Type::int()],
            'sdb'                    => ['type' => Type::int()],
            'longeur'                => ['type' => Type::int()],
            'largeur'                => ['type' => Type::int()],
            'piscine'                => ['type' => Type::int()],
            'garage'                 => ['type' => Type::boolean()],
            'fichier'                => ['type' => Type::string()],
            'niveau_plans'           => ['type' => Type::listOf(GraphQL::type('Niveauplan'))],
            'plan_projets'            => ['type' => Type::listOf(GraphQL::type('Planprojet'))],
            'joineds'                => ['type' => Type::listOf(GraphQL::type('Joined'))],
            'unite_mesure'           => ['type' => GraphQL::type('Unitemesure')],

            // Resolve 
            'nb_pieces'               => ['type' => Type::int()],
            'nb_chambre'              => ['type' => Type::int()],
            'nb_toillette'            => ['type' => Type::int()],
            'nb_salon'                => ['type' => Type::int()],
            'nb_cuisine'              => ['type' => Type::int()],
            'nb_etage'                => ['type' => Type::int()],

            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],
           
        ];
    }

    public function resolveNbPiecesField($root, $args)
    {
        if (!isset($root['id']))
        {
            $plan_id = $root->id;
        }
        else
        {
            $plan_id = $root['id'];
        }
        $attribut = "piece";
        $nbr =  Plan::nb_attribut($plan_id, $attribut);
        return $nbr;
    }
    public function resolveNbChambreField($root, $args)
    {
        if (!isset($root['id']))
        {
            $plan_id = $root->id;
        }
        else
        {
            $plan_id = $root['id'];
        }
        $attribut = "chambre";
        $nbr =  Plan::nb_attribut($plan_id, $attribut);
        return $nbr; 
    }

    public function resolveNbSalonField($root, $args)
    {
        if (!isset($root['id']))
        {
            $plan_id = $root->id;
        }
        else
        {
            $plan_id = $root['id'];
        }
        $attribut = "salon";
        $nbr =  Plan::nb_attribut($plan_id, $attribut);
        return $nbr; 
    }

    public function resolveNbCuisineField($root, $args)
    {
        if (!isset($root['id']))
        {
            $plan_id = $root->id;
        }
        else
        {
            $plan_id = $root['id'];
        }
        $attribut = "cuisine";
        $nbr =  Plan::nb_attribut($plan_id, $attribut);
        return $nbr; 
    }
    public function resolveNbToilletteField($root, $args)
    {
        if (!isset($root['id']))
        {
            $plan_id = $root->id;
        }
        else
        {
            $plan_id = $root['id'];
        }
        $attribut = "toillette";
        $nbr =  Plan::nb_attribut($plan_id, $attribut);
        return $nbr; 
    }
    public function resolveNbEtageField($root, $args)
    {
        if (!isset($root['id']))
        {
            $plan_id = $root->id;
        }
        else
        {
            $plan_id = $root['id'];
        }
        return  NiveauPlan::where('plan_id', $plan_id)->count();
        
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