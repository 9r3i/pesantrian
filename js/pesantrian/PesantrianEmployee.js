
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


