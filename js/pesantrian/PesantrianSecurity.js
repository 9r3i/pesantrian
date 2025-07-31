
/* PesantrianSecurity */
;function PesantrianSecurity(app){
this.app=app;
this.aliasData={
  plate:'Nomor Kendaraan',
  name:'Nama',
  student_id:'Wali dari',
  purpose:'Maksud/Tujuan',
  checkin:'Jam Masuk',
  checkout:'Jam keluar',
  courier:'Kurir',
  student:'Santri',
  employee:'Karyawan',
  type:'Status Pemilik',
  profile_id:'Nama Pemilik',
  report:'Keterangan',
  hour:'Jam Penerimaan',
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
this.courier=[
  'Shopee',
  'JNE',
  'JNT',
  'Anter Aja',
  'POS',
  'Cargo',
  'Lazada',
  'Ninja',
  'Lion Parcel',
  'Sicepat',
  'Dakota',
  'Lalamove',
];
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  let apps=[
    {
      name:'package',
      title:'Paket',
      callback:function(e){
        _PesantrianSecurity.tablePackage();
      }
    },
    {
      name:'guest',
      title:'Tamu',
      callback:function(e){
        _PesantrianSecurity.tableGuest();
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
      await _Pesantrian.load('apps.html');
    })
  );
  /* put the object to global scope */
  window._PesantrianSecurity=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

this.addPackage=function(employees,students,year,month){
  this.clearBody();
  let data=this.templatePackage(),
  table=this.table(),
  passes=['given'],
  hidden=['year','month','name'],
  row;
  for(let key in data){
    let value=data[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='type'){
      val=_Pesantrian.radioSanKar(value);
      val.classList.add('margin-up');
    }else if(key=='profile_id'){
      val=_Pesantrian.findSelect({
        id:'profile_id',
        data:students,
        key:key,
        value:value,
        placeholder:'Nama Pemilik...',
        callback:function(r){},
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.name='name';
    }else if(key=='courier'){
      let ts=document.createElement('select');
      for(let kur of this.courier){
        let opt=document.createElement('option');
        opt.value=kur;
        opt.textContent=kur;
        if(value==kur){
          opt.selected='selected';
        }
        ts.append(opt);
      }
      ts.name=key;
      ts.classList.add('margin-up');
      val=ts;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      ti.name=key;
      ti.classList.add('extra-high');
      ti.setAttribute('autocomplete','off');
      val=ti;
      if(hidden.indexOf(key)>=0){
        val.type='hidden';
        this.app.body.append(val);
        continue;
      }else if(key=='hour'){
        val.type='time';
      }
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  this.app.body.append(table);
  /* type for profile_id */
  let itypes=document.querySelectorAll('input[name="type"]');
  for(let i=0;i<itypes.length;i++){
    let itype=itypes[i];
    itype.onchange=function(){
      pid=document.getElementById('profile_id'),
      parent=pid.parentNode,
      val=_Pesantrian.findSelect({
        id:'profile_id',
        data:this.value=='employee'?employees:students,
        key:'profile_id',
        value:0,
        placeholder:'Nama Pemilik...',
        callback:function(r){},
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.name='name';
      parent.innerHTML='';
      parent.append(val);
    };
  }
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
    this.tablePackage();
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tablePackage();
    })
  );
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "package" '+innerQuery,
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
        await this.tablePackage();
      },1600);
    }
  };
};
this.tablePackage=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  year=year?year:(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let loader=_Pesantrian.loader(),
  queries=[
    'select id,name from employee',
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated from student where graduated=0'
      :'select id,name,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from package where year='+year+' and month='+month
      +' ORDER BY id DESC',
  ].join(';'),
  table=this.table(),
  title='BUKU PENERIMAAN PAKET<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  add=document.createElement('input'),
  back=document.createElement('input'),
  data=await _Pesantrian.request('queries',queries),
  employees=data[0],
  students=data[1],
  packages=data[2];
  nomor=packages.length,
  loader.remove();
  table.append(row);
  /* buttons */
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addPackage(employees,students,year,month);
  };
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-delete');
  back.onclick=()=>{
    this.init();
  };
  row=this.row('NO','Nama Pemilik','Tgl','Jam',this.alias('courier'),add);
  row.classList.add('tr-head');
  table.append(row);
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
  let prev='';
  if(month==(new Date).getMonth()){
    let pmonth=month==0?11:(month-1),
    pyear=month==0?year-1:year;
    prev=document.createElement('input');
    prev.type='submit';
    prev.value='Bulan Lalu';
    prev.classList.add('button-view');
    prev.dataset.month=pmonth;
    prev.dataset.year=pyear;
    prev.onclick=async function(){
      await _PesantrianSecurity.tablePackage(
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
  }else{
    let pmonth=month==11?0:(month+1),
    pyear=month==11?year+1:year;
    prev=document.createElement('input');
    prev.type='submit';
    prev.value='Bulan Ini';
    prev.classList.add('button-view');
    prev.dataset.month=pmonth;
    prev.dataset.year=pyear;
    prev.onclick=async function(){
      await _PesantrianSecurity.tablePackage(
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
  }
  row=this.row('',find,'','','',prev);
  table.append(row);
  /* table */
  for(let pack of packages){
    let out=document.createElement('input');
    out.type='submit';
    out.value='Serahkan';
    out.dataset.id=pack.id;
    out.dataset.type=this.alias(pack.type);
    out.dataset.name=pack.name;
    if(pack.given==0){
      out.classList.add('button-take');
      out.onclick=async function(){
        _Pesantrian.confirm('Serahkan paket?',
          'Kepada: '+this.dataset.name
          +' ('+this.dataset.type+')',
          async yes=>{
          if(!yes){return;}
          this.disabled=true;
          this.value='Memproses...';
          let loader=_Pesantrian.loader(),
          query='update package (given=1)'
            +' where id='+this.dataset.id,
          res=await _Pesantrian.request('query',query);
          loader.remove();
          this.value='Selesai';
          this.classList.remove('button-take');
          this.classList.add('button-taken');
        });
      };
    }else{
      out.disabled=true;
      out.classList.add('button-taken');
      out.value='Selesai';
    }
    row=this.row('<div class="tag-pack tag-pack-'
      +(pack.type=='employee'?'1':'0')
      +'">'+nomor+'</div> ',
      pack.name+'<br />'+pack.report,
      (new Date(pack.time*1000)).getDate(),
      pack.hour,
      pack.courier,
      out);
    row.dataset.name=pack.name;
    row.dataset.type=pack.type;
    table.append(row);
    nomor--;
  }
  this.app.body.append(table);
};
this.templatePackage=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth();
  return {
    type:'student',
    profile_id:0,
    name:'',
    hour:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    month:month,
    year:year,
    courier:'',
    report:'',
  };
};

this.addGuest=function(parents,students,year,month){
  this.clearBody();
  let data=this.templateGuest(),
  table=this.table(),
  passes=['checkout'],
  hidden=['year','month'],
  row;
  for(let key in data){
    let value=data[key],
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='name'){
      val=_Pesantrian.findSelect({
        data:parents,
        key:key,
        value:value,
        placeholder:'Nama Tamu...',
        callback:function(r){
          r.main.slave.result=r.name;
          let sinput=document.getElementById('finder-input-student_id'),
          sresult=document.getElementById('finder-result-student_id'),
          student=_PesantrianSecurity.getStudentData(r.id,students),
          pinput=document.getElementById('finder-input-name'),
          presult=document.getElementById('finder-result-name');
          if(sinput&&student){
            sinput.value=student.name;
          }
          if(student&&sresult){
            sresult.value=student.id;
          }
          if(presult&&pinput){
            presult.value=pinput.value;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
      val.slave.input.addEventListener('keyup',function(){
        let res=document.getElementById('finder-result-name');
        if(res){
          res.value=this.value;
        }
      },false);
    }else if(key=='student_id'){
      val=_Pesantrian.findSelect({
        data:students,
        key:key,
        value:value,
        placeholder:'Wali dari...',
        callback:function(r){
          let pinput=document.getElementById('finder-input-name'),
          presult=document.getElementById('finder-result-name'),
          student=_Pesantrian.getDataFromID(r.id,students),
          father_name=_PesantrianSecurity.getFatherName(student?student.father_id:0,parents);
          if(father_name&&pinput&&presult){
            pinput.value=father_name;
            presult.value=father_name;
          }
        },
      });
      val.slave.input.classList.add('extra-high');
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      ti.name=key;
      ti.classList.add('extra-high');
      ti.setAttribute('autocomplete','off');
      val=ti;
      if(hidden.indexOf(key)>=0){
        val.type='hidden';
        this.app.body.append(val);
        continue;
      }else if(key=='plate'){
        val.onkeyup=function(){
          this.value=this.value.toUpperCase();
        };
      }else if(key=='checkin'){
        val.type='time';
      }
    }
    row=this.row(this.alias(key),val);
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
    this.tableGuest();
  };
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableGuest();
    })
  );
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "guest" '+innerQuery,
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
        await this.tableGuest();
      },1600);
    }
  };
  
};
this.tableGuest=async function(){
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
    'select id,name,plate from parent',
    _Pesantrian.user.privilege>=8
      ?'select id,name,father_id,mother_id,graduated from student where graduated=0'
      :'select id,name,father_id,mother_id,graduated,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from guest where year='+year+' and month='+month
      +' ORDER BY id DESC',
  ].join(';'),
  table=this.table(),
  title='BUKU TAMU<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,6),
  add=document.createElement('input'),
  back=document.createElement('input'),
  data=await _Pesantrian.request('queries',queries),
  parents=data[0],
  students=data[1],
  guests=data[2];
  nomor=guests.length,
  loader.remove();
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addGuest(parents,students,year,month);
  };
  back.type='submit';
  back.value='Kembali';
  back.classList.add('button-delete');
  back.onclick=()=>{
    this.init();
  };
  row=this.row('NO','Nama Tamu','Tgl','In','Out',add);
  row.classList.add('tr-head');
  table.append(row);
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
  row=this.row('',find,'','','','');
  table.append(row);
  for(let guest of guests){
    let parentOf='',
    sdata=this.getData(guest.student_id,students);
    if(sdata){
      parentOf='Wali dari '+sdata.name;
    }
    let out=document.createElement('input');
    out.type='submit';
    out.value='Keluar';
    out.dataset.id=guest.id;
    out.dataset.plate=parentOf;
    out.dataset.name=guest.name;
    if(!guest.checkout.match(/^\d+:\d+$/)){
      out.classList.add('button-take');
      out.onclick=async function(){
        _Pesantrian.confirm('Tamu keluar?',
          'Tamu: '+this.dataset.name
          +' ('+this.dataset.plate+')',
          async yes=>{
          if(!yes){return;}
          this.disabled=true;
          this.value='Memproses...';
          let hour=[
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
          ].join(':'),
          rowid=document.getElementById('row-'+this.dataset.id),
          loader=_Pesantrian.loader(),
          query='update guest (checkout='+hour
            +') where id='+this.dataset.id,
          res=await _Pesantrian.request('query',query);
          loader.remove();
          this.value='Selesai';
          this.classList.remove('button-take');
          this.classList.add('button-taken');
          rowid.childNodes[4].innerText=hour;
        });
      };
    }else{
      out.disabled=true;
      out.classList.add('button-taken');
      out.value='Selesai';
    }
    row=this.row(nomor,
      guest.name+'<br />'+parentOf+'<br /><em>'
        +guest.purpose+'</em>',
      (new Date(guest.time*1000)).getDate(),
      guest.checkin,
      guest.checkout,
      out);
    row.dataset.name=guest.name+' '+parentOf;
    row.dataset.plate=guest.plate;
    row.id='row-'+guest.id;
    table.append(row);
    nomor--;
  }
  this.app.body.append(table);
};
this.templateGuest=function(){
  let year=(new Date).getFullYear(),
  month=(new Date).getMonth();
  return {
    name:'',
    month:month,
    year:year,
    student_id:0,
    purpose:'',
    checkin:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    checkout:'',
    plate:'',
  };
};

this.getData=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
};
this.getStudentData=function(father_id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.father_id==father_id||i.mother_id==father_id){
      res=i;
      break;
    }
  }return res;
};
this.getFatherName=function(father_id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==father_id){
      res=i.name;
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


