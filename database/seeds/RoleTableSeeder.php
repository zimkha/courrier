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
        $item = Role::where('name', 'super-admin')->first();
        if (!isset($item)) {
            $role = \Spatie\Permission\Models\Role::create(['name' => 'super-admin']);
            $role->givePermissionTo(Permission::all());
        }
       
    }
}


