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
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    //
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    private function validate( Request $request, $isUpdate = false) {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id',
            'status_id' => 'nullable|exists:task_statuses,id',
            'priority_id' => 'required|exists:task_priorities,id',
            'start_date' => 'nullable|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'is_vital' => 'sometimes|boolean',
            'image'   => 'nullable|array',
            'image.*' => 'file|image|max:2048',
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


    public function destroy( Request $request , int $id) {
        try {
            DB::beginTransaction();

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

    public function tasks(Request $request) {
        $user = Auth::user();
        $query = $user->tasks();

        if ($request->has('query')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->query('query') . '%')
                ->orWhere('description', 'like', '%' . $request->query('query') . '%');
            });
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $tasks = $query->with(['status', 'priority', 'category', 'assignedUsers'])->get();

        return response()->json([
            'success' => true,
            'message' => 'tasks fetched successfully',
            'data'    => [
                'user'  => $user,
                'tasks' => $tasks
            ],
        ]);
    }

    public function view(Request $request, $id) {
        try {
            $task = $task = Task::with([
                'status:id,title,color_code',
                'priority:id,title,color_code',
                'category:id,title',
                'assignedUsers',
            ])
            ->find($id);
                
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
            
        $todayTasks = $user->assignedTasks()->with(['status:title,id,color_code', 'priority:title,id,color_code'])
            ->whereHas('status', fn($query) => $query->where('title', '!=', 'Completed'))
            ->get();

        $upcomingTasks = $user->assignedTasks()->with(['status:title,id,color_code', 'priority:title,id,color_code'])
            ->whereDate('start_date', '>', $currentDate)
            ->whereHas('status', fn($query) => $query->where('title', '!=', 'Completed'))
            ->get();

        $completedTasks = $user->assignedTasks()->with(['status:title,id,color_code', 'priority:title,id,color_code'])
            ->where('created_by', $user->id)
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


    public function inviteUser(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'permissions.global'   => 'array',
            'permissions.specific' => 'array',
            'permissions.specific.*.permissions.can_edit'   => 'boolean',
            'permissions.specific.*.permissions.can_view'   => 'boolean',
            'permissions.specific.*.permissions.can_delete' => 'boolean',
            'permissions.specific.*.permissions.can_invite' => 'boolean',
        ]);

        $task = Task::findOrFail($id);

        $user = User::findOrFail($request->user_id);

        $globalPermissions = $request->input('permissions.global', []);

        // ✅ Save Specific Permissions (into pivot table)
        $specificPermissions = collect($request->input('permissions.specific', []))
            ->keyBy('task_id')
            ->map(fn ($perm) => [
                'CAN_EDIT'   => $perm['permissions']['can_edit']   ?? false,
                'CAN_VIEW'   => $perm['permissions']['can_view']   ?? false,
                'CAN_DELETE' => $perm['permissions']['can_delete'] ?? false,
                'CAN_INVITE' => $perm['permissions']['can_invite'] ?? false,
            ])
            ->toArray();

        // Attach specific task-level permissions
        $task->assignedUsers()->syncWithoutDetaching([
            $user->id => $specificPermissions[$task->id] ?? []
        ]);

        return response()->json([
            'success'  => true,
            'message' => 'User invited successfully!',
            'task'    => $task->load('assignedUsers'),
            'sync_data' => [
                'global'   => $globalPermissions,
                'specific' => $specificPermissions,
            ]
        ]);
    }


    
}
