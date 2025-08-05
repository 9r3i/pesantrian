
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


