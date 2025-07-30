
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


