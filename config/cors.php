<?php

return [
    'paths' => ['api/*'],

    // Di production isi CORS_ALLOWED_ORIGINS dengan domain frontend,
    // mis. https://kelurahanbetet.example.org (pisahkan koma bila banyak).
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_filter(array_map(
        'trim',
        explode(',', (string) env('CORS_ALLOWED_ORIGINS', env('FRONTEND_URL', 'http://localhost:5173')))
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 86400,

    // Auth memakai Bearer token (bukan cookie), jadi cookie tidak diperlukan.
    'supports_credentials' => false,
];
