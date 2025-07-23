<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserActiveStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            if( $request->user() ) {
                if( $request->user()->status == 1 ) {
                    return $next($request);
                } else {
                    // User is Inactive, proceed with the request
                   return response()->json([
                        'success' => false,
                        'message' => 'Your account is inactive. Please contact support.',
                        'route' => '/verify-otp'
                    ], 403);
                }
            }
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact support.',
            ], 403);
        }
        
    }
}
