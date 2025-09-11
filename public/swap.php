<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

function respond(int $statusCode, bool $success, string $message, ?array $data = null): void {
    http_response_code($statusCode);
    echo json_encode([
        'statusCode' => $statusCode,
        'success'    => $success,
        'message'    => $message,
        'data'       => $data,
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    respond(200, true, 'OK', null);
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
    respond(400, false, 'Invalid JSON payload');
}

if (!isset($data['source']) || !isset($data['avatar_id'])) {
    respond(400, false, 'source and avatar_id are required');
}

// Fixed avatar map
$avatarMap = [
    "feamale1" => "feamale-01.png",
    "feamale2" => "feamale-02.png",
    "feamale3" => "feamale-03.png",
    "feamale4" => "feamale-04.png",
    "feamale5" => "feamale-05.png",
    "feamale6" => "feamale-06.png",
    "male1"    => "male-01.png",
    "male2"    => "male-02.png",
    "male3"    => "male-03.png",
    "male4"    => "male-04.png",
    "male5"    => "male-05.png",
    "male6"    => "male-06.png",
];


$avatarId = $data['avatar_id'];
if (!isset($avatarMap[$avatarId])) {
    respond(400, false, 'Invalid avatar_id');
}

$source = $data['source'];
$uniqueId = uniqid('', true);
$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true)) {
    respond(500, false, 'Failed to prepare upload directory');
}

$sourcePath = $uploadDir . "source_{$uniqueId}.png";
$base64 = preg_replace('#^data:image/\w+;base64,#i', '', $source);
$decoded = base64_decode($base64, true);
if ($decoded === false) {
    respond(400, false, 'Invalid base64 image in source');
}
if (file_put_contents($sourcePath, $decoded) === false) {
    respond(500, false, 'Failed to write source image');
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

$sourceUrl = $scheme . $host . '/uploads/' . basename($sourcePath);
$targetUrl = $scheme . $host . '/avatars/' . $avatarMap[$avatarId];

$apiKey = 'YOUR_MAGICAPI_KEY';
$apiUrl = 'https://api.magicapi.dev/api/v1/capix/faceswap/faceswap/v3/image';

// Start job
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'accept: application/json',
        'x-magicapi-key: ' . $apiKey,
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_POSTFIELDS => http_build_query([
        'target_url' => $targetUrl,
        'swap_url'   => $sourceUrl,
        'target_face_index' => 0,
    ]),
]);
$response = curl_exec($ch);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($response === false) {
    respond(502, false, 'Failed to start job: ' . $curlErr);
}

$responseData = json_decode($response, true);
if (!is_array($responseData) || !isset($responseData['id'])) {
    respond(502, false, 'Failed to start job.');
}

$requestId = $responseData['id'];

// Poll (max 10 minutes)
$resultUrl = null;
for ($i = 0; $i < 600; $i++) {
    sleep(1);
    $statusCh = curl_init();
    curl_setopt_array($statusCh, [
        CURLOPT_URL => "https://api.magicapi.dev/api/v1/capix/faceswap/status/{$requestId}",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'accept: application/json',
            'x-magicapi-key: ' . $apiKey,
        ],
    ]);
    $statusResponse = curl_exec($statusCh);
    $statusErr = curl_error($statusCh);
    curl_close($statusCh);

    if ($statusResponse === false) {
        respond(502, false, 'Failed to check job status: ' . $statusErr);
    }

    $statusData = json_decode($statusResponse, true);
    if (!is_array($statusData) || !isset($statusData['status'])) {
        respond(502, false, 'Invalid status response from provider');
    }

    if ($statusData['status'] === 'COMPLETED') {
        $resultUrl = $statusData['result_url'] ?? null;
        if (!$resultUrl) {
            respond(502, false, 'Completed without result_url');
        }
        break;
    }

    if (in_array($statusData['status'], ['ERROR', 'FAILED'], true)) {
        respond(502, false, 'Job failed');
    }
}

if ($resultUrl) {
    respond(200, true, 'OK', [
        'result_url' => $resultUrl,
        'source_url' => $sourceUrl,
    ]);
}

respond(504, false, 'Timeout waiting for result');