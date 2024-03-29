<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//record WHEN, WHO, and WHAT users access (protect with hashing!)
$timestamp = time();
$ipAddress = base64_encode(hex2bin(hash('sha256',$_SERVER['REMOTE_ADDR'])));
$data = base64_encode(hex2bin(hash('sha256', $_GET['data'])));
$usage = "$timestamp,$ipAddress,$data";
$cmd = "echo \"$usage\" >> \"./Usage/accesses.csv\"";
shell_exec($cmd);


$content = file_get_contents('./program.html');

if(isset($_GET['error']) || !isset($_GET['data'])) //return generic on error
{
    $exe_title = "Rapid Tree Notetaker";
    $exe_data = "A tree-based notetaking program developed at the University of Minnesota Duluth";
    $content = str_replace("{{pageTitle}}", "$exe_title", $content);
    $content = str_replace("{{description}}", "$exe_data", $content);
    echo $content;
    exit; 
}

if(isset($_GET['enc']) && isset($_GET['cmpr']) && isset($_GET['data'])) //3-23-24 encoding
{
    $encoding = $_GET['enc'];
    $compression = $_GET['cmpr'];
    $data = $_GET['data'];
    $url = "https://lars.d.umn.edu/RTN/decompressor.php?enc=$encoding&cmpr=$compression&data=$data";
    $cmd = "node ./decompressor.js \"$url\"";
    $output = shell_exec($cmd);

    $output = str_replace("█", "\n", $output);
    $exe_title = explode("\n", $output)[0];
    $exe_data = substr($output, strpos($output, "\n") + 1);
    $exe_data = str_replace("├────── ", "├── ", $exe_data);
    $exe_data = str_replace("└────── ", "└── ", $exe_data);
    $exe_data = str_replace("│       ", "│   ", $exe_data);
    $exe_data = str_replace("        ", "    ", $exe_data);
    
    $content = str_replace("{{pageTitle}}", $exe_title, $content);
    $content = str_replace("{{description}}", $exe_data, $content);
    echo $content;
    exit; 
}

if(isset($_GET['title'])) //3-13-24 encoding
{
    $exe_title = urldecode($_GET['title']);
    $exe_data = "A tree-based notetaking program developed at the University of Minnesota Duluth";
    $content = str_replace("{{pageTitle}}", "$exe_title", $content);
    $content = str_replace("{{description}}", "$exe_data", $content);
    echo $content;
    exit; 
}

if(!isset($_GET['enc'])) //Old ZLIB, Base-64 encoding
{
    $encoding = "URI-B64";
    $compression = "ZLIB";
    $data = $_GET['data'];
    $url = "https://lars.d.umn.edu/RTN/decompressor.php?enc=$encoding&cmpr=$compression&data=$data";
    $cmd = "node ./decompressor.js \"$url\"";
    $output = shell_exec($cmd);

    $output = str_replace("█", "\n", $output);
    $exe_title = explode("\n", $output)[0];
    $exe_data = substr($output, strpos($output, "\n") + 1);
    $exe_data = str_replace("├────── ", "├── ", $exe_data);
    $exe_data = str_replace("└────── ", "└── ", $exe_data);
    $exe_data = str_replace("│       ", "│   ", $exe_data);
    $exe_data = str_replace("        ", "    ", $exe_data);

    $content = str_replace("{{pageTitle}}", $exe_title, $content);
    $content = str_replace("{{description}}", $exe_data, $content);
    echo $content;
    exit; 
}
?>
