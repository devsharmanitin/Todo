<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'number' => $this->number,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'permissions' => [
               'global' =>  $this->getAllPermissions()->pluck('name'),
               'specific' => $this->assignedTasks->map( function ($task) {
                    return [
                        'task_id'       => $task->id,
                        'task_title'    => $task->title,
                        'permissions'   => [
                            'can_view'      =>  (bool) $task->pivot->CAN_VIEW,
                            'can_edit'      =>  (bool) $task->pivot->CAN_EDIT,
                            'can_delete'    =>  (bool) $task->pivot->CAN_DELETE,
                            'can_invite'    =>  (bool) $task->pivot->CAN_INVITE,
                        ],   
                    ];
                } )
            ], 
            'role' => $this->getRoleNames()->first(),
            'status' => $this->status,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'full_address' => implode(', ', array_filter([
                $this->address,
                $this->city,
                $this->state,
                $this->country
            ])),
        ];
    }
}
