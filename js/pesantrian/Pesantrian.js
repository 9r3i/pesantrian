
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
  value:334,
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
  let url='https://hotelbandara.com/api/script/?id='+this.user.id,
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
  key='AAAAME_5tzA:APA91bEaFJ13Z9mP9ZIl1m7I2RqhzeyNFp9BZ3dRR3P2Ckz-7FT61xekAYLDFz7FVpZdvi0YMQfetVZCgcEqRagCk0nIXlsJ_1T376OLtIkyF4Ix_PigbZWtVuhSPyazl3ExfcWQvlH_',
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


