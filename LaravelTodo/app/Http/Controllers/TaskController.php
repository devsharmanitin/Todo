<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\TaskCategory;
use App\Models\TaskPriority;
use App\Models\TaskStatus;
use App\Models\User;
use App\Models\Task;

class TaskController extends Controller
{
    //
    private function validate( Request $request, $isUpdate = false) {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id',
            'status_id' => 'nullable|exists:task_statuses,id',
            'priority_id' => 'required|exists:task_priorities,id',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'is_vital' => 'sometimes|boolean',
            'image' => 'sometimes|array',
            'image.*' => 'image|max:2048',
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id',
        ];


        if ($isUpdate) {
            // Optionally change rules for update (e.g. make some fields nullable)
            $rules['title'] = 'required|string|max:255';
            $rules['priority_id'] = 'required|exists:task_priorities,id';
            $rules['description'] = 'sometimes|string';
            $rules['category_id'] = 'required|exists:task_categories,id';
            
        }

        return Validator::make($request->all(), $rules);
    }

    public function create() {
        $categories = DB::table('task_categories')->select('id', 'title')->get();
        $priorities = DB::table('task_priorities')->select('id', 'title','color_code')->get();
        $statuses   = DB::table('task_statuses')->select('id', 'title', 'color_code')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data fetched successfully',
            'data'      => [
                'categories' => $categories,
                'priorities' => $priorities,
                'statuses'   => $statuses,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = $this->validate($request, false);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $user = Auth::user();

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $files = $request->file('image');
            
                // Get the last uploaded file from the array
                $lastFile = end($files);
            
                // Store the last image and assign to the `image` field
                $data['image'] = $lastFile->store('tasks', 'public');
            }

            $data['status'] = TaskStatus::where('title', 'Not Started')->value('id');
            $task = Task::create($data);

            $assigningUsers = collect($data['assigned_users'] ?? [])
                ->push($user->id)
                ->unique();

            foreach ($assigningUsers as $userId) {
                $permissions = ($userId == $user->id)
                    ? Task::PERMISSIONS
                    : ['CAN_VIEW' => true];

                $task->assignedUsers()->syncWithoutDetaching([
                    $userId => $permissions
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task created successfully',
                'task' => $task->load(['category', 'status', 'priority', 'assignedUsers']),
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Task creation failed',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, int $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('CAN_EDIT', $task);

        $validator = $this->validate($request, true); 

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('tasks', 'public');
            }

            $task->update($data);

            if (!empty($data['assigned_users'])) {
                $currentUserId = Auth::id();
                $newAssignees = collect($data['assigned_users'])->unique();

                // Detach users not in the new list
                $task->assignedUsers()->whereNotIn('user_id', $newAssignees)->detach();

                // Reattach users with appropriate permissions
                foreach ($newAssignees as $userId) {
                    $permissions = ($userId == $currentUserId)
                        ? Task::PERMISSIONS
                        : ['CAN_VIEW' => true]; // Default for collaborators

                    $task->assignedUsers()->syncWithoutDetaching([
                        $userId => $permissions
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully',
                'task' => $task->load(['category', 'status', 'priority', 'assignedUsers']),
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Task update failed',
                'error' => $th->getMessage(),
            ], 500);
        }
    }


    public function destroy( Reqeust $request , int $id) {
        try {
            Db::beginTransaction();

            $task = Task::with(['assignedUsers'])->findOrFail($id);

            $task->assignedUsers()->detach();

            if( $task->image && Storage::disk('public')->exists( $task->image ) ) {
                Storage::disk('public')->delete($task->image);
            }

            $task->delete();

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Task and related data deleted successfully.',
            ],200);



        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete task.',
                'error'   => $th->getMessage(),
            ], 500);
        }
    }

    public function tasks() {
        $user = Auth::user();
        $tasks = $user->tasks()->load(['category', 'status', 'priority', 'assignedUsers']);
        return response()->json([
            'success' => true,
            'message' => 'tasks fetched successfully',
            'user'    => $user,
            'task'    => $task
        ]);
    }

    public function view(Request $request, number $id) {
        try {
            $task = Task::find($id)->first();
            return response()->json([
                'success'   => true,
                'message'   => 'task fetched successfully',
                'data'      => [
                    'task' => $task
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error_code' => 'TASK_NOT_FOUND',
                'error'   => $th->getMessage()
            ]);
        }
    }

    public function dashboard()
    {
        $user = Auth::user();
        $currentDate = now()->toDateString();

        $users = User::where('id', '!=', Auth::id())
            ->whereDoesntHave('roles', function ($query) {
                $query->whereIn('name', ['admin', 'manager']);
            })
            ->get();

        // $todayTasks = Task::where('created_by', $user->id)
        //     ->whereDate('start_date', '<=', $currentDate)
        //     ->whereDate('due_date', '>=', $currentDate)
        //     ->whereHas('status', fn($query) => $query->where('title', '!=', 'Completed'))
        //     ->get();
        $todayTasks = Task::all();

        $upcomingTasks = Task::where('created_by', $user->id)
            ->whereDate('start_date', '>', $currentDate)
            ->whereHas('status', fn($query) => $query->where('title', '!=', 'Completed'))
            ->get();

        $completedTasks = Task::where('created_by', $user->id)
            ->whereHas('status', fn($query) => $query->where('title', '=', 'Completed'))
            ->get();


        $statuses = TaskStatus::all();

        $statusSummary = $statuses->map(function ($status) use ($user) {
            $tasks = $status->tasks()
                ->where('created_by', $user->id)
                ->get(['id', 'title', 'start_date', 'due_date']);

            $count = $tasks->count();

            return [
                'status_id'  => $status->id,
                'name'       => $status->title,
                'count'      => $count,
                'percentage' => 0, 
                'tasks'      => $tasks,
            ];
        });

        // Total tasks for calculating percentage
        $totalTasks = $statusSummary->sum('count');

        $statusSummary = $statusSummary->map(function ($item) use ($totalTasks) {
            $item['percentage'] = $totalTasks > 0
                ? round(($item['count'] / $totalTasks) * 100, 2)
                : 0;
            return $item;
        });

        return response()->json([
            'success'          => true,
            'message'          => 'Data fetched successfully',
            'data'              => [
                'user'             => $user,
                'now'              => $currentDate,
                'users'            => $users,
                'today_tasks'      => $todayTasks,
                'upcoming_tasks'   => $upcomingTasks,
                'completed_tasks'  => $completedTasks,
                'status_summary'   => $statusSummary,
                'total_tasks'      => $totalTasks
            ],
        ]);
    }



    
}
