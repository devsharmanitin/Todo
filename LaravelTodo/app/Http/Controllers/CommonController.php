<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CommonController extends Controller
{
    //
    public function categories() 
    {
        $categories = TaskCategory::all();
        return response()->json([
            'success' => true,
            'message' => 'data fetched successfully',
            'categories' => $categories
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validator = $this->validate($request);

        return $this->create($validator->validated(), TaskCategory::class);
    }

    public function priorities() 
    {
        $priorities = TaskPriority::all();
        return response()->json([
            'success' => true,
            'message' => 'data fetched successfully',
            'priorities' => $priorities
        ]);
    }

    public function storePriority(Request $request)
    {
        $validator = $this->validate($request);

        return $this->create($validator->validated(), TaskPriority::class);
    }

    public function statuses() 
    {
        $statuses = TaskStatus::all();
        return response()->json([
            'success' => true,
            'message' => 'data fetched successfully',
            'TaskStatus' => $TaskStatus
        ]);
    }

    public function storeStatus(Request $request)
    {
        $validator = $this->validate($request);

        return $this->create($validator->validated(), TaskStatus::class);
    }

    private function create(array $data, $model)
    {
        try {
            $record = $model::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Record created successfully',
                'data'    => $record
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    private function validate( Request $request) 
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }
        return $validator;
    }

}
