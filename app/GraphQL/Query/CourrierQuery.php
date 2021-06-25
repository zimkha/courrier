<?php

namespace App\GraphQL\Query;

use App\Courrier;
use Carbon\Carbon;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class CourrierQuery extends Query
{
    protected $attributes = [
        'name' => 'courriers'
    ];

    public function type(): Type
    {
      return Type::listOf(GraphQL::type('Courrier'));
    }

    public function args(): array
    {
        return [
 
            'id'                     => ['type' => Type::int()],
            'reference'              => [ 'type' => Type::string()],
            'date_courrier'          => [ 'type' => Type::string()],
            'objet'                  => [ 'type' => Type::string()],
            'date_arrive'            => [ 'type' => Type::string()],
            'autre_instruction'      => [ 'type' => Type::string()],
            'expediteur'             => [ 'type' => Type::string(),],
            'destinataire'           => [ 'type' => Type::string(),],
            'date_depart'            => [ 'type' => Type::string(),],
            'status'                 => [ 'type' => Type::int(),],
            'numero'                 => [ 'type' => Type::int(),],
            'created_at'             => [ 'type' => Type::string()],
            'created_at_fr'          => [ 'type' => Type::string()],
            'updated_at'             => [ 'type' => Type::string()],
            'updated_at_fr'          => [ 'type' => Type::string()],
            'created_at_start'       => ['type' => Type::string()],
            'created_at_end'         => ['type' => Type::string()],
            'type'                   =>  [ 'type' => Type::string()], 

        ];
    }
    public function resolve($root, $args)
    {
      
       $query = Courrier::query();
      
       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['reference']))
       {
          $query = $query->where('reference', $args['reference']);
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
          $query = $query->where('expediteur', $args['expediteur']);
       }
       if (isset($args['status']))
       {
          $query = $query->where('status', $args['status']);
       }
       if (isset($args['numero']))
       {
          $query = $query->where('numero', $args['numero']);
       }
       if(isset($args['type'])) {
         $query = $query->where('type', $args['type']);
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
           $query->whereBetween('created_at', array($from, $to));
       }

      
       $query = $query->get();
       return $query->map(function (Courrier $item)
       {
           return 
           [
            'id'                       => $item->id,
            'reference'                => $item->reference,
            'numero'                   => $item->numero,
            'status'                   => $item->status,
            'expediteur'               => $item->expediteur,
            'date_courrier'            => $item->date_courrier,
            'objet'                    => $item->objet,
            'date_arrive'              => $item->date_arrive,
            'autre_instruction'        => $item->autre_instruction,
            'created_at'               => $item->created_at,
            'services'                 => $item->services,
            'type'                     => $item->type,
            'destinataire'             => $item->destinataire,
            'date_depart'              => $item->date_depart
        ];
      });
    }
  
}