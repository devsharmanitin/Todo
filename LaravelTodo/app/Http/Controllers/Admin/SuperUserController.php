<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SuperUserController extends Controller
{
    //
    public function dashboard() {
        $tasks = Task::all();
        $users = User::all();

        $total_tasks = $tasks->count();
        $total_users = $users->count();

        return response()->json([
            'users' => $users,
            'tasks' => $tasks,
            'task_count' => $total_tasks,
            'user_count' => $total_users
        ]);
    }
}
