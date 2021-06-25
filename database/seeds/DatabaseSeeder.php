<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
       
            $this->call([
                 PermissionTableSeeder::class,
                 RoleTableSeeder::class,
                 DatabaseTableSeeder::class,
                 UsersTableSeeder::class,
                 DatabaseTableSeeder::class
            ]);
        
    }
}
