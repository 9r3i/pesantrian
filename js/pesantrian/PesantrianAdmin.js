
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


