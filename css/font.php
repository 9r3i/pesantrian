<?php
$file=$argv[1];
$out=$file.'.txt';
$data='data:font/trutype;base64,'
  .base64_encode(file_get_contents($file));
echo file_put_contents($out,$data)."\n";