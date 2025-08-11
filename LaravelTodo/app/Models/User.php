<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Task;
use App\Models\Team;
use Illuminate\Notifications\Notification;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    public static array $roles = [
        'admin',
        'manager',
        'user',
    ];

    public static array $permissions = [
        'CREATE_TASK',
        'EDIT_TASK',
        'VIEW_TASK',
        'ASSIGN_TASK',
        'DELETE_TASK',
        'VIEW_PROGRESS',
        'MANAGE_USER',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function routeNotificationForSlack(Notification $notification): mixed
    {
        return '#notifications';
    }    

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_assignments');
    }

    public function assignedTasks()
    {
        return $this->belongsToMany(Task::class, 'task_assignments')->withPivot(['CAN_VIEW', 'CAN_EDIT', 'CAN_DELETE', 'CAN_INVITE']);
    }

    public function assignedTeams() {
        return $this->belbelongsToMany(Team::class, 'team_members');
    }

    public function AssignPermission() {
        $role = $this->roles->first->pluck('name');
        if( $role === 'user' ) {
            return $this->givePermissionTo(['CREATE_TASK', 'EDIT_TASK', 'VIEW_TASK', 'ASSIGN_TAKS', 'DELETE_TASK']);
        }
        return;
    }
    
}
