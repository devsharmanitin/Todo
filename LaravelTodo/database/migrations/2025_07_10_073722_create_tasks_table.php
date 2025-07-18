<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('status_id')->nullable()->constrained('task_statuses')->onDelete('set null');;
            $table->foreignId('category_id')->nullable()->constrained('task_categories')->onDelete('set null');;
            $table->foreignId('priority_id')->nullable()->constrained('task_priorities')->onDelete('set null');;
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_vital')->default(false);
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
