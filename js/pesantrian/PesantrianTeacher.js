
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


