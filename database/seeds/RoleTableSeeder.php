<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      
        $role = \Spatie\Permission\Models\Role::create(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());

        $admin   = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());
        $admin->revokePermissionTo(Permission::whereIn('name', ['creation-courrier'])->get());

             
    }
}


