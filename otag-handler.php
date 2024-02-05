<?php
if(isset($_GET['data']))
{
    $base64CompressedData = $_GET['data'];
    $base64CompressedData = strtr($base64CompressedData, '-_', '+/');
    $compressedData = base64_decode($base64CompressedData);
    $compressedData = substr($compressedData, 2);
    $data = gzinflate($compressedData);
    $title = explode("\n", $data)[0];
    $content = file_get_contents('program.html');
    $content = str_replace("<meta property=\"og:title\" content=\"\"/>", "<meta property=\"og:title\" content=\"" . $title . "\"/>", $content);
    $content = str_replace("<meta property=\"og:description\" content=\"\"/>", "<meta property=\"og:description\" content=\"" . $data . "\"/>", $content);
    echo $content;
    exit; 
}
else
{
    $content = file_get_contents('program.html');
    $content = str_replace("<meta property=\"og:title\" content=\"\"/>", "<meta property=\"og:title\" content=\"" . "Rapid Tree Notetaker" . "\"/>", $content);
    $content = str_replace("<meta property=\"og:description\" content=\"\"/>", "<meta property=\"og:description\" content=\"" . "A tree-based notetaking program developed at the University of Minnesota Duluth" . "\"/>", $content);
    echo $content;
    exit; 
}
?>
