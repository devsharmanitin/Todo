<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines which domains are allowed to access your
    | application's resources via AJAX. You may also set up
    | individual controllers or routes to have different CORS options.
    |
    | By default, CORS is handled by the `Illuminate\Http\Middleware\HandleCors` middleware.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'auth/*'], // Adjust paths as needed
                                                                         // For your use case, 'api/*' and 'auth/*' are most important

    'allowed_methods' => ['*'], // Or specify ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

    'allowed_origins' => ['*'], // Or specify your React app's URL: ['http://localhost:3000', 'https://your-react-app.com']
                                // Using '*' is fine for development but tighten in production.

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Or specify ['Content-Type', 'X-Requested-With', 'Authorization', 'Accept']

    'exposed_headers' => [],

    'max_age' => 0, // Cache preflight requests for 0 seconds

    'supports_credentials' => true, // <-- THIS IS CRUCIAL FOR COOKIES/AUTHENTICATION HEADERS

];