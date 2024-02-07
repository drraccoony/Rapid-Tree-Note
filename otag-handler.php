<?php
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
    $base64CompressedData = $_GET['data'];
    $base64CompressedData = strtr($base64CompressedData, '-_', '+/');
    $compressedData = base64_decode($base64CompressedData);
    $compressedData = substr($compressedData, 2);
    $data = gzinflate($compressedData);

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
