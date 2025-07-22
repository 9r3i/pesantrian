
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
        _PesantrianDormitory.tableTeam();
      }
    },
    {
      name:'form2',
      title:'Rekap',
      callback:function(e){
        _PesantrianDormitory.recapValue();
      }
    },
    {
      name:'form',
      title:'Absensi',
      callback:function(e){
        _PesantrianDormitory.teamPresence();
      }
    },
    {
      name:'form5',
      title:'Semester',
      callback:function(e){
        _PesantrianDormitory.semesterTeamForm();
      }
    },
    {
      name:'form4',
      title:'Subjektif',
      callback:function(e){
        _PesantrianDormitory.subjectiveTeamForm();
      }
    },
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
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianDormitory.presenceScanner();
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