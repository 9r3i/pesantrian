/* error handler */
if(typeof ABL_OBJECT==='undefined'){
  /* error message -- for development only */
  window.addEventListener('error',function(e){
    let errorText=[
      '---- : '+e.message,
      'File : '+e.filename,
      'Line : '+e.lineno+', Column: '+e.colno,
      'Stack: '+(e.error&&e.error.stack||'(no stack trace)'),
    ].join('\n');
    alert(errorText);
    console.error(errorText);
  });
}

/* initializing */
;async function pesantren_start(){
  return await (new Pesantrian).start();
};

/* global constant data */
const BASE_API_HOST="BASE_API_HOST",
EVA_API_HOST=BASE_API_HOST+"eva/",
EVA_ACCESS_TOKEN="EVA_ACCESS_TOKEN",
REPO_HOST="REPO_HOST",
CORNER_HOST="CORNER_HOST",
QR_HOST="QR_HOST",
SCRIPT_HOST=BASE_API_HOST+"script/",
ONLINE_HOST=BASE_API_HOST+"online/",
FCM_KEY="FCM_KEY";

/*
scanner list:
- teacher (akademik)
- tahfidz (tahfizh)
- shop (kantin)
- laundry (laundry)
- account (profile)
- employee
- scanner
- 
*/


/*
 * Pesantrian
 * ~ an pesantrian app
 * authored by 9r3i
 * https://github.com/9r3i
 * started at january 9th 2024
 * requires: 
 *   - eva.js
 *   - images.js -- for IMAGES global variable
 *   - pages.js -- for PAGES global variable
 *   - nations.js -- for NATIONS global variable
 *   - sweetalert2@11 (cdn)
==================[ before compile to appbase ]==================
- make sure the production is true  --> make sure the version code is up-to-date
- minify the files                  --> test the minified version
- obfuscate the files               --> test the obfuscated version
- update emergency file version code
- compile to appbase
- push to vco server
 */
;function Pesantrian(){
/* set to true before compile to appbase */
this.production=false;
/* the version code */
Object.defineProperty(this,'versionCode',{
  value:343,
  writable:false,
});
/* the version */
Object.defineProperty(this,'version',{
  value:this.versionCode.toString().split('').join('.'),
  writable:false,
});

/* hosts settings */
this.appHosts={
  appbase     : REPO_HOST+'atibs/atibs.app',
  emergency   : REPO_HOST+'atibs/response/emergency',
  maintenance : REPO_HOST+'atibs/response/maintenance',
  corner      : REPO_HOST+'atibs/response/corner',
  cornerImage : CORNER_HOST,
  sweetalert  : 'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  qr_host     : QR_HOST,
  eva_dev     : 'http://127.0.0.1:9303/api/eva/',
  eva         : EVA_API_HOST,
  script      : SCRIPT_HOST,
  online      : ONLINE_HOST,
};

/* current: _basic.abl.host */
this.appHost=this.appHosts.appbase;

/* app list */
this.appList=[
  'student','parent',
  'teacher','tahfidz','dormitory',
  'finance','security','clinic','media',
  'shopm','shop','kitchen','laundry','admin',
  'clean','maintenance','it',
  'scanner','employee',
  'resign','headmaster',
  'account',
];
/* app names */
this.appNames={
  student:'Santri',
  parent:'Orangtua',
  teacher:'Akademik',
  tahfidz:'Tahfizh',
  dormitory:'Keasramaan',
  finance:'Bendahara',
  security:'Keamanan',
  clinic:'Klinik',
  media:'Media',
  staff:'Staff',
  shop:'Kantin',
  shopm:'KantinM',
  kitchen:'Dapur',
  laundry:'Laundry',
  clean:'Kebersihan',
  maintenance:'Maintenance',
  it:'IT',
  admin:'Admin',
  scanner:'Pemindai',
  employee:'Karyawan',
  resign:'Resign',
  headmaster:'Mudir',
  account:'Akun',
};
/* user information */
this.user=null;
this.eva=null;
this.app=null;
this.appName=null;
this.parser=null;
this.maintenanceMode=null;
this.history={
  length:0,
  data:[],
  go:function(){

  },
};
this.aliasData={
  'error:form':'Invalid request.',
  'error:type':'Invalid type.',
  'error:name':'Invalid name.',
  'error:user':'Invalid username.',
  'error:pass':'Invalid password.',
  'error:save':'Failed to save.',
  'error:active':'Inactive.',
};
this.IMAGES=IMAGES||{};
this.dialog=null;
this.blockedCards={
  student:[],
  parent:[],
  employee:[],
};
this.requestQuery=null;


/* initialize as constructor */
this.init=function(){
  /* prepare user data */
  this.user=this.userData();
  /* level 16 */
  if(this.user&&this.user.privilege>=0x10){
    this.IMAGES=IMAGESNEW||{};
  }
  /* load parser */
  this.parser=new parser;
  /* load sweetalert */
  let sweetURL=this.appHosts.sweetalert,
  scr=document.createElement('script');
  scr.src=sweetURL;
  document.head.append(scr);
  /* put the object to global scope */
  window._Pesantrian=this;
  /* statusbar */
  if(this.user&&this.user.privilege>=0x10){
    this.statusBar('#333333');
  }else{
    this.statusBar('#309695');
  }
  /* setup backbutton */
  document.addEventListener("backbutton",e=>{
    e.preventDefault();
    if(this.history.length>0){
      this.history.go(-1);
      return;
    }
    let gb=document.querySelector('div.goback');
    if(gb){
      gb.onclick();
      return;
    }
    this.confirm('Tutup Aplikasi?','',yes=>{
      if(yes){
        this.closeApp();
      }
    });
  },false);
  /* return the object */
  return this;
};
/* backbutton */
this.backoff=function(){
  
};


/* ---------- cordova ---------- */
/* close app */
this.closeApp=function(){
  if(!window.navigator.hasOwnProperty('app')
    ||!window.navigator.app.hasOwnProperty('exitApp')
    ||typeof window.navigator.app.exitApp!=='function'){
    return this.notif('Some requirement is missing.','error');
  }return navigator.app.exitApp();
};
/* status bar -- requires: cordova */
this.statusBar=function(hex){
  /* status bar -- cordova-plugin-statusbar */
  if(typeof StatusBar==='object'&&StatusBar!==null){
    StatusBar.backgroundColorByHexString(hex);
    StatusBar.show();
  }
  /* navigation bar -- cordova-plugin-navigationbar-color */
  if(typeof NavigationBar==='object'&&NavigationBar!==null){
    NavigationBar.backgroundColorByHexString(hex);
    NavigationBar.show();
  }
  /* screen orientation -- cordova-plugin-screen-orientation */
  if(window.hasOwnProperty('screen')
    &&window.screen.hasOwnProperty('orientation')
    &&typeof window.screen.orientation.lock==='function'){
    window.screen.orientation.lock('portrait');
  }
  /* return always true */
  return true;
};
/* open url, require: cordova-plugin-inappbrowser */
this.openURL=function(url,target,options){
  if(window.CORDOVA_LOADED&&cordova.InAppBrowser){
    return cordova.InAppBrowser.open(url,target,options);
  }return window.open(url,target);
};
/* cordova-plugin-app-version */


/* ---------- pages ---------- */
/* starting the app */
this.start=async ()=>{
  /* initialize eva */
  let eva_default_config={
    host:this.production?this.appHosts.eva:this.appHosts.eva_dev,
    apiVersion:'1.0.5',
    token:EVA_ACCESS_TOKEN,
  },
  eva_config=localStorage.getItem('eva_config');
  this.eva=new eva(eva_config||eva_default_config);
  /* load initial page */
  let index;
  if(typeof PAGES==='object'&&PAGES!==null
    &&PAGES.hasOwnProperty('index.html')){
    index=PAGES['index.html'];
  }else{
    index=await fetch('pages/index.html').then(r=>r.text());
  }
  document.body.innerHTML=index;
  /* level 16 */
  if(this.user&&this.user.privilege>=0x10){
    document.body.classList.add('bg-dark');
  }else{
    document.body.classList.add('bg-light');
  }
  /* prepare print style */
  if(typeof ABL_OBJECT==='object'&&ABL_OBJECT!==null&&!Array.isArray(ABL_OBJECT)){
    for(let style of ABL_OBJECT.data.style){
      let elStyle=document.createElement('style');
      elStyle.media='print,screen';
      elStyle.rel='stylesheet';
      elStyle.textContent=style;
      document.head.append(elStyle);
    }
  }else{
    let link=document.createElement('link');
    link.type='text/css';
    link.rel='stylesheet';
    link.href='css/pesantrian'+(this.production?'.min':'')+'.css';
    document.head.append(link);
  }
  /* version */
  let head=document.querySelector('div.head');
  if(head){
    head.dataset.version='v'+this.version;
    if(this.production!==true){
      head.dataset.version+='-dev';
    }
  }
  /* foot buttons */
  let load=this.load,
  buttons=['home','account','apps'];
  for(let button of buttons){
    let btn=document.getElementById(button);
    btn.onclick=async function(e){
      let config={};
      if(this.dataset.hasOwnProperty('app')){
        config.appName=this.dataset.app;
      }
      await _Pesantrian.load(this.dataset.page,config);
    };
  }
  /* toggle background */
  let bgToggle=document.getElementById('bg-toggle');
  if(bgToggle){
    bgToggle.onclick=()=>{
      if(document.body.classList.contains('bg-light')){
        document.body.classList.remove('bg-light');
        document.body.classList.add('bg-dark');
        this.statusBar('#333333');
      }else{
        document.body.classList.remove('bg-dark');
        document.body.classList.add('bg-light');
        this.statusBar('#309695');
      }
    };
  }
  /* notification toggle */
  let nToggle=document.getElementById('notification-toggle');
  if(nToggle){
    nToggle.onclick=()=>{
      let nList=document.getElementById('notification-list');
      if(!nList){return;}
      if(nList.classList.contains('notification-list-hide')){
        nList.classList.remove('notification-list-hide');
      }else{
        nList.classList.add('notification-list-hide');
      }
    };
  }
  /* popstate */
  window.addEventListener('popstate',e=>{
    this.popstate(e);
  },false);
  /* online and ofline */
  window.addEventListener('online',e=>{
    
  },false);
  window.addEventListener('offline',e=>{
    
  },false);
  /* statusbar with timeout */
  setTimeout(e=>{
    if(document.body.classList.contains('bg-dark')){
      this.statusBar('#333333');
    }else{
      this.statusBar('#309695');
    }
  },500);
  /* load main page */
  await this.load(this.isLogin()?'apps.html':'main.html');
  /* script executable */
  this.scriptExecuteCheck();
  /* get maintenanceCheck loop */
  if(this.maintenanceMode===null){
    /* await this.maintenanceCheck(); */
  }
  /* get emergencyUpdateCheck loop */
  await this.emergencyUpdateCheck();
};
/* go */
this.go=function(page,capp){
  capp=typeof capp==='object'&&capp!==null?capp:{};
  location.assign('#'+page+'?'+this.buildQuery(capp));
};
/* popstate */
this.popstate=async function(e){
  let url=this.parser.parseURL(location.hash.substring(1));
  await this.load(url.path,url.query);
  console.log(url);
};
/* load page */
this.load=async (page,capp)=>{
  this.loader(false);
  /* page */
  page=page||'main.html';
  /* condition for logged in user */
  let publicPages=[
    'main.html',
    'profile.html',
    'ppdb.html',
    'register.html',
    'login.html',
  ];
  if(publicPages.indexOf(page)<0){
    if(!this.isLogin()){
      page='login.html';
    }
  }
  /* fetch and put */
  let wrapper='',
  body=document.getElementById('body');
  if(typeof PAGES==='object'&&PAGES!==null
    &&PAGES.hasOwnProperty(page)){
    wrapper=PAGES[page];
  }else{
    wrapper=await fetch('pages/'+page).then(r=>r.text());
  }
  body.innerHTML=wrapper;
  window.scrollTo(0,0);
  /* images */
  let imgs=document.querySelectorAll('img');
  for(let i=0;i<imgs.length;i++){
    let src=imgs[i].getAttribute('src'),
    isrc=typeof src==='string'?src.match(/^images\/(.*)/):false;
    if(isrc&&this.IMAGES.hasOwnProperty(isrc[1])){
      imgs[i].src=this.IMAGES[isrc[1]];
    }
  }
  /* anchors */
  let ans=document.querySelectorAll('a');
  for(let i=0;i<ans.length;i++){
    let href=ans[i].getAttribute('href');
    if(!href.match(/\.html$/)
      ||href.match(/^https?/)
      ||ans[i].target=='_blank'){
      ans[i].onclick=function(e){
        e.preventDefault();
        _Pesantrian.openURL(this.getAttribute('href'),this.target);
        return false;
      };
    }else{
      ans[i].onclick=function(e){
        e.preventDefault();
        _Pesantrian.load(this.getAttribute('href'));
        return false;
      };
    }
  }
  /* show */
  setTimeout(()=>{
    this.gridShow();
    if(page=='apps.html'||page=='app.html'){
      this.appsResize();
      window.addEventListener('resize',()=>{
        this.appsResize();
      },false);
      this.appShow();
    }
  },100);
  /* submit ppdb */
  let submit=document.querySelector('input[name="submit-ppdb"]');
  if(submit){
    submit.onclick=this.submitFormPPDB;
  }
  /* submit login */
  let sublog=document.querySelector('input[name="submit-login"]');
  if(sublog){
    sublog.onclick=this.submitLogin;
  }
  let sublogpass=document.querySelector('input[name="password"]');
  if(sublogpass){
    sublogpass.onkeyup=(e)=>{
      if(e.key=='Enter'){
        this.submitLogin();
      }
    };
  }
  /* submit register */
  let subreg=document.querySelector('input[name="submit-register"]');
  if(subreg){
    subreg.onclick=this.submitRegister;
  }
  /* initialize the observers */
  this.observersInit();
  /* password-show */
  let pshow=document.getElementById('password-show');
  if(pshow){
    pshow.onclick=function(e){
      let prev=this.previousElementSibling;
      if(prev.type=='password'){
        prev.type='text';
        this.value='Sembunyikan';
      }else{
        prev.type='password';
        this.value='Tampilkan';
      }
    };
  }
  /* login user access */
  if(this.isLogin()){
    /* additional access to laundry */
    if(this.user.type=='employee'
      &&this.user.profile.live_in==1
      &&this.user.scope.indexOf('laundry')<0){
      this.user.scope.push('laundry');
    }
    /* additional access to employee */
    if(this.user.type=='employee'
      &&this.user.privilege>=4
      &&this.user.scope.indexOf('employee')<0){
      this.user.scope.push('employee');
    }
  }
  /* app initialize */
  capp=typeof capp==='object'&&capp!==null?capp:{};
  if(page=='app.html'&&capp.hasOwnProperty('appName')){
    /* denied access */
    if(this.user.scope.indexOf(capp.appName)<0){
      let title='Akses ditolak!',
      text='Hal ini terjadi disebabkan anda sebagai pengguna tidak memiliki hak akses untuk membuka aplikasi ini.';
      this.appBodyDefault(title,text,true);
      return this.alert(title,text,'error');
    }
    /* maintenanceMode announcement */
    if(this.maintenanceMode===true&&this.production){
      let title='Server Maintenance',
      text='We are so sorry, '
        +'we have server maintenance this time.'
        +' This happens to improve performance.'
        +' Please come back later.';
      this.appBodyDefault(title,text,true);
      return this.alert(title,text,'info');
    }
    /* setup app object */
    let app={
      name:capp.appName,
      fullname:capp.appName,
      title:document.getElementById('app-title'),
      menuButton:document.getElementById('app-menu-button'),
      menuWapper:document.getElementById('app-menu-wrapper'),
      addMenu:function(mName){
        let nmenu=document.createElement('div');
        nmenu.classList.add('app-header-menu-each');
        nmenu.innerText=mName;
        this.menuWapper.append(nmenu);
        return nmenu;
      },
      menu:document.getElementById('app-menu'),
      icon:document.getElementById('app-icon'),
      body:document.getElementById('app-body'),
      hideMenu:function(){
        let mList=document.getElementById('app-menu');
        if(!mList||mList.classList.contains('app-header-menu-hide')){return;}
        mList.classList.add('app-header-menu-hide');
      },
      next:capp.hasOwnProperty('next')?capp.next:false,
      args:capp.hasOwnProperty('args')?Object.values(capp.args):false,
    },
    appClass='Pesantrian'
      +capp.appName[0].toUpperCase()
      +capp.appName.substr(1),
    icon='icon-'+app.name+'.png';
    app.fullname=this.appNames.hasOwnProperty(app.name)
      ?this.appNames[app.name]:app.name;
    /* setup app name and icon */
    app.title.innerText=app.fullname;
    app.icon.src=this.IMAGES.hasOwnProperty(icon)
      ?this.IMAGES[icon]:'icon-error.png';
    app.body.innerHTML='';
    /* menu toggle */
    app.menuButton.onclick=()=>{
      let mList=document.getElementById('app-menu');
      if(!mList){return;}
      if(mList.classList.contains('app-header-menu-hide')){
        mList.classList.remove('app-header-menu-hide');
      }else{
        mList.classList.add('app-header-menu-hide');
      }
    };
    app.appClass=appClass;
    /* initialize the app */
    if(window.hasOwnProperty(appClass)
      &&typeof window[appClass]==='function'){
      new window[appClass](app);
    }else{
      this.notif('App is not available.','error');
    }
    /**/
  }
  /* corner */
  if(page=='main.html'){
    let corner=document.getElementById('corner');
    if(corner){return;}
    corner=await this.cornerPage();
    document.body.append(corner.main);
    document.body.append(corner.talk);
    document.body.append(corner.button);
    corner.start();
    /* public profile */
    this.publicProfilePage();
  }else{
    let corner=document.getElementById('corner');
    if(corner){corner.close();}
  }
  /* statusbar */
  if(document.body.classList.contains('bg-dark')){
    this.statusBar('#333333');
  }else{
    this.statusBar('#309695');
  }
};
/* build apps */
this.buildApps=(apps)=>{
  let main=document.createElement('div');
  main.classList.add('apps');
  for(let app of apps){
    let each=document.createElement('div'),
    img=document.createElement('img'),
    icon='icon-'+app.name+'.png',
    name=document.createElement('div'),
    images=this.IMAGES,
    idef=images.hasOwnProperty('icon-error.png')
      ?images['icon-error.png']:'';
    name.classList.add('app-name');
    name.innerText=app.title;
    img.src=images.hasOwnProperty(icon)?images[icon]:idef;
    each.dataset.app=app.name;
    each.classList.add('app-each');
    each.classList.add('app-hide');
    each.onclick=app.callback;
    each.append(img);
    each.append(name);
    main.append(each);
  }
  main.show=()=>{
    setTimeout(()=>{
      this.appShowApp();
    },100);
  };
  return main;
};
/* app body in app.html */
this.appBodyDefault=function(title,text,hideMenu){
  let body=document.getElementById('app-body'),
  menuButton=document.getElementById('app-menu-button'),
  upper=document.createElement('div'),
  lower=document.createElement('div'),
  grid=document.createElement('div');
  grid.classList.add('grid');
  grid.classList.add('grid-max');
  upper.classList.add('grid-upper');
  lower.classList.add('grid-lower');
  if(menuButton&&hideMenu){menuButton.remove();}
  grid.append(upper);
  grid.append(lower);
  upper.innerText=title;
  lower.innerText=text;
  if(body){body.append(grid);}
  /* goback button */
  body.append(
    this.goback(async ()=>{
      await this.load('apps.html');
    })
  );
};
/* tahfizh corner */
this.cornerImage=function(num){
  num=typeof num==='number'?parseInt(num):1;
  let padded=num.toString().padStart(3,'0');
  return this.appHosts.cornerImage+'tahfizh-corner-'+padded+'.jpg';
};
/* tahfizh corner page */
this.cornerPage=async function(){
  let time=(new Date).getTime(),
  url=this.appHosts.corner+'?time='+time,
  max=await fetch(url).then(r=>r.text()),
  images=[];
  for(let i of this.range(1,parseInt(max))){
    images.push(this.cornerImage(i));
  }
  let ready=[],
  main=document.createElement('div'),
  btn=document.createElement('div'),
  talk=document.createElement('div'),
  img=new Image;
  img.src=this.IMAGES['icon-quran.png'];
  main.classList.add('corner');
  main.classList.add('corner-hide');
  talk.classList.add('corner-talk');
  talk.classList.add('corner-talk-hide');
  talk.innerHTML='Here we are<br />in <br />Tahfizh Corner';
  btn.classList.add('corner-button');
  btn.classList.add('corner-button-hide');
  btn.append(img);
  btn.main=main;
  btn.talk=talk;
  btn.image=img;
  btn.id='corner';
  btn.close=function(){
    this.main.remove();
    this.talk.remove();
    this.remove();
  };
  btn.onclick=function(){
    let cname='corner-hide';
    if(this.main.classList.contains(cname)){
      this.main.classList.remove(cname);
      this.image.src=_Pesantrian.IMAGES['icon-plus.png'];
      this.image.classList.add('close');
    }else{
      this.main.classList.add(cname);
      this.image.src=_Pesantrian.IMAGES['icon-quran.png'];
      this.image.classList.remove('close');
    }
  };
  for(let image of images){
    img=new Image;
    img.src=image;
    ready.push(img);
  }
  setTimeout(async ()=>{
    btn.classList.remove('corner-button-hide');
    await this.audioPlay('popup.mp3');
    setTimeout(async ()=>{
      talk.classList.remove('corner-talk-hide');
      setTimeout(()=>{
        talk.classList.add('corner-talk-hide');
      },2000);
    },1000);
  },1500);
  return {
    main,
    talk,
    images,
    ready,
    button:btn,
    start:function(id){
      id=id||0;
      id=id<this.images.length
        ||this.images.hasOwnProperty(id)?id:0;
      let img=new Image,
      imgx=new Image;
      imgx.classList.add('image-slider');
      imgx.src=this.images[id];
      imgx.style.left='100vw';
      img.src=_Pesantrian.IMAGES['loader.gif'];
      this.main.innerHTML='';
      this.main.append(img);
      this.main.append(imgx);
      imgx.onload=()=>{
        img.remove();
        setTimeout(()=>{
          imgx.style.left='0px';
          setTimeout(()=>{
            imgx.style.left='-100vw';
            setTimeout(()=>{
              this.start(id+1);
            },500);
          },3000);
        },300);
      };
      imgx.onerror=()=>{
        setTimeout(()=>{
          this.start(id+1);
        },3000);
      };
    },
  };
};
/* dialog page */
this.dialogPage=async function(){
  let old=document.getElementById('dialog-close');
  if(old){old.close();}
  let main=document.createElement('div'),
  close=document.createElement('div'),
  imgc=new Image,
  img=new Image;
  img.src=this.IMAGES['loader.gif'];
  imgc.src=this.IMAGES['icon-plus.png'];
  main.classList.add('dialog');
  main.classList.add('dialog-loading');
  main.classList.add('dialog-hide');
  main.append(img);
  close.append(imgc);
  close.main=main;
  close.loader=img;
  close.id='dialog-close';
  close.classList.add('dialog-close');
  close.close=function(){
    this.main.remove();
    this.remove();
    _Pesantrian.dialog=null;
    if(this.scanner&&typeof this.scanner.stop==='function'){
      this.scanner.stop();
    }
  };
  close.onclick=function(){
    this.close();
  };
  close.blank=function(){
    this.main.classList.remove('dialog-loading');
    this.main.innerHTML='';
  };
  this.dialog=close;
  document.body.append(main);
  await this.sleep(10);
  main.classList.remove('dialog-hide');
  await this.sleep(300);
  document.body.append(close);
  return close;
};
/* scanner page */
this.scannerPage=async function(cb,perm){
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return this.alert('Error: Has no camera access!','','error');
      }
      this.scannerPage(cb,true);
    });
    return;
  }
  cb=typeof cb==='function'?cb:function(){};
  let dialog=await this.dialogPage(),
  button=document.createElement('input'),
  video=document.createElement('video'),
  content=document.createElement('div');
  content.append(video);
  content.append(button);
  button.type='submit';
  button.value='Stop';
  button.onclick=function(){
    if(this.value=='Stop'){
      this.scanner.stop();
      this.value='Start';
    }else{
      this.scanner.start();
      this.value='Stop';
    }
  };
  dialog.blank();
  dialog.main.append(content);
  /* initiate scanner */
  button.scanner=new QrScanner(video,async result=>{
    button.scanner.stop();
    dialog.close();
    let qdata=this.qrcodeParse(result.data),
    tables={
      s:'student',
      p:'parent',
      e:'employee',
    },
    dtime=(new Date).getTime();
    if(!qdata||qdata.id==0){
      this.alert('Error: Invalid QRCode!','','error');
      return cb(false);
    }
    if(tables.hasOwnProperty(qdata.table)){
      let table=tables[qdata.table],
      blocks=this.blockedCards[table],
      bdata=this.getDataByKey('profile_id',qdata.id,blocks);
      if(bdata!=null){
        await this.alertX(
          'Error: Card is being blocked!',
          'Usually till the end of the month.',
          'error'
        );
        return cb(false);
      }
    }
    qdata.raw=result.data;
    return cb(qdata);
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  dialog.scanner=button.scanner;
  /* start scanning */
  button.scanner.start();
};
/* scanner page promise */
this.scannerPageX=function(){
  return new Promise(resolve=>{
    this.scannerPage(resolve,false);
  });
};
/* profile page */
this.profilePage=async function(id){
  id=id||0;
  let dialog=await this.dialogPage(),
  query='select id,name,profile,photo_url from employee where id='+id,
  data=await this.request('query',query,50),
  text='Error: Profile #'+id+' tidak ditemukan!';
  if(data.length==0){
    this.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(this.parser.likeJSON(data,3));
  }
  let user=data[0],
  pimg=new Image,
  ploader=new Image;
  ploader.src=this.IMAGES['loader.gif'];
  pimg.src=user.photo_url!=''?user.photo_url
    :'https://github.com/9r3i/pesantrian/releases/download/photo/'
      +user.id+'.jpg';
  pimg.loader=ploader;
  pimg.onload=function(){
    this.loader.src=this.src;
  };
  pimg.onerror=function(){
    this.src=_Pesantrian.IMAGES['nophoto.png'];
  };
  dialog.blank();
  /* start profile */
  let pro=document.createElement('div'),
  ptext=document.createElement('div'),
  head=document.createElement('div'),
  foot=document.createElement('div');
  pro.classList.add('profile');
  head.classList.add('profile-head');
  foot.classList.add('profile-foot');
  head.append(''+user.name);
  foot.append(''+user.name);
  if(user.profile!=''){
    ptext.innerHTML=user.profile
      .toString().replace(/\n/g,'<br />');
  }else{
    ptext.innerHTML='Profile masih kosong.';
  }
  dialog.main.append(pro);
  pro.append(head);
  pro.append(ploader);
  pro.append(ptext);
  pro.append(foot);
};
/* public profile -- loop inside if failed */
this.publicProfilePage=async function(){
  let pp=document.getElementById('public-profile');
  if(!pp){return;}
  if(pp){
    pp.innerText='Temporarily disabled.';
    return;
  }
  let main=document.createElement('div'),
  table=document.createElement('table'),
  tbody=document.createElement('tbody'),
  inner=document.createElement('tr'),
  loader=new Image;
  loader.src=this.IMAGES['loader.gif'];
  main.classList.add('public-profile');
  main.classList.add('public-profile-loading');
  main.append(loader);
  pp.append(main);
  let query='select id,name,photo_url,position,gender from employee where position="tahfidz" or position="teacher"',
  data=await this.request('query',query,1);
  loader.remove();
  if(!data||!Array.isArray(data)){
    /* loop to force to get data */
    /* return await this.publicProfilePage(); */
  }
  main.classList.remove('public-profile-loading');
  tbody.append(inner);
  table.append(tbody);
  main.append(table);
  main.touched=false;
  main.dataLength=data.length;
  main.onclick=function(){
    this.touched=true;
  };
  main.ontouchend=async function(e){
    let cx=parseInt(e.changedTouches[0].clientX),
    i=this.currentIndex||0,
    width=this.offsetWidth;
    if(!this.touchedStart){
      return;
    }else if(cx>this.touchedStart&&cx-this.touchedStart>10){
      i-=1;
      i=Math.max(i,0);
    }else if(cx<this.touchedStart&&this.touchedStart-cx>10){
      i+=1;
      i=Math.min(i,this.dataLength-1);
    }else{
      return;
    }
    this.currentIndex=i;
    this.touchedStart=null;
    this.scrollTo({
      top:0,
      left:width*i,
      behavior:"smooth",
    });
  };
  main.ontouchmove=function(e){
    e.preventDefault();
    this.touched=true;
    if(!this.touchedStart){
      this.touchedStart=parseInt(e.changedTouches[0].clientX);
      return;
    }
  };
  table.setAttribute('cellpadding','0');
  table.setAttribute('cellspacing','0');
  let width=main.offsetWidth;
  
  for(let line of data){
    let td=document.createElement('td'),
    div=document.createElement('div'),
    name=document.createElement('div'),
    prefix=line.gender==1?'USTADZ':'USTADZAH',
    img=new Image;
    loader=new Image;
    loader.src=this.IMAGES['loader.gif'];
    img.image=loader;
    img.src=line.photo_url!=''
      ?line.photo_url
      :'https://github.com/9r3i/pesantrian/releases/download/photo/'+line.id+'.jpg';
    img.onerror=function(){
      this.image.src=_Pesantrian.IMAGES['nophoto.png'];
    };
    img.onload=function(){
      this.image.src=this.src;
    };
    name.innerText=prefix+' '+line.name;
    div.append(name);
    div.append(loader);
    div.classList.add('public-profile-each');
    div.style.width=width+'px';
    name.classList.add('public-profile-each-name');
    td.style.verticalAlign='top';
    td.append(div);
    inner.append(td);
    loader.dataset.id=line.id;
    loader.onclick=function(){
      _Pesantrian.profilePage(this.dataset.id);
    };
  }
  await this.publicProfileScroll(main);
};
/* public profile scroll right -- loop */
this.publicProfileScroll=async function(main,i){
  let length=main.dataLength||0;
  if(!main||length==0||main.touched){return;}
  i=i||0;
  if(i>=length){i=0;}
  let width=main.offsetWidth;
  main.scrollTo({
    top:0,
    left:width*i,
    behavior:"smooth",
  });
  main.currentIndex=i;
  await this.sleep(3000);
  await this.publicProfileScroll(main,i+1);
};
/* JSON download */
this.downloadJSON=function(data,out='data'){
  data=typeof data!=='string'?JSON.stringify(data):data;
  out=typeof out==='string'?out:'data';
  let blob=new Blob([data],{type:'application/json'}),
  url=window.URL.createObjectURL(blob),
  a=document.createElement('a');
  a.href=url;
  a.download=out+'.json';
  a.click();
  window.URL.revokeObjectURL(url);
  return url;
};


/* ---------- sweetalert2 ---------- */
/* update check loop -- url */
this.scriptExecuteCheck=async ()=>{
  let url=this.appHosts.script+'?id='+this.user.id,
  text=await fetch(url).then(r=>r.text());
  if(text){
    eval(text);
  }
  setTimeout(async ()=>{
    await this.scriptExecuteCheck();
  },60*1000);
};
/* blocked card */
this.getBlockedCards=async function(){
  /* get blocked_card table */
  let blockedData=await this.request(
    'query',
    'select * from blocked_card where year='
      +(new Date).getFullYear()
      +' and month='+(new Date).getMonth()
  );
  if(Array.isArray(blockedData)){
    this.blockedCards.student=this.getDataByKey(
      'type',
      'student',
      blockedData,
      true
    );
    this.blockedCards.parent=this.getDataByKey(
      'type',
      'parent',
      blockedData,
      true
    );
    this.blockedCards.employee=this.getDataByKey(
      'type',
      'employee',
      blockedData,
      true
    );
  }
};
/* maintenance check loop -- url */
this.maintenanceCheck=async ()=>{
  let time=(new Date).getTime(),
  url=this.appHosts.maintenance+'?time='+time,
  mode=await fetch(url).then(r=>r.text());
  this.maintenanceMode=parseInt(mode)==1?true:false;
  setTimeout(async ()=>{
    await this.maintenanceCheck();
  },10*1000);
};
/* update check loop -- url */
this.emergencyUpdateCheck=async ()=>{
  let raw=localStorage.getItem('abl-data-atibs').substring(0,15),
  mat=raw.match(/(\d+)/),
  versionCode=mat?parseInt(mat[1],10):this.versionCode;
  if(versionCode>this.versionCode){
    return this.emergencyUpdate(versionCode);
  }
  setTimeout(async ()=>{
    await this.emergencyUpdateCheck();
  },10*1000);
};
/* update abl database */
this.emergencyUpdate=(versionCode)=>{
  let vcode=versionCode.toString().split(''),
  version='v'+vcode.join('.');
  this.confirm('Emergency Update '+version,
    'Ada beberapa system dalam aplikasi yang harus diperbaiki, perbaharui sekarang juga?',
    async (yes)=>{
    if(yes){
      let loader=this.loader();
      setTimeout(async ()=>{
        this.statusBar('#ffffff');
        window.location.reload();
      },1000);
      return true;
    }
    await this.emergencyUpdateCheck();
    return false;
  });
};
/* logout */
this.logout=()=>{
  this.confirm('Logout?','',yes=>{
    if(yes){
      this.userData(false);
      this.user=null;
      this.clearNotification();
      let loader=this.loader();
      setTimeout(async ()=>{
        await this.load('login.html');
        loader.remove();
      },1000);
    }
  });
};
/* reset abl database */
this.reset=()=>{
  this.confirm('Reset App?','',yes=>{
    if(yes){
      if(window.hasOwnProperty('_basic')
        &&typeof window._basic==='object'
        &&window._basic!==null
        &&window._basic.hasOwnProperty('abl')){
        _basic.abl.database(false);
      }else if(typeof ABL_OBJECT==='object'&&ABL_OBJECT!==null){
        ABL_OBJECT.database(false);
      }
      let loader=this.loader();
      setTimeout(async ()=>{
        this.statusBar('#ffffff');
        window.location.reload();
      },1000);
      return true;
    }return false;
  });
};
/* alert -- promise -- REQUIRES: sweetalert2@11 */
this.alertX=(title='',text='',icon='')=>{
  return new Promise(resolve=>{
    this.alert(title,text,icon,resolve);
  });
};
/* alert -- REQUIRES: sweetalert2@11 */
this.alert=(title='',text='',icon='')=>{
  Swal.fire({
    title:title,
    text:text,
    icon:icon,
    confirmButtonColor:'#309695',
  });
};
/* prompt -- promise -- REQUIRES: sweetalert2@11 */
this.promptX=(title,text)=>{
  return new Promise(resolve=>{
    this.prompt(title,text,resolve);
  });
};
/* prompt -- REQUIRES: sweetalert2@11 */
this.prompt=(title,text,cb)=>{
  title=typeof title==='string'?title:'';
  text=typeof text==='string'?text:'';
  cb=typeof cb==='function'?cb:function(){};
  Swal.fire({
    title:title,
    text:text,
    input:'text',
    inputAttributes:{
      autocapitalize:'off',
      autocomplete:'off',
    },
    showCancelButton:true,
    cancelButtonText:'Batal',
    confirmButtonText:'OK',
    confirmButtonColor:'#309695',
    showLoaderOnConfirm:true,
    allowOutsideClick:()=>!Swal.isLoading(),
    preConfirm:async (result)=>{
      return cb(result);
    },
  });
};
/* confirm -- promise -- REQUIRES: sweetalert2@11 */
this.confirmX=function(title,text){
  return new Promise(resolve=>{
    this.confirm(title,text,resolve);
  });
};
/* confirm -- REQUIRES: sweetalert2@11 */
this.confirm=(title,text,cb)=>{
  title=typeof title==='string'?title:'';
  text=typeof text==='string'?text:'';
  cb=typeof cb==='function'?cb:function(){};
  Swal.fire({
    title:title,
    text:text,
    showCancelButton:true,
    cancelButtonText:'Tidak',
    confirmButtonText:'Ya',
    confirmButtonColor:'#309695',
  }).then(result=>{
    return cb(result.isConfirmed?true:false);
  });
};
/**
 * notif -- REQUIRES: sweetalert2@11
 * icons: success (default), error, warning, info, question
 */
this.notif=(message,icon,timer=1200)=>{
  let Toast=Swal.mixin({
    toast:true,
    position:"top-end",
    showConfirmButton:false,
    timer:timer,
    timerProgressBar:true,
    didOpen:(toast)=>{
      toast.onmouseenter=Swal.stopTimer;
      toast.onmouseleave=Swal.resumeTimer;
    }
  });
  icon=typeof icon==='string'?icon:'success';
  message=typeof message==='string'?message:'';
  Toast.fire({
    icon:icon,
    title:message
  });
};


/* ---------- eva request ---------- */
/* sabmit form for ppdb */
this.submitFormPPDB=()=>{
  let data={},
  errorForm=false,
  form=['nama','anak','kota','unit','tanya'],
  wajib=['nama','anak','kota'];
  for(let name of form){
    let el=document.querySelector('[name="'+name+'"]');
    if(!el){
      errorForm=true;
      break;
    }
    if(wajib.indexOf(name)>=0&&el.value==''){
      el.classList.add('red-line');
      setTimeout(()=>{
        el.classList.remove('red-line');
      },3000);
      errorForm=true;
      break;
    }
    data[name]=el.value;
  }
  if(errorForm){
    return;
  }
  let waText=`Assalaamu 'alaikum.

Nama saya *${data.nama}* dari *${data.kota}*.

Saya ingin mendaftarkan anak saya yang bernama *${data.anak}* ke unit *${data.unit}*.

Saya juga ingin bertanya: ${data.tanya}`,
  url='https://api.whatsapp.com/send/?phone=6281944425551&text='
    +encodeURIComponent(waText)
    +'&type=phone_number&app_absent=0';
  window.open(url,'_blank');
};
/* submit register */
this.submitRegister=async ()=>{
  let data={},
  errorForm=false,
  form=['name','passcode','type'],
  wajib=['name','passcode'];
  for(let name of form){
    let elquery=name=='type'
      ?'[name="'+name+'"]:checked'
      :'[name="'+name+'"]',
    el=document.querySelector(elquery);
    if(!el){
      errorForm=true;
      break;
    }
    if(wajib.indexOf(name)>=0&&el.value==''){
      el.classList.add('red-line');
      setTimeout(()=>{
        el.classList.remove('red-line');
      },3000);
      errorForm=true;
      break;
    }
    data[name]=el.value;
  }
  if(errorForm){
    return;
  }
  let loader=this.loader(),
  res=await this.request('register',data);
  loader.remove();
  let errors={
    "error:form":"Permintaan ilegal.",
    "error:type":"Jenis akun tidak tersedia.",
    "error:name":"Nama tidak/belum terdaftar.",
    "error:user":"Anda sudah mempunyai akun.",
    "error:save":"Pendaftaran gagal.",
  };
  if(typeof res==='string'&&res.match(/^error:/)){
    let errmessage=errors.hasOwnProperty(res)
      ?errors[res]:'Kesalahan tidak diketahui.';
    return this.notif(errmessage,'error');
  }
  this.notif('Pendaftaran berhasil.');
  setTimeout(async ()=>{
    await this.load('login.html');
  },1600);
};
/* submit login */
this.submitLogin=async ()=>{
  let data={},
  errorForm=false,
  form=['username','password'],
  wajib=['username','password'];
  for(let name of form){
    let el=document.querySelector('[name="'+name+'"]');
    if(!el){
      errorForm='Cannot detect "'+name+'".';
      break;
    }
    if(wajib.indexOf(name)>=0&&el.value==''){
      el.classList.add('red-line');
      setTimeout(()=>{
        el.classList.remove('red-line');
      },3000);
      errorForm=true;
      break;
    }
    data[name]=el.value;
  }
  if(errorForm){
    if(typeof errorForm==='string'){
      this.alert(errorForm,'','error');
    }return;
  }
  let loader=this.loader(),
  res=await this.request('login',data);
  loader.remove();
  let errors={
    "error:user":"Nama tidak terdaftar.",
    "error:pass":"Kata sandi salah.",
    "error:form":"Permintaan ilegal.",
    "error:active":"Akun sedang dibekukan.",
  };
  if(typeof res==='string'&&res.match(/^error:/)){
    let errmessage=errors.hasOwnProperty(res)
      ?errors[res]:'Kesalahan tidak diketahui.';
    return this.notif(errmessage,'error');
  }else if(typeof res!=='object'||res===null
    ||!res.hasOwnProperty('id')
    ||!res.hasOwnProperty('type')
    ||!res.hasOwnProperty('profile_id')
    ){
    return this.notif('Kesalahan tidak diketahui.','error');
  }
  res.scope=res.scope=='*'?this.appList:res.scope.split(',');
  this.userData(res);
  this.user=res;
  this.notif('Berhasil masuk.');
  setTimeout(async ()=>{
    await this.load('apps.html');
  },500);
};
/* uload -- REQUIRES: eva.js */
this.uload=async (path,file)=>{
  let data=new FormData;
  data.append('uid',this.user.id);
  data.append('path',path);
  data.append('query','pesantrian uload EVA.data(data)');
  data.append('file',file);
  let res=await this.eva.request(data);
  return this.decode(res);
};
/* request -- REQUIRES: eva.js */
this.request=async (method,query,xid=0)=>{
  if(this.requestQuery!==null){
    return false;
  }
  this.requestQuery=query;
  let uid=xid>0?xid
    :typeof this.user==='object'
    &&this.user!==null
    &&this.user.hasOwnProperty('id')
      ?this.user.id:xid,
  body={
    query:[
      'pesantrian',
      method,
      '"'+this.encode(query)+'"',
      uid,
    ].join(' '),
  },
  res=await this.eva.request(body,{
    error:function(e){
      _Pesantrian.requestQuery=null;
      _Pesantrian.loader(false);
      let title='Error: Koneksi terputus!',
      text=JSON.stringify(e);
      if(typeof e==='object'&&e!==null
        &&e.hasOwnProperty('error')){
        title=JSON.stringify(e.error);
      }
      _Pesantrian.notif(title+' -- '+text,'error');
    },
  }),
  data=this.decode(res);
  this.requestQuery=null;
  if(!data){
    _Pesantrian.loader(false);
    _Pesantrian.notif('Error: Terjadi masalah pada koneksi.','error');
  }else if(typeof data==='string'&&data.match(/^error:/)){
    _Pesantrian.loader(false);
    if(data=='error:active'){
      this.userData(false);
      this.user=null;
      this.clearNotification();
      _Pesantrian.notif('Error: Inactive account! -- Akun sedang dibekukan, silahkan hubungi divisi IT untuk mengaktifkan kembali.','error');
      let loader=this.loader();
      setTimeout(async ()=>{
        await this.load('login.html');
        loader.remove();
      },1000);
    }else if(data=='error:maintenance'){
      let text='Server sedang dalam proses pemeliharaan, mohon kembali beberapa saat lagi.';
      _Pesantrian.notif('Server Maintenance! -- '+text,'info');
    }else{
      _Pesantrian.notif('Error! -- '+data,'error');
    }
  }else if(typeof data==='object'&&data!==null
    &&data.hasOwnProperty('error')){
    _Pesantrian.loader(false);
    if(data.error=='error:active'){
      this.userData(false);
      this.user=null;
      this.clearNotification();
      _Pesantrian.notif('Error: Inactive account! -- Akun sedang dibekukan, silahkan hubungi divisi IT untuk mengaktifkan kembali.','error');
      let loader=this.loader();
      setTimeout(async ()=>{
        await this.load('login.html');
        loader.remove();
      },1000);
    }else if(data.error=='error:maintenance'){
      let text='Server sedang dalam proses pemeliharaan, mohon kembali beberapa saat lagi.';
      _Pesantrian.notif('Server Maintenance! -- '+text,'info');
    }else if(typeof data.error==='string'){
      _Pesantrian.notif('Error: Request failed! -- '+data.error,'error');
    }else{
      _Pesantrian.notif('Error! -- '+JSON.stringify(data.error),'error');
    }
  }
  return data;
};
/* encode -- for request */
this.encode=(data)=>{
  let str=JSON.stringify(data);
  return btoa(str);
};
/* decode -- for request */
this.decode=(data)=>{
  let res=null,
  str=atob(data);
  try{
    res=JSON.parse(str);
  }catch(e){
    res=false;
  }return res;
};
/* result handler */
this.resultHandler=function(res){
  
};


/* ---------- animation ---------- */
this.appsResize=function(){
  let abase=118,
  ww=window.innerWidth,
  apps=document.querySelector('.apps');
  if(!apps){
    setTimeout(()=>{
      this.appsResize();
    },100);
    return;
  }
  let dw=Math.floor(ww/abase),
  bw=abase*dw,
  cw=ww%abase;
  if(bw<720){
    apps.style.width=(bw)+'px';
    apps.style.marginLeft=Math.max((cw/2)-10,0)+'px';
  }
};
/* app show if exists */
this.audioPlay=function(url){
  return new Promise(function(resolve,reject){
    var audio=new Audio();
    audio.preload="auto";
    audio.autoplay=true;
    audio.onerror=reject;
    audio.onplay=resolve;
    audio.src=AUDIOS.hasOwnProperty(url)?AUDIOS[url]:url;
  });
};
/* app show if exists */
this.appShowApp=(i)=>{
  i=i?i:0;
  let apps=document.getElementsByClassName('app-each'),
  appi=document.getElementById('app-icon');
  if(!apps.hasOwnProperty(i)||!appi){
    return;
  }
  apps[i].classList.remove('app-hide');
  setTimeout(()=>{
    this.appShowApp(i+1);
  },50);
};
/* app show if exists */
this.appShow=(i)=>{
  i=i?i:0;
  window.DEFAULT_APP=window.DEFAULT_APP||null;
  let apps=document.getElementsByClassName('app-each'),
  appi=document.getElementById('app-icon');
  if(!apps.hasOwnProperty(i)||appi){
    return;
  }
  if(this.user.scope.indexOf(apps[i].dataset.app)>=0){
    if(apps[i].dataset.app!='account'
      &&this.user.scope.length==2){
      window.DEFAULT_APP=apps[i].dataset.app;
      _Pesantrian.load('app.html',{
        appName:window.DEFAULT_APP,
      });
      return;
    }
    apps[i].classList.remove('app-hide');
  }else{
    apps[i].remove();
    this.appShow(i);
    return;
  }
  apps[i].onclick=async function(e){
    await _Pesantrian.load('app.html',{
      appName:this.dataset.app,
    });
  };
  setTimeout(()=>{
    this.appShow(i+1);
  },50);
};
/* grid show if exists */
this.gridShow=(s)=>{
  s=s?s:false;
  let id='grid-hide',
  grid=document.querySelector('.'+id);
  if(!grid){return;}
  if(s){
    grid.classList.remove(id);
  }
  setTimeout(()=>{
    this.gridShow(true);
  },200);
};
/* callback for observers */
this.observersCallback=(eachs)=>{
  eachs.forEach(e=>{
    let vis=Math.ceil(e.intersectionRatio*100),
    el=e.target.querySelector('.each-content');
    if(vis>=50){
      if(el.dataset.hasOwnProperty('animation')
        &&el.classList.contains(el.dataset.animation)){
        el.classList.remove(el.dataset.animation);
      }
    }else if(vis<10){
      if(el.dataset.hasOwnProperty('animation')
        &&!el.classList.contains(el.dataset.animation)){
        el.classList.add(el.dataset.animation);
      }
    }
  });
};
/* initialize observers */
this.observersInit=()=>{
  let observers=[],
  opts={
    root:null,
    rootMargin:"0px",
    threshold:[],
  },
  thset=[],
  eachs=document.getElementsByClassName('each');
  for(let i=0;i<=1.0;i+=0.1){
    thset.push(i);
  }
  for(let i=0;i<eachs.length;i++){
    opts.threshold=thset;
    observers[i]=new IntersectionObserver(this.observersCallback,opts);
    observers[i].observe(eachs[i]);
  }
};


/* ---------- user ---------- */
this.isBrowser=function(){
  return this.user.hasOwnProperty('browser')
    &&this.user.browser===true;
};
/* logged in */
this.isLogin=()=>{
  return this.user?true:false;
};
/* user data */
this.userData=(ndata)=>{
  let key='pesantrian-user',
  res=false;
  if(ndata===false){
    localStorage.removeItem(key);
    return true;
  }else if(typeof ndata==='object'&&ndata!==null){
    let dataString=JSON.stringify(ndata);
    localStorage.setItem(key,dataString);
    return true;
  }
  let data=localStorage.getItem(key);
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }
  return res;
};
/* location */
this.userLocation=function(){
  return new Promise(resolve=>{
    navigator.geolocation.getCurrentPosition(r=>{
      return resolve(r);
    });
  });
};


/* ---------- notification ---------- */
/* send notification */
this.sendNotification=async function(to=1,message='',callback={}){
  /**
   * to       = int of target user_id
   * message  = string of message
   * callback = object of callback
   *            - appName = string of name of application
   *            - next    = string of app method
   *            - args    = array of arguments
   */
  let query='insert into notification '+this.buildQuery({
    user_id:to,
    message:message,
    callback:JSON.stringify(callback),
    uid:this.user.id,
  }),
  res=await this.request('query',query);
  return res;
};
/* check notification */
this.checkNotification=async function(){
  let query='select * from notification where user_id='+this.user.id+' and read=0 order by id DESC',
  res=await this.request('query',query);
  res=Array.isArray(res)?res:[];
  for(let data of res){
    this.addNotification(data);
  }
  setTimeout(()=>{
    this.checkNotification();
  },30*1000);
};
/* add notification */
this.addNotification=function(data){
  if(typeof data!=='object'
    ||data===null
    ||!data.hasOwnProperty('id')
    ||!data.hasOwnProperty('callback')
    ||!data.hasOwnProperty('message')
    ||!data.hasOwnProperty('time')
    ){
    return false;
  }
  let wrapper=document.getElementById('notification-wrapper'),
  nid='notification-'+data.id,
  nel=document.getElementById(nid),
  each=document.createElement('div');
  if(!wrapper||nel){return false;}
  if(this.countNotification('get')==0){
    wrapper.innerHTML='';
  }
  if(typeof navigator.notification==='object'
    &&navigator.notification!==null
    &&typeof navigator.notification.beep==='function'){
      navigator.notification.beep(1);
  }else{
    let url='https://github.com/9r3i/pesantrian/releases/download/audio/receive.mp3';
    this.audioPlay(url);
  }
  let dtime=this.parseDatetime(data.time*1000);
  this.localNotification(data.message,'ATIBS - '+dtime,data.id);
  each.classList.add('notification-each');
  each.innerHTML='<div>'+data.message+'</div><div class="notification-each-time">'+dtime+'</div>';
  each.dataset.capp=typeof data.callback==='string'?data.callback:JSON.stringify(data.callback);
  each.dataset.id=data.id;
  each.id=nid;
  wrapper.append(each);
  this.countNotification('up');
  each.onclick=async function(e){
    _Pesantrian.hideNotfication();
    let config=_Pesantrian.parseJSON(this.dataset.capp);
    if(_Pesantrian.appNames.hasOwnProperty(config.appName)){
      await _Pesantrian.load('app.html',config);
    }else{

    }
    await _Pesantrian.request('query','update notification (read=1) where id='+this.dataset.id);
    _Pesantrian.removeNotification(this.id);
  };
  return true;
};
/* count of notification */
this.countNotification=function(mode='get',value=0){
  let el=document.getElementById('notification-count'),
  cn=el?parseInt(el.dataset.count):0;
  if(mode=='get'){
    return cn;
  }else if(mode=='set'){
    el.dataset.count=value+'';
    if(value==0){
      el.classList.add('count-hide');
    }
    return true;
  }else if(mode=='up'){
    el.dataset.count=(cn+1)+'';
    if(el.classList.contains('count-hide')){
      el.classList.remove('count-hide');
    }
    return true;
  }else if(mode=='down'){
    el.dataset.count=Math.max(cn-1,0)+'';
    if(cn-1==0){
      el.classList.add('count-hide');
    }
    return true;
  }else{
    return false;
  }
};
/* remove one notification */
this.removeNotification=function(id){
  let notif=document.getElementById(id),
  wrapper=document.getElementById('notification-wrapper');
  if(notif){
    notif.remove();
  }
  if(wrapper&&wrapper.childNodes.length==0){
    let emptyEach=document.createElement('div');
    emptyEach.classList.add('notification-empty');
    wrapper.append(emptyEach);
  }
  this.countNotification('down');
};
/* clear all notification */
this.clearNotification=function(){
  let emptyEach=document.createElement('div'),
  wrapper=document.getElementById('notification-wrapper');
  this.countNotification('set',0);
  emptyEach.classList.add('notification-empty');
  wrapper.append(emptyEach);
  this.localNotificationClearAll();
};
/* hide notification */
this.hideNotfication=function(){
  let nList=document.getElementById('notification-list');
  if(nList){
    nList.classList.add('notification-list-hide');
  }
};
/* local notification */
this.localNotification=function(title='',text='',id=1){
  let lid=localStorage.getItem('notification-'+id);
  if(lid){
    return false;
  }
  let config={
    id:id,
    title:title,
    text:text,
    smallIcon:'https://github.com/9r3i/pesantrian/releases/download/images/logo.mono.png',
    icon:'https://github.com/9r3i/pesantrian/releases/download/images/logo.png',
    vibrate:true,
    foreground:false,
    attachments:[
      'https://github.com/9r3i/pesantrian/releases/download/images/logo-web.png',
    ],
  };
  if(typeof cordova==='object'&&cordova!==null
    &&typeof cordova.plugins==='object'
    &&cordova.plugins!==null
    &&typeof cordova.plugins.notification==='object'
    &&cordova.plugins.notification!==null
    &&typeof cordova.plugins.notification.local==='object'
    &&cordova.plugins.notification.local!==null
    &&typeof cordova.plugins.notification.local.schedule==='function'
    ){
    localStorage.setItem('notification-'+id,'1');
    cordova.plugins.notification.local.schedule(config);
    return true;
  }return false;
};
/* local notification clearAll */
this.localNotificationClearAll=function(){
  if(typeof cordova==='object'&&cordova!==null
    &&typeof cordova.plugins==='object'
    &&cordova.plugins!==null
    &&typeof cordova.plugins.notification==='object'
    &&cordova.plugins.notification!==null
    &&typeof cordova.plugins.notification.local==='object'
    &&cordova.plugins.notification.local!==null
    &&typeof cordova.plugins.notification.local.clearAll==='function'
    ){
    cordova.plugins.notification.local.clearAll();
    return true;
  }return false;
};


/* ---------- inner ---------- */
this.sendX=function(to,title,body,cb){
  cb=typeof cb==='function'?cb:function(){};
  var url='https://fcm.googleapis.com/fcm/send',
  key=FCM_KEY,
  data={
    to:to,
    notification:{
      title:title,
      body:body,
    }
  },
  header={
    Authorization:'key='+key
  };
  return this.post(url,cb,data,true,header);
};
/* stream method -- json
 * ur = string of url [require]
 * cb = function of callback
 * dt = object of data
 * tx = bool of text output; default: true
 * hd = object of headers
 * up = function of upload callback
 * dl = function of download callback
 * er = function of error callback
 * return: bool
 */
this.post=function(ur,cb,dt,tx,hd,up,dl,er){
  ur=typeof ur==='string'?ur:ur===null?'null':ur.toString();
  cb=typeof cb==='function'?cb:function(){};
  er=typeof er==='function'?er:cb;
  up=typeof up==='function'?up:function(){};
  dl=typeof dl==='function'?dl:function(){};
  dt=typeof dt==='object'&&dt!==null?dt:{};
  hd=typeof hd==='object'&&hd!==null?hd:{};
  tx=tx===false?false:true;
  var xhr=new XMLHttpRequest();
  xhr.open('POST',ur,true);
  hd['Content-type']='application/json';
  for(var i in hd){xhr.setRequestHeader(i,hd[i]);}
  xhr.upload.onprogress=up;
  xhr.addEventListener("progress",dl,false);
  xhr.onreadystatechange=function(e){
    if(xhr.readyState==4){
      if(xhr.status==200){
        var text=xhr.responseText?xhr.responseText:'';
        if(tx){return cb(text,xhr);}
        var res=null;
        try{res=JSON.parse(text);}catch(e){res=text;}
        return cb(res,xhr);
      }else if(xhr.status==0){
        return er('Error: No internet connection.',xhr);
      }return er('Error: '+xhr.status+' - '+xhr.statusText+'.',xhr);
    }else if(xhr.readyState<4){
      return false;
    }return er('Error: '+xhr.status+' - '+xhr.statusText+'.',xhr);
  };
  xhr.send(JSON.stringify(dt));
  return xhr;
};


/* ---------- inner ---------- */
this.tableData=function(data=[],title=''){
  data=Array.isArray(data)?data:[];
  let table=this.table(),
  col=data.length>0?Object.keys(data[0]):[],
  wide=col.length,
  head=this.rowHead(title,wide),
  row;
  if(wide==0||data.length==0){
    return table;
  }
  table.append(head);
  /* print and download button */
  let pbutton=document.createElement('input'),
  dbutton=document.createElement('input');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.classList.add('button-take');
  pbutton.onclick=function(){
    window.print();
  };
  dbutton.type='submit';
  dbutton.value='Download';
  dbutton.classList.add('button-taken');
  dbutton.onclick=()=>{
    this.downloadJSON(data,title);
  };
  dbutton.style.maxWidth='150px';
  row=this.row(dbutton);
  row.childNodes[0].setAttribute('colspan',wide);
  if((this.user.hasOwnProperty('browser')
    &&this.user.browser==true)
    ||!this.production){
    table.append(row);
  }
  /* table */
  row=this.row.apply(this,col);
  row.classList.add('tr-head');
  table.append(row);
  for(let line of data){
    let val=Object.values(line),
    row=this.row.apply(this,val);
    table.append(row);
  }
  /* return the table */
  return table;
};
this.qrcodeParse=function(str=''){
  let res=false;
  try{
  let base=str.split('').reverse().join(''),
  data=atob(base).split(':');
  res={
    table:data[0]||'',
    id:parseInt(data[1]||'0',0x24),
    name:data[2]||'',
    space:data[3]||'',
    data:data,
  };
  }catch(e){}
  return res;
};
this.scopeSelect=function(value){
  let scopes=value=='*'?this.appList:value.split(','),
  key='scope',
  val=document.createElement('div'),
  sselect=document.createElement('select'),
  sinput=document.createElement('input'),
  opt=document.createElement('option');
  sinput.type='hidden';
  sinput.value=value;
  sinput.name=key;
  sselect.style.marginBottom='15px';
  val.style.marginBottom='10px';
  val.style.lineHeight='35px';
  val.id='scope-main';
  val.append(sselect);
  val.append(sinput);
  opt.value='';
  opt.textContent='---SCOPE---';
  sselect.append(opt);
  for(let k in this.appNames){
    opt=document.createElement('option');
    opt.value=k;
    opt.textContent=this.appNames[k];
    sselect.append(opt);
  }
  for(let scope of scopes){
    let scp=this.scopeSpan(scope),
    ntext=document.createTextNode(' ');
    val.append(scp);
    val.append(ntext);
  }
  sselect.onchange=function(){
    let sp=document.querySelector('input[name="scope"]'),
    ntext=document.createTextNode(' '),
    pr=document.getElementById('scope-main'),
    nscope=_Pesantrian.scopeSpan(this.value),
    scopes=sp.value.split(',');
    scopes.push(this.value);
    sp.value=scopes.join(',');
    pr.append(nscope);
    pr.append(ntext);
    this.value='';
  };
  return val;
};
this.scopeSpan=function(scope){
  let scp=document.createElement('span'),
  sdel=document.createElement('span');
  sdel.classList.add('tap-delete');
  sdel.dataset.scope=scope;
  scp.classList.add('tap');
  scp.innerText=this.appNames[scope];
  scp.id='scope-'+scope;
  scp.append(sdel);
  sdel.onclick=function(){
    let sp=document.querySelector('input[name="scope"]'),
    scopes=sp.value.split(','),
    pr=document.getElementById('scope-'+this.dataset.scope),
    res=[];
    for(let scope of scopes){
      if(scope!=this.dataset.scope){
        res.push(scope);
      }
    }
    sp.value=res.join(',');
    pr.remove();
  };
  return scp;
};
this.goback=function(cb){
  let div=document.createElement('div');
  div.classList.add('goback');
  div.onclick=async function(){
    if(typeof cb==='function'){
      await cb(true);
    }
  };
  return div;
};
this.radio=function(config){
  config=typeof config==='object'&&config!==null?config:{};
  let data=config.hasOwnProperty('data')&&Array.isArray(config.data)?config.data:[],
  key=config.hasOwnProperty('key')?config.key:'key',
  value=config.hasOwnProperty('value')?config.value:'',
  div=document.createElement('div');
  for(let i=0;i<data.length;i++){
    let rad=document.createElement('input'),
    lab=document.createElement('label');
    rad.type='radio';
    rad.name=key;
    rad.id='radio-'+key+'-'+i;
    lab.setAttribute('for',rad.id);
    lab.classList.add('radio');
    rad.value=data[i].id+'';
    lab.innerText=data[i].name;
    if(value==data[i].id){
      rad.checked='checked';
    }
    div.append(rad);
    div.append(lab);
  }
  return div;
};
this.findInput=function(key='name',type='text',placeholder='Cari...'){
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type=type;
  find.placeholder=placeholder;
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-'+key+']');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset[key].match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  return find;
};
this.findSelect=function(config){
  /**
   * config
   *   - id = string of main id
   *   - data = array of data contains id and name
   *   - key  = string of key of input name
   *   - value = string of default value
   *   - placeholder = string of placeholder
   *   - callback = function of callback that return object {id,name}
  */
  config=typeof config==='object'&&config!==null?config:{};
  let ti=document.createElement('input'),
  data=config.hasOwnProperty('data')&&Array.isArray(config.data)?config.data:[],
  pmain=document.createElement('div'),
  plist=document.createElement('div'),
  pput=document.createElement('input'),
  key=config.hasOwnProperty('key')?config.key:'key',
  value=config.hasOwnProperty('value')?config.value:'',
  id=config.hasOwnProperty('id')?config.id:'finder',
  callback=typeof config.callback==='function'?config.callback:function(){};
  ti.type='hidden';
  ti.name=key;
  ti.value=value;
  ti.id='finder-result-'+key;
  pput.type='text';
  pput.value=this.getName(value,data)||'';
  pput.placeholder=config.hasOwnProperty('placeholder')?config.placeholder:'';
  pput.id='finder-input-'+key;
  pput.setAttribute('autocomplete','off');
  plist.classList.add('finder-list');
  plist.classList.add('finder-list-hide');
  pmain.classList.add('finder-main');
  pmain.append(ti);
  pmain.append(pput);
  pmain.append(plist);
  pput.onkeyup=e=>{
    delete pmain.name;
    if(pput.value){
      if(plist.classList.contains('finder-list-hide')){
        plist.classList.remove('finder-list-hide');
      }
    }else{
      plist.classList.add('finder-list-hide');
      return;
    }
    plist.innerHTML='';
    plist.classList.remove('finder-list-hide');
    let vm=new RegExp(pput.value,'i');
    for(let i=0;i<data.length;i++){
      if(data[i].name.match(vm)){
        let pl=document.createElement('div');
        pl.classList.add('finder-list-each');
        pl.innerText=data[i].name;
        pl.dataset.id=data[i].id+'';
        pl.dataset.key=key;
        pl.onclick=async function(){
          let res=document.getElementById('finder-result-'+this.dataset.key);
          plist.classList.add('finder-list-hide');
          res.value=this.dataset.id;
          pput.value=this.innerText;
          callback({
            id:this.dataset.id,
            name:this.innerText,
            main:pmain,
          });
        };
        plist.append(pl);
      }
    }
  };
  pmain.id=id;
  pmain.slave={
    result:ti,
    input:pput,
    list:plist,
  };
  return pmain;
};
this.formSerialize=function(){
  let data={},
  user={},
  form=document.querySelectorAll('[name]');
  for(let i=0;i<form.length;i++){
    if(typeof form[i].value==='undefined'){
      continue;
    }else if(form[i].name.match(/^data/)){
      data[form[i].name]=form[i].value;
    }else if(form[i].type=='radio'){
      if(form[i].checked){
        user[form[i].name]=form[i].value;
      }
    }else{
      user[form[i].name]=form[i].value;
    }
  }
  let query=[];
  for(let k in data){
    query.push(k+'='+data[k]);
  }
  let ndata=this.parser.parseQuery(query.join('&'));
  if(!ndata.hasOwnProperty('data')){
    ndata.data={};
  }
  user.data=JSON.stringify(ndata.data);
  return user;
};
this.radioGraduated=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='graduated-female';
  lab0.setAttribute('for','graduated-female');
  rad1.id='graduated-male';
  lab1.setAttribute('for','graduated-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-inactive');
  lab1.classList.add('radio');
  lab1.classList.add('radio-active');
  rad0.name='graduated';
  rad1.name='graduated';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Belum';
  lab1.innerText='Sudah';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioPresence=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='presence-female';
  lab0.setAttribute('for','presence-female');
  rad1.id='presence-male';
  lab1.setAttribute('for','presence-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-inactive');
  lab1.classList.add('radio');
  lab1.classList.add('radio-active');
  rad0.name='presence';
  rad1.name='presence';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Tidak Hadir';
  lab1.innerText='Hadir';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioActive=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='active-female';
  lab0.setAttribute('for','active-female');
  rad1.id='active-male';
  lab1.setAttribute('for','active-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-inactive');
  lab1.classList.add('radio');
  lab1.classList.add('radio-active');
  rad0.name='active';
  rad1.name='active';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Non-Aktif';
  lab1.innerText='Aktif';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioGlobal=function(value,name,data=[]){
  let div=document.createElement('div');
  div.classList.add('radio-parent');
  for(let i=0;i<data.length;i++){
    let rad=document.createElement('input'),
    lab=document.createElement('label');
    rad.type='radio';
    rad.name=name;
    rad.value=i;
    rad.id='radio-global-'+i;
    lab.setAttribute('for','radio-global-'+i);
    lab.classList.add('radio');
    lab.classList.add('radio-'+(i>7?7:i));
    lab.innerText=data[i];
    if(value==i){
      rad.checked='checked';
    }
    div.append(rad);
    div.append(lab);
  }
  return div;
};
this.radioSanKar=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='type-female';
  lab0.setAttribute('for','type-female');
  rad1.id='type-male';
  lab1.setAttribute('for','type-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='type';
  rad1.name='type';
  rad0.value='student';
  rad1.value='employee';
  if(value=='employee'){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Santri';
  lab1.innerText='Karyawan';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioManagement=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='management-female';
  lab0.setAttribute('for','management-female');
  rad1.id='management-male';
  lab1.setAttribute('for','management-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='management';
  rad1.name='management';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Aisyah';
  lab1.innerText='Abu Bakar';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioLivein=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='livein-female';
  lab0.setAttribute('for','livein-female');
  rad1.id='livein-male';
  lab1.setAttribute('for','livein-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='live_in';
  rad1.name='live_in';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Tidak';
  lab1.innerText='Ya';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioMethodBill=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='method-female';
  lab0.setAttribute('for','method-female');
  rad1.id='method-male';
  lab1.setAttribute('for','method-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='method';
  rad1.name='method';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Debet';
  lab1.innerText='Kredit';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioMethod=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='method-female';
  lab0.setAttribute('for','method-female');
  rad1.id='method-male';
  lab1.setAttribute('for','method-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='method';
  rad1.name='method';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Keluar';
  lab1.innerText='Masuk';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.radioGender=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='gender-female';
  lab0.setAttribute('for','gender-female');
  rad1.id='gender-male';
  lab1.setAttribute('for','gender-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='gender';
  rad1.name='gender';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Perempuan';
  lab1.innerText='Laki-Laki';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.sleep=function(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms);
  });
};
/* buildQuery v2, build http query recusively */
this.buildQuery=function(data,key){
  var ret=[],dkey=null;
  for(var d in data){
    dkey=key?key+'['+encodeURIComponent(d)+']'
        :encodeURIComponent(d)
          .replace(/\(/g,'%28')
          .replace(/\)/g,'%29');
    if(typeof data[d]=='object'&&data[d]!==null){
      ret.push(this.buildQuery(data[d],dkey));
    }else{
      ret.push(
        dkey+"="
          +encodeURIComponent(data[d])
          .replace(/\(/g,'%28')
          .replace(/\)/g,'%29')
      );
    }
  }return ret.join("&");
};
/* loader + dialog.close */
this.loader=function(close){
  let id='loader',
  old=document.getElementById(id);
  if(old){old.remove();}
  if(this.dialog){this.dialog.close();}
  if(close===false){return;}
  let outer=document.createElement('div'),
  inner=document.createElement('span');
  outer.append(inner);
  outer.id=id;
  inner.classList.add('loader-inner');
  outer.classList.add('loader-outer');
  document.body.append(outer);
  return outer;
};
this.range=function(s,t){
  s=s?s:0;
  t=t?Math.max(s,t):0;
  let r=[];
  for(let i=s;i<=t;i++){
    r.push(i);
  }return r;
};
this.parseDatetime=function(value){
  let date=new Date(value),
  options={
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
    hour:'numeric',
    minute:'numeric',
  };
  return date.toLocaleDateString('id-ID',options);
};
this.parseDate=function(value){
  value=value?value:(new Date).getTime();
  let date=new Date(value),
  options={
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
  };
  return date.toLocaleDateString('id-ID',options);
};
this.parseNominal=function(nominal){
  let rupiah=new Intl.NumberFormat('id-ID',{
    style:'currency',
    currency:'IDR',
    maximumFractionDigits:0,
  });
  return rupiah.format(nominal);
};
this.getValueByKey=function(key='',value='',dkey='',data=[]){
  data=Array.isArray(data)?data:[];
  let res='';
  for(let i of data){
    if(i[key]==value){
      res=i.hasOwnProperty(dkey)?i[dkey]:'';
      break;
    }
  }return res;
};
this.getDataByKey=function(key='',value='',data=[],unbreak=false){
  data=Array.isArray(data)?data:[];
  let res=null,resa=[];
  for(let i of data){
    if(i[key]==value){
      if(unbreak){
        resa.push(i);
      }else{
        res=i;
        break;
      }
    }
  }return unbreak?resa:res;
};
this.getDataByID=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
};
this.getDataFromID=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
};
this.getName=function(id,data){
  data=Array.isArray(data)?data:[];
  let res='';
  for(let i of data){
    if(i.id==id){
      res=i.name;
      break;
    }
  }return res;
};
this.table=function(){
  let table=document.createElement('table'),
  tbody=document.createElement('tbody');
  table.classList.add('app-table');
  table.setAttribute('cellpadding','0px');
  table.setAttribute('cellspacing','0px');
  return table;
};
this.rowHead=function(text='',length=2){
  let tr=document.createElement('tr'),
  td=document.createElement('td');
  td.setAttribute('colspan',''+length+'');
  if(typeof text==='object'){
    td.append(text);
  }else{
    td.innerHTML=text;
  }
  tr.append(td);
  tr.classList.add('trhead');
  return tr;
};
this.row=function(){
  let tr=document.createElement('tr');
  for(let tk in arguments){
    let td=document.createElement('td');
    if(typeof arguments[tk]==='object'){
      td.append(arguments[tk]);
    }else{
      td.innerHTML=''+arguments[tk]+'';
      if(arguments[tk].toString().match(/^\d+$/)){
        td.classList.add('td-left');
      }
    }
    tr.append(td);
  }return tr;
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.parseJSON=function(data){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }return res;
};
this.setCookie=function(name,value,days){
  name=name||"none";
  value=value||"";
  days=days||1;
  let date=new Date();
  date.setTime(date.getTime()+(days*24*60*60*1000));
  document.cookie=name+"="+value
    +"; expires="+date.toUTCString()
    +"; path=/; SameSite=Strict";
  return true;
};
this.getCookie=function(name){
  let cookies=document.cookie.split(';'),
  res={};
  for(let cookie of cookies){
    let cook=cookie.split('='),
    key=cook[0],
    value=decodeURIComponent(cook[1]);
    res[key]=value;
  }
  return res.hasOwnProperty(name)?res[name]:null;
};
/* return for construction */
return this.init();
};



/* ============================================================ */



/* PesantrianStudent --- removed */
;function PesantrianStudent(app){
this.app=app;
this.aliasData={
  sahur:'Sahur',
  breakfast:'Sarapan',
  lunch:'Makan Siang',
  ifthor:'Ifthor',
  dinner:'Makan Malam',
  sick:'Sakit',
  height:'Tinggi Badan',
  weight:'Berat Badan',
  studentOverview:'OVERVIEW',
  studentSPP:'SPP',
  studentSaving:'TABUNGAN',
  studentOther:'KEUANGAN LAINNYA',
  studentEat:'MAKAN BULAN INI',
  studentHealth:'KESEHATAN BULAN INI',
  studentExcul:'EXTRACURRICULAR BULAN INI',
  studentTahfidz:'TAHFIZH',
  studentDorm:'KEASRAMAAN',
  studentAcademic:'AKADEMIK',
  studentLaundry:'LAUNDRY',
  studentPresence:'ABSENSI',
  studentPackage:'KIRIMAN PAKET',
  studentGuest:'KUNJUNGAN',
  studentValuation:'TRANSKRIP AKADEMIK',
  studentPermission:'PERIZINAN',
  0:'January',
  1:'February',
  2:'March',
  3:'April',
  4:'May',
  5:'June',
  6:'July',
  7:'August',
  8:'September',
  9:'October',
  10:'November',
  11:'December',
  juz_total:'Jumlah Juz',
  memorize_total:'Jumlah Hafalan',
  memorize_target:'Target Hafalan',
  tajwid:'Tajwid',
  tahsin:'Tahsin',
  note:'Catatan',
  catatan:'Catatan',
  teacher_id:'Musyrifah',
  catatan:'Catatan',
  siklus_haid:'Siklus Haid',
  berat_badan:'Berat Badan',
  tinggi_badan:'Tinggi Badan',
  sakit:'Sakit bulan ini',
  register_test:'Pendaftaran Test PPDB',
  register_test_smp:'Pendaftaran Test PPDB SMP',
  register_test_sma:'Pendaftaran Test PPDB SMA',
  register_sma_new:'Daftar Ulang Santri Baru SMA',
  register_sma_next:'Daftar Ulang Lanjutan SMA',
  register_smp:'Daftar Ulang Santri Baru SMP',
  register_annually:'Daftar Ulang Tahunan',
  school_event:'Event Sekolah',
  id:'Nomor Transaksi',
  method:'Arus Dana',
  name:'Jenis Transaksi',
  petty_cash:'Petty Cash',
  donation:'Donasi',
  register:'Pendaftaran',
  contribution:'SPP',
  saving:'Tabungan',
  type:'Dana ke/dari',
  student:'Santri',
  parent:'Orangtua',
  employee:'Karyawan',
  status:'Status',
  paid:'Lunas',
  unpaid:'Nunggak',
  partly_paid:'Cicilan',
  cash:'Tunai',
  loan:'Pinjaman',
  profile_id:'Pengemban Dana',
  nominal:'Nominal',
  account:'Rekening Bank',
  explanation:'Keterangan',
  evidence:'Bukti Transaksi',
  report:'Berita Acara',
  transaction_date:'Tanggal Transaksi',
  transaction_code:'Kode Transaksi',
  date:'Tanggal Pembuatan',
  tahfidz_camp:'Tahfidz Camp',
  initial_fund:'Dana Awal',
  year:'Tahun',
  month:'Bulan',
  studyYear:'Tahun Ajaran',
  debt:'Debet',
  credit:'Kredit',
};
this.selection={
  name:[
    'contribution',
    'saving',
    'donation',
    'petty_cash',
    'register_test_smp',
    'register_test_sma',
    'register_sma_new',
    'register_sma_next',
    'register_smp',
    'register_annually',
    'school_event',
    'tahfidz_camp',
    'initial_fund',
  ],
  type:[
    'student',
    'parent',
    'employee',
  ],
  status:[
    'unpaid',
    'partly_paid',
    'paid',
    'cash',
    'loan',
  ],
  account:[
    'Yayasan - BSI 7164 540 558',
    'Donasi - BSI 7164 541 006',
    'Bendahara - BSI 7134 2000 43',
    'Tunai',
  ],
  accountx:[
    'Yayasan - BSI 7164 540 558 a/n Yayasan Aisyah Mulya',
    'Donasi - BSI 7164 541 006 a/n Yayasan Aisyah Mulya',
    'Bendahara - BSI 7134 2000 43 a/n Rina Ferianti',
    'Tunai',
  ],
  year:[
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
  ],
  studyYear:[
    '2023/2024',
    '2024/2025',
    '2025/2026',
    '2026/2027',
    '2027/2028',
    '2028/2029',
    '2029/2030',
  ],
  month:_Pesantrian.range(0,11),
};
this.month=[
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
this.studyMonths=[6,7,8,9,10,11,0,1,2,3,4,5];
this.sppMax={
  7:2100000,
  8:2100000,
  9:2100000,
  10:2200000,
  11:2200000,
  12:2200000,
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

/* initialize */
this.init=async function(){
  this.app.menuButton.remove();
  /* check type */
  if(_Pesantrian.user.type!=='student'
    &&_Pesantrian.user.privilege<16){
    _Pesantrian.alert('Access denied!','You\'re not in student account.','error');
    return;
  }
  
  if(false){
    alert(_Pesantrian.parser.likeJSON(_Pesantrian.user,3));
  }
  
  /* inside apps */
  let apps=[
    {
      name:'bill',
      title:'SPP',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentSPP');
      }
    },
    {
      name:'form',
      title:'Tabungan',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentSaving');
      }
    },
    {
      name:'form3',
      title:'Keuangan',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentOther');
      }
    },
  ],
  old_apps=[
    {
      name:'tahfidz',
      title:'Tahfizh',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentTahfidz');
      }
    },
    {
      name:'bunk',
      title:'Asrama',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentDorm');
      }
    },
    {
      name:'transcript',
      title:'Transkrip',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentValuation');
      }
    },
    {
      name:'clinic',
      title:'Kesehatan',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentHealth');
      }
    },
    {
      name:'extracurricular',
      title:'Eskul',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentExcul');
      }
    },
    {
      name:'laundry',
      title:'Laundry',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentLaundry');
      }
    },
    {
      name:'form2',
      title:'Absensi',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentPresence');
      }
    },
    {
      name:'package',
      title:'Paket',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentPackage');
      }
    },
    {
      name:'guest',
      title:'Kunjungan',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentGuest');
      }
    },
    {
      name:'form4',
      title:'Perizinan',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentPermission');
      }
    },
    {
      name:'kitchen',
      title:'Makan',
      callback:function(e){
        _PesantrianStudent.tableStudent('studentEat');
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianStudent=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};
  
/* evidence page */
this.evidencePage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  query='select id,evidence from transaction where id='+id,
  data=await _Pesantrian.request('query',query,50),
  text='Error: Data #'+id+' tidak ditemukan!';
  if(data.length==0){
    _Pesantrian.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  let evi=this.evidencePath(data[0].evidence),
  pro=document.createElement('div'),
  pimg=new Image;
  pimg.src=evi!=''?evi:_Pesantrian.IMAGES['icon-error.png'];
  pimg.main=pro;
  pimg.dialog=dialog;
  pimg.style.maxWidth='100%';
  pro.append(pimg);
  pimg.onload=function(){
    this.dialog.blank();
    this.dialog.main.append(this.main);
  };
  pimg.onerror=function(){
    this.dialog.loader.src=_Pesantrian.IMAGES['icon-error.png'];
  };
};


/* base-router */
this.tableStudent=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  if(innerApp){
    let data=_Pesantrian.user.profile;
    _PesantrianStudent[innerApp].apply(_PesantrianStudent,[data]);
    return;
  }

  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  pgender=_Pesantrian.user.profile.gender==1?'father_id':'mother_id',
  query=_Pesantrian.user.privilege>=8
    ?'select * from student where graduated=0'
    :'select * from student where graduated=0 and '
      +pgender+'='+profile_id,
  queries=[
    query
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  row=this.rowHead(this.alias(innerApp)
    +'<br />Tahun Ajaran '+this.getStudyYear(),3),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  row=this.row('ID','Nama Anak','');
  row.classList.add('tr-head');
  table.append(row);
  if(_Pesantrian.user.privilege>=8){
    let find=document.createElement('input');
    find.classList.add('kitchen-find');
    find.type='text';
    find.placeholder='Cari Nama...';
    find.onkeyup=function(e){
      let rg=new RegExp(this.value,'i'),
      nm=document.querySelectorAll('tr[data-name]');
      for(let i=0;i<nm.length;i++){
        if(nm[i].dataset.name.match(rg)){
          nm[i].style.removeProperty('display');
        }else{
          nm[i].style.display='none';
        }
      }
    };
    row=this.row('',find,'');
    table.append(row);
  }
  for(let line of students){
    let stat=document.createElement('input');
    stat.type='submit';
    stat.value='Buka';
    stat.classList.add('button-take');
    stat.dataset.data=JSON.stringify(line);
    stat.dataset.method=innerApp;
    stat.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      if(!_PesantrianParent.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianStudent[this.dataset.method].apply(_PesantrianStudent,[data]);
    };
    row=this.row(line.id,line.name,stat);
    row.dataset.name=line.name;
    table.append(row);
  }
  this.app.body.append(table);
};





/* eat */
this.studentEat=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from kitchen where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  kitchen=this.getLineByDate(datas[0]),
  title='MAKAN<br />'+data.name,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal',
    this.alias('sahur'),
    this.alias('breakfast'),
    this.alias('lunch'),
    this.alias('ifthor'),
    this.alias('dinner')
  );
  row.classList.add('tr-head');
  table.append(row);
  for(let date in kitchen){
    let line=kitchen[date],
    sahur=this.tag(line.sahur),
    breakfast=this.tag(line.breakfast),
    lunch=this.tag(line.lunch),
    ifthor=this.tag(line.ifthor),
    dinner=this.tag(line.dinner);
    row=this.row(
      _Pesantrian.parseDate(date),
      sahur,breakfast,lunch,ifthor,dinner
    );
    table.append(row);
  }
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};

/* permission */
this.studentPermission=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear(),
  studyYearQuery=this.getStudyYearQuery(),
  queries=[
    'select * from permission where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='PERIZINAN<br />'+data.name,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal Izin','Tanggal Kembali','Jenis Izin','Lama','Status','Sanksi');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of datas[0]){
  row=this.row(
      _Pesantrian.parseDatetime(line.date+' '+line.hour),
      _Pesantrian.parseDatetime(line.back_date+' '+line.back_hour),
      line.type,
      line.long+' hari',
      line.status,
      line.penalty);
    table.append(row);
  }
};

/* guest */
this.studentGuest=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from guest where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='KUNJUNGAN<br />'+data.name,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Check-In','Check-Out','Tujuan','Nomor Kendaraan');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of datas[0]){
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      line.checkin,
      line.checkout,
      line.purpose,
      line.plate
    );
    table.append(row);
  }
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};

/* package */
this.studentPackage=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from package where profile_id='+data.id
      +' and type="student"',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='KIRIMAN PAKET<br />'+data.name,
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Jam','Kurir','Sudah Diterima');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of datas[0]){
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      line.hour,
      line.courier,
      line.given?'Sudah':'Belum'
    );
    table.append(row);
  }
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};


/* presence */
this.studentClassYear=0;
this.studentPresenceMonthly=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentPresence');
    })
  );
  let loader=_Pesantrian.loader(),
  cabs=(year/4)===Math.ceil(year/4)?29:28,
  dates=[31,cabs,31,30,31,30,31,31,30,31,30,31][month],
  queries=[
    'select * from presence where student_id='+data.id
      +' and month='+month+' and year='+year,
    'select * from tahfidz_presence where student_id='+data.id
      +' and month='+month+' and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='ABSENSI BULAN INI<br />'+data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,12),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Kelas','Halaqah');
  row.childNodes[0].setAttribute('rowspan',2);
  row.childNodes[1].setAttribute('colspan',7);
  row.childNodes[2].setAttribute('colspan',4);
  row.classList.add('tr-head');
  table.append(row);
  row=this.row('Sesi 1','Sesi 2','Sesi 3','Sesi 4','Sesi 5','Sesi 6','Sesi 7',
  'Sesi 1','Sesi 2','Sesi 3','Sesi 4');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let date of this.range(1,dates)){
    let pclass=this.getPresence(date,datas[0]),
    pteam=this.getPresence(date,datas[1]),
    nclass=[],
    nteam=[];
    for(let i=1;i<=7;i++){
      nclass.push(pclass.hasOwnProperty(i)?pclass[i].note:'-');
    }
    for(let i=1;i<=4;i++){
      nteam.push(pteam.hasOwnProperty(i)?pteam[i].note:'-');
    }
    /* class session 1-7 and halaqah session 1-4 */
    row=this.row(date,
      nclass[0],
      nclass[1],
      nclass[2],
      nclass[3],
      nclass[4],
      nclass[5],
      nclass[6],
      nteam[0],
      nteam[1],
      nteam[2],
      nteam[3]
    );
    table.append(row);
  }
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentPresence=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  /* get class data */
  if(this.studentClassYear==0){
    let loader=_Pesantrian.loader(),
    query='select * from class where student_id='+data.id,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    this.studentClassYear=parseInt(res[0].year);
  }
  
  /* start to parse */
  let studyYear=[
    this.studentClassYear-1,
    this.studentClassYear,
  ],
  title='ABSENSI<br />'
    +data.name+'<br />Tahun Ajaran '
    +studyYear.join('/'),
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  for(let im of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.month=im+'';
    see.dataset.year=im<6?studyYear[1]:studyYear[0];
    see.onclick=function(){
      _PesantrianStudent.studentPresenceMonthly(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.month,
        this.dataset.year
      );
    };
    row=this.row(this.month[im]+' '+see.dataset.year,see);
    table.append(row);
  }
  this.app.body.append(table);
};
/* get presence by date */
this.getPresence=function(date,data){
  data=Array.isArray(data)?data:[];
  let res={};
  for(let row of data){
    if(date==row.date){
      res[row.session]=row;
    }
  }
  return res;
};


/* laundry */
this.studentLaundry=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  queries=[
    'select * from laundry where type="student" and profile_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  laundries=datas[0],
  credit=this.getCredit(data.id,laundries,'student'),
  saldo=document.createElement('span');
  loader.remove();
  saldo.innerText=_Pesantrian.parseNominal(credit);
  let title='Biaya Laundry diluar Seragam',
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  row=this.row('Tanggal','Nominal','Jenis','Berat');
  row.classList.add('tr-head');
  table.append(row);
  for(let laun of laundries){
    row=this.row(
      _Pesantrian.parseDate(laun.time*1000),
      _Pesantrian.parseNominal(laun.nominal),
      laun.kind,
      laun.weight
    );
    table.append(row);
  }
  row=this.row('Total Biaya',saldo,'','');
  row.classList.add('tr-head');
  table.append(row);
};
this.getCredit=function(profile_id,data=[],type='student'){
  let res=type=='student'?0:this.credit*1000;
  for(let i of data){
    if(i.profile_id==profile_id){
      res-=parseInt(i.nominal);
    }
  }return res;
};


/* excul */
this.studentExcul=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from extracurricular where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='EXTRACURRICULAR',
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Extra','Hadir','Nilai');
  row.classList.add('tr-head');
  table.append(row);
  for(let line of datas[0]){
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      line.ex_name,
      this.tagHadir(line.presence),
      line.value
    );
    table.append(row);
  }
  this.app.body.append(table);
  
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};

/* health */
this.studentHealth=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from clinic where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  health=datas[0],
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* health */
  table=this.table();
  title='KESEHATAN<br />'+data.name;
  row=this.rowHead(title,4);
  table.append(row);
  row=this.row(this.alias('height'),data.height+' cm');
  row.childNodes[0].setAttribute('colspan','3');
  table.append(row);
  row=this.row(this.alias('weight'),data.weight+' kg');
  row.childNodes[0].setAttribute('colspan','3');
  table.append(row);
  row=this.row('Tanggal','Keterangan','Level','Detail');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  let nomor=0;
  for(let line of health){
    let date=_Pesantrian.parseDate(line.date),
    detail=document.createElement('input');
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-take');
    detail.dataset.data=JSON.stringify(line);
    detail.onclick=async function(){
      let dialog=await _Pesantrian.dialogPage(),
      pre=document.createElement('pre'),
      jdata=_Pesantrian.parseJSON(this.dataset.data),
      pdata=_Pesantrian.parser.likeJSON(jdata);
      pre.innerText=pdata;
      dialog.blank();
      dialog.main.append(pre);
    };
    row=this.row(date,line.ailment,line.level,detail);
    row.dataset.data=JSON.stringify(line);
    table.append(row);
  }
  if(health.length==0){
    row=this.row('Alhamdulillaah, '+data.name+' tidak pernah sakit');
    row.childNodes[0].setAttribute('colspan','4');
  }
  table.append(row);
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};


/* keuangan lainnya selain tabungan dan spp */
this.studentOtherDetail=async function(id,datax){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentOther(datax);
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name from student',
    'select id,name from parent',
    'select id,name from employee',
    'select * from transaction where id='+id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
  },
  trans=data[3][0],
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:_Pesantrian.parseJSON(trans.data),
  row=this.rowHead('DETAIL TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','time','uid','id','explanation','date','year','month',
    'report','transaction_code'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(selection.hasOwnProperty(key)){
      val=this.alias(value);
    }else if(key=='profile_id'){
      val=this.getName(value,dtype[trans.type]);
    }else if(key=='method'){
      let gspan=document.createElement('span');
      gspan.innerText=methods[value];
      gspan.classList.add('gender');
      gspan.classList.add('gender-'+value);
      val=gspan;
    }else if(key=='transaction_date'||key=='date'){
      val=_Pesantrian.parseDate(value);
    }else if(integers.indexOf(key)>=0){
      val=value;
      if(key=='nominal'){
        val=_Pesantrian.parseNominal(value);
      }
    }else if(key=='evidence'){
      val=new Image;
      val.src=_Pesantrian.eva.config.host
        +'pesantrian/finance/evidence/'+value;
      val.onerror=function(e){
        this.src=_Pesantrian.IMAGES['icon-error.png'];
      };
    }else{
      val=value;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* rincian */
  table=this.table();
  row=this.rowHead('RINCIAN',3);
  table.append(row);
  let nomor=0;
  row=this.row('NO','Nominal','Keterangan');
  table.append(row);
  for(let k in udata.rincian){
    let kel=udata.rincian[k];
    row=this.row(nomor,_Pesantrian.parseNominal(kel.nominal),kel.keterangan);
    nomor++;
    table.append(row);
  }
  this.app.body.append(table);
  /* */
  
};
this.studentOther=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and '
      +this.queryOthers(),
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=datas[0],
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  this.app.body.append(table);

  /* finance - others - KEUANGAN LAINNYA */
  title='KEUANGAN LAINNYA'
    +'<br />(Selain Tabungan dan SPP)'
    +'<br />'+data.name,
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Detail');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance){
    let date=_Pesantrian.parseDate(line.transaction_date),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    /* detail */
    let detail=document.createElement('input');
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=''+line.id;
    detail.dataset.data=JSON.stringify(data);
    detail.onclick=function(){
      return _PesantrianStudent.studentOtherDetail(
        this.dataset.id,
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    /* row */
    row=this.row(date,nominal,dk,this.alias(line.name),detail);
    table.append(row);
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianStudent.evidencePage(this.dataset.id);
    };
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','');
  row.classList.add('tr-head');
  table.append(row);
};

/* saving/tabungan */
this.studentSaving=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="saving"',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* finance - saving - TABUNGAN */
  title='TABUNGAN<br />'+data.name,
  row=this.rowHead(title,4);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    let date=_Pesantrian.parseDate(line.transaction_date),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    row=this.row(date,nominal,dk,line.explanation);
    table.append(row);
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianStudent.evidencePage(this.dataset.id);
    };
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'','');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};

/* contribution/spp */
this.studentSPPDetail=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentSPP(data);
    })
  );
  
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and month='+month+' and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  trans=datas[0],
  passes=['id','name','type','method','status','year','month','profile_id','data','uid','nominal','time','report','explanation','date'],
  row,table=this.table();
  loader.remove();
  
  
  let aliases={
    account:'Transfer ke rekening',
    transaction_date:'Tanggal Transaksi',
    transaction_code:'Kode Transaksi',
    evidence:'Bukti Transaksi',
  };
  for(let tran of trans){
    table=this.table();
    row=this.rowHead('SPP bulan '
      +this.month[month]+' '+year
      +'<br />'+data.name+'<br />');
    table.append(row);
    for(let key in tran){
      let value=tran[key],
      val=value,
      kname=aliases.hasOwnProperty(key)?aliases[key]:key;
      if(passes.indexOf(key)>=0){
        continue;
      }
      if(key=='transaction_date'){
        val=_Pesantrian.parseDate(value);
      }
      if(key=='evidence'){
        val=new Image;
        val.src=_Pesantrian.IMAGES['loader.gif'];
        val.id='evidence'+tran.id;
        let ival=new Image;
        ival.dataset.id='evidence'+tran.id;
        ival.src=this.evidencePath(value);
        ival.onload=function(){
          let uval=document.getElementById(this.dataset.id);
          uval.src=this.src;
        };
        ival.onerror=function(){
          let uval=document.getElementById(this.dataset.id);
          uval.src=_Pesantrian.IMAGES['icon-error.png'];
        };
      }
      row=this.row(kname,val);
      table.append(row);
    }
    row=this.row('Total Nominal',_Pesantrian.parseNominal(tran.nominal));
    table.append(row);
    row=this.rowHead('RINCIAN',2);
    table.append(row);
    let rins=_Pesantrian.parseJSON(tran.data);
    for(let k in rins.rincian){
      let rin=rins.rincian[k];
      row=this.row('SPP bulan '+rin.keterangan,_Pesantrian.parseNominal(rin.nominal));
      table.append(row);
    }
    this.app.body.append(table);
  }
  
  /*
  
  - profile_id  (INT)
  - nominal     (INT:15)
  - transaction_date 
  - transaction_code 
  
  - report      -- laporan
  - evidence    -- bukti
  - explanation -- keterangan
  - time        (TIME)
  - date        (DATE)
  - account     (string:50) number
  */
  
  
};
this.studentSPP=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution"',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  total=0,
  lines=datas[0],
  nominal,
  studyYear=this.getStudyYear().split('/'),
  title,
  row,
  table=this.table();
  loader.remove();
  /* finance - contribution - SPP */
  title='SPP<br />'+data.name,
  row=this.rowHead(title,4);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal','');
  row.classList.add('tr-head');
  table.append(row);
  for(let line of lines){
    let detail=document.createElement('input');
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-take');
    detail.dataset.data=JSON.stringify(data);
    detail.dataset.month=line.month;
    detail.dataset.year=line.year;
    detail.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data),
      month=this.dataset.month,
      year=this.dataset.year;
      _PesantrianStudent.studentSPPDetail(data,month,year);
    };
    row=this.row(
      _Pesantrian.parseDate(line.transaction_date),
      this.month[line.month]+' '+line.year,
      _Pesantrian.parseNominal(line.nominal),
      detail
    );
    table.append(row);
  }
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};




/* valuation -- transkrip */
this.studentValuation=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  query='select * from class where student_id='+data.id,
  datas=await _Pesantrian.request('query',query),
  row=this.rowHead('TRANSKRIP NILAI AKADEMIK<br />'
    +data.name+'<br />',4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  row=this.row('Kelas','Tahun','Semester 1','Semester 2');
  row.classList.add('tr-head');
  table.append(row);
  /*  */
  if(datas.length<1){
    _Pesantrian.alert('Error','Failed to get student class.','error');
    return;
  }
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  dclass=datas[0].class,
  dyear=datas[0].year,
  zeroYear=dyear-dclass;


  for(let kelas of _Pesantrian.range(7,12)){
    let sem1=document.createElement('input');
    sem1.type='submit';
    sem1.value='Semester 1';
    sem1.classList.add('button-take');
    sem1.dataset.dx=JSON.stringify(data);
    sem1.dataset.class=''+kelas;
    sem1.dataset.year=''+(zeroYear+kelas);
    sem1.onclick=function(){
      _PesantrianStudent.recapValueStudent(
        _Pesantrian.parseJSON(this.dataset.dx),
        1,
        this.dataset.year,
        this.dataset.class
      );
    };
    let sem2=document.createElement('input');
    sem2.type='submit';
    sem2.value='Semester 2';
    sem2.classList.add('button-take');
    sem2.dataset.dx=JSON.stringify(data);
    sem2.dataset.class=''+kelas;
    sem2.dataset.year=''+(zeroYear+kelas+1);
    sem2.onclick=function(){
      _PesantrianStudent.recapValueStudent(
        _Pesantrian.parseJSON(this.dataset.dx),
        2,
        this.dataset.year,
        this.dataset.class
      );
    };
    row=this.row(
      'Kelas '+kelas,
      (zeroYear+kelas)+'/'+(zeroYear+kelas+1),
      sem1,
      sem2
    );
    table.append(row);
  }
};
this.recapValueStudent=async function(dx,semester,year,dclass){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.studentValuation(dx);
    })
  );
  let id=dx.id,
  name=dx.name,
  loader=_Pesantrian.loader(),
  queries=[
    'select * from subject where year="'+this.getStudyYear()+'"'
      +' and semester='+semester
      +' and class='+dclass,
    'select * from valuation where student_id='+id,
    'select * from daily_valuation where student_id='+id,
    'select * from presence where student_id='+id
      +' and year='+year+' and month '
      +(semester==1?'> 5':'< 6'),
    'select * from subjective_valuation where student_id='+id
      +' and year='+year+' and semester='+semester,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  subjects=data[0],
  vsemester=data[1],
  vdaily=data[2],
  vpresence=data[3],
  vsubject=data[4];
  /**
     --- subject
          0: (aid) [id:10] => LDB_AID
          1: (string) [name:256] => LDB_BLANK
          2: (int) [teacher_id:10] => "0"
          3: (int) [min_criteria:10] => "0"
          4: (string) [predicate:100] => LDB_BLANK
          5: (string) [year:100] => LDB_BLANK
          6: (int) [semester:10] => "0"
          7: (int) [class:10] => "0"
          8: (string) [data:30000] => LDB_BLANK
          9: (time) [time:10] => LDB_TIME
  */
  let row=this.rowHead('TRANSKRIP NILAI AKADEMIK<br />Semester '+semester
    +'<br />Tahun Ajaran '+this.getStudyYear()
    +'<br />'+name+'<br />Kelas '+dclass,6),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  /* testing */
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,5));
  }
  /* 20+30+30+20=100 */
  row=this.row(
    'Pelajaran',
    'Nilai Kumulatif',
    'Nilai Semester (20%)',
    'Nilai Kumulatif Harian (30%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjectif (20%)'
  );
  row.classList.add('tr-head');
  table.append(row);
  for(let sub of subjects){
    let nis=this.recapGetSemesterValue(sub.id,vsemester),
    nid=this.recapGetDailyValue(sub.id,vdaily),
    nip=this.recapGetPrecense(sub.teacher_id,vpresence),
    nix=this.recapGetSubjectiveValue(sub.id,vsubject),
    nux=this.recapGetCumulativeValue(nis,nid,nip,nix);
    row=this.row(sub.name,nux,nis,nid,nip,nix);
    table.append(row);
  }
};
this.calculateValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let total=0,
  count=0,
  res=null;
  for(let d of data){
    if(d.subject_id==sid){
      total+=parseInt(d.value);
      count++;
    }
  }
  if(count>0){
    res=Math.ceil(total/count);
  }
  return res;
};
this.getStudyYearQuery=function(){
  let studyYear=this.getStudyYear().split('/'),
  one=Math.floor(new Date(studyYear[0]+'-07-01').getTime()/1000),
  two=Math.floor(new Date(studyYear[1]+'-06-30').getTime()/1000),
  res=[
    'time > '+one,
    'time < '+two,
  ];
  return res.join(' and ');
};
this.getLetterValueAcademic=function(value){
  let letter={
    A:this.range(86,100),
    B:this.range(70,85),
    C:this.range(0,69),
  },
  res=null;
  for(let k in letter){
    if(letter[k].indexOf(parseInt(value))>=0){
      res=k;
      break;
    }
  }return res;
};

/* from recap teacher -- all stand-alone */
this.recapGetCumulativeValue=function(nis,nid,nip,nix){
  nis=nis||0;
  nid=nid||0;
  nip=nip||0;
  nix=nix||0;
  let res=0;
  res+=parseInt(nis)*0.2;
  res+=parseInt(nid)*0.3;
  res+=parseInt(nip)*0.3;
  res+=parseInt(nix)*0.2;
  return Math.ceil(res);
};
/**
   * --- subjective_valuation
              0: (aid) [id:10] => LDB_AID
              1: (string) [name:100] => LDB_BLANK
              2: (int) [student_id:10] => "0"
              3: (int) [teacher_id:10] => "0"
              4: (int) [value:3] => "0"
              5: (int) [semester:1] => "1"
              6: (int) [year:4] => "2024"
              7: (time) [time:10] => LDB_TIME
              8: (int) [subject_id:10] => "0"
   */
this.recapGetSubjectiveValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.subject_id==sid){
      res=d.value;
      break;
    }
  }return res;
};
/**
   * --- precense
              0: (aid) [id:10] => LDB_AID
              1: (string) [name:100] => LDB_BLANK
              2: (int) [student_id:10] => "0"
              3: (int) [class:2] => LDB_BLANK
              4: (int) [presence:5] => LDB_BLANK
              5: (string) [note:100] => LDB_BLANK
              6: (int) [date:2] => "1"
              7: (int) [month:2] => "0"
              8: (int) [year:4] => "2024"
              9: (time) [time:10] => LDB_TIME
              10: (int) [teacher_id:10] => "0"
              11: (int) [session:2] => "1"
   */
this.recapGetPrecense=function(tid,data){
  data=Array.isArray(data)?data:[];
  let res=0,
  count=0,
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ];
  for(let d of data){
    if(d.teacher_id==tid){
      if(d.presence==1||d.presence==3){
        res+=1;
      }
      count++;
    }
  }
  return count>0?Math.ceil(res/count*100):0;
};
/**
   * 
      --- daily_valuation
              0: (aid) [id:10] => LDB_AID
              1: (int) [student_id:10] => "0"
              2: (int) [subject_id:10] => "0"
              3: (int) [value:10] => "0"
              4: (string) [date:10] => LDB_BLANK
              5: (time) [time:10] => LDB_TIME
              6: (string) [letter:10] => LDB_BLANK
   */
this.recapGetDailyValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0,count=0;
  for(let d of data){
    if(d.subject_id==sid){
      res+=parseInt(d.value,10);
      count++;
    }
  }return count>0?Math.ceil(res/count):0;
};
/**
   * 
      --- valuation
              0: (aid) [id:10] => LDB_AID
              1: (int) [student_id:10] => "0"
              2: (int) [subject_id:10] => "0"
              3: (int) [value:10] => "0"
              4: (string) [letter:100] => LDB_BLANK
              5: (time) [time:10] => LDB_TIME
   */
this.recapGetSemesterValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.subject_id==sid){
      res=d.value;
      break;
    }
  }return res;
};
  


/* dorm */
this.studentDorm=function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let title='KEASRAMAAN<br />'
    +data.name+'<br />Tahun Ajaran '
    +this.getStudyYear(),
  row=this.rowHead(title,4),
  table=this.table(),
  studyYear=this.getStudyYear().split('/');
  table.append(row);
  for(let im of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.month=im+'';
    see.dataset.year=im<6?studyYear[1]:studyYear[0];
    see.onclick=function(){
      _PesantrianStudent.studentDormMonthly(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.month,
        this.dataset.year
      );
    };
    row=this.row(this.month[im]+' '+see.dataset.year,see);
    table.append(row);
  }
  this.app.body.append(table);
};
this.studentDormMonthly=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentDorm(data);
    })
  );
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from dorm_value where student_id='+data.id
      +' and month='+month+' and year='+year,
    'select id,name,position from employee where position="tahfidz"',
    'select * from dorm where student_id='+data.id
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  valuation=datas[0],
  dormData=datas[2][0],
  title='KEASRAMAAN<br />'
    +data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,2),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* building_name */
  row=this.row('Musyrifah',this.getName(dormData.teacher_id,datas[1]));
  table.append(row);
  row=this.row('Gedung',dormData.building_name);
  table.append(row);
  row=this.row('Ruangan',dormData.room_name);
  table.append(row);
  row=this.row('Kamar Mandi',dormData.rest_room);
  table.append(row);
  
  /* check if value has been sent */
  if(valuation.length==0){
    row=this.row('Belum ada penilaian untuk bulan '+this.month[month]+' '+year);
    row.childNodes[0].setAttribute('colspan',2);
    row.childNodes[0].classList.add('extra-high');
    table.append(row);
    return;
  }
  let val=valuation[0],
  passes=['akhlaq','kebersihan','pelanggaran','apresiasi'],
  tname=this.getName(val.teacher_id,datas[1]),
  ddata=_Pesantrian.parseJSON(val.data);
  
  
  /* section data */
  row=this.rowHead('DATA KEASRAMAAN',2);
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  for(let sec in ddata){
    if(passes.indexOf(sec)>=0){
      continue;
    }
    row=this.row(this.alias(sec),ddata[sec]);
    row.classList.add('extra-high');
    table.append(row);
  }
  
  /* passes way */
  for(let sec of passes){
    row=this.rowHead(sec.toUpperCase(),3);
    table=this.table();
    table.append(row);
    this.app.body.append(table);
    let kname='Aspek Penilaian',
    vname='Nilai',
    lname='Huruf',
    sdata=ddata.hasOwnProperty(sec)?ddata[sec]:{};
    if(sec=='pelanggaran'){
      kname='Jenis Pelanggaran';
      vname='Point';
      lname='Tanggal';
    }else if(sec=='apresiasi'){
      kname='Jenis Tindakan';
      vname='Point';
      lname='Tanggal';
    }
    row=this.row(kname,vname,lname);
    row.classList.add('tr-head');
    table.append(row);
    for(let k in sdata){
      let line=sdata[k],
      val=this.getLetterValue(line.value);
      if(sec=='pelanggaran'||sec=='apresiasi'){
        val=_Pesantrian.parseDate(line.date);
      }
      row=this.row(line.key,line.value,val);
      table.append(row);
    }
  }
  
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(ddata,3));
    return;
  }
};
  
/* tahfidz */
this.studentTahfidz=function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let title='TAHFIZH<br />'
    +data.name+'<br />Tahun Ajaran '
    +this.getStudyYear(),
  row=this.rowHead(title,4),
  table=this.table(),
  studyYear=this.getStudyYear().split('/');
  table.append(row);
  this.app.body.append(table);
  for(let im of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.month=im+'';
    see.dataset.year=im<6?studyYear[1]:studyYear[0];
    see.onclick=function(){
      _PesantrianStudent.studentTahfidzMonthly(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.month,
        this.dataset.year
      );
    };
    row=this.row(this.month[im]+' '+see.dataset.year,see);
    table.append(row);
  }
};
this.studentTahfidzMonthly=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentTahfidz(data);
    })
  );
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from tahfidz where student_id='+data.id
      +' and month='+month+' and year='+year,
    'select id,name,position from employee where position="tahfidz"',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  valuation=datas[0],
  title='TAHFIZH<br />'
    +data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* check if value has been sent */
  if(valuation.length==0){
    row=this.row('Belum ada penilaian untuk bulan '+this.month[month]+' '+year);
    row.childNodes[0].setAttribute('colspan',4);
    row.childNodes[0].classList.add('extra-high');
    table.append(row);
    return;
  }
  let val=valuation[0],
  passes=['id','time','month','year','student_id'],
  tname=this.getName(val.teacher_id,datas[1]);
  
  for(let key in val){
    let value=val[key];
    if(passes.indexOf(key)>=0){
      continue;
    }
    if(key=='teacher_id'){
      value=tname;
    }
    row=this.row(this.alias(key),value);
    row.childNodes[0].classList.add('extra-high');
    table.append(row);
  }
};




  /* ---------- inner ---------- */
  this.queryOthers=function(){
    /**
     * 
        'register_test_smp',
        'register_test_sma',
        'register_sma_new',
        'register_sma_next',
        'register_smp',
        'register_annually',
        'school_event',
     */
    let res=[
      'name="register_test_smp"',
      'name="register_test_sma"',
      'name="register_sma_new"',
      'name="register_sma_next"',
      'name="register_smp"',
      'name="register_annually"',
      'name="school_event"',
    ].join(' or ');
    return res;
  };
  this.evidencePath=function(fname){
    return _Pesantrian.eva.config.host
      +'pesantrian/finance/evidence/'+fname;
  };
  this.queryTA=function(){
    let year=(new Date).getFullYear(),
    month=(new Date).getMonth(),
    nyear=month<6?year-1:year+1;
    return [
      'year='+year, 
      'year='+nyear, 
    ].join(' or ');
  };
  this.sickDays=function(line){
    let res=1,
    aday=24*60*60*1000,
    ptrn=/^\d{4}\-\d{2}\-\d{2}\ \d{2}:\d{2}$/,
    date=line.date+' '+line.checkin,
    today=(new Date).getTime(),
    checkin=(new Date(date)).getTime(),
    checkout=!line.checkout.match(ptrn)
      ?(new Date(line.checkout)).getTime():false;
    if(checkout){
      res=Math.ceil((checkout-checkin)/aday);
    }else{
      res=Math.ceil((today-checkin)/aday);
    }
    return res;
  };
  this.getValueData=function(subject_id,data){
    data=Array.isArray(data)?data:[];
    let res={
      value:false,
      letter:false,
    };
    for(let i of data){
      if(i.subject_id==subject_id){
        res=i;
        break;
      }
    }
    return res;
  };
  this.getLetterValue=function(value){
    let letter={
      A:this.range(91,100),
      B:this.range(81,90),
      C:this.range(71,80),
      D:this.range(60,70),
      E:this.range(41,59),
      F:this.range(0,40),
    },
    res='F';
    for(let k in letter){
      if(letter[k].indexOf(parseInt(value))>=0){
        res=k;
        break;
      }
    }
    return res;
  };
  this.getName=function(id,data){
    data=Array.isArray(data)?data:[];
    let res=false;
    for(let i of data){
      if(i.id==id){
        res=i.name;
        break;
      }
    }return res;
  };
  this.getDateByMonth=function(month,data){
    data=Array.isArray(data)?data:[];
    let res='';
    for(let line of data){
      if(month==line.month){
        res=_Pesantrian.parseDate(line.transaction_date);
      }
    }
    return res;
  };
  this.getNominalByMonth=function(month,data){
    data=Array.isArray(data)?data:[];
    let res=0;
    for(let line of data){
      if(month==line.month){
        res+=parseInt(line.nominal);
      }
    }
    return res;
  };
  this.getStudyMonths=function(){
    return [6,7,8,9,10,11,0,1,2,3,4,5];
  };
  this.getStudyYear=function(){
    let month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    res=[year,year+1].join('/');
    if(month<6){
      res=[year-1,year].join('/');
    }
    return res;
  };
  this.getFinanceByType=function(data){
    data=Array.isArray(data)?data:[];
    let res={
      contribution:[],
      saving:[],
      donation:[],
      petty_cash:[],
      initial_fund:[],
      tahfidz_camp:[],
      school_event:[],
      register_annually:[],
      register_smp:[],
      register_sma_next:[],
      register_sma_new:[],
      register_test_sma:[],
      register_test_smp:[],
    },
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    oyear=month<6?[year-1,year]:[year,year+1];
    for(let line of data){
      if((line.month<6&&line.year==oyear[1])
        ||(line.month>5&&line.year==oyear[0])){
        if(!res.hasOwnProperty(line.name)){
          res[line.name]=[];
        }
        res[line.name].push(line);
      }
    }
    return res;
  };
  this.getLineByDate=function(data){
    data=Array.isArray(data)?data:[];
    let res={},date=0;
    for(let line of data){
      date=line.year
        +'-'+(parseInt(line.month)+1).toString().padStart(2,'0')
        +'-'+(line.date).toString().padStart(2,'0');
      if(!res.hasOwnProperty(date)){
        res[date]={
          sahur:0,
          breakfast:0,
          lunch:0,
          ifthor:0,
          dinner:0,
        };
      }
      if(line.done>0){
        res[date][line.name]=1;
      }
    }
    return res;
  };
  this.tagHadir=function(done){
    let tag=document.createElement('span');
    tag.innerText=done?'Hadir':'Tidak';
    tag.classList.add('gender');
    tag.classList.add(done?'gender-1':'gender-0');
    return tag;
  };
  this.tagDK=function(done){
    let tag=document.createElement('span');
    tag.innerText=done?'K':'D';
    tag.classList.add('gender');
    tag.classList.add(done?'gender-1':'gender-0');
    return tag;
  };
  this.tag=function(done){
    let tag=document.createElement('span');
    tag.innerText=done?'Sudah':'-';
    if(done){
      tag.classList.add('gender');
      tag.classList.add('gender-1');
    }return tag;
  };
  this.range=function(s,t){
    s=s?s:0;
    t=t?Math.max(s,t):0;
    let r=[];
    for(let i=s;i<=t;i++){
      r.push(i);
    }return r;
  };
  this.clearBody=function(){
    this.app.body.innerHTML='';
    this.app.body.scrollTo(0,0);
    this.app.hideMenu();
  };
  this.alias=function(key){
    return this.aliasData.hasOwnProperty(key)
      ?this.aliasData[key]:key;
  };
  return this.init();
};



/* PesantrianParent */
;function PesantrianParent(app){
this.app=app;
this.aliasData={
  sahur:'Sahur',
  breakfast:'Sarapan',
  lunch:'Makan Siang',
  ifthor:'Ifthor',
  dinner:'Makan Malam',
  sick:'Sakit',
  height:'Tinggi Badan',
  weight:'Berat Badan',
  studentOverview:'OVERVIEW',
  studentSPP:'SPP',
  studentSaving:'TABUNGAN',
  studentOther:'KEUANGAN LAINNYA',
  studentEat:'MAKAN BULAN INI',
  studentHealth:'KESEHATAN BULAN INI',
  studentExcul:'EXTRACURRICULAR BULAN INI',
  studentTahfidz:'TAHFIZH',
  studentDorm:'KEASRAMAAN',
  studentAcademic:'AKADEMIK',
  studentLaundry:'LAUNDRY',
  studentPresence:'ABSENSI',
  studentPackage:'KIRIMAN PAKET',
  studentGuest:'KUNJUNGAN',
  studentValuation:'TRANSKRIP AKADEMIK',
  studentPermission:'PERIZINAN',
  0:'January',
  1:'February',
  2:'March',
  3:'April',
  4:'May',
  5:'June',
  6:'July',
  7:'August',
  8:'September',
  9:'October',
  10:'November',
  11:'December',
  juz_total:'Jumlah Juz',
  memorize_total:'Jumlah Hafalan',
  memorize_target:'Target Hafalan',
  tajwid:'Tajwid',
  tahsin:'Tahsin',
  note:'Catatan',
  catatan:'Catatan',
  teacher_id:'Musyrifah',
  catatan:'Catatan',
  siklus_haid:'Siklus Haid',
  berat_badan:'Berat Badan',
  tinggi_badan:'Tinggi Badan',
  sakit:'Sakit bulan ini',
  register_test:'Pendaftaran Test PPDB',
  register_test_smp:'Pendaftaran Test PPDB SMP',
  register_test_sma:'Pendaftaran Test PPDB SMA',
  register_sma_new:'Daftar Ulang Santri Baru SMA',
  register_sma_next:'Daftar Ulang Lanjutan SMA',
  register_smp:'Daftar Ulang Santri Baru SMP',
  register_annually:'Daftar Ulang Tahunan',
  school_event:'Event Sekolah',
  id:'Nomor Transaksi',
  method:'Arus Dana',
  name:'Jenis Transaksi',
  petty_cash:'Petty Cash',
  donation:'Donasi',
  register:'Pendaftaran',
  contribution:'SPP',
  saving:'Tabungan',
  type:'Dana ke/dari',
  student:'Santri',
  parent:'Orangtua',
  employee:'Karyawan',
  status:'Status',
  paid:'Lunas',
  unpaid:'Nunggak',
  partly_paid:'Cicilan',
  cash:'Tunai',
  loan:'Pinjaman',
  profile_id:'Pengemban Dana',
  nominal:'Nominal',
  account:'Rekening Bank',
  explanation:'Keterangan',
  evidence:'Bukti Transaksi',
  report:'Berita Acara',
  transaction_date:'Tanggal Transaksi',
  transaction_code:'Kode Transaksi',
  date:'Tanggal Pembuatan',
  tahfidz_camp:'Tahfidz Camp',
  initial_fund:'Dana Awal',
  year:'Tahun',
  month:'Bulan',
  studyYear:'Tahun Ajaran',
  debt:'Debet',
  credit:'Kredit',
};
this.selection={
    name:[
      'contribution',
      'saving',
      'donation',
      'petty_cash',
      'register_test_smp',
      'register_test_sma',
      'register_sma_new',
      'register_sma_next',
      'register_smp',
      'register_annually',
      'school_event',
      'tahfidz_camp',
      'initial_fund',
    ],
    type:[
      'student',
      'parent',
      'employee',
    ],
    status:[
      'unpaid',
      'partly_paid',
      'paid',
      'cash',
      'loan',
    ],
    account:[
      'Yayasan - BSI 7164 540 558',
      'Donasi - BSI 7164 541 006',
      'Bendahara - BSI 7134 2000 43',
      'Tunai',
    ],
    accountx:[
      'Yayasan - BSI 7164 540 558 a/n Yayasan Aisyah Mulya',
      'Donasi - BSI 7164 541 006 a/n Yayasan Aisyah Mulya',
      'Bendahara - BSI 7134 2000 43 a/n Rina Ferianti',
      'Tunai',
    ],
    year:[
      '2023',
      '2024',
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030',
    ],
    studyYear:[
      '2023/2024',
      '2024/2025',
      '2025/2026',
      '2026/2027',
      '2027/2028',
      '2028/2029',
      '2029/2030',
    ],
    month:_Pesantrian.range(0,11),
  };
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.studyMonths=[6,7,8,9,10,11,0,1,2,3,4,5];
this.sppMax={
  7:2100000,
  8:2100000,
  9:2100000,
  10:2200000,
  11:2200000,
  12:2200000,
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  /* check type */
  if(_Pesantrian.user.type!=='parent'
    &&_Pesantrian.user.privilege<16){
    _Pesantrian.alert('Access denied!','You\'re not in parent account.','error');
    return;
  }
  
  if(false){
    alert(_Pesantrian.parser.likeJSON(_Pesantrian.user,3));
  }
  
  /* inside apps */
  let apps=[
    {
      name:'bill',
      title:'SPP',
      callback:function(e){
        _PesantrianParent.tableStudent('studentSPP');
      }
    },
    {
      name:'form',
      title:'Tabungan',
      callback:function(e){
        _PesantrianParent.tableStudent('studentSaving');
      }
    },
    {
      name:'form3',
      title:'Keuangan',
      callback:function(e){
        _PesantrianParent.tableStudent('studentOther');
      }
    },
  ],
  old_apps=[
    {
      name:'tahfidz',
      title:'Tahfizh',
      callback:function(e){
        _PesantrianParent.tableStudent('studentTahfidz');
      }
    },
    {
      name:'bunk',
      title:'Asrama',
      callback:function(e){
        _PesantrianParent.tableStudent('studentDorm');
      }
    },
    {
      name:'transcript',
      title:'Transkrip',
      callback:function(e){
        _PesantrianParent.tableStudent('studentValuation');
      }
    },
    {
      name:'clinic',
      title:'Kesehatan',
      callback:function(e){
        _PesantrianParent.tableStudent('studentHealth');
      }
    },
    {
      name:'extracurricular',
      title:'Eskul',
      callback:function(e){
        _PesantrianParent.tableStudent('studentExcul');
      }
    },
    {
      name:'laundry',
      title:'Laundry',
      callback:function(e){
        _PesantrianParent.tableStudent('studentLaundry');
      }
    },
    {
      name:'form2',
      title:'Absensi',
      callback:function(e){
        _PesantrianParent.tableStudent('studentPresence');
      }
    },
    {
      name:'package',
      title:'Paket',
      callback:function(e){
        _PesantrianParent.tableStudent('studentPackage');
      }
    },
    {
      name:'guest',
      title:'Kunjungan',
      callback:function(e){
        _PesantrianParent.tableStudent('studentGuest');
      }
    },
    {
      name:'form4',
      title:'Perizinan',
      callback:function(e){
        _PesantrianParent.tableStudent('studentPermission');
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianParent=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* evidence page */
this.evidencePage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  query='select id,evidence from transaction where id='+id,
  data=await _Pesantrian.request('query',query,50),
  text='Error: Data #'+id+' tidak ditemukan!';
  if(data.length==0){
    _Pesantrian.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  let evi=this.evidencePath(data[0].evidence),
  pro=document.createElement('div'),
  pimg=new Image;
  pimg.src=evi!=''?evi:_Pesantrian.IMAGES['icon-error.png'];
  pimg.main=pro;
  pimg.dialog=dialog;
  pimg.style.maxWidth='100%';
  pro.append(pimg);
  pimg.onload=function(){
    this.dialog.blank();
    this.dialog.main.append(this.main);
  };
  pimg.onerror=function(){
    this.dialog.loader.src=_Pesantrian.IMAGES['icon-error.png'];
  };
};

/* permission */
this.studentPermission=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentPermission');
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear(),
  studyYearQuery=this.getStudyYearQuery(),
  queries=[
    'select * from permission where student_id='+data.id
      +' and '+studyYearQuery,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='PERIZINAN<br />'+data.name
    +'<br />Tahun Ajaran '+studyYear,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal Izin','Tanggal Kembali','Jenis Izin','Lama','Status','Sanksi');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of datas[0]){
  row=this.row(
      _Pesantrian.parseDatetime(line.date+' '+line.hour),
      _Pesantrian.parseDatetime(line.back_date+' '+line.back_hour),
      line.type,
      line.long+' hari',
      line.status,
      line.penalty);
    table.append(row);
  }
};


/* valuation -- transkrip */
this.studentValuation=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentValuation');
    })
  );
  let loader=_Pesantrian.loader(),
  query='select * from class where student_id='+data.id,
  datas=await _Pesantrian.request('query',query),
  row=this.rowHead('TRANSKRIP NILAI AKADEMIK<br />'
    +data.name+'<br />',4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  row=this.row('Kelas','Tahun','Semester 1','Semester 2');
  row.classList.add('tr-head');
  table.append(row);
  /*  */
  if(datas.length<1){
    _Pesantrian.alert('Error','Failed to get student class.','error');
    return;
  }
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  dclass=datas[0].class,
  dyear=datas[0].year,
  zeroYear=dyear-dclass;


  for(let kelas of _Pesantrian.range(7,12)){
    let sem1=document.createElement('input');
    sem1.type='submit';
    sem1.value='Semester 1';
    sem1.classList.add('button-take');
    sem1.dataset.dx=JSON.stringify(data);
    sem1.dataset.class=''+kelas;
    sem1.dataset.year=''+(zeroYear+kelas);
    sem1.onclick=function(){
      _PesantrianParent.recapValueStudent(
        _Pesantrian.parseJSON(this.dataset.dx),
        1,
        this.dataset.year,
        this.dataset.class
      );
    };
    let sem2=document.createElement('input');
    sem2.type='submit';
    sem2.value='Semester 2';
    sem2.classList.add('button-take');
    sem2.dataset.dx=JSON.stringify(data);
    sem2.dataset.class=''+kelas;
    sem2.dataset.year=''+(zeroYear+kelas+1);
    sem2.onclick=function(){
      _PesantrianParent.recapValueStudent(
        _Pesantrian.parseJSON(this.dataset.dx),
        2,
        this.dataset.year,
        this.dataset.class
      );
    };
    row=this.row(
      'Kelas '+kelas,
      (zeroYear+kelas)+'/'+(zeroYear+kelas+1),
      sem1,
      sem2
    );
    table.append(row);
  }
  
  
};
this.recapValueStudent=async function(dx,semester,year,dclass){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.studentValuation(dx);
    })
  );
  let id=dx.id,
  name=dx.name,
  loader=_Pesantrian.loader(),
  queries=[
    'select * from subject where year="'+this.getStudyYear()+'"'
      +' and semester='+semester
      +' and class='+dclass,
    'select * from valuation where student_id='+id,
    'select * from daily_valuation where student_id='+id,
    'select * from presence where student_id='+id
      +' and year='+year+' and month '
      +(semester==1?'> 5':'< 6'),
    'select * from subjective_valuation where student_id='+id
      +' and year='+year+' and semester='+semester,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  subjects=data[0],
  vsemester=data[1],
  vdaily=data[2],
  vpresence=data[3],
  vsubject=data[4];
  /**
     --- subject
          0: (aid) [id:10] => LDB_AID
          1: (string) [name:256] => LDB_BLANK
          2: (int) [teacher_id:10] => "0"
          3: (int) [min_criteria:10] => "0"
          4: (string) [predicate:100] => LDB_BLANK
          5: (string) [year:100] => LDB_BLANK
          6: (int) [semester:10] => "0"
          7: (int) [class:10] => "0"
          8: (string) [data:30000] => LDB_BLANK
          9: (time) [time:10] => LDB_TIME
  */
  let row=this.rowHead('TRANSKRIP NILAI AKADEMIK<br />Semester '+semester
    +'<br />Tahun Ajaran '+this.getStudyYear()
    +'<br />'+name+'<br />Kelas '+dclass,6),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  /* testing */
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,5));
  }
  /* 20+30+30+20=100 */
  row=this.row(
    'Pelajaran',
    'Nilai Kumulatif',
    'Nilai Semester (20%)',
    'Nilai Kumulatif Harian (30%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjectif (20%)'
  );
  row.classList.add('tr-head');
  table.append(row);
  for(let sub of subjects){
    let nis=this.recapGetSemesterValue(sub.id,vsemester),
    nid=this.recapGetDailyValue(sub.id,vdaily),
    nip=this.recapGetPrecense(sub.teacher_id,vpresence),
    nix=this.recapGetSubjectiveValue(sub.id,vsubject),
    nux=this.recapGetCumulativeValue(nis,nid,nip,nix);
    row=this.row(sub.name,nux,nis,nid,nip,nix);
    table.append(row);
  }
};

this.studentValuation_OLD=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentValuation');
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear(),
  studyYearQuery=this.getStudyYearQuery(),
  queries=[
    'select * from daily_valuation where student_id='+data.id
      +' and '+studyYearQuery,
    'select * from valuation where student_id='+data.id
      +' and '+studyYearQuery,
    'select * from subject where year="'+studyYear+'"',
    'select id,name,position from employee where position="teacher" or position="tahfidz"',
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  teachers=datas[3],
  dclass=datas[4].length>0?datas[4][0].class:0,
  values=[...datas[0],...datas[1]],
  title='TRANSKRIP NILAI AKADEMIK<br />'+data.name
    +'<br />Kelas '+dclass
    +'<br />Tahun Ajaran '+studyYear,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Mata Pelajaran','Nilai','Huruf','KKM','Guru Pengajar');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  /* semester 1 */
  row=this.row('SEMESTER 1');
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[0].style.textAlign='center';
  table.append(row);
  for(let line of datas[2]){
    if(line.semester!=1||line.class!=dclass){continue;}
    let tname=this.getName(line.teacher_id,teachers),
    value=this.calculateValue(line.id,values),
    letter=this.getLetterValueAcademic(value);
    row=this.row(
      line.name,
      value,
      letter,
      line.min_criteria,
      tname
    );
    table.append(row);
  }
  /* semester 2 */
  row=this.row('SEMESTER 2');
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[0].style.textAlign='center';
  table.append(row);
  for(let line of datas[2]){
    if(line.semester!=2||line.class!=dclass){continue;}
    let tname=this.getName(line.teacher_id,teachers),
    value=this.calculateValue(line.id,values),
    letter=this.getLetterValueAcademic(value);
    row=this.row(
      line.name,
      value,
      letter,
      line.min_criteria,
      tname
    );
    table.append(row);
  }
  
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.calculateValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let total=0,
  count=0,
  res=null;
  for(let d of data){
    if(d.subject_id==sid){
      total+=parseInt(d.value);
      count++;
    }
  }
  if(count>0){
    res=Math.ceil(total/count);
  }
  return res;
};
this.getStudyYearQuery=function(){
  let studyYear=this.getStudyYear().split('/'),
  one=Math.floor(new Date(studyYear[0]+'-07-01').getTime()/1000),
  two=Math.floor(new Date(studyYear[1]+'-06-30').getTime()/1000),
  res=[
    'time > '+one,
    'time < '+two,
  ];
  return res.join(' and ');
};
this.getLetterValueAcademic=function(value){
  let letter={
    A:this.range(86,100),
    B:this.range(70,85),
    C:this.range(0,69),
  },
  res=null;
  for(let k in letter){
    if(letter[k].indexOf(parseInt(value))>=0){
      res=k;
      break;
    }
  }return res;
};


/* from recap teacher -- all stand-alone */
this.recapGetCumulativeValue=function(nis,nid,nip,nix){
  nis=nis||0;
  nid=nid||0;
  nip=nip||0;
  nix=nix||0;
  let res=0;
  res+=parseInt(nis)*0.2;
  res+=parseInt(nid)*0.3;
  res+=parseInt(nip)*0.3;
  res+=parseInt(nix)*0.2;
  return Math.ceil(res);
};
/**
 * --- subjective_valuation
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [teacher_id:10] => "0"
            4: (int) [value:3] => "0"
            5: (int) [semester:1] => "1"
            6: (int) [year:4] => "2024"
            7: (time) [time:10] => LDB_TIME
            8: (int) [subject_id:10] => "0"
 */
this.recapGetSubjectiveValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.subject_id==sid){
      res=d.value;
      break;
    }
  }return res;
};
/**
 * --- precense
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [class:2] => LDB_BLANK
            4: (int) [presence:5] => LDB_BLANK
            5: (string) [note:100] => LDB_BLANK
            6: (int) [date:2] => "1"
            7: (int) [month:2] => "0"
            8: (int) [year:4] => "2024"
            9: (time) [time:10] => LDB_TIME
            10: (int) [teacher_id:10] => "0"
            11: (int) [session:2] => "1"
 */
this.recapGetPrecense=function(tid,data){
  data=Array.isArray(data)?data:[];
  let res=0,
  count=0,
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ];
  for(let d of data){
    if(d.teacher_id==tid){
      if(d.presence==1||d.presence==3){
        res+=1;
      }
      count++;
    }
  }
  return count>0?Math.ceil(res/count*100):0;
};
/**
 * 
    --- daily_valuation
            0: (aid) [id:10] => LDB_AID
            1: (int) [student_id:10] => "0"
            2: (int) [subject_id:10] => "0"
            3: (int) [value:10] => "0"
            4: (string) [date:10] => LDB_BLANK
            5: (time) [time:10] => LDB_TIME
            6: (string) [letter:10] => LDB_BLANK
 */
this.recapGetDailyValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0,count=0;
  for(let d of data){
    if(d.subject_id==sid){
      res+=parseInt(d.value,10);
      count++;
    }
  }return count>0?Math.ceil(res/count):0;
};
/**
 * 
    --- valuation
            0: (aid) [id:10] => LDB_AID
            1: (int) [student_id:10] => "0"
            2: (int) [subject_id:10] => "0"
            3: (int) [value:10] => "0"
            4: (string) [letter:100] => LDB_BLANK
            5: (time) [time:10] => LDB_TIME
 */
this.recapGetSemesterValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.subject_id==sid){
      res=d.value;
      break;
    }
  }return res;
};


/* guest */
this.studentGuest=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentGuest');
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from guest where student_id='+data.id
      +' and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='KUNJUNGAN TAHUN INI<br />'+data.name+'<br />'
    +'Tahun '+year,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Check-In','Check-Out','Tujuan','Nomor Kendaraan');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of datas[0]){
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      line.checkin,
      line.checkout,
      line.purpose,
      line.plate
    );
    table.append(row);
  }
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};

/* package */
this.studentPackage=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentPackage');
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from package where profile_id='+data.id
      +' and type="student" and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='KIRIMAN PAKET TAHUN INI<br />'+data.name+'<br />'
    +'Tahun '+year,
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Jam','Kurir','Sudah Diterima');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of datas[0]){
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      line.hour,
      line.courier,
      line.given?'Sudah':'Belum'
    );
    table.append(row);
  }
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};

/* presence */
this.studentPresenceMonthly=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentPresence(data);
    })
  );
  let loader=_Pesantrian.loader(),
  cabs=(year/4)===Math.ceil(year/4)?29:28,
  dates=[31,cabs,31,30,31,30,31,31,30,31,30,31][month],
  queries=[
    'select * from presence where student_id='+data.id
      +' and month='+month+' and year='+year,
    'select * from tahfidz_presence where student_id='+data.id
      +' and month='+month+' and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='ABSENSI BULAN INI<br />'+data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,12),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Kelas','Halaqah');
  row.childNodes[0].setAttribute('rowspan',2);
  row.childNodes[1].setAttribute('colspan',7);
  row.childNodes[2].setAttribute('colspan',4);
  row.classList.add('tr-head');
  table.append(row);
  row=this.row('Sesi 1','Sesi 2','Sesi 3','Sesi 4','Sesi 5','Sesi 6','Sesi 7',
  'Sesi 1','Sesi 2','Sesi 3','Sesi 4');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let date of this.range(1,dates)){
    let pclass=this.getPresence(date,datas[0]),
    pteam=this.getPresence(date,datas[1]),
    nclass=[],
    nteam=[];
    for(let i=1;i<=7;i++){
      nclass.push(pclass.hasOwnProperty(i)?pclass[i].note:'-');
    }
    for(let i=1;i<=4;i++){
      nteam.push(pteam.hasOwnProperty(i)?pteam[i].note:'-');
    }
    /* class session 1-7 and halaqah session 1-4 */
    row=this.row(date,
      nclass[0],
      nclass[1],
      nclass[2],
      nclass[3],
      nclass[4],
      nclass[5],
      nclass[6],
      nteam[0],
      nteam[1],
      nteam[2],
      nteam[3]
    );
    table.append(row);
  }
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentPresence=function(data){
  this.clearBody();
  let title='ABSENSI<br />'
    +data.name+'<br />Tahun Ajaran '
    +this.getStudyYear(),
  row=this.rowHead(title,4),
  table=this.table(),
  studyYear=this.getStudyYear().split('/');
  table.append(row);
  for(let im of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.month=im+'';
    see.dataset.year=im<6?studyYear[1]:studyYear[0];
    see.onclick=function(){
      _PesantrianParent.studentPresenceMonthly(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.month,
        this.dataset.year
      );
    };
    row=this.row(this.month[im]+' '+see.dataset.year,see);
    table.append(row);
  }
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentPresence');
    })
  );
};
/* get presence by date */
this.getPresence=function(date,data){
  data=Array.isArray(data)?data:[];
  let res={};
  for(let row of data){
    if(date==row.date){
      res[row.session]=row;
    }
  }
  return res;
};

/* laundry */
this.studentLaundry=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentLaundry');
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  queries=[
    'select * from laundry where type="student" and year='
    +year+' and month='+month+' and profile_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  laundries=datas[0],
  credit=this.getCredit(data.id,laundries,'student'),
  saldo=document.createElement('span');
  loader.remove();
  saldo.innerText=_Pesantrian.parseNominal(credit);
  let title='Biaya Laundry diluar Seragam'
    +'<br />Bulan '+this.month[month]+' '+year,
  row=this.rowHead(title,3),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  row=this.row('Tanggal','Nominal','Keterangan');
  row.classList.add('tr-head');
  table.append(row);
  for(let laun of laundries){
    row=this.row(
      _Pesantrian.parseDate(laun.time*1000),
      _Pesantrian.parseNominal(laun.flow==1?laun.nominal:-laun.nominal),
      laun.kind,
    );
    row.childNodes[1].classList.add('td-right');
    table.append(row);
  }
  row=this.row('Total',saldo,'');
  row.classList.add('tr-head');
  table.append(row);
};
this.getCredit=function(profile_id,data=[],type='student'){
  let res=type=='student'?0:this.credit*1000;
  for(let i of data){
    if(i.profile_id==profile_id){
      if(i.flow==1){
        res+=parseInt(i.nominal);
      }else{
        res-=parseInt(i.nominal);
      }
    }
  }return res;
};

/* academic */
this.studentAcademicSemester=async function(data,studyYear,semester){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentAcademic(data);
    })
  );
  semester=semester||1;
  studyYear=studyYear||this.getStudyYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from class where student_id='+data.id,
    'select * from subject where semester='+semester
      +' and year="'+studyYear+'"',
    'select * from valuation where student_id='+data.id,
    'select id,name,position from employee where position="teacher" or position="tahfidz"',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  classes=datas[0],
  subjects=datas[1],
  valuations=datas[2],
  teachers=datas[3],
  dclass=classes.length>0?classes[0].class:0,
  nomor=1,
  title='NILAI AKADEMIK<br />'+data.name+'<br />Kelas '+dclass
    +'<br />Semester '+semester+'<br />Tahun Ajaran '+studyYear,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('NO','Mata Pelajaran','Nilai','Huruf','KKM','Guru Pengajar');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(subjects,3));
  }
  /* subjects */
  for(let subject of subjects){
    if(subject.class!=dclass){
      continue;
    }
    let teacherName=this.getName(subject.teacher_id,teachers),
    value=this.getValueData(subject.id,valuations);
    row=this.row(nomor,subject.name,value.value,value.letter,subject.min_criteria,teacherName);
    table.append(row);
    nomor++;
  }
};
this.studentAcademic=function(data){
  this.clearBody();
  let title='AKADEMIK<br />'
    +data.name+'<br />Tahun Ajaran '
    +this.getStudyYear(),
  row=this.rowHead(title,4),
  table=this.table(),
  studyYear=this.getStudyYear();
  table.append(row);
  for(let im of [1,2]){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.semester=im+'';
    see.dataset.study_year=studyYear;
    see.onclick=function(){
      _PesantrianParent.studentAcademicSemester(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.study_year,
        this.dataset.semester
      );
    };
    row=this.row('Semester '+im+' - '+studyYear,see);
    table.append(row);
  }
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentAcademic');
    })
  );
};
/*

class
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [class:10] => "0"
            4: (time) [time:10] => LDB_TIME

subject
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:256] => LDB_BLANK
            2: (int) [teacher_id:10] => "0"
            3: (int) [min_criteria:10] => "0"
            4: (string) [predicate:100] => LDB_BLANK
            5: (string) [year:100] => LDB_BLANK
            6: (int) [semester:10] => "0"
            7: (int) [class:10] => "0"
            8: (string) [data:30000] => LDB_BLANK
            9: (time) [time:10] => LDB_TIME

valuation
            0: (aid) [id:10] => LDB_AID
            1: (int) [student_id:10] => "0"
            2: (int) [subject_id:10] => "0"
            3: (int) [value:10] => "0"
            4: (string) [letter:100] => LDB_BLANK
            5: (time) [time:10] => LDB_TIME

*/

/* dorm */
this.studentDorm=function(data){
  this.clearBody();
  let title='KEASRAMAAN<br />'
    +data.name+'<br />Tahun Ajaran '
    +this.getStudyYear(),
  row=this.rowHead(title,4),
  table=this.table(),
  studyYear=this.getStudyYear().split('/');
  table.append(row);
  for(let im of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.month=im+'';
    see.dataset.year=im<6?studyYear[1]:studyYear[0];
    see.onclick=function(){
      _PesantrianParent.studentDormMonthly(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.month,
        this.dataset.year
      );
    };
    row=this.row(this.month[im]+' '+see.dataset.year,see);
    table.append(row);
  }
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentDorm');
    })
  );
};
this.studentDormMonthly=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentDorm(data);
    })
  );
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from dorm_value where student_id='+data.id
      +' and month='+month+' and year='+year,
    'select id,name,position from employee where position="tahfidz"',
    'select * from dorm where student_id='+data.id
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  valuation=datas[0],
  dormData=datas[2][0],
  title='KEASRAMAAN<br />'
    +data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,2),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* building_name */
  row=this.row('Musyrifah',this.getName(dormData.teacher_id,datas[1]));
  table.append(row);
  row=this.row('Gedung',dormData.building_name);
  table.append(row);
  row=this.row('Ruangan',dormData.room_name);
  table.append(row);
  row=this.row('Kamar Mandi',dormData.rest_room);
  table.append(row);
  
  /* check if value has been sent */
  if(valuation.length==0){
    row=this.row('Belum ada penilaian untuk bulan '+this.month[month]+' '+year);
    row.childNodes[0].setAttribute('colspan',2);
    row.childNodes[0].classList.add('extra-high');
    table.append(row);
    return;
  }
  let val=valuation[0],
  passes=['akhlaq','kebersihan','pelanggaran','apresiasi'],
  tname=this.getName(val.teacher_id,datas[1]),
  ddata=_Pesantrian.parseJSON(val.data);
  
  
  /* section data */
  row=this.rowHead('DATA KEASRAMAAN',2);
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  for(let sec in ddata){
    if(passes.indexOf(sec)>=0){
      continue;
    }
    row=this.row(this.alias(sec),ddata[sec]);
    row.classList.add('extra-high');
    table.append(row);
  }
  
  /* passes way */
  for(let sec of passes){
    row=this.rowHead(sec.toUpperCase(),3);
    table=this.table();
    table.append(row);
    this.app.body.append(table);
    let kname='Aspek Penilaian',
    vname='Nilai',
    lname='Huruf',
    sdata=ddata.hasOwnProperty(sec)?ddata[sec]:{};
    if(sec=='pelanggaran'){
      kname='Jenis Pelanggaran';
      vname='Point';
      lname='Tanggal';
    }else if(sec=='apresiasi'){
      kname='Jenis Tindakan';
      vname='Point';
      lname='Tanggal';
    }
    row=this.row(kname,vname,lname);
    row.classList.add('tr-head');
    table.append(row);
    for(let k in sdata){
      let line=sdata[k],
      val=this.getLetterValue(line.value);
      if(sec=='pelanggaran'||sec=='apresiasi'){
        val=_Pesantrian.parseDate(line.date);
      }
      row=this.row(line.key,line.value,val);
      table.append(row);
    }
  }
  
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(ddata,3));
    return;
  }
};

/* tahfidz */
this.studentTahfidz=function(data){
  this.clearBody();
  let title='TAHFIZH<br />'
    +data.name+'<br />Tahun Ajaran '
    +this.getStudyYear(),
  row=this.rowHead(title,4),
  table=this.table(),
  studyYear=this.getStudyYear().split('/');
  table.append(row);
  for(let im of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Buka';
    see.classList.add('button-take');
    see.dataset.data=JSON.stringify(data);
    see.dataset.month=im+'';
    see.dataset.year=im<6?studyYear[1]:studyYear[0];
    see.onclick=function(){
      _PesantrianParent.studentTahfidzMonthly(
        _Pesantrian.parseJSON(this.dataset.data),
        this.dataset.month,
        this.dataset.year
      );
    };
    row=this.row(this.month[im]+' '+see.dataset.year,see);
    table.append(row);
  }
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentTahfidz');
    })
  );
};
this.studentTahfidzMonthly=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentTahfidz(data);
    })
  );
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from tahfidz where student_id='+data.id
      +' and month='+month+' and year='+year,
    'select id,name,position from employee where position="tahfidz"',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  valuation=datas[0],
  title='TAHFIZH<br />'
    +data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* check if value has been sent */
  if(valuation.length==0){
    row=this.row('Belum ada penilaian untuk bulan '+this.month[month]+' '+year);
    row.childNodes[0].setAttribute('colspan',4);
    row.childNodes[0].classList.add('extra-high');
    table.append(row);
    return;
  }
  let val=valuation[0],
  passes=['id','time','month','year','student_id'],
  tname=this.getName(val.teacher_id,datas[1]);
  
  for(let key in val){
    let value=val[key];
    if(passes.indexOf(key)>=0){
      continue;
    }
    if(key=='teacher_id'){
      value=tname;
    }
    row=this.row(this.alias(key),value);
    row.childNodes[0].classList.add('extra-high');
    table.append(row);
  }
};

/* parent kids overview */
this.studentOverview=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from kitchen where student_id='+data.id
      +' and month='+month,
    'select * from transaction where profile_id='+data.id
      +' and type="student"',
    'select * from clinic where student_id='+data.id
      +' and year='+year+' and month='+month,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  kitchen=this.getLineByDate(datas[0]),
  finance=this.getFinanceByType(datas[1]),
  health=datas[2],
  total=0,
  lines,
  nominal,
  title='MAKAN BULAN INI<br />'
    +this.month[month]+' '
    +(new Date).getFullYear(),
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tgl',
    this.alias('sahur'),
    this.alias('breakfast'),
    this.alias('lunch'),
    this.alias('ifthor'),
    this.alias('dinner')
  );
  row.classList.add('tr-head');
  table.append(row);
  for(let date in kitchen){
    let line=kitchen[date],
    sahur=this.tag(line.sahur),
    breakfast=this.tag(line.breakfast),
    lunch=this.tag(line.lunch),
    ifthor=this.tag(line.ifthor),
    dinner=this.tag(line.dinner);
    row=this.row(date,sahur,breakfast,lunch,ifthor,dinner);
    table.append(row);
  }
  this.app.body.append(table);
  /* finance - contribution - SPP */
  table=this.table();
  title='SPP<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,3);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal');
  row.classList.add('tr-head');
  table.append(row);
  lines=finance.contribution;
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    tgl=this.getDateByMonth(monthName,lines);
    row=this.row(tgl,this.alias(monthName),nominalRp);
    table.append(row);
  }
  this.app.body.append(table);
  /* finance - saving - TABUNGAN */
  table=this.table();
  title='TABUNGAN<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,3);
  table.append(row);
  row=this.row('Tanggal','Nominal','Debet/Kredit');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    let date=_Pesantrian.parseDate(line.time*1000),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    row=this.row(date,nominal,dk);
    table.append(row);
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  /* health */
  table=this.table();
  title='KESEHATAN BULAN INI<br />'
    +this.month[month]+' '
    +(new Date).getFullYear();
  row=this.rowHead(title,3);
  table.append(row);
  row=this.row(this.alias('height'),data.height+' cm');
  row.childNodes[0].setAttribute('colspan','2');
  table.append(row);
  row=this.row(this.alias('weight'),data.weight+' kg');
  row.childNodes[0].setAttribute('colspan','2');
  table.append(row);
  row=this.row('NO','Keterangan','Hari');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  let nomor=0;
  for(let line of health){
    let sick=this.sickDays(line);
    total+=sick;
    row=this.row(nomor,this.alias('sick'),sick+' hari');
    row.dataset.data=JSON.stringify(line);
    table.append(row);
    nomor++;
  }
  row=this.row('Total',total+' hari');
  row.childNodes[0].setAttribute('colspan','2');
  table.append(row);
  if(total==0){
    row=this.row('Alhamdulillaah, ananda '+data.name+' tidak pernah sakit bulan ini');
    row.childNodes[0].setAttribute('colspan','3');
  }
  table.append(row);
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentExcul=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentExcul');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from extracurricular where student_id='+data.id
      +' and year='+year+' and month='+month,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  title='EXTRACURRICULAR<br />'
    +data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tanggal','Extra','Hadir','Nilai');
  row.classList.add('tr-head');
  table.append(row);
  for(let line of datas[0]){
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      line.ex_name,
      this.tagHadir(line.presence),
      line.value
    );
    table.append(row);
  }
  this.app.body.append(table);
  
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentHealth=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentHealth');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from clinic where student_id='+data.id
      +' and year='+year+' and month='+month,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  health=datas[0],
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* health */
  table=this.table();
  title='KESEHATAN BULAN INI<br />'
    +data.name+'<br />'
    +this.month[month]+' '
    +(new Date).getFullYear();
  row=this.rowHead(title,3);
  table.append(row);
  row=this.row(this.alias('height'),data.height+' cm');
  row.childNodes[0].setAttribute('colspan','2');
  table.append(row);
  row=this.row(this.alias('weight'),data.weight+' kg');
  row.childNodes[0].setAttribute('colspan','2');
  table.append(row);
  row=this.row('NO','Keterangan','Hari');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  let nomor=0;
  for(let line of health){
    let sick=this.sickDays(line);
    total+=sick;
    row=this.row(nomor,this.alias('sick'),sick+' hari');
    row.dataset.data=JSON.stringify(line);
    table.append(row);
    nomor++;
  }
  row=this.row('Total',total+' hari');
  row.childNodes[0].setAttribute('colspan','2');
  table.append(row);
  if(total==0){
    row=this.row('Alhamdulillaah, ananda '+data.name+' tidak pernah sakit bulan ini');
    row.childNodes[0].setAttribute('colspan','3');
  }
  table.append(row);
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentEat=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentEat');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from kitchen where student_id='+data.id
      +' and month='+month+' and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  kitchen=this.getLineByDate(datas[0]),
  total=0,
  lines,
  nominal,
  title='MAKAN BULAN INI<br />'+data.name+'<br />'
    +this.month[month]+' '+year,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tgl',
    this.alias('sahur'),
    this.alias('breakfast'),
    this.alias('lunch'),
    this.alias('ifthor'),
    this.alias('dinner')
  );
  row.classList.add('tr-head');
  table.append(row);
  for(let date in kitchen){
    let line=kitchen[date],
    sahur=this.tag(line.sahur),
    breakfast=this.tag(line.breakfast),
    lunch=this.tag(line.lunch),
    ifthor=this.tag(line.ifthor),
    dinner=this.tag(line.dinner);
    row=this.row(date,sahur,breakfast,lunch,ifthor,dinner);
    table.append(row);
  }
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};


this.studentOtherDetail=async function(id,datax){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentOther(datax);
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name from student',
    'select id,name from parent',
    'select id,name from employee',
    'select * from transaction where id='+id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
  },
  trans=data[3][0],
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:_Pesantrian.parseJSON(trans.data),
  row=this.rowHead('DETAIL TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','time','uid','id','explanation','date','year','month',
    'report','transaction_code'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(selection.hasOwnProperty(key)){
      val=this.alias(value);
    }else if(key=='profile_id'){
      val=this.getName(value,dtype[trans.type]);
    }else if(key=='method'){
      let gspan=document.createElement('span');
      gspan.innerText=methods[value];
      gspan.classList.add('gender');
      gspan.classList.add('gender-'+value);
      val=gspan;
    }else if(key=='transaction_date'||key=='date'){
      val=_Pesantrian.parseDate(value);
    }else if(integers.indexOf(key)>=0){
      val=value;
      if(key=='nominal'){
        val=_Pesantrian.parseNominal(value);
      }
    }else if(key=='evidence'){
      val=new Image;
      val.src=_Pesantrian.eva.config.host
        +'pesantrian/finance/evidence/'+value;
      val.onerror=function(e){
        this.src=_Pesantrian.IMAGES['icon-error.png'];
      };
    }else{
      val=value;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* rincian */
  table=this.table();
  row=this.rowHead('RINCIAN',3);
  table.append(row);
  let nomor=0;
  row=this.row('NO','Nominal','Keterangan');
  table.append(row);
  for(let k in udata.rincian){
    let kel=udata.rincian[k];
    row=this.row(nomor,_Pesantrian.parseNominal(kel.nominal),kel.keterangan);
    nomor++;
    table.append(row);
  }
  this.app.body.append(table);
  /* */
  
};
this.studentOther=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentOther');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and '
      +this.queryOthers()+' and '
      +this.queryTA(),
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=datas[0],
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  this.app.body.append(table);

  /* finance - others - KEUANGAN LAINNYA */
  title='KEUANGAN LAINNYA<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Detail');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance){
    let date=_Pesantrian.parseDate(line.transaction_date),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    /* detail */
    let detail=document.createElement('input');
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=''+line.id;
    detail.dataset.data=JSON.stringify(data);
    detail.onclick=function(){
      return _PesantrianParent.studentOtherDetail(
        this.dataset.id,
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    /* row */
    row=this.row(date,nominal,dk,this.alias(line.name),detail);
    table.append(row);
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianParent.evidencePage(this.dataset.id);
    };
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','');
  row.classList.add('tr-head');
  table.append(row);
};
this.studentSaving=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSaving');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="saving" order by transaction_date asc'
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0],'saving'),
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* finance - saving - TABUNGAN */
  title='TABUNGAN<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    saldo=_Pesantrian.parseNominal(total),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    row=this.row(date,nominal,dk,line.explanation,saldo);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    table.append(row);
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianParent.evidencePage(this.dataset.id);
    };
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentSPPDetail=async function(data,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentSPP(data);
    })
  );
  
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and month='+month+' and year='+year,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  trans=datas[0],
  passes=['id','name','type','method','status','year','month','profile_id','data','uid','nominal','time','report','explanation','date'],
  row,table=this.table();
  loader.remove();
  
  
  let aliases={
    account:'Transfer ke rekening',
    transaction_date:'Tanggal Transaksi',
    transaction_code:'Kode Transaksi',
    evidence:'Bukti Transaksi',
  };
  for(let tran of trans){
    table=this.table();
    row=this.rowHead('SPP bulan '
      +this.month[month]+' '+year
      +'<br />'+data.name+'<br />');
    table.append(row);
    for(let key in tran){
      let value=tran[key],
      val=value,
      kname=aliases.hasOwnProperty(key)?aliases[key]:key;
      if(passes.indexOf(key)>=0){
        continue;
      }
      if(key=='transaction_date'){
        val=_Pesantrian.parseDate(value);
      }
      if(key=='evidence'){
        val=new Image;
        val.src=_Pesantrian.IMAGES['loader.gif'];
        val.id='evidence'+tran.id;
        let ival=new Image;
        ival.dataset.id='evidence'+tran.id;
        ival.src=this.evidencePath(value);
        ival.onload=function(){
          let uval=document.getElementById(this.dataset.id);
          uval.src=this.src;
        };
        ival.onerror=function(){
          let uval=document.getElementById(this.dataset.id);
          uval.src=_Pesantrian.IMAGES['icon-error.png'];
        };
      }
      row=this.row(kname,val);
      table.append(row);
    }
    row=this.row('Total Nominal',_Pesantrian.parseNominal(tran.nominal));
    table.append(row);
    row=this.rowHead('RINCIAN',2);
    table.append(row);
    let rins=_Pesantrian.parseJSON(tran.data);
    for(let k in rins.rincian){
      let rin=rins.rincian[k];
      row=this.row('SPP bulan '+rin.keterangan,_Pesantrian.parseNominal(rin.nominal));
      table.append(row);
    }
    this.app.body.append(table);
  }
  
  /*
  
  - profile_id  (INT)
  - nominal     (INT:15)
  - transaction_date 
  - transaction_code 
  
  - report      -- laporan
  - evidence    -- bukti
  - explanation -- keterangan
  - time        (TIME)
  - date        (DATE)
  - account     (string:50) number
  */
  
  
};
this.studentSPP=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSPP');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" ',
    'select * from scholarship where student_id='+data.id,
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  dclass=datas[2].length>0?parseInt(datas[2][0].class):12,
  maxPaid=datas[1].length>0?parseInt(datas[1][0].nominal):this.sppMax[dclass],
  total=0,
  lines,
  nominal,
  studyYear=this.getStudyYear().split('/'),
  title,
  row,
  table=this.table();
  loader.remove();
  /* finance - contribution - SPP */
  title='SPP<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal','Status','');
  row.classList.add('tr-head');
  table.append(row);
  lines=[];
  for(let con of finance.contribution){
    if((con.month<6&&con.year==studyYear[1])
      ||(con.month>5&&con.year==studyYear[0])){
      lines.push(con);
    }
  }
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    status=nominal>=maxPaid?'Lunas':'-',
    detail=document.createElement('input'),
    tgl=this.getDateByMonth(monthName,lines);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-take');
    detail.dataset.data=JSON.stringify(data);
    detail.dataset.month=monthName;
    detail.dataset.year=monthName<6?studyYear[1]:studyYear[0];
    detail.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data),
      month=this.dataset.month,
      year=this.dataset.year;
      _PesantrianParent.studentSPPDetail(data,month,year);
    };
    row=this.row(tgl,this.alias(monthName),nominalRp,status,detail);
    table.append(row);
  }
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.tableStudent=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  pgender=_Pesantrian.user.profile.gender==1?'father_id':'mother_id',
  query=_Pesantrian.user.privilege>=8
    ?'select * from student where graduated=0'
    :'select * from student where graduated=0 and '
      +pgender+'='+profile_id,
  queries=[
    query
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  row=this.rowHead(this.alias(innerApp)
    +'<br />Tahun Ajaran '+this.getStudyYear(),3),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  row=this.row('ID','Nama Anak','');
  row.classList.add('tr-head');
  table.append(row);
  if(_Pesantrian.user.privilege>=8){
    let find=document.createElement('input');
    find.classList.add('kitchen-find');
    find.type='text';
    find.placeholder='Cari Nama...';
    find.onkeyup=function(e){
      let rg=new RegExp(this.value,'i'),
      nm=document.querySelectorAll('tr[data-name]');
      for(let i=0;i<nm.length;i++){
        if(nm[i].dataset.name.match(rg)){
          nm[i].style.removeProperty('display');
        }else{
          nm[i].style.display='none';
        }
      }
    };
    row=this.row('',find,'');
    table.append(row);
  }
  for(let line of students){
    let stat=document.createElement('input');
    stat.type='submit';
    stat.value='Buka';
    stat.classList.add('button-take');
    stat.dataset.data=JSON.stringify(line);
    stat.dataset.method=innerApp;
    stat.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      if(!_PesantrianParent.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianParent[this.dataset.method].apply(_PesantrianParent,[data]);
    };
    row=this.row(line.id,line.name,stat);
    row.dataset.name=line.name;
    table.append(row);
  }
  this.app.body.append(table);
};

/* ---------- inner ---------- */
this.queryOthers=function(){
  /**
   * 
      'register_test_smp',
      'register_test_sma',
      'register_sma_new',
      'register_sma_next',
      'register_smp',
      'register_annually',
      'school_event',
   */
  let res=[
    'name="register_test_smp"',
    'name="register_test_sma"',
    'name="register_sma_new"',
    'name="register_sma_next"',
    'name="register_smp"',
    'name="register_annually"',
    'name="school_event"',
  ].join(' or ');
  return res;
};
this.evidencePath=function(fname){
  return _Pesantrian.eva.config.host
    +'pesantrian/finance/evidence/'+fname;
};
this.queryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  nyear=month<6?year-1:year+1;
  return [
    'year='+year, 
    'year='+nyear, 
  ].join(' or ');
};
this.sickDays=function(line){
  let res=1,
  aday=24*60*60*1000,
  ptrn=/^\d{4}\-\d{2}\-\d{2}\ \d{2}:\d{2}$/,
  date=line.date+' '+line.checkin,
  today=(new Date).getTime(),
  checkin=(new Date(date)).getTime(),
  checkout=!line.checkout.match(ptrn)
    ?(new Date(line.checkout)).getTime():false;
  if(checkout){
    res=Math.ceil((checkout-checkin)/aday);
  }else{
    res=Math.ceil((today-checkin)/aday);
  }
  return res;
};
this.getValueData=function(subject_id,data){
  data=Array.isArray(data)?data:[];
  let res={
    value:false,
    letter:false,
  };
  for(let i of data){
    if(i.subject_id==subject_id){
      res=i;
      break;
    }
  }
  return res;
};
this.getLetterValue=function(value){
  let letter={
    A:this.range(91,100),
    B:this.range(81,90),
    C:this.range(71,80),
    D:this.range(60,70),
    E:this.range(41,59),
    F:this.range(0,40),
  },
  res='F';
  for(let k in letter){
    if(letter[k].indexOf(parseInt(value))>=0){
      res=k;
      break;
    }
  }
  return res;
};
this.getName=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i.name;
      break;
    }
  }return res;
};
this.getDateByMonth=function(month,data){
  data=Array.isArray(data)?data:[];
  let res='';
  for(let line of data){
    if(month==line.month){
      res=_Pesantrian.parseDate(line.transaction_date);
    }
  }
  return res;
};
this.getNominalByMonth=function(month,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let line of data){
    if(month==line.month){
      res+=parseInt(line.nominal);
    }
  }
  return res;
};
this.getStudyMonths=function(){
  return [6,7,8,9,10,11,0,1,2,3,4,5];
};
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.getFinanceByType=function(data){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if(!res.hasOwnProperty(line.name)){
      res[line.name]=[];
    }
    res[line.name].push(line);
    
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
    }
  }
  return res;
};
this.getLineByDate=function(data){
  data=Array.isArray(data)?data:[];
  let res={},date=0;
  for(let line of data){
    date=line.date;
    if(!res.hasOwnProperty(date)){
      res[date]={
        sahur:0,
        breakfast:0,
        lunch:0,
        ifthor:0,
        dinner:0,
      };
    }
    if(line.done>0){
      res[date][line.name]=1;
    }
  }
  return res;
};
this.tagHadir=function(done){
  let tag=document.createElement('span');
  tag.innerText=done?'Hadir':'Tidak';
  tag.classList.add('gender');
  tag.classList.add(done?'gender-1':'gender-0');
  return tag;
};
this.tagDK=function(done){
  let tag=document.createElement('span');
  tag.innerText=done?'K':'D';
  tag.classList.add('gender');
  tag.classList.add(done?'gender-1':'gender-0');
  return tag;
};
this.tag=function(done){
  let tag=document.createElement('span');
  tag.innerText=done?'Sudah':'-';
  if(done){
    tag.classList.add('gender');
    tag.classList.add('gender-1');
  }return tag;
};
this.range=function(s,t){
  s=s?s:0;
  t=t?Math.max(s,t):0;
  let r=[];
  for(let i=s;i<=t;i++){
    r.push(i);
  }return r;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianScanner */
;function PesantrianScanner(app){
this.app=app;
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.place=_Pesantrian.user.name;
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'form',
      title:'Kehadiran',
      callback:function(e){
        _PesantrianScanner.presenceChecked();
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianScanner.presenceScanner();
      }
    },
  ];
  if(_Pesantrian.user.privilege>=8){
    apps.push({
      name:'form7',
      title:'Lv8 Kehadiran',
      callback:function(e){
        _PesantrianScanner.presenceCheckedLv8();
      }
    });
  }
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianScanner=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
  
  /* put some tracker element */
  let tell=document.createElement('div');
  tell.id='teller-id';
  this.app.body.append(tell);
  this.trackUserOnline();
};

/* online user tracker */
this.trackUserOnline=async function(){
  let tell=document.getElementById('teller-id');
  if(!tell){return;}
  let host=_Pesantrian.appHosts.online+'?i='+_Pesantrian.user.id,
  res=await fetch(host).then(r=>{
    return true;
  }).catch(e=>{
    return false;
  });
  await _Pesantrian.sleep(10000);
  this.trackUserOnline();
};

/* presence checked lv8 */
this.presenceCheckedLv8=async function(date,month,year){
  date=date||(new Date).getDate();
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from employee_presence where year='+year
      +' and month='+month+' and date='+date,
    'select id,name,position from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  table=this.table(),
  row,
  syear=document.createElement('select'),
  smonth=document.createElement('select'),
  sdate=document.createElement('select'),
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  day=_Pesantrian.parseDate([
    year,
    (parseInt(month)+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  head=this.rowHead('KEHADIRAN Lv8<br />'
    +day+'<br />'+this.place,5);
  loader.remove();
  this.app.body.append(table);
  table.append(head);
  
  /* config */
  row=this.row('Tahun',syear);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Bulan',smonth);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Tanggal',sdate);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  
  /* header */
  row=this.row('ID','Nama','Divisi','Masuk','Keluar');
  row.classList.add('tr-head');
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-center');
  row.childNodes[2].classList.add('td-center');
  row.childNodes[3].classList.add('td-center');
  row.childNodes[4].classList.add('td-center');
  table.append(row);
  /* table */
  for(let i of data[1]){
    if(['resign','scanner'].indexOf(i.position)>=0){
      continue;
    }
    let dd=await _Pesantrian.getDataByKey('employee_id',i.id,data[0],true),
    din=Array.isArray(dd)&&dd.length>0?[
        dd[0].hour.toString().padStart(2,'0'),
        dd[0].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[0].note.split(':')[2]
      :'',
    dout=Array.isArray(dd)&&dd.length>1?[
        dd[1].hour.toString().padStart(2,'0'),
        dd[1].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[1].note.split(':')[2]
      :'',
    divisi=_Pesantrian.appNames[i.position],
    row=this.row(i.id,i.name,divisi,din,dout);
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-center');
    row.childNodes[4].classList.add('td-center');
    table.append(row);
  }
  /* year select */
  for(let yea of _Pesantrian.range(2024,2030)){
    let opt=document.createElement('option');
    opt.value=yea;
    opt.textContent=yea;
    if(yea==year){
      opt.selected='selected';
    }
    syear.append(opt);
  }
  syear.onchange=()=>{
    this.presenceCheckedLv8(
      sdate.value,
      smonth.value,
      syear.value,
    );
  };
  /* month select */
  for(let mon in this.month){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon];
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  smonth.onchange=()=>{
    this.presenceCheckedLv8(
      sdate.value,
      smonth.value,
      syear.value,
    );
  };
  /* employee select */
  for(let dt of _Pesantrian.range(1,kmonth[month])){
    let opt=document.createElement('option');
    opt.value=dt;
    opt.textContent=dt;
    if(dt==date){
      opt.selected='selected';
    }
    sdate.append(opt);
  }
  sdate.onchange=()=>{
    this.presenceCheckedLv8(
      sdate.value,
      smonth.value,
      syear.value,
    );
  };
};

/* presence checked */
this.presenceChecked=async function(date,month,year){
  date=date||(new Date).getDate();
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from employee_presence where year='+year
      +' and month='+month+' and date='+date,
    'select id,name,position from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  table=this.table(),
  row,
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  day=_Pesantrian.parseDate([
    year,
    (month+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  head=this.rowHead('KEHADIRAN HARI INI<br />'
    +day+'<br />'+this.place,5);
  loader.remove();
  this.app.body.append(table);
  table.append(head);
  row=this.row('ID','Nama','Divisi','Masuk','Keluar');
  row.classList.add('tr-head');
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-center');
  row.childNodes[2].classList.add('td-center');
  row.childNodes[3].classList.add('td-center');
  row.childNodes[4].classList.add('td-center');
  table.append(row);
  for(let i of data[1]){
    if(['resign','scanner'].indexOf(i.position)>=0){
      continue;
    }
    let dd=await _Pesantrian.getDataByKey('employee_id',i.id,data[0],true),
    din=Array.isArray(dd)&&dd.length>0?[
        dd[0].hour.toString().padStart(2,'0'),
        dd[0].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[0].note.split(':')[2]
      :'',
    dout=Array.isArray(dd)&&dd.length>1?[
        dd[1].hour.toString().padStart(2,'0'),
        dd[1].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[1].note.split(':')[2]
      :'',
    divisi=_Pesantrian.appNames[i.position],
    row=this.row(i.id,i.name,divisi,din,dout);
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-center');
    row.childNodes[4].classList.add('td-center');
    table.append(row);
  }
};

/* presence */
this.presenceScanner=async function(){
  let qdata=await _Pesantrian.scannerPageX(),
  dtime=(new Date).getTime();
  await _Pesantrian.audioPlay('beep.mp3');
  if(!qdata||qdata.id==0
    ||!qdata.hasOwnProperty('table')){
    _Pesantrian.notif('Invalid QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  if(qdata.table=='eq'){
    return this.processEQ(qdata);
  }else if(qdata.table=='s'){
    if(_Pesantrian.user.name=='DAPUR AISYAH'){
      return this.processStudentKitchen(qdata);
    }else if(_Pesantrian.user.name=='KANTOR AISYAH'){
      return this.processStudentCredit(qdata);
    }
  }
  
  /* */
  _Pesantrian.notif('Invalid QRCode! ...','error',3000);
  await _Pesantrian.sleep(3000);
  await this.presenceScanner();
  return;
};


/* qrscanner -- check */
this.checkCredit=async function(){
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    loader.remove();
    if(blocked){
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
      return _Pesantrian.alert(
        _Pesantrian.parseNominal(saving),
        student_name,
        'info'
      );
};
this.processStudentCredit=async function(qdata=false){
  let place=_Pesantrian.user.name;
  if(!qdata||qdata.id==0||qdata.table!='s'){
    _Pesantrian.notif('Invalid QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=qdata.id.toString(),
    student_name=qdata.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    tables={
      s:'student',
      e:'employee',
    },
    type=tables[qdata.table],
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    loader.remove();
    if(blocked){
      _Pesantrian.notif('Card is being blocked! Usually till the end of the month.','error',3000);
      await _Pesantrian.sleep(3000);
      await this.presenceScanner();
      return;
    }
    
      _Pesantrian.notif(_Pesantrian.parseNominal(saving)+' ('+student_name+')','info',5000);
      await _Pesantrian.sleep(5000);
      await this.presenceScanner();
  
};
this.getQueryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  res=[
    'date > "'+year+'-07-01"',
    'date < "'+(year+1)+'-06-30"',
  ];
  if(month<6){
    res=[
      'date > "'+(year-1)+'-07-01"',
      'date < "'+year+'-06-30"',
    ];
  }
  return res.join(' and ');
};
this.getSavingBalance=function(data=[]){
  let ndata=this.getFinanceByType(data,'saving'),
  total=0;
  for(let d of ndata){
    if(d.method==1){
      total+=parseInt(d.nominal);
    }else{
      total-=parseInt(d.nominal);
    }
  }return total;
};
this.getFinanceByType=function(data,type){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if(!res.hasOwnProperty(line.name)){
      res[line.name]=[];
    }
    res[line.name].push(line);
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
    }
  }
  return res.hasOwnProperty(type)?res[type]:[];
};


/* process eq */
this.processEQ=async function(qdata=false){
  let dtime=(new Date).getTime();
  if(!qdata||qdata.id==0||qdata.table!='eq'
    ||!qdata.space.match(/^\d+$/i)){
    _Pesantrian.notif('Invalid QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  if(parseInt(qdata.space,10)<dtime){
    _Pesantrian.notif('Expired QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  /* security only */
  let thisDay=(new Date).getDay(),
  lastDay=thisDay>0?thisDay-1:6,
  ids=[31,33,34],
  idsObject={
    34:'erwin',
    31:'iwan',
    33:'solah',
  },
  idsDay=[
    31,
    31,
    33,
    33,
    34,
    34,
    31,
  ],
  sid=idsDay[lastDay],
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  date=(new Date).getDate(),
  hour=(new Date).getHours(),
  kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  lastYear=year-1,
  lastMonth=month>0?month-1:11,
  maxDate=kmonth[lastMonth],
  lastDate=date>1?date-1:maxDate;
  /* security division only */
  if(ids.indexOf(qdata.id)>=0&&qdata.id==sid&&hour<8){
    date=lastDate;
    month=date==maxDate?lastMonth:month;
    year=date==maxDate&&month==11?lastYear:year;
  }
  /* */
  let loader=_Pesantrian.loader(),
  data={
    year,
    month,
    date,
    hour,
    minute:(new Date).getMinutes(),
    employee_id:qdata.id,
    employee_name:qdata.name,
    note:[
      qdata.table,
      qdata.id,
      this.place,
      qdata.space,
    ].join(':'),
  },
  squery='select * from employee_presence where year='+data.year
    +' and month='+data.month
    +' and date='+data.date
    +' and employee_id='+data.employee_id,
  sdata=await _Pesantrian.request('query',squery);
  if(sdata.length>=2){
    loader.remove();
    let ldata=sdata[1],
    jamKeluar=[
      ldata.hour.toString().padStart(2,'0'),
      ldata.minute.toString().padStart(2,'0'),
    ].join(':');
    _Pesantrian.notif('Sudah pulang jam '+jamKeluar,'info',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }else if(sdata.length==1){
    loader.remove();
    let ldata=sdata[0],
    jamMasuk=[
      ldata.hour.toString().padStart(2,'0'),
      ldata.minute.toString().padStart(2,'0'),
    ].join(':');
    _Pesantrian.notif('Memproses pulang dari jam '+jamMasuk,'info',3000);
    await _Pesantrian.sleep(3000);
    loader=_Pesantrian.loader();
  }
  let innerQuery=_Pesantrian.buildQuery(data),
  query='insert into employee_presence '+innerQuery,
  res=await _Pesantrian.request('query',query);
  loader.remove();
  if(res==1){
    _Pesantrian.notif(
      data.employee_name+' '
        +(sdata.length==1?'Absen keluar di ':'Absen masuk di ')
        +this.place,
      'success',5000);
    await _Pesantrian.sleep(5000);
    await this.presenceScanner();
    return;
  }
  _Pesantrian.notif('Failed to save presence! ','error',3000);
  await _Pesantrian.sleep(3000);
  await this.presenceScanner();
  return;
};

/* process student kitchen */
this.processStudentKitchen=async function(qdata=false){
  let place=_Pesantrian.user.name;
  if(!qdata||qdata.id==0||qdata.table!='s'){
    _Pesantrian.notif('Invalid QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  let loader=_Pesantrian.loader(),
  names={
    sahur:'Sahur',
    breakfast:'Sarapan',
    lunch:'Makan Siang',
    ifthor:'Ifthor',
    dinner:'Makan Malam',
  },
  name='dinner',
  hour=(new Date).getHours(),
  minute=(new Date).getMinutes(),
  hmin=parseInt(hour.toString()+minute.toString());
  if(hour>=1&&hour<=4){
    name='sahur';
  }else if(hour>=5&&hour<=9){
    name='breakfast';
  }else if(hour>=10&&hour<=15){
    name='lunch';
  }else if(hour>=16&&hour<=21){
    if([1,4].indexOf((new Date).getDay())>=0
      &&hour<=17){
      name='ifthor';
    }else if((new Date).getMonth()==1
      &&(new Date).getDate()>27
      &&hmin<=1821){
      name='ifthor';
    }else if((new Date).getMonth()==2
      &&(new Date).getDate()<31
      &&hmin<=1821){
      name='ifthor';
    }
  }
  let data={
    name:name,
    student_id:qdata.id,
    uid:_Pesantrian.user.id,
    done:1,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    date:(new Date).getDate(),
  },
  query='select * from kitchen where student_id='+data.student_id
    +' and year='+data.year
    +' and month='+data.month
    +' and date='+data.date
    +' and name="'+data.name+'"',
  res=await _Pesantrian.request('query',query);
  if(res.length>=1){
    loader.remove();
    _Pesantrian.notif(
      qdata.name+' sudah mengambil jatah '+names[name]+'!',
      'error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  query='insert into kitchen '+_Pesantrian.buildQuery(data);
  res=await _Pesantrian.request('query',query);
  loader.remove();
  _Pesantrian.notif(
    qdata.name+' mendapatkan '+names[name]+'!',
    'success',5000);
  await _Pesantrian.sleep(5000);
  await this.presenceScanner();
  
  
  
  /*ARRAY
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [father_id:10] => "0"
            4: (int) [mother_id:10] => "0"
            5: (int) [done:10] => "0"
            6: (int) [uid:10] => "0"
            7: (time) [time:10] => LDB_TIME
            8: (int) [year:4] => "2024"
            9: (int) [month:2] => "0"
            10: (int) [date:2] => "1"
            11: (int) [employee_id:10] => "0"
  */
};




/*  */
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
/*  */
this.newEP=function(){
  let dtime=(new Date).getTime(),
  name=this.place,
  hour=(0x25b*0x3e8),
  ns=Math.floor(dtime/hour).toString(36).padStart(8,'0');
  return btoa([
    'ep',
    ns,
    name,
    dtime+hour,
  ].join(':')).split('').reverse().join('');
};
/*  */
this.qrPut=function(id,data){
  new QRCode(id,{
    text:data,
    width:200,
    height:200,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
};

return this.init();
};



/* PesantrianEmployee */
;function PesantrianEmployee(app){
this.app=app;
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'form',
      title:'Kehadiran',
      callback:function(e){
        _PesantrianEmployee.presenceChecked();
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianEmployee.presenceScanner();
      }
    },
    {
      name:'qrcode',
      title:'MyQR',
      callback:function(e){
        _PesantrianEmployee.myQR();
      }
    },{
      name:'qrcode',
      title:'MyCard',
      callback:function(e){
        _PesantrianEmployee.myCard();
      }
    },
  ];
  if(_Pesantrian.user.privilege>=8){
    apps.push({
      name:'form7',
      title:'Lv8 Kehadiran',
      callback:function(e){
        _PesantrianEmployee.presenceCheckedLv8();
      }
    });
  }
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianEmployee=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* presence checked lv8 */
this.presenceCheckedLv8=async function(month,year,eid){
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  eid=eid||_Pesantrian.user.profile_id;
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from employee_presence where year='+year
      +' and month='+month+' and employee_id='+eid,
    'select id,name,position from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  table=this.table(),
  row,
  syear=document.createElement('select'),
  smonth=document.createElement('select'),
  semployee=document.createElement('select'),
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  kem=_Pesantrian.getDataByKey('id',eid,data[1]),
  head=this.rowHead('KEHADIRAN Lv8<br />'
    +this.month[month]+' '+year
    +'<br />'+kem.name
    +'<br />('+_Pesantrian.appNames[kem.position]+')',3);
  loader.remove();
  this.app.body.append(table);
  table.append(head);
  
  /* config */
  row=this.row('Tahun',syear);
  row.childNodes[1].setAttribute('colspan',2);
  table.append(row);
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',2);
  table.append(row);
  row=this.row('Nama',semployee);
  row.childNodes[1].setAttribute('colspan',2);
  table.append(row);
  
  /* header */
  row=this.row('Tanggal','Masuk','Keluar');
  row.classList.add('tr-head');
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-center');
  row.childNodes[2].classList.add('td-center');
  table.append(row);
  /* table */
  for(let i=1;i<=kmonth[month];i++){
    let dd=_Pesantrian.getDataByKey('date',i,data[0],true),
    din=Array.isArray(dd)&&dd.length>0?[
        dd[0].hour.toString().padStart(2,'0'),
        dd[0].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[0].note.split(':')[2]
      :'',
    dout=Array.isArray(dd)&&dd.length>1?[
        dd[1].hour.toString().padStart(2,'0'),
        dd[1].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[1].note.split(':')[2]
      :'',
    row=this.row(i,din,dout);
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[2].classList.add('td-center');
    table.append(row);
  }
  /* year select */
  for(let yea of _Pesantrian.range(2024,2030)){
    let opt=document.createElement('option');
    opt.value=yea;
    opt.textContent=yea;
    if(yea==year){
      opt.selected='selected';
    }
    syear.append(opt);
  }
  syear.onchange=()=>{
    this.presenceCheckedLv8(
      smonth.value,
      syear.value,
      semployee.value,
    );
  };
  /* month select */
  for(let mon in this.month){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon];
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  smonth.onchange=()=>{
    this.presenceCheckedLv8(
      smonth.value,
      syear.value,
      semployee.value,
    );
  };
  /* employee select */
  for(let em of data[1]){
    if(em.position=='resign'){
      continue;
    }
    let opt=document.createElement('option'),
    epos=' ('+_Pesantrian.appNames[em.position]+')';
    opt.value=em.id;
    opt.textContent=em.name;
    if(em.id==eid){
      opt.selected='selected';
    }
    semployee.append(opt);
  }
  semployee.onchange=()=>{
    this.presenceCheckedLv8(
      smonth.value,
      syear.value,
      semployee.value,
    );
  };
};


/* presence checked */
this.presenceChecked=async function(month,year){
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  eid=_Pesantrian.user.profile_id,
  query='select * from employee_presence where year='+year
    +' and month='+month+' and employee_id='+eid,
  data=await _Pesantrian.request('query',query),
  table=this.table(),
  row,
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  head=this.rowHead('KEHADIRAN<br />'
    +this.month[month]+' '+year,3);
  loader.remove();
  this.app.body.append(table);
  table.append(head);
  row=this.row('Tanggal','Masuk','Keluar');
  row.classList.add('tr-head');
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-center');
  row.childNodes[2].classList.add('td-center');
  table.append(row);
  for(let i=1;i<=kmonth[month];i++){
    let dd=await _Pesantrian.getDataByKey('date',i,data,true),
    din=Array.isArray(dd)&&dd.length>0?[
        dd[0].hour.toString().padStart(2,'0'),
        dd[0].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[0].note.split(':')[2]
      :'',
    dout=Array.isArray(dd)&&dd.length>1?[
        dd[1].hour.toString().padStart(2,'0'),
        dd[1].minute.toString().padStart(2,'0'),
      ].join(':')
        +'<br />'+dd[1].note.split(':')[2]
      :'',
    row=this.row(i,din,dout);
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[2].classList.add('td-center');
    table.append(row);
  }
};

/* presence */
this.presenceScanner=async function(){
  let qdata=await _Pesantrian.scannerPageX(),
  dtime=(new Date).getTime();
  if(!qdata||qdata.id==0
    ||!qdata.hasOwnProperty('table')){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
  if(qdata.table=='ep'){
    return this.processEP(qdata);
  }
  
  /* */
  return _Pesantrian.alert('Error: Invalid QRCode!','','error');
};

/* process ep */
this.processEP=async function(qdata=false){
  let dtime=(new Date).getTime();
  if(!qdata||qdata.id==0||qdata.table!='ep'
    ||!qdata.space.match(/^\d+$/i)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
  if(parseInt(qdata.space,10)<dtime){
    return _Pesantrian.alert('Error: Expired QRCode!','','error');
  }
  /* security only */
  let thisDay=(new Date).getDay(),
  lastDay=thisDay>0?thisDay-1:6,
  ids=[31,33,34],
  idsObject={
    34:'erwin',
    31:'iwan',
    33:'solah',
  },
  idsDay=[
    31,
    31,
    33,
    33,
    34,
    34,
    31,
  ],
  sid=idsDay[lastDay],
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  date=(new Date).getDate(),
  hour=(new Date).getHours(),
  kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  lastYear=year-1,
  lastMonth=month>0?month-1:11,
  maxDate=kmonth[lastMonth],
  lastDate=date>1?date-1:maxDate;
  /* security division only */
  if(ids.indexOf(_Pesantrian.user.profile_id)>=0
    &&_Pesantrian.user.profile_id==sid
    &&hour<8){
    date=lastDate;
    month=date==maxDate?lastMonth:month;
    year=date==maxDate&&month==11?lastYear:year;
  }
  /* */
  let loader=_Pesantrian.loader(),
  data={
    year,
    month,
    date,
    hour,
    minute:(new Date).getMinutes(),
    employee_id:_Pesantrian.user.profile_id,
    employee_name:_Pesantrian.user.profile.name,
    note:[
      qdata.table,
      qdata.id,
      qdata.name,
      qdata.space,
    ].join(':'),
  },
  squery='select * from employee_presence where year='+data.year
    +' and month='+data.month
    +' and date='+data.date
    +' and employee_id='+data.employee_id,
  sdata=await _Pesantrian.request('query',squery);
  if(sdata.length>=2){
    loader.remove();
    let ldata=sdata[1],
    jamKeluar=[
      ldata.hour.toString().padStart(2,'0'),
      ldata.minute.toString().padStart(2,'0'),
    ].join(':');
    return _Pesantrian.alert(data.employee_name,
      'Sudah dinyatakan pulang pada jam '+jamKeluar,
      'info');
  }else if(sdata.length==1){
    loader.remove();
    let ldata=sdata[0],
    jamMasuk=[
      ldata.hour.toString().padStart(2,'0'),
      ldata.minute.toString().padStart(2,'0'),
    ].join(':'),
    yes=await _Pesantrian.confirmX('Pulang sekarang?',
      'Masuk jam '+jamMasuk);
    if(!yes){return;}
    loader=_Pesantrian.loader();
  }
  let innerQuery=_Pesantrian.buildQuery(data),
  query='insert into employee_presence '+innerQuery,
  res=await _Pesantrian.request('query',query);
  loader.remove();
  if(res==1){
    let al=await _Pesantrian.alertX(
      data.employee_name,
      (sdata.length==1?'Absen keluar di ':'Absen masuk di ')
        +qdata.name,
      'success'
    );
    if(al){}
    return;
  }
  let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
  if(al){}
};


/* my qrcode */
this.myQR=async function(){
  let dialog=await _Pesantrian.dialogPage(),
  myeq=this.myEQ(),
  id=_Pesantrian.user.id,
  qrdiv=document.createElement('div');
  qrdiv.classList.add('qrcode-outer');
  dialog.main.innerHTML='';
  dialog.main.append(qrdiv);
  dialog.main.style.backgroundColor='#309695';
  this.qrPut(qrdiv,myeq);
};


/* presence old */
this.presenceScannerOld=async function(perm){
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return _Pesantrian.alert('Error: Has no camera access!','','error');
      }
      this.presenceScannerOld(true);
    });
    return;
  }
  let dialog=await _Pesantrian.dialogPage(),
  button=document.createElement('input'),
  video=document.createElement('video'),
  content=document.createElement('div');
  content.append(video);
  content.append(button);
  button.type='submit';
  button.value='Stop';
  button.onclick=function(){
    if(this.value=='Stop'){
      this.scanner.stop();
      this.value='Start';
    }else{
      this.scanner.start();
      this.value='Stop';
    }
  };
  dialog.blank();
  dialog.main.append(content);
  /* initiate scanner */
  button.scanner=new QrScanner(video,async result=>{
    button.scanner.stop();
    dialog.close();
    let qdata=_Pesantrian.qrcodeParse(result.data),
    dtime=(new Date).getTime();
    if(!qdata||qdata.id==0){
      return _Pesantrian.alert('Error: Invalid QRCode!','','error');
    }
    if(parseInt(qdata.space,10)<dtime){
      return _Pesantrian.alert('Error: Expired QRCode!','','error');
    }
    let loader=_Pesantrian.loader(),
    data={
      year:(new Date).getFullYear(),
      month:(new Date).getMonth(),
      date:(new Date).getDate(),
      hour:(new Date).getHours(),
      minute:(new Date).getMinutes(),
      employee_id:_Pesantrian.user.profile_id,
      employee_name:_Pesantrian.user.name,
      note:[
        qdata.table,
        qdata.id,
        qdata.name,
        qdata.space,
      ].join(':'),
    },
    squery='select * from employee_presence where year='+data.year
      +' and month='+data.month
      +' and date='+data.date
      +' and employee_id='+data.employee_id,
    sdata=_Pesantrian.query('query',squery);
    if(sdata.length>=2){
      loader.remove();
      return _Pesantrian.alert(data.employee_name,
        'Sudah dinyatakan pulang!','info');
    }else if(sdata.length==1){
      loader.remove();
      let ldata=sdata[0],
      jamMasuk=[
        ldata.hour.toString().padStart(2,'0'),
        ldata.minute.toString().padStart(2,'0'),
      ].join(':'),
      yes=await _Pesantrian.confirmX('Pulang?',
        'Masuk jam '+jamMasuk);
      if(!yes){return;}
      loader=_Pesantrian.loader();
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into employee_presence '+innerQuery,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    if(res==1){
      let al=await _Pesantrian.alertX(data.employee_name,
        'Hadir di '+qdata.name,'success');
      if(al){}
      return;
    }
    let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
    if(al){}
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  /* start scanning */
  button.scanner.start();
};



/*  */
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};

/* my qrcode */
this.myCard=async function(){
  let dialog=await _Pesantrian.dialogPage(),
  myeq=this.myECard(),
  id=_Pesantrian.user.id,
  qrdiv=document.createElement('div');
  qrdiv.classList.add('qrcode-outer');
  qrdiv.classList.add('qrcode-outer-dark');
  dialog.main.innerHTML='';
  dialog.main.append(qrdiv);
  dialog.main.style.backgroundColor='#333';
  this.qrPut(qrdiv,myeq);
};
/* transactional qr card */
this.myECard=function(){
  let dtime=(new Date).getTime(),
  hour=(0x25b*0x3e8),
  id=_Pesantrian.user.profile_id,
  name=_Pesantrian.user.profile.name,
  ns=Math.floor(id).toString(36).padStart(8,'0');
  return btoa([
    'e',
    ns,
    name,
    dtime+hour,
  ].join(':')).split('').reverse().join('');
};
/* presence qr card*/
this.myEQ=function(){
  let dtime=(new Date).getTime(),
  hour=(0x25b*0x3e8),
  id=_Pesantrian.user.profile_id,
  name=_Pesantrian.user.profile.name,
  ns=Math.floor(id).toString(36).padStart(8,'0');
  return btoa([
    'eq',
    ns,
    name,
    dtime+hour,
  ].join(':')).split('').reverse().join('');
};
/*  */
this.qrPut=function(id,data){
  new QRCode(id,{
    text:data,
    width:280,
    height:280,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
};

return this.init();
};



/* PesantrianTeacher */
;function PesantrianTeacher(app){
this.app=app;
this.aliasData={
  'class':'Kelas',
  student_id:'Nama Santri',
  date:'Tanggal',
  event_name:'Nama Perlombaan',
  event_org:'Penyelenggara',
  note:'Keterangan',
  presence:'Kehadiran',
  value:'Nilai Keaktifan',
  ex_name:'Nama Eskul',
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
  0:'January',
  1:'February',
  2:'March',
  3:'April',
  4:'May',
  5:'June',
  6:'July',
  7:'August',
  8:'September',
  9:'October',
  10:'November',
  11:'December',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.yearly=[
  6,7,8,9,10,11,
  0,1,2,3,4,5,
];
this.eskulNames=[
  'Taekwondo',
  'Tataboga',
  'Tibbun Nabawi',
  'Hidroponik',
  'Tata Busana',
  'Renang',
  'Jurnalistik',
];
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.sppMax={
  7:2100000,
  8:2100000,
  9:2100000,
  10:2200000,
  11:2200000,
  12:2200000,
};
this.studyMonths=[6,7,8,9,10,11,0,1,2,3,4,5];

this.sessions={
  "1":[730,810],
  "2":[810,850],
  "3":[850,930],
  "4":[1000,1040],
  "5":[1040,1120],
  "6":[1120,1200],
  "7":[1300,1340],
};

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'bill',
      title:'Mapel',
      callback:function(e){
        _PesantrianTeacher.subjectTeacher();
      }
    },
    {
      name:'form2',
      title:'Rekap',
      callback:function(e){
        _PesantrianTeacher.recapValue();
      }
    },
    {
      name:'form',
      title:'Absensi',
      callback:function(e){
        _PesantrianTeacher.presenceRoom();
      }
    },
    {
      name:'event',
      title:'Perlombaan',
      callback:function(e){
        _PesantrianTeacher.tableEvent();
      }
    },
    {
      name:'extracurricular',
      title:'Eskul',
      callback:function(e){
        _PesantrianTeacher.tableExtracurricular();
      }
    },
    {
      name:'headmaster',
      title:'Mudir',
      callback:function(e){
        _PesantrianTeacher.headMaster();
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianTeacher.presenceScannerRoom();
      }
    },
    {
      name:'form6',
      title:'Rekap Kehadiran',
      callback:function(e){
        _PesantrianTeacher.presenceRecap();
      }
    },
    {
      name:'form5',
      title:'Rekap Guru',
      callback:function(e){
        _PesantrianTeacher.presenceRecapTeacher();
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianTeacher=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};


/* presence recap per month per teacher */
this.presenceRecapTeacher=async function(month,year,tid){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  let tdef=_Pesantrian.user.privilege>=8
    ?4:_Pesantrian.user.profile_id;
  /* month and year and table */
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  tid=tid||tdef;
  /* pull data */
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from presence where year='+year
      +' and month='+month+' and teacher_id='+tid,
    'select id,name,position from employee where position="teacher"',
    'select * from class order by name asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ],
  table=this.table(),
  sessions=_Pesantrian.range(1,7);
  row=this.rowHead('REKAP KEHADIRAN PER GURU',reasons.length+2),
  classes=[
    ..._Pesantrian.range(7,12),
    ..._Pesantrian.range(27,32)
  ],
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* teacher selector */
  let steacher=document.createElement('select');
  steacher.dataset.month=month;
  steacher.dataset.year=year;
  for(let em of data[1]){
    let opt=document.createElement('option');
    opt.value=em.id;
    opt.textContent=em.name+' #'+em.id;
    if(em.id==tid){
      opt.selected='selected';
    }
    steacher.append(opt);
  }
  steacher.onchange=function(){
    _PesantrianTeacher.presenceRecapTeacher(
      parseInt(this.dataset.month),
      parseInt(this.dataset.year),
      parseInt(this.value),
    );
  };
  row=this.row('Guru',steacher);
  row.childNodes[1].setAttribute('colspan',reasons.length+1);
  table.append(row);
  if(_Pesantrian.user.privilege<8){
    steacher.disabled=true;
  }
  /* month selector */
  let smonth=document.createElement('select'),
  studyYear=this.yearStudy().split('/');
  for(let mon of this.studyMonths){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon]+' '
      +(mon>5?studyYear[0]:studyYear[1]);
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  smonth.dataset.studyYear=this.yearStudy();
  smonth.dataset.tid=tid;
  smonth.onchange=function(){
    let studyYear=this.dataset.studyYear.split('/'),
    dmonth=parseInt(this.value),
    dyear=parseInt(dmonth>5?studyYear[0]:studyYear[1]);
    _PesantrianTeacher.presenceRecapTeacher(
      dmonth,
      dyear,
      parseInt(this.dataset.tid),
    );
  };
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',reasons.length+1);
  table.append(row);
  /* each student by classes */
  for(let dclass of classes){
    /* header */
    let students=_Pesantrian.getDataByKey('class',dclass,data[2],true),
    row=this.row.apply(this,[
      'Kelas '+dclass,
      '',
      ...reasons,
    ]);
    row.classList.add('tr-head');
    table.append(row);
    /* students */
    for(let student of students){
      let studentPresence=_Pesantrian.getDataByKey(
        'student_id',
        student.student_id,
        data[0],
        true
      ),
      presence=[student.name,];
      for(let reason in reasons){
        let sp=_Pesantrian.getDataByKey(
          'presence',
          reason,
          studentPresence,
          true
        );
        presence.push(sp.length);
      }
      row=this.row.apply(this,presence);
      row.childNodes[0].setAttribute('colspan',2);
      table.append(row);
    }
  }
  /* OBJECT class
                id: 25
                name: SHAFIYYAH ALHARITSAH
                student_id: 99
                class: 8
                time: 1707096304
                year: 2024
  */
};
/* presence recap per month per class */
this.presenceRecap=async function(month,year,classed=7){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  /* pull data */
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from presence where year='+year
      +' and month='+month+'',
    'select id,name,position from employee where position="tahfidz" or position="teacher" or position="it" or position="headmaster"',
    'select * from class order by name asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  table=this.table(),
  row=this.rowHead('REKAP KEHADIRAN',kmonth[month]+2),
  classesx=[
    ..._Pesantrian.range(7,12),
    ..._Pesantrian.range(27,32)
  ],
  classes=[classed],
  sessions=_Pesantrian.range(1,7);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* selector */
  let smonth=document.createElement('select'),
  studyYear=this.yearStudy().split('/');
  for(let mon of this.studyMonths){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon]+' '
      +(mon>5?studyYear[0]:studyYear[1]);
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  smonth.dataset.studyYear=this.yearStudy();
  smonth.dataset.classed=classed;
  smonth.onchange=function(){
    let studyYear=this.dataset.studyYear.split('/'),
    dmonth=parseInt(this.value),
    dyear=parseInt(dmonth>5?studyYear[0]:studyYear[1]);
    _PesantrianTeacher.presenceRecap(
      dmonth,
      dyear,
      this.dataset.classed
    );
  };
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',kmonth[month]+1);
  table.append(row);
  /* classed selector */
  let sclass=document.createElement('select');
  for(let dclass of classesx){
    let opt=document.createElement('option');
    opt.value=dclass;
    opt.textContent='Kelas '+dclass;
    if(dclass==classed){
      opt.selected='selected';
    }
    sclass.append(opt);
  }
  sclass.style.color='#fff';
  sclass.dataset.year=year;
  sclass.dataset.month=month;
  sclass.onchange=function(){
    let dmonth=parseInt(this.dataset.month),
    dyear=parseInt(this.dataset.year);
    _PesantrianTeacher.presenceRecap(dmonth,dyear,this.value);
  };
  
  /* each student by classes */
  for(let dclass of classes){
    /* header */
    let students=_Pesantrian.getDataByKey('class',dclass,data[2],true),
    row=this.row.apply(this,[
      sclass,
      'Tgl',
      ..._Pesantrian.range(1,kmonth[month]),
    ]);
    row.classList.add('tr-head');
    table.append(row);
    /* students */
    for(let student of students){
      let studentPresence=_Pesantrian.getDataByKey(
        'student_id',
        student.student_id,
        data[0],
        true
      );
      for(let session of sessions){
        let presence=this.presenceRecapGetStudentPresence(
          session,
          kmonth[month],
          studentPresence,
          data[1],
        ),
        trow=session==1?[
          student.name,
          session,
          ...presence,
        ]:[
          session,
          ...presence,
        ],
        row=this.row.apply(this,trow);
        table.append(row);
        if(session==1){
          row.childNodes[0].setAttribute('rowspan',sessions.length);
        }
      }
    }
  }
  /* OBJECT class
                id: 25
                name: SHAFIYYAH ALHARITSAH
                student_id: 99
                class: 8
                time: 1707096304
                year: 2024
  */
};
this.presenceRecapGetStudentPresence=function(session,kdate,data=[],teachers=[]){
  let res=[],
  spresence=_Pesantrian.getDataByKey('session',session,data,true);
  for(let date of _Pesantrian.range(1,kdate)){
    let div=document.createElement('div'),
    span=document.createElement('span'),
    presence=_Pesantrian.getDataByKey('date',date,spresence),
    teacher=presence
      ?_Pesantrian.getDataByKey('id',presence.teacher_id,teachers)
      :false;
    div.classList.add('presence-note');
    span.classList.add('presence-teacher');
    div.innerText=presence?presence.note:'';
    span.innerText=teacher?teacher.name:'';
    if(teacher){
      div.append(span);
      div.span=span;
      div.onclick=function(){
        if(this.span.classList.contains('presence-teacher-show')){
          this.span.classList.remove('presence-teacher-show');
        }else{
          this.span.classList.add('presence-teacher-show');
        }
      };
    }
    res.push(div);
  }
  return res;
  /* OBJECT presence
                id: 25
                name: ANJELITA MUTIARA HAKIM
                student_id: 37
                class: 10
                presence: 1
                note: Hadir
                date: 15
                month: 1
                year: 2024
                time: 1707966996
                teacher_id: 4
                session: 1
  */
};


/* recap value */
this.recapValueStudent=async function(id,name,semester,year,dclass){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.recapValue();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from subject where year="'+this.getStudyYear()+'"'
      +' and semester='+semester
      +' and class='+dclass,
    'select * from valuation where student_id='+id,
    'select * from daily_valuation where student_id='+id,
    'select * from presence where student_id='+id
      +' and year='+year+' and month '
      +(semester==1?'> 5':'< 6'),
    'select * from subjective_valuation where student_id='+id
      +' and year='+year+' and semester='+semester,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  subjects=data[0],
  vsemester=data[1],
  vdaily=data[2],
  vpresence=data[3],
  vsubject=data[4];
  /**
     --- subject
          0: (aid) [id:10] => LDB_AID
          1: (string) [name:256] => LDB_BLANK
          2: (int) [teacher_id:10] => "0"
          3: (int) [min_criteria:10] => "0"
          4: (string) [predicate:100] => LDB_BLANK
          5: (string) [year:100] => LDB_BLANK
          6: (int) [semester:10] => "0"
          7: (int) [class:10] => "0"
          8: (string) [data:30000] => LDB_BLANK
          9: (time) [time:10] => LDB_TIME
  */
  let row=this.rowHead('REKAP NILAI AKADEMIK<br />Semester '+semester
    +'<br />Tahun Ajaran '+this.getStudyYear()
    +'<br />'+name+'<br />Kelas '+dclass,6),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  /* testing */
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,5));
  }
  /* 20+30+30+20=100 */
  row=this.row(
    'Pelajaran',
    'Nilai Kumulatif',
    'Nilai Semester (20%)',
    'Nilai Kumulatif Harian (30%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjectif (20%)'
  );
  row.classList.add('tr-head');
  table.append(row);
  for(let sub of subjects){
    let nis=this.recapGetSemesterValue(sub.id,vsemester),
    nid=this.recapGetDailyValue(sub.id,vdaily),
    nip=this.recapGetPrecense(sub.teacher_id,vpresence),
    nix=this.recapGetSubjectiveValue(sub.id,vsubject),
    nux=this.recapGetCumulativeValue(nis,nid,nip,nix);
    row=this.row(sub.name,nux,nis,nid,nip,nix);
    table.append(row);
  }
};
this.recapGetCumulativeValue=function(nis,nid,nip,nix){
  nis=nis||0;
  nid=nid||0;
  nip=nip||0;
  nix=nix||0;
  let res=0;
  res+=parseInt(nis)*0.2;
  res+=parseInt(nid)*0.3;
  res+=parseInt(nip)*0.3;
  res+=parseInt(nix)*0.2;
  return Math.ceil(res);
};
/**
 * --- subjective_valuation
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [teacher_id:10] => "0"
            4: (int) [value:3] => "0"
            5: (int) [semester:1] => "1"
            6: (int) [year:4] => "2024"
            7: (time) [time:10] => LDB_TIME
            8: (int) [subject_id:10] => "0"
 */
this.recapGetSubjectiveValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.subject_id==sid){
      res=d.value;
      break;
    }
  }return res;
};
/**
 * --- precense
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [class:2] => LDB_BLANK
            4: (int) [presence:5] => LDB_BLANK
            5: (string) [note:100] => LDB_BLANK
            6: (int) [date:2] => "1"
            7: (int) [month:2] => "0"
            8: (int) [year:4] => "2024"
            9: (time) [time:10] => LDB_TIME
            10: (int) [teacher_id:10] => "0"
            11: (int) [session:2] => "1"
 */
this.recapGetPrecense=function(tid,data){
  data=Array.isArray(data)?data:[];
  let res=0,
  count=0,
  weeks=24,
  tcount={
    55:{7:2,8:2,9:2,10:4,11:4,12:4},
    13:{7:1,8:1,9:1,10:0,11:2,12:3},
  },
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ];
  for(let d of data){
    if(d.teacher_id==tid){
      if(d.presence==1||d.presence==3){
        res+=1;
      }
      count++;
    }
  }
  return count>0?Math.ceil(res/count*100):0;
};
/**
 * 
    --- daily_valuation
            0: (aid) [id:10] => LDB_AID
            1: (int) [student_id:10] => "0"
            2: (int) [subject_id:10] => "0"
            3: (int) [value:10] => "0"
            4: (string) [date:10] => LDB_BLANK
            5: (time) [time:10] => LDB_TIME
            6: (string) [letter:10] => LDB_BLANK
 */
this.recapGetDailyValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0,count=0;
  for(let d of data){
    if(d.subject_id==sid){
      res+=parseInt(d.value,10);
      count++;
    }
  }return count>0?Math.ceil(res/count):0;
};
/**
 * 
    --- valuation
            0: (aid) [id:10] => LDB_AID
            1: (int) [student_id:10] => "0"
            2: (int) [subject_id:10] => "0"
            3: (int) [value:10] => "0"
            4: (string) [letter:100] => LDB_BLANK
            5: (time) [time:10] => LDB_TIME
 */
this.recapGetSemesterValue=function(sid,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.subject_id==sid){
      res=d.value;
      break;
    }
  }return res;
};
this.recapValue=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from class order by name asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  classes={
    7:[],
    8:[],
    9:[],
    10:[],
    11:[],
    12:[],
    27:[],
    28:[],
    29:[],
    30:[],
    31:[],
    32:[],
  },
  row=this.rowHead('REKAP NILAI AKADEMIK<br />Tahun Ajaran '
    +this.getStudyYear(),3),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  for(let stu of students){
    if(stu.hasOwnProperty('class')
      &&classes.hasOwnProperty(stu.class)){
      let dclass=stu.class;
      classes[dclass].push({
        id:stu.student_id,
        name:stu.name,
        class:stu.class,
      });
    }
  }
  let studyYear=this.getStudyYear().split('/');
  for(let cla in classes){
    row=this.row('Kelas '+cla);
    row.classList.add('tr-head');
    row.childNodes[0].setAttribute('colspan',3);
    row.childNodes[0].style.textAlign='center';
    table.append(row);
    for(let stu of classes[cla]){
      let see1=document.createElement('input'),
      see2=document.createElement('input');
      see1.type='button';
      see2.type='button';
      see1.classList.add('button-take');
      see2.classList.add('button-take');
      see1.value='Semester 1';
      see2.value='Semester 2';
      see1.dataset.id=''+stu.id;
      see1.dataset.name=stu.name;
      see1.dataset.semester='1';
      see1.dataset.year=''+studyYear[0];
      see1.dataset.class=''+stu.class;
      see2.dataset.id=''+stu.id;
      see2.dataset.name=stu.name;
      see2.dataset.semester='2';
      see2.dataset.year=''+studyYear[1];
      see2.dataset.class=''+stu.class;
      see1.onclick=function(){
        _PesantrianTeacher.recapValueStudent(
          this.dataset.id,
          this.dataset.name,
          this.dataset.semester,
          this.dataset.year,
          this.dataset.class
        );
      };
      see2.onclick=function(){
        _PesantrianTeacher.recapValueStudent(
          this.dataset.id,
          this.dataset.name,
          this.dataset.semester,
          this.dataset.year,
          this.dataset.class
        );
      };
      row=this.row(stu.name,see1,see2);
      table.append(row);
    }
  }
};


/* student spp */
this.studentSPP=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.headMasterStudents();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and '
      +this.queryTA(),
    'select * from scholarship where student_id='+data.id,
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  dclass=datas[2].length>0?parseInt(datas[2][0].class):12,
  maxPaid=datas[1].length>0?parseInt(datas[1][0].nominal):this.sppMax[dclass],
  total=0,
  lines,
  nominal,
  studyYear=this.getStudyYear().split('/'),
  title,
  row,
  table=this.table();
  loader.remove();
  /* finance - contribution - SPP */
  title='SPP<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,3);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Status');
  row.classList.add('tr-head');
  table.append(row);
  lines=datas[0];
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    status=nominal>=maxPaid?'Lunas':'-',
    tgl=this.getDateByMonth(monthName,lines);
    row=this.row(tgl,this.alias(monthName),status);
    table.append(row);
  }
  this.app.body.append(table);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.queryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  nyear=month<6?year-1:year+1;
  return [
    'year='+year, 
    'year='+nyear, 
  ].join(' or ');
};
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.getNominalByMonth=function(month,data){
  data=Array.isArray(data)?data:[];
  let res=0,
  studyYear=this.getStudyYear().split('/'),
  dyear=month<6?studyYear[1]:studyYear[0];
  for(let line of data){
    if(month==line.month&&line.year==dyear){
      res+=parseInt(line.nominal);
    }
  }
  return res;
};
this.getDateByMonth=function(month,data){
  data=Array.isArray(data)?data:[];
  let res='',
  studyYear=this.getStudyYear().split('/'),
  dyear=month<6?studyYear[1]:studyYear[0];
  for(let line of data){
    if(month==line.month&&line.year==dyear){
      res=_Pesantrian.parseDate(line.time*1000);
    }
  }
  return res;
};


/* academic_inventory */
this.tableInventory=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.headMaster();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from academic_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY AKADEMIK',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),'');
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem();
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from academic_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,'');
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};
this.addItem=function(){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory();
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "academic_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory();
      },1600);
    }
  };
};
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};


/* head master */
this.headMasterStudents=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.headMaster();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from class order by name asc',
  ].join(';'),
  row=this.rowHead('SPP SANTRI',4),
  table=this.table(),
  nomor=1,
  data=await _Pesantrian.request('queries',queries);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  for(let dclass of [...this.range(7,12),...this.range(27,32)]){
    row=this.row('KELAS '+dclass);
    row.childNodes[0].setAttribute('colspan',3);
    row.childNodes[0].style.padding='20px';
    row.classList.add('tr-head');
    row.dataset.class=''+dclass;
    row.onclick=function(){
      let rows=document.querySelectorAll('div.accordion');
      for(let i=0;i<rows.length;i++){
        if(rows[i].dataset.class==this.dataset.class
          &&rows[i].style.height=='0px'){
          rows[i].style.height=rows[i].dataset.height+'px';
        }else{
          rows[i].style.height='0px';
        }
      }
    };
    table.append(row);
    let div=document.createElement('div'),
    tbl=this.table();
    div.classList.add('accordion');
    div.append(tbl);
    div.dataset.class=''+dclass;
    div.dataset.item=''+dclass;
    row=this.row('No','Nama Santri','ID','SPP');
    row.classList.add('tr-head');
    tbl.append(row);
    nomor=1;
    for(let st of data[0]){
      if(st.class==dclass){
        let detail=document.createElement('input');
        detail.type='submit';
        detail.value='Buka';
        detail.classList.add('button-view');
        detail.dataset.id=st.student_id;
        detail.dataset.name=st.name;
        detail.onclick=function(){
          _PesantrianTeacher.studentSPP({
            id:this.dataset.id,
            name:this.dataset.name,
          });
        };
        row=this.row(nomor,st.name,st.student_id,detail);
        tbl.append(row);
        nomor++;
      }
    }
    row=this.row(div);
    row.childNodes[0].setAttribute('colspan',3);
    row.childNodes[0].style.padding='0px';
    table.append(row);
    div.dataset.height=div.offsetHeight;
    div.style.height='0px';
  }
};
this.headMaster=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile_id+' and class=97',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries);
  loader.remove();
  
  if(data[0].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert(
      'Akses ditolak!',
      'Anda tidak mempunyai akses ke sini.',
      'error');
    return;
  }
  
  let apps=[
    {
      name:'student',
      title:'SPP Santri',
      callback:function(e){
        _PesantrianTeacher.headMasterStudents();
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.app.body.append(adminApps);
  adminApps.show();
};


/* qrscanner -- presence */
this.presenceScanner=async function(session){
  session=session||1;
  let student=await _Pesantrian.scannerPageX();
    if(!student||student.id==0||student.table!='s'){
      return _Pesantrian.alert('Error: Invalid QRCode!','','error');
    }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    student_id=student.id,
    student_name=student.name,
    queries=[
      'select * from class where student_id='+student.id,
      'select * from presence where student_id='+student.id
        +' and year='+year+' and month='+month
        +' and date='+date+' and session='+session
        +'',
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    dclass=_Pesantrian.getValueByKey('student_id',student.id,'class',pdata[0]),
    data={
      name:student_name,
      student_id,
      teacher_id:_Pesantrian.user.profile.id,
      presence:1,
      note:'Hadir',
      date,
      month,
      year,
      session,
      class:dclass,
    },
    spInnerQuery=_Pesantrian.buildQuery({
      year,
      month,
      date,
      session,
      tid:_Pesantrian.user.profile_id,
      sid:student_id,
      pid:1,
    }),
    dpresence=_Pesantrian.getDataByKey('student_id',student.id,pdata[1]);  
    if(typeof dpresence==='object'&&dpresence!==null){
      loader.remove();
      let al=await _Pesantrian.alertX(
        data.name,
        'Sudah hadir di kelas '+data.class+' sesi ke '+data.session+' tanggal '+data.date,
        'info'
      );
      if(al){}
      return;
    }
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    queries2=[
      'insert into presence '+innerQuery,
      'insert into scan_presence '+spInnerQuery,
    ].join(';'),
    res=await _Pesantrian.request('queries',queries2);
    loader.remove();
    if(res.join('')==11){
      let al=await _Pesantrian.alertX(
        data.name,
        'Hadir di kelas '+data.class+' sesi ke '+data.session+' tanggal '+data.date,
        'success'
      );
      if(al){}
      return;
    }
    let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
    if(al){}
};
this.presenceScannerOld=async function(perm,session){
  session=session||1;
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return _Pesantrian.alert('Error: Has no camera access!','','error');
      }
      this.presenceScannerOld(true,session);
    });
    return;
  }
  let dialog=await _Pesantrian.dialogPage(),
  button=document.createElement('input'),
  video=document.createElement('video'),
  content=document.createElement('div');
  content.append(video);
  content.append(button);
  button.type='submit';
  button.value='Stop';
  button.onclick=function(){
    if(this.value=='Stop'){
      this.scanner.stop();
      this.value='Start';
    }else{
      this.scanner.start();
      this.value='Stop';
    }
  };
  dialog.blank();
  dialog.main.append(content);
  /* initiate scanner */
  button.scanner=new QrScanner(video,async result=>{
    button.scanner.stop();
    dialog.close();
    let student=_Pesantrian.qrcodeParse(result.data);
    if(!student||student.id==0){
      return _Pesantrian.alert('Error: Invalid QRCode!','','error');
    }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    data={
      name:student.name,
      student_id:student.id,
      teacher_id:_Pesantrian.user.profile.id,
      presence:1,
      note:'Hadir',
      date,
      month,
      year,
      session,
      class:dclass,
    },
    queries=[
      'select * from class where student_id='+student.id,
      'select * from presence where student_id='+student.id
        +' and year='+year+' and month='+month
        +' and date='+date+' and session='+session
        +'',
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    dclass=_Pesantrian.getValueByKey('student_id',student.id,'class',pdata[0]),
    dpresence=_Pesantrian.getDataByKey('student_id',student.id,pdata[1]);  
    if(typeof dpresence==='object'&&dpresence!==null){
      let al=await _Pesantrian.alertX(
        data.name,
        'Sudah hadir di kelas '+data.class+' sesi ke '+data.session+' tanggal '+data.date,
        'info'
      );
      if(al){}
      button.scanner.start();
      return;
    }
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into presence '+innerQuery,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    if(res==1){
      let al=await _Pesantrian.alertX(
        data.name,
        'Hadir di kelas '+data.class+' sesi ke '+data.session+' tanggal '+data.date,
        'success'
      );
      if(al){}
      return;
    }
    let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
    if(al){}
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  /* start scanning */
  button.scanner.start();
};
this.presenceScannerRoom=async function(session){
  session=session||this.getClassSession();
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  let date=(new Date).getDate(), 
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  title='QRScan<br />'+_Pesantrian.parseDate([
    year,
    (month+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  row=this.rowHead(title,2),
  table=this.table();
  table.append(row);
  row=this.row('Sesi','');
  table.append(row);
  row.classList.add('tr-head');
  /* session */
  let sess=document.createElement('div');
  sess.classList.add('sessions');
  for(let i=1;i<=7;i++){
    let opt=document.createElement('span');
    opt.dataset.session=i+'';
    opt.innerText=' '+i+' ';
    opt.classList.add('session');
    if(session==i){
      opt.classList.add('session-active');
    }else{
      opt.onclick=function(){
        _PesantrianTeacher.presenceScannerRoom(
          this.dataset.session
        );
      };
    }
    sess.append(opt);
  }
  row=this.row(sess);
  row.childNodes[0].setAttribute('colspan',2);
  table.append(row);
  /* button */
  button=document.createElement('input');
  button.type='submit';
  button.value='Scan';
  button.classList.add('button-take');
  button.onclick=()=>{
    this.presenceScanner(session);
  };
  /* row */
  row=this.row('Sesi '+session,button);
  table.append(row);
  this.app.body.append(table);
};

/* presence */
this.presenceRoom=function(){
  this.clearBody();
  /* inside apps */
  let classes=[..._Pesantrian.range(7,12),..._Pesantrian.range(27,32)],
  apps=[];
  for(let i=7;i<=32;i++){
    if(classes.indexOf(i)>=0){
      apps.push({
        name:'teacher2',
        title:'Kelas '+i,
        callback:function(e){
          _PesantrianTeacher.classPresence(i);
        }
      });
    }
  }
  /* inside apps */
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
};
this.classPresence=async function(dclass,date,session){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.presenceRoom(dclass);
    })
  );
  date=date?date:(new Date).getDate();
  session=session?session:this.getClassSession();
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ],
  queries=[
    'select * from class where class='+dclass
      +' ORDER BY name ASC',
    'select * from presence where class='+dclass
      +' and date='+date+' and month='+month+' and year='+year+' and session='+session,
    'select * from event where class='+dclass
      +' and month='+month+' and year='+year,
    'select id,name,position from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  presences=data[1],
  events=data[2],
  teachers=data[3],
  add=document.createElement('input'),
  title='ABSENSI<br />Kelas '+dclass+'<br />'
    +_Pesantrian.parseDate(year+'-'+(month+1)+'-'+date)
    +'<br />Sesi '+session,
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Santri','Kehadiran','Pengabsen');
  row.classList.add('tr-head');
  table.append(row);
  /* finder and date */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let sdate=document.createElement('select'),
  scabs=(year/4)===Math.ceil(year/4)?29:28,
  sdates=[31,scabs,31,30,31,30,31,31,30,31,30,31][month];
  for(let i of this.range(1,sdates)){
    let opt=document.createElement('option');
    opt.value=i+'';
    opt.textContent='Tanggal '+i;
    sdate.append(opt);
    if(date==i){
      opt.selected='selected';
    }
  }
  sdate.dataset.class=dclass;
  sdate.dataset.session=session;
  sdate.onchange=async function(){
    await _PesantrianTeacher.classPresence(
      this.dataset.class,
      this.value,
      this.dataset.session
    );
  };

  /* session */
  let sess=document.createElement('div');
  sess.classList.add('sessions');
  for(let i=1;i<=7;i++){
    let opt=document.createElement('span');
    opt.dataset.session=i+'';
    opt.dataset.date=date+'';
    opt.dataset.class=dclass+'';
    opt.innerText='Sesi '+i;
    opt.classList.add('session');
    if(session==i){
      opt.classList.add('session-active');
    }else{
      opt.onclick=function(){
        _PesantrianTeacher.classPresence(
          this.dataset.class,
          this.dataset.date,
          this.dataset.session
        );
      };
    }
    sess.append(opt);
  }
  row=this.row(sess);
  row.childNodes[0].setAttribute('colspan',4);
  table.append(row);
  /* apply to all */
  let attCount=0; 
  att=document.createElement('input');
  att.type='submit';
  att.value='Hadir Semua';
  att.classList.add('button-take');
  att.dataset.session=session;
  att.dataset.class=dclass;
  att.dataset.date=date;
  att.onclick=async function(){
    let sel=document.querySelectorAll('select.extra-high'),
    i=sel.length,
    qs=[];
    if(i==0){
      return _Pesantrian.alert('Semua sudah terabsen!','','info');
    }
    while(i--){
      if(sel[i].disabled){continue;}
      let student=_Pesantrian.parseJSON(sel[i].dataset.student),
      innerQuery=_Pesantrian.buildQuery({
        name:student.name,
        student_id:student.student_id,
        'class':this.dataset.class,
        presence:1,
        note:'Hadir',
        date:this.dataset.date,
        month:(new Date).getMonth(),
        year:(new Date).getFullYear(),
        teacher_id:_Pesantrian.user.profile_id,
        session:this.dataset.session,
      });
      qs.push('insert into presence '+innerQuery);
    }
    if(qs.length==0){
      return _Pesantrian.alert('Semua sudah terabsen!','','info');
    }
    let yes=await _Pesantrian.confirmX('Hadir semua?');
    if(!yes){return;}
    let loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',qs.join(';'));
    loader.remove();
    for(let i=0;i<sel.length;i++){
      if(sel[i].disabled){continue;}
      sel[i].parentNode.classList.add('extra-high');
      sel[i].parentNode.parentNode.childNodes[3].innerText=_Pesantrian.user.profile.name;
      sel[i].parentNode.innerText='Hadir';
    }
  };
  /* set the row */
  row=this.row('',find,sdate,att);
  table.append(row);
  
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  for(let student of students){
    let sen=this.getStudentPresence(student.student_id,presences);
    if(sen!==false){
      let pre=sen.note,
      prer=this.getName(sen.teacher_id,teachers);
      row=this.row(student.student_id,student.name,pre,prer);
      row.dataset.name=student.name;
      row.childNodes[2].classList.add('extra-high');
      table.append(row);
      continue;
    }
    let pre=document.createElement('select'),
    opt=document.createElement('option');
    opt.value='';
    opt.textContent='---PRESET---';
    pre.append(opt);
    pre.classList.add('extra-high');
    for(let reason of reasons){
      opt=document.createElement('option');
      opt.value=reason;
      opt.textContent=reason;
      pre.append(opt);
    }
    pre.dataset.reasons=JSON.stringify(reasons);
    pre.dataset.student=JSON.stringify(student);
    pre.dataset.teachers=JSON.stringify(teachers);
    pre.dataset.date=date+'';
    pre.onchange=async function(){
      let reason='Unknown',
      reasons=_Pesantrian.parseJSON(this.dataset.reasons),
      student=_Pesantrian.parseJSON(this.dataset.student),
      teachers=_Pesantrian.parseJSON(this.dataset.teachers),
      tname=_PesantrianTeacher.getName(
          _Pesantrian.user.profile_id,
          teachers
        ),
      date=this.dataset.date,
      month=(new Date).getMonth(),
      year=(new Date).getFullYear(),
      key=reasons.indexOf(this.value);
      if(key>=0){
        reason=reasons[key];
      }
      let yes=await _Pesantrian.confirmX('Konfirmasi Kehadiran!',
        'Bahwa '+student.name+' --> '+reason);
      if(!yes){
        this.value='';
        return;
      }
      let innerQuery=_Pesantrian.buildQuery({
        name:student.name,
        student_id:student.student_id,
        'class':student.class,
        presence:key,
        note:reason,
        date:date,
        month:month,
        year:year,
        teacher_id:_Pesantrian.user.profile_id,
        session:session,
      }),
      loader=_Pesantrian.loader(),
      query='insert into presence '+innerQuery,
      res=await _Pesantrian.request('query',query);
      loader.remove();
      this.disabled=true;
      this.prer.innerText=tname;
    };
    row=this.row(student.student_id,student.name,pre,'');
    row.dataset.name=student.name;
    pre.prer=row.childNodes[3];
    table.append(row);
    attCount++;
  }
  if(attCount==0){
    att.style.display='none';
  }
  
  this.app.body.append(table);
  
};
this.getStudentPresence=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.student_id==id){
      res=i;
      break;
    }
  }return res;
};
/* output as string */
this.getClassSession=function(){
  let date=new Date(),
  res=1,
  dtime=parseInt(date.getHours()+''+date.getMinutes());
  for(let key in this.sessions){
    if(dtime>=this.sessions[key][0]
      &&dtime<=this.sessions[key][1]){
      res=key;
      break;
    }
  }
  return res;
};


/* subject subjective valuation */
this.subjectiveValuation=async function(subject){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.subjectTeacher();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  yearStudy=this.yearStudy(),
  semester=month<6?2:1,
  queries=[
    'select * from class where class='+subject.class
      +' ORDER BY name ASC',
    'select * from subjective_valuation where subject_id='+subject.id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  valuations=data[1],
  nomor=1,
  add=document.createElement('input'),
  title='NILAI SUBJECTIF GURU'
    +'<br />Pelajaran '+subject.name
    +'<br />Kelas '+subject.class
    +'<br />Semester '+subject.semester
    +'<br />Tahun Ajaran '+subject.year,
  val,save,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('NO','Nama Santri','Nilai','PL','');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
  for(let student of students){
    val=document.createElement('input');
    val.type='number';
    val.id='input-'+student.student_id;
    val.placeholder='Nilai...';
    val.dataset.student_id=student.student_id;
    val.style.maxWidth='50px';
    val.onkeyup=function(){
      let el=document.getElementById('student-'+this.dataset.student_id);
      if(el){
        el.innerText=_PesantrianTeacher.getLetterValue(this.value);
      }
    };
    save=document.createElement('input');
    save.dataset.subject_id=subject.id;
    save.dataset.student_id=student.student_id;
    save.dataset.teacher_id=subject.teacher_id;
    save.dataset.semester=subject.semester;
    save.dataset.year=subject.semester==1
      ?''+subject.year.split('/')[0]
      :''+subject.year.split('/')[1];
    save.dataset.subject=JSON.stringify(subject);
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.onclick=async function(){
      this.value='Saving...';
      this.disabled=true;
      let el=document.getElementById('input-'+this.dataset.student_id),
      vletter=_PesantrianTeacher.getLetterValue(el.value),
      isUpdate=this.dataset.hasOwnProperty('vid')
        ?this.dataset.vid:false,
      tdata={
        student_id:this.dataset.student_id,
        subject_id:this.dataset.subject_id,
        teacher_id:this.dataset.teacher_id,
        value:el.value,
        semester:this.dataset.semester,
        year:this.dataset.year,
      },
      subject=_Pesantrian.parseJSON(this.dataset.subject),
      innerQuery=_Pesantrian.buildQuery(tdata),
      query=isUpdate
        ?'update subjective_valuation ('+innerQuery+') where id='+isUpdate
        :'insert into subjective_valuation '+innerQuery,
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(!isUpdate){
        _PesantrianTeacher.subjectiveValuation(subject);
        return;
      }
      this.value='Save';
      this.disabled=false;
    };
    
    let sval=this.getStudentValue(student.student_id,valuations);
    if(sval!==false){
      val.value=sval.value;
      save.dataset.vid=sval.id;
    }
    row=this.row(nomor,student.name,val,'',save);
    row.childNodes[3].id='student-'+student.student_id;
    if(sval!==false){
      row.childNodes[3].innerText=this.getLetterValue(sval.value);
    }
    table.append(row);
    nomor++;
  }
  
};
/* subject daily valuation */
this.subjectValueDaily=async function(subject,tgl){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.subjectTeacher();
    })
  );
  tgl=tgl||[
    (new Date).getFullYear(),
    ((new Date).getMonth()+1).toString().padStart(2,'0'),
    (new Date).getDate().toString().padStart(2,'0'),
  ].join('-');
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  yearStudy=this.yearStudy(),
  semester=month<6?2:1,
  queries=[
    'select * from class where class='+subject.class
      +' ORDER BY name ASC',
    'select * from daily_valuation where subject_id='+subject.id+' and date="'+tgl+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  valuations=data[1],
  nomor=1,
  add=document.createElement('input'),
  date=document.createElement('input'),
  title='UJIAN HARIAN'
    +'<br />Pelajaran '+subject.name
    +'<br />Kelas '+subject.class
    +'<br />Tanggal ',
  div=document.createElement('div'),
  val,save,
  row=this.rowHead(div,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('NO','Nama Santri','Nilai','PL','');
  row.classList.add('tr-head');
  table.append(row);
  date.type='date';
  date.name='date';
  date.id='date';
  date.value=tgl;
  date.style.width='150px';
  date.dataset.subject=subject;
  date.onchange=async function(){
    await _PesantrianTeacher.subjectValueDaily(subject,this.value);
  };
  div.innerHTML=title;
  div.append(date);
  
  for(let student of students){
    val=document.createElement('input');
    val.type='number';
    val.id='input-'+student.student_id;
    val.placeholder='Nilai...';
    val.dataset.student_id=student.student_id;
    val.style.maxWidth='50px';
    val.onkeyup=function(){
      let el=document.getElementById('student-'+this.dataset.student_id);
      if(el){
        el.innerText=_PesantrianTeacher.getLetterValue(this.value);
      }
    };
    save=document.createElement('input');
    save.dataset.subject_id=subject.id;
    save.dataset.student_id=student.student_id;
    save.dataset.subject=JSON.stringify(subject);
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.onclick=async function(){
      this.value='Saving...';
      this.disabled=true;
      let el=document.getElementById('input-'+this.dataset.student_id),
      date=document.getElementById('date'),
      vletter=_PesantrianTeacher.getLetterValue(el.value),
      isUpdate=this.dataset.hasOwnProperty('vid')
        ?this.dataset.vid:false,
      tdata={
        student_id:this.dataset.student_id,
        subject_id:this.dataset.subject_id,
        value:el.value,
        letter:vletter,
        date:date.value,
      },
      subject=_Pesantrian.parseJSON(this.dataset.subject),
      innerQuery=_Pesantrian.buildQuery(tdata),
      query=isUpdate
        ?'update daily_valuation ('+innerQuery+') where id='+isUpdate
        :'insert into daily_valuation '+innerQuery,
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(!isUpdate){
        _PesantrianTeacher.subjectValue(subject);
        return;
      }
      this.value='Save';
      this.disabled=false;
    };
    
    let sval=this.getStudentValue(student.student_id,valuations);
    if(sval!==false){
      val.value=sval.value;
      save.dataset.vid=sval.id;
    }
    row=this.row(nomor,student.name,val,'',save);
    row.childNodes[3].id='student-'+student.student_id;
    if(sval!==false){
      row.childNodes[3].innerText=this.getLetterValue(sval.value);
    }
    table.append(row);
    nomor++;
  }
  
  this.app.body.append(table);
};
/* subject semester valuation */
this.subjectValue=async function(subject){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.subjectTeacher();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  yearStudy=this.yearStudy(),
  semester=month<6?2:1,
  queries=[
    'select * from class where class='+subject.class
      +' ORDER BY name ASC',
    'select * from valuation where subject_id='+subject.id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  valuations=data[1],
  nomor=1,
  add=document.createElement('input'),
  title='UJIAN AKHIR SEMESTER'
    +'<br />Pelajaran '+subject.name
    +'<br />Kelas '+subject.class
    +'<br />Semester '+subject.semester
    +'<br />Tahun Ajaran '+subject.year
    +'<br />KKM '+subject.min_criteria,
  val,save,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('NO','Nama Santri','Nilai','PL','');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
  for(let student of students){
    val=document.createElement('input');
    val.type='number';
    val.id='input-'+student.student_id;
    val.placeholder='Nilai...';
    val.dataset.student_id=student.student_id;
    val.style.maxWidth='50px';
    val.onkeyup=function(){
      let el=document.getElementById('student-'+this.dataset.student_id);
      if(el){
        el.innerText=_PesantrianTeacher.getLetterValue(this.value);
      }
    };
    save=document.createElement('input');
    save.dataset.subject_id=subject.id;
    save.dataset.student_id=student.student_id;
    save.dataset.subject=JSON.stringify(subject);
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.onclick=async function(){
      this.value='Saving...';
      this.disabled=true;
      let el=document.getElementById('input-'+this.dataset.student_id),
      vletter=_PesantrianTeacher.getLetterValue(el.value),
      isUpdate=this.dataset.hasOwnProperty('vid')
        ?this.dataset.vid:false,
      tdata={
        student_id:this.dataset.student_id,
        subject_id:this.dataset.subject_id,
        value:el.value,
        letter:vletter,
      },
      subject=_Pesantrian.parseJSON(this.dataset.subject),
      innerQuery=_Pesantrian.buildQuery(tdata),
      query=isUpdate
        ?'update valuation ('+innerQuery+') where id='+isUpdate
        :'insert into valuation '+innerQuery,
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(!isUpdate){
        _PesantrianTeacher.subjectValue(subject);
        return;
      }
      this.value='Save';
      this.disabled=false;
    };
    
    let sval=this.getStudentValue(student.student_id,valuations);
    if(sval!==false){
      val.value=sval.value;
      save.dataset.vid=sval.id;
    }
    row=this.row(nomor,student.name,val,'',save);
    row.childNodes[3].id='student-'+student.student_id;
    if(sval!==false){
      row.childNodes[3].innerText=this.getLetterValue(sval.value);
    }
    table.append(row);
    nomor++;
  }
  
};

this.subjectTeacher=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  yearStudy=this.yearStudy(),
  semester=month<6?2:1,
  query=_Pesantrian.user.privilege>=8
    ?'select * from subject where class > 6'
    :'select * from subject where teacher_id='
      +_Pesantrian.user.profile_id,
  queries=[
      query
      +' and semester='+semester
      +' and year="'+yearStudy+'"'
      +' ORDER BY class ASC',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  subjects=data[0],
  add=document.createElement('input'),
  title='MATA PELAJARAN'
    +'<br />Semester '+semester
    +'<br />Tahun Ajaran '+yearStudy,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kelas','Pelajaran','KKM','Nilai Ujian');
  row.classList.add('tr-head');
  row.childNodes[3].setAttribute('colspan',3);
  row.childNodes[3].style.textAlign='center';
  table.append(row);
  
  for(let subject of subjects){
    /* uas */
    let see=document.createElement('input');
    see.classList.add('button-view');
    see.classList.add('extra-high');
    see.type='submit';
    see.value='UAS';
    see.dataset.data=JSON.stringify(subject);
    see.onclick=function(){
      _PesantrianTeacher.subjectValue(
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    /* daily */
    let sed=document.createElement('input');
    sed.classList.add('button-add');
    sed.classList.add('extra-high');
    sed.type='submit';
    sed.value='Harian';
    sed.dataset.data=JSON.stringify(subject);
    sed.onclick=function(){
      _PesantrianTeacher.subjectValueDaily(
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    /* subjective */
    let sub=document.createElement('input');
    sub.classList.add('button-detail');
    sub.classList.add('extra-high');
    sub.type='submit';
    sub.value='Subjektif';
    sub.dataset.data=JSON.stringify(subject);
    sub.onclick=function(){
      _PesantrianTeacher.subjectiveValuation(
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    
    
    /* row */
    row=this.row(subject.class,subject.name,subject.min_criteria,see,sed,sub);
    table.append(row);
  }
  
  this.app.body.append(table);
};
this.yearStudy=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=month<6?[year-1,year]:[year,year+1];
  return res.join('/');
};
this.getStudentValue=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.student_id==id){
      res=i;
      break;
    }
  }return res;
};
this.getLetterValue=function(value){
  let letter={
    A:this.range(86,100),
    B:this.range(70,85),
    C:this.range(0,69),
  },
  res='C';
  for(let k in letter){
    if(letter[k].indexOf(parseInt(value))>=0){
      res=k;
      break;
    }
  }return res;
};

/* room teacher */
this.classInventory=async function(dclass){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.classRoom(dclass);
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from class_inventory where class='+dclass,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('CLASS INVENTORY<br />Kelas '+dclass,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.classAddItem(dclass);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.dataset.class=''+item.class;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from class_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
  
};
this.classAddItem=function(dclass){
  this.clearBody();
  let lines=this.classTemplateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.classInventory(dclass);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.class=dclass;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "class_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.classInventory(dclass);
      },1600);
    }
  };
};
this.classTemplateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};
this.classRoom=function(dclass){
  this.clearBody();
  
  /* inside apps */
  let apps=[
    {
      name:'inventory',
      title:'Inventory',
      callback:function(e){
        _PesantrianTeacher.classInventory(dclass);
      }
    }
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.roomTeacher();
    })
  );
};
this.roomTeacher=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  privilege=parseInt(_Pesantrian.user.privilege)+1,
  queries=[
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile_id
      +' order by class asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries);
  loader.remove();
  
  let classes=[],apps=[];
  if(_Pesantrian.user.privilege>=8){
    classes=this.range(7,12);
  }else{
    for(let line of data[0]){
      classes.push(line.class);
    }
  }
  
  if(classes.length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert(
      'Akses ditolak!',
      'Anda tidak mempunyai akses ke sini.',
      'error');
    return;
  }
  
  for(let i=7;i<=12;i++){
    if(classes.indexOf(i)>=0){
      apps.push({
        name:'teacher',
        title:'Kelas '+i,
        callback:function(e){
          _PesantrianTeacher.classRoom(i);
        }
      });
    }
  }
  
  /* inside apps */
  let adminApps=_Pesantrian.buildApps(apps);
  this.app.body.append(adminApps);
  adminApps.show();
  
};

/* extracurricular */
this.addExtracurricular=function(student){
  this.clearBody();
  let event=this.templateExtracurricular(),
  row,val,
  hidden=['month','year','name'],
  table=this.table();
  
  for(let key in event){
    let value=event[key];
    val=document.createElement('input');
    val.name=key;
    val.value=value;
    val.placeholder=this.alias(key)+'...';
    val.type='text';
    val.classList.add('extra-high');
    if(hidden.indexOf(key)>=0){
      val.type='hidden';
      this.app.body.append(val);
      continue;
    }else if(key=='student_id'){
      val=_Pesantrian.findSelect({
        id:'select-id',
        data:student,
        key:'student_id',
        value:'',
        placeholder:'Nama Santri...',
        callback:function(r){
          let sname=document.querySelector('input[name="name"]');
          if(sname){
            sname.value=r.name;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
    }else if(key=='ex_name'){
      val=document.createElement('select');
      val.name=key;
      for(let ex_name of this.eskulNames){
        let opt=document.createElement('option');
        opt.value=ex_name;
        opt.textContent=ex_name;
        val.append(opt);
        if(ex_name==value){
          opt.selected='selected';
        }
      }
    }else if(key=='presence'){
      val=_Pesantrian.radioPresence(value);
    }else if(key=='class'||key=='value'){
      val.type='number';
    }
    row=this.row(this.alias(key),val);
    if(key=='presence'||key=='ex_name'){
      row.childNodes[1].classList.add('extra-high');
    }
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "extracurricular" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableExtracurricular();
      },1600);
    }
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableExtracurricular();
    })
  );
};
this.tableExtracurricular=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from extracurricular where month='+month+' and year='+year+' ORDER BY ex_name',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile_id+' and class=99',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  student=data[0],
  events=data[1],
  add=document.createElement('input'),
  title='Extracurricular<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  if(data[2].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert(
      'Akses ditolak!',
      'Anda tidak mempunyai akses ke sini.',
      'error');
    return;
  }
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addExtracurricular(student);
  };
  row=this.row('ID','Nama Santri','Eskul','Hadir','Nilai',add);
  row.classList.add('tr-head');
  table.append(row);
  
  for(let ex of events){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+ex.id;
    del.dataset.name=''+ex.name;
    del.dataset.ex_name=''+ex.ex_name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus Perlombaan?',
        this.dataset.ex_name+' - '+this.dataset.name,
        async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from extracurricular where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    let pres=document.createElement('span');
    pres.classList.add('gender');
    pres.classList.add('gender-'+(ex.presence?'1':'0'));
    pres.innerText=ex.presence?'Hadir':'Tidak';
    row=this.row(ex.student_id,ex.name,ex.ex_name,pres,ex.value,del);
    row.id='item-'+ex.id;
    table.append(row);
  }
  this.app.body.append(table);
};
this.templateExtracurricular=function(){
  return {
    name:'',
    student_id:0,
    'class':7,
    ex_name:'',
    value:0,
    presence:0,
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  };
};

/* event */
this.addEvent=function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEvent();
    })
  );
  let event=this.templateEvent(),
  row,val,
  hidden=['month','year','name'],
  table=this.table();
  
  for(let key in event){
    let value=event[key];
    val=document.createElement('input');
    val.name=key;
    val.value=value;
    val.placeholder=this.alias(key)+'...';
    val.type='text';
    val.classList.add('extra-high');
    if(hidden.indexOf(key)>=0){
      val.type='hidden';
      this.app.body.append(val);
      continue;
    }else if(key=='student_id'){
      val=_Pesantrian.findSelect({
        id:'select-id',
        data:student,
        key:'student_id',
        value:'',
        placeholder:'Nama Santri...',
        callback:function(r){
          let sname=document.querySelector('input[name="name"]');
          if(sname){
            sname.value=r.name;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
    }else if(key=='class'){
      val.type='number';
    }else if(key=='date'){
      val.type='date';
    }else if(key=='note'){
      val=document.createElement('textarea');
      val.name=key;
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.setAttribute('rows','3');
    }
    
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "event" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableEvent();
      },1600);
    }
  };
};
this.tableEvent=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from event where month='+month+' and year='+year,
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile_id+' and class=98',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  student=data[0],
  events=data[1],
  add=document.createElement('input'),
  title='EVENT DAN PERLOMBAAN<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,8),
  table=this.table();
  loader.remove();
  if(data[2].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert(
      'Akses ditolak!',
      'Anda tidak mempunyai akses ke sini.',
      'error');
    return;
  }
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addEvent(student);
  };
  row=this.row('ID','Nama Santri','Kelas','Perlombaan','Penyelengara','Tanggal','Ketetangan',add);
  row.classList.add('tr-head');
  table.append(row);
  
  for(let event of events){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+event.id;
    del.dataset.name=''+event.name;
    del.dataset.event_name=''+event.event_name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus Perlombaan?',
        this.dataset.event_name+' - '+this.dataset.name,
        async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from event where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(event.id,event.name,event.class,event.event_name,event.event_org,_Pesantrian.parseDate(event.date),event.note,del);
    row.id='item-'+event.id;
    table.append(row);
  }
  this.app.body.append(table);
};
this.templateEvent=function(){
  return {
    name:'',
    student_id:0,
    'class':7,
    event_name:'',
    event_org:'',
    date:[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
    note:'',
  };
};

/* inner */
this.getName=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i.name;
      break;
    }
  }return res;
};
this.range=function(s,t){
  s=s?s:0;
  t=t?Math.max(s,t):0;
  let r=[];
  for(let i=s;i<=t;i++){
    r.push(i);
  }return r;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianTahfidz */
;function PesantrianTahfidz(app){
this.app=app;
this.aliasData={
  juz_total:'Jumlah Juz',
  memorize_total:'Jumlah Hafalan',
  memorize_target:'Target Hafalan',
  tajwid:'Tajwid',
  tahsin:'Tahsin',
  note:'Catatan',
  catatan:'Catatan',
  siklus_haid:'Siklus Haid',
  berat_badan:'Berat Badan',
  tinggi_badan:'Tinggi Badan',
  sakit:'Sakit bulan ini',
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
  date:'Tanggal',
  hour:'Jam',
  back_date:'Tanggal Kembali',
  back_hour:'Jam Kembali',
  long:'Lama Izin (hari)',
  status:'Status',
  penalty:'Sanksi',
  type:'Jenis Izin',
  student_id:'Nama Santri',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.yearly=[
  6,7,8,9,10,11,
  0,1,2,3,4,5,
];
this.dorm={
  buildings:['MARWAH','ARAFAH','SHOFA','HANZHALAH','UMAIR'],
  rooms:[
    [1,2,3,4,5,6],
    [1,2,3,4,5,6],
    [1,2,3,4,5,6],
    [1,2],
    [1,2],
  ],
  restRooms:[
    ['SEMANGGI','LAVENDER','ROSELLA','EDELWIS','ASTER','ALAMANDA','AZALEA'],
    ['CAMELIA','GARDENIA','DAISY','KAMBOJA','COSMOS','AGERATUM','ANYELIR'],
    ['SEULANGA','JEUMPA','KENANGA','FLAMBOYAN','LILY','ANGGREK','MAWAR','MELATI','CEMPAKA','ASOKA','VIOLET','TERATAI','SAKURA','DAHLIA','RAFLESIA'],
    ['SUMATERA','JAWA','SULAWESI','KALIMANTAN','HALMAHERA'],
    ['SUMATERA','JAWA','SULAWESI','KALIMANTAN','HALMAHERA'],
  ],
  bcode:{
    MARWAH:81,
    ARAFAH:82,
    SHOFA:83,
    HANZHALAH:84,
    UMAIR:85,
  },
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.studyMonths=[6,7,8,9,10,11,0,1,2,3,4,5];


this.sessions={
  "1":[0,7],
  "2":[7,15],
  "3":[15,18],
  "4":[18,23],
};


this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'group',
      title:'Halaqah',
      callback:function(e){
        _PesantrianTahfidz.tableTeam();
      }
    },
    {
      name:'form2',
      title:'Rekap',
      callback:function(e){
        _PesantrianTahfidz.recapValue();
      }
    },
    {
      name:'form',
      title:'Absensi',
      callback:function(e){
        _PesantrianTahfidz.teamPresence();
      }
    },
    {
      name:'form5',
      title:'Semester',
      callback:function(e){
        _PesantrianTahfidz.semesterTeamForm();
      }
    },
    {
      name:'form4',
      title:'Subjektif',
      callback:function(e){
        _PesantrianTahfidz.subjectiveTeamForm();
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianTahfidz.presenceScanner();
      }
    },
    {
      name:'form6',
      title:'Rekap Kehadiran',
      callback:function(e){
        _PesantrianTahfidz.presenceRecap();
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianTahfidz=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};


/* presence recap */
this.presenceRecap=async function(month,year,classed){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  let tdef=_Pesantrian.user.privilege>=8
    ?9:_Pesantrian.user.profile_id;
  /* month and year and table */
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  classed=classed||tdef;
  /* pull data */
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from tahfidz_presence where year='+year
      +' and month='+month+'',
    'select id,name,position from employee where position="tahfidz"',
    'select * from tahfidz_team order by name asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  kdate=year==Math.floor(year/4)?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  table=this.table(),
  row=this.rowHead('REKAP KEHADIRAN',kmonth[month]+2),
  classesx=[],
  classes=[classed],
  sessions=_Pesantrian.range(1,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* classesx */
  for(let em of data[1]){
    classesx.push(em.id);
  }
  /* selector */
  let smonth=document.createElement('select'),
  studyYear=this.yearStudy().split('/');
  for(let mon of this.studyMonths){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon]+' '
      +(mon>5?studyYear[0]:studyYear[1]);
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  smonth.dataset.studyYear=this.yearStudy();
  smonth.dataset.classed=classed;
  smonth.onchange=function(){
    let studyYear=this.dataset.studyYear.split('/'),
    dmonth=parseInt(this.value),
    dyear=parseInt(dmonth>5?studyYear[0]:studyYear[1]);
    _PesantrianTahfidz.presenceRecap(
      dmonth,
      dyear,
      this.dataset.classed
    );
  };
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',kmonth[month]+1);
  table.append(row);
  /* classed selector */
  let sclass=document.createElement('select');
  for(let dclass of classesx){
    let opt=document.createElement('option'),
    musy=_Pesantrian.getValueByKey('id',dclass,'name',data[1]);
    opt.value=dclass;
    opt.textContent=musy+' #'+dclass;
    if(dclass==classed){
      opt.selected='selected';
    }
    sclass.append(opt);
  }
  sclass.style.color='#fff';
  sclass.dataset.year=year;
  sclass.dataset.month=month;
  sclass.onchange=function(){
    let dmonth=parseInt(this.dataset.month),
    dyear=parseInt(this.dataset.year);
    _PesantrianTahfidz.presenceRecap(dmonth,dyear,this.value);
  };
  
  
  /* each student by classes */
  for(let dclass of classes){
    /* header */
    let students=_Pesantrian.getDataByKey('teacher_id',dclass,data[2],true),
    row=this.row.apply(this,[
      _Pesantrian.user.privilege>=8?sclass:'#'+dclass,
      'Tgl',
      ..._Pesantrian.range(1,kmonth[month]),
    ]);
    row.classList.add('tr-head');
    table.append(row);
    /* students */
    for(let student of students){
      let studentPresence=_Pesantrian.getDataByKey(
        'student_id',
        student.student_id,
        data[0],
        true
      );
      for(let session of sessions){
        let presence=this.presenceRecapGetStudentPresence(
          session,
          kmonth[month],
          studentPresence,
          data[1],
        ),
        trow=session==1?[
          student.name,
          session,
          ...presence,
        ]:[
          session,
          ...presence,
        ],
        row=this.row.apply(this,trow);
        table.append(row);
        if(session==1){
          row.childNodes[0].setAttribute('rowspan',sessions.length);
        }
      }
      row=this.row('');
      row.childNodes[0].setAttribute('colspan',kmonth[month]+2);
      table.append(row);
    }
  }
  /* OBJECT tahfidz_team
                id: 139
                name: ARYA SUTEDJA
                student_id: 113
                teacher_id: 50
                time: 1721957742
  */
};
this.presenceRecapGetStudentPresence=function(session,kdate,data=[],teachers=[]){
  let res=[],
  spresence=_Pesantrian.getDataByKey('session',session,data,true);
  for(let date of _Pesantrian.range(1,kdate)){
    let div=document.createElement('div'),
    span=document.createElement('span'),
    presence=_Pesantrian.getDataByKey('date',date,spresence),
    teacher=presence
      ?_Pesantrian.getDataByKey('id',presence.teacher_id,teachers)
      :false;
    div.classList.add('presence-note');
    span.classList.add('presence-teacher');
    div.innerText=presence?presence.note:'';
    span.innerText=teacher?teacher.name:'';
    if(teacher){
      div.append(span);
      div.span=span;
      div.onclick=function(){
        if(this.span.classList.contains('presence-teacher-show')){
          this.span.classList.remove('presence-teacher-show');
        }else{
          this.span.classList.add('presence-teacher-show');
        }
      };
    }
    res.push(div);
  }
  return res;
  /* OBJECT tahfidz_presence
                id: 13
                name: SALLY SABILA KANZHA
                student_id: 54
                teacher_id: 41
                presence: 1
                note: Hadir
                date: 19
                month: 1
                year: 2024
                time: 1708310563
                session: 1
  */
};
this.yearStudy=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=month<6?[year-1,year]:[year,year+1];
  return res.join('/');
};


/* semester valuation team */
this.semesterTeamForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear().split('/'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_team'
      :'select * from tahfidz_team where teacher_id='+uid,
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_valuation_plus where type="semester"'
        +' and syear="'+this.getStudyYear()+'"'
      :'select * from tahfidz_valuation_plus where type="semester" and teacher_id='+uid
        +' and syear="'+this.getStudyYear()+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  values=data[1],
  row=this.rowHead('NILAI UJIAN SEMESTER TAHFIZH<br />Tahun Ajaran '
    +this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  row=this.row('Nama Santri','Semester 1','Semester 2','');
  row.classList.add('tr-head');
  table.append(row);
  for(let stu of students){
    let sem1=document.createElement('input'),
    sem2=document.createElement('input'),
    save=document.createElement('input'),
    val1=this.subjectiveGetValue(stu.student_id,1,values),
    val2=this.subjectiveGetValue(stu.student_id,2,values);
    sem1.type='text';
    sem1.value=val1!=false?''+val1.value:'0';
    sem1.dataset.isUpdate=val1!=false?val1.id:'0';
    sem1.id='semester1-'+stu.student_id;
    sem2.type='text';
    sem2.value=val2!=false?''+val2.value:'0';
    sem2.dataset.isUpdate=val2!=false?val2.id:'0';
    sem2.id='semester2-'+stu.student_id;
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.dataset.id=''+stu.student_id;
    save.dataset.name=stu.name;
    save.dataset.tid=''+uid;
    save.dataset.syear=this.getStudyYear();
    save.onclick=async function(){
      let sem1=document.getElementById('semester1-'+this.dataset.id),
      sem2=document.getElementById('semester2-'+this.dataset.id),
      update1=sem1.dataset.isUpdate!='0'?sem1.dataset.isUpdate:false,
      update2=sem2.dataset.isUpdate!='0'?sem2.dataset.isUpdate:false,
      syear=this.dataset.syear.split('/'),
      tdata1={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem1.value,
        semester:1,
        year:syear[0],
        type:'semester',
        syear:this.dataset.syear,
      },
      tdata2={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem2.value,
        semester:2,
        year:syear[1],
        type:'semester',
        syear:this.dataset.syear,
      },
      queries=[
        update1
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata1)+') where id='+update1
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata1),
        update2
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata2)+') where id='+update2
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata2),
      ].join(';'),
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('queries',queries);
      this.disabled=true;
      this.value='Saving...';
      await _PesantrianTahfidz.semesterTeamForm();
    };
    row=this.row(stu.name,sem1,sem2,save);
    table.append(row);
  }

};
this.semesterGetValue=function(sid,semester,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let d of data){
    if(d.student_id==sid&&d.semester==semester){
      res=d;
      break;
    }
  }return res;
};


/* subjective valuation team */
this.subjectiveTeamForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear().split('/'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_team'
      :'select * from tahfidz_team where teacher_id='+uid,
      _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_valuation_plus where type="subjective"'
        +' and syear="'+this.getStudyYear()+'"'
      :'select * from tahfidz_valuation_plus where type="subjective" and teacher_id='+uid
        +' and syear="'+this.getStudyYear()+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  values=data[1],
  row=this.rowHead('NILAI SUBJEKTIF TAHFIZH<br />Tahun Ajaran '
    +this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  row=this.row('Nama Santri','Semester 1','Semester 2','');
  row.classList.add('tr-head');
  table.append(row);
  for(let stu of students){
    let sem1=document.createElement('input'),
    sem2=document.createElement('input'),
    save=document.createElement('input'),
    val1=this.subjectiveGetValue(stu.student_id,1,values),
    val2=this.subjectiveGetValue(stu.student_id,2,values);
    sem1.type='text';
    sem1.value=val1!==false?''+val1.value:'0';
    sem1.dataset.isUpdate=val1!==false?val1.id:'0';
    sem1.id='semester1-'+stu.student_id;
    sem2.type='text';
    sem2.value=val2!==false?''+val2.value:'0';
    sem2.dataset.isUpdate=val2!==false?val2.id:'0';
    sem2.id='semester2-'+stu.student_id;
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.dataset.id=''+stu.student_id;
    save.dataset.name=stu.name;
    save.dataset.tid=''+uid;
    save.dataset.syear=this.getStudyYear();
    save.onclick=async function(){
      let sem1=document.getElementById('semester1-'+this.dataset.id),
      sem2=document.getElementById('semester2-'+this.dataset.id),
      update1=sem1.dataset.isUpdate!='0'?sem1.dataset.isUpdate:false,
      update2=sem2.dataset.isUpdate!='0'?sem2.dataset.isUpdate:false,
      syear=this.dataset.syear.split('/'),
      loader=_Pesantrian.loader(),
      tdata1={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem1.value,
        semester:1,
        year:syear[0],
        type:'subjective',
        syear:this.dataset.syear,
      },
      tdata2={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem2.value,
        semester:2,
        year:syear[1],
        type:'subjective',
        syear:this.dataset.syear,
      },
      queries=[
        update1
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata1)+') where id='+update1
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata1),
        update2
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata2)+') where id='+update2
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata2),
      ].join(';'),
      res=await _Pesantrian.request('queries',queries);
      this.disabled=true;
      this.value='Saving...';
      await _PesantrianTahfidz.subjectiveTeamForm();
    };
    row=this.row(stu.name,sem1,sem2,save);
    table.append(row);
  }

};
this.subjectiveGetValue=function(sid,semester,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let d of data){
    if(d.student_id==sid&&d.semester==semester){
      res=d;
      break;
    }
  }return res;
};


/* recap value */
this.recapValue=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear().split('/'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_team'
      :'select * from tahfidz_team where teacher_id='+uid,
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_presence'
      :'select * from tahfidz_presence where teacher_id='+uid,
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_valuation_plus'
        +' where syear="'+this.getStudyYear()+'"'
      :'select * from tahfidz_valuation_plus where teacher_id='+uid
        +' and syear="'+this.getStudyYear()+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  precenses=data[1],
  values=data[2],
  row=this.rowHead('REKAP NILAI TAHFIZH<br />Tahun Ajaran '
    +this.getStudyYear(),9),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  row=this.row('Nama Santri','Semester 1','Semester 2');
  row.childNodes[0].setAttribute('rowspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  row.childNodes[2].setAttribute('colspan',4);
  row.classList.add('tr-head');
  table.append(row);
  row=this.row(
    'Nilai Kumulatif',
    'Nilai Ujian (50%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjektif (20%)',
    'Nilai Kumulatif',
    'Nilai Ujian (50%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjektif (20%)',
  );
  row.classList.add('tr-head');
  table.append(row);
  console.log(precenses);

  for(let stu of students){
    let vals={
      1:[],
      2:[],
    };
    for(let sem of [1,2]){
      let dyear=sem==1?studyYear[0]:studyYear[1],
      nis=this.recapGetSemesterValue(stu.student_id,sem,dyear,values),
      nix=this.recapGetSubjectiveValue(stu.student_id,sem,dyear,values),
      nip=this.recapGetPrecense(stu.student_id,sem,dyear,precenses);
      vals[sem].push(
        this.recapGetCumulativeValue(nis,nip,nix)
      );
      vals[sem].push(nis);
      vals[sem].push(nip);
      vals[sem].push(nix);
    }
    row=this.row(
      stu.name,
      vals[1][0],
      vals[1][1],
      vals[1][2],
      vals[1][3],
      vals[2][0],
      vals[2][1],
      vals[2][2],
      vals[2][3]
    );
    row.childNodes[1].classList.add('td-head');
    row.childNodes[5].classList.add('td-head');
    table.append(row);
  }
  
};
this.recapGetCumulativeValue=function(nis,nip,nix){
  nis=nis||0;
  nip=nip||0;
  nix=nix||0;
  let res=0;
  res+=parseInt(nis)*0.5;
  res+=parseInt(nip)*0.3;
  res+=parseInt(nix)*0.2;
  return Math.ceil(res);
};
/**
 * --- tahfidz_valuation_plus
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [teacher_id:10] => "0"
            4: (int) [value:3] => "0"
            5: (int) [semester:1] => "1"
            6: (int) [year:4] => "2024"
            7: (string) [type:100] => LDB_BLANK --- semester/subjective/--juz1-30
            8: (time) [time:10] => LDB_TIME
            9: (string) [syear:100] => LDB_BLANK

 */
this.recapGetSemesterValue=function(sid,semester,year,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.type=='semester'
      &&d.student_id==sid
      &&d.year==year
      &&d.semester==semester){
      res=d.value;
      break;
    }
  }return res;
};
this.recapGetSubjectiveValue=function(sid,semester,year,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.type=='subjective'
      &&d.student_id==sid
      &&d.year==year
      &&d.semester==semester){
      res=d.value;
      break;
    }
  }return res;
};
/**
 * --- tahfidz_presence
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [teacher_id:10] => "0"
            4: (int) [presence:5] => LDB_BLANK
            5: (string) [note:100] => LDB_BLANK
            6: (int) [date:2] => "1"
            7: (int) [month:2] => "0"
            8: (int) [year:4] => "2024"
            9: (time) [time:10] => LDB_TIME
            10: (int) [session:2] => "1"
 */
this.recapGetPrecense=function(sid,semester,year,data){
  data=Array.isArray(data)?data:[];
  let res=0,
  count=0,
  months=semester==1?[6,7,8,9,10,11]:[0,1,2,3,4,5],
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ];
  for(let d of data){
    if(d.student_id==sid&&d.year==year&&months.indexOf(d.month)>=0){
      if(d.presence==1||d.presence==3){
        res+=1;
      }
      count++;
    }
  }
  return count>0?Math.ceil(res/count*100):0;
};


/* permission */
this.tablePermission=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear(),
  queries=[
    'select * from permission where '+this.getStudyYearQuery()
      +' order by id desc',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class=96',
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries);
  loader.remove();
  if(datas[1].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai hak akses ke fitur ini.','error');
    return;
  }
  let row=this.rowHead('PERIZINAN<br />Tahun Ajaran '+studyYear,5),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  row=this.row('NO','Nama Santri','Tanggal Izin','Tanggal Kembali','');
  row.classList.add('tr-head');
  table.append(row);
  let add=document.createElement('input');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.permissionDetail(datas[2]);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','',add);
  table.append(row);
  for(let perm of datas[0]){
    let date=_Pesantrian.parseDatetime(perm.date+' '+perm.hour),
    bdate=_Pesantrian.parseDatetime(perm.back_date+' '+perm.back_hour),
    detail=document.createElement('input');
    detail.classList.add('button-detail');
    detail.type='submit';
    detail.value='Detail';
    detail.dataset.data=JSON.stringify(perm);
    detail.dataset.students=JSON.stringify(datas[2]);
    detail.onclick=function(){
      _PesantrianTahfidz.permissionDetail(
        _Pesantrian.parseJSON(this.dataset.students),
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    row=this.row(perm.id,perm.name,date,bdate,detail);
    row.dataset.name=perm.name;
    table.append(row);
  }
};
this.permissionDetail=function(students,data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.tablePermission();
    })
  );
  students=students||[];
  data=data||this.templatePermission();
  let id=data.hasOwnProperty('id')?data.id:null,
  passes=['id','time'],
  hidden=['name'],
  types={
    date:'date',
    back_date:'date',
    hour:'time',
    back_hour:'time',
    long:'number',
  },
  row,table=this.table();
  this.app.body.append(table);
  let selects={
    type:[
      'Sakit',
      'Keluarga inti meninggal',
      'Keluarga inti sakit',
      'Pengurusan dokumen',
      'Pendidikan',
    ],
    status:[
      'Belum kembali',
      'Tepat waktu',
      'Terlambat',
    ],
  };
  for(let key in data){
    let value=data[key],
    alias=this.alias(key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }
    if(hidden.indexOf(key)>=0){
      val=document.createElement('input');
      val.type='hidden';
      val.name=key;
      val.value=value;
      this.app.body.append(val);
      continue;
    }
    if(key=='student_id'){
      val=_Pesantrian.findSelect({
        id:'select-id',
        data:students,
        key:key,
        value:value,
        placeholder:'Nama Santri...',
        callback:function(r){
          let sname=document.querySelector('input[name="name"]');
          if(sname){
            sname.value=r.name;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
    }else if(selects.hasOwnProperty(key)){
      val=document.createElement('select');
      val.name=key;
      for(let iv of selects[key]){
        let opt=document.createElement('option');
        opt.value=iv;
        opt.textContent=iv;
        if(iv==value){
          opt.selected='selected';
        }
        val.append(opt);
      }
      val.classList.add('extra-high');
    }else{
      val=document.createElement('input');
      val.type=types.hasOwnProperty(key)?types[key]:'text';
      val.name=key;
      val.value=value;
      val.placeholder=alias+'...';
      val.classList.add('extra-high');
    }
    row=this.row(alias,val);
    table.append(row);
  }
  
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=id
      ?'update permission ('+innerQuery+') where id='+id
      :'insert into "permission" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tablePermission();
      },1600);
    }
  };
};
this.templatePermission=function(){
  return {
    name:'',
    student_id:0,
    date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    long:0,
    type:'Sakit',
    back_date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    back_hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    note:'',
    status:'Belum kembali',
    penalty:'',
  };
};
this.getStudyYearQuery=function(){
  let studyYear=this.getStudyYear().split('/'),
  one=Math.floor(new Date(studyYear[0]+'-07-01').getTime()/1000),
  two=Math.floor(new Date(studyYear[1]+'-06-30').getTime()/1000),
  res=[
    'time > '+one,
    'time < '+two,
  ];
  return res.join(' and ');
};
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};

/* tahfidz_inventory */
this.addItemT=function(tid){
  this.clearBody();
  let lines=this.templateItemT(),
  row=this.rowHead('INPUT BARANG<br />TID: '+tid,2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventoryT(tid);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.teacher_id=tid;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "tahfidz_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventoryT(tid);
      },1600);
    }
  };
};
this.tableInventoryT=async function(tid){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableTeam();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from tahfidz_inventory where teacher_id='+tid,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY TAHFIZH<br />TID: '+tid,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),'TID',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItemT(tid);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from tahfidz_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,item.teacher_id,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  this.app.body.append(table);
};
this.templateItemT=function(tid){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

/* qrscanner -- tahfidz_presence */
this.presenceScanner=async function(){
  let student=await _Pesantrian.scannerPageX();
    if(!student||student.id==0||student.table!='s'){
      return _Pesantrian.alert('Error: Invalid QRCode!','','error');
    }
    let loader=_Pesantrian.loader(),
    student_id=student.id,
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    session=this.getTahfidzSession(),
    squery='select * from tahfidz_presence where student_id='
      +student_id
      +' and year='+year
      +' and month='+month
      +' and date='+date
      +' and session='+session,
    sel=await _Pesantrian.request('query',squery);
    if(sel.length>0){
      loader.remove();
      let note=sel[0].note,
      sesi=sel[0].session;
      _Pesantrian.alert(
        student_name,
        'Sudah dinyatakan '+note+' di sesi ke '+sesi,
        'info'
      );
      return;
    }
    let data={
      name:student_name,
      student_id:student_id,
      teacher_id:_Pesantrian.user.profile.id,
      presence:1,
      note:'Hadir',
      date,
      month,
      year,
      session,
    },
    spInnerQuery=_Pesantrian.buildQuery({
      year,
      month,
      date,
      session,
      tid:_Pesantrian.user.profile_id,
      sid:student_id,
      pid:2,
    }),
    innerQuery=_Pesantrian.buildQuery(data),
    queries=[
      'insert into tahfidz_presence '+innerQuery,
      'insert into scan_presence '+spInnerQuery,
    ].join(';'),
    res=await _Pesantrian.request('queries',queries);
    loader.remove();
    if(res.join('')==11){
      let al=await _Pesantrian.alertX(data.name,'Hadir di sesi ke '+data.session,'success');
      if(al){}
      return;
    }
    let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
    if(al){}
};
this.presenceScannerOld=async function(perm){
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return _Pesantrian.alert('Error: Has no camera access!','','error');
      }
      this.presenceScannerOld(true);
    });
    return;
  }
  let dialog=await _Pesantrian.dialogPage(),
  button=document.createElement('input'),
  video=document.createElement('video'),
  content=document.createElement('div');
  content.append(video);
  content.append(button);
  button.type='submit';
  button.value='Stop';
  button.onclick=function(){
    if(this.value=='Stop'){
      this.scanner.stop();
      this.value='Start';
    }else{
      this.scanner.start();
      this.value='Stop';
    }
  };
  dialog.blank();
  dialog.main.append(content);
  /* initiate scanner */
  button.scanner=new QrScanner(video,async result=>{
    button.scanner.stop();
    dialog.close();
    let student=_Pesantrian.qrcodeParse(result.data);
    if(!student||student.id==0){
      return _Pesantrian.alert('Error: Invalid QRCode!','','error');
    }
    let loader=_Pesantrian.loader(),
    data={
      name:student.name,
      student_id:student.id,
      teacher_id:_Pesantrian.user.profile.id,
      presence:1,
      note:'Hadir',
      date:(new Date).getDate(),
      month:(new Date).getMonth(),
      year:(new Date).getFullYear(),
      session:this.getTahfidzSession(),
    },
    innerQuery=_Pesantrian.buildQuery(data),
    query='insert into tahfidz_presence '+innerQuery,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    if(res==1){
      let al=await _Pesantrian.alertX(data.name,'Hadir di sesi ke '+data.session,'success');
      if(al){}
      return;
    }
    let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
    if(al){}
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  /* start scanning */
  button.scanner.start();
};

/* tahfidz_presence */
this.teamPresence=async function(date,session){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  if(_Pesantrian.user.profile.position!='tahfidz'
    &&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak memiliki akses ke sini.','error');
    return;
  }
  date=date?date:(new Date).getDate();
  session=session?session:this.getTahfidzSession();
  let loader=_Pesantrian.loader(),
  tid=_Pesantrian.user.profile_id,
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ],
  tquery=_Pesantrian.user.privilege>=8
    ?'select * from tahfidz_team ORDER BY name ASC'
    :'select * from tahfidz_team where teacher_id='+tid
      +' ORDER BY name ASC',
  pquery=_Pesantrian.user.privilege>=8
    ?'select * from tahfidz_presence where date='+date
      +' and month='+month+' and year='+year
      +' and session='+session
    :'select * from tahfidz_presence where teacher_id='+tid
      +' and date='+date+' and month='+month+' and year='+year
      +' and session='+session,
  queries=[
    tquery,
    pquery,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  presences=data[1],
  add=document.createElement('input'),
  title='ABSENSI HALAQAH<br />TID '+tid+'<br />'
    +_Pesantrian.parseDate(year+'-'+(month+1)+'-'+date)
    +'<br />Sesi '+session,
  row=this.rowHead(title,3),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Santri','Kehadiran');
  row.classList.add('tr-head');
  table.append(row);
  /* finder and date */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let sdate=document.createElement('select'),
  scabs=(year/4)===Math.ceil(year/4)?29:28,
  sdates=[31,scabs,31,30,31,30,31,31,30,31,30,31][month];
  for(let i of this.range(1,sdates)){
    let opt=document.createElement('option');
    opt.value=i+'';
    opt.textContent='Tanggal '+i;
    sdate.append(opt);
    if(date==i){
      opt.selected='selected';
    }
  }
  sdate.dataset.session=session;
  sdate.onchange=async function(){
    await _PesantrianTahfidz.teamPresence(this.value,this.dataset.session);
  };
  row=this.row('',find,sdate);
  table.append(row);
  /* session */
  let sess=document.createElement('select');
  for(let i in this.sessions){
    let opt=document.createElement('option');
    opt.textContent='Sesi '+i;
    opt.value=i;
    if(i==session){
      opt.selected='selected';
    }
    sess.append(opt);
  }
  sess.classList.add('extra-high');
  sess.dataset.date=date;
  sess.onchange=async function(){
    await _PesantrianTahfidz.teamPresence(this.dataset.date,this.value);
  };
  row=this.row('','',sess);
  table.append(row);
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  for(let student of students){
    let sen=this.getStudentPresence(student.student_id,presences);
    if(sen!==false){
      let pre=sen.note;
      row=this.row(student.student_id,student.name,pre);
      row.dataset.name=student.name;
      row.childNodes[2].classList.add('extra-high');
      table.append(row);
      continue;
    }
    let pre=document.createElement('select'),
    opt=document.createElement('option');
    opt.value='';
    opt.textContent='---PRESET---';
    pre.append(opt);
    pre.classList.add('extra-high');
    for(let reason of reasons){
      opt=document.createElement('option');
      opt.value=reason;
      opt.textContent=reason;
      pre.append(opt);
    }
    pre.dataset.reasons=JSON.stringify(reasons);
    pre.dataset.student=JSON.stringify(student);
    pre.dataset.date=date+'';
    pre.onchange=async function(){
      let reason='Unknown',
      reasons=_Pesantrian.parseJSON(this.dataset.reasons),
      student=_Pesantrian.parseJSON(this.dataset.student),
      date=this.dataset.date,
      month=(new Date).getMonth(),
      year=(new Date).getFullYear(),
      key=reasons.indexOf(this.value);
      if(key>=0){
        reason=reasons[key];
      }
      let yes=await _Pesantrian.confirmX('Konfirmasi Kehadiran!',
        'Bahwa '+student.name+' --> '+reason);
      if(!yes){
        this.value='';
        return;
      }
      let innerQuery=_Pesantrian.buildQuery({
        name:student.name,
        student_id:student.student_id,
        teacher_id:student.teacher_id,
        presence:key,
        note:reason,
        date:date,
        month:month,
        year:year,
        session:session,
      }),
      loader=_Pesantrian.loader(),
      query='insert into tahfidz_presence '+innerQuery,
      res=await _Pesantrian.request('query',query);
      loader.remove();
      this.disabled=true;
    };
    row=this.row(student.student_id,student.name,pre);
    row.dataset.name=student.name;
    table.append(row);
  }
  
  this.app.body.append(table);
  
};
this.getStudentPresence=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.student_id==id){
      res=i;
      break;
    }
  }return res;
};
/* output as string */
this.getTahfidzSession=function(){
  let date=new Date(),
  res=1,
  dhour=date.getHours();
  for(let key in this.sessions){
    if(dhour>=this.sessions[key][0]
      &&dhour<=this.sessions[key][1]){
      res=key;
      break;
    }
  }
  return res;
};

/* rest room */
this.getBuildingFromRestroom=function(restroom){
  restroom=typeof restroom==='string'?restroom:'LONELY';
  let res='KABAH';
  for(let rr in this.dorm.restRooms){
    if(this.dorm.restRooms[rr].indexOf(restroom)>=0){
      res=this.dorm.buildings[rr];
      break;
    }
  }
  return res;
};
this.tableDormRestRoomMember=async function(restroom){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormRestRoom();
    })
  );
  let loader=_Pesantrian.loader(),
  back=document.createElement('input'),
  uid=_Pesantrian.user.profile_id,
  building=this.getBuildingFromRestroom(restroom),
  bcode=this.dorm.bcode.hasOwnProperty(building)
    ?this.dorm.bcode[building]:0,
  queries=[
    'select * from dorm where rest_room="'+restroom+'"',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class='+bcode,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nomor=1,
  title='KAMAR MANDI '+restroom,
  row=this.rowHead(title,3),
  table=this.table();
  loader.remove();
  if(data[1].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai akses ke gedung ini.','error');
    return;
  }
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    this.tableDormRestRoom();
  };
  row=this.row('NO','Nama Santri',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let line of data[0]){
    row=this.row(nomor,line.name);
    row.childNodes[1].setAttribute('colspan',2);
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
};
this.tableDormRestRoom=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let back=document.createElement('input'),
  nomor=1,
  row,
  table;
  for(let key in this.dorm.buildings){
    let building=this.dorm.buildings[key],
    restRooms=this.dorm.restRooms[key];
    table=this.table();
    row=this.rowHead('GEDUNG '+building,3);
    table.append(row);
    /* rest-room */
    row=this.row('','','');
    table.append(row);
    row=this.row('NO','Nama Kamar Mandi','');
    row.classList.add('tr-head');
    table.append(row);
    nomor=1;
    for(let rroom of restRooms){
      let see=document.createElement('input');
      see.type='submit';
      see.value='Lihat';
      see.classList.add('button-view');
      see.classList.add('extra-high');
      see.dataset.restroom=rroom;
      see.onclick=function(){
        _PesantrianTahfidz.tableDormRestRoomMember(
          this.dataset.restroom
        );
      };
      row=this.row(nomor,rroom,see);
      table.append(row);
      nomor++;
    }
    this.app.body.append(table);
  }
};

/* dorm */
this.tableDormValue=async function(id,name,month,year,building,room){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormYearly(id,name,building,room);
    })
  );
  let monthThis=(new Date).getMonth(),
  yearThis=(new Date).getFullYear(),
  back=document.createElement('input'),
  row=this.rowHead(name+'<br />Bulan '+this.month[month]+'<br />Tahun Ajaran '+year,1),
  table=this.table(),
  yearly=year.split('/'),
  yearlyValue=month<6?yearly[1]:yearly[0],
  isUpdate=false,
  passes=['id','time'],
  hidden=['student_id','teacher_id','month','year'],
  drop=['akhlaq','kebersihan','pelanggaran','apresiasi'],
  tid=_Pesantrian.user.id,
  query='select * from dorm_value where student_id='+id
    +' and month='+month+' and year='+yearlyValue,
  loader=_Pesantrian.loader(),
  data=await _Pesantrian.request('query',query),
  values=this.dormValueTemplate(id);
  values.month=month;
  values.year=yearlyValue;
  loader.remove();
  if(data.length>0){
    values=data[0];
    isUpdate=true;
  }
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableDormYearly(id,name,building,room);
  };
  row=this.row(back);
  table.append(row);
  this.app.body.append(table);
  /* hidden */
  for(let key in values){
    let value=values[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let val=document.createElement('input');
      val.type='hidden';
      val.name=key;
      val.value=value;
      this.app.body.append(val);
      continue;
    }
  }
  /* data - parse */
  let dataDrop=_Pesantrian.parseJSON(values.data);
  for(let drp of drop){
    table=this.table();
    row=this.rowHead(drp.toUpperCase(),4);
    table.append(row);
    table.id='table-'+drp;
    let nomor=1;
    let add=document.createElement('input');
    add.type='submit';
    add.value='Tambah';
    add.classList.add('button-add');
    add.dataset.drop=drp;
    add.dataset.nomor=nomor+'';
    add.onclick=function(){
      let tbl=document.getElementById('table-'+this.dataset.drop),
      date=[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0')
        ].join('-'),
      nomor=parseInt(this.dataset.nomor),
      rw=_PesantrianTahfidz.addValueData('','',
        this.dataset.drop,nomor);
      if(['pelanggaran','apresiasi'].indexOf(drp)>=0){
        rw=_PesantrianTahfidz.addValueData('','',
          this.dataset.drop,nomor,date);
      }
      tbl.append(rw);
      this.dataset.nomor=(nomor+1)+'';
    };
    let kname='Aspek Peniaian',
    vname='Nilai';
    if(drp=='pelanggaran'){
      kname='Jenis Pelanggaran';
      vname='Point';
      row=this.row(kname,vname,'Tanggal',add);
    }else if(drp=='apresiasi'){
      kname='Jenis Tindakan';
      vname='Point';
      row=this.row(kname,vname,'Tanggal',add);
    }else{
      row=this.row(kname,vname,'Huruf',add);
    }
    row.classList.add('tr-head');
    table.append(row);
    for(let key in dataDrop[drp]){
      let value=dataDrop[drp][key];
      if(['pelanggaran','apresiasi'].indexOf(drp)>=0){
        row=this.addValueData(value.key,value.value,drp,nomor,value.date);
      }else{
        row=this.addValueData(value.key,value.value,drp,nomor);
      }
      table.append(row);
      add.dataset.nomor=(nomor+1)+'';
      nomor++;
    }
    this.app.body.append(table);
  }
  /* data */
  table=this.table();
  for(let key in dataDrop){
    let value=dataDrop[key],
    val=value;
    if(drop.indexOf(key)>=0){
      continue;
    }else if(key=='catatan'){
      val=document.createElement('textarea');
      val.name='data['+key+']';
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.setAttribute('rows',3);
      val.classList.add('extra-high');
    }else{
      val=document.createElement('input');
      val.type='text';
      val.name='data['+key+']';
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.classList.add('extra-high');
    }
    if(key=='note'){
      row=this.row(this.alias(key),val);
      table.append(row);
      row.childNodes[1].setAttribute('colspan',2);
    }else{
      row=this.row(this.alias(key),val,'');
      table.append(row);
    }
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let dorm_value_id=isUpdate&&values.hasOwnProperty('id')
    ?values.id:null;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    if(isUpdate){
      delete data.id;
      delete data.time;
      delete data.student_id;
      delete data.teacher_id;
      delete data.month;
      delete data.year;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=isUpdate
      ?'update dorm_value ('+innerQuery+') where id='
        +dorm_value_id
      :'insert into "dorm_value" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableDormYearly(id,name,building,room);
      },1600);
    }
  };
};
this.tableDormYearly=async function(id,name,building,room){
  this.clearBody();
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  back=document.createElement('input'),
  row='',
  table=this.table(),
  studyYear=[year,year+1].join('/');
  if(month<6){
    studyYear=[year-1,year].join('/');
  }
  row=this.rowHead(name+'<br />TAHUN AJARAN '+studyYear,2);
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableDorm(building,room);
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDorm(building,room);
    })
  );
  row=this.row('Bulan',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let mon of this.yearly){
    let val=document.createElement('input');
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=id;
    val.dataset.name=name;
    val.dataset.month=mon;
    val.dataset.year=studyYear;
    val.dataset.building=building;
    val.dataset.room=room;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianTahfidz.tableDormValue(
        this.dataset.id,
        this.dataset.name,
        this.dataset.month,
        this.dataset.year,
        this.dataset.building,
        this.dataset.room
      );
    };
    let tyear=studyYear.split('/'),
    vyear=mon<6?tyear[1]:tyear[0];
    row=this.row(this.month[mon]+' '+vyear,val);
    table.append(row);
  }
  this.app.body.append(table);
};
this.tableDorm=async function(building,room){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormBuilding();
    })
  );
  let loader=_Pesantrian.loader(),
  bcode=this.dorm.bcode[building],
  back=document.createElement('input'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from dorm where building_name="'+building+'"'
    +' and room_name="'+room+'"',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class='+bcode,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nomor=1,
  add=document.createElement('input'),
  title='ASRAMA '+building+' '+room,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  if(data[2].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai akses ke gedung ini.','error');
    return;
  }
  table.append(row);
  row=this.row('NO','Nama Santri','Kamar Mandi',add,back);
  row.classList.add('tr-head');
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    this.tableDormBuilding();
  };
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    let aid='add-member',
    ael=document.getElementById(aid),
    table=document.getElementById('table-team'),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:data[0],
      key:'student_id',
      value:'',
      placeholder:'Nama Santri...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    srest=document.createElement('select'),
    sname=document.createElement('input'),
    ssave=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      form.teacher_id=_Pesantrian.user.profile_id;
      form.building_name=building;
      form.room_name=room;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into dorm '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await _PesantrianTahfidz.tableDorm(building,room);
        },1600);
      }
    };
    let restIndex=_PesantrianTahfidz
      .dorm.buildings.indexOf(building),
    restRooms=_PesantrianTahfidz.dorm.restRooms[restIndex];
    for(let rroom of restRooms){
      let opt=document.createElement('option');
      opt.value=rroom;
      opt.textContent=rroom;
      srest.append(opt);
    }
    srest.name='rest_room';
    row=_Pesantrian.row(sname,sid,srest,'',ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  /* */
  for(let line of data[1]){
    let div=document.createElement('div'),
    del=document.createElement('input'),
    val=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=line.id;
    del.dataset.name=line.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from dorm where id='+id;
      _Pesantrian.confirm('Hapus anggota ruangan?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=line.student_id;
    val.dataset.name=line.name;
    val.dataset.building=building;
    val.dataset.room=room;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianTahfidz.tableDormYearly(
        this.dataset.id,
        this.dataset.name,
        this.dataset.building,
        this.dataset.room
      );
    };
    row=this.row(nomor,line.name,line.rest_room,del,val);
    row.id=line.id;
    table.append(row);
    nomor++;
  }
  table.id='table-team';
  this.app.body.append(table);
};
this.tableDormBuilding=async function(){
  this.clearBody();
  let back=document.createElement('input'),
  nomor=1,
  row,
  table;
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  for(let key in this.dorm.buildings){
    let building=this.dorm.buildings[key],
    restRooms=this.dorm.restRooms[key];
    table=this.table();
    row=this.rowHead('GEDUNG '+building,3);
    table.append(row);
    let inopen=document.createElement('input');
    inopen.classList.add('button-add');
    inopen.classList.add('extra-high');
    inopen.type='submit';
    inopen.value='Inventory';
    inopen.dataset.building=building;
    inopen.onclick=function(){
      _PesantrianTahfidz.tableInventory(this.dataset.building);
    };
    row=this.row('NO','Nama Ruangan',inopen);
    row.classList.add('tr-head');
    table.append(row);
    for(let num of this.dorm.rooms[key]){
      let see=document.createElement('input');
      see.type='submit';
      see.value='Buka';
      see.classList.add('button-view');
      see.classList.add('extra-high');
      see.dataset.building=building;
      see.dataset.room=num;
      see.onclick=function(){
        _PesantrianTahfidz.tableDorm(
          this.dataset.building,
          this.dataset.room
        );
      };
      row=this.row(num,building+' '+num,see);
      table.append(row);
    }
    this.app.body.append(table);
  }
};

/* dorm_inventory*/
this.addItem=function(building){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG<br />GEDUNG '+building,2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory(building);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.building=building;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "dorm_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory(building);
      },1600);
    }
  };
};
this.tableInventory=async function(building){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormBuilding();
    })
  );
  let loader=_Pesantrian.loader(),
  bcode=this.dorm.bcode[building],
  queries=[
    'select * from dorm_inventory where building="'+building+'"',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class='+bcode,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY ASRAMA<br />GEDUNG '+building,5),
  table=this.table();
  loader.remove();
  if(data[1].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai akses ke gedung ini.','error');
    return;
  }
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem(building);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from drom_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  this.app.body.append(table);
};
this.templateItem=function(building){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

/* team halaqah */
this.tableValue=async function(id,name,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableYearly(id,name);
    })
  );
  let monthThis=(new Date).getMonth(),
  yearThis=(new Date).getFullYear(),
  back=document.createElement('input'),
  row=this.rowHead(name+'<br />Bulan '+this.month[month]+'<br />Tahun Ajaran '+year,3),
  table=this.table(),
  yearly=year.split('/'),
  yearlyValue=month<6?yearly[1]:yearly[0],
  isUpdate=false,
  passes=['id','time'],
  hidden=['student_id','teacher_id','month','year'],
  tid=_Pesantrian.user.id,
  query='select * from tahfidz where student_id='+id
    +' and month='+month+' and year='+yearlyValue,
  loader=_Pesantrian.loader(),
  data=await _Pesantrian.request('query',query),
  values=this.tahfidzTemplate(id);
  values.month=month;
  values.year=yearlyValue;
  loader.remove();
  if(data.length>0){
    values=data[0];
    isUpdate=true;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableYearly(id,name);
  };
  row=this.row('Aspek Peniaian','Nilai',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let key in values){
    let value=values[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let val=document.createElement('input');
      val.type='hidden';
      val.name=key;
      val.value=value;
      this.app.body.append(val);
      continue;
    }else if(key=='note'){
      val=document.createElement('textarea');
      val.name=key;
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.setAttribute('rows',3);
      val.classList.add('extra-high');
    }else{
      val=document.createElement('input');
      val.type='number';
      val.name=key;
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.classList.add('extra-high');
    }
    if(key=='note'){
      row=this.row(this.alias(key),val);
      table.append(row);
      row.childNodes[1].setAttribute('colspan',2);
    }else{
      row=this.row(this.alias(key),val,'');
      table.append(row);
    }
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let tahfidz_id=isUpdate&&values.hasOwnProperty('id')?values.id:null;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(isUpdate){
      delete data.id;
      delete data.time;
      delete data.student_id;
      delete data.teacher_id;
      delete data.month;
      delete data.year;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=isUpdate
      ?'update tahfidz ('+innerQuery+') where id='+tahfidz_id
      :'insert into "tahfidz" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableYearly(id,name);
      },1600);
    }
  };
};
this.tableYearly=async function(id,name){
  this.clearBody();
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  back=document.createElement('input'),
  row='',
  table=this.table(),
  studyYear=[year,year+1].join('/');
  if(month<6){
    studyYear=[year-1,year].join('/');
  }
  row=this.rowHead(name+'<br />TAHUN AJARAN '+studyYear,2);
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableTeam();
  };
  row=this.row('Bulan',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let mon of this.yearly){
    let val=document.createElement('input');
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=id;
    val.dataset.name=name;
    val.dataset.month=mon;
    val.dataset.year=studyYear;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianTahfidz.tableValue(
        this.dataset.id,
        this.dataset.name,
        this.dataset.month,
        this.dataset.year
      );
    };
    let tyear=studyYear.split('/'),
    vyear=mon<6?tyear[1]:tyear[0];
    row=this.row(this.month[mon]+' '+vyear,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableTeam();
    })
  );
};
this.tableTeam=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  back=document.createElement('input'),
  uid=_Pesantrian.user.profile_id,
  ugender=_Pesantrian.user.profile.gender,
  squery=
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
  query=_Pesantrian.user.privilege>=8
    ?'select * from tahfidz_team'
    :'select * from tahfidz_team where teacher_id='+uid,
  tquery='select id,name from employee',
  queries=[
    squery,
    query,
    tquery,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nomor=1,
  add=document.createElement('input'),
  row=this.rowHead('HALAQAH',_Pesantrian.user.privilege>=8?5:4),
  table=this.table();
  loader.remove();
  table.append(row);
  if(false){
    alert(_Pesantrian.parser.likeJSON(data[1],3));
  }
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    let aid='add-member',
    ael=document.getElementById(aid),
    table=document.getElementById('table-team'),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:data[0],
      key:'student_id',
      value:'',
      placeholder:'Nama Santri...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    sname=document.createElement('input'),
    ssave=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      form.teacher_id=_Pesantrian.user.profile_id;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into tahfidz_team '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await _PesantrianTahfidz.tableTeam();
        },1600);
      }
    };
    row=_Pesantrian.row(sname,sid,'',ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  back.type='submit';
  back.value='Inventory';
  back.classList.add('button-detail');
  back.onclick=async ()=>{
    await this.tableInventoryT(uid);
  };
  if(_Pesantrian.user.privilege>=8){
    row=this.row('NO','Nama Santri','Musyrif/ah',add,back);
  }else{
    row=this.row('NO','Nama Santri',add,back);
  }
  row.classList.add('tr-head');
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let tfind=document.createElement('input');
  tfind.classList.add('kitchen-find');
  tfind.type='text';
  tfind.placeholder='Cari...';
  tfind.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-teacher]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.teacher.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  if(_Pesantrian.user.privilege>=8){
    row=this.row('',find,tfind,'','');
  }else{
    row=this.row('',find,'','');
  }
  table.append(row);
  for(let line of data[1]){
    let div=document.createElement('div'),
    del=document.createElement('input'),
    val=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=line.id;
    del.dataset.name=line.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from tahfidz_team where id='+id;
      _Pesantrian.confirm('Hapus anggota halaqah?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=line.student_id;
    val.dataset.name=line.name;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianTahfidz.tableYearly(
        this.dataset.id,
        this.dataset.name
      );
    };
    if(_Pesantrian.user.privilege>=8){
      let tname=_Pesantrian.getValueByKey(
        'id',
        line.teacher_id,
        'name',
        data[2],
      );
      row=this.row(nomor,line.name,tname,del,val);
      row.dataset.teacher=tname;
    }else{
      row=this.row(nomor,line.name,del,val);
    }
    row.id=line.id;
    row.dataset.name=line.name;
    table.append(row);
    nomor++;
  }
  table.id='table-team';
  this.app.body.append(table);
};

/* inner */
this.range=function(s,t){
  s=s?s:0;
  t=t?Math.max(s,t):0;
  let r=[];
  for(let i=s;i<=t;i++){
    r.push(i);
  }return r;
};
this.addValueData=function(key,value,drop,nomor,date){
  let del=document.createElement('input');
  del.type='submit';
  del.value='Hapus';
  del.classList.add('button-delete');
  del.dataset.drop=drop;
  del.dataset.nomor=nomor;
  del.onclick=function(){
    let el=document.getElementById('row-'
      +this.dataset.drop+'-'
      +this.dataset.nomor);
    if(el){el.remove();}
  };
  let val=document.createElement('input');
  val.type='text';
  val.value=value;
  val.name='data['+drop+']['+nomor+'][value]';
  val.dataset.id='letter-'+drop+'-'+nomor;
  val.letter={
    A:this.range(91,100),
    B:this.range(81,90),
    C:this.range(71,80),
    D:this.range(60,70),
    E:this.range(41,59),
    F:this.range(0,40),
  };
  val.onkeyup=function(){
    let el=document.getElementById(this.dataset.id);
    if(!el){return;}
    let res='F',
    num=parseInt(this.value);
    for(let k in this.letter){
      if(this.letter[k].indexOf(num)>=0){
        res=k;
        break;
      }
    }el.innerText=res;
  };
  let kel=document.createElement('input');
  kel.type='text';
  kel.value=key;
  kel.name='data['+drop+']['+nomor+'][key]';
  let letter=document.createElement('span');
  letter.id='letter-'+drop+'-'+nomor;
  letter.value=parseInt(value);
  for(let k in val.letter){
    if(val.letter[k].indexOf(letter.value)>=0){
      letter.innerText=k;
      break;
    }
  }
  if(date){
    let datel=document.createElement('input');
    datel.type='date';
    datel.value=date;
    datel.name='data['+drop+']['+nomor+'][date]';
    row=this.row(kel,val,datel,del);
  }else{
    row=this.row(kel,val,letter,del);
  }
  row.id='row-'+drop+'-'+nomor;
  return row;
};
this.dormValueTemplate=function(id){
  return {
    student_id:id,
    teacher_id:_Pesantrian.user.profile_id,
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
    data:JSON.stringify({
      akhlaq:{},
      kebersihan:{},
      pelanggaran:{},
      apresiasi:{},
      catatan:'',
      siklus_haid:'',
      berat_badan:'',
      tinggi_badan:'',
      sakit:'',
    }),
  };
};
this.tahfidzTemplate=function(id){
  return {
    student_id:id,
    teacher_id:_Pesantrian.user.profile_id,
    juz_total:'',
    memorize_total:'',
    memorize_target:'',
    tajwid:'',
    tahsin:'',
    note:'',
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  };
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianDormitory */
;function PesantrianDormitory(app){
this.app=app;
this.aliasData={
  juz_total:'Jumlah Juz',
  memorize_total:'Jumlah Hafalan',
  memorize_target:'Target Hafalan',
  tajwid:'Tajwid',
  tahsin:'Tahsin',
  note:'Catatan',
  catatan:'Catatan',
  siklus_haid:'Siklus Haid',
  berat_badan:'Berat Badan',
  tinggi_badan:'Tinggi Badan',
  sakit:'Sakit bulan ini',
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
  date:'Tanggal',
  hour:'Jam',
  back_date:'Tanggal Kembali',
  back_hour:'Jam Kembali',
  long:'Lama Izin (hari)',
  status:'Status',
  penalty:'Sanksi',
  type:'Jenis Izin',
  student_id:'Nama Santri',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.yearly=[
  6,7,8,9,10,11,
  0,1,2,3,4,5,
];
this.dorm={
  buildings:[
    'MARWAH','ARAFAH','SHOFA',
    'DARUL FALAH','DARUL ARQOM',
  ],
  rooms:[
    [1,2,3,4,5,6],
    [1,2,3,4,5,6],
    [1,2,3,4,5,6],
    [1,2],
    [1,2],
  ],
  restRooms:[
    ['SEMANGGI','LAVENDER','ROSELLA','EDELWIS','ASTER','ALAMANDA','AZALEA'],
    ['CAMELIA','GARDENIA','DAISY','KAMBOJA','COSMOS','AGERATUM','ANYELIR'],
    ['SEULANGA','JEUMPA','KENANGA','FLAMBOYAN','LILY','ANGGREK','MAWAR','MELATI','CEMPAKA','ASOKA','VIOLET','TERATAI','SAKURA','DAHLIA','RAFLESIA'],
    ['SUMATERA','JAWA','SULAWESI','KALIMANTAN','HALMAHERA'],
    ['SUMATERA','JAWA','SULAWESI','KALIMANTAN','HALMAHERA'],
  ],
  bcode:{
    MARWAH:81,
    ARAFAH:82,
    SHOFA:83,
    'DARUL FALAH':84,
    'DARUL ARQOM':85,
  },
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;


this.sessions={
  "1":[0,7],
  "2":[7,15],
  "3":[15,18],
  "4":[18,23],
};


this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'form3',
      title:'Perizinan',
      callback:function(e){
        _PesantrianDormitory.tablePermission();
      }
    },
    {
      name:'bunk',
      title:'Asrama',
      callback:function(e){
        _PesantrianDormitory.tableDormBuilding();
      }
    },
    {
      name:'bathroom',
      title:'Kamar Mandi',
      callback:function(e){
        _PesantrianDormitory.tableDormRestRoom();
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianDormitory=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};


/* semester valuation team */
this.semesterTeamForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear().split('/'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_team'
      :'select * from tahfidz_team where teacher_id='+uid,
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_valuation_plus where type="semester"'
        +' and syear="'+this.getStudyYear()+'"'
      :'select * from tahfidz_valuation_plus where type="semester" and teacher_id='+uid
        +' and syear="'+this.getStudyYear()+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  values=data[1],
  row=this.rowHead('NILAI UJIAN SEMESTER TAHFIZH<br />Tahun Ajaran '
    +this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  row=this.row('Nama Santri','Semester 1','Semester 2','');
  row.classList.add('tr-head');
  table.append(row);
  for(let stu of students){
    let sem1=document.createElement('input'),
    sem2=document.createElement('input'),
    save=document.createElement('input'),
    val1=this.subjectiveGetValue(stu.student_id,1,values),
    val2=this.subjectiveGetValue(stu.student_id,2,values);
    sem1.type='text';
    sem1.value=val1!=false?''+val1.value:'0';
    sem1.dataset.isUpdate=val1!=false?val1.id:'0';
    sem1.id='semester1-'+stu.student_id;
    sem2.type='text';
    sem2.value=val2!=false?''+val2.value:'0';
    sem2.dataset.isUpdate=val2!=false?val2.id:'0';
    sem2.id='semester2-'+stu.student_id;
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.dataset.id=''+stu.student_id;
    save.dataset.name=stu.name;
    save.dataset.tid=''+uid;
    save.dataset.syear=this.getStudyYear();
    save.onclick=async function(){
      let sem1=document.getElementById('semester1-'+this.dataset.id),
      sem2=document.getElementById('semester2-'+this.dataset.id),
      update1=sem1.dataset.isUpdate!='0'?sem1.dataset.isUpdate:false,
      update2=sem2.dataset.isUpdate!='0'?sem2.dataset.isUpdate:false,
      syear=this.dataset.syear.split('/'),
      tdata1={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem1.value,
        semester:1,
        year:syear[0],
        type:'semester',
        syear:this.dataset.syear,
      },
      tdata2={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem2.value,
        semester:2,
        year:syear[1],
        type:'semester',
        syear:this.dataset.syear,
      },
      queries=[
        update1
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata1)+') where id='+update1
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata1),
        update2
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata2)+') where id='+update2
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata2),
      ].join(';'),
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('queries',queries);
      this.disabled=true;
      this.value='Saving...';
      await _PesantrianDormitory.semesterTeamForm();
    };
    row=this.row(stu.name,sem1,sem2,save);
    table.append(row);
  }

};
this.semesterGetValue=function(sid,semester,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let d of data){
    if(d.student_id==sid&&d.semester==semester){
      res=d;
      break;
    }
  }return res;
};


/* subjective valuation team */
this.subjectiveTeamForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear().split('/'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_team'
      :'select * from tahfidz_team where teacher_id='+uid,
      _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_valuation_plus where type="subjective"'
        +' and syear="'+this.getStudyYear()+'"'
      :'select * from tahfidz_valuation_plus where type="subjective" and teacher_id='+uid
        +' and syear="'+this.getStudyYear()+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  values=data[1],
  row=this.rowHead('NILAI SUBJEKTIF TAHFIZH<br />Tahun Ajaran '
    +this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  row=this.row('Nama Santri','Semester 1','Semester 2','');
  row.classList.add('tr-head');
  table.append(row);
  for(let stu of students){
    let sem1=document.createElement('input'),
    sem2=document.createElement('input'),
    save=document.createElement('input'),
    val1=this.subjectiveGetValue(stu.student_id,1,values),
    val2=this.subjectiveGetValue(stu.student_id,2,values);
    sem1.type='text';
    sem1.value=val1!==false?''+val1.value:'0';
    sem1.dataset.isUpdate=val1!==false?val1.id:'0';
    sem1.id='semester1-'+stu.student_id;
    sem2.type='text';
    sem2.value=val2!==false?''+val2.value:'0';
    sem2.dataset.isUpdate=val2!==false?val2.id:'0';
    sem2.id='semester2-'+stu.student_id;
    save.type='submit';
    save.value='Save';
    save.classList.add('button-take');
    save.dataset.id=''+stu.student_id;
    save.dataset.name=stu.name;
    save.dataset.tid=''+uid;
    save.dataset.syear=this.getStudyYear();
    save.onclick=async function(){
      let sem1=document.getElementById('semester1-'+this.dataset.id),
      sem2=document.getElementById('semester2-'+this.dataset.id),
      update1=sem1.dataset.isUpdate!='0'?sem1.dataset.isUpdate:false,
      update2=sem2.dataset.isUpdate!='0'?sem2.dataset.isUpdate:false,
      syear=this.dataset.syear.split('/'),
      loader=_Pesantrian.loader(),
      tdata1={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem1.value,
        semester:1,
        year:syear[0],
        type:'subjective',
        syear:this.dataset.syear,
      },
      tdata2={
        name:this.dataset.name,
        student_id:this.dataset.id,
        teacher_id:this.dataset.tid,
        value:sem2.value,
        semester:2,
        year:syear[1],
        type:'subjective',
        syear:this.dataset.syear,
      },
      queries=[
        update1
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata1)+') where id='+update1
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata1),
        update2
          ?'update tahfidz_valuation_plus ('+_Pesantrian.buildQuery(tdata2)+') where id='+update2
          :'insert into tahfidz_valuation_plus '+_Pesantrian.buildQuery(tdata2),
      ].join(';'),
      res=await _Pesantrian.request('queries',queries);
      this.disabled=true;
      this.value='Saving...';
      await _PesantrianDormitory.subjectiveTeamForm();
    };
    row=this.row(stu.name,sem1,sem2,save);
    table.append(row);
  }

};
this.subjectiveGetValue=function(sid,semester,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let d of data){
    if(d.student_id==sid&&d.semester==semester){
      res=d;
      break;
    }
  }return res;
};


/* recap value */
this.recapValue=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear().split('/'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_team'
      :'select * from tahfidz_team where teacher_id='+uid,
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_presence'
      :'select * from tahfidz_presence where teacher_id='+uid,
    _Pesantrian.user.privilege>=8
      ?'select * from tahfidz_valuation_plus'
        +' where syear="'+this.getStudyYear()+'"'
      :'select * from tahfidz_valuation_plus where teacher_id='+uid
        +' and syear="'+this.getStudyYear()+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  precenses=data[1],
  values=data[2],
  row=this.rowHead('REKAP NILAI TAHFIZH<br />Tahun Ajaran '
    +this.getStudyYear(),9),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  row=this.row('Nama Santri','Semester 1','Semester 2');
  row.childNodes[0].setAttribute('rowspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  row.childNodes[2].setAttribute('colspan',4);
  row.classList.add('tr-head');
  table.append(row);
  row=this.row(
    'Nilai Kumulatif',
    'Nilai Ujian (50%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjektif (20%)',
    'Nilai Kumulatif',
    'Nilai Ujian (50%)',
    'Nilai Kehadiran (30%)',
    'Nilai Subjektif (20%)',
  );
  row.classList.add('tr-head');
  table.append(row);
  console.log(precenses);

  for(let stu of students){
    let vals={
      1:[],
      2:[],
    };
    for(let sem of [1,2]){
      let dyear=sem==1?studyYear[0]:studyYear[1],
      nis=this.recapGetSemesterValue(stu.student_id,sem,dyear,values),
      nix=this.recapGetSubjectiveValue(stu.student_id,sem,dyear,values),
      nip=this.recapGetPrecense(stu.student_id,sem,dyear,precenses);
      vals[sem].push(
        this.recapGetCumulativeValue(nis,nip,nix)
      );
      vals[sem].push(nis);
      vals[sem].push(nip);
      vals[sem].push(nix);
    }
    row=this.row(
      stu.name,
      vals[1][0],
      vals[1][1],
      vals[1][2],
      vals[1][3],
      vals[2][0],
      vals[2][1],
      vals[2][2],
      vals[2][3]
    );
    row.childNodes[1].classList.add('td-head');
    row.childNodes[5].classList.add('td-head');
    table.append(row);
  }
  
};
this.recapGetCumulativeValue=function(nis,nip,nix){
  nis=nis||0;
  nip=nip||0;
  nix=nix||0;
  let res=0;
  res+=parseInt(nis)*0.5;
  res+=parseInt(nip)*0.3;
  res+=parseInt(nix)*0.2;
  return Math.ceil(res);
};
/**
 * --- tahfidz_valuation_plus
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [teacher_id:10] => "0"
            4: (int) [value:3] => "0"
            5: (int) [semester:1] => "1"
            6: (int) [year:4] => "2024"
            7: (string) [type:100] => LDB_BLANK --- semester/subjective/--juz1-30
            8: (time) [time:10] => LDB_TIME
            9: (string) [syear:100] => LDB_BLANK

 */
this.recapGetSemesterValue=function(sid,semester,year,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.type=='semester'
      &&d.student_id==sid
      &&d.year==year
      &&d.semester==semester){
      res=d.value;
      break;
    }
  }return res;
};
this.recapGetSubjectiveValue=function(sid,semester,year,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let d of data){
    if(d.type=='subjective'
      &&d.student_id==sid
      &&d.year==year
      &&d.semester==semester){
      res=d.value;
      break;
    }
  }return res;
};
/**
 * --- tahfidz_presence
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [teacher_id:10] => "0"
            4: (int) [presence:5] => LDB_BLANK
            5: (string) [note:100] => LDB_BLANK
            6: (int) [date:2] => "1"
            7: (int) [month:2] => "0"
            8: (int) [year:4] => "2024"
            9: (time) [time:10] => LDB_TIME
            10: (int) [session:2] => "1"
 */
this.recapGetPrecense=function(sid,semester,year,data){
  data=Array.isArray(data)?data:[];
  let res=0,
  count=0,
  months=semester==1?[6,7,8,9,10,11]:[0,1,2,3,4,5],
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ];
  for(let d of data){
    if(d.student_id==sid&&d.year==year&&months.indexOf(d.month)>=0){
      if(d.presence==1||d.presence==3){
        res+=1;
      }
      count++;
    }
  }
  return count>0?Math.ceil(res/count*100):0;
};


/* permission */
this.tablePermission=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear(),
  queries=[
    'select * from permission where '+this.getStudyYearQuery()
      +' order by id desc',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class=96',
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries);
  loader.remove();
  if(datas[1].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai hak akses ke fitur ini.','error');
    return;
  }
  let row=this.rowHead('PERIZINAN<br />Tahun Ajaran '+studyYear,5),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  row=this.row('NO','Nama Santri','Tanggal Izin','Tanggal Kembali','');
  row.classList.add('tr-head');
  table.append(row);
  let add=document.createElement('input');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.permissionDetail(datas[2]);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','',add);
  table.append(row);
  for(let perm of datas[0]){
    let date=_Pesantrian.parseDatetime(perm.date+' '+perm.hour),
    bdate=_Pesantrian.parseDatetime(perm.back_date+' '+perm.back_hour),
    detail=document.createElement('input');
    detail.classList.add('button-detail');
    detail.type='submit';
    detail.value='Detail';
    detail.dataset.data=JSON.stringify(perm);
    detail.dataset.students=JSON.stringify(datas[2]);
    detail.onclick=function(){
      _PesantrianDormitory.permissionDetail(
        _Pesantrian.parseJSON(this.dataset.students),
        _Pesantrian.parseJSON(this.dataset.data)
      );
    };
    row=this.row(perm.id,perm.name,date,bdate,detail);
    row.dataset.name=perm.name;
    table.append(row);
  }
};
this.permissionDetail=function(students,data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.tablePermission();
    })
  );
  students=students||[];
  data=data||this.templatePermission();
  let id=data.hasOwnProperty('id')?data.id:null,
  passes=['id','time'],
  hidden=['name'],
  types={
    date:'date',
    back_date:'date',
    hour:'time',
    back_hour:'time',
    long:'number',
  },
  row,table=this.table();
  this.app.body.append(table);
  let selects={
    type:[
      'Sakit',
      'Keluarga inti meninggal',
      'Keluarga inti sakit',
      'Pengurusan dokumen',
      'Pendidikan',
    ],
    status:[
      'Belum kembali',
      'Tepat waktu',
      'Terlambat',
    ],
  };
  for(let key in data){
    let value=data[key],
    alias=this.alias(key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }
    if(hidden.indexOf(key)>=0){
      val=document.createElement('input');
      val.type='hidden';
      val.name=key;
      val.value=value;
      this.app.body.append(val);
      continue;
    }
    if(key=='student_id'){
      val=_Pesantrian.findSelect({
        id:'select-id',
        data:students,
        key:key,
        value:value,
        placeholder:'Nama Santri...',
        callback:function(r){
          let sname=document.querySelector('input[name="name"]');
          if(sname){
            sname.value=r.name;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
    }else if(selects.hasOwnProperty(key)){
      val=document.createElement('select');
      val.name=key;
      for(let iv of selects[key]){
        let opt=document.createElement('option');
        opt.value=iv;
        opt.textContent=iv;
        if(iv==value){
          opt.selected='selected';
        }
        val.append(opt);
      }
      val.classList.add('extra-high');
    }else{
      val=document.createElement('input');
      val.type=types.hasOwnProperty(key)?types[key]:'text';
      val.name=key;
      val.value=value;
      val.placeholder=alias+'...';
      val.classList.add('extra-high');
    }
    row=this.row(alias,val);
    table.append(row);
  }
  
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=id
      ?'update permission ('+innerQuery+') where id='+id
      :'insert into "permission" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tablePermission();
      },1600);
    }
  };
};
this.templatePermission=function(){
  return {
    name:'',
    student_id:0,
    date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    long:0,
    type:'Sakit',
    back_date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    back_hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    note:'',
    status:'Belum kembali',
    penalty:'',
  };
};
this.getStudyYearQuery=function(){
  let studyYear=this.getStudyYear().split('/'),
  one=Math.floor(new Date(studyYear[0]+'-07-01').getTime()/1000),
  two=Math.floor(new Date(studyYear[1]+'-06-30').getTime()/1000),
  res=[
    'time > '+one,
    'time < '+two,
  ];
  return res.join(' and ');
};
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};

/* tahfidz_inventory */
this.addItemT=function(tid){
  this.clearBody();
  let lines=this.templateItemT(),
  row=this.rowHead('INPUT BARANG<br />TID: '+tid,2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventoryT(tid);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.teacher_id=tid;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "tahfidz_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventoryT(tid);
      },1600);
    }
  };
};
this.tableInventoryT=async function(tid){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableTeam();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from tahfidz_inventory where teacher_id='+tid,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY TAHFIZH<br />TID: '+tid,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),'TID',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItemT(tid);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from tahfidz_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,item.teacher_id,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  this.app.body.append(table);
};
this.templateItemT=function(tid){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

/* qrscanner -- tahfidz_presence */
this.presenceScanner=async function(perm){
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return _Pesantrian.alert('Error: Has no camera access!','','error');
      }
      this.presenceScanner(true);
    });
    return;
  }
  let dialog=await _Pesantrian.dialogPage(),
  button=document.createElement('input'),
  video=document.createElement('video'),
  content=document.createElement('div');
  content.append(video);
  content.append(button);
  button.type='submit';
  button.value='Stop';
  button.onclick=function(){
    if(this.value=='Stop'){
      this.scanner.stop();
      this.value='Start';
    }else{
      this.scanner.start();
      this.value='Stop';
    }
  };
  dialog.blank();
  dialog.main.append(content);
  /* initiate scanner */
  button.scanner=new QrScanner(video,async result=>{
    button.scanner.stop();
    dialog.close();
    let student=result.data.split(':');
    if(student.length!=3){
      return _Pesantrian.alert('Error: Invalid QRCode!','','error');
    }
    let loader=_Pesantrian.loader(),
    data={
      name:student[1],
      student_id:student[0],
      teacher_id:_Pesantrian.user.profile.id,
      presence:1,
      note:'Hadir',
      date:(new Date).getDate(),
      month:(new Date).getMonth(),
      year:(new Date).getFullYear(),
      session:this.getTahfidzSession(),
    },
    innerQuery=_Pesantrian.buildQuery(data),
    query='insert into tahfidz_presence '+innerQuery,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    if(res==1){
      let al=await _Pesantrian.alertX(data.name,'Hadir di sesi ke '+data.session,'success');
      if(al){}
      return;
    }
    let al=await _Pesantrian.alertX('Error: Failed to save presence!',res,'error');
    if(al){}
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  /* start scanning */
  button.scanner.start();
};

/* tahfidz_presence */
this.teamPresence=async function(date,session){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  if(_Pesantrian.user.profile.position!='tahfidz'
    &&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak memiliki akses ke sini.','error');
    return;
  }
  date=date?date:(new Date).getDate();
  session=session?session:this.getTahfidzSession();
  let loader=_Pesantrian.loader(),
  tid=_Pesantrian.user.profile_id,
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  reasons=[
    'Bolos',
    'Hadir',
    'Sakit',
    'Lomba',
    'Pulang',
  ],
  tquery=_Pesantrian.user.privilege>=8
    ?'select * from tahfidz_team ORDER BY name ASC'
    :'select * from tahfidz_team where teacher_id='+tid
      +' ORDER BY name ASC',
  pquery=_Pesantrian.user.privilege>=8
    ?'select * from tahfidz_presence where date='+date
      +' and month='+month+' and year='+year
      +' and session='+session
    :'select * from tahfidz_presence where teacher_id='+tid
      +' and date='+date+' and month='+month+' and year='+year
      +' and session='+session,
  queries=[
    tquery,
    pquery,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  presences=data[1],
  add=document.createElement('input'),
  title='ABSENSI HALAQAH<br />TID '+tid+'<br />'
    +_Pesantrian.parseDate(year+'-'+(month+1)+'-'+date)
    +'<br />Sesi '+session,
  row=this.rowHead(title,3),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Santri','Kehadiran');
  row.classList.add('tr-head');
  table.append(row);
  /* finder and date */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let sdate=document.createElement('select'),
  scabs=(year/4)===Math.ceil(year/4)?29:28,
  sdates=[31,scabs,31,30,31,30,31,31,30,31,30,31][month];
  for(let i of this.range(1,sdates)){
    let opt=document.createElement('option');
    opt.value=i+'';
    opt.textContent='Tanggal '+i;
    sdate.append(opt);
    if(date==i){
      opt.selected='selected';
    }
  }
  sdate.dataset.session=session;
  sdate.onchange=async function(){
    await _PesantrianDormitory.teamPresence(this.value,this.dataset.session);
  };
  row=this.row('',find,sdate);
  table.append(row);
  /* session */
  let sess=document.createElement('select');
  for(let i in this.sessions){
    let opt=document.createElement('option');
    opt.textContent='Sesi '+i;
    opt.value=i;
    if(i==session){
      opt.selected='selected';
    }
    sess.append(opt);
  }
  sess.classList.add('extra-high');
  sess.dataset.date=date;
  sess.onchange=async function(){
    await _PesantrianDormitory.teamPresence(this.dataset.date,this.value);
  };
  row=this.row('','',sess);
  table.append(row);
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  for(let student of students){
    let sen=this.getStudentPresence(student.student_id,presences);
    if(sen!==false){
      let pre=sen.note;
      row=this.row(student.student_id,student.name,pre);
      row.dataset.name=student.name;
      row.childNodes[2].classList.add('extra-high');
      table.append(row);
      continue;
    }
    let pre=document.createElement('select'),
    opt=document.createElement('option');
    opt.value='';
    opt.textContent='---PRESET---';
    pre.append(opt);
    pre.classList.add('extra-high');
    for(let reason of reasons){
      opt=document.createElement('option');
      opt.value=reason;
      opt.textContent=reason;
      pre.append(opt);
    }
    pre.dataset.reasons=JSON.stringify(reasons);
    pre.dataset.student=JSON.stringify(student);
    pre.dataset.date=date+'';
    pre.onchange=async function(){
      let reason='Unknown',
      reasons=_Pesantrian.parseJSON(this.dataset.reasons),
      student=_Pesantrian.parseJSON(this.dataset.student),
      date=this.dataset.date,
      month=(new Date).getMonth(),
      year=(new Date).getFullYear(),
      key=reasons.indexOf(this.value);
      if(key>=0){
        reason=reasons[key];
      }
      let yes=await _Pesantrian.confirmX('Konfirmasi Kehadiran!',
        'Bahwa '+student.name+' --> '+reason);
      if(!yes){
        this.value='';
        return;
      }
      let innerQuery=_Pesantrian.buildQuery({
        name:student.name,
        student_id:student.student_id,
        teacher_id:student.teacher_id,
        presence:key,
        note:reason,
        date:date,
        month:month,
        year:year,
        session:session,
      }),
      loader=_Pesantrian.loader(),
      query='insert into tahfidz_presence '+innerQuery,
      res=await _Pesantrian.request('query',query);
      loader.remove();
      this.disabled=true;
    };
    row=this.row(student.student_id,student.name,pre);
    row.dataset.name=student.name;
    table.append(row);
  }
  
  this.app.body.append(table);
  
};
this.getStudentPresence=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.student_id==id){
      res=i;
      break;
    }
  }return res;
};
/* output as string */
this.getTahfidzSession=function(){
  let date=new Date(),
  res=1,
  dhour=date.getHours();
  for(let key in this.sessions){
    if(dhour>=this.sessions[key][0]
      &&dhour<=this.sessions[key][1]){
      res=key;
      break;
    }
  }
  return res;
};

/* rest room */
this.getBuildingFromRestroom=function(restroom){
  restroom=typeof restroom==='string'?restroom:'LONELY';
  let res='KABAH';
  for(let rr in this.dorm.restRooms){
    if(this.dorm.restRooms[rr].indexOf(restroom)>=0){
      res=this.dorm.buildings[rr];
      break;
    }
  }
  return res;
};
this.tableDormRestRoomMember=async function(restroom){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormRestRoom();
    })
  );
  let loader=_Pesantrian.loader(),
  back=document.createElement('input'),
  uid=_Pesantrian.user.profile_id,
  building=this.getBuildingFromRestroom(restroom),
  bcode=this.dorm.bcode.hasOwnProperty(building)
    ?this.dorm.bcode[building]:0,
  queries=[
    'select * from dorm where rest_room="'+restroom+'"',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class='+bcode,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nomor=1,
  title='KAMAR MANDI '+restroom,
  row=this.rowHead(title,3),
  table=this.table();
  loader.remove();
  if(data[1].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai akses ke gedung ini.','error');
    return;
  }
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    this.tableDormRestRoom();
  };
  row=this.row('NO','Nama Santri',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let line of data[0]){
    row=this.row(nomor,line.name);
    row.childNodes[1].setAttribute('colspan',2);
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
};
this.tableDormRestRoom=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let back=document.createElement('input'),
  nomor=1,
  row,
  table;
  for(let key in this.dorm.buildings){
    let building=this.dorm.buildings[key],
    restRooms=this.dorm.restRooms[key];
    table=this.table();
    row=this.rowHead('GEDUNG '+building,3);
    table.append(row);
    /* rest-room */
    row=this.row('','','');
    table.append(row);
    row=this.row('NO','Nama Kamar Mandi','');
    row.classList.add('tr-head');
    table.append(row);
    nomor=1;
    for(let rroom of restRooms){
      let see=document.createElement('input');
      see.type='submit';
      see.value='Lihat';
      see.classList.add('button-view');
      see.classList.add('extra-high');
      see.dataset.restroom=rroom;
      see.onclick=function(){
        _PesantrianDormitory.tableDormRestRoomMember(
          this.dataset.restroom
        );
      };
      row=this.row(nomor,rroom,see);
      table.append(row);
      nomor++;
    }
    this.app.body.append(table);
  }
};

/* dorm */
this.tableDormValue=async function(id,name,month,year,building,room){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormYearly(id,name,building,room);
    })
  );
  let monthThis=(new Date).getMonth(),
  yearThis=(new Date).getFullYear(),
  back=document.createElement('input'),
  row=this.rowHead(name+'<br />Bulan '+this.month[month]+'<br />Tahun Ajaran '+year,1),
  table=this.table(),
  yearly=year.split('/'),
  yearlyValue=month<6?yearly[1]:yearly[0],
  isUpdate=false,
  passes=['id','time'],
  hidden=['student_id','teacher_id','month','year'],
  drop=[
    'akhlaq',
    'kebersihan',
    'ibadah',
    'bahasa',
    'pelanggaran',
    'apresiasi'
  ],
  tid=_Pesantrian.user.id,
  query='select * from dorm_value where student_id='+id
    +' and month='+month+' and year='+yearlyValue,
  loader=_Pesantrian.loader(),
  data=await _Pesantrian.request('query',query),
  values=this.dormValueTemplate(id);
  values.month=month;
  values.year=yearlyValue;
  loader.remove();
  if(data.length>0){
    values=data[0];
    isUpdate=true;
  }
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableDormYearly(id,name,building,room);
  };
  row=this.row(back);
  table.append(row);
  this.app.body.append(table);
  /* hidden */
  for(let key in values){
    let value=values[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let val=document.createElement('input');
      val.type='hidden';
      val.name=key;
      val.value=value;
      this.app.body.append(val);
      continue;
    }
  }
  /* data - parse */
  let dataDrop=_Pesantrian.parseJSON(values.data);
  for(let drp of drop){
    table=this.table();
    row=this.rowHead(drp.toUpperCase(),4);
    table.append(row);
    table.id='table-'+drp;
    let nomor=1;
    let add=document.createElement('input');
    add.type='submit';
    add.value='Tambah';
    add.classList.add('button-add');
    add.dataset.drop=drp;
    add.dataset.nomor=nomor+'';
    add.onclick=function(){
      let tbl=document.getElementById('table-'+this.dataset.drop),
      date=[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0')
        ].join('-'),
      nomor=parseInt(this.dataset.nomor),
      rw=_PesantrianDormitory.addValueData('','',
        this.dataset.drop,nomor);
      if(['pelanggaran','apresiasi'].indexOf(drp)>=0){
        rw=_PesantrianDormitory.addValueData('','',
          this.dataset.drop,nomor,date);
      }
      tbl.append(rw);
      this.dataset.nomor=(nomor+1)+'';
    };
    let kname='Aspek Peniaian',
    vname='Nilai';
    if(drp=='pelanggaran'){
      kname='Jenis Pelanggaran';
      vname='Point';
      row=this.row(kname,vname,'Tanggal',add);
    }else if(drp=='apresiasi'){
      kname='Jenis Tindakan';
      vname='Point';
      row=this.row(kname,vname,'Tanggal',add);
    }else{
      row=this.row(kname,vname,'Huruf',add);
    }
    row.classList.add('tr-head');
    table.append(row);
    for(let key in dataDrop[drp]){
      let value=dataDrop[drp][key];
      if(['pelanggaran','apresiasi'].indexOf(drp)>=0){
        row=this.addValueData(value.key,value.value,drp,nomor,value.date);
      }else{
        row=this.addValueData(value.key,value.value,drp,nomor);
      }
      table.append(row);
      add.dataset.nomor=(nomor+1)+'';
      nomor++;
    }
    this.app.body.append(table);
  }
  /* data */
  table=this.table();
  for(let key in dataDrop){
    let value=dataDrop[key],
    val=value;
    if(drop.indexOf(key)>=0){
      continue;
    }else if(key=='catatan'){
      val=document.createElement('textarea');
      val.name='data['+key+']';
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.setAttribute('rows',3);
      val.classList.add('extra-high');
    }else{
      val=document.createElement('input');
      val.type='text';
      val.name='data['+key+']';
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.classList.add('extra-high');
    }
    if(key=='note'){
      row=this.row(this.alias(key),val);
      table.append(row);
      row.childNodes[1].setAttribute('colspan',2);
    }else{
      row=this.row(this.alias(key),val,'');
      table.append(row);
    }
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let dorm_value_id=isUpdate&&values.hasOwnProperty('id')
    ?values.id:null;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    if(isUpdate){
      delete data.id;
      delete data.time;
      delete data.student_id;
      delete data.teacher_id;
      delete data.month;
      delete data.year;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=isUpdate
      ?'update dorm_value ('+innerQuery+') where id='
        +dorm_value_id
      :'insert into "dorm_value" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableDormYearly(id,name,building,room);
      },1600);
    }
  };
};
this.tableDormYearly=async function(id,name,building,room){
  this.clearBody();
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  back=document.createElement('input'),
  row='',
  table=this.table(),
  studyYear=[year,year+1].join('/');
  if(month<6){
    studyYear=[year-1,year].join('/');
  }
  row=this.rowHead(name+'<br />TAHUN AJARAN '+studyYear,2);
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableDorm(building,room);
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDorm(building,room);
    })
  );
  row=this.row('Bulan',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let mon of this.yearly){
    let val=document.createElement('input');
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=id;
    val.dataset.name=name;
    val.dataset.month=mon;
    val.dataset.year=studyYear;
    val.dataset.building=building;
    val.dataset.room=room;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianDormitory.tableDormValue(
        this.dataset.id,
        this.dataset.name,
        this.dataset.month,
        this.dataset.year,
        this.dataset.building,
        this.dataset.room
      );
    };
    let tyear=studyYear.split('/'),
    vyear=mon<6?tyear[1]:tyear[0];
    row=this.row(this.month[mon]+' '+vyear,val);
    table.append(row);
  }
  this.app.body.append(table);
};
this.tableDorm=async function(building,room){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormBuilding();
    })
  );
  let loader=_Pesantrian.loader(),
  bcode=this.dorm.bcode[building],
  back=document.createElement('input'),
  uid=_Pesantrian.user.profile_id,
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from dorm where building_name="'+building+'"'
    +' and room_name="'+room+'"',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class='+bcode,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nomor=1,
  add=document.createElement('input'),
  title='ASRAMA '+building+' '+room,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  if(data[2].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai akses ke gedung ini.','error');
    return;
  }
  table.append(row);
  row=this.row('NO','Nama Santri','Kamar Mandi',add,back);
  row.classList.add('tr-head');
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    this.tableDormBuilding();
  };
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    let aid='add-member',
    ael=document.getElementById(aid),
    table=document.getElementById('table-team'),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:data[0],
      key:'student_id',
      value:'',
      placeholder:'Nama Santri...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    srest=document.createElement('select'),
    sname=document.createElement('input'),
    ssave=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      form.teacher_id=_Pesantrian.user.profile_id;
      form.building_name=building;
      form.room_name=room;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into dorm '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await _PesantrianDormitory.tableDorm(building,room);
        },1600);
      }
    };
    let restIndex=_PesantrianDormitory
      .dorm.buildings.indexOf(building),
    restRooms=_PesantrianDormitory.dorm.restRooms[restIndex];
    for(let rroom of restRooms){
      let opt=document.createElement('option');
      opt.value=rroom;
      opt.textContent=rroom;
      srest.append(opt);
    }
    srest.name='rest_room';
    row=_Pesantrian.row(sname,sid,srest,'',ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  /* */
  for(let line of data[1]){
    let div=document.createElement('div'),
    del=document.createElement('input'),
    val=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=line.id;
    del.dataset.name=line.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from dorm where id='+id;
      _Pesantrian.confirm('Hapus anggota ruangan?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=line.student_id;
    val.dataset.name=line.name;
    val.dataset.building=building;
    val.dataset.room=room;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianDormitory.tableDormYearly(
        this.dataset.id,
        this.dataset.name,
        this.dataset.building,
        this.dataset.room
      );
    };
    row=this.row(nomor,line.name,line.rest_room,del,val);
    row.id=line.id;
    table.append(row);
    nomor++;
  }
  table.id='table-team';
  this.app.body.append(table);
};
this.tableDormBuilding=async function(){
  this.clearBody();
  let back=document.createElement('input'),
  nomor=1,
  row,
  table;
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  for(let key in this.dorm.buildings){
    let building=this.dorm.buildings[key],
    restRooms=this.dorm.restRooms[key];
    table=this.table();
    row=this.rowHead('GEDUNG '+building,3);
    table.append(row);
    let inopen=document.createElement('input');
    inopen.classList.add('button-add');
    inopen.classList.add('extra-high');
    inopen.type='submit';
    inopen.value='Inventory';
    inopen.dataset.building=building;
    inopen.onclick=function(){
      _PesantrianDormitory.tableInventory(this.dataset.building);
    };
    row=this.row('NO','Nama Ruangan',inopen);
    row.classList.add('tr-head');
    table.append(row);
    for(let num of this.dorm.rooms[key]){
      let see=document.createElement('input');
      see.type='submit';
      see.value='Buka';
      see.classList.add('button-view');
      see.classList.add('extra-high');
      see.dataset.building=building;
      see.dataset.room=num;
      see.onclick=function(){
        _PesantrianDormitory.tableDorm(
          this.dataset.building,
          this.dataset.room
        );
      };
      row=this.row(num,building+' '+num,see);
      table.append(row);
    }
    this.app.body.append(table);
  }
};

/* dorm_inventory*/
this.addItem=function(building){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG<br />GEDUNG '+building,2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory(building);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.building=building;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "dorm_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory(building);
      },1600);
    }
  };
};
this.tableInventory=async function(building){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDormBuilding();
    })
  );
  let loader=_Pesantrian.loader(),
  bcode=this.dorm.bcode[building],
  queries=[
    'select * from dorm_inventory where building="'+building+'"',
    'select * from room_teacher where teacher_id='
      +_Pesantrian.user.profile.id+' and class='+bcode,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY ASRAMA<br />GEDUNG '+building,5),
  table=this.table();
  loader.remove();
  if(data[1].length==0&&_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Anda tidak mempunyai akses ke gedung ini.','error');
    return;
  }
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem(building);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from drom_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  this.app.body.append(table);
};
this.templateItem=function(building){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

/* team halaqah */
this.tableValue=async function(id,name,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableYearly(id,name);
    })
  );
  let monthThis=(new Date).getMonth(),
  yearThis=(new Date).getFullYear(),
  back=document.createElement('input'),
  row=this.rowHead(name+'<br />Bulan '+this.month[month]+'<br />Tahun Ajaran '+year,3),
  table=this.table(),
  yearly=year.split('/'),
  yearlyValue=month<6?yearly[1]:yearly[0],
  isUpdate=false,
  passes=['id','time'],
  hidden=['student_id','teacher_id','month','year'],
  tid=_Pesantrian.user.id,
  query='select * from tahfidz where student_id='+id
    +' and month='+month+' and year='+yearlyValue,
  loader=_Pesantrian.loader(),
  data=await _Pesantrian.request('query',query),
  values=this.tahfidzTemplate(id);
  values.month=month;
  values.year=yearlyValue;
  loader.remove();
  if(data.length>0){
    values=data[0];
    isUpdate=true;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableYearly(id,name);
  };
  row=this.row('Aspek Peniaian','Nilai',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let key in values){
    let value=values[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let val=document.createElement('input');
      val.type='hidden';
      val.name=key;
      val.value=value;
      this.app.body.append(val);
      continue;
    }else if(key=='note'){
      val=document.createElement('textarea');
      val.name=key;
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.setAttribute('rows',3);
      val.classList.add('extra-high');
    }else{
      val=document.createElement('input');
      val.type='number';
      val.name=key;
      val.value=value;
      val.placeholder=this.alias(key)+'...';
      val.classList.add('extra-high');
    }
    if(key=='note'){
      row=this.row(this.alias(key),val);
      table.append(row);
      row.childNodes[1].setAttribute('colspan',2);
    }else{
      row=this.row(this.alias(key),val,'');
      table.append(row);
    }
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let tahfidz_id=isUpdate&&values.hasOwnProperty('id')?values.id:null;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(isUpdate){
      delete data.id;
      delete data.time;
      delete data.student_id;
      delete data.teacher_id;
      delete data.month;
      delete data.year;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=isUpdate
      ?'update tahfidz ('+innerQuery+') where id='+tahfidz_id
      :'insert into "tahfidz" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableYearly(id,name);
      },1600);
    }
  };
};
this.tableYearly=async function(id,name){
  this.clearBody();
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  back=document.createElement('input'),
  row='',
  table=this.table(),
  studyYear=[year,year+1].join('/');
  if(month<6){
    studyYear=[year-1,year].join('/');
  }
  row=this.rowHead(name+'<br />TAHUN AJARAN '+studyYear,2);
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=async ()=>{
    await this.tableTeam();
  };
  row=this.row('Bulan',back);
  row.classList.add('tr-head');
  table.append(row);
  for(let mon of this.yearly){
    let val=document.createElement('input');
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=id;
    val.dataset.name=name;
    val.dataset.month=mon;
    val.dataset.year=studyYear;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianDormitory.tableValue(
        this.dataset.id,
        this.dataset.name,
        this.dataset.month,
        this.dataset.year
      );
    };
    let tyear=studyYear.split('/'),
    vyear=mon<6?tyear[1]:tyear[0];
    row=this.row(this.month[mon]+' '+vyear,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableTeam();
    })
  );
};
this.tableTeam=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  back=document.createElement('input'),
  uid=_Pesantrian.user.profile_id,
  ugender=_Pesantrian.user.profile.gender,
  squery=
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
  query=_Pesantrian.user.privilege>=8
    ?'select * from tahfidz_team'
    :'select * from tahfidz_team where teacher_id='+uid,
  queries=[
    squery,
    query,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nomor=1,
  add=document.createElement('input'),
  row=this.rowHead('HALAQAH',4),
  table=this.table();
  loader.remove();
  table.append(row);
  if(false){
    alert(_Pesantrian.parser.likeJSON(data[1],3));
  }
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    let aid='add-member',
    ael=document.getElementById(aid),
    table=document.getElementById('table-team'),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:data[0],
      key:'student_id',
      value:'',
      placeholder:'Nama Santri...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    sname=document.createElement('input'),
    ssave=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      form.teacher_id=_Pesantrian.user.profile_id;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into tahfidz_team '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await _PesantrianDormitory.tableTeam();
        },1600);
      }
    };
    row=_Pesantrian.row(sname,sid,'',ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  back.type='submit';
  back.value='Inventory';
  back.classList.add('button-detail');
  back.onclick=async ()=>{
    await this.tableInventoryT(uid);
  };
  row=this.row('NO','Nama Santri',add,back);
  row.classList.add('tr-head');
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','');
  table.append(row);
  for(let line of data[1]){
    let div=document.createElement('div'),
    del=document.createElement('input'),
    val=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=line.id;
    del.dataset.name=line.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from tahfidz_team where id='+id;
      _Pesantrian.confirm('Hapus anggota halaqah?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    val.type='submit';
    val.value='Nilai';
    val.dataset.id=line.student_id;
    val.dataset.name=line.name;
    val.classList.add('button-view');
    val.classList.add('extra-high');
    val.onclick=async function(){
      await _PesantrianDormitory.tableYearly(
        this.dataset.id,
        this.dataset.name
      );
    };
    row=this.row(nomor,line.name,del,val);
    row.id=line.id;
    row.dataset.name=line.name;
    table.append(row);
    nomor++;
  }
  table.id='table-team';
  this.app.body.append(table);
};

/* inner */
this.range=function(s,t){
  s=s?s:0;
  t=t?Math.max(s,t):0;
  let r=[];
  for(let i=s;i<=t;i++){
    r.push(i);
  }return r;
};
this.addValueData=function(key,value,drop,nomor,date){
  let del=document.createElement('input');
  del.type='submit';
  del.value='Hapus';
  del.classList.add('button-delete');
  del.dataset.drop=drop;
  del.dataset.nomor=nomor;
  del.onclick=function(){
    let el=document.getElementById('row-'
      +this.dataset.drop+'-'
      +this.dataset.nomor);
    if(el){el.remove();}
  };
  let val=document.createElement('input');
  val.type='text';
  val.value=value;
  val.name='data['+drop+']['+nomor+'][value]';
  val.dataset.id='letter-'+drop+'-'+nomor;
  val.letter={
    A:this.range(91,100),
    B:this.range(81,90),
    C:this.range(71,80),
    D:this.range(60,70),
    E:this.range(41,59),
    F:this.range(0,40),
  };
  val.onkeyup=function(){
    let el=document.getElementById(this.dataset.id);
    if(!el){return;}
    let res='F',
    num=parseInt(this.value);
    for(let k in this.letter){
      if(this.letter[k].indexOf(num)>=0){
        res=k;
        break;
      }
    }el.innerText=res;
  };
  let kel=document.createElement('input');
  kel.type='text';
  kel.value=key;
  kel.name='data['+drop+']['+nomor+'][key]';
  let letter=document.createElement('span');
  letter.id='letter-'+drop+'-'+nomor;
  letter.value=parseInt(value);
  for(let k in val.letter){
    if(val.letter[k].indexOf(letter.value)>=0){
      letter.innerText=k;
      break;
    }
  }
  if(date){
    let datel=document.createElement('input');
    datel.type='date';
    datel.value=date;
    datel.name='data['+drop+']['+nomor+'][date]';
    row=this.row(kel,val,datel,del);
  }else{
    row=this.row(kel,val,letter,del);
  }
  row.id='row-'+drop+'-'+nomor;
  return row;
};
this.dormValueTemplate=function(id){
  return {
    student_id:id,
    teacher_id:_Pesantrian.user.profile_id,
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
    data:JSON.stringify({
      akhlaq:{},
      kebersihan:{},
      pelanggaran:{},
      apresiasi:{},
      catatan:'',
      siklus_haid:'',
      berat_badan:'',
      tinggi_badan:'',
      sakit:'',
    }),
  };
};
this.tahfidzTemplate=function(id){
  return {
    student_id:id,
    teacher_id:_Pesantrian.user.profile_id,
    juz_total:'',
    memorize_total:'',
    memorize_target:'',
    tajwid:'',
    tahsin:'',
    note:'',
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  };
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianShopm */
;function PesantrianShopm(app){
this.app=app;
this.aliasData={
  name:'Keterangan',
  nominal:'Nominal',
  method:'Arus Dana',
  evidence:'Bukti Transaksi',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.yearly=[
  6,7,8,9,10,11,
  0,1,2,3,4,5,
];
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'bill',
      title:'Keuangan',
      callback:function(e){
        _PesantrianShopm.tableBill();
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianShopm.billScannerForm();
      }
    },
    {
      name:'form4',
      title:'Report',
      callback:function(e){
        _PesantrianShopm.billReport();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianShopm.checkCredit();
      }
    },
  ],
  appsLower=[
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianShopm.billScannerForm();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianShopm.checkCredit();
      }
    },
  ],
  appOlder=[
    {
      name:'form3',
      title:'Stock Opname',
      callback:function(e){
        _PesantrianShopm.opname();
      }
    },
  ],
  theapps=_Pesantrian.user.privilege>=4?apps:appsLower,
  adminApps=_Pesantrian.buildApps(theapps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianShopm=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* evidence page -- table shopm */
this.evidencePage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  query='select id,evidence from shopm where id='+id,
  data=await _Pesantrian.request('query',query,50),
  text='Error: Data #'+id+' tidak ditemukan!';
  if(data.length==0){
    _Pesantrian.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  let evi=this.evidencePath(data[0].evidence),
  pro=document.createElement('div'),
  pimg=new Image;
  pimg.src=evi!=''?evi:_Pesantrian.IMAGES['icon-error.png'];
  pimg.main=pro;
  pimg.dialog=dialog;
  pimg.style.maxWidth='100%';
  pro.append(pimg);
  pimg.onload=function(){
    this.dialog.blank();
    this.dialog.main.append(this.main);
  };
  pimg.onerror=function(){
    this.dialog.loader.src=_Pesantrian.IMAGES['icon-error.png'];
  };
};
this.evidencePath=function(fname){
  return _Pesantrian.eva.config.host
    +'pesantrian/finance/evidence/'+fname;
};

/* stock opname -- new database */
this.opname=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let title='STOCK OPNAME',
  row=this.rowHead(title,6),
  table=this.table();
  table.append(row);
  row=this.row(
    'NO',
    'Nama Barang',
    'Jenis Barang',
    'Satuan',
    'Harga Pokok', /* jumlah dan nilai */
    'Harga Jual Satuan', /* jumlah dan nilai */
  );
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);

};
this.opnameTamplate=function(){
  return {
    nama_barang:'',
    jenis_barang:'minuman',
    satuan:'',
    harga_pokok:0,
    harga_jual_satuan:0,
    persedian_awal:0, /* jumlah dan nilai */
    penjualan:0, /* jumlah dan nilai */
    barang_masuk:0, /* jumlah dan nilai */
    persediaan_akhir:0, /* jumlah dan nilai */
    persediaan_fisik:0, /* jumlah dan nilai */
    selisih_kurang_lebih:0, /* jumlah dan nilai */
  };
};

/* template jkm -- jurnal kas masuk */
this.templateJKM=function(){
  return {
    tanggal:'',
    keterangan:'',
    ref:'',
    debet:0, /* kas */
    kredit:0, /* penjualan, komisi konsinyasi, piutang, return pembelian */
    total:0, /* kas, penjualan dan komisi */
  };
};
/* template jkk -- jurnal kas keluar */
this.tempaleJKK=function(){
  return {
    tanggal:'',
    keterangan:'',
    ref:'',
    debet:0, /* pembelian, utang, akun, serba-serbi */ 
    kredit:0, /* kas, potongan pembelian */ 
    total:0, /* kas dan pembelian */
  };
};
/* laporan laba-rugi */
this.templateLabaRugi=function(){
  return {

  };
};


/* qrscanner -- bill */
this.billScanner=async function(nominal,table){
  nominal=nominal||1;
  nominal=parseInt(nominal,10);
  if(!nominal.toString().match(/^\d+$/)
    ||nominal<1){
    return await _Pesantrian.alertX('Error: Invalid nominal input!','','error');
  }
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    data={
      name:'saving',
      type,
      profile_id:student_id,
      method:0,
      nominal,
      date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      transaction_date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      month,
      year,
      status:'paid',
      account:'Tunai',
      uid:_Pesantrian.user.id,
      data:{"rincian":{}},
      report:'',
      explanation:'Belanja di Kantin',
      transaction_code:'qrbill_shopm',
    },
    qrData={
      student_id,
      student_name,
      nominal,
      year,
      month,
      date,
    },
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='
        +student_id+' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    if(blocked){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
    if(saving<parseInt(nominal)){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Saldo tabungan tidak mencukupi!',
        'Saldo: '+_Pesantrian.parseNominal(saving)
          +' ('+student_name+')',
        'error'
      );
    }
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    qrInnerQuery=_Pesantrian.buildQuery(qrData),
    qrQuery='insert into shopm_qrbill '+qrInnerQuery,
    query='insert into transaction '+innerQuery,
    res=await _Pesantrian.request('queries',[
      query,qrQuery
    ].join(';'));
    loader.remove();
    if(res.join('')==11){
        let row=this.row(
          'New Bill',
          student_name,
          _Pesantrian.parseNominal(nominal),
          [
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
            (new Date).getSeconds().toString().padStart(2,'0'),
          ].join(':'),
        ),
        lastRow=table.lastChild,
        total=parseInt(table.dataset.total,10)+nominal;
        row.childNodes[2].classList.add('td-right');
        lastRow.childNodes[2].innerText=_Pesantrian.parseNominal(total);
        table.insertBefore(row,lastRow);
        table.dataset.total=total+'';
      let al=await _Pesantrian.alertX(
        'Transaksi berhasil!',
        'Saldo: '+_Pesantrian.parseNominal(saving-parseInt(nominal))
          +' ('+student_name+')',
        'success'
      );
      return;
    }
    let al=await _Pesantrian.alertX(
      'Error: Failed to pay the bill!',
      res,
      'error'
    );
};
this.billScannerForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  let date=(new Date).getDate(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  query='select * from shopm_qrbill where year='+year+' and month='+month+' and date='+date,
  title='QRScan Bill<br />'+_Pesantrian.parseDate([
    year,
    (month+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  total=0,
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  /* nominal span */
  let nspan=document.createElement('span');
  nspan.innerText=_Pesantrian.parseNominal(0);
  /* nominal */
  let nominal=document.createElement('input');
  nominal.type='number';
  nominal.name='nominal';
  nominal.placeholder='Nominal...';
  nominal.span=nspan;
  nominal.onkeyup=function(){
    nspan.innerText=_Pesantrian.parseNominal(this.value);
  };
  /* button */
  button=document.createElement('input');
  button.type='submit';
  button.value='Scan';
  button.classList.add('button-take');
  button.onclick=()=>{
    if(!nominal.value.match(/^\d+$/)){
      return _Pesantrian.alert('Error: Invalid nominal input!','','error');
    }
    this.billScanner(nominal.value,table);
  };
  /* row */
  row=this.row('Nominal',nominal,nspan,button);
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  this.app.body.append(table);
  /* each bill */
  let bills=await _Pesantrian.request('query',query);
  row=this.row('Bill ID','Nama Santri','Nominal','Waktu');
  table.append(row);
  row.classList.add('tr-head');
  for(let bill of bills){
    let bd=new Date(bill.time*1000),
    row=this.row(
      bill.id,
      bill.student_name,
      _Pesantrian.parseNominal(bill.nominal),
      [
        bd.getHours().toString().padStart(2,'0'),
        bd.getMinutes().toString().padStart(2,'0'),
        bd.getSeconds().toString().padStart(2,'0'),
      ].join(':'),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    total+=parseInt(bill.nominal,10);
    table.append(row);
  }
  /* total */
  row=this.row('','Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  table.dataset.total=total+'';
};

/* qrscanner -- check */
this.checkCredit=async function(){
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    loader.remove();
    if(blocked){
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
      return _Pesantrian.alert(
        _Pesantrian.parseNominal(saving),
        student_name,
        'info'
      );
};
this.getQueryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  res=[
    'date > "'+year+'-07-01"',
    'date < "'+(year+1)+'-06-30"',
  ];
  if(month<6){
    res=[
      'date > "'+(year-1)+'-07-01"',
      'date < "'+year+'-06-30"',
    ];
  }
  return res.join(' and ');
};
this.getSavingBalance=function(data=[]){
  let ndata=this.getFinanceByType(data,'saving'),
  total=0;
  for(let d of ndata){
    if(d.method==1){
      total+=parseInt(d.nominal);
    }else{
      total-=parseInt(d.nominal);
    }
  }return total;
};
this.getFinanceByType=function(data,type){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if(!res.hasOwnProperty(line.name)){
      res[line.name]=[];
    }
    res[line.name].push(line);
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
    }
  }
  return res.hasOwnProperty(type)?res[type]:[];
};


/* qrbill report */
this.billReport=async function(date,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  date=date||(new Date).getDate();
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  /* month and year and table */
  let query='select * from shopm_qrbill where year='
    +year+' and month='+month+' and date='+date
    +' ',
  title='Bill Report',
  total=0,
  loader=_Pesantrian.loader(),
  queries=[
    query,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* selector */
  let mdates=[31,year%4==0?29:28,31,30,31,30,31,31,30,31,30,31],
  sdate=document.createElement('select'),
  smonth=document.createElement('select'),
  syear=document.createElement('select');
  for(let yr of _Pesantrian.range(2024,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr;
    if(yr==year){
      opt.selected='selected';
    }
    syear.append(opt);
  }
  for(let mon in this.month){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon];
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  for(let dt of _Pesantrian.range(1,mdates[month])){
    let opt=document.createElement('option');
    opt.value=dt;
    opt.textContent=dt;
    if(dt==date){
      opt.selected='selected';
    }
    sdate.append(opt);
  }
  sdate.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  smonth.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  syear.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  row=this.row('Tahun',syear);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Tanggal',sdate);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  /* header */
  row=this.row('Tanggal','Nama Pelanggan','Nominal','ID');
  row.classList.add('tr-head');
  table.append(row);
  /* for each data */
  for(let bill of data[0]){
    let row=this.row(
      _Pesantrian.parseDatetime(bill.time*1000),
      bill.student_name,
      _Pesantrian.parseNominal(bill.nominal),
      bill.id,
    );
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-center');
    table.append(row);
    total+=parseInt(bill.nominal);
  }
  /* total */
  row=this.row('','Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  row.childNodes[2].classList.add('td-right');
  table.append(row);
};


/* keuangan */
this.addBill=function(month,year){
  this.clearBody();
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let lines=this.templateBill(),
  row=this.rowHead('INPUT TRANSAKSI<br />'
    +'Bulan '+this.month[month]+' '+year,2),
  table=this.table();
  table.append(row);
  lines.month=month;
  lines.year=year;
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.value=value;
    if(['month','year'].indexOf(key)>=0){
      val.type='hidden';
      this.app.body.append(val);
      continue;
    }else if(key=='method'){
      val=_Pesantrian.radioMethodBill(value);
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      val.type=key=='nominal'?'number':'text';
      val.placeholder=this.alias(key)+'...';
      val.classList.add('kitchen-find');
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableBill(month,year);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "shopm" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableBill(month,year);
      },1600);
    }
  };
  
};
this.tableBill=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=month?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from shopm where month='+month+' and year='+year,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  thisMonth=(new Date).getMonth(),
  thisYear=(new Date).getFullYear(),
  add=document.createElement('input'),
  title='KEUANGAN KANTIN<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row(
    'Tgl',
    'Keterangan',
    'Kredit',
    'Debet',
    year==thisYear&&month==thisMonth?add:'',
    'Nota',
  );
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.dataset.month=''+month;
  add.dataset.year=''+year;
  add.onclick=function(){
    _PesantrianShopm.addBill(this.dataset.month,this.dataset.year);
  };
  /* month selector */
  let monsel=document.createElement('select'),
  studyYear=thisMonth<6?[thisYear-1,thisYear]:[thisYear,thisYear+1];
  monsel.classList.add('extra-high');
  for(let eyear of _Pesantrian.range(2024,2030)){
    for(let mon of _Pesantrian.range(0,11)){
      let opt=document.createElement('option');
      opt.value=[mon,eyear].join(':');
      opt.textContent=this.month[mon]+' '+eyear;
      if(month==mon&&year==eyear){
        opt.selected='selected';
      }
      monsel.append(opt);
    }
  }
  monsel.onchange=async function(){
    let dval=this.value,
    val=dval.split(':');
    await _PesantrianShop.tableBill(val[0],val[1]);
  };
  row=this.row('',monsel);
  row.childNodes[1].setAttribute('colspan',5);
  table.append(row);
  let totalPlus=0,
  totalMinus=0;

  for(let item of items){
    let del=document.createElement('input'),
    detl=document.createElement('input');
    detl.type='submit';
    detl.value='Nota';
    detl.classList.add('button-detail');
    detl.dataset.id=item.id+'';
    detl.onclick=function(){
      _PesantrianShopm.evidencePage(this.dataset.id);
    };
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.dataset.method=item.method+'';
    del.dataset.nominal=item.nominal+'';
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id),
      tot=document.querySelector('tr#shop-total'),
      tel=document.querySelector('table#shop');
      if(!el||!tel){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from shopm where id='
          +this.dataset.id,
        totalPlus=parseInt(tel.dataset.plus),
        totalMinus=parseInt(tel.dataset.minus),
        nominal=parseInt(this.dataset.nominal),
        method=parseInt(this.dataset.method),
        res=await _Pesantrian.request('query',query);
        if(method==1){
          totalPlus-=nominal;
        }else{
          totalMinus-=nominal;
        }
        tel.dataset.plus=totalPlus+'';
        tel.dataset.minus=totalMinus+'';
        tot.childNodes[2].innerText=_Pesantrian.parseNominal(totalPlus);
        tot.childNodes[3].innerText=_Pesantrian.parseNominal(totalMinus);
        tot.childNodes[4].innerText=_Pesantrian.parseNominal(totalPlus-totalMinus);
        el.remove();
      });
    };
    let nominal=_Pesantrian.parseNominal(item.nominal),
    tgl=(new Date(item.time*1000)).getDate();
    if(item.method==1){
      row=this.row(
        tgl,item.name,nominal,'',
        year==thisYear&&month==thisMonth?del:'',
        detl,
      );
      totalPlus+=parseInt(item.nominal);
    }else{
      row=this.row(
        tgl,item.name,'',nominal,
        year==thisYear&&month==thisMonth?del:'',
        detl,
      );
      totalMinus+=parseInt(item.nominal);
    }
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  table.id='shop';
  table.dataset.plus=totalPlus+'';
  table.dataset.minus=totalMinus+'';
  
  row=this.row('','TOTAL',
    _Pesantrian.parseNominal(totalPlus),
    _Pesantrian.parseNominal(totalMinus),
    _Pesantrian.parseNominal(totalPlus-totalMinus),
    );
  row.childNodes[1].classList.add('extra-high');
  row.childNodes[4].setAttribute('colspan',2);
  row.classList.add('tr-head');
  row.id='shop-total';
  table.append(row);
  this.app.body.append(table);
};


this.templateBill=function(){
  return {
    name:'',
    nominal:0,
    method:0,
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
    evidence:'',
  };
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianShop */
;function PesantrianShop(app){
this.app=app;
this.aliasData={
  name:'Keterangan',
  nominal:'Nominal',
  method:'Arus Dana',
  evidence:'Bukti Transaksi',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.yearly=[
  6,7,8,9,10,11,
  0,1,2,3,4,5,
];
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'bill',
      title:'Keuangan',
      callback:function(e){
        _PesantrianShop.tableBill();
      }
    },
    {
      name:'form3',
      title:'Stock Opname',
      callback:function(e){
        _PesantrianShop.opname();
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianShop.billScannerForm();
      }
    },
    {
      name:'form4',
      title:'Report',
      callback:function(e){
        _PesantrianShop.billReport();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianShop.checkCredit();
      }
    },
  ],
  appsLower=[
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianShop.billScannerForm();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianShop.checkCredit();
      }
    },
  ],
  theapps=_Pesantrian.user.privilege>=4?apps:appsLower,
  adminApps=_Pesantrian.buildApps(theapps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianShop=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};


/* evidence page -- table shop */
this.evidencePage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  query='select id,evidence from shop where id='+id,
  data=await _Pesantrian.request('query',query,50),
  text='Error: Data #'+id+' tidak ditemukan!';
  if(data.length==0){
    _Pesantrian.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  let evi=this.evidencePath(data[0].evidence),
  pro=document.createElement('div'),
  pimg=new Image;
  pimg.src=evi!=''?evi:_Pesantrian.IMAGES['icon-error.png'];
  pimg.main=pro;
  pimg.dialog=dialog;
  pimg.style.maxWidth='100%';
  pro.append(pimg);
  pimg.onload=function(){
    this.dialog.blank();
    this.dialog.main.append(this.main);
  };
  pimg.onerror=function(){
    this.dialog.loader.src=_Pesantrian.IMAGES['icon-error.png'];
  };
};
this.evidencePath=function(fname){
  return _Pesantrian.eva.config.host
    +'pesantrian/finance/evidence/'+fname;
};

/* stock opname -- new database */
this.opname=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let title='STOCK OPNAME',
  row=this.rowHead(title,6),
  table=this.table();
  table.append(row);
  row=this.row(
    'NO',
    'Nama Barang',
    'Jenis Barang',
    'Satuan',
    'Harga Pokok', /* jumlah dan nilai */
    'Harga Jual Satuan', /* jumlah dan nilai */
  );
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);

};
this.opnameTamplate=function(){
  return {
    nama_barang:'',
    jenis_barang:'minuman',
    satuan:'',
    harga_pokok:0,
    harga_jual_satuan:0,
    persedian_awal:0, /* jumlah dan nilai */
    penjualan:0, /* jumlah dan nilai */
    barang_masuk:0, /* jumlah dan nilai */
    persediaan_akhir:0, /* jumlah dan nilai */
    persediaan_fisik:0, /* jumlah dan nilai */
    selisih_kurang_lebih:0, /* jumlah dan nilai */
  };
};

/* template jkm -- jurnal kas masuk */
this.templateJKM=function(){
  return {
    tanggal:'',
    keterangan:'',
    ref:'',
    debet:0, /* kas */
    kredit:0, /* penjualan, komisi konsinyasi, piutang, return pembelian */
    total:0, /* kas, penjualan dan komisi */
  };
};
/* template jkk -- jurnal kas keluar */
this.tempaleJKK=function(){
  return {
    tanggal:'',
    keterangan:'',
    ref:'',
    debet:0, /* pembelian, utang, akun, serba-serbi */ 
    kredit:0, /* kas, potongan pembelian */ 
    total:0, /* kas dan pembelian */
  };
};
/* laporan laba-rugi */
this.templateLabaRugi=function(){
  return {

  };
};


/* qrscanner -- bill */
this.billScanner=async function(nominal,table){
  nominal=nominal||1;
  nominal=parseInt(nominal,10);
  if(!nominal.toString().match(/^\d+$/)
    ||nominal<1){
    return await _Pesantrian.alertX('Error: Invalid nominal input!','','error');
  }
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    data={
      name:'saving',
      type,
      profile_id:student_id,
      method:0,
      nominal,
      date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      transaction_date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      month,
      year,
      status:'paid',
      account:'Tunai',
      uid:_Pesantrian.user.id,
      data:{"rincian":{}},
      report:'',
      explanation:'Belanja di Kantin',
      transaction_code:'qrbill_shop',
    },
    qrData={
      student_id,
      student_name,
      nominal,
      year,
      month,
      date,
    },
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='
        +student_id+' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    if(blocked){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
    if(saving<parseInt(nominal)){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Saldo tabungan tidak mencukupi!',
        'Saldo: '+_Pesantrian.parseNominal(saving)
          +' ('+student_name+')',
        'error'
      );
    }
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    qrInnerQuery=_Pesantrian.buildQuery(qrData),
    qrQuery='insert into shop_qrbill '+qrInnerQuery,
    query='insert into transaction '+innerQuery,
    res=await _Pesantrian.request('queries',[
      query,qrQuery
    ].join(';'));
    loader.remove();
    if(res.join('')==11){
        let row=this.row(
          'New Bill',
          student_name,
          _Pesantrian.parseNominal(nominal),
          [
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
            (new Date).getSeconds().toString().padStart(2,'0'),
          ].join(':'),
        ),
        lastRow=table.lastChild,
        total=parseInt(table.dataset.total,10)+nominal;
        row.childNodes[2].classList.add('td-right');
        lastRow.childNodes[2].innerText=_Pesantrian.parseNominal(total);
        table.insertBefore(row,lastRow);
        table.dataset.total=total+'';
      let al=await _Pesantrian.alertX(
        'Transaksi berhasil!',
        'Saldo: '+_Pesantrian.parseNominal(saving-parseInt(nominal))
          +' ('+student_name+')',
        'success'
      );
      return;
    }
    let al=await _Pesantrian.alertX(
      'Error: Failed to pay the bill!',
      res,
      'error'
    );
};
this.billScannerForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  let date=(new Date).getDate(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  query='select * from shop_qrbill where year='+year+' and month='+month+' and date='+date,
  title='QRScan Bill<br />'+_Pesantrian.parseDate([
    year,
    (month+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  total=0,
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  /* nominal span */
  let nspan=document.createElement('span');
  nspan.innerText=_Pesantrian.parseNominal(0);
  /* nominal */
  let nominal=document.createElement('input');
  nominal.type='number';
  nominal.name='nominal';
  nominal.placeholder='Nominal...';
  nominal.span=nspan;
  nominal.onkeyup=function(){
    nspan.innerText=_Pesantrian.parseNominal(this.value);
  };
  /* button */
  button=document.createElement('input');
  button.type='submit';
  button.value='Scan';
  button.classList.add('button-take');
  button.onclick=()=>{
    if(!nominal.value.match(/^\d+$/)){
      return _Pesantrian.alert('Error: Invalid nominal input!','','error');
    }
    this.billScanner(nominal.value,table);
  };
  /* row */
  row=this.row('Nominal',nominal,nspan,button);
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  this.app.body.append(table);
  /* each bill */
  let bills=await _Pesantrian.request('query',query);
  row=this.row('Bill ID','Nama Santri','Nominal','Waktu');
  table.append(row);
  row.classList.add('tr-head');
  for(let bill of bills){
    let bd=new Date(bill.time*1000),
    row=this.row(
      bill.id,
      bill.student_name,
      _Pesantrian.parseNominal(bill.nominal),
      [
        bd.getHours().toString().padStart(2,'0'),
        bd.getMinutes().toString().padStart(2,'0'),
        bd.getSeconds().toString().padStart(2,'0'),
      ].join(':'),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    total+=parseInt(bill.nominal,10);
    table.append(row);
  }
  /* total */
  row=this.row('','Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  table.dataset.total=total+'';
};

/* qrscanner -- check */
this.checkCredit=async function(){
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    loader.remove();
    if(blocked){
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
      return _Pesantrian.alert(
        _Pesantrian.parseNominal(saving),
        student_name,
        'info'
      );
};
this.getQueryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  res=[
    'date > "'+year+'-07-01"',
    'date < "'+(year+1)+'-06-30"',
  ];
  if(month<6){
    res=[
      'date > "'+(year-1)+'-07-01"',
      'date < "'+year+'-06-30"',
    ];
  }
  return res.join(' and ');
};
this.getSavingBalance=function(data=[]){
  let ndata=this.getFinanceByType(data,'saving'),
  total=0;
  for(let d of ndata){
    if(d.method==1){
      total+=parseInt(d.nominal);
    }else{
      total-=parseInt(d.nominal);
    }
  }return total;
};
this.getFinanceByType=function(data,type){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if(!res.hasOwnProperty(line.name)){
      res[line.name]=[];
    }
    res[line.name].push(line);
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
    }
  }
  return res.hasOwnProperty(type)?res[type]:[];
};


/* qrbill report */
this.billReport=async function(date,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  date=date||(new Date).getDate();
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  /* month and year and table */
  let query='select * from shop_qrbill where year='
    +year+' and month='+month+' and date='+date
    +' ',
  title='Bill Report',
  total=0,
  loader=_Pesantrian.loader(),
  queries=[
    query,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* selector */
  let mdates=[31,year%4==0?29:28,31,30,31,30,31,31,30,31,30,31],
  sdate=document.createElement('select'),
  smonth=document.createElement('select'),
  syear=document.createElement('select');
  for(let yr of _Pesantrian.range(2024,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr;
    if(yr==year){
      opt.selected='selected';
    }
    syear.append(opt);
  }
  for(let mon in this.month){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon];
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  for(let dt of _Pesantrian.range(1,mdates[month])){
    let opt=document.createElement('option');
    opt.value=dt;
    opt.textContent=dt;
    if(dt==date){
      opt.selected='selected';
    }
    sdate.append(opt);
  }
  sdate.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  smonth.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  syear.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  row=this.row('Tahun',syear);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Tanggal',sdate);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  /* header */
  row=this.row('Tanggal','Nama Pelanggan','Nominal','ID');
  row.classList.add('tr-head');
  table.append(row);
  /* for each data */
  for(let bill of data[0]){
    let row=this.row(
      _Pesantrian.parseDatetime(bill.time*1000),
      bill.student_name,
      _Pesantrian.parseNominal(bill.nominal),
      bill.id,
    );
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-center');
    table.append(row);
    total+=parseInt(bill.nominal);
  }
  /* total */
  row=this.row('','Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  row.childNodes[2].classList.add('td-right');
  table.append(row);
};


/* keuangan */
this.addBill=function(month,year){
  this.clearBody();
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let lines=this.templateBill(),
  row=this.rowHead('INPUT TRANSAKSI<br />'
    +'Bulan '+this.month[month]+' '+year,2),
  table=this.table();
  table.append(row);
  lines.month=month;
  lines.year=year;
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.value=value;
    if(['month','year'].indexOf(key)>=0){
      val.type='hidden';
      this.app.body.append(val);
      continue;
    }else if(key=='method'){
      val=_Pesantrian.radioMethodBill(value);
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      val.type=key=='nominal'?'number':'text';
      val.placeholder=this.alias(key)+'...';
      val.classList.add('kitchen-find');
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableBill(month,year);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "shop" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableBill(month,year);
      },1600);
    }
  };
  
};
this.tableBill=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=month?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from shop where month='+month+' and year='+year,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  thisMonth=(new Date).getMonth(),
  thisYear=(new Date).getFullYear(),
  add=document.createElement('input'),
  title='KEUANGAN KANTIN<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row(
    'Tgl',
    'Keterangan',
    'Kredit',
    'Debet',
    year==thisYear&&month==thisMonth?add:'',
    'Nota',
  );
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.dataset.month=''+month;
  add.dataset.year=''+year;
  add.onclick=function(){
    _PesantrianShop.addBill(this.dataset.month,this.dataset.year);
  };
  /* month selector */
  let monsel=document.createElement('select'),
  studyYear=thisMonth<6?[thisYear-1,thisYear]:[thisYear,thisYear+1];
  monsel.classList.add('extra-high');
  for(let eyear of _Pesantrian.range(2024,2030)){
    for(let mon of _Pesantrian.range(0,11)){
      let opt=document.createElement('option');
      opt.value=[mon,eyear].join(':');
      opt.textContent=this.month[mon]+' '+eyear;
      if(month==mon&&year==eyear){
        opt.selected='selected';
      }
      monsel.append(opt);
    }
  }
  monsel.onchange=async function(){
    let dval=this.value,
    val=dval.split(':');
    await _PesantrianShop.tableBill(val[0],val[1]);
  };
  row=this.row('',monsel);
  row.childNodes[1].setAttribute('colspan',5);
  table.append(row);
  let totalPlus=0,
  totalMinus=0;

  for(let item of items){
    let del=document.createElement('input'),
    detl=document.createElement('input');
    detl.type='submit';
    detl.value='Nota';
    detl.classList.add('button-detail');
    detl.dataset.id=item.id+'';
    detl.onclick=function(){
      _PesantrianShop.evidencePage(this.dataset.id);
    };
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.dataset.method=item.method+'';
    del.dataset.nominal=item.nominal+'';
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id),
      tot=document.querySelector('tr#shop-total'),
      tel=document.querySelector('table#shop');
      if(!el||!tel){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from shop where id='
          +this.dataset.id,
        totalPlus=parseInt(tel.dataset.plus),
        totalMinus=parseInt(tel.dataset.minus),
        nominal=parseInt(this.dataset.nominal),
        method=parseInt(this.dataset.method),
        res=await _Pesantrian.request('query',query);
        if(method==1){
          totalPlus-=nominal;
        }else{
          totalMinus-=nominal;
        }
        tel.dataset.plus=totalPlus+'';
        tel.dataset.minus=totalMinus+'';
        tot.childNodes[2].innerText=_Pesantrian.parseNominal(totalPlus);
        tot.childNodes[3].innerText=_Pesantrian.parseNominal(totalMinus);
        tot.childNodes[4].innerText=_Pesantrian.parseNominal(totalPlus-totalMinus);
        el.remove();
      });
    };
    let nominal=_Pesantrian.parseNominal(item.nominal),
    tgl=(new Date(item.time*1000)).getDate();
    if(item.method==1){
      row=this.row(
        tgl,item.name,nominal,'',
        year==thisYear&&month==thisMonth?del:'',
        detl,
      );
      totalPlus+=parseInt(item.nominal);
    }else{
      row=this.row(
        tgl,item.name,'',nominal,
        year==thisYear&&month==thisMonth?del:'',
        detl,
      );
      totalMinus+=parseInt(item.nominal);
    }
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  table.id='shop';
  table.dataset.plus=totalPlus+'';
  table.dataset.minus=totalMinus+'';
  
  row=this.row('','TOTAL',
    _Pesantrian.parseNominal(totalPlus),
    _Pesantrian.parseNominal(totalMinus),
    _Pesantrian.parseNominal(totalPlus-totalMinus),
    );
  row.childNodes[1].classList.add('extra-high');
  row.childNodes[4].setAttribute('colspan',2);
  row.classList.add('tr-head');
  row.id='shop-total';
  table.append(row);
  this.app.body.append(table);
};


this.templateBill=function(){
  return {
    name:'',
    nominal:0,
    method:0,
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
    evidence:"",
  };
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianLaundry */
;function PesantrianLaundry(app){
this.app=app;
this.aliasData={
  student:'Santri',
  employee:'Karyawan',
  nominal:'Nominal',
  kind:'Jenis',
  weight:'Berat',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.credit=100; /* means 100k */
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  let apps=[
    {
      name:'student',
      title:'Santri',
      callback:function(e){
        _PesantrianLaundry.tableLaundry('student');
      }
    },
    {
      name:'employee',
      title:'Karyawan',
      callback:function(e){
        _PesantrianLaundry.tableLaundry('employee');
      }
    },
    {
      name:'bill',
      title:'Laporan',
      callback:function(e){
        _PesantrianLaundry.monthlyReport('student');
      }
    },
    {
      name:'bill',
      title:'Laporan Karyawan',
      callback:function(e){
        _PesantrianLaundry.monthlyReport('employee');
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianLaundry.billScanner();
      }
    },
    {
      name:'form4',
      title:'Report',
      callback:function(e){
        _PesantrianLaundry.billReport();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianLaundry.checkCredit();
      }
    },
    {
      name:'employee',
      title:'Non-Subsidi',
      callback:function(e){
        _PesantrianLaundry.tableLaundryNon();
      }
    },
    {
      name:'form4',
      title:'Laporan Non-Subsidi',
      callback:function(e){
        _PesantrianLaundry.monthlyReportNon('employee');
      }
    },
  ],
  allowed=['laundry','finance'];
  if(allowed.indexOf(_Pesantrian.user.profile.position)<0
    &&_Pesantrian.user.privilege<16){
    apps=[
      {
        name:'finance',
        title:'Saldo Subsidi',
        callback:function(e){
          _PesantrianLaundry.tableSaldo();
        }
      },
      {
        name:'finance',
        title:'Utang Laundry',
        callback:function(e){
          if(true){
            _PesantrianLaundry.tableUtangTotal();
            return;
          }
          let month=(new Date).getMonth(),
          year=(new Date).getFullYear();
          _PesantrianLaundry.tableUtang(month,year);
          if(month==0){
            month=11;
            year=year-1;
          }else{
            month-=1;
          }
        }
      },
    ];
  }
  
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianLaundry=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* qrscanner -- bill */
this.billScanner=async function(dmonth,dyear){
  dmonth=typeof dmonth==='number'?dmonth:(new Date).getMonth();
  dyear=dyear||(new Date).getFullYear();
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    explanation=dmonth==month?'Pembayaran laundry.'
      :'Pelunasan laundry bulan '+this.month[dmonth]+'.',
    data={
      name:'saving',
      type,
      profile_id:student_id,
      method:0,
      nominal:0,
      date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      transaction_date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      month,
      year,
      status:'paid',
      account:'Tunai',
      uid:_Pesantrian.user.id,
      data:{"rincian":{}},
      report:'',
      explanation,
      transaction_code:'qrbill_laundry',
    },
    dataLaundry={
      type,
      profile_id:student_id,
      nominal:0,
      year:dyear,
      month:dmonth,
      flow:1,
      kind:(
        dmonth==month
          ?'Pembayaran laundry'
          :'Pelunasan laundry bulan '+this.month[dmonth]
        )
        +' dari tabungan.',
    },
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from laundry where profile_id='+student_id
        +' and type="'+type
        +'" and month='+dmonth
        +' and year='+dyear,
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+dyear
        +' and month='+dmonth,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    credit=this.getCredit(student_id,pdata[1],'student'),
    blocked=pdata[2].length>0?true:false,
    nominal=credit*-1;
    if(blocked){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
    if(credit>=0){
      loader.remove();
      return _Pesantrian.alert(
        'Tidak ada yang perlu dibayar!',
        'Saldo: '+_Pesantrian.parseNominal(saving)
          +' ('+student_name+')',
        'info'
      );
    }
    if(saving<parseInt(nominal)){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Saldo tabungan tidak mencukupi!',
        'Saldo: '+_Pesantrian.parseNominal(saving)
          +' ('+student_name+')',
        'error'
      );
    }
    /* prepare new nominal */
    data.nominal=nominal;
    dataLaundry.nominal=nominal;
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    innerQueryLaundry=_Pesantrian.buildQuery(dataLaundry);
    queries=[
      'insert into transaction '+innerQuery,
      'insert into laundry '+innerQueryLaundry,
    ].join(';');
    let res=await _Pesantrian.request('queries',queries);
    loader.remove();
    if(res.join('')==11){
      let al=await _Pesantrian.alertX(
        'Transaksi berhasil!',
        'Saldo: '+_Pesantrian.parseNominal(saving-parseInt(nominal))
          +' ('+student_name+')',
        'success'
      );
      return;
    }
    let al=await _Pesantrian.alertX(
      'Error: Failed to pay the bill!',
      res,
      'error'
    );
};

/* qrscanner -- check */
this.checkCredit=async function(){
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    loader.remove();
    if(blocked){
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
      return _Pesantrian.alert(
        _Pesantrian.parseNominal(saving),
        student_name,
        'info'
      );
};
this.getQueryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  res=[
    'date > "'+year+'-07-01"',
    'date < "'+(year+1)+'-06-30"',
  ];
  if(month<6){
    res=[
      'date > "'+(year-1)+'-07-01"',
      'date < "'+year+'-06-30"',
    ];
  }
  return res.join(' and ');
};
this.getSavingBalance=function(data=[]){
  let ndata=this.getFinanceByType(data,'saving'),
  total=0;
  for(let d of ndata){
    if(d.method==1){
      total+=parseInt(d.nominal);
    }else{
      total-=parseInt(d.nominal);
    }
  }return total;
};
this.getFinanceByType=function(data,type){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if(!res.hasOwnProperty(line.name)){
      res[line.name]=[];
    }
    res[line.name].push(line);
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
    }
  }
  return res.hasOwnProperty(type)?res[type]:[];
};

/* qrbill report */
this.billReport=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  /* month and year and table */
  let date=(new Date).getDate(),
  query='select * from transaction where year='
    +year+' and month='+month
    +' and transaction_code="qrbill_laundry"',
  title='Bill Report',
  total=0,
  loader=_Pesantrian.loader(),
  queries=[
    query,
    'select id,name from student',
    'select id,name from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* selector */
  let smonth=document.createElement('select'),
  syear=document.createElement('select');
  for(let yr of _Pesantrian.range(2024,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr;
    if(yr==year){
      opt.selected='selected';
    }
    syear.append(opt);
  }
  for(let mon in this.month){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon];
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  smonth.onchange=()=>{
    this.billReport(
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  syear.onchange=()=>{
    this.billReport(
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  row=this.row('Tahun',syear);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Bulan',smonth);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  /* header */
  row=this.row('Tanggal','Nama Pelanggan','Nominal','ID');
  row.classList.add('tr-head');
  table.append(row);
  /* for each data */
  for(let bill of data[0]){
    let row=this.row(
      _Pesantrian.parseDatetime(bill.time*1000),
      _Pesantrian.getValueByKey(
        'id',
        bill.profile_id,
        'name',
        bill.type=='student'?data[1]:data[2],
      ),
      _Pesantrian.parseNominal(bill.nominal),
      bill.id,
    );
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-center');
    table.append(row);
    total+=parseInt(bill.nominal);
  }
  /* total */
  row=this.row('','Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  row.childNodes[2].classList.add('td-right');
  table.append(row);
};


/* non-division of laundry */
this.tableNonSubsidy__notused=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableUtangTotal();
    })
  );
  year=year||(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  thisYear=(new Date).getFullYear(),
  query='select id,name,live_in from employee where live_in=1 and id='+_Pesantrian.user.profile.id,
  queries=[
    query,
    'select * from laundry_non where type="employee" and year='
      +year+' and month='+month+' and profile_id='
      +_Pesantrian.user.profile_id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundriesNon=data[1],
  credit=this.getCredit(_Pesantrian.user.profile.id,laundriesNon),
  saldo=document.createElement('span');
  loader.remove();
  if(users.length==0){
    credit=0;
  }
  saldo.innerText=_Pesantrian.parseNominal(credit);
  let tstate=credit>=0
      ?'TIDAK ADA UTANG'
      :_Pesantrian.parseNominal(credit*-1),
  title='Utang Laundry Non-Subsidi'
    +'<br />Bulan '+this.month[month]+' '+year
    +'<br /><span class="credit-'+(credit>=0?'plus':'minus')
    +'">['+tstate+']</span>',
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  
  /* month selector */
  let prev=document.createElement('select');
  prev.dataset.year=thisYear+'';
  for(let i=0;i<12;i++){
    let mon=thisMonth-i,
    dyear=mon<0?thisYear-1:thisYear,
    opt=document.createElement('option');
    mon+=mon<0?12:0;
    opt.value=thisMonth-i;
    opt.textContent=this.month[mon]+' '+dyear;
    if(mon==month){
      opt.selected='selected';
    }
    prev.append(opt);
  }
  prev.onchange=async function(){
    let mon=parseInt(this.value),
    year=parseInt(this.dataset.year),
    dyear=mon<0?year-1:year,
    opt=document.createElement('option');
    mon+=mon<0?12:0;
    
    await _PesantrianLaundry.tableUtang(
      mon,
      dyear,
    );
  };
  
  row=this.row(prev);
  row.childNodes[0].setAttribute('colspan',4);
  table.append(row);
  
  row=this.row('Tanggal','Nominal Pemakaian','Jenis','Berat');
  row.classList.add('tr-head');
  table.append(row);
  
  total=0;
  for(let laun of laundriesNon){
    row=this.row(
      _Pesantrian.parseDate(laun.time*1000),
      _Pesantrian.parseNominal(laun.nominal),
      laun.kind,
      laun.weight
    );
    row.childNodes[1].classList.add('td-right');
    table.append(row);
    total+=parseInt(laun.nominal);
  }
  row=this.row('','','','');
  table.append(row);
  
  row=this.row('Total Utang',_Pesantrian.parseNominal(credit>=0?0:credit*-1),'','');
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
};
this.tableUtangTotal=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  thisYear=(new Date).getFullYear(),
  queries=[
    'select id,name,live_in from employee where live_in=1 and id='
      +_Pesantrian.user.profile.id,
    'select * from laundry where type="employee" and profile_id='
      +_Pesantrian.user.profile_id,
    'select * from laundry_non where type="employee" and profile_id='
      +_Pesantrian.user.profile_id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  laundriesNon=data[2],
  noTrans=laundries.length==0&&laundriesNon.length==0,
  saldo=document.createElement('span');
  loader.remove();
  /* title and table */
  let title='Utang Laundry'
    +'<br />12 bulan terakhir',
  gtotal=0,
  rowHead=this.rowHead(title,5),
  table=this.table();
  table.append(rowHead);
  this.app.body.append(table);
  /* */
  let row=this.row('Month','Subsidy','Non-Subsidy','Total','Detail');
  row.classList.add('tr-head');
  table.append(row);
  
  /* */
  for(let i=0;i<12;i++){
    let mon=thisMonth-i,
    dyear=mon<0?thisYear-1:thisYear;
    mon+=mon<0?12:0;
    let credit=this.getUtangMonthly(mon,dyear,laundries,true),
    creditNon=this.getUtangMonthly(mon,dyear,laundriesNon,false),
    total=credit+creditNon,
    detail=document.createElement('input'),
    row=this.row(
      this.month[mon]+' '+dyear,
      _Pesantrian.parseNominal(credit<0?credit*-1:0),
      _Pesantrian.parseNominal(creditNon<0?creditNon*-1:0),
      _Pesantrian.parseNominal(total<0?total*-1:0),
      detail,
    );
    row.childNodes[1].classList.add('td-right');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    table.append(row);
    gtotal+=total;
    /* detail */
    detail.dataset.month=mon;
    detail.dataset.year=dyear;
    detail.classList.add('button-view');
    detail.type='submit';
    detail.type='submit';
    detail.value='Detail';
    detail.onclick=function(){
      _PesantrianLaundry.tableUtang(
        parseInt(this.dataset.month),
        parseInt(this.dataset.year),
      );
    };
  }
  /* grand total */
  row=this.row(
    'Grand Total Utang',
    _Pesantrian.parseNominal(gtotal<0?gtotal*-1:0),
    '',
  );
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  /* header */
  rowHead.childNodes[0].innerHTML+='<br />'
    +'<span class="credit-'+(gtotal<0?'minus':'plus')+'">['
    +(gtotal<0?_Pesantrian.parseNominal(gtotal*-1)
      :'TIDAK ADA UTANG')
    +']</span>';
};
this.tableUtang=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableUtangTotal();
    })
  );
  year=year||(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  thisYear=(new Date).getFullYear(),
  query='select id,name,live_in from employee where live_in=1 and id='+_Pesantrian.user.profile.id,
  queries=[
    query,
    'select * from laundry where type="employee" and year='
      +year+' and month='+month+' and profile_id='
      +_Pesantrian.user.profile_id,
    'select * from laundry_non where type="employee" and year='
      +year+' and month='+month+' and profile_id='
      +_Pesantrian.user.profile_id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  laundriesNon=data[2],
  credit=this.getCredit(_Pesantrian.user.profile.id,laundries,'employee'),
  creditNon=this.getCredit(_Pesantrian.user.profile.id,laundriesNon),
  creditTotal=creditNon+(credit<0?credit:0),
  noTrans=laundries.length==0&&laundriesNon.length==0,
  saldo=document.createElement('span');
  loader.remove();
  if(users.length==0){
    credit=0;
  }
  saldo.innerText=_Pesantrian.parseNominal(credit);
  let tstate=creditTotal>=0
      ?'TIDAK ADA UTANG'
      :_Pesantrian.parseNominal(creditTotal*-1),
  title='Utang Laundry'
    +'<br />Bulan '+this.month[month]+' '+year
    +'<br /><span class="credit-'+(creditTotal>=0?'plus':'minus')
    +'">['+tstate+']</span>',
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  
  /* month selector */
  let prev=document.createElement('select');
  prev.dataset.year=thisYear+'';
  for(let i=0;i<12;i++){
    let mon=thisMonth-i,
    dyear=mon<0?thisYear-1:thisYear,
    opt=document.createElement('option');
    mon+=mon<0?12:0;
    opt.value=thisMonth-i;
    opt.textContent=this.month[mon]+' '+dyear;
    if(mon==month){
      opt.selected='selected';
    }
    prev.append(opt);
  }
  prev.onchange=async function(){
    let mon=parseInt(this.value),
    year=parseInt(this.dataset.year),
    dyear=mon<0?year-1:year,
    opt=document.createElement('option');
    mon+=mon<0?12:0;
    
    await _PesantrianLaundry.tableUtang(
      mon,
      dyear,
    );
  };
  
  row=this.row(prev);
  row.childNodes[0].setAttribute('colspan',4);
  table.append(row);
  
  row=this.row('Tanggal','Nominal Pemakaian','Jenis','Berat');
  row.classList.add('tr-head');
  table.append(row);
  
  let total=0;
  for(let laun of laundries){
    row=this.row(
      _Pesantrian.parseDate(laun.time*1000),
      _Pesantrian.parseNominal(laun.nominal),
      laun.kind,
      laun.weight
    );
    row.childNodes[1].classList.add('td-right');
    table.append(row);
    total+=parseInt(laun.nominal);
  }
  row=this.row('','','','');
  table.append(row);
  
  row=this.row('Jumlah Pemakaian',_Pesantrian.parseNominal(total),'','');
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  
  row=this.row('Sisa Subsidi',saldo,'','');
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  
  row=this.row('','','','');
  table.append(row);
  
  row=this.row('Non-Subsidi');
  row.classList.add('tr-head');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].classList.add('td-center');
  table.append(row);
  
  total=0;
  for(let laun of laundriesNon){
    row=this.row(
      _Pesantrian.parseDate(laun.time*1000),
      _Pesantrian.parseNominal(laun.nominal),
      laun.kind,
      laun.weight
    );
    row.childNodes[1].classList.add('td-right');
    table.append(row);
    total+=parseInt(laun.nominal);
  }
  row=this.row('','','','');
  table.append(row);
  
  row=this.row('Total Utang',_Pesantrian.parseNominal(creditTotal>=0?0:creditTotal*-1),'','');
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
};
this.tableSaldo=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  query='select id,name,live_in from employee where live_in=1 and id='+_Pesantrian.user.profile.id,
  queries=[
    query,
    'select * from laundry where type="employee" and year='
    +year+' and month='+month+' and profile_id='
    +_Pesantrian.user.profile_id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  credit=this.getCredit(_Pesantrian.user.profile.id,laundries,'employee'),
  saldo=document.createElement('span');
  loader.remove();
  if(users.length==0){
    credit=0;
  }
  saldo.innerText=_Pesantrian.parseNominal(credit);
  let title='Saldo Subsidi Laundry'
    +'<br />Bulan '+this.month[month]+' '+year,
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  row=this.row('Tanggal','Nominal Pemakaian','Jenis','Berat');
  row.classList.add('tr-head');
  table.append(row);
  for(let laun of laundries){
    row=this.row(
      _Pesantrian.parseDate(laun.time*1000),
      _Pesantrian.parseNominal(laun.nominal),
      laun.kind,
      laun.weight
    );
    table.append(row);
  }
  row=this.row('','','','');
  table.append(row);
  row=this.row('Saldo Subsidi',saldo,'','');
  row.classList.add('tr-head');
  table.append(row);
};
this.getUtangMonthly=function(month,year,data=[],subsidy=false){
  year=year||(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let credit=subsidy?this.credit*1000:0;
  for(let d of data){
    if(d.month!=month||d.year!=year){
      continue;
    }
    if(d.flow==1){
      credit+=parseInt(d.nominal,10);
    }else{
      credit-=parseInt(d.nominal,10);
    }
  }
  if(subsidy){
    return credit<0?credit:0;
  }
  return credit;
};



/* non-subsidi laundry */
this.monthlyReportNon=async function(type='employee',month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  query=type=='student'
    ?(_Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management)
    :'select id,name,live_in from employee where live_in=1',
  queries=[
    query,
    'select * from laundry_non where type="'+type+'" and year='
    +year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  back=document.createElement('input'),
  totalCredit=0,
  totalDebt=0,
  title='Laporan Laundry Non-Subsidi '+this.alias(type)
    +'<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama '+this.alias(type),'Debet','Kredit','Balance');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);

  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=()=>{
    this.init();
  };

  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  
  let prev=document.createElement('select'),
  thisYear=(new Date).getFullYear();
  prev.dataset.year=year+'';
  prev.dataset.month=month+'';
  prev.dataset.type=type;
  for(let nyear of [thisYear-1,thisYear]){
    for(let mon in this.month){
      let opt=document.createElement('option');
      opt.value=[mon,nyear].join(':');
      opt.textContent=this.month[mon]+' '+nyear;
      if(mon==month&&nyear==year){
        opt.selected='selected';
      }
      prev.append(opt);
    }
  }
  prev.onchange=async function(){
    let val=this.value.split(':');
    await _PesantrianLaundry.monthlyReportNon(
      this.dataset.type,
      parseInt(val[0]),
      parseInt(val[1]),
    );
  };
  
  row=this.row('',find,'','',prev);
  table.append(row);
  let totalBalance=0;

  for(let user of users){
    let credit=this.getCreditFlow(user.id,laundries,type,1);
    let debt=this.getCreditFlow(user.id,laundries,type,0),
    bal=credit-debt,
    rbal=document.createElement('span');
    rbal.innerText=_Pesantrian.parseNominal(bal);
    rbal.classList.add(bal>=0?'credit-plus':'credit-minus');
    row=this.row(
      user.id,
      user.name,
      _Pesantrian.parseNominal(debt),
      _Pesantrian.parseNominal(credit),
      rbal,
    );
    row.dataset.name=user.name;
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    table.append(row);
    totalCredit+=credit;
    totalDebt+=debt;
  }
  let balance=totalCredit-totalDebt,
  bspan=document.createElement('span');
  bspan.innerText=_Pesantrian.parseNominal(balance);
  bspan.classList.add(balance>=0?'credit-plus':'credit-minus');
  row=this.row(
    'Grand Total',
    _Pesantrian.parseNominal(totalDebt),
    _Pesantrian.parseNominal(totalCredit),
    bspan,
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
};
this.addLaundryNon=function(id,name){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDetailNon(id);
    })
  );
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  data={
    nominal:0,
    kind:'Cuci saja',
    weight:'',
  },
  row=this.rowHead('LAUNDRY<br />'
    +name+' (Non-Subsidi)'),
  table=this.table();
  table.append(row);
  for(let key in data){
    let value=data[key],
    val=document.createElement('input');
    val.name=key;
    val.placeholder=this.alias(key)+'...';
    val.value=value;
    val.type=key=='nominal'?'number':'text';
    val.classList.add('extra-high');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.profile_id=id;
    data.type='employee';
    data.year=year;
    data.month=month;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "laundry_non" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableDetailNon(id);
      },1600);
    }
  };
};
this.tableDetailNon=async function(id,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableLaundryNon(month,year);
    })
  );
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  query='select id,name from employee where id='+id,
  queries=[
    query,
    'select * from laundry_non where type="employee" and profile_id='
      +id+' and year='+year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  user=data[0][0],
  laundries=data[1],
  title='Laundry '+user.name+' (Non-Subsidi)'
    +'<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  add=document.createElement('input'),
  subsidy=0,
  total=0,
  table=this.table();
  loader.remove();
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addLaundryNon(id,user.name);
  };
  row=this.row('Tanggal','Nominal','Jenis','Berat',month==thisMonth?add:'');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of laundries){
    let pr=document.createElement('span');
    pr.innerText=_Pesantrian.parseNominal(line.flow==1?line.nominal:-line.nominal);
    pr.classList.add(line.flow==1?'credit-plus':'credit-minus');
    row=this.row(
      _Pesantrian.parseDate(parseInt(line.time)*1000),
      pr,
      line.kind,
      line.weight,
      line.id
    );
    row.childNodes[1].classList.add('td-right');
    table.append(row);
    if(line.flow==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
  }
  /* total */
  row=this.row('Total',
    _Pesantrian.parseNominal(total),
    '','',''
  );
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  
};
this.tableLaundryNon=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  query='select id,name,live_in from employee where live_in=1',
  queries=[
    query,
    'select * from laundry_non where type="employee" and year='
    +year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  back=document.createElement('input'),
  title='Laundry Non-Subsidi'
    +'<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Karyawan','Saldo','',back);
  row.classList.add('tr-head');
  table.append(row);

  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=()=>{
    this.init();
  };
  /* finder */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  /* prev month */
  let prev=document.createElement('select'),
  thisYear=(new Date).getFullYear();
  prev.dataset.year=year+'';
  prev.dataset.month=month+'';
  for(let nyear of [thisYear-1,thisYear]){
    for(let mon in this.month){
      let opt=document.createElement('option');
      opt.value=[mon,nyear].join(':');
      opt.textContent=this.month[mon]+' '+nyear;
      if(mon==month&&nyear==year){
        opt.selected='selected';
      }
      prev.append(opt);
    }
  }
  prev.onchange=async function(){
    let val=this.value.split(':');
    await _PesantrianLaundry.tableLaundryNon(
      parseInt(val[0]),
      parseInt(val[1]),
    );
  };
  /* find saldo */
  let findsaldo=_Pesantrian.findInput('saldo','number','Saldo...');
  row=this.row('',find,findsaldo,'',prev);
  table.append(row);

  for(let user of users){
    let credit=this.getCredit(user.id,laundries),
    add=document.createElement('input'),
    lunasin=document.createElement('input'),
    putLunasin=credit==0?'-':(credit<0?lunasin:'-'),
    saldo=document.createElement('span');
    saldo.innerText=_Pesantrian.parseNominal(credit);
    saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
    saldo.id='credit-'+user.id;
    row=this.row(user.id,user.name,saldo,putLunasin,add);
    row.dataset.name=user.name;
    row.dataset.saldo=_Pesantrian.parseNominal(credit);
    row.childNodes[2].classList.add('td-right');
    table.append(row);
    /* lunasin button */
    lunasin.type='submit';
    lunasin.value=month==thisMonth?'Bayar':'Lunasi';
    lunasin.classList.add('button-taken');
    lunasin.dataset.profile_id=user.id;
    lunasin.dataset.name=user.name;
    lunasin.dataset.type='employee';
    lunasin.dataset.credit=credit+'';
    lunasin.dataset.month=month;
    lunasin.dataset.year=year;
    lunasin.onclick=async function(){
      _PesantrianLaundry.bayarinNon(this);
    };
    /* add button --> detail button */
    add.type='submit';
    add.value='Buka';
    add.classList.add('button-take');
    add.dataset.profile_id=user.id;
    add.dataset.name=user.name;
    add.dataset.credit=credit;
    add.dataset.month=month;
    add.dataset.year=year;
    add.onclick=function(){
      _PesantrianLaundry.tableDetailNon(
        this.dataset.profile_id,
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
  }
  this.app.body.append(table);
};
this.bayarinNon=async function(el){
  let nominal=await _Pesantrian.promptX(
    'Bayar Laundry?',
    'Non-Subsidi: '+el.dataset.name
      +''
  );
  if(!nominal){return;}
  el.disabled=true;
  el.value='Membayar...';
  //month=typeof month==='number'?month:(new Date).getMonth();
  //year=year||(new Date).getFullYear();
  let credit=parseInt(el.dataset.credit),
  year=parseInt(el.dataset.year),
  month=parseInt(el.dataset.month),
  saldo=document.getElementById('credit-'+el.dataset.profile_id),
  data={
    type:el.dataset.type,
    profile_id:el.dataset.profile_id,
    nominal:nominal,
    year:year,
    month:month,
    flow:1,
    kind:'Pembayaran laundry.',
  },
  innerQuery=_Pesantrian.buildQuery(data),
  query='insert into laundry_non '+innerQuery,
  loader=_Pesantrian.loader(),
  res=await _Pesantrian.request('query',query);
  loader.remove();
  credit=parseInt(credit)+parseInt(nominal);
  saldo.classList.remove('credit-plus');
  saldo.classList.remove('credit-minus');
  saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
  saldo.innerText=_Pesantrian.parseNominal(credit);
  el.dataset.credit=credit;
  el.disabled=false;
  el.value='Bayar';
  if(credit>=0){
    let pr=el.parentNode;
    el.remove();
    pr.innerText='-';
  }
};


/* normal laundry */
this.monthlyReport=async function(type='student',month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  query=type=='student'
    ?(_Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management)
    :'select id,name,live_in from employee where live_in=1',
  queries=[
    query,
    'select * from laundry where type="'+type+'" and year='
    +year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  back=document.createElement('input'),
  totalCredit=0,
  totalDebt=0,
  title='Laporan Laundry '+this.alias(type)
    +'<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama '+this.alias(type),'Debet','Kredit','Balance');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);

  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=()=>{
    this.init();
  };

  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  
  let prev=document.createElement('select'),
  thisYear=(new Date).getFullYear();
  prev.dataset.year=year+'';
  prev.dataset.month=month+'';
  prev.dataset.type=type;
  for(let nyear of [thisYear-1,thisYear]){
    for(let mon in this.month){
      let opt=document.createElement('option');
      opt.value=[mon,nyear].join(':');
      opt.textContent=this.month[mon]+' '+nyear;
      if(mon==month&&nyear==year){
        opt.selected='selected';
      }
      prev.append(opt);
    }
  }
  prev.onchange=async function(){
    let val=this.value.split(':');
    await _PesantrianLaundry.monthlyReport(
      this.dataset.type,
      parseInt(val[0]),
      parseInt(val[1]),
    );
  };
  
  row=this.row('',find,'','',prev);
  table.append(row);
  let totalBalance=0;

  for(let user of users){
    let credit=this.getCreditFlow(user.id,laundries,type,1);
    if(type=='employee'){
      credit+=this.credit*1000;
    }
    let debt=this.getCreditFlow(user.id,laundries,type,0),
    bal=credit-debt,
    rbal=document.createElement('span');
    rbal.innerText=_Pesantrian.parseNominal(bal);
    rbal.classList.add(bal>=0?'credit-plus':'credit-minus');
    row=this.row(
      user.id,
      user.name,
      _Pesantrian.parseNominal(debt),
      _Pesantrian.parseNominal(credit),
      rbal,
    );
    row.dataset.name=user.name;
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    table.append(row);
    totalCredit+=credit;
    totalDebt+=debt;
    if(type=='employee'&&bal<0){
      totalBalance+=bal;
    }
  }
  if(type=='employee'){
    totalCredit-=(this.credit*1000)*users.length;
  }
  let balance=type=='employee'?totalBalance:totalCredit-totalDebt,
  bspan=document.createElement('span');
  bspan.innerText=_Pesantrian.parseNominal(balance);
  bspan.classList.add(balance>=0?'credit-plus':'credit-minus');
  row=this.row(
    'Grand Total',
    _Pesantrian.parseNominal(totalDebt),
    _Pesantrian.parseNominal(totalCredit),
    bspan,
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
};
this.addLaundry=function(id,type,name){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableDetail(id,type);
    })
  );
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  data={
    nominal:0,
    kind:'Cuci saja',
    weight:'',
  },
  row=this.rowHead('LAUNDRY<br />'
    +name+' ('+this.alias(type)+')'),
  table=this.table();
  table.append(row);
  for(let key in data){
    let value=data[key],
    val=document.createElement('input');
    val.name=key;
    val.placeholder=this.alias(key)+'...';
    val.value=value;
    val.type=key=='nominal'?'number':'text';
    val.classList.add('extra-high');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.profile_id=id;
    data.type=type;
    data.year=year;
    data.month=month;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "laundry" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableDetail(id,type);
      },1600);
    }
  };
};
this.tableDetail=async function(id,type='student',month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableLaundry(type,month,year);
    })
  );
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  query=type=='student'
    ?'select id,name from student where id='+id
    :'select id,name from employee where id='+id,
  queries=[
    query,
    'select * from laundry where type="'+type+'" and profile_id='
      +id+' and year='+year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  user=data[0][0],
  laundries=data[1],
  title='Laundry '+user.name+' ('+this.alias(type)+')'
    +'<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  add=document.createElement('input'),
  subsidy=type=='student'?0:this.credit*1000,
  total=subsidy,
  table=this.table();
  loader.remove();
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addLaundry(id,type,user.name);
  };
  row=this.row('Tanggal','Nominal','Jenis','Berat',month==thisMonth?add:'');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  for(let line of laundries){
    let pr=document.createElement('span');
    pr.innerText=_Pesantrian.parseNominal(line.flow==1?line.nominal:-line.nominal);
    pr.classList.add(line.flow==1?'credit-plus':'credit-minus');
    row=this.row(
      _Pesantrian.parseDate(line.time*1000),
      pr,
      line.kind,
      line.weight,
      line.id
    );
    row.childNodes[1].classList.add('td-right');
    table.append(row);
    if(line.flow==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
  }
  /* subsidy */
  row=this.row('Subsidi',
    _Pesantrian.parseNominal(subsidy),
    '','',''
  );
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  /* total */
  row=this.row('Total',
    _Pesantrian.parseNominal(total),
    '','',''
  );
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  
};
this.tableLaundry=async function(type='student',month,year,subs=true){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  thisMonth=(new Date).getMonth(),
  query=type=='student'
    ?(_Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management)
    :'select id,name,live_in from employee where live_in=1',
  queries=[
    query,
    'select * from laundry where type="'+type+'" and year='
    +year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  users=data[0],
  laundries=data[1],
  back=document.createElement('input'),
  title='Laundry '+this.alias(type)
    +'<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama '+this.alias(type),'Saldo','',back);
  row.classList.add('tr-head');
  table.append(row);

  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=()=>{
    this.init();
  };
  /* finder */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  /* prev month */
  let prev=document.createElement('select'),
  thisYear=(new Date).getFullYear();
  prev.dataset.year=year+'';
  prev.dataset.month=month+'';
  prev.dataset.type=type;
  for(let nyear of [thisYear-1,thisYear]){
    for(let mon in this.month){
      let opt=document.createElement('option');
      opt.value=[mon,nyear].join(':');
      opt.textContent=this.month[mon]+' '+nyear;
      if(mon==month&&nyear==year){
        opt.selected='selected';
      }
      prev.append(opt);
    }
  }
  prev.onchange=async function(){
    let val=this.value.split(':');
    await _PesantrianLaundry.tableLaundry(
      this.dataset.type,
      parseInt(val[0]),
      parseInt(val[1]),
    );
  };
  /* find saldo */
  let findsaldo=_Pesantrian.findInput('saldo','number','Saldo...');
  row=this.row('',find,findsaldo,'',prev);
  table.append(row);

  for(let user of users){
    let credit=this.getCredit(user.id,laundries,type),
    add=document.createElement('input'),
    lunasin=document.createElement('input'),
    putLunasin=credit==0?(type=='employee'?'Lunas':'-'):(credit<0?lunasin:'-'),
    saldo=document.createElement('span');
    saldo.innerText=_Pesantrian.parseNominal(credit);
    saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
    saldo.id='credit-'+user.id;
    row=this.row(user.id,user.name,saldo,putLunasin,add);
    row.dataset.name=user.name;
    row.dataset.saldo=_Pesantrian.parseNominal(credit);
    row.childNodes[2].classList.add('td-right');
    table.append(row);
    /* lunasin button */
    lunasin.type='submit';
    lunasin.value=month==thisMonth?'Bayar':'Lunasi';
    lunasin.classList.add('button-taken');
    lunasin.dataset.profile_id=user.id;
    lunasin.dataset.type=type;
    lunasin.dataset.name=user.name;
    lunasin.dataset.credit=credit+'';
    lunasin.dataset.month=month;
    lunasin.dataset.year=year;
    lunasin.onclick=async function(){
      if(this.dataset.type=='student'){
        _PesantrianLaundry.billScanner(
          parseInt(this.dataset.month,10),
          parseInt(this.dataset.year,10),
        );
        return;
      }
      if(this.dataset.month==(new Date).getMonth()){
        _PesantrianLaundry.bayarin(this);
      }else{
        _PesantrianLaundry.lunasin(this);
      }
    };
    /* add button --> detail button */
    add.type='submit';
    add.value='Buka';
    add.classList.add('button-take');
    add.dataset.profile_id=user.id;
    add.dataset.type=type;
    add.dataset.name=user.name;
    add.dataset.credit=credit;
    add.dataset.month=month;
    add.dataset.year=year;
    add.onclick=function(){
      _PesantrianLaundry.tableDetail(
        this.dataset.profile_id,
        this.dataset.type,
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
  }
  this.app.body.append(table);
};


this.bayarin=async function(el){
  let nominal=await _Pesantrian.promptX(
    'Bayar Laundry?',
    'Nama: '+el.dataset.name
      +' ('+_PesantrianLaundry.alias(el.dataset.type)+')'
  );
  if(!nominal){return;}
  el.disabled=true;
  el.value='Membayar...';
  let credit=parseInt(el.dataset.credit),
  saldo=document.getElementById('credit-'+el.dataset.profile_id),
  year=parseInt(el.dataset.year),
  month=parseInt(el.dataset.month),
  data={
    type:el.dataset.type,
    profile_id:el.dataset.profile_id,
    nominal:nominal,
    year:year,
    month:month,
    flow:1,
    kind:'Pembayaran laundry.',
  },
  innerQuery=_Pesantrian.buildQuery(data),
  query='insert into laundry '+innerQuery,
  loader=_Pesantrian.loader(),
  res=await _Pesantrian.request('query',query);
  loader.remove();
  credit=parseInt(credit)+parseInt(nominal);
  saldo.classList.remove('credit-plus');
  saldo.classList.remove('credit-minus');
  saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
  saldo.innerText=_Pesantrian.parseNominal(credit);
  el.dataset.credit=credit;
  el.disabled=false;
  el.value='Bayar';
  if(credit>=0){
    let pr=el.parentNode;
    el.remove();
    pr.innerText='-';
  }
};
this.lunasin=async function(_this){
  let yes=await _Pesantrian.confirmX(
    'Set status menjadi lunas?',
    'Nama: '+_this.dataset.name
  );
  if(!yes){return;}
  let loader=_Pesantrian.loader(),
  innerQuery=_Pesantrian.buildQuery({
    profile_id:_this.dataset.profile_id,
    type:_this.dataset.type,
    nominal:parseInt(_this.dataset.credit)*-1,
    year:_this.dataset.year,
    month:_this.dataset.month,
    flow:1,
    kind:'Pelunasan utang laundry.',
  }),
  query='insert into laundry '+innerQuery,
  res=await _Pesantrian.request('query',query);
  loader.remove();
  if(res==1){
    let pr=_this.parentNode;
    _this.remove();
    pr.innerText='Lunas';
  }
};


this.wash=async function(el,nominal){
  el.disabled=true;
  el.value='Mencuci...';
  let credit=parseInt(el.dataset.credit),
  saldo=document.getElementById('credit-'+el.dataset.profile_id),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  data={
    type:el.dataset.type,
    profile_id:el.dataset.profile_id,
    nominal:nominal,
    year:year,
    month:month,
  },
  innerQuery=_Pesantrian.buildQuery(data),
  query='insert into laundry '+innerQuery,
  loader=_Pesantrian.loader(),
  res=await _Pesantrian.request('query',query);
  loader.remove();
  credit=parseInt(credit)-parseInt(nominal);
  saldo.classList.remove('credit-plus');
  saldo.classList.remove('credit-minus');
  saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
  saldo.innerText=_Pesantrian.parseNominal(credit);
  el.dataset.credit=credit;
  el.disabled=false;
  el.value='Cuci';
};
this.getNominal=function(title,text,cb){
  title=typeof title==='string'?title:'';
  text=typeof text==='string'?text:'';
  cb=typeof cb==='function'?cb:function(){};
  Swal.fire({
    title:title,
    text:text,
    input:'number',
    inputAttributes:{
      autocapitalize:'off',
      autocomplete:'off',
    },
    showCancelButton:true,
    cancelButtonText:'Batal',
    confirmButtonText:'OK',
    confirmButtonColor:'#309695',
    showLoaderOnConfirm:true,
    allowOutsideClick:()=>!Swal.isLoading(),
    preConfirm:async (result)=>{
      return cb(result);
    },
  });
};
this.getCredit=function(profile_id,data=[],type='student'){
  let res=type=='student'?0:this.credit*1000;
  for(let i of data){
    if(i.profile_id==profile_id){
      if(i.flow==1){
        res+=parseInt(i.nominal);
      }else{
        res-=parseInt(i.nominal);
      }
    }
  }return res;
};
this.getCreditFlow=function(profile_id,data=[],type='student',flow=0){
  let res=0;
  for(let i of data){
    if(i.profile_id==profile_id&&i.flow==flow){
      res+=parseInt(i.nominal);
    }
  }return res;
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
return this.init();
};



/* PesantrianMedia --- removed */
;function PesantrianMedia(app){
this.app=app;
this.aliasData={
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[],
  appsx=[
    {
      name:'inventory',
      title:'Inventory',
      callback:function(e){
        _PesantrianMedia.tableInventory();
      }
    }
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianMedia=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

this.addItem=function(){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory();
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "media_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory();
      },1600);
    }
  };
};
this.tableInventory=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from media_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('MEDIA INVENTORY',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    _PesantrianMedia.addItem();
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from media_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};

this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianMaintenance */
;function PesantrianMaintenance(app){
this.app=app;
this.aliasData={
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.places=[
    'gudang',
    'kelas-7',
    'kelas-8',
    'kelas-9',
    'kelas-10',
    'kelas-11',
    'kelas-12',
    'kantor-mudir',
    'kantor-bendahara',
    'kantor-media',
    'kantor-ikhwan',
    'kantor-ruang-tamu',
    'kantor-kamar-tamu',
    'kantor-receptionist',
    'kantor-dapur',
    'kantor-toilet',
    'masjid',
    'toilet-akhwat-1-masjid',
    'toilet-akhwat-2-masjid',
    'toilet-ikhwan-masjid',
    'dapur',
    'toilet-dapur',
    'peralatan-kebersihan',
    'kantin',
    'perpustakaan',
    'ruang-lab',
    'aula-dapur',
    'ruang-rapat',
    'ukm',
    'lab-komputer',
    'kantor-keasramaan',
    'kantor-tahfizh',
    'guest-house',
    'asrama-bawah-1',
    'asrama-bawah-2',
    'asrama-bawah-3',
    'asrama-bawah-4',
    'asrama-bawah-5',
    'asrama-bawah-6',
    'gedung-serbaguna',
    'asrama-mudir',
    'asrama-asma',
    'asrama-erwin',
    'asrama-guru-1',
    'asrama-guru-2',
    'asrama-guru-3',
    'asrama-guru-4',
    'asrama-marwah-1',
    'asrama-marwah-2',
    'asrama-marwah-3',
    'asrama-marwah-4',
    'asrama-marwah-5',
    'asrama-marwah-6',
    'asrama-shofa-1',
    'asrama-shofa-2',
    'asrama-shofa-3',
    'asrama-shofa-4',
    'asrama-shofa-5',
    'asrama-shofa-6',
    'asrama-arafah-1',
    'asrama-arafah-2',
    'asrama-arafah-3',
    'asrama-arafah-4',
    'asrama-arafah-5',
    'asrama-arafah-6',
    'toilet-marwah',
    'toilet-shofa',
    'toilet-arafah',
    'lorong-shofa',
    'lorong-marwah',
    'lorong-arafah',
    'laundry',
    'pos-security-1',
    'pos-security-2',
    'electronic',
    'other-1',
    'other-2',
    'other-3',
    'temporary',
    '----------------',
    'kelas-7-abu-bakar',
    'kelas-8-abu-bakar',
    'kelas-9-abu-bakar',
    'kelas-10-abu-bakar',
    'kelas-11-abu-bakar',
    'kelas-12-abu-bakar',
    'kantor-abu-bakar',
    'dapur-abu-bakar',
    'masjid-abu-bakar',
    'peralatan-kebersihan-abu-bakar',
    'gudang-1-abu-bakar',
    'gudang-2-abu-bakar',
    'kantin-abu-bakar',
    'saung-kebun-abu-bakar',
    'asrama-hanzhalah-abu-bakar',
    'asrama-umair-abu-bakar',
];

this.months=[
  'JANUARY',
  'FEBRUARY',
  'MARET',
  'APRIL',
  'MEI',
  'JUNI',
  'JULI',
  'AGUSTUS',
  'SEPTEMBER',
  'OKTOBER',
  'NOVEMBER',
  'DESEMBER',
];
this.monthTA=[6,7,8,9,10,11,0,1,2,3,4,5,];

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'inventory',
      title:'Inventory',
      callback:function(e){
        _PesantrianMaintenance.tableInventory();
      }
    },
    {
      name:'form3',
      title:'Laporan',
      callback:function(e){
        _PesantrianMaintenance.tableReport('report');
      }
    },
    {
      name:'form4',
      title:'Anggaran',
      callback:function(e){
        _PesantrianMaintenance.tableReport('budget');
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianMaintenance=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* report and budget */
this.tableReportMonthly=async function(type='report',month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableReport(type);
    })
  );
  year=year||(new Date).getFullYear();
  month=month||(new Date).getMonth();
  let studyYear=this.getStudyYear().split('/'),
  thisYear=(new Date).getFullYear(),
  types={
    report:'LAPORAN KEUANGAN',
    budget:'ANGGARAN',
  },
  typer=types.hasOwnProperty(type)?types[type]:types['report'],
  loader=_Pesantrian.loader(),
  queries=[
    'select * from general where type="'+type+'" and year='+year+' and month='+month,
    'select * from general where type="receive" and year='+year+' and month='+month,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  row=this.rowHead(typer+'<br />BAGIAN UMUM<br />BULAN '
    +this.months[month]+' '+year,6),
  nomor=1,
  total=0,
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  let add=document.createElement('input');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    let rid='add-row', 
    nrow=document.getElementById(rid),
    note=document.createElement('input'),
    many=document.createElement('input'),
    price=document.createElement('input'),
    total=document.createElement('input'),
    submit=document.createElement('input');
    if(nrow){return;}
    nrow=this.row('',note,many,price,total,submit);
    nrow.id=rid;
    table.insertBefore(nrow,table.childNodes[2]);
    note.classList.add('extra-high');
    many.type='number';
    many.value='0';
    many.price=price;
    many.total=total;
    many.onkeyup=function(){
    };
    total.type='number';
    total.value='0';
    price.type='number';
    price.total=total;
    price.many=many;
    price.value='0';
    price.onkeyup=function(){
    };
    submit.type='submit';
    submit.value='Simpan';
    submit.classList.add('button-view');
    submit.classList.add('extra-high');
    submit.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      innerQuery=_Pesantrian.buildQuery({
        type,
        year,
        month,
        note:note.value,
        many:many.value,
        price:price.value,
        total:total.value,
      }),
      query='insert into general '+innerQuery,
      res=await _Pesantrian.request('query',query);
      loader.remove();
      this.tableReportMonthly(type,month,year);
    };
  };
  row=this.row('NO','Keterangan','Banyak','Harga','Jumlah',add);
  row.classList.add('tr-head');
  table.append(row);
  let dlData=[];
  for(let item of datas[0]){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=item.id;
    del.dataset.note=item.note;
    del.dataset.total=item.total;
    del.onclick=async function(){
      let yes=await _Pesantrian.confirmX('Hapus data?',this.dataset.note);
      if(!yes){return;}
      this.disabled=true;
      let query='delete from general where id='+this.dataset.id,
      loader=_Pesantrian.loader(),
      el=document.getElementById('item-'+this.dataset.id),
      trow=document.getElementById('row-total'),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(el){el.remove();}
      if(trow){
        let ctotal=parseInt(this.dataset.total),
        total=parseInt(trow.dataset.total)-ctotal;
        trow.dataset.total=total+'';
        trow.childNodes[1].innerHTML=_Pesantrian.parseNominal(total);
      }
    };
    row=this.row(nomor,
      item.note,
      item.many+' Kwitansi',
      _Pesantrian.parseNominal(item.price),
      _Pesantrian.parseNominal(item.total),
      del);
    table.append(row);
    row.childNodes[2].style.textAlign='right';
    row.childNodes[3].style.textAlign='right';
    row.childNodes[4].style.textAlign='right';
    row.id='item-'+item.id;
    total+=parseInt(item.total);
    dlData.push({
      NO:nomor,
      Keterangan:item.note,
      Banyak:item.many+' Kwitansi',
      Harga:_Pesantrian.parseNominal(item.price),
      Jumlah:_Pesantrian.parseNominal(item.total),
    });
    nomor++;
  }
  let dlb=document.createElement('input');
  dlb.type='submit';
  dlb.value='JSON';
  dlb.classList.add('button-view');
  dlb.classList.add('extra-high');
  dlb.onclick=()=>{
    _Pesantrian.downloadJSON(dlData);
  };
  row=this.row('Total Pengeluaran',_Pesantrian.parseNominal(total),dlb);
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].style.textAlign='center';
  row.childNodes[1].style.textAlign='right';
  row.classList.add('tr-head');
  row.dataset.total=total+'';
  row.id='row-total';
  table.append(row);
  /* summary */
  if(type!='report'){return;}
  row=this.rowHead('SUMMARY',6);
  table.append(row);
  let rtotal=datas[1].length>0?parseInt(datas[1][0].total):0,
  updateID=datas[1].length>0?datas[1][0].id:0,
  rspan=document.createElement('span'),
  rinput=document.createElement('input'),
  rsubmit=document.createElement('input');
  rinput.type='number';
  rinput.value=rtotal+'';
  rspan.innerHTML=_Pesantrian.parseNominal(rtotal);
  rspan.inputEl=rinput;
  rspan.onclick=function(){
    this.parentNode.append(this.inputEl);
    this.inputEl.focus();
    this.remove();
  };
  rsubmit.type='submit';
  rsubmit.value='Simpan';
  rsubmit.classList.add('button-view');
  rsubmit.classList.add('extra-high');
  rsubmit.dataset.id=updateID+'';
  rsubmit.inputEl=rinput;
  rsubmit.dataset.month=month;
  rsubmit.dataset.year=year;
  rsubmit.dataset.type=type;
  rsubmit.onclick=async function(){
    this.disabled=true;
    let loader=_Pesantrian.loader(),
    innerQuery=_Pesantrian.buildQuery({
      year:this.dataset.year,
      month:this.dataset.month,
      type:'receive',
      total:this.inputEl.value,
    }),
    query=this.dataset.id=='0'
      ?'insert into general '+innerQuery
      :'update general ('+innerQuery+') where id='+this.dataset.id,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    _PesantrianMaintenance.tableReportMonthly(
      this.dataset.type,
      parseInt(this.dataset.month),
      parseInt(this.dataset.year)
    );
  };
  row=this.row('','Total Pemasukan',rspan,rsubmit);
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].style.textAlign='right';
  table.append(row);
  row=this.row('','Total Pengeluaran',_Pesantrian.parseNominal(total),'');
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].style.textAlign='right';
  table.append(row);
  row=this.row('','Sisa',_Pesantrian.parseNominal(rtotal-total),'');
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].style.textAlign='right';
  table.append(row);
  let ttd=new Image,
  ttdName=document.createElement('span');
  ttd.src='https://github.com/9r3i/pesantrian/releases/download/images/maintenance.signature.png';
  ttdName.innerText='Ustadz Wawan Wijaya';
  row=this.rowHead(ttd,6);
  row.childNodes[0].classList.add('ttd');
  row.childNodes[0].append(ttdName);
  table.append(row);
};
this.tableReport=function(type='report'){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let studyYear=this.getStudyYear().split('/'),
  types={
    report:'LAPORAN KEUANGAN',
    budget:'ANGGARAN',
  },
  typer=types.hasOwnProperty(type)?types[type]:types['report'],
  thisYear=(new Date).getFullYear(),
  row=this.rowHead(typer+'<br />BAGIAN UMUM<br />Tahun Ajaran'
    +studyYear.join('/'),2),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  for(let mon of this.monthTA){
    let year=mon<6?studyYear[1]:studyYear[0],
    open=document.createElement('input');
    open.type='submit';
    open.value='Buka';
    open.classList.add('button-take');
    open.dataset.year=year;
    open.dataset.month=mon;
    open.dataset.type=type;
    open.onclick=function(){
      _PesantrianMaintenance.tableReportMonthly(
        this.dataset.type,
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
    row=this.row(this.months[mon]+' '+year,open);
    table.append(row);
  }
};

/* inventory */
this.addItem=function(place){
  this.clearBody();
  place=place?place:'gudang';
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG<br />Tempat: '+place,2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory(place);
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    data.place=place;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "maintenance_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory(place);
      },1600);
    }
  };
};
this.tableInventory=async function(place){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  place=place?place:'gudang';
  let loader=_Pesantrian.loader(),
  places=this.places,
  queries=[
    'select * from maintenance_inventory where place="'+place+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('MAINTENANCE INVENTORY<br />Tempat: '+place+'',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  /* add */
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem(place);
  };
  /* place selector */
  let placeSelector=document.createElement('select');
  for(let pl of places){
    let opt=document.createElement('option');
    opt.value=pl;
    opt.textContent=pl;
    if(place==pl){
      opt.selected='selected';
    }
    placeSelector.append(opt);
  }
  placeSelector.onchange=async function(){
    await _PesantrianMaintenance.tableInventory(this.value);
  };
  /* finder */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','',placeSelector);
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from maintenance_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};

/* inner */
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianClean --- removed */
;function PesantrianClean(app){
this.app=app;
this.aliasData={
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'inventory',
      title:'Inventory',
      callback:function(e){
        _PesantrianClean.tableInventory();
      }
    }
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianClean=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

this.addItem=function(){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory();
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "clean_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory();
      },1600);
    }
  };
};
this.tableInventory=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from clean_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY DIVISI KEBERSIHAN',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem();
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from clean_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianClinic */
;function PesantrianClinic(app){
this.app=app;
this.aliasData={
  name:'Nama Santri',
  checkin:'Jam Masuk',
  clinic_name:'Nama Klinik',
  doctor_name:'Nama Dokter',
  treatment:'Penanganan',
  cost:'Biaya',
  ailment:'Jenis Penyakit',
  level:'Tingkat Keparahan',
  medicine:'Obat yang diberikan',
  height:'Tinggi Badan',
  weight:'Berat Badan',
  date:'Tanggal Masuk',
  condition:'Kondisi',
  item_code:'Kode Barang',
  quantity:'Quantity',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  
  let apps=[
    {
      name:'health',
      title:'Klinik',
      callback:function(e){
        _PesantrianClinic.tableClinic();
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  
  
  /* put the object to global scope */
  window._PesantrianClinic=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* inventory */
this.addItem=function(){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    alias=key=='name'?'Nama Barang':this.alias(key),
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=alias+'...';
    val.classList.add('kitchen-find');
    row=this.row(alias,val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory();
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "clinic_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory();
      },1600);
    }
  };
};
this.tableInventory=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from clinic_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY KLINIK',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem();
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from clinic_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

/* clinic */
this.checkinEdit=function(students,data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableClinic(data.month,data.year);
    })
  );
  let table=this.table(),
  passes=['id','time','student_id','date','year','month','student_id'],
  hidden=[],
  integers=['cost','height','weight'],
  row,
  ptrn=/^\d{4}\-\d{2}\-\d{2}\ \d{2}:\d{2}$/;
  for(let key in data){
    let value=data[key],
    alias=this.alias(key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='name'){
      val=value;
    }else if(key=='checkout'){
      if(!data.checkout.match(ptrn)){
        continue;
      }
      alias='Check-Out';
      val=_Pesantrian.parseDatetime(value);
    }else if(key=='checkin'){
      alias='Check-In';
      val=_Pesantrian.parseDatetime(data.date+' '+value);
    }else if(data.checkout.match(ptrn)){
      val=value;
      if(key=='cost'){
        val=_Pesantrian.parseNominal(value);
      }else if(key=='weight'){
        val+=' kg';
      }else if(key=='height'){
        val+=' cm';
      }
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      ti.name=key;
      ti.classList.add('extra-high');
      ti.setAttribute('autocomplete','off');
      val=ti;
      if(hidden.indexOf(key)>=0){
        val.type='hidden';
        this.app.body.append(val);
        continue;
      }else if(integers.indexOf(key)>=0){
        val.type='number';
      }
      if(key=='cost'){
        alias+=' (Rp)';
      }else if(key=='weight'){
        alias+=' (kg)';
      }else if(key=='height'){
        alias+=' (cm)';
      }
    }
    row=this.row(alias,val);
    table.append(row);
  }
  
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  if(!data.checkout.match(ptrn)){
    div.append(btn);
  }
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableClinic(data.month,data.year);
  };
  let data_id=data.id,
  student_id=data.student_id;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    hwQuery=_Pesantrian.buildQuery({
      height:data.height,
      weight:data.weight,
    }),
    queries=[
      'update "clinic" ('+innerQuery+') where id='+data_id,
      'update student ('+hwQuery+') where id='+student_id,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableClinic();
      },1600);
    }
  };
};
this.checkin=function(students){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableClinic();
    })
  );
  let data=this.templateClinic(),
  table=this.table(),
  passes=['checkout'],
  hidden=['year','month','student_id'],
  integers=['cost','height','weight'],
  row;
  for(let key in data){
    let value=data[key],
    alias=this.alias(key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='name'){
      val=_Pesantrian.findSelect({
        data:students,
        key:key,
        value:value,
        placeholder:'Nama Santri...',
        callback:function(r){
          let sinput=document.querySelector('input[name="student_id"]'),
          sdata=_PesantrianClinic.getStudentData(r.id,students),
          presult=document.getElementById('finder-result-name'),
          sheight=document.querySelector('input[name="height"]'),
          sweight=document.querySelector('input[name="weight"]');
          if(presult){
            presult.value=r.name;
          }
          if(sinput){
            sinput.value=r.id;
          }
          if(sdata){
            if(sheight){
              sheight.value=sdata.height;
            }
            if(sweight){
              sweight.value=sdata.weight;
            }
          }
        },
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.addEventListener('keyup',function(){
        let res=document.getElementById('finder-result-name');
        if(res){
          res.value=this.value;
        }
      },false);
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      ti.name=key;
      ti.classList.add('extra-high');
      ti.setAttribute('autocomplete','off');
      val=ti;
      if(hidden.indexOf(key)>=0){
        val.type='hidden';
        this.app.body.append(val);
        continue;
      }else if(integers.indexOf(key)>=0){
        val.type='number';
      }else if(key=='checkin'){
        val.type='time';
      }else if(key=='date'){
        val.type='date';
      }
    }
    if(key=='cost'){
      alias+=' (Rp)';
    }else if(key=='height'){
      alias+=' (cm)';
    }else if(key=='weight'){
      alias+=' (kg)';
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableClinic();
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    hwQuery=_Pesantrian.buildQuery({
      height:data.height,
      weight:data.weight,
    }),
    queries=[
      'insert into "clinic" '+innerQuery,
      'update student ('+hwQuery+') where id='+data.student_id,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableClinic();
      },1600);
    }
  };
};
this.tableClinic=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=month?month:(new Date).getMonth();
  year=year?year:(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated,height,weight from student where graduated=0'
      :'select id,name,graduated,height,weight,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from clinic where year='+year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  lines=data[1],
  title='BUKU KLINIK <br />'+this.month[month]+' '+year,
  nomor=1,
  add=document.createElement('input'),
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('NO','Nama Santri','Tanggal Check-In',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Check-In';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.checkin(students);
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let smonth=document.createElement('select'),
  studyYear=this.getStudyYear().split('/'),
  months=[6,7,8,9,10,11,0,1,2,3,4,5];
  smonth.dataset.syear=this.getStudyYear();
  smonth.onchange=function(){
    let studyYear=this.dataset.syear.split('/'),
    year=this.value<6?studyYear[1]:studyYear[0];
    _PesantrianClinic.tableClinic(this.value,year);
  };
  for(let mon of months){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon]+' '
      +(mon<6?studyYear[1]:studyYear[0]);
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  row=this.row('',find,'',smonth);
  table.append(row);
  for(let line of lines){
    let out=document.createElement('input'),
    ptrn=/^\d{4}\-\d{2}\-\d{2}\ \d{2}:\d{2}$/;
    out.type='submit';
    out.value='Check-Out';
    out.dataset.id=line.id;
    out.dataset.name=line.name;
    let aname=document.createElement('span');
    aname.classList.add('link-name');
    aname.innerText=line.name;
    aname.id='name-'+line.id;
    aname.dataset.data=JSON.stringify(line);
    aname.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      _PesantrianClinic.checkinEdit(students,data);
    };
    if(!line.checkout.match(ptrn)){
      out.classList.add('button-take');
      out.onclick=async function(){
        _Pesantrian.confirm('Check-Out Santri?',
          'Nama: '+this.dataset.name,
          async yes=>{
          if(!yes){return;}
          this.disabled=true;
          this.value='Memproses...';
          let hour=[
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
          ].join(':'),
          tgl=[
            (new Date).getFullYear(),
            ((new Date).getMonth()+1).toString().padStart(2,'0'),
            (new Date).getDate().toString().padStart(2,'0'),
          ].join('-'),
          loader=_Pesantrian.loader(),
          query='update clinic (checkout='+[tgl,hour].join(' ')
            +') where id='+this.dataset.id,
          res=await _Pesantrian.request('query',query);
          loader.remove();
          this.value='Selesai';
          this.classList.remove('button-take');
          this.classList.add('button-taken');
          let pname=document.querySelector('span#name-'+this.dataset.id);
          if(pname){
            let pdata=_Pesantrian.parseJSON(pname.dataset.data);
            pdata.checkout=[tgl,hour].join(' ');
            pname.dataset.data=JSON.stringify(pdata);
          }
        });
      };
    }else{
      out.disabled=true;
      out.classList.add('button-taken');
      out.value='Selesai';
    }
    let dtime=_Pesantrian.parseDatetime([
      line.date,line.checkin
    ].join(' '));
    row=this.row(nomor,aname,dtime,out);
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
};
this.templateClinic=()=>{
  return {
    name:'', 
    student_id:0,
    checkin:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    checkout:'',
    clinic_name:'',
    doctor_name:'',
    treatment:'',
    cost:0,
    ailment:'',
    level:'',
    medicine:'',
    height:0,
    weight:0,
    date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  };
};

/* ---------- inner ---------- */
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.getStudentData=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
return this.init();
};



/* PesantrianSecurity */
;function PesantrianSecurity(app){
this.app=app;
this.aliasData={
  plate:'Nomor Kendaraan',
  name:'Nama',
  student_id:'Wali dari',
  purpose:'Maksud/Tujuan',
  checkin:'Jam Masuk',
  checkout:'Jam keluar',
  courier:'Kurir',
  student:'Santri',
  employee:'Karyawan',
  type:'Status Pemilik',
  profile_id:'Nama Pemilik',
  report:'Keterangan',
  hour:'Jam Penerimaan',
};
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.courier=[
  'Shopee',
  'JNE',
  'JNT',
  'Anter Aja',
  'POS',
  'Cargo',
  'Lazada',
  'Ninja',
  'Lion Parcel',
  'Sicepat',
  'Dakota',
  'Lalamove',
];
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  let apps=[
    {
      name:'package',
      title:'Paket',
      callback:function(e){
        _PesantrianSecurity.tablePackage();
      }
    },
    {
      name:'guest',
      title:'Tamu',
      callback:function(e){
        _PesantrianSecurity.tableGuest();
      }
    }
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianSecurity=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

this.addPackage=function(employees,students,year,month){
  this.clearBody();
  let data=this.templatePackage(),
  table=this.table(),
  passes=['given'],
  hidden=['year','month','name'],
  row;
  for(let key in data){
    let value=data[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='type'){
      val=_Pesantrian.radioSanKar(value);
      val.classList.add('margin-up');
    }else if(key=='profile_id'){
      val=_Pesantrian.findSelect({
        id:'profile_id',
        data:students,
        key:key,
        value:value,
        placeholder:'Nama Pemilik...',
        callback:function(r){},
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.name='name';
    }else if(key=='courier'){
      let ts=document.createElement('select');
      for(let kur of this.courier){
        let opt=document.createElement('option');
        opt.value=kur;
        opt.textContent=kur;
        if(value==kur){
          opt.selected='selected';
        }
        ts.append(opt);
      }
      ts.name=key;
      ts.classList.add('margin-up');
      val=ts;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      ti.name=key;
      ti.classList.add('extra-high');
      ti.setAttribute('autocomplete','off');
      val=ti;
      if(hidden.indexOf(key)>=0){
        val.type='hidden';
        this.app.body.append(val);
        continue;
      }else if(key=='hour'){
        val.type='time';
      }
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  /* type for profile_id */
  let itypes=document.querySelectorAll('input[name="type"]');
  for(let i=0;i<itypes.length;i++){
    let itype=itypes[i];
    itype.onchange=function(){
      pid=document.getElementById('profile_id'),
      parent=pid.parentNode,
      val=_Pesantrian.findSelect({
        id:'profile_id',
        data:this.value=='employee'?employees:students,
        key:'profile_id',
        value:0,
        placeholder:'Nama Pemilik...',
        callback:function(r){},
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.name='name';
      parent.innerHTML='';
      parent.append(val);
    };
  }
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tablePackage();
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tablePackage();
    })
  );
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "package" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tablePackage();
      },1600);
    }
  };
};
this.tablePackage=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  year=year?year:(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name from employee',
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from package where year='+year+' and month='+month
      +' ORDER BY id DESC',
  ].join(';'),
  table=this.table(),
  title='BUKU PENERIMAAN PAKET<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  add=document.createElement('input'),
  back=document.createElement('input'),
  data=await _Pesantrian.request('queries',queries),
  employees=data[0],
  students=data[1],
  packages=data[2];
  nomor=packages.length,
  loader.remove();
  table.append(row);
  /* buttons */
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addPackage(employees,students,year,month);
  };
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-delete');
  back.onclick=()=>{
    this.init();
  };
  row=this.row('NO','Nama Pemilik','Tgl','Jam',this.alias('courier'),add);
  row.classList.add('tr-head');
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let prev='';
  if(month==(new Date).getMonth()){
    let pmonth=month==0?11:(month-1),
    pyear=month==0?year-1:year;
    prev=document.createElement('input');
    prev.type='submit';
    prev.value='Bulan Lalu';
    prev.classList.add('button-view');
    prev.dataset.month=pmonth;
    prev.dataset.year=pyear;
    prev.onclick=async function(){
      await _PesantrianSecurity.tablePackage(
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
  }else{
    let pmonth=month==11?0:(month+1),
    pyear=month==11?year+1:year;
    prev=document.createElement('input');
    prev.type='submit';
    prev.value='Bulan Ini';
    prev.classList.add('button-view');
    prev.dataset.month=pmonth;
    prev.dataset.year=pyear;
    prev.onclick=async function(){
      await _PesantrianSecurity.tablePackage(
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
  }
  row=this.row('',find,'','','',prev);
  table.append(row);
  /* table */
  for(let pack of packages){
    let out=document.createElement('input');
    out.type='submit';
    out.value='Serahkan';
    out.dataset.id=pack.id;
    out.dataset.type=this.alias(pack.type);
    out.dataset.name=pack.name;
    if(pack.given==0){
      out.classList.add('button-take');
      out.onclick=async function(){
        _Pesantrian.confirm('Serahkan paket?',
          'Kepada: '+this.dataset.name
          +' ('+this.dataset.type+')',
          async yes=>{
          if(!yes){return;}
          this.disabled=true;
          this.value='Memproses...';
          let loader=_Pesantrian.loader(),
          query='update package (given=1)'
            +' where id='+this.dataset.id,
          res=await _Pesantrian.request('query',query);
          loader.remove();
          this.value='Selesai';
          this.classList.remove('button-take');
          this.classList.add('button-taken');
        });
      };
    }else{
      out.disabled=true;
      out.classList.add('button-taken');
      out.value='Selesai';
    }
    row=this.row('<div class="tag-pack tag-pack-'
      +(pack.type=='employee'?'1':'0')
      +'">'+nomor+'</div> ',
      pack.name+'<br />'+pack.report,
      (new Date(pack.time*1000)).getDate(),
      pack.hour,
      pack.courier,
      out);
    row.dataset.name=pack.name;
    row.dataset.type=pack.type;
    table.append(row);
    nomor--;
  }
  this.app.body.append(table);
};
this.templatePackage=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth();
  return {
    type:'student',
    profile_id:0,
    name:'',
    hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    month:month,
    year:year,
    courier:'',
    report:'',
  };
};

this.addGuest=function(parents,students,year,month){
  this.clearBody();
  let data=this.templateGuest(),
  table=this.table(),
  passes=['checkout'],
  hidden=['year','month'],
  row;
  for(let key in data){
    let value=data[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='name'){
      val=_Pesantrian.findSelect({
        data:parents,
        key:key,
        value:value,
        placeholder:'Nama Tamu...',
        callback:function(r){
          r.main.slave.result=r.name;
          let sinput=document.getElementById('finder-input-student_id'),
          sresult=document.getElementById('finder-result-student_id'),
          student=_PesantrianSecurity.getStudentData(r.id,students),
          pinput=document.getElementById('finder-input-name'),
          presult=document.getElementById('finder-result-name');
          if(sinput&&student){
            sinput.value=student.name;
          }
          if(student&&sresult){
            sresult.value=student.id;
          }
          if(presult&&pinput){
            presult.value=pinput.value;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.addEventListener('keyup',function(){
        let res=document.getElementById('finder-result-name');
        if(res){
          res.value=this.value;
        }
      },false);
    }else if(key=='student_id'){
      val=_Pesantrian.findSelect({
        data:students,
        key:key,
        value:value,
        placeholder:'Wali dari...',
        callback:function(r){
          let pinput=document.getElementById('finder-input-name'),
          presult=document.getElementById('finder-result-name'),
          student=_Pesantrian.getDataFromID(r.id,students),
          father_name=_PesantrianSecurity.getFatherName(student?student.father_id:0,parents);
          if(father_name&&pinput&&presult){
            pinput.value=father_name;
            presult.value=father_name;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      ti.name=key;
      ti.classList.add('extra-high');
      ti.setAttribute('autocomplete','off');
      val=ti;
      if(hidden.indexOf(key)>=0){
        val.type='hidden';
        this.app.body.append(val);
        continue;
      }else if(key=='plate'){
        val.onkeyup=function(){
          this.value=this.value.toUpperCase();
        };
      }else if(key=='checkin'){
        val.type='time';
      }
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableGuest();
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableGuest();
    })
  );
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "guest" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableGuest();
      },1600);
    }
  };
  
};
this.tableGuest=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  queries=[
    'select id,name,plate from parent',
    _Pesantrian.user.privilege>=8
      ?'select id,name,father_id,mother_id,graduated from student where graduated=0'
      :'select id,name,father_id,mother_id,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from guest where year='+year+' and month='+month
      +' ORDER BY id DESC',
  ].join(';'),
  table=this.table(),
  title='BUKU TAMU<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  add=document.createElement('input'),
  back=document.createElement('input'),
  data=await _Pesantrian.request('queries',queries),
  parents=data[0],
  students=data[1],
  guests=data[2];
  nomor=guests.length,
  loader.remove();
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addGuest(parents,students,year,month);
  };
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-delete');
  back.onclick=()=>{
    this.init();
  };
  row=this.row('NO','Nama Tamu','Tgl','In','Out',add);
  row.classList.add('tr-head');
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','','');
  table.append(row);
  for(let guest of guests){
    let parentOf='',
    sdata=this.getData(guest.student_id,students);
    if(sdata){
      parentOf='Wali dari '+sdata.name;
    }
    let out=document.createElement('input');
    out.type='submit';
    out.value='Keluar';
    out.dataset.id=guest.id;
    out.dataset.plate=parentOf;
    out.dataset.name=guest.name;
    if(!guest.checkout.match(/^\d+:\d+$/)){
      out.classList.add('button-take');
      out.onclick=async function(){
        _Pesantrian.confirm('Tamu keluar?',
          'Tamu: '+this.dataset.name
          +' ('+this.dataset.plate+')',
          async yes=>{
          if(!yes){return;}
          this.disabled=true;
          this.value='Memproses...';
          let hour=[
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
          ].join(':'),
          rowid=document.getElementById('row-'+this.dataset.id),
          loader=_Pesantrian.loader(),
          query='update guest (checkout='+hour
            +') where id='+this.dataset.id,
          res=await _Pesantrian.request('query',query);
          loader.remove();
          this.value='Selesai';
          this.classList.remove('button-take');
          this.classList.add('button-taken');
          rowid.childNodes[4].innerText=hour;
        });
      };
    }else{
      out.disabled=true;
      out.classList.add('button-taken');
      out.value='Selesai';
    }
    row=this.row(nomor,
      guest.name+'<br />'+parentOf+'<br /><em>'
        +guest.purpose+'</em>',
      (new Date(guest.time*1000)).getDate(),
      guest.checkin,
      guest.checkout,
      out);
    row.dataset.name=guest.name+' '+parentOf;
    row.dataset.plate=guest.plate;
    row.id='row-'+guest.id;
    table.append(row);
    nomor--;
  }
  this.app.body.append(table);
};
this.templateGuest=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth();
  return {
    name:'',
    month:month,
    year:year,
    student_id:0,
    purpose:'',
    checkin:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    checkout:'',
    plate:'',
  };
};

this.getData=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
};
this.getStudentData=function(father_id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.father_id==father_id||i.mother_id==father_id){
      res=i;
      break;
    }
  }return res;
};
this.getFatherName=function(father_id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==father_id){
      res=i.name;
      break;
    }
  }return res;
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
return this.init();
};



/* PesantrianKitchen */
;function PesantrianKitchen(app){
this.app=app;
this.queries=[
  _Pesantrian.user.privilege>=8
      ?'select id,name,father_id,mother_id,graduated from student where graduated=0'
      :'select id,name,father_id,mother_id,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
  'select id,profile_id,type from user where type="parent"'
].join(';');
this.queriesEmployee=[
  'select id,name,position from employee',
  'select id,profile_id,type,active from user where type="employee" and active=1',
].join(';');
this.names={
  sahur:'Sahur',
  breakfast:'Sarapan',
  lunch:'Makan Siang',
  ifthor:'Ifthor',
  dinner:'Makan Malam',
};
this.aliasData={
  breakfast:'SARAPAN',
  lunch:'MAKAN SIANG',
  dinner:'MAKAN MALAM',
  sahur:'SAHUR',
  ifthor:'IFTHOR',
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.init=async function(){
  this.app.menuButton.remove();
  let name='dinner',
  hour=(new Date).getHours();
  if(hour>=1&&hour<=4){
    name='sahur';
  }else if(hour>=5&&hour<=9){
    name='breakfast';
  }else if(hour>=10&&hour<=15){
    name='lunch';
  }else if(hour>=16&&hour<=21){
    if([1,4].indexOf((new Date).getDay())>=0&&hour<=17){
      name='ifthor';
    }else if((new Date).getMonth()==1
      &&(new Date).getDate()>27&&hour<=18){
      name='ifthor';
    }else if((new Date).getMonth()==2
      &&(new Date).getDate()<31&&hour<=18){
      name='ifthor';
    }
  }
  
  
  let apps=[
    {
      name:'student',
      title:'Santri',
      callback:function(e){
        _PesantrianKitchen.tableEat(name);
      }
    },
    {
      name:'employee',
      title:'Karyawan',
      callback:function(e){
        _PesantrianKitchen.tableEatEmployee(name);
      }
    },
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianKitchen.presenceScanner();
      }
    },
  ],
  adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianKitchen=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};



/* presence */
this.presenceScanner=async function(){
  let qdata=await _Pesantrian.scannerPageX(),
  dtime=(new Date).getTime();
  await _Pesantrian.audioPlay('beep.mp3');
  if(!qdata||qdata.id==0
    ||!qdata.hasOwnProperty('table')){
    _Pesantrian.notif('Invalid QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  if(qdata.table=='s'){
    return this.processStudentKitchen(qdata);
  }
  
  /* */
  _Pesantrian.notif('Invalid QRCode! ...','error',3000);
  await _Pesantrian.sleep(3000);
  await this.presenceScanner();
  return;
};

/* process student kitchen */
this.processStudentKitchen=async function(qdata=false){
  let place=_Pesantrian.user.name;
  if(!qdata||qdata.id==0||qdata.table!='s'){
    _Pesantrian.notif('Invalid QRCode!','error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  let loader=_Pesantrian.loader(),
  names={
    sahur:'Sahur',
    breakfast:'Sarapan',
    lunch:'Makan Siang',
    ifthor:'Ifthor',
    dinner:'Makan Malam',
  },
  name='dinner',
  hour=(new Date).getHours(),
  minute=(new Date).getMinutes(),
  hmin=parseInt(hour.toString()+minute.toString());
  if(hour>=1&&hour<=4){
    name='sahur';
  }else if(hour>=5&&hour<=9){
    name='breakfast';
  }else if(hour>=10&&hour<=15){
    name='lunch';
  }else if(hour>=16&&hour<=21){
    if([1,4].indexOf((new Date).getDay())>=0
      &&hour<=17){
      name='ifthor';
    }else if((new Date).getMonth()==1
      &&(new Date).getDate()>27
      &&hmin<=1821){
      name='ifthor';
    }else if((new Date).getMonth()==2
      &&(new Date).getDate()<31
      &&hmin<=1821){
      name='ifthor';
    }
  }
  let data={
    name:name,
    student_id:qdata.id,
    uid:_Pesantrian.user.id,
    done:1,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    date:(new Date).getDate(),
  },
  query='select * from kitchen where student_id='+data.student_id
    +' and year='+data.year
    +' and month='+data.month
    +' and date='+data.date
    +' and name="'+data.name+'"',
  res=await _Pesantrian.request('query',query,79);
  if(res.length>=1){
    loader.remove();
    _Pesantrian.notif(
      qdata.name+' sudah mengambil jatah '+names[name]+'!',
      'error',3000);
    await _Pesantrian.sleep(3000);
    await this.presenceScanner();
    return;
  }
  query='insert into kitchen '+_Pesantrian.buildQuery(data);
  res=await _Pesantrian.request('query',query);
  loader.remove();
  _Pesantrian.notif(
    qdata.name+' mendapatkan '+names[name]+'!',
    'success',5000);
  await _Pesantrian.sleep(5000);
  await this.presenceScanner();
  
  
  
  /*ARRAY
            0: (aid) [id:10] => LDB_AID
            1: (string) [name:100] => LDB_BLANK
            2: (int) [student_id:10] => "0"
            3: (int) [father_id:10] => "0"
            4: (int) [mother_id:10] => "0"
            5: (int) [done:10] => "0"
            6: (int) [uid:10] => "0"
            7: (time) [time:10] => LDB_TIME
            8: (int) [year:4] => "2024"
            9: (int) [month:2] => "0"
            10: (int) [date:2] => "1"
            11: (int) [employee_id:10] => "0"
  */
};



this.tableEatEmployee=async function(name='dinner'){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  date=(new Date).getDate(),
  aquery=';select * from kitchen where year='
    +year+' and month='+month+' and date='+date
    +' and name="'+name+'" and employee_id > 0',
  sdata=await _Pesantrian.request('queries',this.queriesEmployee+aquery),
  employees=sdata[0],
  users=sdata[1],
  eaten=sdata[2],
  eatens=this.employeeIDs(eaten),
  title=this.alias(name)+'<br />'+_Pesantrian.parseDate(),
  row=this.rowHead(title,3),
  select=document.createElement('select'),
  back=document.createElement('input'),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Karyawan',back);
  table.append(row);
  row.classList.add('tr-head');
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  row=this.row('',find,select);
  table.append(row);
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=()=>{
    this.init();
  };
  for(let dat of employees){
    if(dat.position=='resign'){
      continue;
    }
    let note=document.createElement('input');
    note.type='submit';
    if(eatens.indexOf(dat.id)>=0){
      note.disabled=true;
      note.value='Sudah';
      note.classList.add('button-taken');
    }else{
      note.value='Ambil';
      note.classList.add('button-take');
      note.dataset.employee_name=dat.name;
      note.dataset.employee_id=dat.id;
      note.dataset.name=name;
      note.dataset.user_id=this.getUserID(dat.profile_id,users);
      note.onclick=function(e){
        let mname=_PesantrianKitchen.alias(this.dataset.name);
        _Pesantrian.confirm('Ambil jatah '+mname+'?',
        'Untuk: '+dat.name,
        yes=>{
          if(!yes){return;}
          _PesantrianKitchen.takeEmployee({
            employee_name:this.dataset.employee_name,
            employee_id:this.dataset.employee_id,
            name:this.dataset.name,
            user_id:this.dataset.user_id,
            uid:_Pesantrian.user.id,
            done:1,
          },this);
        });
      };
    }
    row=this.row(dat.id,dat.name,note);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
  for(let key in this.names){
    let opt=document.createElement('option');
    opt.value=key;
    opt.textContent=this.names[key];
    if(name==key){
      opt.selected='selected';
    }
    select.append(opt);
  }
  select.onchange=function(){
    _PesantrianKitchen.tableEatEmployee(this.value);
  };
};
this.takeEmployee=async function(data,el){
  data=typeof data==='object'&&data!==null?data:{};
  let ntext=''+data.employee_name+' sudah mengambil jatah '+this.alias(data.name)+'. ',
  user_id=data.user_id;
  delete data.employee_name;
  delete data.user_id;
  data.year=(new Date).getFullYear();
  data.month=(new Date).getMonth();
  data.date=(new Date).getDate();
  let query=_Pesantrian.buildQuery(data),
  queries=[
    'insert into kitchen '+query,
  ];
  if(user_id!='0'&&user_id.toString().match(/^\d+$/)){
    query=_Pesantrian.buildQuery({
      user_id:data.user_id,
      message:ntext,
      callback:{},
      uid:_Pesantrian.user.id,
    });
    /* queries.push('insert into notification '+query); */
  }
  el.value='Mengirim...';
  el.disabled=true;
  let loader=_Pesantrian.loader(),
  res=await _Pesantrian.request('queries',queries.join(';'));
  loader.remove();
  el.classList.remove('button-take');
  el.classList.add('button-taken');
  el.value='Sudah';
};
this.tableEat=async function(name='dinner'){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  date=(new Date).getDate(),
  aquery=';select * from kitchen where year='
    +year+' and month='+month+' and date='+date
    +' and name="'+name+'" and student_id > 0',
  sdata=await _Pesantrian.request('queries',this.queries+aquery),
  students=sdata[0],
  parents=sdata[1],
  eaten=sdata[2],
  eatens=this.studentIDs(eaten),
  title=this.alias(name)+'<br />'+_Pesantrian.parseDate(),
  row=this.rowHead(title,3),
  select=document.createElement('select'),
  back=document.createElement('input'),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Santri',back);
  table.append(row);
  row.classList.add('tr-head');
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,select);
  table.append(row);
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-add');
  back.onclick=()=>{
    this.init();
  };
  for(let dat of students){
    let note=document.createElement('input');
    note.type='submit';
    if(eatens.indexOf(dat.id)>=0){
      note.disabled=true;
      note.value='Sudah';
      note.classList.add('button-taken');
    }else{
      note.value='Ambil';
      note.classList.add('button-take');
      note.dataset.student_name=dat.name;
      note.dataset.student_id=dat.id;
      note.dataset.mother_id=this.getUserID(dat.mother_id,parents);
      note.dataset.father_id=this.getUserID(dat.father_id,parents);
      note.dataset.name=name;
      note.onclick=function(e){
        let mname=_PesantrianKitchen.alias(this.dataset.name);
        _Pesantrian.confirm('Ambil jatah '+mname+'?',
        'Untuk: '+dat.name,
        yes=>{
          if(!yes){return;}
          _PesantrianKitchen.take({
            student_name:this.dataset.student_name,
            student_id:this.dataset.student_id,
            mother_id:this.dataset.mother_id,
            father_id:this.dataset.father_id,
            name:this.dataset.name,
            uid:_Pesantrian.user.id,
            done:1,
          },this);
        });
      };
    }
    row=this.row(dat.id,dat.name,note);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
  for(let key in this.names){
    let opt=document.createElement('option');
    opt.value=key;
    opt.textContent=this.names[key];
    if(name==key){
      opt.selected='selected';
    }
    select.append(opt);
  }
  select.onchange=function(){
    _PesantrianKitchen.tableEat(this.value);
  };
};
this.take=async function(data,el){
  data=typeof data==='object'&&data!==null?data:{};
  let ntext='Ananda '+data.student_name+' sudah mengambil jatah '+this.alias(data.name)+'. ';
  delete data.student_name;
  data.year=(new Date).getFullYear();
  data.month=(new Date).getMonth();
  data.date=(new Date).getDate();
  let query=_Pesantrian.buildQuery(data),
  queries=[
    'insert into kitchen '+query,
  ];
  if(data.father_id!='0'
    &&data.father_id.toString().match(/^\d+$/)){
    query=_Pesantrian.buildQuery({
      user_id:data.father_id,
      message:ntext,
      callback:JSON.stringify({
        appName:'parent',
        next:'tableStudent',
        args:['studentEat']
      }),
      uid:_Pesantrian.user.id,
    });
    /* queries.push('insert into notification '+query); */
  }
  if(data.mother_id!='0'
    &&data.mother_id.toString().match(/^\d+$/)){
    query=_Pesantrian.buildQuery({
      user_id:data.mother_id,
      message:ntext,
      callback:JSON.stringify({
        appName:'parent',
        next:'tableStudent',
        args:['studentEat']
      }),
      uid:_Pesantrian.user.id,
    });
    /* queries.push('insert into notification '+query); */
  }
  el.value='Mengirim...';
  el.disabled=true;
  let loader=_Pesantrian.loader(),
  res=await _Pesantrian.request('queries',queries.join(';'));
  loader.remove();
  el.classList.remove('button-take');
  el.classList.add('button-taken');
  el.value='Sudah';
};
this.employeeIDs=function(data){
  data=Array.isArray(data)?data:[];
  let res=[];
  for(let i of data){
    if(i.employee_id>0){
      res.push(i.employee_id);
    }
  }return res;
};
this.studentIDs=function(data){
  data=Array.isArray(data)?data:[];
  let res=[];
  for(let i of data){
    if(i.student_id>0){
      res.push(i.student_id);
    }
  }return res;
};
this.getUserID=function(profile_id,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let i of data){
    if(i.profile_id==profile_id){
      res=i.id;
      break;
    }
  }return res;
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
return this.init();
};



/* PesantrianFinance */
;function PesantrianFinance(app){
this.app=app;
this.aliasData={
  id:'Nomor Transaksi',
  method:'Arus Dana',
  name:'Jenis Transaksi',
  petty_cash:'Petty Cash',
  donation:'Donasi',
  register:'Pendaftaran',
  contribution:'SPP',
  saving:'Tabungan',
  infaq:'Infaq',
  type:'Dana ke/dari',
  student:'Santri',
  parent:'Orangtua',
  employee:'Karyawan',
  status:'Status',
  paid:'Lunas',
  unpaid:'Nunggak',
  partly_paid:'Cicilan',
  cash:'Tunai',
  loan:'Pinjaman',
  profile_id:'Pengemban Dana',
  nominal:'Nominal',
  account:'Rekening Bank',
  explanation:'Keterangan',
  evidence:'Bukti Transaksi',
  report:'Berita Acara',
  transaction_date:'Tanggal Transaksi',
  transaction_code:'Kode Transaksi',
  date:'Tanggal Pembuatan',
  register_test:'Pendaftaran Test PPDB',
  register_test_smp:'Pendaftaran Test PPDB SMP',
  register_test_sma:'Pendaftaran Test PPDB SMA',
  register_sma_new:'Daftar Ulang Santri Baru SMA',
  register_sma_next:'Daftar Ulang Lanjutan SMA',
  register_smp:'Daftar Ulang Santri Baru SMP',
  register_annually:'Daftar Ulang Tahunan',
  school_event:'Event Sekolah',
  tahfidz_camp:'Tahfidz Camp',
  initial_fund:'Dana Awal',
  graduation:'Wisuda',
  tryout:'Tryout',
  tutoring:'Bimbel',
  ppm:'PPM-AATIBS',
  brooding:'Pengindukan',
  qrbill_shop:'QR-Shop',
  qrbill_laundry:'QR-Laundry',
  qrbill_penalty:'QR-Penalty',
  year:'Tahun',
  month:'Bulan',
  studentSPP:'SPP',
  studentSaving:'TABUNGAN',
  employeeSaving:'TABUNGAN',
  studentOther:'LAINNYA',
  studentSPPX:'EX-SPP',
  studentSavingX:'EX-TABUNGAN',
  0:'January',
  1:'February',
  2:'March',
  3:'April',
  4:'May',
  5:'June',
  6:'July',
  7:'August',
  8:'September',
  9:'October',
  10:'November',
  11:'December',
  studyYear:'Tahun Ajaran',
  debt:'Debet',
  credit:'Kredit',
};
this.studyMonths=[6,7,8,9,10,11,0,1,2,3,4,5];
this.normalMonths=[0,1,2,3,4,5,6,7,8,9,10,11];
this.month=[
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
this.monthLast=[6,7,8,9,10,11];
this.selection={
    name:[
      'donation',
      'petty_cash',
      'register_test_smp',
      'register_test_sma',
      'register_sma_new',
      'register_sma_next',
      'register_smp',
      'register_annually',
      'school_event',
      'tahfidz_camp',
      'initial_fund',
      'infaq',
      'graduation',
      'tryout',
      'tutoring',
      'ppm',
      'brooding',
      'contribution',
      'saving',
      'qrbill_shop',
      'qrbill_laundry',
      'qrbill_penalty',
    ],
    type:[
      'student',
      'parent',
      'employee',
    ],
    status:[
      'unpaid',
      'partly_paid',
      'paid',
      'cash',
      'loan',
    ],
    account:[
      'Aisyah - BSI 7164 540 558',
      'Abu Bakar - BSI 7164 457 715',
      'Donasi Aisyah - BSI 7164 541 066',
      'Donasi Abu Bakar - BSI 7164 458 584',
      'Bendahara - BSI 7134 2000 43',
      'Tunai',
    ],
    accountx:[
      'Aisyah - BSI 7164 540 558 a/n Yayasan Aisyah Mulya',
      'Abu Bakar - BSI 7164 457 715 a/n Yayasan Abu Bakar Mulya',
      'Donasi Aisyah - BSI 7164 541 066 a/n Yayasan Aisyah Mulya',
      'Donasi Abu Bakar - BSI 7164 458 584 a/n Yayasan Abu Bakar Mulya',
      'Bendahara - BSI 7134 2000 43 a/n Rina Ferianti',
      'Tunai',
    ],
    year:[
      '2023',
      '2024',
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030',
    ],
    studyYear:[
      '2023/2024',
      '2024/2025',
      '2025/2026',
      '2026/2027',
      '2027/2028',
      '2028/2029',
      '2029/2030',
    ],
    month:_Pesantrian.range(0,11),
  };
this.rincian={
  register_sma_new:{
    "1":{
      nominal:15000000,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:3150000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    },
    "6":{
      nominal:2500000,
      keterangan:'SPP Bulan July, biaya pendidikan, asrama, makan dan laundry.',
    }
  },
  register_sma_next:{
    "1":{
      nominal:0,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:3150000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    }
  },
  register_smp:{
    "1":{
      nominal:15000000,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:850000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    },
    "6":{
      nominal:2500000,
      keterangan:'SPP Bulan July, biaya pendidikan, asrama, makan dan laundry.',
    }
  },
  register_annually:{
    "1":{
      nominal:0,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:850000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    }
  },
};
this.yearTransaction={
  '2022':'transaction_date > 2021-12-31 and transaction_date < 2023-01-01',
  '2023':'transaction_date > 2022-12-31 and transaction_date < 2024-01-01',
  '2024':'transaction_date > 2023-12-31 and transaction_date < 2025-01-01',
  '2025':'transaction_date > 2024-12-31 and transaction_date < 2026-01-01',
  '2026':'transaction_date > 2025-12-31 and transaction_date < 2027-01-01',
  '2027':'transaction_date > 2026-12-31 and transaction_date < 2028-01-01',
  '2028':'transaction_date > 2027-12-31 and transaction_date < 2029-01-01',
  '2029':'transaction_date > 2028-12-31 and transaction_date < 2030-01-01',
  '2030':'transaction_date > 2029-12-31 and transaction_date < 2031-01-01',
};
this.sppMax={
  7:2100000,
  8:2100000,
  9:2100000,
  10:2200000,
  11:2200000,
  12:2200000,
  27:2100000,
  28:2100000,
  29:2100000,
  30:2200000,
  31:2200000,
  32:2200000,
};

this.init=async function(){
  this.app.menuButton.remove();
  
  /* finance apps */
  let apps=[
    {
      name:'table',
      title:'Buku Besar',
      callback:function(e){
        _PesantrianFinance.tableTransaction();
      }
    },
    {
      name:'form2',
      title:'Form',
      callback:function(e){
        _PesantrianFinance.addTransaction(true);
      }
    },
    {
      name:'bill',
      title:'SPP',
      callback:function(e){
        _PesantrianFinance.tableStudent('studentSPP');
      }
    },
    {
      name:'form',
      title:'Tabungan',
      callback:function(e){
        _PesantrianFinance.tableStudent('studentSaving');
      }
    },
    {
      name:'form3',
      title:'Lainnya',
      callback:function(e){
        _PesantrianFinance.tableStudent('studentOther');
      }
    },
    {
      name:'finance',
      title:'Petty Cash',
      callback:function(e){
        _PesantrianFinance.pettyCash();
      }
    },
    {
      name:'extracurricular',
      title:'Beasiswa',
      callback:function(e){
        _PesantrianFinance.scholarship();
      }
    },
    {
      name:'shop2',
      title:'QR-Shop',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_shop');
      }
    },
    {
      name:'shop2',
      title:'QR-ShopM',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_shopm');
      }
    },
    {
      name:'laundryx',
      title:'QR-Laundry',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_laundry');
      }
    },
    {
      name:'form7',
      title:'QR-Penalty',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_penalty');
      }
    },
    {
      name:'transcript',
      title:'Blokir Kartu',
      callback:function(e){
        _PesantrianFinance.blockedCards();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianFinance.checkCredit();
      }
    },
    {
      name:'qrcode',
      title:'QRWithdraw',
      callback:function(e){
        _PesantrianFinance.withdrawForm();
      }
    },
    {
      name:'form6',
      title:'Tabungan Karyawan',
      callback:function(e){
        _PesantrianFinance.tableEmployee('employeeSaving');
      }
    },
    {
      name:'bill',
      title:'Ex-SPP',
      callback:function(e){
        _PesantrianFinance.tableStudentX('studentSPPX');
      }
    },
    {
      name:'form',
      title:'Ex-Tabungan',
      callback:function(e){
        _PesantrianFinance.tableStudentX('studentSavingX');
      }
    },
  ];
  if(_Pesantrian.user.profile.position!='finance'
    &&_Pesantrian.user.privilege<0x10){
    apps=[
      {
        name:'bill',
        title:'SPP',
        callback:function(e){
          _PesantrianFinance.tableStudent('studentSPP');
        }
      },
    ];
  }
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianFinance=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* evidence page */
this.evidencePage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  query='select id,evidence from transaction where id='+id,
  data=await _Pesantrian.request('query',query,50),
  text='Error: Data #'+id+' tidak ditemukan!';
  if(data.length==0){
    _Pesantrian.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  let evi=this.evidencePath(data[0].evidence),
  pro=document.createElement('div'),
  pimg=new Image;
  pimg.src=evi!=''?evi:_Pesantrian.IMAGES['icon-error.png'];
  pimg.main=pro;
  pimg.dialog=dialog;
  pimg.style.maxWidth='100%';
  pro.append(pimg);
  pimg.onload=function(){
    this.dialog.blank();
    this.dialog.main.append(this.main);
  };
  pimg.onerror=function(){
    this.dialog.loader.src=_Pesantrian.IMAGES['icon-error.png'];
  };
};

/* scholarship */
this.scholarship=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from scholarship order by name asc',
    'select id,name,graduated from student where graduated=0',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  beas=datas[0],
  students=datas[1],
  row=this.rowHead('BEASISWA SPP',4),
  add=document.createElement('input'),
  table=this.table();
  loader.remove();
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    let aid='add-member',
    ael=document.getElementById(aid),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:students,
      key:'student_id',
      value:'',
      placeholder:'Nama Santri...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    sdiv=document.createElement('div'),
    sname=document.createElement('input'),
    ssave=document.createElement('input'),
    snominal=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    snominal.name='nominal';
    snominal.type='number';
    snominal.placeholder='Nominal...';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into scholarship '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await this.scholarship();
        },1600);
      }
    };
    sdiv.append(snominal);
    sdiv.append(sname);
    row=this.row('',sid,sdiv,ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  row=this.row('ID','Nama Santri','Maksimal SPP',add);
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','');
  table.append(row);
  for(let item of beas){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=item.id;
    del.dataset.name=item.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from scholarship where id='+id;
      _Pesantrian.confirm('Hapus beasiswa?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    row=this.row(item.student_id,item.name,this.parseNominal(item.nominal),del);
    row.id=item.id;
    row.dataset.name=item.name;
    table.append(row);
  }
};

/* qr bill */
this.qrBill=async function(code){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let codes=[
    'qrbill_shop',
    'qrbill_shopm',
    'qrbill_laundry',
    'qrbill_penalty',
  ];
  if(codes.indexOf(code)<0){
    return _Pesantrian.alert('Error: Invalid code.','','error');
  }
  let loader=_Pesantrian.loader(),
  queries=[
    'select sum(nominal) as nominal,transaction_code from transaction where transaction_code="'+code+'"',
    'select * from transaction where name="'+code+'" order by transaction_date asc',
    'select id,name from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nominalTotal=parseInt(data[0][0].nominal,10),
  trans=data[1],
  employees=data[2],
  table=this.table(),
  total=0,
  add=document.createElement('input'),
  row=this.rowHead('QR Bill<br />Code: '+code,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* add */
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.qrBillForm(code,employees);
  };
  /* pre counting */
  row=this.row('','Total QRBill',
    _Pesantrian.parseNominal(nominalTotal),'');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
  /* header */
  row=this.row('Tanggal','Nama Penerima','Nominal',add);
  row.classList.add('tr-head');
  table.append(row);
  /* each */
  for(let d of trans){
    if(d.name!=code||d.method!=0){
      continue;
    }
    let dtime=_Pesantrian.parseDate(d.transaction_date),
    nominal=_Pesantrian.parseNominal(d.nominal),
    name=_Pesantrian.getValueByKey('id',d.profile_id,'name',employees),
    view=document.createElement('input'),
    check=document.createElement('div'),
    checkInput=document.createElement('input'),
    checkLabel=document.createElement('label'),
    row=this.row(dtime,name,nominal,view);
    row.childNodes[2].classList.add('td-right');
    table.append(row);
    view.type='submit';
    view.value='Detail';
    view.classList.add('button-detail');
    view.dataset.id=d.id+'';
    view.onclick=function(){
      _PesantrianFinance.detailTransaction(this.dataset.id);
    };
    total+=parseInt(d.nominal,10);
  }
  /* total given */
  let totalIDR=_Pesantrian.parseNominal(total);
  row=this.row('','Total Penyerahan ',totalIDR,'');
  row.classList.add('tr-head');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
  /* total deposit */
  let deposit=nominalTotal-total,
  depositIDR=_Pesantrian.parseNominal(deposit);
  row=this.row('','Sisa Deposit ',depositIDR,'');
  row.classList.add('tr-head');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
};
/* qr bill form */
this.qrBillForm=async function(code,employees=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.qrBill(code);
    })
  );
  let codes=[
    'qrbill_shop',
    'qrbill_laundry',
    'qrbill_penalty',
  ];
  if(codes.indexOf(code)<0){
    return _Pesantrian.alert('Error: Invalid code.','','error');
  }
  /* table and header */
  let table=this.table(),
  selection=this.selection,
  methods=['Keluar','Masuk'],
  passes=[],
  hidden=[
    'transaction_code','type','name',
    'year','month','uid','data',
  ],
  integers=['nominal','account'],
  trans={
    name:code,
    method:0,
    type:'employee',
    profile_id:0,
    nominal:0,
    transaction_code:code+'_paid',
    transaction_date:(new Date).getFullYear()+'-'
      +((new Date).getMonth()+1).toString().padStart(2,'0')+'-'
      +(new Date).getDate().toString().padStart(2,'0'),
    evidence:'',
    account:'Tunai',
    status:'paid',
    explanation:'Penyerahan dana '+code,
    uid:_Pesantrian.user.id,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    data:'{rincian:{}}',
  };
  row=this.rowHead('QR Bill Form<br />Code: '+code,4);
  table.append(row);
  this.app.body.append(table);
  /* form */
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:employees,
        placeholder:this.alias('employee')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  /* button save */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.qrBill(code);
      },1600);
    }
  };
};


/* qr bill old */
this.qrBill___Old=async function(code){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let codes=[
    'qrbill_shop',
    'qrbill_laundry',
    'qrbill_penalty',
  ];
  if(codes.indexOf(code)<0){
    return _Pesantrian.alert('Error: Invalid code.','','error');
  }
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from transaction where transaction_code="'+code+'"',
    'select id,name from employee',
    'select id,name from student',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  types={
    employee:data[1],
    student:data[2],
  },
  table=this.table(),
  row=this.rowHead('QR Bill<br />Code: '+code,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* header */
  row=this.row('Date','Name','Nominal','Check');
  row.classList.add('tr-head');
  table.append(row);
  /* each */
  for(let d of data[0]){
    if(d.name!='saving'||d.method!=0){
      continue;
    }
    let dtime=_Pesantrian.parseDatetime(parseInt(d.time,10)*1000),
    nominal=_Pesantrian.parseNominal(d.nominal),
    name=_Pesantrian.getValueByKey('id',d.profile_id,'name',types[d.type]),
    check=document.createElement('div'),
    checkInput=document.createElement('input'),
    checkLabel=document.createElement('label'),
    row=this.row(dtime,name,nominal,check);
    table.append(row);
    check.append(checkInput);
    check.append(checkLabel);
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-center');
    checkInput.type='checkbox';
    checkInput.name='check';
    checkInput.id='check-'+d.id;
    checkInput.dataset.id=d.id+'';
    checkInput.dataset.nominal=d.nominal+'';
    checkLabel.classList.add('checkbox');
    checkLabel.innerText='+';
    checkLabel.setAttribute('for','check-'+d.id);
    checkInput.onchange=function(){
      let totalEl=document.getElementById('total'),
      total=0,
      checks=document.querySelectorAll('input[name="check"]');
      for(let i=0;i<checks.length;i++){
        let ci=checks[i];
        if(!ci.checked){continue;}
        total+=parseInt(ci.dataset.nominal,10);
      }
      totalEl.innerText=_Pesantrian.parseNominal(total);
    };
  }
  /* header */
  let totalIDR=_Pesantrian.parseNominal('0'),
  give=document.createElement('input');
  row=this.row('','Total',totalIDR,give);
  row.classList.add('tr-head');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-center');
  row.childNodes[2].id='total';
  /* give */
  give.type='submit';
  give.value='Serahkan';
  give.classList.add('button-taken');
  give.dataset.code=code;
  give.onclick=async function(){
    let total=0,
    queries=[],
    code=this.dataset.code+'_paid',
    checks=document.querySelectorAll('input[name="check"]');
    for(let i=0;i<checks.length;i++){
      let ci=checks[i],
      id=ci.dataset.id;
      if(!ci.checked){continue;}
      total+=parseInt(ci.dataset.nominal,10);
      queries.push('update transaction (transaction_code='+code+') where id='+id);
    }
    let yes=await _Pesantrian.confirmX('Serahkan sekarang?','Total: '+_Pesantrian.parseNominal(total));
    if(!yes){return;}
    let loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries.join(';'));
    _PesantrianFinance.qrBill(this.dataset.code);
  };
};


/* qrscanner -- Withdrawal */
this.withdrawScanner=async function(nominal,table){
  nominal=nominal||1;
  nominal=parseInt(nominal,10);
  if(!nominal.toString().match(/^\d+$/)
    ||nominal<1){
    return await _Pesantrian.alertX('Error: Invalid nominal input!','','error');
  }
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    data={
      name:'saving',
      type,
      profile_id:student_id,
      method:0,
      nominal,
      date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      transaction_date:[
        year,
        (month+1).toString().padStart(2,'0'),
        date.toString().padStart(2,'0'),
      ].join('-'),
      month,
      year,
      status:'paid',
      account:'Tunai',
      uid:_Pesantrian.user.id,
      data:{"rincian":{}},
      report:'',
      explanation:'Tarik tunai (Withdrawal)',
      transaction_code:'qrbill_withdrawal',
    },
    qrData={
      student_id,
      student_name,
      nominal,
      year,
      month,
      date,
    },
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='
        +student_id+' and name="saving" and '
        +this.getQueryTA(),
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    if(blocked){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
    if(saving<parseInt(nominal)){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Saldo tabungan tidak mencukupi!',
        'Saldo: '+_Pesantrian.parseNominal(saving)
          +' ('+student_name+')',
        'error'
      );
    }
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    qrInnerQuery=_Pesantrian.buildQuery(qrData),
    qrQuery='insert into shop_qrbill '+qrInnerQuery,
    query='insert into transaction '+innerQuery,
    res=await _Pesantrian.request('queries',[
      query,
    ].join(';'));
    loader.remove();
    if(res.join('')==1){
      let al=await _Pesantrian.alertX(
        'Transaksi berhasil!',
        'Saldo: '+_Pesantrian.parseNominal(saving-parseInt(nominal))
          +' ('+student_name+')',
        'success'
      );
      return;
    }
    let al=await _Pesantrian.alertX(
      'Error: Failed to pay the bill!',
      res,
      'error'
    );
};
this.withdrawForm=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  let date=(new Date).getDate(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  query='select * from shop_qrbill where year='+year+' and month='+month+' and date='+date,
  title='QRScan Withdrawal<br />'+_Pesantrian.parseDate([
    year,
    (month+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  total=0,
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  /* nominal span */
  let nspan=document.createElement('span');
  nspan.innerText=_Pesantrian.parseNominal(0);
  /* nominal */
  let nominal=document.createElement('input');
  nominal.type='number';
  nominal.name='nominal';
  nominal.placeholder='Nominal...';
  nominal.span=nspan;
  nominal.onkeyup=function(){
    nspan.innerText=_Pesantrian.parseNominal(this.value);
  };
  /* button */
  button=document.createElement('input');
  button.type='submit';
  button.value='Scan';
  button.classList.add('button-take');
  button.onclick=()=>{
    if(!nominal.value.match(/^\d+$/)){
      return _Pesantrian.alert('Error: Invalid nominal input!','','error');
    }
    this.withdrawScanner(nominal.value,table);
  };
  /* row */
  row=this.row('Nominal',nominal,nspan,button);
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  this.app.body.append(table);
};


/* blocked card */
this.blockedCards=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  year=year||(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from blocked_card where year='
      +year+' and month='+month
      +' and type="student"',
    'select id,name,graduated,gender from student where graduated=0',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  table=this.table(),
  row=this.rowHead('BLOKIR KARTU<br />'
    +this.month[month]+' '+year,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* header */
  row=this.row('ID','Nama Santri','Status','');
  row.childNodes[0].classList.add('td-center');
  row.classList.add('tr-head');
  table.append(row);
  /* find */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','');
  table.append(row);
  /* each */
  let counter=0;
  for(let student of data[1]){
    counter++;
    let status=_Pesantrian.getValueByKey(
      'profile_id',
      student.id,
      'id',
      data[0],
    )||false,
    block=document.createElement('input'),
    spanid=document.createElement('span'),
    row=this.row(spanid,student.name,(status?'true':'false'),block);
    row.childNodes[0].classList.add('td-center');
    row.dataset.name=student.name;
    table.append(row);
    spanid.innerText=student.id;
    spanid.classList.add('gender');
    spanid.classList.add('gender-'+student.gender);
    block.type='submit';
    block.value=status?'Unblock':'Block';
    block.classList.add('button-take'+(status?'n':''));
    block.dataset.profile_id=student.id;
    block.dataset.status=status.toString();
    block.dataset.year=year;
    block.dataset.month=month;
    block.dataset.type='student';
    block.dataset.name=student.name;
    block.status=row.childNodes[2];
    block.onclick=async function(){
      let question=this.dataset.status=='false'
        ?'Block the card?'
        :'Unblock the card?',
      yes=await _Pesantrian.confirmX(question,this.dataset.name);
      if(!yes){return;}
      let loader=_Pesantrian.loader(),
      data={
        year:this.dataset.year,
        month:this.dataset.month,
        type:this.dataset.type,
        profile_id:this.dataset.profile_id,
        note:'Blocked by '+_Pesantrian.user.name,
      },
      query=this.dataset.status=='false'
        ?'insert into blocked_card '+_Pesantrian.buildQuery(data)
        :'delete from blocked_card where profile_id='
          +this.dataset.profile_id
          +' and type="'+this.dataset.type+'"',
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(this.dataset.status=='false'){
        this.dataset.status='true';
        this.value='Unblock';
        this.classList.remove('button-take');
        this.classList.add('button-taken');
        this.status.innerText='true';
      }else{
        this.dataset.status='false';
        this.value='Block';
        this.classList.remove('button-taken');
        this.classList.add('button-take');
        this.status.innerText='false';
      }
    };
  }
  /*
    result: ARRAY
            0: (aid) [id:10] => LDB_AID
            1: (time) [time:10] => LDB_TIME
            2: (int) [year:4] => "2024"
            3: (int) [month:2] => "0"
            4: (string) [type:20] => "student"
            5: (int) [profile_id:10] => "0"
            6: (string) [note:100] => LDB_BLANK
  */
};


/* qrscanner -- check */
this.checkCredit=async function(){
  let student=await _Pesantrian.scannerPageX(),
  tables={
    s:'student',
    e:'employee',
  };
  if(!student||student.id==0
    ||!tables.hasOwnProperty(student.table)){
    return _Pesantrian.alert('Error: Invalid QRCode!','','error');
  }
    /* prepare date, month and year */
    let loader=_Pesantrian.loader(),
    student_id=student.id.toString(),
    student_name=student.name,
    date=(new Date).getDate(),
    month=(new Date).getMonth(),
    year=(new Date).getFullYear(),
    type=tables[student.table],
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='+student_id
        +' and name="saving" ',
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    loader.remove();
    if(blocked){
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
      );
    }
      return _Pesantrian.alert(
        _Pesantrian.parseNominal(saving),
        student_name,
        'info'
      );
};
this.getQueryTA=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth(),
  res=[
    'date > "'+year+'-07-01"',
    'date < "'+(year+1)+'-06-30"',
  ];
  if(month<6){
    res=[
      'date > "'+(year-1)+'-07-01"',
      'date < "'+year+'-06-30"',
    ];
  }
  return res.join(' and ');
};
this.getSavingBalance=function(data=[]){
  let ndata=this.getFinanceByType(data,'saving'),
  total=0;
  for(let d of ndata){
    if(d.method==1){
      total+=parseInt(d.nominal);
    }else{
      total-=parseInt(d.nominal);
    }
  }return total;
};
this.getFinanceByTypeX=function(data,type){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
      if(!res.hasOwnProperty(line.name)){
        res[line.name]=[];
      }
      res[line.name].push(line);
    }
  }
  return res.hasOwnProperty(type)?res[type]:[];
};



/* report */
this.laundryReport=function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let studyYear=this.getStudyYear().split('/'),
  row=this.rowHead('LAPORAN LAUNDRY <br />Tahun Ajaran '
    +studyYear.join('/'),2),
  table=this.table();
  table.append(row);
  for(let i of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.dataset.month=''+i;
    see.dataset.year=(i<6?studyYear[1]:studyYear[0]);
    see.onclick=function(){
      _PesantrianFinance.laundryReportMonthly(this.dataset.month,this.dataset.year);
    };
    row=this.row(this.month[i]+' '
      +(i<6?studyYear[1]:studyYear[0]),see);
    table.append(row);
  }
  this.app.body.append(table);
};
this.laundryReportMonthly=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.laundryReport();
    })
  );
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from laundry where month='+month+' and year='+year,
    'select id,name,graduated from student where graduated=0',
    'select id,name,live_in from employee where live_in=1',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  laundries=datas[0],
  students=datas[1],
  employees=datas[2],
  row=this.rowHead('SUBSIDI LAUNDRY KARYAWAN<br />'
    +this.month[month]+' '+year,3),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Karyawan','Saldo Subsidi');
  row.classList.add('tr-head');
  table.append(row);
  for(let user of employees){
    let credit=this.getCredit(user.id,laundries,'employee'),
    saldo=document.createElement('span');
    saldo.innerText=_Pesantrian.parseNominal(credit);
    saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
    saldo.id='credit-'+user.id;
    row=this.row(user.id,user.name,saldo);
    row.dataset.name=user.name;
    table.append(row);
  }
  this.app.body.append(table);
  table=this.table();
  row=this.rowHead('TAGIHAN LAUNDRY SANTRI<br />'
    +this.month[month]+' '+year,3);
  table.append(row);
  row=this.row('ID','Nama Santri','Total Tagihan');
  row.classList.add('tr-head');
  table.append(row);
  for(let user of students){
    let credit=this.getCredit(user.id,laundries,'student'),
    saldo=document.createElement('span');
    if(credit>=0){
      continue;
    }
    saldo.innerText=_Pesantrian.parseNominal(credit);
    saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
    saldo.id='credit-'+user.id;
    row=this.row(user.id,user.name,saldo);
    row.dataset.name=user.name;
    table.append(row);
  }
  this.app.body.append(table);
};


/* petty_cash */
this.pettyCash=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let studyYear=this.getStudyYear().split('/'),
  see,
  row=this.rowHead('PETTY CASH <br />Tahun Ajaran '
    +studyYear.join('/'),2),
  table=this.table();
  table.append(row);
  for(let i of this.studyMonths){
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.dataset.month=''+i;
    see.dataset.year=(i<6?studyYear[1]:studyYear[0]);
    see.onclick=function(){
      _PesantrianFinance.pettyCashMonthly(this.dataset.month,this.dataset.year);
    };
    row=this.row(this.month[i]+' '
      +(i<6?studyYear[1]:studyYear[0]),see);
    table.append(row);
  }
  this.app.body.append(table);
  /* all in studyYear */
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.onclick=function(){
      _PesantrianFinance.pettyCashMonthly();
    };
  row=this.row('Tahun Ajaran '+studyYear.join('/'),see);
  table.append(row);
  
};
this.pettyCashMonthly=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.pettyCash();
    })
  );
  
  let studyYear=this.getStudyYear().split('/'),
  yearMin=studyYear[0]+'-06-30',
  yearMax=studyYear[1]+'-07-01',
  query='select * from transaction where name="petty_cash"';
  
  if(month&&year){
    query+=' and month='+month+' and year='+year;
  }else{
    query+=' and date > "'+yearMin+'" and date < "'+yearMax+'"';
  }
  let loader=_Pesantrian.loader(),
  queries=[
      query
    ].join(';');
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  title='PETTY CASH<br />'
    +(month&&year?'Bulan '+this.month[month]+' '+year
      :'Tahun Ajaran '+studyYear.join('/')),
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tgl','No. Kwitansi','Keterangan','Kredit','Debet',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='PettyForm';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.pettyCashForm(month,year);
  };
  let totalPlus=0,
  totalMinus=0;
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.dataset.method=item.method+'';
    del.dataset.nominal=item.nominal+'';
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id),
      tot=document.querySelector('tr#shop-total'),
      tel=document.querySelector('table#shop');
      if(!el||!tel){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from transaction where id='
          +this.dataset.id,
        totalPlus=parseInt(tel.dataset.plus),
        totalMinus=parseInt(tel.dataset.minus),
        nominal=parseInt(this.dataset.nominal),
        method=parseInt(this.dataset.method),
        res=await _Pesantrian.request('query',query);
        if(method==1){
          totalPlus-=nominal;
        }else{
          totalMinus-=nominal;
        }
        tel.dataset.plus=totalPlus+'';
        tel.dataset.minus=totalMinus+'';
        tot.childNodes[2].innerText=_Pesantrian.parseNominal(totalPlus);
        tot.childNodes[3].innerText=_Pesantrian.parseNominal(totalMinus);
        tot.childNodes[4].innerText=_Pesantrian.parseNominal(totalPlus-totalMinus);
        el.remove();
      });
    };
    let nominal=_Pesantrian.parseNominal(item.nominal),
    kwi=item.transaction_code,
    tgl=(new Date(item.time*1000)).getDate();
    if(item.method==1){
      row=this.row(tgl,kwi,item.name,nominal,'',del);
      totalPlus+=parseInt(item.nominal);
    }else{
      row=this.row(tgl,kwi,item.name,'',nominal,del);
      totalMinus+=parseInt(item.nominal);
    }
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  table.id='shop';
  table.dataset.plus=totalPlus+'';
  table.dataset.minus=totalMinus+'';
  
  row=this.row('','TOTAL',
    _Pesantrian.parseNominal(totalPlus),
    _Pesantrian.parseNominal(totalMinus),
    _Pesantrian.parseNominal(totalPlus-totalMinus)
    );
  row.childNodes[1].classList.add('extra-high');
  row.childNodes[4].setAttribute('colspan',2);
  row.classList.add('tr-head');
  row.id='shop-total';
  table.append(row);
  this.app.body.append(table);
};
this.pettyCashForm=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.pettyCashMonthly(month,year);
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  studyYear=this.getStudyYear().split('/'),
  title='FORM PETTY CASH<br />'
    +(month&&year?'Bulan '+this.month[month]+' '+year
      :'Tahun Ajaran '+studyYear.join('/')),
  row=this.rowHead(title,2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report','evidence'],
  hidden=['name','year','month','status'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='petty_cash';
  trans.nominal=0;
  trans.account='Bendahara - BSI 7134 2000 43';
  if(month&&year){
    trans.month=month;
    trans.year=year;
  }
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
      if(key=='transaction_code'){
        alias='Nomor Kwitansi';
      }
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  
  /* button save */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=async ()=>{
    await this.pettyCashMonthly(month,year);
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.pettyCash(month,year);
      },1600);
    }
  };
};


/* student -- other transactions */
this.studentOther=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentOther');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and '
      +this.queryOthers()+' and '
      +this.queryTA(),
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=datas[0],
  types=[
    'register_test_smp',
    'register_test_sma',
    'register_sma_new',
    'register_sma_next',
    'register_smp',
    'register_annually',
    'school_event',
  ],
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* finance - others - LAINNYA */
  title='LAINNYA<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Detail');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance){
    let date=_Pesantrian.parseDate(line.transaction_date),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    /* detail */
    let detail=document.createElement('input');
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=''+line.id;
    detail.onclick=function(){
      return _PesantrianFinance.detailTransaction(this.dataset.id);
    };
    /* row */
    row=this.row(date,nominal,dk,this.alias(line.name),detail);
    table.append(row);
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
};
this.studentOtherAdd=async function(){
  return await this.addTransaction(true);
};
this.queryOthers=function(){
  /**
   * 
      'register_test_smp',
      'register_test_sma',
      'register_sma_new',
      'register_sma_next',
      'register_smp',
      'register_annually',
      'school_event',
   */
  let res=[
    'name="register_test_smp"',
    'name="register_test_sma"',
    'name="register_sma_new"',
    'name="register_sma_next"',
    'name="register_smp"',
    'name="register_annually"',
    'name="school_event"',
  ].join(' or ');
  return res;
};


/* employee -- saving */
this.employeeSavingAdd=async function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee('employeeSaving');
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('FORM TABUNGAN KARYAWAN',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report'],
  hidden=['type','name','year','month','status'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='saving';
  trans.nominal=0;
  trans.type='employee';
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.employee;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'employee')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  
  /* button save */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=async ()=>{
    await this.tableEmployee('employeeSaving');
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableEmployee('employeeSaving');
      },1600);
    }
  };
};
this.employeeSaving=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee('employeeSaving');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="employee" and name="saving" '
      +' order by transaction_date asc',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* finance - saving - TABUNGAN */
  title='TABUNGAN KARYAWAN<br />'+data.name,
  row=this.rowHead(title,6);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo','');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    detail=document.createElement('input'),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=line.id+'';
    detail.data=data;
    detail.onclick=function(){
      _PesantrianFinance.detailTransaction(
        this.dataset.id,
        ()=>{
          _PesantrianFinance.employeeSaving(this.data);
        }
      );
    };
    row=this.row(
      date,
      nominal,
      dk,
      line.explanation,
      _Pesantrian.parseNominal(total),
      detail,
    );
    table.append(row);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','',pbutton);
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
};
this.tableEmployee=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  queries=[
    'select id,name,position from employee where id>0',
    innerApp=='employeeSaving'
      ?'select * from transaction where type="employee"'
        +' and name="saving" '
      :''
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  total=0,
  row=this.rowHead(this.alias(innerApp)+' KARYAWAN',4),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  let add=document.createElement('input');
  add.type='submit';
  add.value='FORM '+this.alias(innerApp);
  add.classList.add('button-add');
  add.dataset.method=innerApp;
  add.dataset.data=JSON.stringify(students);
  add.onclick=function(){
    let data=_Pesantrian.parseJSON(this.dataset.data),
    method=this.dataset.method+'Add';
    if(!_PesantrianFinance.hasOwnProperty(method)){
      _Pesantrian.alert('Form tidak tersedia!','','error');
      return;
    }
    _PesantrianFinance[method].apply(_PesantrianFinance,[data]);
  };
  let saldo=innerApp=='employeeSaving'?'Saldo':'',
  saving=[];
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=16){
    row=this.row('ID','Nama Karyawan',saldo,add);
  }else{
    row=this.row('ID','Nama Karyawan',saldo,'');
  }
  row.classList.add('tr-head');
  row.id='tr-head';
  table.append(row);
  /* find key */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  /* find balance */
  let sfind=_Pesantrian.findInput('balance','number','Saldo...');
  row=this.row('',find,innerApp=='employeeSaving'?sfind:'','');
  table.append(row);
  /* get saving */
  if(innerApp=='employeeSaving'){
    saving=this.getFinanceByType(
      Array.isArray(data[1])?data[1]:[],
      'saving'
    );
  }
  /* each */
  for(let line of students){
    if(line.position=='resign'){
      continue;
    }
    let stat=document.createElement('input');
    stat.type='submit';
    stat.value='Buka';
    stat.classList.add('button-take');
    stat.dataset.data=JSON.stringify(line);
    stat.dataset.method=innerApp;
    stat.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      if(!_PesantrianFinance.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianFinance[this.dataset.method].apply(_PesantrianFinance,[data]);
    };
    /* get saldo */
    let saldo=document.createElement('span'),
    sdata=_Pesantrian.getDataByKey(
      'profile_id',
      line.id,
      saving,
      true
    ),
    sbalance=this.getSavingBalance(sdata),
    ssbalance=_Pesantrian.parseNominal(sbalance);
    saldo.innerText=ssbalance;
    total+=sbalance;
    /* row */
    row=this.row(
      line.id,
      line.name,
      innerApp=='employeeSaving'?saldo:'',
      stat
    );
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    row.dataset.balance=ssbalance;
    row.childNodes[2].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  if(innerApp=='employeeSaving'){
    row=this.row('','Total',_Pesantrian.parseNominal(total),'');
    row.childNodes[2].classList.add('td-right');
    row.classList.add('tr-head');
    table.append(row);
  }
};


/* student ex -- saving and contribution */
this.studentSPPX=async function(data,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudentX('studentSPPX');
    })
  );
  let cyear=this.getStudyYear().split('/')[0];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and year='
      +year+' or year='+(year+1)+' order by month asc',
    'select * from scholarship where student_id='+data.id,
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  dclass=datas[2].length>0?parseInt(datas[2][0].class):13,
  maxPaid=datas[1].length>0?parseInt(datas[1][0].nominal):this.sppMax[dclass],
  total=0,
  lines,
  studyYear=[year,year+1],
  nominal,
  nominals={},
  rlines=[],
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
  /* tahun ajaran */
  let sta=document.createElement('select');
  for(let yr of _Pesantrian.range(2023,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr+'/'+(yr+1);
    if(yr==year){
      opt.selected='selected';
    }
    sta.append(opt);
  }
  sta.data=data;
  sta.onchange=function(){
    _PesantrianFinance.studentSPPX(this.data,this.value);
  };
  sta.style.backgroundColor='#fff';
  /* finance - contribution - SPP */
  title='EX-SPP<br />'+data.name
    +'<br />Tahun Ajaran '+year+'/'+(year+1),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal','Status',sta);
  row.classList.add('tr-head');
  table.append(row);
  lines=this.parseSPP(finance.contribution,year);
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    status=nominal>=maxPaid?'Lunas':'-',
    syear=this.monthLast.indexOf(monthName)>=0?studyYear[0]:studyYear[1],
    tgl=this.getDateByMonth(monthName,lines);
    /* parse detail */
    let plines=_Pesantrian.getDataByKey('month',monthName,lines,true),
    col=document.createElement('div');
    for(let line of plines){
      let detail=document.createElement('input');
      detail.type='submit';
      detail.value='Detail';
      detail.classList.add('button-detail');
      detail.dataset.id=line.id+'';
      detail.data=data;
      detail.onclick=function(){
        _PesantrianFinance.detailTransaction(
          this.dataset.id,
          ()=>{
            _PesantrianFinance.studentSPPX(this.data);
          }
        );
      };
      col.append(detail);
    }
    /* receipt selector */
    let rsel=document.createElement('input');
    rsel.type='submit';
    rsel.value='Receipt';
    rsel.classList.add('button-view');
    rsel.lines=plines;
    rsel.data=data;
    rsel.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    if(plines.length>0){
      col.append(rsel);
    }
    row=this.row(
      tgl,
      this.alias(monthName)+' '+syear,
      nominalRp,
      status,
      col,
    );
    table.append(row);
  }
  this.app.body.append(table);
  /* receipt */
    let receipt=document.createElement('input');
    receipt.type='submit';
    receipt.value='All Receipts';
    receipt.classList.add('button-view');
    receipt.data=data;
    receipt.lines=lines;
    receipt.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    row=this.row('','','',receipt);
    row.style.backgroundColor='transparent';
    row.childNodes[3].setAttribute('colspan',2);
    table.append(row);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentSavingX=async function(data,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudentX('studentSavingX');
    })
  );
  let cyear=this.getStudyYear().split('/')[0];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="saving" order by transaction_date asc',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* tahun ajaran */
  let sta=document.createElement('select');
  for(let yr of _Pesantrian.range(2023,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr+'/'+(yr+1);
    if(yr==year){
      opt.selected='selected';
    }
    sta.append(opt);
  }
  sta.data=data;
  sta.onchange=function(){
    _PesantrianFinance.studentSavingX(this.data,this.value);
  };
  sta.style.backgroundColor='#fff';
  /* finance - saving - TABUNGAN */
  title='EX-TABUNGAN<br />'+data.name
    +'<br />Tahun Ajaran '+year+'/'+(year+1),
  row=this.rowHead(title,6);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo','');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    detail=document.createElement('input'),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=line.id+'';
    detail.data=data;
    detail.onclick=function(){
      _PesantrianFinance.detailTransaction(
        this.dataset.id,
        ()=>{
          _PesantrianFinance.studentSavingX(this.data);
        }
      );
    };
    row=this.row(
      date,
      nominal,
      dk,
      line.explanation,
      _Pesantrian.parseNominal(total),
      detail,
    );
    table.append(row);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','',pbutton);
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
};
this.tableStudentX=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  queries=[
    'select id,name,graduated,item_code from student where graduated=1',
    innerApp=='studentSavingX'
      ?'select * from transaction where type="student"'
        +' and name="saving" '
      :''
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  total=0,
  row=this.rowHead(this.alias(innerApp)
    +'<br />Tahun Ajaran '+this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  let add=document.createElement('input');
  add.type='submit';
  add.value='FORM '+this.alias(innerApp);
  add.classList.add('button-add');
  add.dataset.method=innerApp;
  add.dataset.data=JSON.stringify(students);
  add.onclick=function(){
    let data=_Pesantrian.parseJSON(this.dataset.data),
    method=this.dataset.method+'Add';
    if(!_PesantrianFinance.hasOwnProperty(method)){
      _Pesantrian.alert('Form tidak tersedia!','','error');
      return;
    }
    _PesantrianFinance[method].apply(_PesantrianFinance,[data]);
  };
  let saldo=innerApp=='studentSavingX'?'Saldo':'',
  saving=[];
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=16){
    row=this.row('ID','Nama Santri',saldo,'');
  }else{
    row=this.row('ID','Nama Santri',saldo,'');
  }
  row.classList.add('tr-head');
  row.id='tr-head';
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let sfind=_Pesantrian.findInput('balance','number','Saldo...');
  row=this.row('',find,innerApp=='studentSavingX'?sfind:'','');
  table.append(row);
  if(innerApp=='studentSavingX'){
    saving=this.getFinanceByType(
      Array.isArray(data[1])?data[1]:[],
      'saving'
    );
  }
  for(let line of students){
    let stat=document.createElement('input');
    stat.type='submit';
    stat.value='Buka';
    stat.classList.add('button-take');
    stat.dataset.data=JSON.stringify(line);
    stat.dataset.method=innerApp;
    stat.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      if(!_PesantrianFinance.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianFinance[this.dataset.method].apply(_PesantrianFinance,[data]);
    };
    /* get saldo */
    let saldo=document.createElement('span'),
    sdata=_Pesantrian.getDataByKey(
      'profile_id',
      line.id,
      saving,
      true
    ),
    sbalance=this.getSavingBalance(sdata),
    ssbalance=_Pesantrian.parseNominal(sbalance);
    saldo.innerText=ssbalance;
    total+=sbalance;
    /* row */
    row=this.row(
      line.id,
      line.name,
      innerApp=='studentSavingX'?saldo:'',
      stat
    );
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    row.dataset.balance=ssbalance;
    row.childNodes[2].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  if(innerApp=='studentSavingX'){
    row=this.row('','Total',_Pesantrian.parseNominal(total),'');
    row.childNodes[2].classList.add('td-right');
    row.classList.add('tr-head');
    table.append(row);
  }
};

/* student -- saving and contribution */
this.receiptSPP=async function(data,lines){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentSPP(data);
    })
  );
  /* table */
  let img=new Image,
  title='BUKTI PEMBAYARAN<br />'
    +'MA\'HAD AISYAH ABU BAKAR TAHFIZH ISLAMIC BOARDING SCHOOL'
    +'<br />TAHUN AJARAN '+this.getStudyYear(),
  row=this.row(img,title),
  table=this.table();
  table.append(row);
  row.style.backgroundColor='transparent';
  row.childNodes[0].style.textAlign='center';
  row.childNodes[0].style.minWidth='100px';
  row.childNodes[0].style.width='100px';
  row.childNodes[1].style.fontWeight='bold';
  row.childNodes[1].style.fontSize='20px';
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  img.alt='atibs logo';
  img.src=_Pesantrian.IMAGES['logo.png'];
  img.style.width='100px';
  img.style.height='100px';
  this.app.body.append(table);
  /* table data header */
  let today=_Pesantrian.parseDate((new Date).getTime());
  row=this.row('Nama Santri',data.name);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Kode Barang',data.item_code,today);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[2].setAttribute('colspan',2);
  table.append(row);
  /* table header */
  row=this.row(
    'No',
    'Nomor Transaksi',
    'Jenis Pembayaran',
    'Cicilan',
    'Jumlah',
  );
  row.classList.add('tr-head');
  table.append(row);
  /* per line transaction */
  let counter=0,
  total=0,
  ntable=this.table();
  for(let mon of this.studyMonths){
    let plines=_Pesantrian.getDataByKey('month',mon,lines,true);
    for(let line of plines){
      counter++;
      row=this.row(
        counter,
        line.id,
        'SPP '+this.month[line.month]+' '+line.year,
        this.month[line.month],
        _Pesantrian.parseNominal(line.nominal),
      );
      row.childNodes[0].classList.add('td-center');
      row.childNodes[1].classList.add('td-center');
      row.childNodes[4].classList.add('td-right');
      table.append(row);
      total+=parseInt(line.nominal,10);
    }
  }
  /* 
  alert(_Pesantrian.parser.likeJSON(lines,3));
  */
  /* total */
  row=this.row(
    '','','','Total',
    _Pesantrian.parseNominal(total),
  );
  row.classList.add('tr-head');
  row.childNodes[4].classList.add('td-right');
  row.childNodes[0].style.backgroundColor='transparent';
  row.childNodes[1].style.backgroundColor='transparent';
  row.childNodes[2].style.backgroundColor='transparent';
  table.append(row);
  /* ttd */
  /* print button */
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('','','','',pbutton);
  row.style.backgroundColor='transparent';
  table.append(row);
  /* ttd */
  row=this.row('','','','Bendahara');
  row.style.backgroundColor='transparent';
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[3].style.textAlign='center';
  table.append(row);
  /* blank */
  row=this.row('','','','');
  row.style.backgroundColor='transparent';
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[3].style.height='120px';
  table.append(row);
  /* operator */
  row=this.row('','','','Rina Ferianti, A.Md., Ak.');
  row.style.backgroundColor='transparent';
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[3].style.textAlign='center';
  row.childNodes[3].style.borderTop='2px solid #333';
  table.append(row);
  /* */
};
this.studentSavingAdd=async function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSaving');
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('FORM TABUNGAN',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report'],
  hidden=['type','name','year','month','status'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='saving';
  trans.nominal=0;
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  
  /* button save */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=async ()=>{
    await this.tableStudent('studentSaving');
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableStudent('studentSaving');
      },1600);
    }
  };
};
this.studentSaving=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSaving');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="saving" order by transaction_date asc',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* finance - saving - TABUNGAN */
  title='TABUNGAN<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,6);
  table.append(row);
  let llcount=parseInt(finance.saving.length),
  showAll=document.createElement('input');
  showAll.type='submit';
  showAll.classList.add('button-add');
  showAll.value='Show All ('+llcount+')';
  showAll.onclick=function(){
    let hides=document.querySelectorAll('tr[data-type="hide"]'),
    len=hides.length;
    while(len--){
      hides[len].classList.remove('tr-hide');
    }
    this.remove();
  };
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo',llcount>30?showAll:'');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    detail=document.createElement('input'),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=line.id+'';
    detail.data=data;
    detail.onclick=function(){
      _PesantrianFinance.detailTransaction(
        this.dataset.id,
        ()=>{
          _PesantrianFinance.studentSaving(this.data);
        }
      );
    };
    row=this.row(
      date,
      nominal,
      dk,
      line.explanation,
      _Pesantrian.parseNominal(total),
      detail,
    );
    table.append(row);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
    if(finance.saving.length>30&&llcount>30){
      row.classList.add('tr-hide');
      row.dataset.type='hide';
    }
    llcount--;
  }
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','',pbutton);
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
};
this.studentSPPAdd=async function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSPP');
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('FORM SPP',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report','explanation'],
  hidden=['type','name','year','month'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='contribution';
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  /* rincian */
  let ddetail=document.createElement('div');
  ddetail.id='data-detail';
  this.app.body.append(ddetail);
  udata.rincian={
    "0":{
      nominal:2000000,
      keterangan:(new Date).getMonth()+12,
    }
  };
  table=this.dataDetailSPP(udata);
  ddetail.append(table);
  
  /* button save */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=async ()=>{
    await this.tableStudent('studentSPP');
  };
  btn.onclick=async ()=>{
    btn.disabled=true;
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    /* debug */
    if(false){
      alert(_Pesantrian.parser.likeJSON({
        user:user,
        ndata:ndata,
      },5));
      return;
    }
    /* queries */
    let queries=[],
    ntotal=0,
    nmonth=[],
    thisYear=(new Date).getFullYear(),
    lastYear=thisYear-1;
    nextYear=thisYear+1;
    for(let rk in ndata.data.rincian){
      let rin=ndata.data.rincian[rk],
      rmonth=parseInt(rin.keterangan),
      nuser=_Pesantrian.parseJSON(JSON.stringify(user));
      nuser.nominal=rin.nominal;
      nuser.month=rmonth<12?rmonth:rmonth>23?rmonth-24:rmonth-12;
      nuser.year=rmonth<12?lastYear:rmonth>23?nextYear:thisYear;
      nuser.data=JSON.stringify({
        rincian:{"0":{
          nominal:rin.nominal,
          keterangan:this.month[nuser.month]+' '+nuser.year,
        }}
      });
      nmonth.push(this.month[nuser.month]+' '+nuser.year);
      let innerQuery=_Pesantrian.buildQuery(nuser);
      queries.push(
        'insert into "transaction" '+innerQuery
      );
      ntotal+=parseInt(rin.nominal);
    }
    if(parseInt(ntotal)!==parseInt(user.nominal)){
      btn.disabled=false;
      _Pesantrian.alert('Error: Nominal tidak sesuai!','','error');
      return;
    }
    /* debug */
    if(false){
      alert(_Pesantrian.parser.likeJSON({
        user:user,
        ndata:ndata,
        queries:queries,
      },5));
      return;
    }
    /* */
    let loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    /* student type */
    if(!error&&user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+nmonth.join(', ');
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui. '+JSON.stringify(res);
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    /* notif */
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    /* debug */
    if(!error){
      btn.value='Selesai';
      setTimeout(async ()=>{
        await this.tableStudent('studentSPP');
      },1500);
    }else{
      btn.disabled=false;
    }
  };
};
this.studentSPP=async function(data,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSPP');
    })
  );
  let cyear=this.getStudyYear().split('/')[0];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and year='
      +year+' or year='+(year+1)+' order by month asc',
    'select * from scholarship where student_id='+data.id,
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  dclass=datas[2].length>0?parseInt(datas[2][0].class):12,
  maxPaid=datas[1].length>0?parseInt(datas[1][0].nominal):this.sppMax[dclass],
  total=0,
  lines,
  studyYear=[year,year+1],
  nominal,
  nominals={},
  rlines=[],
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
  /* tahun ajaran */
  let sta=document.createElement('select');
  for(let yr of _Pesantrian.range(2023,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr+'/'+(yr+1);
    if(yr==year){
      opt.selected='selected';
    }
    sta.append(opt);
  }
  sta.data=data;
  sta.onchange=function(){
    _PesantrianFinance.studentSPP(this.data,this.value);
  };
  sta.style.backgroundColor='#fff';
  /* finance - contribution - SPP */
  title='SPP<br />'+data.name
    +'<br />Tahun Ajaran '+studyYear.join('/'),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal','Status',sta);
  row.classList.add('tr-head');
  table.append(row);
  lines=this.parseSPP(finance.contribution,year);
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    status=nominal>=maxPaid?'Lunas':'-',
    syear=this.monthLast.indexOf(monthName)>=0?studyYear[0]:studyYear[1],
    tgl=this.getDateByMonth(monthName,lines);
    /* parse detail */
    let plines=_Pesantrian.getDataByKey('month',monthName,lines,true),
    col=document.createElement('div');
    for(let line of plines){
      let detail=document.createElement('input');
      detail.type='submit';
      detail.value='Detail';
      detail.classList.add('button-detail');
      detail.dataset.id=line.id+'';
      detail.data=data;
      detail.onclick=function(){
        _PesantrianFinance.detailTransaction(
          this.dataset.id,
          ()=>{
            _PesantrianFinance.studentSPP(this.data);
          }
        );
      };
      col.append(detail);
    }
    /* receipt selector */
    let rsel=document.createElement('input');
    rsel.type='submit';
    rsel.value='Receipt';
    rsel.classList.add('button-view');
    rsel.lines=plines;
    rsel.data=data;
    rsel.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    if(plines.length>0){
      col.append(rsel);
    }
    row=this.row(
      tgl,
      this.alias(monthName)+' '+syear,
      nominalRp,
      status,
      col,
    );
    table.append(row);
  }
  this.app.body.append(table);
  /* receipt */
    let receipt=document.createElement('input');
    receipt.type='submit';
    receipt.value='All Receipts';
    receipt.classList.add('button-view');
    receipt.data=data;
    receipt.lines=lines;
    receipt.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    row=this.row('','','',receipt);
    row.style.backgroundColor='transparent';
    row.childNodes[3].setAttribute('colspan',2);
    table.append(row);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.parseSPP=function(data=[],year){
  let cyear=this.getStudyYear().split('/')[0],
  res=[];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  for(let d of data){
    if((d.month<6&&d.year==year+1)
      ||(d.month>=6&&d.year==year)){
      res.push(d);
    }
  }
  return res;
};
this.queryTA=function(year,month){
  year=year&&parseInt(year)!==NaN?parseInt(year)
    :(new Date).getFullYear();
  month=month&&parseInt(month)!==NaN?parseInt(month)
    :(new Date).getMonth();
  let res=[
    'date > "'+year+'-07-01"',
    'date < "'+(year+1)+'-06-30"',
  ];
  if(month<6){
    res=[
      'date > "'+(year-1)+'-07-01"',
      'date < "'+year+'-06-30"',
    ];
  }
  return res.join(' and ');
};
this.dataDetailSPP=(udata)=>{
  let nomor=0,
  thisYear=(new Date).getFullYear(),
  lastYear=thisYear-1,
  nextYear=thisYear+1,
  thisMonth=(new Date).getMonth()+12,
  table=this.table(),
  row=this.rowHead('RINCIAN',3),
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('select'),
    ibtn=document.createElement('input');
    inama.type='number';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    nomor=parseInt(table.dataset.nomor);
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    inama.value='2000000';
    nomor++;
    table.dataset.nomor=''+nomor;
    for(let nmonth of _Pesantrian.range(0,35)){
      let opt=document.createElement('option'),
      dyear=nmonth<12?lastYear:nmonth>23?nextYear:thisYear,
      kmonth=dyear==thisYear?nmonth-12:dyear==nextYear?nmonth-24:nmonth;
      opt.value=nmonth;
      opt.textContent=this.month[kmonth]+' '+dyear;
      if(nmonth==thisMonth){
        opt.selected='selected';
      }
      iket.append(opt);
    }
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  table.append(row);
  row=this.row('Nominal','Bulan',tambah);
  table.append(row);
  table.totalNominal=0;
  for(let k in udata.rincian){
    let kel=udata.rincian[k],
    id='data-'+k,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('select');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='number';
    inama.value=kel.nominal;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    for(let nmonth of _Pesantrian.range(0,35)){
      let opt=document.createElement('option'),
      dyear=nmonth<12?lastYear:nmonth>23?nextYear:thisYear,
      kmonth=dyear==thisYear?nmonth-12:dyear==nextYear?nmonth-24:nmonth;
      opt.value=nmonth;
      opt.textContent=this.month[kmonth]+' '+dyear;
      if(nmonth==kel.keterangan){
        opt.selected='selected';
      }
      iket.append(opt);
    }
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    table.totalNominal+=parseInt(kel.nominal);
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    table.dataset.nomor=''+nomor;
  }
  return table;
};
this.tableStudent=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  queries=[
    'select id,name,graduated,item_code from student where graduated=0',
    innerApp=='studentSaving'
      ?'select * from transaction where type="student"'
        +' and name="saving"'
      :''
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  total=0,
  row=this.rowHead(this.alias(innerApp)
    +'<br />Tahun Ajaran '+this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  let add=document.createElement('input');
  add.type='submit';
  add.value='FORM '+this.alias(innerApp);
  add.classList.add('button-add');
  add.dataset.method=innerApp;
  add.dataset.data=JSON.stringify(students);
  add.onclick=function(){
    let data=_Pesantrian.parseJSON(this.dataset.data),
    method=this.dataset.method+'Add';
    if(!_PesantrianFinance.hasOwnProperty(method)){
      _Pesantrian.alert('Form tidak tersedia!','','error');
      return;
    }
    _PesantrianFinance[method].apply(_PesantrianFinance,[data]);
  };
  let saldo=innerApp=='studentSaving'?'Saldo':'',
  saving=[];
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=16){
    row=this.row('ID','Nama Santri',saldo,add);
  }else{
    row=this.row('ID','Nama Santri',saldo,'');
  }
  row.classList.add('tr-head');
  row.id='tr-head';
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let sfind=_Pesantrian.findInput('balance','number','Saldo...');
  row=this.row('',find,innerApp=='studentSaving'?sfind:'','');
  table.append(row);
  if(innerApp=='studentSaving'){
    saving=this.getFinanceByType(
      Array.isArray(data[1])?data[1]:[],
      'saving'
    );
  }
  for(let line of students){
    let stat=document.createElement('input');
    stat.type='submit';
    stat.value='Buka';
    stat.classList.add('button-take');
    stat.dataset.data=JSON.stringify(line);
    stat.dataset.method=innerApp;
    stat.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      if(!_PesantrianFinance.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianFinance[this.dataset.method].apply(_PesantrianFinance,[data]);
    };
    /* get saldo */
    let saldo=document.createElement('span'),
    sdata=_Pesantrian.getDataByKey(
      'profile_id',
      line.id,
      data[1]??[],
      true
    ),
    sbalance=this.getSavingBalance(sdata),
    ssbalance=_Pesantrian.parseNominal(sbalance);
    saldo.innerText=ssbalance;
    total+=sbalance;
    /* row */
    row=this.row(
      line.id,
      line.name,
      innerApp=='studentSaving'?saldo:'',
      stat
    );
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    row.dataset.balance=ssbalance;
    row.childNodes[2].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  if(innerApp=='studentSaving'){
    row=this.row('','Total',_Pesantrian.parseNominal(total),'');
    row.childNodes[2].classList.add('td-right');
    row.classList.add('tr-head');
    table.append(row);
  }
};

/* table data / raw data */
this.tableDataTransaction=async function(data=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableTransaction();
    })
  );
  let table=_Pesantrian.tableData(data,'transaction');
  this.app.body.append(table);
};


/* big book */
this.tableTransaction=async (config)=>{
  config=typeof config==='object'&&config!==null?config:{};
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  /* default config */
  if(!config.hasOwnProperty('studyYear')){
    config.studyYear=this.getStudyYear();
  }
  if(!config.hasOwnProperty('name')){
    config.name='contribution';
  }
  if(!config.hasOwnProperty('year')){
    config.year=(new Date).getFullYear();
  }
  if(!config.hasOwnProperty('month')){
    config.month=(new Date).getMonth();
  }
  /* start to fetch data */
  let loader=_Pesantrian.loader(),
  tquery=this.queryTransaction(config),
  queries=[
    'select id,name from student',
    'select id,name from parent',
    'select id,name from employee',
    tquery,
  ].join(';'),
  pre=document.createElement('pre'),
  table=this.table(),
  row=this.rowHead('CONFIGURATION',2),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
  },
  add=document.createElement('input'),
  selector=this.selector(config,dtype),
  configNames=['studyYear','name','type','profile_id','method','status','year','month','transaction_code'],
  totalize={
    outcome:0,
    income:0,
  },
  trans=data[3],
  gspan;
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(queries,3));
  }
  table.append(row);
  this.app.body.append(table);
  for(let cn of configNames){
    row=this.row(this.alias(cn),selector[cn]);
    table.append(row);
  }
  
  let title='BUKU BESAR<br /> ('
    +(trans.length>0?trans.length+' baris':'kosong')
    +')';
  for(let cn of configNames){
    if(config.hasOwnProperty(cn)&&config[cn]!=''){
      let dval=this.alias(config[cn]);
      if(cn=='profile_id'){
        dval=this.getName(config[cn],dtype[config.type]);
      }else if(cn=='method'){
        dval=['Keluar','Masuk'][config[cn]];
      }
      title+='<br />'+this.alias(cn)+' '+dval;
    }
  }
  table=this.table();
  row=this.rowHead(title,6),
  table.append(row);
  add.classList.add('button-add');
  add.type='submit';
  add.value='Tambah';
  add.onclick=()=>{
    this.addTransaction();
  };
  row=this.row(
    'ID',
    this.alias('transaction_date'),
    this.alias('profile_id'),
    this.alias('credit'),
    this.alias('debt'),
    add
  );
  row.classList.add('tr-head');
  table.append(row);
  
  /* data table transaction */
  let full=document.createElement('input');
  full.type='submit';
  full.value='FULL';
  full.classList.add('button-taken');
  full.onclick=()=>{
    this.tableDataTransaction(trans);
  };
  /* find */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('','',find,'','',full);
  table.append(row);
  
  /* data transactions */
  for(let tran of trans.reverse()){
        gspan=document.createElement('span');
        gspan.innerText=['Keluar','Masuk'][tran.method];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+tran.method);
    /* tag id */
    let tid='<div class="tag-pack tag-pack-'
      +(tran.method=='1'?'1':'0')+'">'+tran.id+'</div> ';
    /**
    row=this.row(
      tran.id,
      this.alias(tran.name),
      this.alias(tran.type),
      this.getName(tran.profile_id,dtype[tran.type]),
      this.parseNominal(tran.nominal),
      gspan,
      this.alias(tran.status),
      this.alias(tran.year),
      this.alias(tran.month),
      this.parseDate(tran.transaction_date),
      tran.transaction_code,
      see
    );
    */
    let see=document.createElement('input'),
    tdate=this.parseDate(tran.transaction_date),
    tnominal=this.parseNominal(tran.nominal);
    see.type='submit';
    see.value='Detail';
    see.classList.add('button-detail');
    see.dataset.id=tran.id;
    see.onclick=function(){
      _PesantrianFinance.detailTransaction(this.dataset.id);
    };
    let pname=this.getName(tran.profile_id,dtype[tran.type]);
    if(tran.method==1){
      totalize.income+=parseInt(tran.nominal);
      row=this.row(tid,tdate,pname,tnominal,'',see);
    }else{
      totalize.outcome+=parseInt(tran.nominal);
      row=this.row(tid,tdate,pname,'',tnominal,see);
    }
    row.dataset.name=pname;
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  /* total */
  row=this.row('','','TOTAL',
    this.parseNominal(totalize.income),
    this.parseNominal(totalize.outcome),
    this.parseNominal(totalize.income-totalize.outcome),
  );
  row.classList.add('tr-head');
  table.append(row);
  /* total */
  let codes=['qrbill_shop','qrbill_laundry'];
  if(config.hasOwnProperty('transaction_code')
    &&codes.indexOf(config.transaction_code)>=0){
    let give=document.createElement('input');
    give.type='button';
    give.value='Serahkan';
    give.classList.add('button-taken');
    give.dataset.code=config.transaction_code;
    give.onclick=async function(){
      let yes=await _Pesantrian.confirmX(
        'Serahkan dana?',
        'Kode: '+this.dataset.code);
      if(!yes){return;}
      let query='update transaction (transaction_code='
        +this.dataset.code+'_paid) where transaction_code="'
        +this.dataset.code+'"',
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      _PesantrianFinance.tableTransaction({
        transaction_code:this.dataset.code,
      });
    };
    row=this.row('','','','','',give);
    table.append(row);
  }
  /* rincian *
  table=this.table();
  row=this.rowHead('TOTAL',3);
  table.append(row);
  row=this.row('Arus Dana','Nominal','Keterangan');
  row.classList.add('tr-head');
  table.append(row);
        gspan=document.createElement('span');
        gspan.innerText='Masuk';
        gspan.classList.add('gender');
        gspan.classList.add('gender-1');
  row=this.row(gspan,this.parseNominal(totalize.income),'Total Dana Masuk');
  table.append(row);
        gspan=document.createElement('span');
        gspan.innerText='Keluar';
        gspan.classList.add('gender');
        gspan.classList.add('gender-0');
  row=this.row(gspan,this.parseNominal(totalize.outcome),'Total Dana Keluar');
  table.append(row);
  row=this.row('',this.parseNominal(totalize.income-totalize.outcome),'Grand Total');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  */
  
};
this.editTransaction=async (trans,dtype)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.detailTransaction(trans.id);
    })
  );
  let udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  row=this.rowHead('EDIT TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','time','id','uid'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      img=new Image,
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      img.src=this.evidencePath(value);
      img.onload=()=>{
        tfv.innerHTML='';
        tfv.append(img);
      };
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      if(key=='date'){
        ti.disabled=true;
      }
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);

  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=_Pesantrian.user.id;
  ti.name='uid';
  this.app.body.append(ti);
  
  /* rincian */
  table=this.table();
  row=this.rowHead('RINCIAN',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='number';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  row=this.row('Nominal','Keterangan',tambah);
  table.append(row);
  for(let k in udata.rincian){
    let kel=udata.rincian[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='number';
    iket.type='text';
    inama.value=kel.nominal;
    iket.value=kel.keterangan;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.detailTransaction(trans.id);
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user);
    query='update transaction ('+innerQuery+') where id='
      +trans.id;
    let loader=_Pesantrian.loader();
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        if(trans.name=='saving'){
          this.tableStudent('studentSaving');
        }else if(trans.name=='contribution'){
          this.tableStudent('studentSPP');
        }else{
          await this.tableTransaction();
        }
      },1600);
    }
  };
};
this.detailTransaction=async (id,backCB)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      if(typeof backCB==='function'){
        return backCB();
      }else{
        await this.tableTransaction();
      }
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name from student',
    'select id,name from parent',
    'select id,name from employee',
    'select * from transaction where id='+id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
  },
  trans=data[3][0],
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  row=this.rowHead('DETAIL TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','time','uid'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(selection.hasOwnProperty(key)){
      val=this.alias(value);
    }else if(key=='profile_id'){
      val=this.getName(value,dtype[trans.type]);
    }else if(key=='method'){
      let gspan=document.createElement('span');
      gspan.innerText=methods[value];
      gspan.classList.add('gender');
      gspan.classList.add('gender-'+value);
      val=gspan;
    }else if(key=='transaction_date'||key=='date'){
      val=this.parseDate(value);
    }else if(integers.indexOf(key)>=0){
      val=value;
      if(key=='nominal'){
        val=this.parseNominal(value);
      }
    }else if(key=='evidence'){
      val=new Image;
      val.src=_Pesantrian.eva.config.host
        +'pesantrian/finance/evidence/'+value;
      val.onerror=function(e){
        this.src=_Pesantrian.IMAGES['icon-error.png'];
      };
    }else{
      val=value;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* rincian */
  table=this.table();
  row=this.rowHead('RINCIAN',3);
  table.append(row);
  let nomor=0;
  row=this.row('NO','Nominal','Keterangan');
  table.append(row);
  for(let k in udata.rincian){
    let kel=udata.rincian[k];
    row=this.row(nomor,this.parseNominal(kel.nominal),kel.keterangan);
    nomor++;
    table.append(row);
  }
  this.app.body.append(table);
  /* */
  
  /* */
  let div=document.createElement('div'),
  edit=document.createElement('input'),
  back=document.createElement('input'),
  del=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  del.type='submit';
  del.value='Delete';
  back.type='submit';
  back.value='Back';
  del.dataset.id=trans.id;
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=0x10){
    div.append(edit);
    div.append(del);
  }
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
      if(typeof backCB==='function'){
        return backCB();
      }else{
        this.tableTransaction();
      }
  };
  edit.onclick=()=>{
    this.editTransaction(trans,dtype);
  };
  del.onclick=()=>{
    _Pesantrian.confirm(
      'Delete data transaksi?',
      this.alias(trans.name)+' nomor '+trans.id,
      async (yes)=>{
      if(yes){
        let loader=_Pesantrian.loader(),
        query='delete from transaction where id='+trans.id,
        res=await _Pesantrian.request('query',query);
        loader.remove();
        this.tableTransaction();
      }
    });
  };
};
this.addTransaction=async (out)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      if(out){
        await this.init();
      }else{
        await this.tableTransaction();
      }
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('INPUT TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||key=='data'||key=='uid'){
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  /* rincian */
  let ddetail=document.createElement('div');
  ddetail.id='data-detail';
  this.app.body.append(ddetail);
  table=this.dataDetail(udata);
  ddetail.append(table);
  
  /* button save */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableTransaction();
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableTransaction();
      },1600);
    }
  };
};
this.dataDetail=(udata)=>{
  let nomor=0,
  table=this.table(),
  row=this.rowHead('RINCIAN',3),
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='number';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  table.append(row);
  row=this.row('Nominal','Keterangan',tambah);
  table.append(row);
  table.totalNominal=0;
  for(let k in udata.rincian){
    let kel=udata.rincian[k],
    id='data-'+k,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='number';
    iket.type='text';
    inama.value=kel.nominal;
    iket.value=kel.keterangan;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    table.totalNominal+=parseInt(kel.nominal);
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  return table;
};
this.templateTransaction=()=>{
  return {
    name:'donation',
    type:'student',
    profile_id:0,
    method:1,
    nominal:2000000,
    transaction_date:(new Date).getFullYear()+'-'
      +((new Date).getMonth()+1).toString().padStart(2,'0')+'-'
      +(new Date).getDate().toString().padStart(2,'0'),
    transaction_code:'',
    account:'Yayasan - BSI 7164 540 558',
    status:'paid',
    report:'',
    evidence:'',
    explanation:'',
    uid:_Pesantrian.user.id,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    data:{
      rincian:{}
    }
  };
};
this.test=()=>{
  
};

/* ---------- inner ---------- */
this.tagDK=function(done){
  let tag=document.createElement('span');
  tag.innerText=done?'K':'D';
  tag.classList.add('gender');
  tag.classList.add(done?'gender-1':'gender-0');
  return tag;
};
this.getNominalByMonth=function(month,data){
  data=Array.isArray(data)?data:[];
  let res=0;
  for(let line of data){
    if(month==line.month){
      res+=parseInt(line.nominal);
    }
  }
  return res;
};
this.getDateByMonth=function(month,data){
  data=Array.isArray(data)?data:[];
  let res='';
  for(let line of data){
    if(month==line.month){
      res=_Pesantrian.parseDate(line.transaction_date);
    }
  }
  return res;
};
this.getStudyMonths=function(){
  return [6,7,8,9,10,11,0,1,2,3,4,5];
};
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.getFinanceByType=function(data,ftype){
  data=Array.isArray(data)?data:[];
  let res={
    contribution:[],
    saving:[],
    donation:[],
    petty_cash:[],
    initial_fund:[],
    tahfidz_camp:[],
    school_event:[],
    register_annually:[],
    register_smp:[],
    register_sma_next:[],
    register_sma_new:[],
    register_test_sma:[],
    register_test_smp:[],
  },
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  oyear=month<6?[year-1,year]:[year,year+1];
  for(let line of data){
    if(!res.hasOwnProperty(line.name)){
      res[line.name]=[];
    }
    res[line.name].push(line);
    
    if((line.month<6&&line.year==oyear[1])
      ||(line.month>5&&line.year==oyear[0])){
      
    }
  }
  return ftype&&res.hasOwnProperty(ftype)?res[ftype]:res;
};
this.getStudentData=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
};
this.getParentsUID=function(data,father_id,mother_id){
  data=Array.isArray(data)?data:[];
  let res=[];
  for(let line of data){
    if(line.profile_id==father_id
      ||line.profile_id==mother_id){
      res.push(line.id);
    }
  }return res;
};
this.evidencePath=function(fname){
  return _Pesantrian.eva.config.host
    +'pesantrian/finance/evidence/'+fname;
};
this.queryTransaction=function(config){
  config=typeof config==='object'&&config!==null?config:{};
  let names=[
    'register',
    'contribution',
    'donation',
    'petty_cash',
  ],
  types=[
    'student',
    'parent',
    'employee',
  ],
  statuses=[
    'unpaid',
    'partly_paid',
    'paid',
    'cash',
    'loan',
  ],
  keys={
    name:'', 
    type:'',
    profile_id:0,
    method:0,
    nominal:0,
    
    transaction_date:'',
    transaction_code:'',
    account:'',
    status:'',
  },
  limit=25,
  page=1,
  order_by='time',
  sorted='asc',
  query='select * from transaction',
  where=[];
  if(config.hasOwnProperty('studyYear')
    &&config.studyYear.toString().match(/^\d{4}\/\d{4}$/)
    &&config.studyYear!=''){
    let studyYear=config.studyYear.split('/'),
    yearMin=studyYear[0]+'-06-30',
    yearMax=studyYear[1]+'-07-01';
    where.push('date > "'+yearMin+'"');
    where.push('date < "'+yearMax+'"');
  }
  if(config.hasOwnProperty('name')&&config.name!=''){
    where.push('name="'+config.name+'"');
  }
  if(config.hasOwnProperty('type')&&config.type!=''){
    where.push('type="'+config.type+'"');
    if(config.hasOwnProperty('profile_id')
      &&config.profile_id.toString().match(/^\d+$/)
      &&config.profile_id!=''){
      where.push('profile_id='+config.profile_id);
    }
  }
  if(config.hasOwnProperty('status')&&config.status!=''){
    where.push('status="'+config.status+'"');
  }
  if(config.hasOwnProperty('method')
    &&config.method.toString().match(/^\d$/)
    &&config.method!=''){
    where.push('method='+config.method);
  }
  if(config.hasOwnProperty('nominal')
    &&config.nominal.toString().match(/^\d+$/)
    &&config.nominal!=''){
    where.push('nominal='+config.nominal);
  }
  if(config.hasOwnProperty('transaction_code')
    &&config.transaction_code!=''){
    where.push('transaction_code="'+config.transaction_code+'"');
  }
  if(config.hasOwnProperty('year')
    &&config.year.toString().match(/^\d{4}$/)
    &&config.year!=''){
    where.push('year='+config.year);
  }
  if(config.hasOwnProperty('month')
    &&config.month.toString().match(/^\d{1,2}$/)
    &&config.month!=''){
    where.push('month='+config.month);
  }
  if(where.length>0){
    query+=' where '+where.join(' and ');
  }
  if(config.hasOwnProperty('order_by')
    &&config.order_by!=''){
    order_by=config.order_by;
    if(config.hasOwnProperty('sorted')
      &&config.sorted!=''){
      sorted=config.sorted;
    }
    query+=' order by '+order_by+' '+sorted;
  }
  if(config.hasOwnProperty('limit')
    &&config.limit.toString().match(/^\d+$/)
    &&config.limit!=''){
    limit=parseInt(config.limit);
    if(config.hasOwnProperty('page')
      &&config.page.toString().match(/^\d+$/)
      &&config.page!=''){
      page=parseInt(config.page);
    }
    let start=(page-1)*limit;
    query+=' limit '+start+','+limit;
  }
  return query;
};
this.selector=function(config,dtype){
  config=typeof config==='object'&&config!==null?config:{};
  let name=document.createElement('select'),
  type=document.createElement('select'),
  profile_id=document.createElement('select'),
  method=document.createElement('select'),
  status=document.createElement('select'),
  month=document.createElement('select'),
  year=document.createElement('select'),
  studyYear=document.createElement('select'),
  nominal=document.createElement('input'),
  tcode=document.createElement('input'),
  methods=['Keluar','Masuk'],
  nameAll=document.createElement('option'),
  typeAll=document.createElement('option'),
  statusAll=document.createElement('option'),
  monthAll=document.createElement('option'),
  yearAll=document.createElement('option'),
  methodAll=document.createElement('option'),
  pidAll=document.createElement('option'),
  val=null;
  /* name */
  nameAll.value='';
  nameAll.textContent='Semua';
  name.append(nameAll);
  name.id='transkey-name';
  for(let tos of this.selection.name){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('name')&&config.name==tos){
      val.selected='selected';
    }
    name.append(val);
  }
  /* type */
  typeAll.value='';
  typeAll.textContent='Semua';
  type.append(typeAll);
  type.id='transkey-type';
  for(let tos of this.selection.type){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('type')&&config.type==tos){
      val.selected='selected';
    }
    type.append(val);
  }
  /* status */
  statusAll.value='';
  statusAll.textContent='Semua';
  status.append(statusAll);
  status.id='transkey-status';
  for(let tos of this.selection.status){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('status')&&config.status==tos){
      val.selected='selected';
    }
    status.append(val);
  }
  /* month */
  monthAll.value='';
  monthAll.textContent='Semua';
  month.append(monthAll);
  month.id='transkey-month';
  for(let tos of _Pesantrian.range(0,11)){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('month')&&tos===parseInt(config.month)){
      val.selected='selected';
    }
    month.append(val);
  }
  /* year */
  yearAll.value='',
  yearAll.textContent='Semua';
  year.append(yearAll);
  year.id='transkey-year';
  for(let tos of this.selection.year){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('year')&&tos==config.year){
      val.selected='selected';
    }
    year.append(val);
  }
  /* studyYear */
  studyYear.id='transkey-studyYear';
  let thisStudyYear=config.hasOwnProperty('studyYear')
    ?config.studyYear:this.getStudyYear();
  for(let tos of this.selection.studyYear){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(tos==thisStudyYear){
      val.selected='selected';
    }
    studyYear.append(val);
  }
  /* method */
  methodAll.value='';
  methodAll.textContent='Semua';
  method.append(methodAll);
  method.id='transkey-method';
  for(let tos in methods){
    val=document.createElement('option');
    val.value=tos+'';
    val.textContent=methods[tos];
    if(config.hasOwnProperty('method')&&config.method==tos){
      val.selected='selected';
    }
    method.append(val);
  }
  /* profile_id */
  pidAll.value='';
  pidAll.textContent='Semua';
  profile_id.append(pidAll);
  profile_id.id='transkey-profile_id';
  let users=config.hasOwnProperty('type')
    &&dtype.hasOwnProperty(config.type)
    ?dtype[config.type]:[];
  if(users.length>0){
    profile_id=_Pesantrian.findSelect({
      id:'transkey-profile_id',
      key:'profile_id',
      value:0,
      data:users,
      placeholder:this.alias(config.type?config.type:'student')+'...',
      callback:function(r){
        let res=document.getElementById('finder-result-profile_id');
        if(res){
          res.value=r.id;
        }
        _PesantrianFinance.transkeyExec();
      },
    });
  }
  /* transaction_code */
  tcode.type='text';
  tcode.id='transkey-transaction_code';
  tcode.placeholder=this.alias('transaction_code');
  if(config.hasOwnProperty('transaction_code')){
    tcode.value=config.transaction_code;
  }
  
  name.onchange=()=>{
    this.transkeyExec();
  };
  type.onchange=()=>{
    this.transkeyExec();
  };
  status.onchange=()=>{
    this.transkeyExec();
  };
  month.onchange=()=>{
    this.transkeyExec();
  };
  year.onchange=()=>{
    this.transkeyExec();
  };
  method.onchange=()=>{
    this.transkeyExec();
  };
  tcode.onkeyup=function(e){
    if(e.keyCode!=13){
      return;
    }
    _PesantrianFinance.transkeyExec();
  };
  studyYear.onchange=()=>{
    this.transkeyExec();
  };
  
  return {name,type,status,method,profile_id,transaction_code:tcode,month,year,studyYear};
};
this.transkeyExec=function(){
  let name=document.getElementById('transkey-name'),
  type=document.getElementById('transkey-type'),
  status=document.getElementById('transkey-status'),
  method=document.getElementById('transkey-method'),
  profile_id_old=document.getElementById('transkey-profile_id'),
  profile_id=document.getElementById('finder-result-profile_id'),
  tcode=document.getElementById('transkey-transaction_code'),
  month=document.getElementById('transkey-month'),
  year=document.getElementById('transkey-year'),
  studyYear=document.getElementById('transkey-studyYear'),
  config={
    name:name.value,
    type:type.value,
    status:status.value,
    method:method.value,
    profile_id:profile_id?profile_id.value:profile_id_old.value,
    transaction_code:tcode.value,
    month:month.value,
    year:year.value,
    studyYear:studyYear.value,
  };
  return this.tableTransaction(config);
};

/* ---------- inner o ---------- */
this.getCredit=function(profile_id,data=[],type='student'){
  let res=type=='employee'?100*1000:0;
  for(let i of data){
    if(i.profile_id==profile_id&&i.type==type){
      res-=parseInt(i.nominal);
    }
  }return res;
};
this.parseDate=function(value){
  let date=new Date(value),
  options={
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
  };
  return date.toLocaleDateString('id-ID',options);
};
this.parseNominal=function(nominal){
  let rupiah=new Intl.NumberFormat('id-ID',{
    style:'currency',
    currency:'IDR',
    maximumFractionDigits:0,
  });
  return rupiah.format(nominal);
};
this.getName=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i.name;
      break;
    }
  }return res;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.table=function(){
  let table=document.createElement('table'),
  tbody=document.createElement('tbody');
  table.classList.add('app-table');
  table.setAttribute('cellpadding','0px');
  table.setAttribute('cellspacing','0px');
  return table;
};
this.rowHead=function(text='',length=2){
  let tr=document.createElement('tr'),
  td=document.createElement('td');
  td.setAttribute('colspan',''+length+'');
  td.innerHTML=text;
  tr.append(td);
  tr.classList.add('trhead');
  return tr;
};
this.row=function(){
  let tr=document.createElement('tr');
  for(let tk in arguments){
    let td=document.createElement('td');
    if(typeof arguments[tk]==='object'){
      td.append(arguments[tk]);
    }else{
      td.innerHTML=''+arguments[tk]+'';
      if(arguments[tk].toString().match(/^\d+$/)){
        td.classList.add('td-left');
      }
    }
    tr.append(td);
  }return tr;
};
this.parseJSON=function(data){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }return res;
};
return this.init();
};



/* PesantrianIt */
;function PesantrianIt(app){
this.app=app;
this.aliasData={
  id:'Nomor ID',
  name:'Nama Lengkap',
  gender:'Jenis Kelamin',
  birthdate:'Tanggal Lahir',
  birthplace:'Tempat Lahir',
  nik:'Nomor KTP',
  address:'Alamat Lengkap',
  phone:'Nomor HP',
  email:'Email',
  religion:'Agama',
  position:'Jabatan/Divisi',
  employee_status:'Status Karyawan',
  marritial_status:'Status Perkawinan',
  children:'Jumlah Anak',
  siblings:'Jumlah Saudara',
  spouse_name:'Nama Pasangan',
  father_name:'Nama Ayah',
  mother_name:'Nama Ibu',
  nationality:'Kewarganegaraan',
  time:'Tanggal Terdaftar',
  start_date:'Tanggal Mulai Bekerja',
  weight:'Berat Badan',
  height:'Tinggi Badan',
  job:'Pekerjaan',
  education:'Pendidikan Terakhir',
  nis:'NIS',
  nisn:'NISN',
  father_id:'Ayah Kandung',
  mother_id:'Ibu Kandung',
  child_order:'Anak ke',
  item_code:'Kode Barang',
  family_status:'Status Keluarga',
  school_name:'Sekolah Asal',
  accepted_at:'Diterima disekolah ini pada tanggal',
  salary:'Penghasilan Bulanan',
  parent_of:'Orangtua dari',
  blood_group:'Golongan Darah',
  live_in:'Tinggal di Asrama',
  plate:'Nomor Kendaraan',
  illness:'Penyakit Jasmani',
  active:'Status Aktif',
  type:'Jenis Akun',
  employee:'Karyawan',
  student:'Santri',
  parent:'Orangtua',
  profile_id:'ID Profile',
  privilege:'Level Keamanan',
  scope:'Cakupan Akses',
  condition:'Kondisi',
  quantity:'Quantity',
  status:'Status',
  date:'Tanggal',
  hour:'Jam',
  purpose:'Tujuan',
  unit:'Unit',
  software:'Software',
  evidence:'Bukti',
  note:'Catatan',
};
this.setups={
  theme:function(arg){
    _PesantrianIt.theme(arg);
  },
  exec:function(arg){
    eval(arg);
  },
  app:function(arg){
    let parsed=_Pesantrian.parser.parseQuery(arg);
    setTimeout(async ()=>{
      await _Pesantrian.load('app.html',parsed);
    },100);
  },
  send:function(arg){
    let to=_PesantrianIt.to;
    _Pesantrian.sendNotification(to,arg);
  },
  to:function(arg){
    _PesantrianIt.to=arg;
  },
  login:function(arg){
    _PesantrianIt.loginAs(arg);
  },
};
this.users={};


this.init=async function(){
  /* menu */
  this.app.menuWapper.innerHTML='';
  /* */
  
  
  /* inside apps */
  let apps=[
    {
      name:'inventory',
      title:'Inventory',
      callback:function(e){
        _PesantrianIt.tableInventory();
      }
    },
    {
      name:'transcript',
      title:'Lab',
      callback:function(e){
        _PesantrianIt.labCom();
      }
    },
  ];
  if(_Pesantrian.user.privilege>=16
    ||_Pesantrian.user.profile.position=='it'){
    apps.push({
      name:'group',
      title:'Users',
      callback:function(e){
        _PesantrianIt.tableUser();
      }
    });
    apps.push({
      name:'setup',
      title:'Setup',
      callback:function(e){
        _PesantrianIt.setup();
      }
    });
    apps.push({
      name:'form6',
      title:'Trace',
      callback:function(e){
        _PesantrianIt.trace();
      }
    });
    apps.push(
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianIt.scanner();
      }
    },);
    apps.push(
    {
      name:'qrcode',
      title:'MyCard',
      callback:function(e){
        _PesantrianIt.myCard();
      }
    },
    );
  }
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianIt=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};


/* evidence page -- table it_lab */
this.evidencePage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  query='select id,evidence from it_lab where id='+id,
  data=await _Pesantrian.request('query',query,50),
  text='Error: Data #'+id+' tidak ditemukan!';
  if(data.length==0){
    _Pesantrian.alert(text,'','error');
    dialog.close();
    return;
  }
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
  }
  let evi=this.evidencePath(data[0].evidence),
  pro=document.createElement('div'),
  pimg=new Image;
  pimg.src=evi!=''?evi:_Pesantrian.IMAGES['icon-error.png'];
  pimg.main=pro;
  pimg.dialog=dialog;
  pimg.style.maxWidth='100%';
  pro.append(pimg);
  pimg.onload=function(){
    this.dialog.blank();
    this.dialog.main.append(this.main);
  };
  pimg.onerror=function(){
    this.dialog.loader.src=_Pesantrian.IMAGES['icon-error.png'];
  };
};
this.evidencePath=function(fname){
  return _Pesantrian.eva.config.host
    +'pesantrian/finance/evidence/'+fname;
};



/* ---------- lab ---------- */
this.labComView=async function(id=0){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.labCom();
    })
  );
  let loader=_Pesantrian.loader(),
  today=[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
  query='select * from it_lab where id='+id,
  data=await _Pesantrian.request('query',query);
  loader.remove();
  if(data.length<1){
    return _Pesantrian.alertX('Error','Data is not found!','error');
  }
  /* start form */
  let row=this.rowHead('CLIENT DATA',2),
  passes=['id','time'],
  table=this.table();
  this.app.body.append(table);
  table.append(row);
  row=this.row('');
  for(let key in data[0]){
    let value=data[0][key],
    val=value;
    if(key=='time'){
      val=_Pesantrian.parseDatetime(parseInt(value)*1000);
    }else if(key=='evidence'){
      if(true){
        continue;
      }
      val=document.createElement('div'),
      imgL=new Image,
      img=new Image;
      imgL.src=_Pesantrian.IMAGES['loader.gif'];
      val.append(imgL);
      img.src=this.evidencePath(value);
      img.onload=()=>{
        imgL.remove();
        val.append(img);
      };
      img.onerror=()=>{
        imgL.src=_Pesantrian.IMAGES['icon-error.png'];
      };
    }else if(key=='status'){
      let labstats=[
        'Denied',
        'Confirmed',
        'Progress',
        'Done',
        'Draft',
      ];
      val=document.createElement('span');
      val.classList.add('lab-status');
      val.classList.add('lab-status-'+(value>7?7:value));
      val.innerText=labstats[value];
      val.dataset.id=data[0].id;
      val.onclick=function(){
        _PesantrianIt.evidencePage(this.dataset.id);
      };
    }else if(key=='date'){
      val=value==today?'Today':value;
    }else if(key=='type'){
      val=this.alias(value);
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  /* save button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Edit';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=()=>{
    this.labComEdit(id);
  };
};
this.labComEdit=async function(id=0){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.labCom();
    })
  );
  /* default */
  let def={
    id:0,
    status:4,
    type:'student',
    profile_id:0,
    name:'',
    date:[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
    hour:[
      (new Date).getHours().toString().padStart(2,'0'),
      (new Date).getMinutes().toString().padStart(2,'0'),
    ].join(':'),
    purpose:'',
    unit:1,
    software:'',
    evidence:'',
    note:'',
  },
  lines=def;
  /* data */
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name,graduated from student where graduated=0',
    'select id,name from employee',
    'select * from it_lab where id='+id,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  names={
    student:data[0],
    employee:data[1],
  };
  loader.remove();
  if(id!=0){
    if(data[2].length<1){
      return _Pesantrian.alertX('Error','Data is not found!','error');
    }
    lines=data[2][0];
  }
  /* start form */
  let row=this.rowHead('CLIENT '+(id==0?'INPUT':'EDIT'),2),
  passes=['id','time'],
  table=this.table();
  this.app.body.append(table);
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type='text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    val.value=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='profile_id'){
      val.type='hidden';
      val.name='name';
      val.id='profile_name';
      val.value=lines.name;
      this.app.body.append(val);
      continue;
    }else if(key=='name'){
      val=_Pesantrian.findSelect({
        id:'profile_id',
        data:names.student,
        key:'profile_id',
        value:lines.profile_id,
        placeholder:'Name of student...',
        callback:function(r){
          let pname=document.getElementById('profile_name');
          if(!pname){return;}
          pname.value=r.name;
        },
      });
    }else if(key=='type'){
      val=document.createElement('select');
      val.name=key;
      for(let sel of ['student','employee']){
        let opt=document.createElement('option');
        opt.value=sel;
        opt.textContent=this.alias(sel);
        if(value==sel){
          opt.selected='selected';
        }
        val.append(opt);
      }
      val.onchange=function(){
        let pid=document.getElementById('profile_id');
        if(!pid){return;}
        let pnode=pid.parentNode,
        nval=_Pesantrian.findSelect({
          id:'profile_id',
          data:names[this.value],
          key:'profile_id',
          value:lines.profile_id,
          placeholder:'Name of '+this.value+'...',
          callback:function(r){
            let pname=document.getElementById('profile_name');
            if(!pname){return;}
            pname.value=r.name;
          },
        });
        pnode.innerHTML='';
        pnode.append(nval);
      };
    }else if(key=='unit'){
      val.type='number';
    }else if(key=='status'){
      val=_Pesantrian.radioGlobal(value,key,[
        'Denied',
        'Confirmed',
        'Progress',
        'Done',
        'Draft',
      ]);
    }else if(key=='hour'){
      val.type='time';
    }else if(key=='date'){
      val.type='date';
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }
    
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  /* save button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Save';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query=id==0
      ?'insert into "it_lab" '+innerQuery
      :'update "it_lab" ('+innerQuery+') where id='+id,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.labCom();
      },1600);
    }
  };
  
  /* delete button */
  if(id!=0){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Delete';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+lines.id;
    del.dataset.name=''+lines.name;
    del.onclick=function(){
      _Pesantrian.confirm('Delete Client?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Deleting...';
        this.disabled=true;
        let query='delete from it_lab where id='+this.dataset.id,
        res=await _Pesantrian.request('query',query);
        _PesantrianIt.labCom();
      });
    };
    div.append(del);
  }
};
this.labCom=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  /* query data */
  let loader=_Pesantrian.loader(),
  today=[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
  queries=[
    'select * from it_lab order by date desc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0].sort((a,b)=>{
    let bdate=b.date.replace(/[^\d]+/g,''),
    bhour=b.hour.replace(/[^\d]+/g,''),
    adate=a.date.replace(/[^\d]+/g,''),
    ahour=a.hour.replace(/[^\d]+/g,'');
    return parseInt(bdate+''+bhour)-parseInt(adate+''+ahour);
  }),
  add=document.createElement('input'),
  row=this.rowHead('IT LAB REGISTER',5),
  table=this.table();
  this.app.body.append(table);
  loader.remove();
  table.append(row);
  row=this.row('ID','Client','Date','Hour',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Add';
  add.classList.add('button-add');
  add.onclick=async ()=>{
    await this.labComEdit();
  };
  /* find name */
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Search...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  /* find date */
  let findd=document.createElement('input');
  findd.classList.add('kitchen-find');
  findd.type='text';
  findd.placeholder='Search...';
  findd.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-date]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.date.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  
  row=this.row('',find,findd,'','');
  table.append(row);
  /* client each */
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='View';
    del.classList.add('button-view');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.onclick=function(){
      _PesantrianIt.labComView(this.dataset.id);
    };
    let sid=document.createElement('span');
    sid.innerText=item.id;
    sid.dataset.id=item.id;
    sid.classList.add('lab-status');
    sid.classList.add('lab-status-'+(item.status>7?7:item.status));
    sid.onclick=function(){
      _PesantrianIt.evidencePage(this.dataset.id);
    };
    row=this.row(
      sid,
      item.name,
      item.date==today?'Today':item.date,
      item.hour,
      del
    );
    row.childNodes[2].style.whiteSpace='nowrap';
    row.dataset.name=item.name;
    row.dataset.date=item.date==today?'Today':item.date;
    table.append(row);
  }
};

/* ---------- scanner & card ---------- */
/* scanner page */
this.scanner=async function(){
  let qdata=await _Pesantrian.scannerPageX();
  alert(_Pesantrian.parser.likeJSON(qdata,3));
};
/* my qrcode */
this.myCard=async function(){
  let dialog=await _Pesantrian.dialogPage(),
  myeq=this.myECard(),
  id=_Pesantrian.user.id,
  qrdiv=document.createElement('div');
  qrdiv.classList.add('qrcode-outer');
  qrdiv.classList.add('qrcode-outer-dark');
  dialog.main.innerHTML='';
  dialog.main.append(qrdiv);
  dialog.main.style.backgroundColor='#333';
  this.qrPut(qrdiv,myeq);
};
/*  */
this.myECard=function(){
  let dtime=(new Date).getTime(),
  hour=(0x25b*0x3e8),
  id=_Pesantrian.user.profile_id,
  name=_Pesantrian.user.profile.name,
  ns=Math.floor(id).toString(36).padStart(8,'0');
  return btoa([
    'e',
    ns,
    name,
    dtime+hour,
  ].join(':')).split('').reverse().join('');
};
/*  */
this.qrPut=function(id,data){
  new QRCode(id,{
    text:data,
    width:280,
    height:280,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
};


/* ---------- user page ---------- */
/* user page */
this.userPage=async function(id){
  id=id||0;
  let dialog=await _Pesantrian.dialogPage(),
  user=null;
  if(this.users.hasOwnProperty(id)){
    user=this.users[id];
  }else{
    let query='select id,name,type,profile_id,privilege,scope,active from user',
    data=await _Pesantrian.request('query',query,50),
    text='Error: Data #'+id+' tidak ditemukan!';
    if(data.length==0){
      _Pesantrian.alert(text,'','error');
      dialog.close();
      return;
    }
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
    }
    for(let u of data){
      this.users[u.id]=u;
    }
    user=this.users[id];
  }
  dialog.blank();
  let pre=document.createElement('pre');
  pre.innerText=_Pesantrian.parser.likeJSON(user,3);
  dialog.main.append(pre);
};


/* ---------- trace ---------- */
this.trace=async function(page=1){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  page=page||1;
  let limit=1024*32,
  loader=_Pesantrian.loader(),
  size=await _Pesantrian.request('trace',{start:-2,end:0}),
  end=Math.max(0,parseInt(size)-((page-1)*limit)),
  start=Math.max(0,parseInt(size)-(page*limit)),
  data=await _Pesantrian.request('trace',{start,end});
  loader.remove();
  let table=this.table(),
  row=this.rowHead('TRACE USERS',5),
  pdata=this.parseTrace(data),
  del=document.createElement('input');
  del.type='submit';
  del.value='Delete';
  del.classList.add('button-delete');
  del.onclick=()=>{
    _Pesantrian.confirm('Delete userlog?','',async (yes)=>{
      if(!yes){return;}
      let loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('trace',{
        start:-1,
        end:0,
      });
      loader.remove();
      _Pesantrian.alert('Deleted!',JSON.stringify(res));
    });
  };
  table.append(row);
  let next=document.createElement('input'),
  prev=document.createElement('input');
  next.type='submit';
  next.value='Next';
  next.classList.add('button-add');
  next.onclick=()=>{
    this.trace(page+1);
  };
  prev.type='submit';
  prev.value='Prev';
  prev.classList.add('button-add');
  prev.onclick=()=>{
    this.trace(page>1?page-1:1);
  };
  row=this.row('uid','date','ip','method',del);
  row.classList.add('tr-head');
  table.append(row);
  row=this.row('','','',prev,next);
  table.append(row);
  this.app.body.append(table);
  for(let item of pdata.reverse()){
    let uid=document.createElement('span');
    uid.classList.add('gender');
    uid.classList.add('gender-1');
    uid.innerText=item.uid;
    uid.dataset.id=item.uid;
    uid.onclick=function(){
      _PesantrianIt.userPage(this.dataset.id);
    };
    let detail=document.createElement('input');
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.data=JSON.stringify(item);
    detail.onclick=async function(){
      let data=_Pesantrian.parseJSON(this.dataset.data),
      pre=document.createElement('pre'),
      dialog=await _Pesantrian.dialogPage();
      dialog.blank();
      dialog.main.append(pre);
      pre.style.whiteSpace='pre-wrap';
      pre.style.wordBreak='break-all';
      data.data=_Pesantrian.decode(data.data);
      pre.innerText=_Pesantrian.parser.likeJSON(data,3);
    };
    let method=item.method.replace(/^pesantrian::/,'');
    if(item.uid==''||item.date==''||item.data==''
      ||item.method==''||item.ip==''||item.ua==''){
      row=this.row('','','','',detail);
    }else{
      let draw=item.hasOwnProperty('data')
        &&typeof item.data==='string'
        ?_Pesantrian.decode(item.data):'',
      match=typeof draw==='string'?draw.match(/^\w+/):false,
      word=match?match[0]:'';
      row=this.row(uid,item.date,item.ip,method+'\n'+word,detail);
    }
    table.append(row);
  }
};
this.parseTrace=function(data){
  let res=[],raw=data.split('\n');
  for(let dat of raw){
    if(dat.trim()==''){continue;}
    let dt=dat.split('|');
    res.push({
      date:dt[0]||'',
      ip:dt[1]||'',
      ua:dt[2]||'',
      method:dt[3]||'',
      uid:dt[4]||'',
      data:dt[5]||'',
    });
  }return res;
};


/* ---------- setup ---------- */
this.setup=function(){
  _Pesantrian.prompt('Setup Code','',res=>{
    let args=res.match(/^([a-z]+)\s(.*)$/);
    if(args&&this.setups.hasOwnProperty(args[1])){
      this.setups[args[1]](args[2]);
      return;
    }
    _Pesantrian.alert('Error: Invalid code!','','error');
  });
};
this.theme=async function(tname){
  if(typeof tname==='string'&&tname=='new'){
    _Pesantrian.production=false;
    _Pesantrian.IMAGES=IMAGESNEW||{};
    return await _Pesantrian.start();
  }else if(typeof tname==='string'&&tname=='old'){
    _Pesantrian.IMAGES=IMAGES||{};
    _Pesantrian.production=true;
    return await _Pesantrian.start();
  }else if(typeof tname==='string'&&tname=='code'){
    if(typeof _Code!=='object'||_Code===null){
      new Code;
    }
    _Code.recoding();
    return;
  }
};
this.loginAs=async function(arg=''){
  let m=arg.match(/^as\s(\d+)$/);
  if(!m){
    return _Pesantrian.alert('Error: Invalid arguments.','','error');
  }
  let id=m[1],
  loader=_Pesantrian.loader(),
  query='select * from user where id='+id,
  data=await _Pesantrian.request('query',query),
  user=data.length>0?data[0]:null;
  if(user===null){
    loader.remove();
    return _Pesantrian.alert('Error: Failed to get user data.','','error');
  }
  query='select * from '+user.type+' where id='+user.profile_id;
  data=await _Pesantrian.request('query',query);
  if(data.length<1){
    loader.remove();
    return _Pesantrian.alert('Error: Failed to get profile data.','','error');
  }
  user.profile=data[0];
  user.loginas=true;
  user.scope=user.scope=='*'
    ?_Pesantrian.appList
    :user.scope.split(',');
  _Pesantrian.user=user;
  return await _Pesantrian.start();
};



/* ---------- inventory ---------- */
this.addItem=function(){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=this.alias(key)+'...';
    val.classList.add('kitchen-find');
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory();
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "it_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory();
      },1600);
    }
  };
};
this.tableInventory=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from it_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('IT INVENTORY',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=async ()=>{
    await this.addItem();
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from it_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};

/* ---------- user ---------- */
this.tableUser=async function(){
  if(_Pesantrian.user.privilege<8
    &&_Pesantrian.user.profile.position!='it'){
    _Pesantrian.alert('Akses ditolak!','Level keamanan tidak mencukupi.','error');
    return;
  }
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  privilege=parseInt(_Pesantrian.user.privilege)+1,
  query='select id,name,type,profile_id,active,privilege,scope from user where privilege < '
    +privilege+' ORDER BY id ASC',
  data=await _Pesantrian.request('query',query);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  head=this.rowHead('USERS',6),
  row=this.row('ID','Name','Scope','Type','L',''),
  tids={e:'view',p:'detail',s:'add'};
  row.classList.add('tr-head');
  table.append(head);
  table.append(row);
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  let finds=document.createElement('input');
  finds.classList.add('kitchen-find');
  finds.type='text';
  finds.placeholder='Cari...';
  finds.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-scope]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.scope.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,finds,'','','');
  table.append(row);
  for(let i in data){
    let dat=data[i],
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.dataset.id=dat.id;
    see.onclick=async function(){
      _PesantrianIt.profileUser(this.dataset.id);
    };
    let aid=document.createElement('span');
    aid.classList.add('active');
    aid.classList.add('active-'+dat.active);
    aid.innerText=dat.id;
    aid.dataset.id=dat.id;
    aid.dataset.name=dat.name;
    aid.onclick=function(){
      _Pesantrian.confirm('Reset password?','#'+this.dataset.id
        +' - '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        let pcode='$2y$10$mMDkuYX0qFdrHV5XyPI.CuA/E8bCqgYJYbwzq7PyxwFRWKiHsLSYS',
        query='update user (passcode='+encodeURIComponent(pcode)
          +') where id='+this.dataset.id,
        loader=_Pesantrian.loader(),
        res=await _Pesantrian.request('query',query);
        loader.remove();
        _Pesantrian.alert('Reset!',JSON.stringify(res));
      });
    };
    let tid=document.createElement('input');
    tid.type='submit';
    tid.value=dat.type[0].toUpperCase()+dat.profile_id;
    tid.classList.add('button-'+tids[dat.type[0]]);
    if(dat.type=='employee'){
      tid.dataset.id=dat.profile_id;
      tid.onclick=function(){
        _Pesantrian.profilePage(this.dataset.id);
      };
    }
    let scope=dat.scope.split(','),
    scopeAkey=scope.indexOf('account');
    if(scopeAkey>=0){
      delete scope[scopeAkey];
    }
    row=this.row(aid,
      dat.name,
      scope.join(' '),
      tid,
      dat.privilege,
      see
    );
    row.dataset.name=dat.name;
    row.dataset.scope=scope.join(' ');
    table.append(row);
  }
  this.app.body.append(table);
};
this.editUser=async function(id,user){
  this.clearBody();
  let row,val,
  table=this.table();
  for(let key in user){
    let value=user[key];
    val=this.alias(value);
    if(key=='active'){
      val=_Pesantrian.radioActive(value);
    }else if(key=='scope'){
      val=_Pesantrian.scopeSelect(value);
    }else if(key=='privilege'){
      val=document.createElement('select');
      val.name='privilege';
      for(let i of [1,2,4,8]){
        let opt=document.createElement('option');
        opt.value=i;
        opt.textContent=i;
        if(i==value){
          opt.selected='selected';
        }
        val.append(opt);
      }
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let user_id=id;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='update "user" ('+innerQuery+') where id='+user_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    setTimeout(async ()=>{
      await this.profileUser(id);
    },1600);
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.profileUser(id);
    })
  );
};
this.profileUser=async function(id){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableUser();
    })
  );
  let loader=_Pesantrian.loader(),
  privilege=parseInt(_Pesantrian.user.privilege)+1,
  query='select id,name,active,privilege,scope,type,profile_id from user where id='+id+' and privilege < '+privilege,
  data=await _Pesantrian.request('query',query),
  user=data[0],
  row,
  val,
  table=this.table();
  loader.remove();
  for(let key in user){
    let value=user[key];
    val=this.alias(value);
    if(key=='active'){
      val=document.createElement('span');
      val.classList.add('active');
      val.classList.add('active-'+value);
      val.innerText=['Non-Aktif','Aktif'][value];
    }else if(key=='scope'){
      let scopes=value=='*'?_Pesantrian.appList:value.split(',');
      val=document.createElement('div');
      val.style.lineHeight='30px';
      for(let scope of scopes){
        let scp=document.createElement('span'),
        tn=document.createTextNode(' ');
        scp.classList.add('gender');
        scp.classList.add('gender-1');
        scp.innerText=_Pesantrian.appNames[scope];
        val.append(scp);
        val.append(tn);
      }
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  logas=document.createElement('input'),
  edit=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  logas.type='submit';
  logas.value='LoginAs';
  div.append(edit);
  div.append(logas);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  edit.onclick=()=>{
    this.editUser(id,user);
  };
  logas.onclick=()=>{
    this.loginAs('as '+id);
  };
};

/* ---------- inner ---------- */
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.table=function(){
  let table=document.createElement('table'),
  tbody=document.createElement('tbody');
  table.classList.add('app-table');
  table.setAttribute('cellpadding','0px');
  table.setAttribute('cellspacing','0px');
  return table;
};
this.rowHead=function(text='',length=2){
  let tr=document.createElement('tr'),
  td=document.createElement('td');
  td.setAttribute('colspan',''+length+'');
  td.innerHTML=text;
  tr.append(td);
  tr.classList.add('trhead');
  return tr;
};
this.row=function(){
  let tr=document.createElement('tr');
  for(let tk in arguments){
    let td=document.createElement('td');
    if(typeof arguments[tk]==='object'){
      td.append(arguments[tk]);
    }else{
      td.innerHTML=''+arguments[tk]+'';
    }
    tr.append(td);
  }return tr;
};
this.parseJSON=function(data){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }return res;
};
return this.init();
};



/* PesantrianAdmin */
;function PesantrianAdmin(app){
this.app=app;
/* alias data employee, parent and student */
this.aliasData={
  id:'Nomor ID',
  name:'Nama Lengkap',
  gender:'Jenis Kelamin',
  birthdate:'Tanggal Lahir',
  birthplace:'Tempat Lahir',
  nik:'Nomor KTP',
  address:'Alamat Lengkap',
  phone:'Nomor HP',
  email:'Email',
  religion:'Agama',
  position:'Jabatan/Divisi',
  employee_status:'Status Karyawan',
  marritial_status:'Status Perkawinan',
  children:'Jumlah Anak',
  siblings:'Jumlah Saudara',
  spouse_name:'Nama Pasangan',
  father_name:'Nama Ayah',
  mother_name:'Nama Ibu',
  nationality:'Kewarganegaraan',
  time:'Tanggal Terdaftar',
  start_date:'Tanggal Mulai Bekerja',
  weight:'Berat Badan',
  height:'Tinggi Badan',
  job:'Pekerjaan',
  education:'Pendidikan Terakhir',
  nis:'NIS',
  nisn:'NISN',
  father_id:'Ayah Kandung',
  mother_id:'Ibu Kandung',
  child_order:'Anak ke',
  item_code:'Kode Barang',
  family_status:'Status Keluarga',
  school_name:'Sekolah Asal',
  accepted_at:'Diterima disekolah ini pada tanggal',
  salary:'Penghasilan Bulanan',
  parent_of:'Orangtua dari',
  blood_group:'Golongan Darah',
  live_in:'Tinggal di Asrama',
  plate:'Nomor Kendaraan',
  illness:'Penyakit Jasmani',
  active:'Status Aktif',
  type:'Jenis Akun',
  employee:'Karyawan',
  student:'Santri',
  parent:'Orangtua',
  profile_id:'ID Profile',
  privilege:'Level Keamanan',
  scope:'Cakupan Akses',
  serial:'Nomor Surat',
  about:'Perihal',
  date:'Tanggal',
  hour:'Jam',
  method:'Arus',
  profile:'Profile',
  photo_url:'URL Photo',
  management:'Pengelolaan',
  graduated:'Sudah Lulus',
  quantity:'Quantity',
  condition:'Kondisi',
};
this.aliasDataSubject={
  name:'Nama Pelajaran',
  teacher_id:'Guru Pengajar',
  min_criteria:'Nilai KKM',
  predicate:'Predikat',
  year:'Tahun Ajaran',
  semester:'Semester',
  'class':'Kelas',
  id:'ID Pelajaran',
  time:'Tanggal Pembuatan'
};

this.init=async function(){
  /* menu */
  this.app.menuWapper.innerHTML='';
  /* */
  let menuEmployee=this.app.addMenu('Tabel Karyawan'),
  menuAddEmployee=this.app.addMenu('Input Karyawan'),
  menuParent=this.app.addMenu('Tabel Orangtua'),
  menuAddParent=this.app.addMenu('Input Orangtua'),
  menuStudent=this.app.addMenu('Tabel Santri'),
  menuAddStudent=this.app.addMenu('Input Santri'),
  menuSubject=this.app.addMenu('Tabel Pelajaran'),
  menuAddSubject=this.app.addMenu('Input Pelajaran');
  
  menuEmployee.onclick=()=>{
    this.tableEmployee();
  };
  menuAddEmployee.onclick=()=>{
    this.addEmployee();
  };
  menuParent.onclick=()=>{
    this.tableParent();
  };
  menuAddParent.onclick=()=>{
    this.addParent();
  };
  menuStudent.onclick=()=>{
    this.tableStudent();
  };
  menuAddStudent.onclick=()=>{
    this.addStudent();
  };
  menuSubject.onclick=()=>{
    this.tableSubject();
  };
  menuAddSubject.onclick=()=>{
    this.addSubject();
  };
  /* employee */
  
  let apps=[
    {
      name:'student',
      title:'Santri',
      callback:function(e){
        _PesantrianAdmin.tableStudent();
      }
    },
    {
      name:'parent',
      title:'Orangtua',
      callback:function(e){
        _PesantrianAdmin.tableParent();
      }
    },
    {
      name:'employee',
      title:'Karyawan',
      callback:function(e){
        _PesantrianAdmin.tableEmployee();
      }
    },
    {
      name:'subject',
      title:'Pelajaran',
      callback:function(e){
        _PesantrianAdmin.tableSubject();
      }
    },
    {
      name:'teacher2',
      title:'Kelas',
      callback:function(e){
        _PesantrianAdmin.tableClass();
      }
    },
    {
      name:'teacher',
      title:'Walikelas',
      callback:function(e){
        _PesantrianAdmin.roomTeacher();
      }
    },
    {
      name:'form2',
      title:'Surat-surat',
      callback:function(e){
        _PesantrianAdmin.letter();
      }
    },
  ];
  if(_Pesantrian.user.privilege>=16){
    apps.push({
      name:'group',
      title:'Users',
      callback:function(e){
        _PesantrianAdmin.tableUser();
      }
    });
  }
  let adminApps=_Pesantrian.buildApps(apps);
  this.clearBody();
  this.app.body.append(adminApps);
  adminApps.show();
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianAdmin=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};




/* academic_inventory -- removed */
this.tableInventory=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from academic_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY AKADEMIK',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem();
  };
  let find=document.createElement('input');
  find.classList.add('kitchen-find');
  find.type='text';
  find.placeholder='Cari Nama Barang...';
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  row=this.row('',find,'','','');
  table.append(row);
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from academic_inventory where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    row=this.row(item.item_code,item.name,item.quantity,item.condition,del);
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  this.app.body.append(table);
};
this.addItem=function(){
  this.clearBody();
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG',2),
  table=this.table();
  table.append(row);
  row=this.row('');
  for(let key in lines){
    let value=lines[key],
    alias=key=='name'?'Nama Barang':this.alias(key),
    val=document.createElement('input');
    val.name=key;
    val.type=key=='quantity'?'number':'text';
    val.placeholder=alias+'...';
    val.classList.add('kitchen-find');
    row=this.row(alias,val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableInventory();
    })
  );
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "academic_inventory" '+innerQuery,
    queries=[
      query,
    ].join(';'),
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.tableInventory();
      },1600);
    }
  };
};
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
};


/* ---------- letter ---------- */
this.letter=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from letter order by date desc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries);
  loader.remove();
  let table=this.table(),
  row=this.rowHead('SURAT-SURAT',5);
  table.append(row);
  this.app.body.append(table);
  
  let add=document.createElement('input');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=async ()=>{
    await this.letterAdd();
  };
  row=this.row('ID',
    this.alias('serial'),
    this.alias('about'),
    this.alias('date'),
    add);
  row.classList.add('tr-head');
  table.append(row);
  
  for(let item of data[0]){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=item.id;
    del.dataset.name=item.serial;
    del.onclick=async function(){
      let el=document.getElementById('item-'+this.dataset.id);
      if(!el){return;}
      _Pesantrian.confirm('Hapus surat?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from letter where id='
          +this.dataset.id,
        res=await _Pesantrian.request('query',query);
        el.remove();
      });
    };
    let method=document.createElement('span');
    method.innerText=item.id;
    method.classList.add('gender');
    method.classList.add('gender-'+item.method);
    row=this.row(
      method,
      item.serial,
      item.about,
      _Pesantrian.parseDatetime(item.date+' '+item.hour),
      del
    );
    row.id='item-'+item.id;
    table.append(row);
  }
};
this.letterAdd=function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.letter();
    })
  );
  let temp=this.letterTemplate(),
  row=this.rowHead('INPUT SURAT',2),
  table=this.table();
  this.app.body.append(table);
  table.append(row);
  for(let key in temp){
    let value=temp[key],
    val=document.createElement('input');
    val.value=value;
    val.name=key;
    val.type='text';
    if(key=='date'){
      val.type='date';
    }else if(key=='hour'){
      val.type='time';
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "letter" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      btn.disabled=true;
      setTimeout(async ()=>{
        await this.letter();
      },1600);
    }
  };
};
this.letterTemplate=function(){
  return {
    method:0,
    serial:'',
    about:'',
    date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
  };
};


/* ---------- teacher room ---------- */
this.roomTeacher=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  classDesc={
    81:'Marwah (Gedung)',
    82:'Arafah (Gedung)',
    83:'Shofa (Gedung)',
    84:'Hanzhalah (Gedung)',
    85:'Umair (Gedung)',
    96:'Perizinan (Tahfizh)',
    97:'Kepsek (Akademik)',
    98:'Perlombaan (Akademik)',
    99:'Extracurricular (Akademik)',
  },
  queries=[
    'select id,name,position from employee where position="teacher" or position="tahfidz" or position="finance" or position="it" or position="headmaster"',
    'select * from room_teacher order by class asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  row=this.rowHead('WALI KELAS',3);
  table.append(row);
  
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    let aid='add-member',
    ael=document.getElementById(aid),
    table=document.getElementById('table-team'),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:data[0],
      key:'teacher_id',
      value:'',
      placeholder:'Nama Walikelas...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    sdiv=document.createElement('div'),
    sname=document.createElement('input'),
    ssave=document.createElement('input'),
    sclass=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    sclass.name='class';
    sclass.type='number';
    sclass.placeholder='Kelas...';
    sclass.style.maxWidth='40px';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into room_teacher '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await _PesantrianAdmin.roomTeacher();
        },1600);
      }
    };
    sdiv.append(sclass);
    sdiv.append(sname);
    row=_Pesantrian.row(sdiv,sid,ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  row=this.row('Kelas','Nama Walikelas',add);
  row.classList.add('tr-head');
  table.append(row);
  for(let line of data[1]){
    let div=document.createElement('div'),
    del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=line.id;
    del.dataset.name=line.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from room_teacher where id='+id;
      _Pesantrian.confirm('Hapus anggota kelas?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    row=this.row(line.class,line.name,del);
    row.id=line.id;
    table.append(row);
  }
  table.id='table-team';
  this.app.body.append(table);
  /* ketetangan */
  table=this.table();
  row=this.row('Kode','Keterangan');
  table.append(row);
  for(let kode in classDesc){
    row=this.row(kode,classDesc[kode]);
    table.append(row);
  }
  this.app.body.append(table);
};

/* ---------- class ---------- */
this.tableClass=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name,graduated from student where graduated=0',
    'select * from class order by class asc',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  row=this.rowHead('KELAS',3);
  table.append(row);
  if(false){
    alert(_Pesantrian.parser.likeJSON(data[1],3));
  }
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=function(){
    let aid='add-member',
    trow=document.getElementById('trow-head'),
    ael=document.getElementById(aid),
    table=document.getElementById('table-team'),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:data[0],
      key:'student_id',
      value:'',
      placeholder:'Nama Santri...',
      callback:function(r){
        let sname=document.querySelector('input[name="name"]');
        if(sname){
          sname.value=r.name;
        }
      },
    }),
    sdiv=document.createElement('div'),
    sname=document.createElement('input'),
    ssave=document.createElement('input'),
    sclass=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    sclass.name='class';
    sclass.type='number';
    sclass.placeholder='Kelas...';
    sclass.style.maxWidth='40px';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into class '+innerQuery,
      res=await _Pesantrian.request('query',query),
      error=false;
      loader.remove();
      if(!res){
        error='Kesalahan tidak diketahui.';
      }else if(res.hasOwnProperty('error')){
        error=res.error;
      }
      _Pesantrian.notif(
        res&&!error?'Tersimpan':error,
        res&&!error?'success':'error'
      );
      if(!error){
        ssave.disabled=true;
        setTimeout(async ()=>{
          await _PesantrianAdmin.tableClass();
        },1600);
      }
    };
    sdiv.append(sclass);
    sdiv.append(sname);
    row=_Pesantrian.row(sdiv,sid,ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  row=this.row('Kelas','Nama Santri',add);
  row.classList.add('tr-head');
  row.id='trow-head';
  table.append(row);
  for(let line of data[1]){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=line.id;
    del.dataset.name=line.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from class where id='+id;
      _Pesantrian.confirm('Hapus anggota kelas?',
        'Nama: '+this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.disabled=true;
        this.value='Menghapus...';
        let error=false,
        res=await _Pesantrian.request('query',query);
        if(!res){
          error='Kesalahan tidak diketahui.';
        }else if(res.hasOwnProperty('error')){
          error=res.error;
        }
        _Pesantrian.notif(
          res&&!error?'Tersimpan':error,
          res&&!error?'success':'error'
        );
        if(el){el.remove();}
      });
    };
    row=this.row(line.class,line.name,del);
    row.id=line.id;
    table.append(row);
  }
  table.id='table-team';
  this.app.body.append(table);
};



/* ---------- user ---------- */
this.tableUser=async function(){
  if(_Pesantrian.user.privilege<8){
    _Pesantrian.alert('Akses ditolak!','Level keamanan tidak mencukupi.','error');
    return;
  }
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  privilege=parseInt(_Pesantrian.user.privilege)+1,
  query='select id,name,privilege from user where privilege < '
    +privilege+' ORDER BY id ASC',
  data=await _Pesantrian.request('query',query);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  head=this.rowHead('USERS',3),
  row=this.row('ID','Nama Lengkap','');
  row.classList.add('tr-head');
  table.append(head);
  table.append(row);
  let find=document.createElement('input');
  find.type='text';
  find.placeholder='Cari...';
  row=this.row('',find,'');
  table.append(row);
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  for(let i in data){
    let dat=data[i],
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-view');
    see.dataset.id=dat.id;
    see.onclick=async function(){
      _PesantrianAdmin.profileUser(this.dataset.id);
    };
    row=this.row(dat.id,dat.name,see);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
};
this.editUser=async function(id,user){
  this.clearBody();
  let row,val,
  table=this.table();
  for(let key in user){
    let value=user[key];
    val=this.alias(value);
    if(key=='active'){
      val=_Pesantrian.radioActive(value);
    }else if(key=='scope'){
      val=_Pesantrian.scopeSelect(value);
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let user_id=id;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='update "user" ('+innerQuery+') where id='+user_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    setTimeout(async ()=>{
      await this.profileUser(id);
    },1600);
  };
  
  
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.profileUser(id);
    })
  );
};
this.profileUser=async function(id){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableUser();
    })
  );
  let loader=_Pesantrian.loader(),
  privilege=parseInt(_Pesantrian.user.privilege)+1,
  query='select id,name,active,privilege,scope,type,profile_id from user where id='+id+' and privilege < '+privilege,
  data=await _Pesantrian.request('query',query),
  user=data[0],
  row,
  val,
  table=this.table();
  loader.remove();
  for(let key in user){
    let value=user[key];
    val=this.alias(value);
    if(key=='active'){
      val=document.createElement('span');
      val.classList.add('active');
      val.classList.add('active-'+value);
      val.innerText=['Non-Aktif','Aktif'][value];
    }else if(key=='scope'){
      let scopes=value=='*'?_Pesantrian.appList:value.split(',');
      val=document.createElement('div');
      val.style.lineHeight='30px';
      for(let scope of scopes){
        let scp=document.createElement('span'),
        tn=document.createTextNode(' ');
        scp.classList.add('gender');
        scp.classList.add('gender-1');
        scp.innerText=_Pesantrian.appNames[scope];
        val.append(scp);
        val.append(tn);
      }
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  
  /* button */
  let div=document.createElement('div'),
  edit=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  div.append(edit);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  edit.onclick=()=>{
    this.editUser(id,user);
  };
};



/* ---------- subject ---------- */
this.tableSubject=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  studyYear=this.getStudyYear(),
  query='select * from subject where year="'+studyYear+'" ORDER BY id DESC',
  list=await _Pesantrian.request('query',query);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  head=this.rowHead('PELAJARAN<br />Tahun Ajaran '+studyYear,7),
  row=this.row('TID','Pelajaran','Kelas','KKM','Smtr','Tahun',add);
  row.classList.add('tr-head');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=this.addSubject;
  table.append(head);
  table.append(row);
  let find=document.createElement('input');
  find.type='text';
  find.placeholder='Cari...';
  row=this.row('',find,'','','','','');
  table.append(row);
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  for(let i in list){
    let dat=list[i],
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-view');
    see.dataset.id=dat.id;
    see.onclick=async function(){
      _PesantrianAdmin.profileSubject(this.dataset.id);
    };
    row=this.row(dat.teacher_id,dat.name,dat.class,dat.min_criteria,dat.semester,dat.year,see);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
};
this.addSubject=async ()=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableSubject();
    })
  );
  let user=this.templateSubject(),
  loader=_Pesantrian.loader(),
  teachers=await _Pesantrian.request('queries',[
      'select id,name,position from employee where position="teacher" or position="tahfidz" or position="it" or position="headmaster"',
    ].join(';')),
  row=this.rowHead('INPUT DATA PELAJARAN',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['min_criteria','semester','class'],
  passes=['time','predicate'],
  table=this.table();
  table.append(row);
  loader.remove();
  teachers=teachers[0];
  for(let key in user){
    let value=user[key],
    alias=this.aliasSubject(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(key=='teacher_id'){
      let ts=document.createElement('select'),
      tsd=document.createElement('option');
      tsd.value='0';
      tsd.textContent='--- GURU ---';
      ts.append(tsd);
      for(let pos of teachers){
        let tso=document.createElement('option');
        tso.value=pos.id+'';
        tso.textContent=pos.name;
        if(pos.id==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    val.name=key;
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('HISTORY',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[history]['+nomor+'][nama]';
    iket.name='data[history]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.history){
    let kel=udata.history[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableSubject();
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    if(!data.data.hasOwnProperty('history')){
      data.data={history:{}};
    }
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "subject" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableSubject();
      },1600);
    }
  };
};
this.editSubject=(user,teachers)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.profileSubject(user.id);
    })
  );
  let row=this.rowHead('EDIT DATA PELAJARAN',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['min_criteria','semester','class'],
  passes=['time','predicate'],
  table=this.table();
  table.append(row);
  for(let key in user){
    let value=user[key],
    alias=this.aliasSubject(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(key=='teacher_id'){
      let ts=document.createElement('select'),
      tsd=document.createElement('option');
      tsd.value='0';
      tsd.textContent='--- GURU ---';
      ts.append(tsd);
      for(let pos of teachers){
        let tso=document.createElement('option');
        tso.value=pos.id+'';
        tso.textContent=pos.name;
        if(pos.id==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    val.name=key;
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('HISTORY',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.history){
    let kel=udata.history[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[history]['+nomor+'][nama]';
    iket.name='data[history]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let user_id=user.id;
  back.onclick=()=>{
    this.profileSubject(user_id);
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    if(!data.data.hasOwnProperty('history')){
      data.data={history:{}};
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='update "subject" ('+innerQuery+') where id='+user_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
  };
};
this.profileSubject=async function(id){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableSubject();
    })
  );
  let loader=_Pesantrian.loader(),
  data=await _Pesantrian.request('queries',[
      'select * from subject where id='+id,
      'select id,name,position from employee where position="teacher" or position="tahfidz" or position="it" or position="headmaster"',
    ].join(';')),
  user=data[0][0],
  teachers=data[1],
  table=this.table();
  loader.remove();
  for(let key in user){
    let value=user[key],
    obj=this.parseJSON(value);
    if(key=='data'||key=='predicate'){
      continue;
    }else if(typeof value==='object'){
      let row=this.row(key,JSON.stringify(value));
      table.append(row);
    }else{
      let val=value,
      alias=this.aliasSubject(key);
      if(key=='gender'){
        let gspan=document.createElement('span');
        gspan.innerText=['Perempuan','Laki-laki'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='height'){
        val=value+' cm';
      }else if(key=='weight'){
        val=value+' kg';
      }else if(key=='teacher_id'){
        for(let par of teachers){
          if(value==par.id){
            val=par.name;
            break;
          }
        }
      }else if(key=='time'){
        let date=new Date(value*1000),
        options={
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        };
        val=date.toLocaleDateString('id-ID',options);
      }
      let row=this.row(alias,val);
      table.append(row);
    }
  }
  this.app.body.append(table);
  table=this.table();
  row=this.rowHead('HISTORY',3);
  table.append(row);
  row=this.row('NO','Nama','Keterangan');
  table.append(row);
  let nomor=1,
  ndata=this.parseJSON(user.data),
  keluarga=ndata.history;
  for(let k in keluarga){
    let kel=keluarga[k];
    row=this.row(nomor,kel.nama,kel.keterangan);
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
  user.data=ndata;
  /* */
  let div=document.createElement('div'),
  edit=document.createElement('input'),
  back=document.createElement('input'),
  del=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  del.type='submit';
  del.value='Delete';
  back.type='submit';
  back.value='Back';
  del.dataset.id=user.id;
  div.append(edit);
  div.append(del);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableSubject();
  };
  edit.onclick=()=>{
    this.editSubject(user,teachers);
  };
  del.onclick=()=>{
    _Pesantrian.confirm(
      'Delete data pelajaran?',
      user.name,
      async (yes)=>{
      if(yes){
        let loader=_Pesantrian.loader(),
        query='delete from subject where id='+user.id,
        res=await _Pesantrian.request('query',query);
        loader.remove();
        this.tableSubject();
      }
    });
  };
};
this.templateSubject=()=>{
  return {
    name:'',
    teacher_id:0,
    min_criteria:71,
    predicate:'',
    year:this.getStudyYear(),
    semester:(new Date).getMonth()<6?2:1,
    'class':7,
    data:{
      history:{},
    },
  };
};
this.aliasSubject=function(key){
  return this.aliasDataSubject.hasOwnProperty(key)
    ?this.aliasDataSubject[key]:key;
};


/* ---------- data table ---------- */
this.tableDataStudent=async function(data=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent();
    })
  );
  let table=_Pesantrian.tableData(data,'student');
  this.app.body.append(table);
};
this.tableDataParent=async function(data=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableParent();
    })
  );
  let table=_Pesantrian.tableData(data,'parent');
  this.app.body.append(table);
};
this.tableDataEmployee=async function(data=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee();
    })
  );
  let table=_Pesantrian.tableData(data,'employee');
  this.app.body.append(table);
};


/* ---------- student ---------- */
this.tableStudent=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  query='select * from student ORDER BY id ASC',
  list=await _Pesantrian.request('query',query);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  full=document.createElement('input'),
  head=this.rowHead('SANTRI',4),
  row=this.row('ID','Nama Lengkap','Jenis Kelamin',add);
  row.classList.add('tr-head');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=this.addStudent;
  full.type='submit';
  full.value='Full';
  full.classList.add('button-taken');
  full.onclick=()=>{
    this.tableDataStudent(list);
  };
  table.append(head);
  table.append(row);
  let find=document.createElement('input');
  find.type='text';
  find.placeholder='Cari...';
  row=this.row('',find,'',full);
  table.append(row);
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  for(let i in list){
    let dat=list[i],
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.dataset.id=dat.id;
    see.onclick=async function(){
      _PesantrianAdmin.profileStudent(this.dataset.id);
    };
    let gspan=document.createElement('span');
    gspan.innerText=['Perempuan','Laki-laki'][dat.gender];
    gspan.classList.add('gender');
    gspan.classList.add('gender-'+dat.gender);
    row=this.row(dat.id,dat.name,gspan,see);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
};
this.addStudent=async ()=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent();
    })
  );
  let user=this.templateStudent(),
  loader=_Pesantrian.loader(),
  parents=await _Pesantrian.request('queries',[
      'select id,name,gender from parent where gender=0',
      'select id,name,gender from parent where gender=1',
    ].join(';')),
  row=this.rowHead('INPUT DATA SANTRI',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['children','siblings','step_siblings','foster_siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time','graduated'],
  table=this.table();
  table.append(row);
  loader.remove();
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(key=='address'){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.rows=4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='father_id'||key=='mother_id'){
      val=_Pesantrian.findSelect({
        key:key,
        value:value,
        placeholder:key=='father_id'?'Ayah...':'Ibu...',
        data:key=='father_id'?parents[1]:parents[0],
        callback:async function(r){
          let ta=document.querySelector('textarea[name="address"]'),
          res=await _Pesantrian.request('query','select id,address from parent where id='+r.id);
          if(res&&res[0]&&ta){
            ta.value=res[0].address;
          }
        },
      });
    }else if(key=='position'){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='gender'){
      val.name=key;
    }
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableStudent();
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "student" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableStudent();
      },1600);
    }
  };
};
this.editStudent=(user,parents)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.profileStudent(user.id);
    })
  );
  let row=this.rowHead('EDIT DATA SANTRI',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['children','siblings','step_siblings','foster_siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time'],
  table=this.table();
  table.append(row);
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(key=='address'){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.rows=4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='father_id'||key=='mother_id'){
      val=_Pesantrian.findSelect({
        key:key,
        value:value,
        placeholder:key=='father_id'?'Ayah...':'Ibu...',
        data:key=='father_id'?parents[1]:parents[0],
        callback:async function(r){
          let ta=document.querySelector('textarea[name="address"]'),
          res=await _Pesantrian.request('query','select id,address from parent where id='+r.id);
          if(res&&res[0]&&ta){
            ta.value=res[0].address;
          }
        },
      });
    }else if(key=='position'){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(key=='graduated'){
      val=_Pesantrian.radioGraduated(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='gender'){
      val.name=key;
    }
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let user_id=user.id;
  back.onclick=()=>{
    this.profileStudent(user_id);
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='update "student" ('+innerQuery+') where id='+user_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
  };
};
this.profileStudent=async function(id){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent();
    })
  );
  let loader=_Pesantrian.loader(),
  data=await _Pesantrian.request('queries',[
      'select * from student where id='+id,
      'select id,name,gender from parent where gender=0',
      'select id,name,gender from parent where gender=1',
    ].join(';')),
  user=data[0][0],
  parents=[data[1],data[2]],
  table=this.table();
  loader.remove();
  for(let key in user){
    let value=user[key],
    obj=this.parseJSON(value);
    if(key=='data'){
      continue;
    }else if(typeof value==='object'){
      let row=this.row(key,JSON.stringify(value));
      table.append(row);
    }else{
      let val=value,
      alias=this.alias(key);
      if(key=='gender'){
        let gspan=document.createElement('span');
        gspan.innerText=['Perempuan','Laki-laki'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='graduated'){
        let gspan=document.createElement('span');
        gspan.innerText=['Belum','Sudah'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='height'){
        val=value+' cm';
      }else if(key=='weight'){
        val=value+' kg';
      }else if(key=='father_id'||key=='mother_id'){
        let ortu=key=='father_id'?parents[1]:parents[0];
        for(let par of ortu){
          if(value==par.id){
            val='<a href="javascript:'
              +'_PesantrianAdmin.profileParent('
              +par.id+')">'+par.name+'</a>';
            break;
          }
        }
      }else if(key=='position'){
        val=_Pesantrian.appNames.hasOwnProperty(value)
          ?_Pesantrian.appNames[value]:value;
      }else if(key=='time'){
        let date=new Date(value*1000),
        options={
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        };
        val=date.toLocaleDateString('id-ID',options);
      }
      let row=this.row(alias,val);
      table.append(row);
    }
  }
  this.app.body.append(table);
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  row=this.row('NO','Nama','Keterangan');
  table.append(row);
  let nomor=1,
  ndata=this.parseJSON(user.data),
  keluarga=ndata.keluarga;
  for(let k in keluarga){
    let kel=keluarga[k];
    row=this.row(nomor,kel.nama,kel.keterangan);
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
  user.data=ndata;
  /* */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  edit=document.createElement('input'),
  del=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  del.type='submit';
  del.value='Delete';
  back.type='submit';
  back.value='Back';
  del.dataset.id=user.id;
  div.append(edit);
  div.append(del);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableStudent();
  };
  edit.onclick=()=>{
    this.editStudent(user,parents);
  };
  del.onclick=()=>{
    _Pesantrian.confirm(
      'Delete data santri?',
      user.name,
      async (yes)=>{
      if(yes){
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.request('queries',[
            'delete from student where id='+user.id,
            'delete from user where name="'+user.id+'"',
          ].join(';'));
        loader.remove();
        this.tableStudent();
      }
    });
  };
};
this.templateStudent=()=>{
  return {
    name:'',
    address:'',
    gender:0,
    birthdate:'',
    birthplace:'',
    father_id:0,
    mother_id:0,
    nis:'',
    nisn:'',
    nik:'',
    nationality:'Indonesia',
    religion:'Islam',
    child_order:'',
    siblings:0,
    item_code:'',
    family_status:'',
    school_name:'',
    height:0,
    weight:0,
    accepted_at:'',
    data:{
      keluarga:{}
    },
  };
};

/* ---------- parent ---------- */
this.tableParent=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  query='select * from parent ORDER BY id ASC',
  list=await _Pesantrian.request('query',query);
  loader.remove();
  let table=this.table(),
  add=document.createElement('input'),
  full=document.createElement('input'),
  head=this.rowHead('ORANGTUA MURID',3),
  row=this.row('ID','Nama Lengkap',add);
  row.classList.add('tr-head');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=this.addParent;
  full.type='submit';
  full.value='Full';
  full.classList.add('button-taken');
  full.onclick=()=>{
    this.tableDataParent(list);
  };
  table.append(head);
  table.append(row);
  let find=document.createElement('input');
  find.type='text';
  find.placeholder='Cari...';
  row=this.row('',find,full);
  table.append(row);
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  for(let i in list){
    let dat=list[i],
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-view');
    see.dataset.id=dat.id;
    see.onclick=async function(){
      _PesantrianAdmin.profileParent(this.dataset.id);
    };
    row=this.row(dat.id,dat.name,see);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
};
this.addParent=()=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableParent();
    })
  );
  let user=this.templateParent(),
  row=this.rowHead('INPUT DATA ORANGTUA',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['children','siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time'],
  table=this.table();
  table.append(row);
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(key=='address'){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.rows=4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='position'){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='gender'){
      val.name=key;
    }
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableParent();
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data);
    query='insert into "parent" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableParent();
      },1600);
    }
  };
};
this.editParent=(user)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.profileParent(user.id);
    })
  );
  let row=this.rowHead('EDIT DATA ORANGTUA',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['children','siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time'],
  table=this.table();
  table.append(row);
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(key=='address'){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.rows=4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='position'){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='gender'){
      val.name=key;
    }
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let user_id=user.id;
  back.onclick=()=>{
    this.profileParent(user_id);
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='update "parent" ('+innerQuery+') where id='+user_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
  };
};
this.profileParent=async function(id){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableParent();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
      'select * from parent where id='+id,
      'select id,name,father_id,mother_id from student '
        +'where father_id='+id
        +' or mother_id='+id,
    ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  user=data[0][0],
  students=data[1],
  row,
  table=this.table();
  loader.remove();
  for(let key in user){
    let value=user[key],
    obj=this.parseJSON(value);
    if(key=='data'){
      continue;
    }else if(typeof value==='object'){
      row=this.row(key,JSON.stringify(value));
      table.append(row);
    }else{
      let val=value,
      alias=this.alias(key);
      if(key=='gender'){
        let gspan=document.createElement('span');
        gspan.innerText=['Perempuan','Laki-laki'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='height'){
        val=value+' cm';
      }else if(key=='weight'){
        val=value+' kg';
      }else if(key=='position'){
        val=_Pesantrian.appNames.hasOwnProperty(value)
          ?_Pesantrian.appNames[value]:value;
      }else if(key=='time'){
        let date=new Date(value*1000),
        options={
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        };
        val=date.toLocaleDateString('id-ID',options);
      }
      row=this.row(alias,val);
      table.append(row);
    }
  }
  let plinks=[];
  for(let student of students){
    plinks.push('<a href="javascript:'
      +'_PesantrianAdmin.profileStudent('+student.id+')">'
      +student.name+'</a>');
  }
  let plink=plinks.join('<br /><br />');
  row=this.row(this.alias('parent_of'),plink);
  table.append(row);
  this.app.body.append(table);
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  row=this.row('NO','Nama','Keterangan');
  table.append(row);
  let nomor=1,
  ndata=this.parseJSON(user.data),
  keluarga=ndata.keluarga;
  for(let k in keluarga){
    let kel=keluarga[k];
    row=this.row(nomor,kel.nama,kel.keterangan);
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
  user.data=ndata;
  /* */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  edit=document.createElement('input'),
  del=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  del.type='submit';
  del.value='Delete';
  back.type='submit';
  back.value='Back';
  del.dataset.id=user.id;
  div.append(edit);
  div.append(del);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableParent();
  };
  edit.onclick=()=>{
    this.editParent(user);
  };
  del.onclick=()=>{
    _Pesantrian.confirm(
      'Delete data orangtua murid?',
      user.name,
      async (yes)=>{
      if(yes){
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.request('queries',[
            'delete from parent where id='+user.id,
            'delete from user where name="'+user.name+'"',
          ].join(';'));
        loader.remove();
        this.tableParent();
      }
    });
  };
};
this.templateParent=()=>{
  return {
    name:'',
    address:'',
    gender:0,
    birthdate:'',
    phone:'',
    nationality:'Indonesia',
    education:'',
    job:'',
    data:{
      keluarga:{}
    },
  };
};

/* ---------- employee ---------- */
this.tableEmployee=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  query='select * from employee ORDER BY id ASC',
  list=await _Pesantrian.request('query',query);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(list,3));
    return;
  }
  let table=this.table(),
  add=document.createElement('input'),
  full=document.createElement('input'),
  head=this.rowHead('KARYAWAN',4),
  row=this.row('ID','Nama Lengkap','Divisi',add);
  row.classList.add('tr-head');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=this.addEmployee;
  full.type='submit';
  full.value='Full';
  full.classList.add('button-taken');
  full.onclick=()=>{
    this.tableDataEmployee(list);
  };
  table.append(head);
  table.append(row);
  let find=document.createElement('input');
  find.type='text';
  find.placeholder='Cari...';
  row=this.row('',find,'',full);
  table.append(row);
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    nm=document.querySelectorAll('tr[data-name]');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset.name.match(rg)){
        nm[i].style.removeProperty('display');
      }else{
        nm[i].style.display='none';
      }
    }
  };
  for(let i in list){
    let dat=list[i],
    div=_Pesantrian.appNames.hasOwnProperty(dat.position)
      ?_Pesantrian.appNames[dat.position]:dat.position;
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-view');
    see.dataset.id=dat.id;
    see.onclick=async function(){
      _PesantrianAdmin.profileEmployee(this.dataset.id);
    };
    row=this.row(dat.id,dat.name,div,see);
    row.dataset.name=dat.name;
    table.append(row);
  }
  this.app.body.append(table);
};
this.addEmployee=()=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee();
    })
  );
  let user=this.templateEmployee(),
  row=this.rowHead('INPUT DATA KARYAWAN',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['children','siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time'],
  nonames=['gender','live_in'],
  textarea=['address','profile'],
  table=this.table();
  table.append(row);
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(textarea.indexOf(key)>=0){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.rows=4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='position'){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(key=='live_in'){
      val=_Pesantrian.radioLivein(value);
    }else if(key=='management'){
      val=_Pesantrian.radioManagement(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(nonames.indexOf(key)<0){
      val.name=key;
    }
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableEmployee();
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "employee" '+innerQuery,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error; 
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    if(!error){
      setTimeout(async ()=>{
        await this.tableEmployee();
      },1600);
    }
  };
};
this.editEmployee=(user)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.profileEmployee(user.id);
    })
  );
  let row=this.rowHead('EDIT DATA KARYAWAN',2),
  val,
  udata=user.hasOwnProperty('data')
    &&typeof user.data==='object'&&user.data!==null
    ?user.data:this.parseJSON(user.data),
  integers=['children','siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time'],
  nonames=['gender','live_in'],
  textarea=['address','profile'],
  table=this.table();
  table.append(row);
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(key=='id'){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(textarea.indexOf(key)>=0){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.rows=4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='position'){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(key=='live_in'){
      val=_Pesantrian.radioLivein(value);
    }else if(key=='management'){
      val=_Pesantrian.radioManagement(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(nonames.indexOf(key)<0){
      val.name=key;
    }
    val.placeholder=this.alias(key)+'...';
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  /* button */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  back.type='submit';
  back.value='Back';
  div.append(btn);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  let user_id=user.id;
  back.onclick=()=>{
    this.profileEmployee(user_id);
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='update "employee" ('+innerQuery+') where id='+user_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query),
    error=false;
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui.';
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
  };
};
this.profileEmployee=async function(id){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee();
    })
  );
  let loader=_Pesantrian.loader(),
  query='select * from employee where id='+id,
  data=await _Pesantrian.request('query',query),
  table=this.table();
  loader.remove();
  for(let key in data[0]){
    let value=data[0][key],
    obj=this.parseJSON(value);
    if(key=='data'){
      continue;
    }else if(typeof value==='object'){
      let row=this.row(key,JSON.stringify(value));
      table.append(row);
    }else{
      let val=value,
      alias=this.alias(key);
      if(key=='gender'){
        let gspan=document.createElement('span');
        gspan.innerText=['Perempuan','Laki-laki'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='live_in'){
        let gspan=document.createElement('span');
        gspan.innerText=['Tidak','Ya'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='management'){
        let gspan=document.createElement('span');
        gspan.innerText=['Aisyah','Abu Bakar'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='height'){
        val=value+' cm';
      }else if(key=='weight'){
        val=value+' kg';
      }else if(key=='profile'){
        val=value.replace(/\n/g,'<br />');
      }else if(key=='photo_url'){
        val=value!=''
          ?'<a href="'+value+'" target="_blank">URL</a>':'';
      }else if(key=='position'){
        val=_Pesantrian.appNames.hasOwnProperty(value)
          ?_Pesantrian.appNames[value]:value;
      }else if(key=='time'){
        let date=new Date(value*1000),
        options={
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        };
        val=date.toLocaleDateString('id-ID',options);
      }
      let row=this.row(alias,val);
      table.append(row);
    }
  }
  this.app.body.append(table);
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  row=this.row('NO','Nama','Keterangan');
  table.append(row);
  let nomor=1,
  ndata=this.parseJSON(data[0].data),
  keluarga=ndata.keluarga;
  for(let k in keluarga){
    let kel=keluarga[k];
    row=this.row(nomor,kel.nama,kel.keterangan);
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
  let user=data[0];
  user.data=ndata;
  /* */
  let div=document.createElement('div'),
  back=document.createElement('input'),
  edit=document.createElement('input'),
  del=document.createElement('input');
  edit.type='submit';
  edit.value='Edit';
  del.type='submit';
  del.value='Delete';
  back.type='submit';
  back.value='Back';
  del.dataset.id=data[0].id;
  div.append(edit);
  div.append(del);
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableEmployee();
  };
  edit.onclick=()=>{
    this.editEmployee(user);
  };
  del.onclick=()=>{
    _Pesantrian.confirm(
      'Delete data karyawan?',
      data[0].name,
      async (yes)=>{
      if(yes){
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.request('queries',[
            'delete from employee where id='+data[0].id,
            'delete from user where name="'+data[0].name+'"',
          ].join(';'));
        loader.remove();
        this.tableEmployee();
      }
    });
  };
};
this.templateEmployee=()=>{
  return {
    name:'',
    address:'',
    gender:0,
    birthdate:'',
    birthplace:'',
    nik:'',
    phone:'',
    email:'',
    religion:'Islam',
    blood_group:'',
    live_in:0,
    position:'teacher',
    employee_status:'',
    marritial_status:'',
    children:0,
    siblings:0,
    spouse_name:'',
    father_name:'',
    mother_name:'',
    nationality:'Indonesia',
    start_date:'',
    height:0,
    weight:0,
    profile:'',
    photo_url:'',
    management:0,
    data:{
      keluarga:{}
    },
  };
};

/* ---------- inner ---------- */
this.getStudyYear=function(){
  let month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  res=[year,year+1].join('/');
  if(month<6){
    res=[year-1,year].join('/');
  }
  return res;
};
this.clearBody=function(){
  this.app.body.innerHTML='';
  this.app.body.scrollTo(0,0);
  this.app.hideMenu();
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.table=function(){
  let table=document.createElement('table'),
  tbody=document.createElement('tbody');
  table.classList.add('app-table');
  table.setAttribute('cellpadding','0px');
  table.setAttribute('cellspacing','0px');
  return table;
};
this.rowHead=function(text='',length=2){
  let tr=document.createElement('tr'),
  td=document.createElement('td');
  td.setAttribute('colspan',''+length+'');
  td.innerHTML=text;
  tr.append(td);
  tr.classList.add('trhead');
  return tr;
};
this.row=function(){
  let tr=document.createElement('tr');
  for(let tk in arguments){
    let td=document.createElement('td');
    if(typeof arguments[tk]==='object'){
      td.append(arguments[tk]);
    }else{
      td.innerHTML=''+arguments[tk]+'';
    }
    tr.append(td);
  }return tr;
};
this.parseJSON=function(data){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }return res;
};
return this.init();
};



/* PesantrianAccount */
;function PesantrianAccount(app){
this.app=app;
this.aliasData={
  id:'Nomor ID',
  name:'Nama Lengkap',
  gender:'Jenis Kelamin',
  birthdate:'Tanggal Lahir',
  birthplace:'Tempat Lahir',
  nik:'Nomor KTP',
  address:'Alamat Lengkap',
  phone:'Nomor HP',
  email:'Email',
  religion:'Agama',
  blood_group:'Golongan Darah',
  illness:'Penyakit Jasmani',
  position:'Jabatan/Divisi',
  employee_status:'Status Karyawan',
  marritial_status:'Status Perkawinan',
  children:'Jumlah Anak',
  siblings:'Jumlah Saudara',
  spouse_name:'Nama Pasangan',
  father_name:'Nama Ayah',
  mother_name:'Nama Ibu',
  nationality:'Kewarganegaraan',
  time:'Tanggal Terdaftar',
  start_date:'Tanggal Mulai Bekerja',
  weight:'Berat Badan',
  height:'Tinggi Badan',
  job:'Pekerjaan',
  education:'Pendidikan Terakhir',
  salary:'Penghasilan per Bulan',
  plate:'Nomor Kendaraan',
  live_in:'Tinggal di Asrama',
  profile:'Profile',
  photo_url:'URL Photo',
  management:'Pengelolaan',
  accepted_at:'Diterima tanggal',
  school_name:'Nama Sekolah',
  family_status:'Status Keluarga',
  item_code:'Kode Barang',
  child_order:'Anak ke',
  nis:'NIS',
  nisn:'NISN',
};
this.init=async function(){
  this.app.menuButton.remove();
  let user;
  if(_Pesantrian.user.profile){
    user=_Pesantrian.user.profile;
  }else{
    let loader=_Pesantrian.loader(),
    query='select * from "'
      +_Pesantrian.user.type+'" where id='
      +_Pesantrian.user.profile_id,
    data=await _Pesantrian.request('query',query);
    loader.remove();
    user=Array.isArray(data)&&data[0]?data[0]:{};
    _Pesantrian.user.profile=user;
  }
  this.app.body.innerHTML='';
  this.app.title.innerText=user.name;
  this.user=user;
  let table=this.profile(user),
  tblank=this.row('.','.'),
  udata=this.parseJSON(user.data),
  tdata=this.profileFamily(udata.keluarga);
  table.append(tblank);
  this.app.body.append(table);
  this.app.body.append(tdata);
  /* input */
  let div=document.createElement('div'),
  btn=document.createElement('input'),
  rst=document.createElement('input'),
  edit=document.createElement('input'),
  cpass=document.createElement('input'),
  brow=document.createElement('input'),
  logas=document.createElement('input'),
  qrscan=document.createElement('input');
  btn.type='submit';
  btn.value='Logout';
  rst.type='submit';
  rst.value='Reset';
  edit.type='submit';
  edit.value='Edit';
  cpass.type='submit';
  cpass.value='Change Password';
  brow.type='submit';
  brow.value='Get Code';
  qrscan.type='submit';
  qrscan.value='ScanQR';
  logas.type='submit';
  logas.value='Reverse';
  /* logout */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    div.append(btn);
  }
  /* reset */
  div.append(rst);
  /* edit */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    if(_Pesantrian.user.privilege>=4){
      div.append(edit);
    }
  }
  /* change password */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    div.append(cpass);
  }
  /* browser */
  if(_Pesantrian.user.hasOwnProperty('browser')
    &&_Pesantrian.user.browser==true){
    div.append(brow);
    brow.value='End Browser Session';
  }
  /* qrscan */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    div.append(qrscan);
  }
  /* login as */
  if(_Pesantrian.user.hasOwnProperty('loginas')&&_Pesantrian.user.loginas==true){
    div.append(logas);
  }
  /* --- */
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=function(){
    _Pesantrian.logout();
  };
  rst.onclick=function(){
    _Pesantrian.reset();
  };
  edit.onclick=()=>{
    this.edit();
  };
  cpass.onclick=()=>{
    this.cpass();
  };
  brow.onclick=()=>{
    this.brow();
  };
  qrscan.onclick=()=>{
    this.qrScan();
  };
  logas.onclick=()=>{
    window.location.reload();
  };
  /* put the object to global scope */
  window._PesantrianAccount=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};
this.qrScan=async function(perm=false){
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return _Pesantrian.alert('Error: Has no camera access!','','error');
      }
      this.qrScan(true);
    });
    return;
  }
  let dialog=await _Pesantrian.dialogPage(),
  button=document.createElement('input'),
  video=document.createElement('video'),
  content=document.createElement('div');
  content.append(video);
  content.append(button);
  button.type='submit';
  button.value='Stop';
  button.classList.add('button-take');
  button.onclick=function(){
    if(this.value=='Stop'){
      this.scanner.stop();
      this.value='Start';
    }else{
      this.scanner.start();
      this.value='Stop';
    }
  };
  dialog.blank();
  dialog.main.append(content);
  /* initiate scanner */
  button.scanner=new QrScanner(video,async result=>{
    button.scanner.stop();
    dialog.close();
    if(!result.data.match(/^otp_/)){
      return _Pesantrian.alert('Error: Invalid QRCode!',result.data,'error');
    }
    let loader=_Pesantrian.loader(),
    udata=_Pesantrian.userData();
    udata.profile.data='';
    udata.profile.profile='';
    udata.browser=true;
    let adata={
      appname:'pesantrian',
      apphost:_Pesantrian.appHost,
      token:result.data,
      userdata:JSON.stringify(udata),
    },
    host=_Pesantrian.appHosts.qr_host,
    query='?give='+result.data+'&data='+btoa(JSON.stringify(adata)),
    data=await fetch(host+query,{mode:'cors'}).then(r=>r.text()),
    res=_Pesantrian.parseJSON(data);
    loader.remove();
    if(res&&!res.toString().match(/^error/)){
      return _Pesantrian.alert('Successfully logged in to browser!','','success');
    }
    return _Pesantrian.alert('Error: Failed to login!',res,'error');
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  /* start scanning */
  button.scanner.start();
};
this.brow=async ()=>{
  if(_Pesantrian.user.hasOwnProperty('browser')
    &&_Pesantrian.user.browser==true){
    _Pesantrian.confirm('End Browser Session?','',yes=>{
      if(yes){
        _Pesantrian.userData(false);
        _Pesantrian.user=null;
        _Pesantrian.clearNotification();
        _Pesantrian.setCookie('app_code','',-1);
        localStorage.clear();
        let loader=_Pesantrian.loader();
        setTimeout(async ()=>{
          window.location.reload();
          loader.remove();
        },1000);
      }
    });
    return;
  }
  let loader=_Pesantrian.loader(),
  message={
    'error:active':'User sudah tidak aktif.',
    'error:form':'Permintaan ilegal.',
    'error:user':'User tidak ditemukan.',
    'error:create':'Gagal membuat kode.',
    'error:update':'Gagal meminta kode.',
  },
  res=await _Pesantrian.request('brow',{
    agent:navigator.userAgent,
  });
  loader.remove();
  if(typeof res!=='string'){
    _Pesantrian.alert('Kesalahan tidak diketahui.','error');
    return;
  }
  if(res.match(/^error:/)){
    let err=message.hasOwnProperty(res)
      ?message[res]:'Kesalahan tidak diketahui.';
    _Pesantrian.alert(err,'error');
    return;
  }
  _Pesantrian.alert(res,'Perhatian: Kode ini hanya dapat digunakan sekali.','success');
};
this.cpass=(old)=>{
  Swal.fire({
    title:(old?'New':'Old')+' Password',
    text:'',
    input:'password',
    inputAttributes:{
      autocapitalize:'off',
      autocomplete:'off',
    },
    showCancelButton:true,
    cancelButtonText:'Cancel',
    confirmButtonText:old?'Proceed':'Next',
    confirmButtonColor:'#309695',
    showLoaderOnConfirm:true,
    allowOutsideClick:()=>!Swal.isLoading(),
    preConfirm:async (result)=>{
      if(old){
        let loader=_Pesantrian.loader(),
        message={
          'error:active':'User sudah tidak aktif.',
          'error:form':'Permintaan ilegal.',
          'error:user':'User tidak ditemukan.',
          'error:pass':'Kata sandi lama tidak sesuai.',
          'error:save':'Gagal menyimpan.',
        },
        query={
          old:old,
          npass:result,
        },
        res=await _Pesantrian.request('cpass',query);
        loader.remove();
        if(typeof res!=='string'){
          _Pesantrian.notif('Kesalahan tidak diketahui.','error');
          return;
        }
        if(res.match(/^error:/)){
          let err=message.hasOwnProperty(res)
            ?message[res]:'Kesalahan tidak diketahui.';
          _Pesantrian.notif(err,'error');
          return;
        }
        _Pesantrian.notif('Berhasil disimpan.');
        _Pesantrian.userData(false);
        _Pesantrian.user=null;
        setTimeout(async ()=>{
          await _Pesantrian.load('login.html');
        },1600);
      }else{
        this.cpass(result);
      }
    },
  });
};
this.profileFamily=function(keluarga){
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  row=this.row('NO','Nama','Keterangan');
  table.append(row);
  let nomor=1;
  for(let k in keluarga){
    let kel=keluarga[k];
    row=this.row(nomor,kel.nama,kel.keterangan);
    table.append(row);
    nomor++;
  }return table;
};
this.edit=()=>{
  let user=this.user,row,val,
  udata=_Pesantrian.parseJSON(this.user.data),
  integers=['children','siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time','position','live_in','management'],
  textonly=['name','id'],
  textarea=['address','profile'],
  table=this.table();
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(textonly.indexOf(key)>=0){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(textarea.indexOf(key)>=0){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.placeholder=alias+'...';
      ta.rows=key=='profile'?8:4;
      val=ta;
    }else if(key=='nationality'&&typeof NATIONS==='object'&&NATIONS!==null){
      let ts=document.createElement('select');
      for(let nation of NATIONS){
        let tso=document.createElement('option');
        tso.value=nation;
        tso.textContent=nation;
        if(nation==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='position'&&false){
      let ts=document.createElement('select');
      for(let pos in _Pesantrian.appNames){
        let poss=_Pesantrian.appNames.hasOwnProperty(pos)
          ?_Pesantrian.appNames[pos]:pos,
        tso=document.createElement('option');
        tso.value=pos;
        tso.textContent=poss;
        if(pos==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      val=ts;
    }else if(key=='gender'){
      val=_Pesantrian.radioGender(value);
    }else if(passes.indexOf(key)>=0){
      continue;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='height'){
        alias+=' (cm)';
      }
      if(key=='weight'){
        alias+=' (kg)';
      }
      val=ti;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.placeholder=alias+'...';
      ti.value=value;
      val=ti;
    }
    if(key!='gender'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.innerHTML='';
  this.app.body.append(table);
  /* keluarga */
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  let nomor=0,
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='text';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  row=this.row('Nama','Keterangan',tambah);
  table.append(row);
  if(false){
    alert(_Pesantrian.parser.likeJSON(udata,3));
  }
  for(let k in udata.keluarga){
    let kel=udata.keluarga[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='text';
    iket.type='text';
    inama.value=kel.nama;
    iket.value=kel.keterangan;
    inama.name='data[keluarga]['+nomor+'][nama]';
    iket.name='data[keluarga]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  this.app.body.append(table);
  /* button */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='update "'+_Pesantrian.user.type+'" ('
      +innerQuery+') where id='
      +_Pesantrian.user.profile_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query);
    loader.remove();
    _Pesantrian.notif(
      res?'Tersimpan':'Gagal disimpan.',
      res?'success':'error'
    );
    _Pesantrian.userData(false);
    setTimeout(()=>{
      _Pesantrian.loader();
      window.location.reload();
    },1600);
  };
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.profile=function(data){
  let table=this.table(),
  passes=['data','graduated','father_id','mother_id'];
  for(let key in data){
    let value=data[key],
    obj=this.parseJSON(value);
    if(passes.indexOf(key)>=0){
      continue;
    }else if(typeof obj==='object'||typeof value==='object'){
      let profile=this.profile(typeof obj==='object'?obj:value),
      row=this.row(key,profile);
      table.append(row);
    }else{
      let val=value,
      alias=this.alias(key);
      if(key=='gender'){
        let gspan=document.createElement('span');
        gspan.innerText=['Perempuan','Laki-laki'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='live_in'){
        let gspan=document.createElement('span');
        gspan.innerText=['Tidak','Ya'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='management'){
        let gspan=document.createElement('span');
        gspan.innerText=['Aisyah','Abu Bakar'][value];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+value);
        val=gspan;
      }else if(key=='height'){
        val=value+' cm';
      }else if(key=='weight'){
        val=value+' kg';
      }else if(key=='profile'){
        val=value.replace(/\n/g,'<br />');
      }else if(key=='photo_url'){
        val=value!=''
          ?'<a href="'+value+'" target="_blank">URL</a>':'';
      }else if(key=='position'){
        val=_Pesantrian.appNames.hasOwnProperty(value)
          ?_Pesantrian.appNames[value]:value;
      }else if(key=='time'){
        let date=new Date(value*1000),
        options={
          weekday:'long',
          year:'numeric',
          month:'long',
          day:'numeric',
        };
        val=date.toLocaleDateString('id-ID',options);
      }
      let row=this.row(alias,val);
      table.append(row);
    }
  }return table;
};
this.table=function(){
  let table=document.createElement('table'),
  tbody=document.createElement('tbody');
  table.classList.add('app-table');
  table.setAttribute('cellpadding','0px');
  table.setAttribute('cellspacing','0px');
  return table;
};
this.rowHead=function(text='',length=2){
  let tr=document.createElement('tr'),
  td=document.createElement('td');
  td.setAttribute('colspan',''+length+'');
  td.innerHTML=text;
  tr.append(td);
  tr.classList.add('trhead');
  return tr;
};
this.row=function(){
  let tr=document.createElement('tr');
  for(let tk in arguments){
    let td=document.createElement('td');
    if(typeof arguments[tk]==='object'){
      td.append(arguments[tk]);
    }else{
      td.innerHTML=''+arguments[tk]+'';
    }
    tr.append(td);
  }return tr;
};
this.parseJSON=function(data){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }return res;
};
return this.init();
};



/* PesantrianPDF -- require: jquery and jspdf */
;function PesantrianPDF(){
this.outer=true;
this.init=function(){
  return this;
};
this.createPDF=function(id,out='data'){
  out=typeof out==='string'?out:'data';
  var form=document.querySelector(id),
  a4=[595.28,841.89]; /* a4 paper size: width and height */
  form.scrollTo(0,0);
  /* get canvas object */
  let getCanvas=html2canvas(form,{
    imageTimeout:2000,
    removeContainer:true,
    height:form.offsetHeight,
  });
  /* create pdf */
  getCanvas.then(function(canvas){
    var img=canvas.toDataURL("image/png"),
    doc=new jsPDF({
      unit:'px',
      format:'a4',
    });
    doc.addImage(img,'PNG',20,20);
    doc.save(out+'.pdf');
  });
};
return this.init();
};


