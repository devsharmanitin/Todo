<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUsername = env('ADMIN_USERNAME', 'admin');
        $adminPassword = env('ADMIN_PASSWORD', 'password');
        $adminEmail = env('ADMIN_EMAIL', 'info@todogmail.com');

        // Check if the admin user already exists
        $admin = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Admin',
                'username' => $adminUsername,
                'password' => bcrypt($adminPassword), 
                'email_verified_at' => now(), 
            ]
        );

        // Assign the admin role to the user
        $admin->assignRole('admin');
    }
}
