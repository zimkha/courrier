<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            array("name" => "liste-role", "display_name" => "Voir la liste des profils"),
            array("name" => "creation-role", "display_name" => "Créer un profil"),
            array("name" => "modification-role", "display_name" => "Modification d'un profil"),
            array("name" => "suppression-role", "display_name" => "supprimer un profil"),

            array("name" => "liste-courrier", "display_name" => "Voir la liste des courriers"),
            array("name" => "creation-courrier", "display_name" => "Créer un courrier"),
            array("name" => "modification-courrier", "display_name" => "Modification d'un courrier"),
            array("name" => "suppression-courrier", "display_name" => "supprimer un courrier"),
        ];

        foreach ($permissions as $permission)
        {
            $newitem = Permission::where('name', $permission['name'])->first();
            
            if (!isset($newitem))
            {
                Permission::create(['name' => $permission['name'], 'display_name' => $permission['display_name']]);
            }
            else
            {
                $newitem->display_name = $permission['display_name'];
                $newitem->save();
            }
        }
    }
}
