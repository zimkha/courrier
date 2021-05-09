<?php

namespace App\GraphQL\Query;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Arr;
use App\Plan;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PlanPaginatedQuery extends Query
{
    protected $attributes = [
        'name' => 'planspaginated'
    ];

    public function type(): Type
    {

        return GraphQL::type('planpaginated');
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type' => Type::id()],
            'unite_mesure_id'        => ['type' => Type::id()],
            'code'                   => [ 'type' => Type::string(), 'description' => ''],
            'fichier'                => [ 'type' => Type::string(), 'description' => ''],
            'superficie'             => ['type' => Type::int()],
            'longeur'                => ['type' => Type::int()],
            'user_id'                => ['type' => Type::int()],
            'user_name'              => ['type' => Type::string()],
            'largeur'                => ['type' => Type::int()],
            'fichier'                => ['type' => Type::string()],
            'piscine'                => ['type' => Type::int()],
            'garage'                 => ['type' => Type::boolean()],

            'nb_pieces'              => ['type' => Type::int()],
            'nb_chambre'             => ['type' => Type::int()],
            'nb_toillette'           => ['type' => Type::int()],
            'nb_salon'               => ['type' => Type::int()],
            'nb_cuisine'             => ['type' => Type::int()],
            'nb_etage'               => ['type' => Type::int()],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'deleted_at'             => [ 'type' => Type::string()],

            'page'                   => ['type' => Type::int()],
            'count'                  => ['type' => Type::int()]
        ];
        
    }

    public function resolve($root, $args)
    {
      $query = Plan::with('niveau_plans');

       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['superficie']))
       {
          $query = $query->where('superficie', $args['superficie']);
       }
       if (isset($args['longeur']))
       {
          $query = $query->where('longeur', $args['longeur']);
       }
       if (isset($args['largeur']))
       {
          $query = $query->where('largeur', $args['largeur']);
       }
       if (isset($args['piscine']))
       {
          $query = $query->where('piscine', $args['piscine']);
       }
       if(isset($args['user_name']))
       {
          $plans_id = Plan::SelecvByName($args['user_name']);
          $query    = $query->where('id', $plans_id);
       }
       if (isset($args['nb_pieces'])) {
         $tab = DB::select(DB::raw("
         select sum(n.peice) as attr , n.plan_id as id from niveau_plans n GROUP By n.plan_id
         "));
         $array = [];
         foreach($tab as $elemnt)
         {
            if($elemnt->attr == $args['nb_pieces'])
            {
               array_push($array, $elemnt->id);
            }
         }
         $query = $query->whereIn('id',$array);
      }
      if(isset($args['nb_toillette']))
      {
         $tab = DB::select(DB::raw("
         select sum(n.toillette) as attr , n.plan_id as id from niveau_plans n GROUP By n.plan_id
         "));
         $array = [];
         foreach($tab as $elemnt)
         {
            if($elemnt->attr == $args['nb_toillette'])
            {
               array_push($array, $elemnt->id);
            }
         }
         $query = $query->whereIn('id',$array);
      }
      if(isset($args['nb_chambre']))
      {
         $tab = DB::select(DB::raw("
         select sum(n.chambre) as attr , n.plan_id as id from niveau_plans n GROUP By n.plan_id
         "));
         $array = [];
         foreach($tab as $elemnt)
         {
            if($elemnt->attr == $args['nb_chambre'])
            {
               array_push($array, $elemnt->id);
            }
         }
         $query = $query->whereIn('id',$array);
      }
     
      if(isset($args['nb_salon']))
      {
       
         $tab = DB::select(DB::raw("
         select sum(n.salon) as attr , n.plan_id as id from niveau_plans n GROUP By n.plan_id
         "));
         $array = [];
         foreach($tab as $elemnt)
         {
            if($elemnt->attr == $args['nb_salon'])
            {
               array_push($array, $elemnt->id);
            }
         }
         $query = $query->whereIn('id',$array); 
      }
      if(isset($args['nb_cuisine']))
      {
         $tab = DB::select(DB::raw("
         select sum(n.cuisine) as attr , n.plan_id as id from niveau_plans n GROUP By n.plan_id
         "));
         $array = [];
         foreach($tab as $elemnt)
         {
            if($elemnt->attr == $args['nb_cuisine'])
            {
               array_push($array, $elemnt->id);
            }
         }
         $query = $query->whereIn('id',$array);
      }
       
       $count = Arr::get($args, 'count', 10);
       $page  = Arr::get($args, 'page', 1);

       return $query->orderBy('created_at', 'desc')->paginate($count, ['*'], 'page', $page);
       
    }
}
