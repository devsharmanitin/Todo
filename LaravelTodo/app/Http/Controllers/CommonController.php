<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\TaskCategory;
use App\Models\TaskPriority;
use App\Models\TaskStatus;

class CommonController extends Controller
{
    public function categories() 
    {
        $categories = TaskCategory::all();
        return response()->json([
            'success' => true,
            'message' => 'Data fetched successfully',
            'data'    => [
                'categories' => $categories
            ], 
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validator = $this->validateRequest($request);
        return $this->create($validator->validated(), TaskCategory::class);
    }

    public function updateCategory(Request $request, $id)
    {
        $validator = $this->validateRequest($request);
        return $this->updateRecord($validator->validated(), TaskCategory::class, $id);
    }

    public function deleteCategory(Request $request, $id)
    {
        return $this->delete($id, TaskCategory::class);
    }

    public function priorities() 
    {
        $priorities = TaskPriority::all();
        return response()->json([
            'success' => true,
            'message' => 'Data fetched successfully',
            'data'    => [
                'priorities' => $priorities
            ],
        ]);
    }

    public function storePriority(Request $request)
    {
        $validator = $this->validateRequest($request);
        return $this->create($validator->validated(), TaskPriority::class);
    }

    public function updatePriority(Request $request, $id)
    {
        $validator = $this->validateRequest($request);
        return $this->updateRecord($validator->validated(), TaskPriority::class, $id);
    }

    public function deletePriority(Request $request, $id)
    {
        return $this->delete($id, TaskPriority::class);
    }

    public function statuses() 
    {
        $statuses = TaskStatus::all();
        return response()->json([
            'success' => true,
            'message' => 'Data fetched successfully',
            'data'    => [
                'statuses' => $statuses
            ],
        ]);
    }

    public function storeStatus(Request $request)
    {
        $validator = $this->validateRequest($request);
        return $this->create($validator->validated(), TaskStatus::class);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = $this->validateRequest($request);
        return $this->updateRecord($validator->validated(), TaskStatus::class, $id);
    }

    public function deleteStatus(Request $request, $id)
    {
        return $this->delete($id, TaskStatus::class);
    }

    // Common create method
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

    // Common update method
    private function updateRecord(array $data, $model, $id)
    {
        try {
            $record = $model::findOrFail($id);
            $record->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Record updated successfully',
                'data'    => $record
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Record not found',
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    private function deleteRecord($id, $model)
    {
        try {
            $record = $model::findOrFail($id);
            $record->delete();

            return response()->json([
                'success' => true,
                'message' => 'Record updated successfully',
                'data'    => $record
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Record not found',
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // Common validation
    private function validateRequest(Request $request) 
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422)->send();
            exit;
        }

        return $validator;
    }
}

