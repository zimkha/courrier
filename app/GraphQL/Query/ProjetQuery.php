<?php

namespace App\GraphQL\Query;

use App\Outil;
use App\Projet;
use App\User;
use GraphQL;
use GraphQL\Type\Definition\Type;
use App\PlanProjet;
use Rebing\GraphQL\Support\Query;


class ProjetQuery extends Query
{
    protected $attributes = [
        'name' => 'projets'
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Projet'));
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
            'id_user'                =>  ['type' => Type::int()],
            'garage'                 => ['type' => Type::boolean()],


            'montant'              => ['type' => Type::int()],
            'contrat'                => ['type' => Type::boolean()],

            'electricite'            => ['type' => Type::boolean()],
            'acces_voirie'           => ['type' => Type::boolean()],
            'assainissement'         => ['type' => Type::boolean()],
            'geometre'               => ['type' => Type::boolean()],
            'courant_faible'         => ['type' => Type::boolean()],
            'bornes_visible'         => ['type' => Type::boolean()],
            'necessite_bornage'      => ['type' => Type::boolean()],
            'piscine'                => ['type' => Type::boolean()],
            'garage'                 => ['type' => Type::boolean()],

            'eaux_pluviable'         => ['type' => Type::boolean()],
            



            'created_at'             => ['type'  => Type::string()],
            'created_at_start'       => ['type'  => Type::string()],
            'created_at_end'         => ['type'  => Type::string()],
            'created_at_fr'          => ['type'  => Type::string()],
            'updated_at'             => ['type'  => Type::string()],
            'updated_at_fr'          => ['type'  => Type::string()],
            'deleted_at'             => ['type'  => Type::string()],


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
       if(isset($args['id_user']))
       {
          $query = $query->where('id_user', $args['id_user']);
       }
       if (isset($args['active']))
       {
          $query = $query->where('active', $args['active']);
       }
       if (isset($args['etat']))
       {
          $query = $query->where('etat', $args['etat']);
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
        if (isset($args['telephone']))
       {
          $query = $query->whereIn('user_id', User::where('telephone',  Outil::getOperateurLikeDB(), '%'.$args['telephone'].'%')->get(['id']));
       }
        if (isset($args['code_postal']))
       {
          $query = $query->whereIn('user_id', User::where('code_postal',  Outil::getOperateurLikeDB(), '%'.$args['code_postal'].'%')->get(['id']));
       }
       if(isset($args['adresse_terrain']))
       {
          $query = $query->where('adresse_terrain',  Outil::getOperateurLikeDB(), '%'.$args['name']. '%');
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
       $query = $query->get();
       return $query->map(function (Projet $item)
       {
           return
           [
            'id'                     => $item->id,
            'user_id'                => $item->user_id,
            'superficie'             => $item->superficie,
            'joineds'                => $item->joindes,
            'longeur'                => $item->longeur,
            'name'                   => $item->name,
            'largeur'                => $item->largeur,
            'user'                   => $item->user,
            'active'                 => $item->active,
            'text_projet'            => $item->text_projet,
            'fichier'                => $item->fichier,
            'etat'                   => $item->etat,
            'niveau_projets'         => $item->niveau_projets,
            'plan_projets'           => $item->plan_projets,
            'created_at'             => $item->created_at,
            'adresse_terrain'        => $item->adresse_terrain,
            'remarques'              => $item->remarques,
            'sdb'                    => $item->sdb,
            'assainissement'         => $item->assainissement,
            'electricte'             => $item->electricte,
            'eaux_pluvial'           => $item->eaux_pluvial,
            'bornes_visible'         => $item->bornes_visible,
            'necessite_bornage'      => $item->necessite_bornage,
            'courant_faible'         => $item->courant_faible,
            'acces_voirie'           => $item->acces_voirie,
            'geometre'               => $item->geometre,
            'garage'                 => $item->garage,
            'piscine'                => $item->piscine,
            'contrat'                => $item->contrat,
            'positions'              => $item->positions,
            'montant'                => $item->montant,

        ];
      });
    }
}
