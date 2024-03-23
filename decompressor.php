<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<html>
   <head>
   </head>
   <body>
        <script src="./Code/lib/lzma-min.js"></script>
        <script src="./Code/lib/pako-min.js"></script>

        <script type="module">
            import { URIMannager } from "./Code/exe/URI-mannager.js";
            var man = new URIMannager();
            var data = man.pull();
            data = data.replaceAll("\n", "█");
            document.body.innerHTML=data;
        </script>
   </body>
</html>