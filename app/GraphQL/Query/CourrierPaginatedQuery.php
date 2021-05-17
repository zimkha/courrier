<?php

namespace App\GraphQL\Query;

use App\Courrier;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Arr;

class CourrierPaginatedQuery extends Query
{
    protected $attributes = [
        'name' => 'courrierspaginated'
    ];

    public function type(): Type
    {

        return GraphQL::type('courrierpaginated');
    }

    public function args(): array 
    {
        return
        [
          'id'                     => [ 'type' => Type::id()],
          'reference'              => [ 'type' => Type::string()],
          'date_courrier'          => [ 'type' => Type::string()],
          'objet'                  => [ 'type' => Type::string()],
          'date_arrive'            => [ 'type' => Type::string()],
          'autre_instruction'      => [ 'type' => Type::string()],
          'expediteur'             => [ 'type' => Type::string(),],
          'numero'                 => [ 'type' => Type::int(),],
          'created_at'             => [ 'type' => Type::string()],
          'created_at_fr'          => [ 'type' => Type::string()],
          'updated_at'             => [ 'type' => Type::string()],
          'updated_at_fr'          => [ 'type' => Type::string()],
          'created_at_start'       => ['type' => Type::string()],
          'created_at_end'         => ['type' => Type::string()],
          'page'                   => ['type' => Type::int()],
          'count'                  => ['type' => Type::int()]
        ];
        
    }

    public function resolve($root, $args)
    {
      $query = Courrier::query();
      
      if(isset($args['id'])) {
        $query = $query->where('reference', $args['id']);
      }
      if (isset($args['reference']))
      {
         $query = $query->where('reference', 'like' , '%' .$args['reference'].'%');
      }
      if (isset($args['date_arrive']))
      {
         $query = $query->where('date_arrive', $args['date_arrive']);
      }
      if (isset($args['autre_instruction']))
      {
         $query = $query->where('autre_instruction', $args['autre_instruction']);
      }
      if (isset($args['expediteur']))
      {
         $query = $query->where('expediteur',  'like' , '%'.$args['expediteur'].'%');
      }
      if (isset($args['numero']))
      {
         $query = $query->where('numero', 'like', '%'.$args['numero'].'%');
      }
      if (isset($args['created_at_start']) && isset($args['created_at_end']))
      {
          $from = $args['created_at_start'];
          $to = $args['created_at_end'];

          // Eventuellement la date fr
          $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
          $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

          $from = date($from.' 00:00:00');
          $to = date($to.' 23:59:59');
          $query->whereBetween('created_at', array($from, $to));
      }
      if(isset($args['date_start']) && isset($args['date_end']))
      {
          $from = $args['date_start'];
          $to = $args['date_end'];

          // Eventuellement la date fr
          $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
          $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

          $from = date($from.' 00:00:00');
          $to = date($to.' 23:59:59');
         $query =  $query->whereBetween('created_at', array($from, $to));
      }

     
       $count = Arr::get($args, 'count', 10);
       $page  = Arr::get($args, 'page', 1);

       return $query->orderBy('created_at', 'desc')->paginate($count, ['*'], 'page', $page);
       
    }
}
