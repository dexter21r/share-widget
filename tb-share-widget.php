<?php

foreach ($_REQUEST as $key => $value) {
    $$key = $value;
}

if (!isset($action)) {
    $action = 'empty';
}

$data = [];

if ($action == 'search') {
    $queryString = '&orientation=' . $orientation;

    if (!empty($searchterm)) {
        $queryString .= '&q=' . urldecode($searchterm);
    }

    if (!empty($category)) {
        $queryString .= '&category=' . urldecode($category);
    }

    // Get cURL resource
    $curl = curl_init();
    // Set some options - we are passing in a useragent too here
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => 'https://pixabay.com/api/?safesearch=true&key=8510374-bb2dde0f12fe24760279b11f9&image_type=photo&per_page=50'.$queryString
    ));
    // Send the request & save response to $resp
    $resp = json_decode(curl_exec($curl));
    // Close request to clear up some resources
    curl_close($curl);

    $msg = 'search '. $searchterm;
    $status = true;
    if ($resp->totalHits > 0) {
        $data = $resp->hits;
    }
} elseif ($action == 'save-image') {
    $my_save_dir = 'images/';
    $filename = basename($imageurl);
    $complete_save_loc = $my_save_dir . $filename;
    file_put_contents($complete_save_loc, file_get_contents($imageurl));
    
    $data = 'http://localhost/lab/share-widget/'.$complete_save_loc;

    $msg = 'save-image '.$imageurl;
    $status = true;
} else {
    $msg = 'Unknown action';
    $status = false;
}

header('content-type: text/json');
echo json_encode([ 'status'=> $status, 'msg'=> $msg, 'data'=> $data]);
