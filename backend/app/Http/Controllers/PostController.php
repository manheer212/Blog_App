<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // 1. READ ALL POSTS
    public function index()
    {
        return response()->json(Post::latest()->get(), 200);
    }

    // 2. CREATE A POST
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Post::create($validated);
        return response()->json($post, 201);
    }

    // 3. READ A SINGLE POST
    public function show(Post $post)
    {
        return response()->json($post, 200);
    }

    // 4. UPDATE A POST
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($validated);
        return response()->json($post, 200);
    }

    // 5. DELETE A POST
    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully'], 200);
    }

    // 6. DELETE ALL POSTS
    public function destroyAll()
    {
        Post::truncate(); 
        return response()->json(['message' => 'All blog records successfully cleared'], 200);
    }
}
