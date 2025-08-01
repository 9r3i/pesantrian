
/* PesantrianClinic */
;function PesantrianClinic(app){
this.app=app;
this.aliasData={
  name:'Nama Santri',
  checkin:'Jam Masuk',
  clinic_name:'Nama Klinik',
  doctor_name:'Nama Dokter',
  treatment:'Penanganan',
  cost:'Biaya',
  ailment:'Jenis Penyakit',
  level:'Tingkat Keparahan',
  medicine:'Obat yang diberikan',
  height:'Tinggi Badan',
  weight:'Berat Badan',
  date:'Tanggal Masuk',
  condition:'Kondisi',
  item_code:'Kode Barang',
  quantity:'Quantity',
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
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  
  let apps=[
    {
      name:'health',
      title:'Klinik',
      callback:function(e){
        _PesantrianClinic.tableClinic();
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
  window._PesantrianClinic=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* inventory */
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
    query='insert into "clinic_inventory" '+innerQuery,
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
    'select * from clinic_inventory',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('INVENTORY KLINIK',5),
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
        let query='delete from clinic_inventory where id='
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

/* clinic */
this.checkinEdit=function(students,data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableClinic(data.month,data.year);
    })
  );
  let table=this.table(),
  passes=['id','time','student_id','date','year','month','student_id'],
  hidden=[],
  integers=['cost','height','weight'],
  row,
  ptrn=/^\d{4}\-\d{2}\-\d{2}\ \d{2}:\d{2}$/;
  for(let key in data){
    let value=data[key],
    alias=this.alias(key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='name'){
      val=value;
    }else if(key=='checkout'){
      if(!data.checkout.match(ptrn)){
        continue;
      }
      alias='Check-Out';
      val=_Pesantrian.parseDatetime(value);
    }else if(key=='checkin'){
      alias='Check-In';
      val=_Pesantrian.parseDatetime(data.date+' '+value);
    }else if(data.checkout.match(ptrn)){
      val=value;
      if(key=='cost'){
        val=_Pesantrian.parseNominal(value);
      }else if(key=='weight'){
        val+=' kg';
      }else if(key=='height'){
        val+=' cm';
      }
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
      }else if(integers.indexOf(key)>=0){
        val.type='number';
      }
      if(key=='cost'){
        alias+=' (Rp)';
      }else if(key=='weight'){
        alias+=' (kg)';
      }else if(key=='height'){
        alias+=' (cm)';
      }
    }
    row=this.row(alias,val);
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
  if(!data.checkout.match(ptrn)){
    div.append(btn);
  }
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
    this.tableClinic(data.month,data.year);
  };
  let data_id=data.id,
  student_id=data.student_id;
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    hwQuery=_Pesantrian.buildQuery({
      height:data.height,
      weight:data.weight,
    }),
    queries=[
      'update "clinic" ('+innerQuery+') where id='+data_id,
      'update student ('+hwQuery+') where id='+student_id,
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
        await this.tableClinic();
      },1600);
    }
  };
};
this.checkin=function(students){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableClinic();
    })
  );
  let data=this.templateClinic(),
  table=this.table(),
  passes=['checkout'],
  hidden=['year','month','student_id'],
  integers=['cost','height','weight'],
  row;
  for(let key in data){
    let value=data[key],
    alias=this.alias(key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='name'){
      val=_Pesantrian.findSelect({
        data:students,
        key:key,
        value:value,
        placeholder:'Nama Santri...',
        callback:function(r){
          let sinput=document.querySelector('input[name="student_id"]'),
          sdata=_PesantrianClinic.getStudentData(r.id,students),
          presult=document.getElementById('finder-result-name'),
          sheight=document.querySelector('input[name="height"]'),
          sweight=document.querySelector('input[name="weight"]');
          if(presult){
            presult.value=r.name;
          }
          if(sinput){
            sinput.value=r.id;
          }
          if(sdata){
            if(sheight){
              sheight.value=sdata.height;
            }
            if(sweight){
              sweight.value=sdata.weight;
            }
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
      }else if(integers.indexOf(key)>=0){
        val.type='number';
      }else if(key=='checkin'){
        val.type='time';
      }else if(key=='date'){
        val.type='date';
      }
    }
    if(key=='cost'){
      alias+=' (Rp)';
    }else if(key=='height'){
      alias+=' (cm)';
    }else if(key=='weight'){
      alias+=' (kg)';
    }
    row=this.row(alias,val);
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
    this.tableClinic();
  };
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize();
    delete data.data;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    hwQuery=_Pesantrian.buildQuery({
      height:data.height,
      weight:data.weight,
    }),
    queries=[
      'insert into "clinic" '+innerQuery,
      'update student ('+hwQuery+') where id='+data.student_id,
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
        await this.tableClinic();
      },1600);
    }
  };
};
this.tableClinic=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=month?month:(new Date).getMonth();
  year=year?year:(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    _Pesantrian.user.privilege>=8
      ?'select id,name,graduated,height,weight from student where graduated=0'
      :'select id,name,graduated,height,weight,gender from student where graduated=0 and gender='+_Pesantrian.user.profile.management,
    'select * from clinic where year='+year+' and month='+month,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  lines=data[1],
  title='BUKU KLINIK <br />'+this.month[month]+' '+year,
  nomor=1,
  add=document.createElement('input'),
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('NO','Nama Santri','Tanggal Check-In',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Check-In';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.checkin(students);
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
  let smonth=document.createElement('select'),
  studyYear=this.getStudyYear().split('/'),
  months=[6,7,8,9,10,11,0,1,2,3,4,5];
  smonth.dataset.syear=this.getStudyYear();
  smonth.onchange=function(){
    let studyYear=this.dataset.syear.split('/'),
    year=this.value<6?studyYear[1]:studyYear[0];
    _PesantrianClinic.tableClinic(this.value,year);
  };
  for(let mon of months){
    let opt=document.createElement('option');
    opt.value=mon;
    opt.textContent=this.month[mon]+' '
      +(mon<6?studyYear[1]:studyYear[0]);
    if(mon==month){
      opt.selected='selected';
    }
    smonth.append(opt);
  }
  row=this.row('',find,'',smonth);
  table.append(row);
  for(let line of lines){
    let out=document.createElement('input'),
    ptrn=/^\d{4}\-\d{2}\-\d{2}\ \d{2}:\d{2}$/;
    out.type='submit';
    out.value='Check-Out';
    out.dataset.id=line.id;
    out.dataset.name=line.name;
    let aname=document.createElement('span');
    aname.classList.add('link-name');
    aname.innerText=line.name;
    aname.id='name-'+line.id;
    aname.dataset.data=JSON.stringify(line);
    aname.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      _PesantrianClinic.checkinEdit(students,data);
    };
    if(!line.checkout.match(ptrn)){
      out.classList.add('button-take');
      out.onclick=async function(){
        _Pesantrian.confirm('Check-Out Santri?',
          'Nama: '+this.dataset.name,
          async yes=>{
          if(!yes){return;}
          this.disabled=true;
          this.value='Memproses...';
          let hour=[
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
          ].join(':'),
          tgl=[
            (new Date).getFullYear(),
            ((new Date).getMonth()+1).toString().padStart(2,'0'),
            (new Date).getDate().toString().padStart(2,'0'),
          ].join('-'),
          loader=_Pesantrian.loader(),
          query='update clinic (checkout='+[tgl,hour].join(' ')
            +') where id='+this.dataset.id,
          res=await _Pesantrian.request('query',query);
          loader.remove();
          this.value='Selesai';
          this.classList.remove('button-take');
          this.classList.add('button-taken');
          let pname=document.querySelector('span#name-'+this.dataset.id);
          if(pname){
            let pdata=_Pesantrian.parseJSON(pname.dataset.data);
            pdata.checkout=[tgl,hour].join(' ');
            pname.dataset.data=JSON.stringify(pdata);
          }
        });
      };
    }else{
      out.disabled=true;
      out.classList.add('button-taken');
      out.value='Selesai';
    }
    let dtime=_Pesantrian.parseDatetime([
      line.date,line.checkin
    ].join(' '));
    row=this.row(nomor,aname,dtime,out);
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    table.append(row);
    nomor++;
  }
  this.app.body.append(table);
};
this.templateClinic=()=>{
  return {
    name:'', 
    student_id:0,
    checkin:[
          (new Date).getHours().toString().padStart(2,'0'),
          (new Date).getMinutes().toString().padStart(2,'0'),
        ].join(':'),
    checkout:'',
    clinic_name:'',
    doctor_name:'',
    treatment:'',
    cost:0,
    ailment:'',
    level:'',
    medicine:'',
    height:0,
    weight:0,
    date:[
          (new Date).getFullYear(),
          ((new Date).getMonth()+1).toString().padStart(2,'0'),
          (new Date).getDate().toString().padStart(2,'0'),
        ].join('-'),
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
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
this.getStudentData=function(id,data){
  data=Array.isArray(data)?data:[];
  let res=false;
  for(let i of data){
    if(i.id==id){
      res=i;
      break;
    }
  }return res;
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


