<?php
/* gload
 , ~ gload class
 , authored by 9r3i
 , https://github.com/9r3i
 , started at december 30th 2017 (version 1.0.0)
 , continued at january 17th 2018 (version 2.0.0)
 , continued at june 9th 2021 (version 2.1.0)
 , continued at august 11th 2021 (version 2.2.0)
 , continued at november 7th 2023 (version 2.2.1)
 ,   - remove flock as condition
 ,   - add mime for webm
 , continued at december 22nd 2023 (version 2.2.2)
 ,   - add mime for webp, ico ans svg
 ,   - remove method load_old
 */

/* 
post request:
  m = master key
  k = gload key (access token for 60 seconds)
  a = method statement - base64 encoded
  b = array of arguments - json encoded and base64 encoded
get request:
  l = string - json encoded and base64 encoded
      contains object:
      - m = master key
      - k = gload key (access token for 60 seconds)
      - f = requested file
      - s = reading speed
 */

/* gload class */
new gload;
class gload{
  const version='2.2.2';
  protected $dir=null;
  protected $statements=null;
  public function __construct(){
    @set_time_limit(false);
    @date_default_timezone_set('Asia/Jakarta');
    $this->statements=[
      'version','drives','scan','newDir','newFile',
      'delete','copy','rename','write','read','load',
      'detail','shellExec',
    ];
    $this->dir=str_replace('\\','/',__DIR__).'/';
    if(!is_dir($this->dir)){@mkdir($this->dir,0755,true);}
    $this->head();
    return $this->start();
  }
  private function start(){
    if(isset($_POST['m'],$_POST['k'],$_POST['a'],$_POST['b'])
      &&$this->valid($_POST['k'],$_POST['m'])
      &&in_array(@base64_decode($_POST['a']),$this->statements)
      &&method_exists($this,@base64_decode($_POST['a']))){
      $args=@json_decode(@base64_decode($_POST['b']),true);
      $args=is_array($args)?$args:[];
      return @\call_user_func_array([get_class($this),@base64_decode($_POST['a'])],$args);
    }elseif(isset($_GET['l'])&&($j=@json_decode(@base64_decode($_GET['l'])))
      &&isset($j->m,$j->k,$j->f)&&$this->valid($j->k,$j->m)){
      $s=isset($j->s)&&is_int($j->s)?$j->s:null;
      if(isset($j->t)&&$j->t==true){
        return $this->getThumbnail($j->f,$s);
      }return $this->load($j->f,$s,isset($j->d)&&$j->d?true:false);
    }return $this->error('401 Unauthorized');
  }
  private function getThumbnail($f=null,$s=null){
    if(!is_file($f)){return $this->error('404 File doesn\'t exist');}
    $d='.thumbnail/';
    if(!is_dir($d)){@mkdir($d,0755,true);}
    $t=$d.md5_file($f);
    if(!is_file($t)){
      if(!$this->copyImage($f,$t)){
        $i=@getimagesize($f);
        if(isset($i[0],$i[1])&&$i[0]<=1000&&$i[1]<=1000){
          return $this->load($f,$s);
        }return $this->error('200 Failed to get thumbnail');
      }
    }return $this->load($t,$s);
  }
  private function shellExec($c=null,$d=null){
    if(!isset($c)){return $this->error('403 Forbidden');}
    @chdir(is_dir($d)?$d:__DIR__);
    $t=shell_exec(escapeshellcmd($c));
    return $this->output($t!=''?$t:'OK');
  }
  private function detail($f=null){
    $info=$this->info($f);
    return $info?$this->output(json_encode($info)):$this->error('404 File doesn\'t exist');
  }
  private function version(){
    return $this->output(self::version);
  }
  private function drives($j=null){
    $j=is_array($j)?$j:[];$r=[];
    if(strtoupper(substr(PHP_OS,0,3))==="WIN"){
      $d=range('A','Z');
      array_walk($d,function(&$v){$v=$v.':';});
      $j=array_merge($d,$j);
    }elseif(!in_array('/',$j)){
      $d=['/'];$j=array_merge($d,$j);
    }
    foreach($j as $v){
      if(is_dir($v)){
        $free=@disk_free_space($v);
        $r[$v]=array(
          'name'=>$v,
          'free'=>$free,
          'total'=>@disk_total_space($v),
          'status'=>$free?'ready':'not ready',
          'php_os'=>PHP_OS,
        );
      }
    }return $this->output(json_encode($r));
  }
  private function scan($t=null,$x=false){
    if(!is_dir($t)){return $this->error('200 Target doesn\'t exist');}
    $r=$this->scanDir($t,$x);
    if(!is_array($r)){return $this->error('200 Failed to scan directory');}
    return $this->output(json_encode($r));
  }
  private function scanDir($t=null,$x=false){
    if(!is_dir($t)){return false;}
    $t.=substr($t,-1)!='/'?'/':'';$r=[];
    $w=@array_diff($this->scandiraja($t),['.','..']);
    if(!is_array($w)){return false;}
    @usort($w,function($a,$b){
      $c='/';
      $a=substr($a,0,1)==='_'?$c.substr($a,1):$a;
      $b=substr($b,0,1)==='_'?$c.substr($b,1):$b;
      return strcasecmp($a,$b);
    });
    foreach($w as $f){
      if(is_dir($t.$f)&&$x){
        $n=$this->info($t.$f);
        $n['children']=$this->scanDir($t.$f,$x);
        $r[]=$n;
      }else{
        $n=$this->info($t.$f);
        $r[]=$n?$n:$f;
      }
    }return $r;
  }
  private function newDir($t=null){
    if(file_exists($t)){return $this->error('200 Target does exist');}
    if(!@mkdir($t,0755,true)){return $this->error('200 Failed to create directory');}
    return $this->output('OK');
  }
  private function newFile($t=null){
    if(file_exists($t)){return $this->error('200 Target does exist');}
    if(!is_dir(dirname($t))){@mkdir(dirname($t),0755,true);}
    if(@file_put_contents($t,'')===false){return $this->error('200 Failed to create file');}
    return $this->output('OK');
  }
  private function delete($t=null){
    if(!file_exists($t)){return $this->error('404 Not Found');}
    if(is_file($t)){@unlink($t);return $this->output('OK');}
    elseif(is_dir($t)){
      if(!$this->deleteDir($t)){return $this->error('200 Failed to delete directory');}
      return $this->output('OK');
    }return $this->error('200 Unknown error');
  }
  private function deleteDir($t=null){
    $t.=substr($t,-1)!='/'?'/':'';
    $w=@array_diff($this->scandiraja($t),['.','..']);
    foreach($w as $f){
      if(is_file($t.$f)){@unlink($t.$f);}
      elseif(is_dir($t.$f)){$this->deleteDir($t.$f);}
    }@rmdir($t);return true;
  }
  private function copy($s=null,$t=null){
    if(!file_exists($s)){return $this->error('404 Not Found');}
    if(is_file($s)){
      if(file_exists($t)){return $this->error('200 Target does exist');}
      if(!@copy($s,$t)){return $this->error('200 Failed to copy file');}
      return $this->output('OK');
    }elseif(is_dir($s)){
      if(!is_dir($t)){return $this->error('200 Target doesn\'t exist');}
      if(is_dir($t.'/'.basename(preg_replace('/\/$/','',$s)))){
        return $this->error('200 Target does exist');
      }
      if(strpos($t,$s)!==false){
        return $this->error('200 Recursive is not allowed');
      }
      if(!@$this->copyDir($s,$t)){return $this->error('200 Failed to copy directory');}
      return $this->output('OK');
    }return $this->error('200 Unknown error');
  }
  private function copyDir($s=null,$t=null){
    if(!is_dir($s)||!is_dir($t)||is_dir($t.'/'.basename($s))){return false;}
    $t.=substr($t,-1)!='/'?'/':'';
    $s.=substr($s,-1)!='/'?'/':'';
    $u=$t.basename(substr($s,0,-1)).'/';
    $w=@array_diff(@scandir($s)??[],['.','..']);
    if(!is_dir($u)){@mkdir($u,0755,true);}
    foreach($w as $f){
      if(is_file($s.$f)){
        @copy($s.$f,$u.$f);
      }elseif(is_dir($s.$f)){
        $this->copyDir($s.$f,$u);
      }
    }return true;
  }
  private function scandiraja($d=null){
    $r=[];
    if(is_dir($d)){
      $s=@scandir($d);
      $r=is_array($s)?$s:[];
    }return $r;
  }
  private function rename($s=null,$t=null){
    if(!file_exists($s)){return $this->error('404 Not Found');}
    if(file_exists($t)){return $this->error('200 Target does exist');}
    if(!@rename($s,$t)){return $this->error('200 Failed to rename');}
    return $this->output('OK');
  }
  private function load($f=null,$spd=null,$dl=false){
    if(!is_string($f)||!is_file($f)){return $this->error('404 Not Found');}
    $q=sprintf('"%s"',addcslashes(basename($f),'"\\'));
    $s=@$this->size($f);
    if($dl){header('Content-Description: File Transfer');}
    header('Content-Type: '.($dl?'application/octet-stream':$this->mime($f)));
    header('Content-Disposition: '.($dl?'attachment':'inline').'; filename='.$q); /* (inline|attachment) */
    header('Last-Modified: '.@gmdate('D, d M Y H:i:s',@filemtime($f)).' GMT');
    header('Content-Transfer-Encoding: binary'); /* (binary|gzip) */
    header('Connection: Keep-Alive'); /* (Keep-Alive|Close) */
    header('Cache-Control: must-revalidate, max-age=0, post-check=0, pre-check=0');
    /* (public|store|no-store|no-cache), must-revalidate, max-age=0, post-check=0, pre-check=0 */
    header('Expires: '.@gmdate('D, d M Y H:i:s',time()-(3*24*60*60)).' GMT');
    header('Pragma: no-cache'); /* (public|store|no-store|no-cache) */
    header('Accept-Ranges: bytes');
    $o=0;$t=$s;
    if(isset($_SERVER['HTTP_RANGE'])&&preg_match('/bytes=(\d+)-(\d+)?/',$_SERVER['HTTP_RANGE'],$a)){
      if($s>PHP_INT_MAX){
        /* using floatval: to prevent PHP_INT_MAX filesize on fseek */
        $o=floatval($a[1]);$t=isset($a[2])?floatval($a[2]):$s;
      }else{
        $o=intval($a[1]);$t=isset($a[2])?intval($a[2]):$s;
      }
    }
    header('Content-Range: bytes '.$o.'-'.$t.'/'.$s);
    header('HTTP/1.1 '.($o>0||$t<$s?'206 Partial Content':'200 OK'));
    header('Content-Length: '.($t-$o));
    @$this->readchunk($f,true,$o,$t,$spd);
    exit;
  }
  private function readchunk($f=null,$r=true,$x=null,$y=null,$p=null,$u=true){
    if(!is_string($f)||!is_file($f)){return false;}
    $b='';$c=0;$o=fopen($f,'rb');$w=1024*(is_int($p)?$p:4);
    if($o===false){return false;}
    if(isset($x)){fseek($o,$x);}
    while(!feof($o)){
      $b=fread($o,$w);
      if($u){usleep(1000);}
      print($b);flush();
      if($r){$c+=strlen($b);}
      if(isset($y)&&ftell($o)>=$y){break;}
    }$s=fclose($o);
    if($r&&$s){return $c;}
    return $s;
  }
  private function read($f=null,$p=null,$t=null){
    if(!isset($f)||!is_file($f)){return $this->error('404 Not Found');}
    $p=is_numeric($p)?(int)$p:0;
    $t=is_numeric($t)?(int)$t:$this->size($f);
    $t=min($t,$this->size($f));
    $o=@fopen($f,'rb');
    if($o===false){return $this->error('200 Failed to open file');}
    @fseek($o,$p);
    $r=@fread($o,$t);
    @fclose($o);
    return $this->output(@base64_encode($r));
  }
  private function write($f=null,$c=null,$p=null,$t=null){
    if(!is_dir($t)){@mkdir($t,0755,true);}
    $o=@fopen($t.'/'.$f,(intval($p)==0?'wb':'rb+'));
    if($o===false){return $this->error('200 Failed to open file');}
    @flock($o,LOCK_EX);
    @fseek($o,intval($p));
    $w=@fwrite($o,base64_decode($c));
    @flock($o,LOCK_UN);
    @fclose($o);
    return $w>=0?$this->output('OK'):$this->error('200 Failed to write file');
  }
  private function copyImage($f=null,$r=null,$w=100,$h=100,$c=true){
    if(!is_string($f)||!is_file($f)){return false;}
    $i=@getimagesize($f);
    if(!$i){return false;}
    $t=isset($i['mime'])&&preg_match('/(jpeg|png|gif)$/',$i['mime'],$a)?$a[1]:false;
    switch($t){
      case 'gif':$d=@imagecreatefromgif($f);break;
      case 'png':$d=@imagecreatefrompng($f);break;
      case 'jpeg':$d=@imagecreatefromjpeg($f);break;
      default:$d=@imagecreatefromstring(@file_get_contents($f));
    }
    $i=@getimagesize($f);
    if(!$d){return false;}
    $w=is_int($w)?$w:100;
    $h=is_int($h)?$h:100;
    $nh=$i[1];$nw=$i[0];
    $x=0;$y=0;
    if($c){
      if($nw>=$w and $nh>=$h){
        $ratio=max($w/$nw,$h/$nh);
        $y=($nh-$h/$ratio)/2;
        $nh=$h/$ratio;
        $x=($nw-$w/$ratio)/2;
        $nw=$w/$ratio;
      }else{return false;}
    }else{
      if($nw>=$w or $nh>=$h){
        $ratio=min($w/$nw,$h/$nh);
        $w=$i[0]*$ratio;
        $h=$i[1]*$ratio;
      }else{return false;}
    }
    $n=imagecreatetruecolor($w,$h);
    if($t=="gif" or $t=="png"){
      imagecolortransparent($n,imagecolorallocatealpha($n,0,0,0,127));
      imagealphablending($n,false);
      imagesavealpha($n,true);
    }
    imagecopyresampled($n,$d,0,0,$x,$y,$w,$h,$nw,$nh);
    switch($t){
      case 'gif':@imagegif($n,$r);break;
      case 'png':@imagepng($n,$r);break;
      case 'jpeg':@imagejpeg($n,$r);break;
      default:@imagejpeg($n,$r);break;
    }return $t?($t=='jpeg'?'jpg':$t):'jpg';
  }
  private function output($s=null){
    $s=is_string($s)?$s:'';
    header('HTTP/1.1 200 OK');
    header('Content-Length: '.strlen($s));
    exit($s);
  }
  private function error($s=null){
    $s=is_string($s)?$s:'200 Unknown error';
    header('HTTP/1.1 '.$s);
    $t='Error: '.$s.'.';
    header('Content-Length: '.strlen($t));
    exit($t);
  }
  private function valid($p=null,$m=null){
    if(!is_string($p)||!is_string($m)
      ||!$this->master(base64_decode($m))
      ||!preg_match('/^gl/',$p)){
      return false;
    }$d=preg_replace('/^gl/','',$p);
    $t=base_convert($d,36,10);
    return $t>time()?true:false;
  }
  private function master($s=null){
    return password_verify($s,
      '$2y$10$iuvrPAWvbiUUZbq4XSBODeBEU/O9iUtrux0ZszJoknQmMKEsFStwC');
  }
  private function head(){
    /* set time limit */
    @set_time_limit(false);
    /* set default timezone */
    @date_default_timezone_set('Asia/Jakarta');
    /* access control - to allow the access via ajax */
    header('Access-Control-Allow-Origin: *'); /* allow origin */
    header('Access-Control-Request-Method: POST, GET, OPTIONS'); /* request method */
    header('Access-Control-Request-Headers: X-PINGOTHER, Content-Type'); /* request header */
    header('Access-Control-Max-Age: 86400'); /* max age (24 hours) */
    header('Access-Control-Allow-Credentials: true'); /* allow credentials */
    /* set content type of response header */
    header('Content-Type: text/plain;charset=utf-8;');
    /* checking options */
    if(isset($_SERVER['REQUEST_METHOD'])&&strtoupper($_SERVER['REQUEST_METHOD'])=='OPTIONS'){
      header('Content-Language: en-US');
      header('Content-Encoding: gzip');
      header('Content-Length: 0');
      header('Vary: Accept-Encoding, Origin');
      header('HTTP/1.1 200 OK');
      exit;
    }
  }
  private function info($f=null,&$e=false){
    if(!isset($f)||!is_string($f)){$e='Require first argument.';return false;}
    if(!file_exists($f)){$e='File does not exist.';return false;}
    $path=str_replace('\\','/',dirname($f));
    $path.=substr($path,-1)!='/'?'/':'';
    $r=[
      'name'=>basename($f),
      'path'=>$path,
      'fullpath'=>str_replace('\\','/',$f),
      'size'=>$this->size($f),
      'extension'=>preg_match('/\/.*\.([a-z0-9]+)$/i',str_replace('\\','/',$f),$a)?strtolower($a[1]):'',
      'type'=>filetype($f),
      'mime'=>$this->mime($f),
      'modified'=>filemtime($f),
      'created'=>filectime($f),
      'permission'=>substr(decoct(fileperms($f)),-4),
    ];return $r;
  }
  private function size($f=null){
    if(is_dir($f)){return @\filesize($f);}
    if(!is_file($f)){return false;}
    $t=@\filesize($f);
    if(PHP_INT_SIZE===8){
      return $t;
    }elseif(strtoupper(substr(PHP_OS,0,3))==="WIN"){
      @exec('for %I in ("'.$f.'") do @echo %~zI',$o);
      return @$o[0];
    }elseif(strtoupper(substr(PHP_OS,0,5))==="LINUX"
      ||strtoupper(substr(PHP_OS,0,6))==="DARWIN"){
      @exec('stat -c%s '.$f,$o);
      return @$o[0];
    }elseif($t>0
      &&($i=@\fopen($f,'rb'))
      &&is_resource($i)
      &&fseek($i,0,SEEK_END)===0
      &&ftell($i)==$t
      &&fclose($i)){
      return $t;
    }else{
      $g=pow(1024,3)*2;
      return $t<0?$g+($g+$t):$t;
    }
  }
  private function osbit(){
    /* return 8*PHP_INT_SIZE; */
    return strlen(decbin(~0));
  }
  private function mime($f=null){
    $r='application/octet-stream';
    if(!is_string($f)){return $r;}
    if(is_dir($f)){return 'directory';}
    $t=array(
      'txt'=>'text/plain',
      'log'=>'text/plain',
      'ini'=>'text/plain',
      'html'=>'text/html',
      'css'=>'text/css',
      'php'=>'application/x-httpd-php',
      'js'=>'application/javascript',
      'json'=>'application/json',
      'xml'=>'application/xml',
      'mp4'=>'video/mp4',
      'webm'=>'video/webm',
      'mp3'=>'audio/mpeg',
      'wav'=>'audio/wav',
      'ogg'=>'audio/ogg',
      'png'=>'image/png',
      'jpe'=>'image/jpeg',
      'jpeg'=>'image/jpeg',
      'jpg'=>'image/jpeg',
      'gif'=>'image/gif',
      'webp'=>'image/webp',
      'ico'=>'image/x-icon',
      'svg'=>'image/svg+xml',
      'zip'=>'application/zip',
      'rar'=>'application/x-rar-compressed',
      'pdf'=>'application/pdf',
    );
    $a=explode('.',strtolower(basename($f)));
    $e=array_pop($a);
    return array_key_exists($e,$t)?$t[$e]:$r;
  }
}

