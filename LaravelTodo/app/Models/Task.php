<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TaskCategory;
use App\Models\TaskStatus;
use App\Models\TaskPriority;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'category_id',
        'status_id',
        'priority_id',
        'created_by',
        'is_vital',
        'start_date',
        'due_date',
        'image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'due_date' => 'datetime',
        ];
    }

    protected static function booted()
    {
        static::creating(function ($task) {
            if (Auth::check() && is_null($task->created_by)) {
                $task->created_by = Auth::id();
            }
        });

        static::updating(function ($task) {
            if( Auth::check() ) {
                $task->created_by = Auth::id();
            }
        });
    }

    public function category() 
    {
        return $this->belongsTo(TaskCategory::class);
    }

    public function status() 
    {
        return $this->belongsTo(TaskStatus::class);
    }

    public function priority()
    {
        return $this->belongsTo(TaskPriority::class);
    }

    public function createdBy() 
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedUsers() 
    {
        return $this->belongsToMany(User::class, 'task_assignments');
    }

    public function assignedTeams()
    {
        return $this->belongsToMany(User::class, 'team_members');
    }

}
