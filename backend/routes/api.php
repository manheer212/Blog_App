<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::delete('posts/all', [PostController::class, 'destroyAll']);
Route::apiResource('posts', PostController::class);

