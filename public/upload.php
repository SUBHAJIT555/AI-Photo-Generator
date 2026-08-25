<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
$source = $input['source'] ?? $input['image'] ?? '';

if (!is_string($source) || !preg_match('/^data:image\/(\w+);base64,/', $source, $matches)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid image data']);
  exit;
}

$ext = strtolower($matches[1]);
if ($ext === 'jpeg') {
  $ext = 'jpg';
}
if (!in_array($ext, ['jpg', 'png', 'webp'], true)) {
  $ext = 'jpg';
}

$base64 = preg_replace('#^data:image/\w+;base64,#', '', $source);
$binary = base64_decode($base64, true);

if ($binary === false) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid base64']);
  exit;
}

$uploadDir = __DIR__ . '/uploads';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true)) {
  http_response_code(500);
  echo json_encode(['error' => 'Could not create upload folder']);
  exit;
}

$filename = 'photo_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$filepath = $uploadDir . '/' . $filename;

if (file_put_contents($filepath, $binary) === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Could not save image']);
  exit;
}

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443');
$scheme = $https ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$scriptDir = rtrim($scriptDir, '/');
$resultUrl = $scheme . '://' . $host . $scriptDir . '/uploads/' . $filename;

echo json_encode([
  'data' => [
    'result_url' => $resultUrl,
  ],
]);
