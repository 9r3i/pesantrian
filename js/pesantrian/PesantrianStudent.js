
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


