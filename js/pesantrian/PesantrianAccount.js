
/* PesantrianAccount */
;function PesantrianAccount(app){
this.app=app;
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
  blood_group:'Golongan Darah',
  illness:'Penyakit Jasmani',
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
  salary:'Penghasilan per Bulan',
  plate:'Nomor Kendaraan',
  live_in:'Tinggal di Asrama',
  profile:'Profile',
  photo_url:'URL Photo',
  management:'Pengelolaan',
  accepted_at:'Diterima tanggal',
  school_name:'Nama Sekolah',
  family_status:'Status Keluarga',
  item_code:'Kode Barang',
  child_order:'Anak ke',
  nis:'NIS',
  nisn:'NISN',
};
this.init=async function(){
  this.app.menuButton.remove();
  let user;
  if(_Pesantrian.user.profile){
    user=_Pesantrian.user.profile;
  }else{
    let loader=_Pesantrian.loader(),
    query='select * from "'
      +_Pesantrian.user.type+'" where id='
      +_Pesantrian.user.profile_id,
    data=await _Pesantrian.request('query',query);
    loader.remove();
    user=Array.isArray(data)&&data[0]?data[0]:{};
    _Pesantrian.user.profile=user;
  }
  this.app.body.innerHTML='';
  this.app.title.innerText=user.name;
  this.user=user;
  let table=this.profile(user),
  tblank=this.row('.','.'),
  udata=this.parseJSON(user.data),
  tdata=this.profileFamily(udata.keluarga);
  table.append(tblank);
  this.app.body.append(table);
  this.app.body.append(tdata);
  /* input */
  let div=document.createElement('div'),
  btn=document.createElement('input'),
  rst=document.createElement('input'),
  edit=document.createElement('input'),
  cpass=document.createElement('input'),
  brow=document.createElement('input'),
  logas=document.createElement('input'),
  qrscan=document.createElement('input');
  btn.type='submit';
  btn.value='Logout';
  rst.type='submit';
  rst.value='Reset';
  edit.type='submit';
  edit.value='Edit';
  cpass.type='submit';
  cpass.value='Change Password';
  brow.type='submit';
  brow.value='Get Code';
  qrscan.type='submit';
  qrscan.value='ScanQR';
  logas.type='submit';
  logas.value='Reverse';
  /* logout */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    div.append(btn);
  }
  /* reset */
  div.append(rst);
  /* edit */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    if(_Pesantrian.user.privilege>=4){
      div.append(edit);
    }
  }
  /* change password */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    div.append(cpass);
  }
  /* browser */
  if(_Pesantrian.user.hasOwnProperty('browser')
    &&_Pesantrian.user.browser==true){
    div.append(brow);
    brow.value='End Browser Session';
  }
  /* qrscan */
  if(!_Pesantrian.user.hasOwnProperty('browser')
    ||(_Pesantrian.user.hasOwnProperty('browser')&&_Pesantrian.user.browser==false)){
    div.append(qrscan);
  }
  /* login as */
  if(_Pesantrian.user.hasOwnProperty('loginas')&&_Pesantrian.user.loginas==true){
    div.append(logas);
  }
  /* --- */
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=function(){
    _Pesantrian.logout();
  };
  rst.onclick=function(){
    _Pesantrian.reset();
  };
  edit.onclick=()=>{
    this.edit();
  };
  cpass.onclick=()=>{
    this.cpass();
  };
  brow.onclick=()=>{
    this.brow();
  };
  qrscan.onclick=()=>{
    this.qrScan();
  };
  logas.onclick=()=>{
    window.location.reload();
  };
  /* put the object to global scope */
  window._PesantrianAccount=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};
