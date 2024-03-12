<?php
require "./Code/lib/SevenZipArchive.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$content = file_get_contents('program.html');

$content = str_replace("{{keywords}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $content);
$content = str_replace("{{author}}", "Brendan Andrew Rood", $content);
$content = str_replace("{{pageUrl}}", "https://lars.d.umn.edu/RTN", $content);
$content = str_replace("{{siteTitle}}", "Rapid Tree Notetaker", $content);
$content = str_replace("{{homeUrl}}", "https://lars.d.umn.edu/RTN", $content);
$content = str_replace("{{imageUrl}}", "https://lars.d.umn.edu/RTN/Resources/RTN-Logo.svg", $content);
$content = str_replace("{{summary}}", "A tree-based notetaking program developed at the University of Minnesota Duluth", $content);

if(isset($_GET['data']))
{
    if($_GET['enc'] == "URI-B64" || !isset($_GET['enc']))
    {
        $base64CompressedData = $_GET['data'];
        $base64CompressedData = strtr($base64CompressedData, '-_', '+/');
        $compressedData = base64_decode($base64CompressedData);
    }
    if($_GET['cmpr'] == "ZLIB" || !isset($_GET['cmpr']))
    {
        $compressedData = substr($compressedData, 2);
        $data = gzinflate($compressedData);
    }
    if($_GET['cmpr'] == "LZMA2")
    {
        /**
        * file_put_contents("./Read/LZMA.in", $compressedData);
        * file_put_contents("./Read/LZMA.out", "");
        * echo "A";
        * $archive = new SevenZipArchive("./../../../Read/LZMA.in", array('binary'=>'/usr/bin/7za'));
        * echo "B";
        * $archive->extractTo("./../../../Read");
        * echo "C";
        * $data = file_get_contents("./Read/LZMA.out");
        * echo "D";
        * unlink("./Read/LZMA.in");
        * unlink("./Read/LZMA.out");
        */
        $content = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $content);
        $content = str_replace("{{description}}", "A tree-based notetaking program developed at the University of Minnesota Duluth", $content);
        echo $content;
        exit; 
    }
    

    //shrink tree glyphs
    $data = str_replace("├────── ", "├── ", $data);
    $data = str_replace("└────── ", "└── ", $data);
    $data = str_replace("│       ", "│   ", $data);
    $data = str_replace("        ", "    ", $data);
    
    //escape special chars
    $data = str_replace("\"", "&quot;", $data);

    //$data = substr($data, 0, 8192);
    $title = explode("\n", $data)[0];
    //$title = substr($title, 0, 64);
    $data = substr($data, strpos($data, "\n") + 1);
    $content = str_replace("{{pageTitle}}", $title, $content);
    $content = str_replace("{{description}}", $data, $content);
    echo $content;
    exit; 
}
else
{
    $content = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $content);
    $content = str_replace("{{description}}", "A tree-based notetaking program developed at the University of Minnesota Duluth", $content);
    echo $content;
    exit; 
}
?>
