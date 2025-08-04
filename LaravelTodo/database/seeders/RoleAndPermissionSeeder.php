<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'admin',
            'manager',
            'user',
        ];

        $permissions = [
            'create-task',
            'edit-task',
            'view-task',
            'assign-task',
            'view-progress',
        ];

        $this->assign_values($roles, Role::class, 'api');
        $this->assign_values($permissions, Permission::class, 'api');
    }

    public function assign_values(array $values, string $model, string $guard): void
    {
        foreach ($values as $value) {
            $model::firstOrCreate(['name' => $value, 'guard_name' => $guard]);
        }
    }
}
