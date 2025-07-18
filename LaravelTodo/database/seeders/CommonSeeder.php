<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TaskStatus;
use App\Models\TaskPriority;
use App\Models\TaskCategory;

class CommonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $statuses = [
            'Completed' => '#05A301',
            'In Progress' => '#0225FF',
            'Not Started' => '#F21E1E',
        ];

        $categories = [
            'vital',  
        ];

        $priorities = [
            'Extreme' => '#F21E1E',
            'Modrate' => '#3ABEFF',
            'Low' => '#05A301'
        ];

        foreach( $statuses as $key => $status ) {
            TaskStatus::create([
                'title' => $key,
                'color_code' => $status 
            ]);
        }

        foreach ( $priorities as $key => $priority ) {
            TaskPriority::create([
                'title' => $key,
                'color_code' => $priority
            ]);
        }

        foreach( $categories as $category ) {
            TaskCategory::create([
                'title' => $category
            ]);

        }
    }
}
