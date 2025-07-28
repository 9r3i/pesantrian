
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
    }
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


