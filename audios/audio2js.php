<?php
$files=scandir('.');
$types=[
  'wav'=>'audio/wav',
  'mp3'=>'audio/mpeg',
];
$res=';const AUDIOS={';
foreach($files as $file){
  if(preg_match('/\.([a-z0-9]+)$/',$file,$ext)
    &&array_key_exists($ext[1],$types)){
    $type=$types[$ext[1]];
    $raw=file_get_contents($file);
    $res.='"'.$file.'":'
      .'"data:'.$type.';base64,'.base64_encode($raw).'",';
  }
}
$res.='};';

$put=file_put_contents('audios.js',$res);
echo "$put\n";