this.qrScan=async function(perm=false){
  if(!perm&&typeof QRScanner==='object'&&QRScanner!==null){
    QRScanner.prepare((e,s)=>{
      if(e||!s.authorized){
        return _Pesantrian.alert('Error: Has no camera access!','','error');
      }
      this.qrScan(true);
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
  button.classList.add('button-take');
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
    if(!result.data.match(/^otp_/)){
      return _Pesantrian.alert('Error: Invalid QRCode!',result.data,'error');
    }
    let loader=_Pesantrian.loader(),
    udata=_Pesantrian.userData();
    udata.profile.data='';
    udata.profile.profile='';
    udata.browser=true;
    let adata={
      appname:'pesantrian',
      apphost:_Pesantrian.appHost,
      token:result.data,
      userdata:JSON.stringify(udata),
    },
    host='https://9r3i.web.id/',
    query='?give='+result.data+'&data='+btoa(JSON.stringify(adata)),
    data=await fetch(host+query,{mode:'cors'}).then(r=>r.text()),
    res=_Pesantrian.parseJSON(data);
    loader.remove();
    if(res&&!res.toString().match(/^error/)){
      return _Pesantrian.alert('Successfully logged in to browser!','','success');
    }
    return _Pesantrian.alert('Error: Failed to login!',res,'error');
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  /* start scanning */
  button.scanner.start();
};
this.brow=async ()=>{
  if(_Pesantrian.user.hasOwnProperty('browser')
    &&_Pesantrian.user.browser==true){
    _Pesantrian.confirm('End Browser Session?','',yes=>{
      if(yes){
        _Pesantrian.userData(false);
        _Pesantrian.user=null;
        _Pesantrian.clearNotification();
        _Pesantrian.setCookie('app_code','',-1);
        localStorage.clear();
        let loader=_Pesantrian.loader();
        setTimeout(async ()=>{
          window.location.reload();
          loader.remove();
        },1000);
      }
    });
    return;
  }
  let loader=_Pesantrian.loader(),
  message={
    'error:active':'User sudah tidak aktif.',
    'error:form':'Permintaan ilegal.',
    'error:user':'User tidak ditemukan.',
    'error:create':'Gagal membuat kode.',
    'error:update':'Gagal meminta kode.',
  },
  res=await _Pesantrian.request('brow',{
    agent:navigator.userAgent,
  });
  loader.remove();
  if(typeof res!=='string'){
    _Pesantrian.alert('Kesalahan tidak diketahui.','error');
    return;
  }
  if(res.match(/^error:/)){
    let err=message.hasOwnProperty(res)
      ?message[res]:'Kesalahan tidak diketahui.';
    _Pesantrian.alert(err,'error');
    return;
  }
  _Pesantrian.alert(res,'Perhatian: Kode ini hanya dapat digunakan sekali.','success');
};
this.cpass=(old)=>{
  Swal.fire({
    title:(old?'New':'Old')+' Password',
    text:'',
    input:'password',
    inputAttributes:{
      autocapitalize:'off',
      autocomplete:'off',
    },
    showCancelButton:true,
    cancelButtonText:'Cancel',
    confirmButtonText:old?'Proceed':'Next',
    confirmButtonColor:'#309695',
    showLoaderOnConfirm:true,
    allowOutsideClick:()=>!Swal.isLoading(),
    preConfirm:async (result)=>{
      if(old){
        let loader=_Pesantrian.loader(),
        message={
          'error:active':'User sudah tidak aktif.',
          'error:form':'Permintaan ilegal.',
          'error:user':'User tidak ditemukan.',
          'error:pass':'Kata sandi lama tidak sesuai.',
          'error:save':'Gagal menyimpan.',
        },
        query={
          old:old,
          npass:result,
        },
        res=await _Pesantrian.request('cpass',query);
        loader.remove();
        if(typeof res!=='string'){
          _Pesantrian.notif('Kesalahan tidak diketahui.','error');
          return;
        }
        if(res.match(/^error:/)){
          let err=message.hasOwnProperty(res)
            ?message[res]:'Kesalahan tidak diketahui.';
          _Pesantrian.notif(err,'error');
          return;
        }
        _Pesantrian.notif('Berhasil disimpan.');
        _Pesantrian.userData(false);
        _Pesantrian.user=null;
        setTimeout(async ()=>{
          await _Pesantrian.load('login.html');
        },1600);
      }else{
        this.cpass(result);
      }
    },
  });
};
this.profileFamily=function(keluarga){
  table=this.table();
  row=this.rowHead('KELUARGA',3);
  table.append(row);
  row=this.row('NO','Nama','Keterangan');
  table.append(row);
  let nomor=1;
  for(let k in keluarga){
    let kel=keluarga[k];
    row=this.row(nomor,kel.nama,kel.keterangan);
    table.append(row);
    nomor++;
  }return table;
};
this.edit=()=>{
  let user=this.user,row,val,
  udata=_Pesantrian.parseJSON(this.user.data),
  integers=['children','siblings','weight','height'],
  gender=['Perempuan','Laki-laki'],
  passes=['time','position','live_in','management'],
  textonly=['name','id'],
  textarea=['address','profile'],
  table=this.table();
  for(let key in user){
    let value=user[key],
    alias=this.alias(key);
    if(textonly.indexOf(key)>=0){
      val=value;
    }else if(key=='data'){
      continue;
    }else if(textarea.indexOf(key)>=0){
      let ta=document.createElement('textarea');
      ta.value=value;
      ta.placeholder=alias+'...';
      ta.rows=key=='profile'?8:4;
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
    }else if(key=='position'&&false){
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
      ti.placeholder=alias+'...';
      ti.value=value;
      val=ti;
    }
    if(key!='gender'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.innerHTML='';
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
  if(false){
    alert(_Pesantrian.parser.likeJSON(udata,3));
  }
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
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data=_Pesantrian.formSerialize(),
    innerQuery=_Pesantrian.buildQuery(data),
    query='update "'+_Pesantrian.user.type+'" ('
      +innerQuery+') where id='
      +_Pesantrian.user.profile_id,
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('query',query);
    loader.remove();
    _Pesantrian.notif(
      res?'Tersimpan':'Gagal disimpan.',
      res?'success':'error'
    );
    _Pesantrian.userData(false);
    setTimeout(()=>{
      _Pesantrian.loader();
      window.location.reload();
    },1600);
  };
};
this.alias=function(key){
  return this.aliasData.hasOwnProperty(key)
    ?this.aliasData[key]:key;
};
this.profile=function(data){
  let table=this.table(),
  passes=['data','graduated','father_id','mother_id'];
  for(let key in data){
    let value=data[key],
    obj=this.parseJSON(value);
    if(passes.indexOf(key)>=0){
      continue;
    }else if(typeof obj==='object'||typeof value==='object'){
      let profile=this.profile(typeof obj==='object'?obj:value),
      row=this.row(key,profile);
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
  }return table;
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


