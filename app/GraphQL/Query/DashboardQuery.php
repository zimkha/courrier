<?php


use App\Outil;
use App\Projet;
use App\User;
use GraphQL;
use GraphQL\Type\Definition\Type;
use App\PlanProjet;
use Rebing\GraphQL\Support\Query;


class DashboardQuery extends Query
{
    protected $attributes = [
        'name' => 'dashboards'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Dashboard'));
    }

    public function args()
    {
        return
            [
                'date_day'           => ['type' => Type::string()],
                'date_month'         => ['type' => Type::string()],
                'date_year'          => ['type' => Type::string()],
                'current_day'        => ['type' => Type::boolean()],
                'current_month'      => ['type' => Type::boolean()],
                'current_year'       => ['type' => Type::boolean()],
                'restaurant_id'      => ['type' => Type::int()],
            ];
    }

    public function resolve()
    {
        // A partir des fonctions qui permettron de recuper des elements pour le dashboar
    }
}