<?php
require "./Code/lib/SevenZipArchive.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$content = file_get_contents('program.html');

if(isset($_GET['data']))
{
    if(!isset($_GET['title']))
    {
        $base64CompressedData = $_GET['data'];
        $base64CompressedData = strtr($base64CompressedData, '-_', '+/');
        $compressedData = base64_decode($base64CompressedData);
        $compressedData = substr($compressedData, 2);
        $data = gzinflate($compressedData);
        $title = explode("\n", $data)[0];
    }
    else
    {
        $base64CompressedData = $_GET['title'];
        $base64CompressedData = strtr($base64CompressedData, '-_', '+/');
        $compressedData = base64_decode($base64CompressedData);
        $compressedData = substr($compressedData, 2);
        $data = gzinflate($compressedData);
        $title = $data;
    }
    
    $content = str_replace("{{pageTitle}}", $title, $content);
    echo $content;
    exit; 
}
else
{
    $content = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $content);
    echo $content;
    exit; 
}
?>
