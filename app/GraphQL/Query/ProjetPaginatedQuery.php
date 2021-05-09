<?php

namespace App\GraphQL\Query;

use App\Projet;
use App\User;
use App\Outil;
use App\PlanProjet;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Arr;


class ProjetPaginatedQuery extends Query
{
	 protected $attributes = [
        'name' => 'projetspaginated'
    ];

    public function type(): Type
    {

        return GraphQL::type('projetpaginated');
    }

    public function args(): array 
    {
        return
        [
            'id'                     => ['type'  => Type::id()],
            'user_id'                => ['type'  => Type::int()],
            'text_projet'            => ['type'  => Type::string()],
            'adresse_terrain'        => ['type'  => Type::string()],
            'sdb'                    => ['type' => Type::int()],
            'id_user'                =>  ['type' => Type::int()],

            'name'                   => ['type'  => Type::string()],
            'fichier'                => ['type'  => Type::string()],
            'active'                 => ['type'  => Type::boolean()],
            'etat'                   => ['type'  => Type::int()],
            'superficie'             => ['type' => Type::int()],
            'longeur'                => ['type' => Type::int()],
            'largeur'                => ['type' => Type::int()],
            'plan_id'                => ['type' => Type::int()],
            'email'                  => ['type' => Type::string()],
            'name'                   => ['type' => Type::string()],
            'prenom'                 => ['type' => Type::string()],
            'pays'                   => ['type' => Type::string()],
            'adress_complet'         => ['type' => Type::string()],
            'telephone'              => ['type' => Type::string()],
            'code_postal'            => ['type' => Type::string()],
            'electricite'            => ['type' => Type::boolean()],
            'acces_voirie'           => ['type' => Type::boolean()],
            'assainissement'         => ['type' => Type::boolean()],
            'geometre'               => ['type' => Type::boolean()],
            'courant_faible'         => ['type' => Type::boolean()],
            'bornes_visible'         => ['type' => Type::boolean()],
            'eaux_pluviable'         => ['type' => Type::boolean()],
            'necessite_bornage'      => ['type' => Type::boolean()],
            'piscine'                => ['type' => Type::boolean()],
            'garage'                 => ['type' => Type::boolean()],
            'contrat'                => ['type' => Type::boolean()],

            'montant'              => ['type' => Type::int()],

          
            'created_at'             => ['type'  => Type::string()],
            'created_at_start'       => ['type'  => Type::string()],
            'created_at_end'         => ['type'  => Type::string()],
            'created_at_fr'          => ['type'  => Type::string()],
            'updated_at'             => ['type'  => Type::string()],
            'updated_at_fr'          => ['type'  => Type::string()],
            'deleted_at'             => ['type'  => Type::string()],

            'page'                => ['type' => Type::int()],
            'count'               => ['type' => Type::int()]
        ];
        
    }
     public function resolve($root, $args)
    {
       $query = Projet::with('niveau_projets');

       if (isset($args['id']))
       {
          $query = $query->where('id', $args['id']);
       }
       if (isset($args['user_id']))
       {
          $query = $query->where('user_id', $args['user_id']);
       }
       if (isset($args['active']))
       {
          $query = $query->where('active', $args['active']);
       }
       if (isset($args['etat']))
       {
          $query = $query->where('etat', $args['etat']);
       }
       if(isset($args['id_user']))
       {
          $query = $query->where('id_user', $args['id_user']);
       }
        if (isset($args['email']))
       {
          $query = $query->whereIn('user_id', User::where('email',  Outil::getOperateurLikeDB(), '%'.$args['email'].'%')->get(['id']));
       }
       if (isset($args['nom']))
       {
          $query = $query->whereIn('user_id', User::where('nom',  Outil::getOperateurLikeDB(), '%'.$args['nom'].'%')->get(['id']));
       }
       if (isset($args['prenom']))
       {
          $query = $query->whereIn('user_id', User::where('prenom',  Outil::getOperateurLikeDB(), '%'.$args['prenom'].'%')->get(['id']));
       }
       if (isset($args['pays']))
       {
          $query = $query->whereIn('user_id', User::where('pays',  Outil::getOperateurLikeDB(), '%'.$args['pays'].'%')->get(['id']));
       }
       if (isset($args['adresse_complet']))
       {
          $query = $query->whereIn('user_id', User::where('adresse_complet',  Outil::getOperateurLikeDB(), '%'.$args['adresse_complet'].'%')->get(['id']));
       }
       if(isset($args['name']))
       {
        $query = $query->where('name',  Outil::getOperateurLikeDB(), '%'.$args['name']. '%');
      }
       if(isset($args['adresse_terrain']))
       {
          $query = $query->where('adresse_terrain',  Outil::getOperateurLikeDB(), '%'.$args['adresse_terrain']. '%');
       }
        if (isset($args['telephone']))
       {
          $query = $query->whereIn('user_id', User::where('telephone',  Outil::getOperateurLikeDB(), '%'.$args['telephone'].'%')->get(['id']));
       }
        if (isset($args['code_postal']))
       {
          $query = $query->whereIn('user_id', User::where('code_postal',  Outil::getOperateurLikeDB(), '%'.$args['code_postal'].'%')->get(['id']));
       }
       if (isset($args['plan_id']))
       {
          $query = $query->whereIn('id', PlanProjet::where('plan_id', $args['plan_id'])->get('projet_id'));
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
      
       $count = Arr::get($args, 'count', 10);
       $page  = Arr::get($args, 'page', 1);

       return $query->orderBy('created_at', 'desc')->paginate($count, ['*'], 'page', $page);
      }
}