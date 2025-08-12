
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
  let host='https://hotelbandara.com/api/online/'
    +'?i='+_Pesantrian.user.id,
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


