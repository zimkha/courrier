<?php

namespace App\GraphQL\Type;

use GraphQL;
use App\Courrier;
use Carbon\Carbon;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class CourrierType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Courrier',
    ];

    public function fields(): array
    {
        return [

          'id'                     => [ 'type' => Type::int()],
          'reference'              => [ 'type' => Type::string()],
          'date_courrier'          => [ 'type' => Type::string()],
          'objet'                  => [ 'type' => Type::string()],
          'date_arrive'            => [ 'type' => Type::string()],
          'autre_instruction'      => [ 'type' => Type::string()],
          'expediteur'             => [ 'type' => Type::string(),],
          'numero'                 => [ 'type' => Type::int(),],
          'status'                 => [ 'type' => Type::int(),],
          'created_at'             => [ 'type' => Type::string()],
          'created_at_fr'          => [ 'type' => Type::string()],
          'updated_at'             => [ 'type' => Type::string()],
          'updated_at_fr'          => [ 'type' => Type::string()],
          'services'               => ['type'  => Type::listOf(GraphQL::type('Service'))],
          'status_title'           =>  [ 'type' => Type::string()], 
          'type'                   =>  [ 'type' => Type::string()], 
          'destinataire'           => [ 'type' => Type::string(),],
          'date_depart'            => [ 'type' => Type::string(),],



                     
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
    protected function resolveStatusTitleField($root, $args)
    {
       $title = 'No Tratite';
       if (!isset($root['status']))
       {
           $status = $root->status;
       }
       else {
         $status = $root['status'];
       }
       if($status == 1 )
       {
         $title = 'En Attente';
       }
       elseif($status == 2){
         $title = "Traité";
       }
       return $title;

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