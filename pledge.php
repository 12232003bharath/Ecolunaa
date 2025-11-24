<?php
// pledge.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

$filename = 'pledge_count.txt';

// 1. Initialize file if missing (Default: 1250 pledges)
if (!file_exists($filename)) {
    file_put_contents($filename, '1250');
}

// 2. Read current count
$count = (int)file_get_contents($filename);

// 3. Increment if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $count++;
    file_put_contents($filename, $count);
}

// 4. Return data
echo json_encode(['count' => $count]);
?>