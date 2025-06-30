<?php
$files=[
  'index.html',
];
$files=scandir('.');
$res=[];
foreach($files as $file){
  if(preg_match('/\.html$/',$file,$ext)){
    $raw=file_get_contents($file);
    $res[$file]=$raw;
  }
}
$json=@json_encode($res);
$content="const PAGES={$json};\n\n";

$put=file_put_contents('pages.js',$content);
echo "$put\n";

