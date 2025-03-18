<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $postId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'text' => 'required|string|max:255',
        ]);

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => $request->user_id,
            'text' => $request->text,
        ]);
        
        $comment->load('user');

        return response()->json(['comment' => $comment], 201);
    }

    public function index()
    {
        $posts = Post::with(['user', 'comments.user', 'likes', 'content'])->get();

        return response()->json([
            'status' => 200,
            'result' => ['data' => $posts]
        ]);
    }

    public function show($id)
    {
        $post = Post::with(['user', 'comments.user', 'likes', 'content'])->findOrFail($id);
        return response()->json($post);
    }
}
