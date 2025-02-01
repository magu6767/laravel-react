<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $todos = auth()->user()->todos()->latest()->get();
        return response()->json($todos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $todo = auth()->user()->todos()->create($validated);
        return response()->json($todo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo): JsonResponse
    {
        $this->authorize('view', $todo);
        return response()->json($todo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo): JsonResponse
    {
        $this->authorize('update', $todo);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
        ]);

        if (isset($validated['completed'])) {
            $todo->completed_at = $validated['completed'] ? now() : null;
            unset($validated['completed']);
        }

        $todo->update($validated);
        return response()->json($todo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo): JsonResponse
    {
        $this->authorize('delete', $todo);
        $todo->delete();
        return response()->json(null, 204);
    }
}
