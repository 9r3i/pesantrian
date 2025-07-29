
/* PesantrianFinance */
;function PesantrianFinance(app){
this.app=app;
this.aliasData={
  id:'Nomor Transaksi',
  method:'Arus Dana',
  name:'Jenis Transaksi',
  petty_cash:'Petty Cash',
  donation:'Donasi',
  register:'Pendaftaran',
  contribution:'SPP',
  saving:'Tabungan',
  infaq:'Infaq',
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
  register_test:'Pendaftaran Test PPDB',
  register_test_smp:'Pendaftaran Test PPDB SMP',
  register_test_sma:'Pendaftaran Test PPDB SMA',
  register_sma_new:'Daftar Ulang Santri Baru SMA',
  register_sma_next:'Daftar Ulang Lanjutan SMA',
  register_smp:'Daftar Ulang Santri Baru SMP',
  register_annually:'Daftar Ulang Tahunan',
  school_event:'Event Sekolah',
  tahfidz_camp:'Tahfidz Camp',
  initial_fund:'Dana Awal',
  graduation:'Wisuda',
  tryout:'Tryout',
  tutoring:'Bimbel',
  ppm:'PPM-AATIBS',
  brooding:'Pengindukan',
  qrbill_shop:'QR-Shop',
  qrbill_laundry:'QR-Laundry',
  qrbill_penalty:'QR-Penalty',
  year:'Tahun',
  month:'Bulan',
  studentSPP:'SPP',
  studentSaving:'TABUNGAN',
  employeeSaving:'TABUNGAN',
  studentOther:'LAINNYA',
  studentSPPX:'EX-SPP',
  studentSavingX:'EX-TABUNGAN',
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
  studyYear:'Tahun Ajaran',
  debt:'Debet',
  credit:'Kredit',
};
this.studyMonths=[6,7,8,9,10,11,0,1,2,3,4,5];
this.normalMonths=[0,1,2,3,4,5,6,7,8,9,10,11];
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
this.monthLast=[6,7,8,9,10,11];
this.selection={
    name:[
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
      'infaq',
      'graduation',
      'tryout',
      'tutoring',
      'ppm',
      'brooding',
      'contribution',
      'saving',
      'qrbill_shop',
      'qrbill_laundry',
      'qrbill_penalty',
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
      'Aisyah - BSI 7164 540 558',
      'Abu Bakar - BSI 7164 457 715',
      'Donasi Aisyah - BSI 7164 541 066',
      'Donasi Abu Bakar - BSI 7164 458 584',
      'Bendahara - BSI 7134 2000 43',
      'Tunai',
    ],
    accountx:[
      'Aisyah - BSI 7164 540 558 a/n Yayasan Aisyah Mulya',
      'Abu Bakar - BSI 7164 457 715 a/n Yayasan Abu Bakar Mulya',
      'Donasi Aisyah - BSI 7164 541 066 a/n Yayasan Aisyah Mulya',
      'Donasi Abu Bakar - BSI 7164 458 584 a/n Yayasan Abu Bakar Mulya',
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
this.rincian={
  register_sma_new:{
    "1":{
      nominal:15000000,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:3150000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    },
    "6":{
      nominal:2500000,
      keterangan:'SPP Bulan July, biaya pendidikan, asrama, makan dan laundry.',
    }
  },
  register_sma_next:{
    "1":{
      nominal:0,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:3150000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    }
  },
  register_smp:{
    "1":{
      nominal:15000000,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:850000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    },
    "6":{
      nominal:2500000,
      keterangan:'SPP Bulan July, biaya pendidikan, asrama, makan dan laundry.',
    }
  },
  register_annually:{
    "1":{
      nominal:0,
      keterangan:'Wakaf Tunai',
    },
    "2":{
      nominal:3000000,
      keterangan:'Perlengkapan Santri, meliputi: Hak menggunakan ranjang, kasur, bantal, sprei, selimut, peralatan makan dan minum, peralatan mandi dan kebersihan, perlengkapan asrama.',
    },
    "3":{
      nominal:1650000,
      keterangan:'Bahan Seragam, meliputi: Baju batik + jilbab, olahraga, biru/abu, pramuka, bordir name tag dan logo ATIBS.',
    },
    "4":{
      nominal:850000,
      keterangan:'Bahan pembelajaran: Modul pelajaran diniyah dan ummu, buku tulis, tas sekolah, bimbingan belajar.',
    },
    "5":{
      nominal:2500000,
      keterangan:'Uang kegiatan tahunan santri: Kesehatan, Ekstrakurikuler* (yang wajib), Camping, Ujian semester, Event/Seminar, kegiatan tahfidz dan keasramaan.',
    }
  },
};
this.yearTransaction={
  '2022':'transaction_date > 2021-12-31 and transaction_date < 2023-01-01',
  '2023':'transaction_date > 2022-12-31 and transaction_date < 2024-01-01',
  '2024':'transaction_date > 2023-12-31 and transaction_date < 2025-01-01',
  '2025':'transaction_date > 2024-12-31 and transaction_date < 2026-01-01',
  '2026':'transaction_date > 2025-12-31 and transaction_date < 2027-01-01',
  '2027':'transaction_date > 2026-12-31 and transaction_date < 2028-01-01',
  '2028':'transaction_date > 2027-12-31 and transaction_date < 2029-01-01',
  '2029':'transaction_date > 2028-12-31 and transaction_date < 2030-01-01',
  '2030':'transaction_date > 2029-12-31 and transaction_date < 2031-01-01',
};
this.sppMax={
  7:2100000,
  8:2100000,
  9:2100000,
  10:2200000,
  11:2200000,
  12:2200000,
  27:2100000,
  28:2100000,
  29:2100000,
  30:2200000,
  31:2200000,
  32:2200000,
};

this.init=async function(){
  this.app.menuButton.remove();
  
  /* finance apps */
  let apps=[
    {
      name:'table',
      title:'Buku Besar',
      callback:function(e){
        _PesantrianFinance.tableTransaction();
      }
    },
    {
      name:'form2',
      title:'Form',
      callback:function(e){
        _PesantrianFinance.addTransaction(true);
      }
    },
    {
      name:'bill',
      title:'SPP',
      callback:function(e){
        _PesantrianFinance.tableStudent('studentSPP');
      }
    },
    {
      name:'form',
      title:'Tabungan',
      callback:function(e){
        _PesantrianFinance.tableStudent('studentSaving');
      }
    },
    {
      name:'form3',
      title:'Lainnya',
      callback:function(e){
        _PesantrianFinance.tableStudent('studentOther');
      }
    },
    {
      name:'finance',
      title:'Petty Cash',
      callback:function(e){
        _PesantrianFinance.pettyCash();
      }
    },
    {
      name:'extracurricular',
      title:'Beasiswa',
      callback:function(e){
        _PesantrianFinance.scholarship();
      }
    },
    {
      name:'shop2',
      title:'QR-Shop',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_shop');
      }
    },
    {
      name:'laundryx',
      title:'QR-Laundry',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_laundry');
      }
    },
    {
      name:'form7',
      title:'QR-Penalty',
      callback:function(e){
        _PesantrianFinance.qrBill('qrbill_penalty');
      }
    },
    {
      name:'transcript',
      title:'Blokir Kartu',
      callback:function(e){
        _PesantrianFinance.blockedCards();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianFinance.checkCredit();
      }
    },
    {
      name:'form6',
      title:'Tabungan Karyawan',
      callback:function(e){
        _PesantrianFinance.tableEmployee('employeeSaving');
      }
    },
    {
      name:'bill',
      title:'Ex-SPP',
      callback:function(e){
        _PesantrianFinance.tableStudentX('studentSPPX');
      }
    },
    {
      name:'form',
      title:'Ex-Tabungan',
      callback:function(e){
        _PesantrianFinance.tableStudentX('studentSavingX');
      }
    },
  ];
  if(_Pesantrian.user.profile.position!='finance'
    &&_Pesantrian.user.privilege<0x10){
    apps=[
      {
        name:'bill',
        title:'SPP',
        callback:function(e){
          _PesantrianFinance.tableStudent('studentSPP');
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
  window._PesantrianFinance=this;
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

/* scholarship */
this.scholarship=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from scholarship order by name asc',
    'select id,name,graduated from student where graduated=0',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  beas=datas[0],
  students=datas[1],
  row=this.rowHead('BEASISWA SPP',4),
  add=document.createElement('input'),
  table=this.table();
  loader.remove();
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    let aid='add-member',
    ael=document.getElementById(aid),
    sid=_Pesantrian.findSelect({
      id:'select-id',
      data:students,
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
    snominal=document.createElement('input');
    if(ael){return;}
    sname.name='name';
    sname.type='hidden';
    snominal.name='nominal';
    snominal.type='number';
    snominal.placeholder='Nominal...';
    ssave.type='submit';
    ssave.value='Simpan';
    ssave.classList.add('button-view');
    ssave.classList.add('extra-high');
    ssave.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      form=_Pesantrian.formSerialize();
      delete form.data;
      let innerQuery=_Pesantrian.buildQuery(form),
      query='insert into scholarship '+innerQuery,
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
          await this.scholarship();
        },1600);
      }
    };
    sdiv.append(snominal);
    sdiv.append(sname);
    row=this.row('',sid,sdiv,ssave);
    row.id=aid;
    if(table.childNodes.length>2){
      table.insertBefore(row,table.childNodes[2]);
    }else{
      table.append(row);
    }
  };
  row=this.row('ID','Nama Santri','Maksimal SPP',add);
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
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
  row=this.row('',find,'','');
  table.append(row);
  for(let item of beas){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.dataset.id=item.id;
    del.dataset.name=item.name;
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id),
      query='delete from scholarship where id='+id;
      _Pesantrian.confirm('Hapus beasiswa?',
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
    row=this.row(item.student_id,item.name,this.parseNominal(item.nominal),del);
    row.id=item.id;
    row.dataset.name=item.name;
    table.append(row);
  }
};

/* qr bill */
this.qrBill=async function(code){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let codes=[
    'qrbill_shop',
    'qrbill_laundry',
    'qrbill_penalty',
  ];
  if(codes.indexOf(code)<0){
    return _Pesantrian.alert('Error: Invalid code.','','error');
  }
  let loader=_Pesantrian.loader(),
  queries=[
    'select sum(nominal) as nominal,transaction_code from transaction where transaction_code="'+code+'"',
    'select * from transaction where name="'+code+'" order by transaction_date asc',
    'select id,name from employee',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  nominalTotal=parseInt(data[0][0].nominal,10),
  trans=data[1],
  employees=data[2],
  table=this.table(),
  total=0,
  add=document.createElement('input'),
  row=this.rowHead('QR Bill<br />Code: '+code,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* add */
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.qrBillForm(code,employees);
  };
  /* pre counting */
  row=this.row('','Total QRBill',
    _Pesantrian.parseNominal(nominalTotal),'');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
  /* header */
  row=this.row('Tanggal','Nama Penerima','Nominal',add);
  row.classList.add('tr-head');
  table.append(row);
  /* each */
  for(let d of trans){
    if(d.name!=code||d.method!=0){
      continue;
    }
    let dtime=_Pesantrian.parseDate(d.transaction_date),
    nominal=_Pesantrian.parseNominal(d.nominal),
    name=_Pesantrian.getValueByKey('id',d.profile_id,'name',employees),
    view=document.createElement('input'),
    check=document.createElement('div'),
    checkInput=document.createElement('input'),
    checkLabel=document.createElement('label'),
    row=this.row(dtime,name,nominal,view);
    row.childNodes[2].classList.add('td-right');
    table.append(row);
    view.type='submit';
    view.value='Detail';
    view.classList.add('button-detail');
    view.dataset.id=d.id+'';
    view.onclick=function(){
      _PesantrianFinance.detailTransaction(this.dataset.id);
    };
    total+=parseInt(d.nominal,10);
  }
  /* total given */
  let totalIDR=_Pesantrian.parseNominal(total);
  row=this.row('','Total Penyerahan ',totalIDR,'');
  row.classList.add('tr-head');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
  /* total deposit */
  let deposit=nominalTotal-total,
  depositIDR=_Pesantrian.parseNominal(deposit);
  row=this.row('','Sisa Deposit ',depositIDR,'');
  row.classList.add('tr-head');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
};
/* qr bill form */
this.qrBillForm=async function(code,employees=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.qrBill(code);
    })
  );
  let codes=[
    'qrbill_shop',
    'qrbill_laundry',
    'qrbill_penalty',
  ];
  if(codes.indexOf(code)<0){
    return _Pesantrian.alert('Error: Invalid code.','','error');
  }
  /* table and header */
  let table=this.table(),
  selection=this.selection,
  methods=['Keluar','Masuk'],
  passes=[],
  hidden=[
    'transaction_code','type','name',
    'year','month','uid','data',
  ],
  integers=['nominal','account'],
  trans={
    name:code,
    method:0,
    type:'employee',
    profile_id:0,
    nominal:0,
    transaction_code:code+'_paid',
    transaction_date:(new Date).getFullYear()+'-'
      +((new Date).getMonth()+1).toString().padStart(2,'0')+'-'
      +(new Date).getDate().toString().padStart(2,'0'),
    evidence:'',
    account:'Tunai',
    status:'paid',
    explanation:'Penyerahan dana '+code,
    uid:_Pesantrian.user.id,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    data:'{rincian:{}}',
  };
  row=this.rowHead('QR Bill Form<br />Code: '+code,4);
  table.append(row);
  this.app.body.append(table);
  /* form */
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:employees,
        placeholder:this.alias('employee')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  /* button save */
  let div=document.createElement('div'),
  btn=document.createElement('input');
  btn.type='submit';
  btn.value='Simpan';
  div.append(btn);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries.join(';')),
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
        await this.qrBill(code);
      },1600);
    }
  };
};


/* qr bill old */
this.qrBill___Old=async function(code){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let codes=[
    'qrbill_shop',
    'qrbill_laundry',
    'qrbill_penalty',
  ];
  if(codes.indexOf(code)<0){
    return _Pesantrian.alert('Error: Invalid code.','','error');
  }
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from transaction where transaction_code="'+code+'"',
    'select id,name from employee',
    'select id,name from student',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  types={
    employee:data[1],
    student:data[2],
  },
  table=this.table(),
  row=this.rowHead('QR Bill<br />Code: '+code,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* header */
  row=this.row('Date','Name','Nominal','Check');
  row.classList.add('tr-head');
  table.append(row);
  /* each */
  for(let d of data[0]){
    if(d.name!='saving'||d.method!=0){
      continue;
    }
    let dtime=_Pesantrian.parseDatetime(parseInt(d.time,10)*1000),
    nominal=_Pesantrian.parseNominal(d.nominal),
    name=_Pesantrian.getValueByKey('id',d.profile_id,'name',types[d.type]),
    check=document.createElement('div'),
    checkInput=document.createElement('input'),
    checkLabel=document.createElement('label'),
    row=this.row(dtime,name,nominal,check);
    table.append(row);
    check.append(checkInput);
    check.append(checkLabel);
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-center');
    checkInput.type='checkbox';
    checkInput.name='check';
    checkInput.id='check-'+d.id;
    checkInput.dataset.id=d.id+'';
    checkInput.dataset.nominal=d.nominal+'';
    checkLabel.classList.add('checkbox');
    checkLabel.innerText='+';
    checkLabel.setAttribute('for','check-'+d.id);
    checkInput.onchange=function(){
      let totalEl=document.getElementById('total'),
      total=0,
      checks=document.querySelectorAll('input[name="check"]');
      for(let i=0;i<checks.length;i++){
        let ci=checks[i];
        if(!ci.checked){continue;}
        total+=parseInt(ci.dataset.nominal,10);
      }
      totalEl.innerText=_Pesantrian.parseNominal(total);
    };
  }
  /* header */
  let totalIDR=_Pesantrian.parseNominal('0'),
  give=document.createElement('input');
  row=this.row('','Total',totalIDR,give);
  row.classList.add('tr-head');
  table.append(row);
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-center');
  row.childNodes[2].id='total';
  /* give */
  give.type='submit';
  give.value='Serahkan';
  give.classList.add('button-taken');
  give.dataset.code=code;
  give.onclick=async function(){
    let total=0,
    queries=[],
    code=this.dataset.code+'_paid',
    checks=document.querySelectorAll('input[name="check"]');
    for(let i=0;i<checks.length;i++){
      let ci=checks[i],
      id=ci.dataset.id;
      if(!ci.checked){continue;}
      total+=parseInt(ci.dataset.nominal,10);
      queries.push('update transaction (transaction_code='+code+') where id='+id);
    }
    let yes=await _Pesantrian.confirmX('Serahkan sekarang?','Total: '+_Pesantrian.parseNominal(total));
    if(!yes){return;}
    let loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries.join(';'));
    _PesantrianFinance.qrBill(this.dataset.code);
  };
};



/* qrscanner -- bill -- for infaq -- on development */
this.billScanner=async function(nominal,table){
  nominal=nominal||1;
  nominal=parseInt(nominal,10);
  if(!nominal.toString().match(/^\d+$/)
    ||nominal<1){
    return await _Pesantrian.alertX('Error: Invalid nominal input!','','error');
  }
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
    data={
      name:'saving',
      type,
      profile_id:student_id,
      method:0,
      nominal,
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
      explanation:'Belanja di Kantin',
      transaction_code:'qrbill_shop',
    },
    qrData={
      student_id,
      student_name,
      nominal,
      year,
      month,
      date,
    },
    queries=[
      'select * from transaction where type="'+type
        +'" and profile_id='
        +student_id+' and name="saving" and '
        +this.getQueryTA(),
      'select * from blocked_card where type="'+type
        +'" and profile_id='+student_id
        +' and year='+year
        +' and month='+month,
    ].join(';'),
    pdata=await _Pesantrian.request('queries',queries),
    saving=this.getSavingBalance(pdata[0]),
    blocked=pdata[1].length>0?true:false;
    if(blocked){
      loader.remove();
      return _Pesantrian.alert(
        'Error: Card is being blocked!',
        'Usually till the end of the month.',
        'error'
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
    /* real input */
    let innerQuery=_Pesantrian.buildQuery(data),
    qrInnerQuery=_Pesantrian.buildQuery(qrData),
    qrQuery='insert into shop_qrbill '+qrInnerQuery,
    query='insert into transaction '+innerQuery,
    res=await _Pesantrian.request('queries',[
      query,qrQuery
    ].join(';'));
    loader.remove();
    if(res.join('')==11){
        let row=this.row(
          'New Bill',
          student_name,
          _Pesantrian.parseNominal(nominal),
          [
            (new Date).getHours().toString().padStart(2,'0'),
            (new Date).getMinutes().toString().padStart(2,'0'),
            (new Date).getSeconds().toString().padStart(2,'0'),
          ].join(':'),
        ),
        lastRow=table.lastChild,
        total=parseInt(table.dataset.total,10)+nominal;
        row.childNodes[2].classList.add('td-right');
        lastRow.childNodes[2].innerText=_Pesantrian.parseNominal(total);
        table.insertBefore(row,lastRow);
        table.dataset.total=total+'';
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
this.billScannerForm=async function(){
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
  query='select * from shop_qrbill where year='+year+' and month='+month+' and date='+date,
  title='QRScan Bill<br />'+_Pesantrian.parseDate([
    year,
    (month+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-')),
  total=0,
  row=this.rowHead(title,4),
  table=this.table();
  table.append(row);
  /* nominal span */
  let nspan=document.createElement('span');
  nspan.innerText=_Pesantrian.parseNominal(0);
  /* nominal */
  let nominal=document.createElement('input');
  nominal.type='number';
  nominal.name='nominal';
  nominal.placeholder='Nominal...';
  nominal.span=nspan;
  nominal.onkeyup=function(){
    nspan.innerText=_Pesantrian.parseNominal(this.value);
  };
  /* button */
  button=document.createElement('input');
  button.type='submit';
  button.value='Scan';
  button.classList.add('button-take');
  button.onclick=()=>{
    if(!nominal.value.match(/^\d+$/)){
      return _Pesantrian.alert('Error: Invalid nominal input!','','error');
    }
    this.billScanner(nominal.value,table);
  };
  /* row */
  row=this.row('Nominal',nominal,nspan,button);
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  this.app.body.append(table);
  /* each bill */
  let bills=await _Pesantrian.request('query',query);
  row=this.row('Bill ID','Nama Santri','Nominal','Waktu');
  table.append(row);
  row.classList.add('tr-head');
  for(let bill of bills){
    let bd=new Date(bill.time*1000),
    row=this.row(
      bill.id,
      bill.student_name,
      _Pesantrian.parseNominal(bill.nominal),
      [
        bd.getHours().toString().padStart(2,'0'),
        bd.getMinutes().toString().padStart(2,'0'),
        bd.getSeconds().toString().padStart(2,'0'),
      ].join(':'),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    total+=parseInt(bill.nominal,10);
    table.append(row);
  }
  /* total */
  row=this.row('','Total',_Pesantrian.parseNominal(total),'');
  row.classList.add('tr-head');
  row.childNodes[2].classList.add('td-right');
  table.append(row);
  table.dataset.total=total+'';
};


/* blocked card */
this.blockedCards=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  year=year||(new Date).getFullYear();
  month=typeof month==='number'?month:(new Date).getMonth();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from blocked_card where year='
      +year+' and month='+month
      +' and type="student"',
    'select id,name,graduated,gender from student where graduated=0',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  table=this.table(),
  row=this.rowHead('BLOKIR KARTU<br />'
    +this.month[month]+' '+year,4);
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* header */
  row=this.row('ID','Nama Santri','Status','');
  row.childNodes[0].classList.add('td-center');
  row.classList.add('tr-head');
  table.append(row);
  /* find */
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
  row=this.row('',find,'','');
  table.append(row);
  /* each */
  let counter=0;
  for(let student of data[1]){
    counter++;
    let status=_Pesantrian.getValueByKey(
      'profile_id',
      student.id,
      'id',
      data[0],
    )||false,
    block=document.createElement('input'),
    spanid=document.createElement('span'),
    row=this.row(spanid,student.name,(status?'true':'false'),block);
    row.childNodes[0].classList.add('td-center');
    row.dataset.name=student.name;
    table.append(row);
    spanid.innerText=student.id;
    spanid.classList.add('gender');
    spanid.classList.add('gender-'+student.gender);
    block.type='submit';
    block.value=status?'Unblock':'Block';
    block.classList.add('button-take'+(status?'n':''));
    block.dataset.profile_id=student.id;
    block.dataset.status=status.toString();
    block.dataset.year=year;
    block.dataset.month=month;
    block.dataset.type='student';
    block.dataset.name=student.name;
    block.status=row.childNodes[2];
    block.onclick=async function(){
      let question=this.dataset.status=='false'
        ?'Block the card?'
        :'Unblock the card?',
      yes=await _Pesantrian.confirmX(question,this.dataset.name);
      if(!yes){return;}
      let loader=_Pesantrian.loader(),
      data={
        year:this.dataset.year,
        month:this.dataset.month,
        type:this.dataset.type,
        profile_id:this.dataset.profile_id,
        note:'Blocked by '+_Pesantrian.user.name,
      },
      query=this.dataset.status=='false'
        ?'insert into blocked_card '+_Pesantrian.buildQuery(data)
        :'delete from blocked_card where profile_id='
          +this.dataset.profile_id
          +' and type="'+this.dataset.type+'"',
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(this.dataset.status=='false'){
        this.dataset.status='true';
        this.value='Unblock';
        this.classList.remove('button-take');
        this.classList.add('button-taken');
        this.status.innerText='true';
      }else{
        this.dataset.status='false';
        this.value='Block';
        this.classList.remove('button-taken');
        this.classList.add('button-take');
        this.status.innerText='false';
      }
    };
  }
  /*
    result: ARRAY
            0: (aid) [id:10] => LDB_AID
            1: (time) [time:10] => LDB_TIME
            2: (int) [year:4] => "2024"
            3: (int) [month:2] => "0"
            4: (string) [type:20] => "student"
            5: (int) [profile_id:10] => "0"
            6: (string) [note:100] => LDB_BLANK
  */
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
this.getFinanceByTypeX=function(data,type){
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
  return res.hasOwnProperty(type)?res[type]:[];
};



/* report */
this.laundryReport=function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let studyYear=this.getStudyYear().split('/'),
  row=this.rowHead('LAPORAN LAUNDRY <br />Tahun Ajaran '
    +studyYear.join('/'),2),
  table=this.table();
  table.append(row);
  for(let i of this.studyMonths){
    let see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.dataset.month=''+i;
    see.dataset.year=(i<6?studyYear[1]:studyYear[0]);
    see.onclick=function(){
      _PesantrianFinance.laundryReportMonthly(this.dataset.month,this.dataset.year);
    };
    row=this.row(this.month[i]+' '
      +(i<6?studyYear[1]:studyYear[0]),see);
    table.append(row);
  }
  this.app.body.append(table);
};
this.laundryReportMonthly=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.laundryReport();
    })
  );
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from laundry where month='+month+' and year='+year,
    'select id,name,graduated from student where graduated=0',
    'select id,name,live_in from employee where live_in=1',
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  laundries=datas[0],
  students=datas[1],
  employees=datas[2],
  row=this.rowHead('SUBSIDI LAUNDRY KARYAWAN<br />'
    +this.month[month]+' '+year,3),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('ID','Nama Karyawan','Saldo Subsidi');
  row.classList.add('tr-head');
  table.append(row);
  for(let user of employees){
    let credit=this.getCredit(user.id,laundries,'employee'),
    saldo=document.createElement('span');
    saldo.innerText=_Pesantrian.parseNominal(credit);
    saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
    saldo.id='credit-'+user.id;
    row=this.row(user.id,user.name,saldo);
    row.dataset.name=user.name;
    table.append(row);
  }
  this.app.body.append(table);
  table=this.table();
  row=this.rowHead('TAGIHAN LAUNDRY SANTRI<br />'
    +this.month[month]+' '+year,3);
  table.append(row);
  row=this.row('ID','Nama Santri','Total Tagihan');
  row.classList.add('tr-head');
  table.append(row);
  for(let user of students){
    let credit=this.getCredit(user.id,laundries,'student'),
    saldo=document.createElement('span');
    if(credit>=0){
      continue;
    }
    saldo.innerText=_Pesantrian.parseNominal(credit);
    saldo.classList.add(credit>=0?'credit-plus':'credit-minus');
    saldo.id='credit-'+user.id;
    row=this.row(user.id,user.name,saldo);
    row.dataset.name=user.name;
    table.append(row);
  }
  this.app.body.append(table);
};


/* petty_cash */
this.pettyCash=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let studyYear=this.getStudyYear().split('/'),
  see,
  row=this.rowHead('PETTY CASH <br />Tahun Ajaran '
    +studyYear.join('/'),2),
  table=this.table();
  table.append(row);
  for(let i of this.studyMonths){
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.dataset.month=''+i;
    see.dataset.year=(i<6?studyYear[1]:studyYear[0]);
    see.onclick=function(){
      _PesantrianFinance.pettyCashMonthly(this.dataset.month,this.dataset.year);
    };
    row=this.row(this.month[i]+' '
      +(i<6?studyYear[1]:studyYear[0]),see);
    table.append(row);
  }
  this.app.body.append(table);
  /* all in studyYear */
    see=document.createElement('input');
    see.type='submit';
    see.value='Lihat';
    see.classList.add('button-take');
    see.onclick=function(){
      _PesantrianFinance.pettyCashMonthly();
    };
  row=this.row('Tahun Ajaran '+studyYear.join('/'),see);
  table.append(row);
  
};
this.pettyCashMonthly=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.pettyCash();
    })
  );
  
  let studyYear=this.getStudyYear().split('/'),
  yearMin=studyYear[0]+'-06-30',
  yearMax=studyYear[1]+'-07-01',
  query='select * from transaction where name="petty_cash"';
  
  if(month&&year){
    query+=' and month='+month+' and year='+year;
  }else{
    query+=' and date > "'+yearMin+'" and date < "'+yearMax+'"';
  }
  let loader=_Pesantrian.loader(),
  queries=[
      query
    ].join(';');
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  title='PETTY CASH<br />'
    +(month&&year?'Bulan '+this.month[month]+' '+year
      :'Tahun Ajaran '+studyYear.join('/')),
  row=this.rowHead(title,6),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Tgl','No. Kwitansi','Keterangan','Kredit','Debet',add);
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='PettyForm';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.pettyCashForm(month,year);
  };
  let totalPlus=0,
  totalMinus=0;
  
  for(let item of items){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=''+item.id;
    del.dataset.name=''+item.name;
    del.dataset.method=item.method+'';
    del.dataset.nominal=item.nominal+'';
    del.onclick=function(){
      let el=document.getElementById('item-'+this.dataset.id),
      tot=document.querySelector('tr#shop-total'),
      tel=document.querySelector('table#shop');
      if(!el||!tel){return;}
      _Pesantrian.confirm('Hapus barang?',
        this.dataset.name,async (yes)=>{
        if(!yes){return;}
        this.value='Menghapus...';
        this.disabled=true;
        let query='delete from transaction where id='
          +this.dataset.id,
        totalPlus=parseInt(tel.dataset.plus),
        totalMinus=parseInt(tel.dataset.minus),
        nominal=parseInt(this.dataset.nominal),
        method=parseInt(this.dataset.method),
        res=await _Pesantrian.request('query',query);
        if(method==1){
          totalPlus-=nominal;
        }else{
          totalMinus-=nominal;
        }
        tel.dataset.plus=totalPlus+'';
        tel.dataset.minus=totalMinus+'';
        tot.childNodes[2].innerText=_Pesantrian.parseNominal(totalPlus);
        tot.childNodes[3].innerText=_Pesantrian.parseNominal(totalMinus);
        tot.childNodes[4].innerText=_Pesantrian.parseNominal(totalPlus-totalMinus);
        el.remove();
      });
    };
    let nominal=_Pesantrian.parseNominal(item.nominal),
    kwi=item.transaction_code,
    tgl=(new Date(item.time*1000)).getDate();
    if(item.method==1){
      row=this.row(tgl,kwi,item.name,nominal,'',del);
      totalPlus+=parseInt(item.nominal);
    }else{
      row=this.row(tgl,kwi,item.name,'',nominal,del);
      totalMinus+=parseInt(item.nominal);
    }
    row.dataset.name=item.name;
    row.id='item-'+item.id;
    table.append(row);
  }
  
  table.id='shop';
  table.dataset.plus=totalPlus+'';
  table.dataset.minus=totalMinus+'';
  
  row=this.row('','TOTAL',
    _Pesantrian.parseNominal(totalPlus),
    _Pesantrian.parseNominal(totalMinus),
    _Pesantrian.parseNominal(totalPlus-totalMinus)
    );
  row.childNodes[1].classList.add('extra-high');
  row.childNodes[4].setAttribute('colspan',2);
  row.classList.add('tr-head');
  row.id='shop-total';
  table.append(row);
  this.app.body.append(table);
};
this.pettyCashForm=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.pettyCashMonthly(month,year);
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  studyYear=this.getStudyYear().split('/'),
  title='FORM PETTY CASH<br />'
    +(month&&year?'Bulan '+this.month[month]+' '+year
      :'Tahun Ajaran '+studyYear.join('/')),
  row=this.rowHead(title,2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report','evidence'],
  hidden=['name','year','month','status'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='petty_cash';
  trans.nominal=0;
  trans.account='Bendahara - BSI 7134 2000 43';
  if(month&&year){
    trans.month=month;
    trans.year=year;
  }
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
      if(key=='transaction_code'){
        alias='Nomor Kwitansi';
      }
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  
  /* button save */
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
  back.onclick=async ()=>{
    await this.pettyCashMonthly(month,year);
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
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
        await this.pettyCash(month,year);
      },1600);
    }
  };
};


/* student -- other transactions */
this.studentOther=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentOther');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and '
      +this.queryOthers()+' and '
      +this.queryTA(),
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=datas[0],
  types=[
    'register_test_smp',
    'register_test_sma',
    'register_sma_new',
    'register_sma_next',
    'register_smp',
    'register_annually',
    'school_event',
  ],
  total=0,
  lines,
  nominal,
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* finance - others - LAINNYA */
  title='LAINNYA<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
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
    detail.onclick=function(){
      return _PesantrianFinance.detailTransaction(this.dataset.id);
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
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
};
this.studentOtherAdd=async function(){
  return await this.addTransaction(true);
};
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


/* employee -- saving */
this.employeeSavingAdd=async function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee('employeeSaving');
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('FORM TABUNGAN KARYAWAN',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report'],
  hidden=['type','name','year','month','status'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='saving';
  trans.nominal=0;
  trans.type='employee';
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.employee;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'employee')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  
  /* button save */
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
  back.onclick=async ()=>{
    await this.tableEmployee('employeeSaving');
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
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
        await this.tableEmployee('employeeSaving');
      },1600);
    }
  };
};
this.employeeSaving=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableEmployee('employeeSaving');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="employee" and name="saving" '
      +' order by transaction_date asc',
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
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* finance - saving - TABUNGAN */
  title='TABUNGAN KARYAWAN<br />'+data.name,
  row=this.rowHead(title,6);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo','');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    detail=document.createElement('input'),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=line.id+'';
    detail.data=data;
    detail.onclick=function(){
      _PesantrianFinance.detailTransaction(
        this.dataset.id,
        ()=>{
          _PesantrianFinance.employeeSaving(this.data);
        }
      );
    };
    row=this.row(
      date,
      nominal,
      dk,
      line.explanation,
      _Pesantrian.parseNominal(total),
      detail,
    );
    table.append(row);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','',pbutton);
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
};
this.tableEmployee=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  queries=[
    'select id,name,position from employee where id>0',
    innerApp=='employeeSaving'
      ?'select * from transaction where type="employee"'
        +' and name="saving" '
      :''
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  total=0,
  row=this.rowHead(this.alias(innerApp)+' KARYAWAN',4),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  let add=document.createElement('input');
  add.type='submit';
  add.value='FORM '+this.alias(innerApp);
  add.classList.add('button-add');
  add.dataset.method=innerApp;
  add.dataset.data=JSON.stringify(students);
  add.onclick=function(){
    let data=_Pesantrian.parseJSON(this.dataset.data),
    method=this.dataset.method+'Add';
    if(!_PesantrianFinance.hasOwnProperty(method)){
      _Pesantrian.alert('Form tidak tersedia!','','error');
      return;
    }
    _PesantrianFinance[method].apply(_PesantrianFinance,[data]);
  };
  let saldo=innerApp=='employeeSaving'?'Saldo':'',
  saving=[];
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=16){
    row=this.row('ID','Nama Karyawan',saldo,add);
  }else{
    row=this.row('ID','Nama Karyawan',saldo,'');
  }
  row.classList.add('tr-head');
  row.id='tr-head';
  table.append(row);
  /* find key */
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
  /* find balance */
  let sfind=_Pesantrian.findInput('balance','number','Saldo...');
  row=this.row('',find,innerApp=='employeeSaving'?sfind:'','');
  table.append(row);
  /* get saving */
  if(innerApp=='employeeSaving'){
    saving=this.getFinanceByType(
      Array.isArray(data[1])?data[1]:[],
      'saving'
    );
  }
  /* each */
  for(let line of students){
    if(line.position=='resign'){
      continue;
    }
    let stat=document.createElement('input');
    stat.type='submit';
    stat.value='Buka';
    stat.classList.add('button-take');
    stat.dataset.data=JSON.stringify(line);
    stat.dataset.method=innerApp;
    stat.onclick=function(){
      let data=_Pesantrian.parseJSON(this.dataset.data);
      if(!_PesantrianFinance.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianFinance[this.dataset.method].apply(_PesantrianFinance,[data]);
    };
    /* get saldo */
    let saldo=document.createElement('span'),
    sdata=_Pesantrian.getDataByKey(
      'profile_id',
      line.id,
      saving,
      true
    ),
    sbalance=this.getSavingBalance(sdata),
    ssbalance=_Pesantrian.parseNominal(sbalance);
    saldo.innerText=ssbalance;
    total+=sbalance;
    /* row */
    row=this.row(
      line.id,
      line.name,
      innerApp=='employeeSaving'?saldo:'',
      stat
    );
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    row.dataset.balance=ssbalance;
    row.childNodes[2].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  if(innerApp=='employeeSaving'){
    row=this.row('','Total',_Pesantrian.parseNominal(total),'');
    row.childNodes[2].classList.add('td-right');
    row.classList.add('tr-head');
    table.append(row);
  }
};


/* student ex -- saving and contribution */
this.studentSPPX=async function(data,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudentX('studentSPPX');
    })
  );
  let cyear=this.getStudyYear().split('/')[0];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and year='
      +year+' or year='+(year+1)+' order by month asc',
    'select * from scholarship where student_id='+data.id,
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  dclass=datas[2].length>0?parseInt(datas[2][0].class):13,
  maxPaid=datas[1].length>0?parseInt(datas[1][0].nominal):this.sppMax[dclass],
  total=0,
  lines,
  studyYear=[year,year+1],
  nominal,
  nominals={},
  rlines=[],
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
  /* tahun ajaran */
  let sta=document.createElement('select');
  for(let yr of _Pesantrian.range(2023,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr+'/'+(yr+1);
    if(yr==year){
      opt.selected='selected';
    }
    sta.append(opt);
  }
  sta.data=data;
  sta.onchange=function(){
    _PesantrianFinance.studentSPPX(this.data,this.value);
  };
  sta.style.backgroundColor='#fff';
  /* finance - contribution - SPP */
  title='EX-SPP<br />'+data.name
    +'<br />Tahun Ajaran '+year+'/'+(year+1),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal','Status',sta);
  row.classList.add('tr-head');
  table.append(row);
  lines=this.parseSPP(finance.contribution,year);
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    status=nominal>=maxPaid?'Lunas':'-',
    syear=this.monthLast.indexOf(monthName)>=0?studyYear[0]:studyYear[1],
    tgl=this.getDateByMonth(monthName,lines);
    /* parse detail */
    let plines=_Pesantrian.getDataByKey('month',monthName,lines,true),
    col=document.createElement('div');
    for(let line of plines){
      let detail=document.createElement('input');
      detail.type='submit';
      detail.value='Detail';
      detail.classList.add('button-detail');
      detail.dataset.id=line.id+'';
      detail.data=data;
      detail.onclick=function(){
        _PesantrianFinance.detailTransaction(
          this.dataset.id,
          ()=>{
            _PesantrianFinance.studentSPPX(this.data);
          }
        );
      };
      col.append(detail);
    }
    /* receipt selector */
    let rsel=document.createElement('input');
    rsel.type='submit';
    rsel.value='Receipt';
    rsel.classList.add('button-view');
    rsel.lines=plines;
    rsel.data=data;
    rsel.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    if(plines.length>0){
      col.append(rsel);
    }
    row=this.row(
      tgl,
      this.alias(monthName)+' '+syear,
      nominalRp,
      status,
      col,
    );
    table.append(row);
  }
  this.app.body.append(table);
  /* receipt */
    let receipt=document.createElement('input');
    receipt.type='submit';
    receipt.value='All Receipts';
    receipt.classList.add('button-view');
    receipt.data=data;
    receipt.lines=lines;
    receipt.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    row=this.row('','','',receipt);
    row.style.backgroundColor='transparent';
    row.childNodes[3].setAttribute('colspan',2);
    table.append(row);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.studentSavingX=async function(data,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudentX('studentSavingX');
    })
  );
  let cyear=this.getStudyYear().split('/')[0];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="saving" order by transaction_date asc',
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
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* tahun ajaran */
  let sta=document.createElement('select');
  for(let yr of _Pesantrian.range(2023,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr+'/'+(yr+1);
    if(yr==year){
      opt.selected='selected';
    }
    sta.append(opt);
  }
  sta.data=data;
  sta.onchange=function(){
    _PesantrianFinance.studentSavingX(this.data,this.value);
  };
  sta.style.backgroundColor='#fff';
  /* finance - saving - TABUNGAN */
  title='EX-TABUNGAN<br />'+data.name
    +'<br />Tahun Ajaran '+year+'/'+(year+1),
  row=this.rowHead(title,6);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo','');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    detail=document.createElement('input'),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=line.id+'';
    detail.data=data;
    detail.onclick=function(){
      _PesantrianFinance.detailTransaction(
        this.dataset.id,
        ()=>{
          _PesantrianFinance.studentSavingX(this.data);
        }
      );
    };
    row=this.row(
      date,
      nominal,
      dk,
      line.explanation,
      _Pesantrian.parseNominal(total),
      detail,
    );
    table.append(row);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','',pbutton);
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
};
this.tableStudentX=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  queries=[
    'select id,name,graduated,item_code from student where graduated=1',
    innerApp=='studentSavingX'
      ?'select * from transaction where type="student"'
        +' and name="saving" '
      :''
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  total=0,
  row=this.rowHead(this.alias(innerApp)
    +'<br />Tahun Ajaran '+this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  let add=document.createElement('input');
  add.type='submit';
  add.value='FORM '+this.alias(innerApp);
  add.classList.add('button-add');
  add.dataset.method=innerApp;
  add.dataset.data=JSON.stringify(students);
  add.onclick=function(){
    let data=_Pesantrian.parseJSON(this.dataset.data),
    method=this.dataset.method+'Add';
    if(!_PesantrianFinance.hasOwnProperty(method)){
      _Pesantrian.alert('Form tidak tersedia!','','error');
      return;
    }
    _PesantrianFinance[method].apply(_PesantrianFinance,[data]);
  };
  let saldo=innerApp=='studentSavingX'?'Saldo':'',
  saving=[];
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=16){
    row=this.row('ID','Nama Santri',saldo,'');
  }else{
    row=this.row('ID','Nama Santri',saldo,'');
  }
  row.classList.add('tr-head');
  row.id='tr-head';
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
  let sfind=_Pesantrian.findInput('balance','number','Saldo...');
  row=this.row('',find,innerApp=='studentSavingX'?sfind:'','');
  table.append(row);
  if(innerApp=='studentSavingX'){
    saving=this.getFinanceByType(
      Array.isArray(data[1])?data[1]:[],
      'saving'
    );
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
      if(!_PesantrianFinance.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianFinance[this.dataset.method].apply(_PesantrianFinance,[data]);
    };
    /* get saldo */
    let saldo=document.createElement('span'),
    sdata=_Pesantrian.getDataByKey(
      'profile_id',
      line.id,
      saving,
      true
    ),
    sbalance=this.getSavingBalance(sdata),
    ssbalance=_Pesantrian.parseNominal(sbalance);
    saldo.innerText=ssbalance;
    total+=sbalance;
    /* row */
    row=this.row(
      line.id,
      line.name,
      innerApp=='studentSavingX'?saldo:'',
      stat
    );
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    row.dataset.balance=ssbalance;
    row.childNodes[2].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  if(innerApp=='studentSavingX'){
    row=this.row('','Total',_Pesantrian.parseNominal(total),'');
    row.childNodes[2].classList.add('td-right');
    row.classList.add('tr-head');
    table.append(row);
  }
};

/* student -- saving and contribution */
this.receiptSPP=async function(data,lines){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.studentSPP(data);
    })
  );
  /* table */
  let img=new Image,
  title='BUKTI PEMBAYARAN<br />'
    +'MA\'HAD AISYAH ABU BAKAR TAHFIZH ISLAMIC BOARDING SCHOOL'
    +'<br />TAHUN AJARAN '+this.getStudyYear(),
  row=this.row(img,title),
  table=this.table();
  table.append(row);
  row.style.backgroundColor='transparent';
  row.childNodes[0].style.textAlign='center';
  row.childNodes[0].style.minWidth='100px';
  row.childNodes[0].style.width='100px';
  row.childNodes[1].style.fontWeight='bold';
  row.childNodes[1].style.fontSize='20px';
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  img.alt='atibs logo';
  img.src=_Pesantrian.IMAGES['logo.png'];
  img.style.width='100px';
  img.style.height='100px';
  this.app.body.append(table);
  /* table data header */
  let today=_Pesantrian.parseDate((new Date).getTime());
  row=this.row('Nama Santri',data.name);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  table.append(row);
  row=this.row('Kode Barang',data.item_code,today);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[2].setAttribute('colspan',2);
  table.append(row);
  /* table header */
  row=this.row(
    'No',
    'Nomor Transaksi',
    'Jenis Pembayaran',
    'Cicilan',
    'Jumlah',
  );
  row.classList.add('tr-head');
  table.append(row);
  /* per line transaction */
  let counter=0,
  total=0,
  ntable=this.table();
  for(let mon of this.studyMonths){
    let plines=_Pesantrian.getDataByKey('month',mon,lines,true);
    for(let line of plines){
      counter++;
      row=this.row(
        counter,
        line.id,
        'SPP '+this.month[line.month]+' '+line.year,
        this.month[line.month],
        _Pesantrian.parseNominal(line.nominal),
      );
      row.childNodes[0].classList.add('td-center');
      row.childNodes[1].classList.add('td-center');
      row.childNodes[4].classList.add('td-right');
      table.append(row);
      total+=parseInt(line.nominal,10);
    }
  }
  /* 
  alert(_Pesantrian.parser.likeJSON(lines,3));
  */
  /* total */
  row=this.row(
    '','','','Total',
    _Pesantrian.parseNominal(total),
  );
  row.classList.add('tr-head');
  row.childNodes[4].classList.add('td-right');
  row.childNodes[0].style.backgroundColor='transparent';
  row.childNodes[1].style.backgroundColor='transparent';
  row.childNodes[2].style.backgroundColor='transparent';
  table.append(row);
  /* ttd */
  /* print button */
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('','','','',pbutton);
  row.style.backgroundColor='transparent';
  table.append(row);
  /* ttd */
  row=this.row('','','','Bendahara');
  row.style.backgroundColor='transparent';
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[3].style.textAlign='center';
  table.append(row);
  /* blank */
  row=this.row('','','','');
  row.style.backgroundColor='transparent';
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[3].style.height='120px';
  table.append(row);
  /* operator */
  row=this.row('','','','Rina Ferianti, A.Md., Ak.');
  row.style.backgroundColor='transparent';
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[3].style.textAlign='center';
  row.childNodes[3].style.borderTop='2px solid #333';
  table.append(row);
  /* */
};
this.studentSavingAdd=async function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSaving');
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('FORM TABUNGAN',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report'],
  hidden=['type','name','year','month','status'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='saving';
  trans.nominal=0;
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  
  /* button save */
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
  back.onclick=async ()=>{
    await this.tableStudent('studentSaving');
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
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
        await this.tableStudent('studentSaving');
      },1600);
    }
  };
};
this.studentSaving=async function(data){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSaving');
    })
  );
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  year=(new Date).getFullYear(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="saving" order by transaction_date asc',
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
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(finance,3));
    return;
  }
  /* finance - saving - TABUNGAN */
  title='TABUNGAN<br />'+data.name
    +'<br />Tahun Ajaran '+this.getStudyYear(),
  row=this.rowHead(title,6);
  table.append(row);
  row=this.row('Tanggal','Nominal','D/K','Keterangan','Saldo','');
  row.classList.add('tr-head');
  table.append(row);
  total=0;
  for(let line of finance.saving){
    if(line.method==1){
      total+=parseInt(line.nominal);
    }else{
      total-=parseInt(line.nominal);
    }
    let date=_Pesantrian.parseDate(line.transaction_date),
    detail=document.createElement('input'),
    dk=this.tagDK(line.method==1?true:false);
    nominal=_Pesantrian.parseNominal(line.nominal);
    detail.type='submit';
    detail.value='Detail';
    detail.classList.add('button-detail');
    detail.dataset.id=line.id+'';
    detail.data=data;
    detail.onclick=function(){
      _PesantrianFinance.detailTransaction(
        this.dataset.id,
        ()=>{
          _PesantrianFinance.studentSaving(this.data);
        }
      );
    };
    row=this.row(
      date,
      nominal,
      dk,
      line.explanation,
      _Pesantrian.parseNominal(total),
      detail,
    );
    table.append(row);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    dk.dataset.id=line.id;
    dk.onclick=function(){
      _PesantrianFinance.evidencePage(this.dataset.id);
    };
  }
  let pbutton=document.createElement('input');
  pbutton.classList.add('button-taken');
  pbutton.type='submit';
  pbutton.value='Print';
  pbutton.onclick=function(){
    window.print();
  };
  row=this.row('Total',_Pesantrian.parseNominal(total),'','','',pbutton);
  row.childNodes[1].classList.add('td-right');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  
};
this.studentSPPAdd=async function(student){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSPP');
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('FORM SPP',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','uid','report','explanation'],
  hidden=['type','name','year','month'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  trans.name='contribution';
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(hidden.indexOf(key)>=0){
      let ht=document.createElement('input');
      ht.type='hidden';
      ht.name=key;
      ht.value=value;
      this.app.body.append(ht);
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  /* rincian */
  let ddetail=document.createElement('div');
  ddetail.id='data-detail';
  this.app.body.append(ddetail);
  udata.rincian={
    "0":{
      nominal:2000000,
      keterangan:(new Date).getMonth()+12,
    }
  };
  table=this.dataDetailSPP(udata);
  ddetail.append(table);
  
  /* button save */
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
  back.onclick=async ()=>{
    await this.tableStudent('studentSPP');
  };
  btn.onclick=async ()=>{
    btn.disabled=true;
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    /* debug */
    if(false){
      alert(_Pesantrian.parser.likeJSON({
        user:user,
        ndata:ndata,
      },5));
      return;
    }
    /* queries */
    let queries=[],
    ntotal=0,
    nmonth=[],
    thisYear=(new Date).getFullYear(),
    lastYear=thisYear-1;
    nextYear=thisYear+1;
    for(let rk in ndata.data.rincian){
      let rin=ndata.data.rincian[rk],
      rmonth=parseInt(rin.keterangan),
      nuser=_Pesantrian.parseJSON(JSON.stringify(user));
      nuser.nominal=rin.nominal;
      nuser.month=rmonth<12?rmonth:rmonth>23?rmonth-24:rmonth-12;
      nuser.year=rmonth<12?lastYear:rmonth>23?nextYear:thisYear;
      nuser.data=JSON.stringify({
        rincian:{"0":{
          nominal:rin.nominal,
          keterangan:this.month[nuser.month]+' '+nuser.year,
        }}
      });
      nmonth.push(this.month[nuser.month]+' '+nuser.year);
      let innerQuery=_Pesantrian.buildQuery(nuser);
      queries.push(
        'insert into "transaction" '+innerQuery
      );
      ntotal+=parseInt(rin.nominal);
    }
    if(parseInt(ntotal)!==parseInt(user.nominal)){
      btn.disabled=false;
      _Pesantrian.alert('Error: Nominal tidak sesuai!','','error');
      return;
    }
    /* debug */
    if(false){
      alert(_Pesantrian.parser.likeJSON({
        user:user,
        ndata:ndata,
        queries:queries,
      },5));
      return;
    }
    /* */
    let loader=_Pesantrian.loader(),
    res=await _Pesantrian.request('queries',queries.join(';')),
    error=false;
    /* student type */
    if(!error&&user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[user.name=='contribution'?'studentSPP':'studentSaving'],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+nmonth.join(', ');
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    loader.remove();
    if(!res){
      error='Kesalahan tidak diketahui. '+JSON.stringify(res);
    }else if(res.hasOwnProperty('error')){
      error=res.error;
    }
    /* notif */
    _Pesantrian.notif(
      res&&!error?'Tersimpan':error,
      res&&!error?'success':'error'
    );
    /* debug */
    if(!error){
      btn.value='Selesai';
      setTimeout(async ()=>{
        await this.tableStudent('studentSPP');
      },1500);
    }else{
      btn.disabled=false;
    }
  };
};
this.studentSPP=async function(data,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableStudent('studentSPP');
    })
  );
  let cyear=this.getStudyYear().split('/')[0];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  let loader=_Pesantrian.loader(),
  month=(new Date).getMonth(),
  queries=[
    'select * from transaction where profile_id='+data.id
      +' and type="student" and name="contribution" and year='
      +year+' or year='+(year+1)+' order by month asc',
    'select * from scholarship where student_id='+data.id,
    'select * from class where student_id='+data.id,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  finance=this.getFinanceByType(datas[0]),
  dclass=datas[2].length>0?parseInt(datas[2][0].class):12,
  maxPaid=datas[1].length>0?parseInt(datas[1][0].nominal):this.sppMax[dclass],
  total=0,
  lines,
  studyYear=[year,year+1],
  nominal,
  nominals={},
  rlines=[],
  title,
  row,
  table=this.table();
  loader.remove();
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
  /* tahun ajaran */
  let sta=document.createElement('select');
  for(let yr of _Pesantrian.range(2023,2030)){
    let opt=document.createElement('option');
    opt.value=yr;
    opt.textContent=yr+'/'+(yr+1);
    if(yr==year){
      opt.selected='selected';
    }
    sta.append(opt);
  }
  sta.data=data;
  sta.onchange=function(){
    _PesantrianFinance.studentSPP(this.data,this.value);
  };
  sta.style.backgroundColor='#fff';
  /* finance - contribution - SPP */
  title='SPP<br />'+data.name
    +'<br />Tahun Ajaran '+studyYear.join('/'),
  row=this.rowHead(title,5);
  table.append(row);
  row=this.row('Tanggal Pembayaran','SPP Bulan','Nominal','Status',sta);
  row.classList.add('tr-head');
  table.append(row);
  lines=this.parseSPP(finance.contribution,year);
  for(let monthName of this.studyMonths){
    nominal=this.getNominalByMonth(monthName,lines);
    let nominalRp=_Pesantrian.parseNominal(nominal),
    status=nominal>=maxPaid?'Lunas':'-',
    syear=this.monthLast.indexOf(monthName)>=0?studyYear[0]:studyYear[1],
    tgl=this.getDateByMonth(monthName,lines);
    /* parse detail */
    let plines=_Pesantrian.getDataByKey('month',monthName,lines,true),
    col=document.createElement('div');
    for(let line of plines){
      let detail=document.createElement('input');
      detail.type='submit';
      detail.value='Detail';
      detail.classList.add('button-detail');
      detail.dataset.id=line.id+'';
      detail.data=data;
      detail.onclick=function(){
        _PesantrianFinance.detailTransaction(
          this.dataset.id,
          ()=>{
            _PesantrianFinance.studentSPP(this.data);
          }
        );
      };
      col.append(detail);
    }
    /* receipt selector */
    let rsel=document.createElement('input');
    rsel.type='submit';
    rsel.value='Receipt';
    rsel.classList.add('button-view');
    rsel.lines=plines;
    rsel.data=data;
    rsel.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    if(plines.length>0){
      col.append(rsel);
    }
    row=this.row(
      tgl,
      this.alias(monthName)+' '+syear,
      nominalRp,
      status,
      col,
    );
    table.append(row);
  }
  this.app.body.append(table);
  /* receipt */
    let receipt=document.createElement('input');
    receipt.type='submit';
    receipt.value='All Receipts';
    receipt.classList.add('button-view');
    receipt.data=data;
    receipt.lines=lines;
    receipt.onclick=function(){
      _PesantrianFinance.receiptSPP(this.data,this.lines);
    };
    row=this.row('','','',receipt);
    row.style.backgroundColor='transparent';
    row.childNodes[3].setAttribute('colspan',2);
    table.append(row);
  /* debug */
  if(false){
    alert(_Pesantrian.parser.likeJSON(datas,3));
    return;
  }
};
this.parseSPP=function(data=[],year){
  let cyear=this.getStudyYear().split('/')[0],
  res=[];
  year=year&&parseInt(year)!==NaN?parseInt(year):parseInt(cyear);
  for(let d of data){
    if((d.month<6&&d.year==year+1)
      ||(d.month>=6&&d.year==year)){
      res.push(d);
    }
  }
  return res;
};
this.queryTA=function(year,month){
  year=year&&parseInt(year)!==NaN?parseInt(year)
    :(new Date).getFullYear();
  month=month&&parseInt(month)!==NaN?parseInt(month)
    :(new Date).getMonth();
  let res=[
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
this.dataDetailSPP=(udata)=>{
  let nomor=0,
  thisYear=(new Date).getFullYear(),
  lastYear=thisYear-1,
  nextYear=thisYear+1,
  thisMonth=(new Date).getMonth()+12,
  table=this.table(),
  row=this.rowHead('RINCIAN',3),
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('select'),
    ibtn=document.createElement('input');
    inama.type='number';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    nomor=parseInt(table.dataset.nomor);
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    inama.value='2000000';
    nomor++;
    table.dataset.nomor=''+nomor;
    for(let nmonth of _Pesantrian.range(0,35)){
      let opt=document.createElement('option'),
      dyear=nmonth<12?lastYear:nmonth>23?nextYear:thisYear,
      kmonth=dyear==thisYear?nmonth-12:dyear==nextYear?nmonth-24:nmonth;
      opt.value=nmonth;
      opt.textContent=this.month[kmonth]+' '+dyear;
      if(nmonth==thisMonth){
        opt.selected='selected';
      }
      iket.append(opt);
    }
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  };
  table.append(row);
  row=this.row('Nominal','Bulan',tambah);
  table.append(row);
  table.totalNominal=0;
  for(let k in udata.rincian){
    let kel=udata.rincian[k],
    id='data-'+k,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('select');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='number';
    inama.value=kel.nominal;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    for(let nmonth of _Pesantrian.range(0,35)){
      let opt=document.createElement('option'),
      dyear=nmonth<12?lastYear:nmonth>23?nextYear:thisYear,
      kmonth=dyear==thisYear?nmonth-12:dyear==nextYear?nmonth-24:nmonth;
      opt.value=nmonth;
      opt.textContent=this.month[kmonth]+' '+dyear;
      if(nmonth==kel.keterangan){
        opt.selected='selected';
      }
      iket.append(opt);
    }
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    table.totalNominal+=parseInt(kel.nominal);
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    table.dataset.nomor=''+nomor;
  }
  return table;
};
this.tableStudent=async function(innerApp){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  innerApp=innerApp?innerApp:'studentOverview';
  let loader=_Pesantrian.loader(),
  profile_id=_Pesantrian.user.profile_id,
  queries=[
    'select id,name,graduated,item_code from student where graduated=0',
    innerApp=='studentSaving'
      ?'select * from transaction where type="student"'
        +' and name="saving"'
      :''
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  students=data[0],
  total=0,
  row=this.rowHead(this.alias(innerApp)
    +'<br />Tahun Ajaran '+this.getStudyYear(),4),
  table=this.table();
  table.append(row);
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(data,3));
    return;
  }
  let add=document.createElement('input');
  add.type='submit';
  add.value='FORM '+this.alias(innerApp);
  add.classList.add('button-add');
  add.dataset.method=innerApp;
  add.dataset.data=JSON.stringify(students);
  add.onclick=function(){
    let data=_Pesantrian.parseJSON(this.dataset.data),
    method=this.dataset.method+'Add';
    if(!_PesantrianFinance.hasOwnProperty(method)){
      _Pesantrian.alert('Form tidak tersedia!','','error');
      return;
    }
    _PesantrianFinance[method].apply(_PesantrianFinance,[data]);
  };
  let saldo=innerApp=='studentSaving'?'Saldo':'',
  saving=[];
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=16){
    row=this.row('ID','Nama Santri',saldo,add);
  }else{
    row=this.row('ID','Nama Santri',saldo,'');
  }
  row.classList.add('tr-head');
  row.id='tr-head';
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
  let sfind=_Pesantrian.findInput('balance','number','Saldo...');
  row=this.row('',find,innerApp=='studentSaving'?sfind:'','');
  table.append(row);
  if(innerApp=='studentSaving'){
    saving=this.getFinanceByType(
      Array.isArray(data[1])?data[1]:[],
      'saving'
    );
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
      if(!_PesantrianFinance.hasOwnProperty(this.dataset.method)){
        _Pesantrian.alert('Data tidak tersedia!','','error');
        return;
      }
      _PesantrianFinance[this.dataset.method].apply(_PesantrianFinance,[data]);
    };
    /* get saldo */
    let saldo=document.createElement('span'),
    sdata=_Pesantrian.getDataByKey(
      'profile_id',
      line.id,
      data[1]??[],
      true
    ),
    sbalance=this.getSavingBalance(sdata),
    ssbalance=_Pesantrian.parseNominal(sbalance);
    saldo.innerText=ssbalance;
    total+=sbalance;
    /* row */
    row=this.row(
      line.id,
      line.name,
      innerApp=='studentSaving'?saldo:'',
      stat
    );
    row.dataset.name=line.name;
    row.dataset.id=line.id;
    row.dataset.balance=ssbalance;
    row.childNodes[2].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  if(innerApp=='studentSaving'){
    row=this.row('','Total',_Pesantrian.parseNominal(total),'');
    row.childNodes[2].classList.add('td-right');
    row.classList.add('tr-head');
    table.append(row);
  }
};

/* table data / raw data */
this.tableDataTransaction=async function(data=[]){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableTransaction();
    })
  );
  let table=_Pesantrian.tableData(data,'transaction');
  this.app.body.append(table);
};


/* big book */
this.tableTransaction=async (config)=>{
  config=typeof config==='object'&&config!==null?config:{};
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  /* default config */
  if(!config.hasOwnProperty('studyYear')){
    config.studyYear=this.getStudyYear();
  }
  if(!config.hasOwnProperty('name')){
    config.name='contribution';
  }
  if(!config.hasOwnProperty('year')){
    config.year=(new Date).getFullYear();
  }
  if(!config.hasOwnProperty('month')){
    config.month=(new Date).getMonth();
  }
  /* start to fetch data */
  let loader=_Pesantrian.loader(),
  tquery=this.queryTransaction(config),
  queries=[
    'select id,name from student',
    'select id,name from parent',
    'select id,name from employee',
    tquery,
  ].join(';'),
  pre=document.createElement('pre'),
  table=this.table(),
  row=this.rowHead('CONFIGURATION',2),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
  },
  add=document.createElement('input'),
  selector=this.selector(config,dtype),
  configNames=['studyYear','name','type','profile_id','method','status','year','month','transaction_code'],
  totalize={
    outcome:0,
    income:0,
  },
  trans=data[3],
  gspan;
  loader.remove();
  if(false){
    alert(_Pesantrian.parser.likeJSON(queries,3));
  }
  table.append(row);
  this.app.body.append(table);
  for(let cn of configNames){
    row=this.row(this.alias(cn),selector[cn]);
    table.append(row);
  }
  
  let title='BUKU BESAR<br /> ('
    +(trans.length>0?trans.length+' baris':'kosong')
    +')';
  for(let cn of configNames){
    if(config.hasOwnProperty(cn)&&config[cn]!=''){
      let dval=this.alias(config[cn]);
      if(cn=='profile_id'){
        dval=this.getName(config[cn],dtype[config.type]);
      }else if(cn=='method'){
        dval=['Keluar','Masuk'][config[cn]];
      }
      title+='<br />'+this.alias(cn)+' '+dval;
    }
  }
  table=this.table();
  row=this.rowHead(title,6),
  table.append(row);
  add.classList.add('button-add');
  add.type='submit';
  add.value='Tambah';
  add.onclick=()=>{
    this.addTransaction();
  };
  row=this.row(
    'ID',
    this.alias('transaction_date'),
    this.alias('profile_id'),
    this.alias('credit'),
    this.alias('debt'),
    add
  );
  row.classList.add('tr-head');
  table.append(row);
  
  /* data table transaction */
  let full=document.createElement('input');
  full.type='submit';
  full.value='FULL';
  full.classList.add('button-taken');
  full.onclick=()=>{
    this.tableDataTransaction(trans);
  };
  /* find */
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
  row=this.row('','',find,'','',full);
  table.append(row);
  
  /* data transactions */
  for(let tran of trans.reverse()){
        gspan=document.createElement('span');
        gspan.innerText=['Keluar','Masuk'][tran.method];
        gspan.classList.add('gender');
        gspan.classList.add('gender-'+tran.method);
    /* tag id */
    let tid='<div class="tag-pack tag-pack-'
      +(tran.method=='1'?'1':'0')+'">'+tran.id+'</div> ';
    /**
    row=this.row(
      tran.id,
      this.alias(tran.name),
      this.alias(tran.type),
      this.getName(tran.profile_id,dtype[tran.type]),
      this.parseNominal(tran.nominal),
      gspan,
      this.alias(tran.status),
      this.alias(tran.year),
      this.alias(tran.month),
      this.parseDate(tran.transaction_date),
      tran.transaction_code,
      see
    );
    */
    let see=document.createElement('input'),
    tdate=this.parseDate(tran.transaction_date),
    tnominal=this.parseNominal(tran.nominal);
    see.type='submit';
    see.value='Detail';
    see.classList.add('button-detail');
    see.dataset.id=tran.id;
    see.onclick=function(){
      _PesantrianFinance.detailTransaction(this.dataset.id);
    };
    let pname=this.getName(tran.profile_id,dtype[tran.type]);
    if(tran.method==1){
      totalize.income+=parseInt(tran.nominal);
      row=this.row(tid,tdate,pname,tnominal,'',see);
    }else{
      totalize.outcome+=parseInt(tran.nominal);
      row=this.row(tid,tdate,pname,'',tnominal,see);
    }
    row.dataset.name=pname;
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    table.append(row);
  }
  this.app.body.append(table);
  /* total */
  row=this.row('','','TOTAL',
    this.parseNominal(totalize.income),
    this.parseNominal(totalize.outcome),
    this.parseNominal(totalize.income-totalize.outcome),
  );
  row.classList.add('tr-head');
  table.append(row);
  /* total */
  let codes=['qrbill_shop','qrbill_laundry'];
  if(config.hasOwnProperty('transaction_code')
    &&codes.indexOf(config.transaction_code)>=0){
    let give=document.createElement('input');
    give.type='button';
    give.value='Serahkan';
    give.classList.add('button-taken');
    give.dataset.code=config.transaction_code;
    give.onclick=async function(){
      let yes=await _Pesantrian.confirmX(
        'Serahkan dana?',
        'Kode: '+this.dataset.code);
      if(!yes){return;}
      let query='update transaction (transaction_code='
        +this.dataset.code+'_paid) where transaction_code="'
        +this.dataset.code+'"',
      loader=_Pesantrian.loader(),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      _PesantrianFinance.tableTransaction({
        transaction_code:this.dataset.code,
      });
    };
    row=this.row('','','','','',give);
    table.append(row);
  }
  /* rincian *
  table=this.table();
  row=this.rowHead('TOTAL',3);
  table.append(row);
  row=this.row('Arus Dana','Nominal','Keterangan');
  row.classList.add('tr-head');
  table.append(row);
        gspan=document.createElement('span');
        gspan.innerText='Masuk';
        gspan.classList.add('gender');
        gspan.classList.add('gender-1');
  row=this.row(gspan,this.parseNominal(totalize.income),'Total Dana Masuk');
  table.append(row);
        gspan=document.createElement('span');
        gspan.innerText='Keluar';
        gspan.classList.add('gender');
        gspan.classList.add('gender-0');
  row=this.row(gspan,this.parseNominal(totalize.outcome),'Total Dana Keluar');
  table.append(row);
  row=this.row('',this.parseNominal(totalize.income-totalize.outcome),'Grand Total');
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);
  */
  
};
this.editTransaction=async (trans,dtype)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.detailTransaction(trans.id);
    })
  );
  let udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  row=this.rowHead('EDIT TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','time','id','uid'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||passes.indexOf(key)>=0){
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      img=new Image,
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      img.src=this.evidencePath(value);
      img.onload=()=>{
        tfv.innerHTML='';
        tfv.append(img);
      };
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      if(key=='date'){
        ti.disabled=true;
      }
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }
  this.app.body.append(table);

  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=_Pesantrian.user.id;
  ti.name='uid';
  this.app.body.append(ti);
  
  /* rincian */
  table=this.table();
  row=this.rowHead('RINCIAN',3);
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
    inama.type='number';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  row=this.row('Nominal','Keterangan',tambah);
  table.append(row);
  for(let k in udata.rincian){
    let kel=udata.rincian[k],
    id=kel.nama,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='number';
    iket.type='text';
    inama.value=kel.nominal;
    iket.value=kel.keterangan;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
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
    this.detailTransaction(trans.id);
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user);
    query='update transaction ('+innerQuery+') where id='
      +trans.id;
    let loader=_Pesantrian.loader();
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
        if(trans.name=='saving'){
          this.tableStudent('studentSaving');
        }else if(trans.name=='contribution'){
          this.tableStudent('studentSPP');
        }else{
          await this.tableTransaction();
        }
      },1600);
    }
  };
};
this.detailTransaction=async (id,backCB)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      if(typeof backCB==='function'){
        return backCB();
      }else{
        await this.tableTransaction();
      }
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
    ?trans.data:this.parseJSON(trans.data),
  row=this.rowHead('DETAIL TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  passes=['data','time','uid'],
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
      val=this.parseDate(value);
    }else if(integers.indexOf(key)>=0){
      val=value;
      if(key=='nominal'){
        val=this.parseNominal(value);
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
    row=this.row(nomor,this.parseNominal(kel.nominal),kel.keterangan);
    nomor++;
    table.append(row);
  }
  this.app.body.append(table);
  /* */
  
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
  del.dataset.id=trans.id;
  if(_Pesantrian.user.profile.position=='finance'
    ||_Pesantrian.user.privilege>=0x10){
    div.append(edit);
    div.append(del);
  }
  div.append(back);
  div.classList.add('grid');
  div.classList.add('grid-max');
  this.app.body.append(div);
  back.onclick=()=>{
      if(typeof backCB==='function'){
        return backCB();
      }else{
        this.tableTransaction();
      }
  };
  edit.onclick=()=>{
    this.editTransaction(trans,dtype);
  };
  del.onclick=()=>{
    _Pesantrian.confirm(
      'Delete data transaksi?',
      this.alias(trans.name)+' nomor '+trans.id,
      async (yes)=>{
      if(yes){
        let loader=_Pesantrian.loader(),
        query='delete from transaction where id='+trans.id,
        res=await _Pesantrian.request('query',query);
        loader.remove();
        this.tableTransaction();
      }
    });
  };
};
this.addTransaction=async (out)=>{
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      if(out){
        await this.init();
      }else{
        await this.tableTransaction();
      }
    })
  );
  let trans=this.templateTransaction(),
  udata=trans.hasOwnProperty('data')
    &&typeof trans.data==='object'&&trans.data!==null
    ?trans.data:this.parseJSON(trans.data),
  loader=_Pesantrian.loader(),
  queries=[
    'select id,name,father_id,mother_id,graduated from student where graduated=0',
    'select id,name from parent',
    'select id,name from employee',
    'select id,type,profile_id from user where type="parent"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  dtype={
    student:data[0],
    parent:data[1],
    employee:data[2],
    userParent:data[3],
  },
  row=this.rowHead('INPUT TRANSAKSI',2),
  val,
  integers=['nominal','account'],
  methods=['Keluar','Masuk'],
  selection=this.selection,
  table=this.table();
  table.append(row);
  loader.remove();
  for(let key in trans){
    let value=trans[key],
    alias=this.alias(key);
    if(!key||key=='data'||key=='uid'){
      continue;
    }else if(selection.hasOwnProperty(key)){
      let ts=document.createElement('select');
      ts.id='selection-'+key;
      for(let sel of selection[key]){
        tso=document.createElement('option');
        tso.value=sel;
        tso.textContent=this.alias(sel);
        if(sel==value){
          tso.selected='selected';
        }
        ts.append(tso);
      }
      if(key=='type'){
        ts.onchange=function(){
          let id='profile_id', 
          tsx=document.getElementById(id),
          tdx=tsx.parentNode,
          tsn=_Pesantrian.findSelect({
            id:id,
            key:id,
            value:'',
            data:dtype[this.value],
            placeholder:_PesantrianFinance.alias(this.value)+'...',
          });
          tdx.innerHTML='';
          tdx.append(tsn);
        };
      }
      if(key=='name'){
        ts.onchange=function(){
          let udata={
            rincian:{},
          },
          dnominal=document.querySelector('[name="nominal"]'),
          ddetail=document.getElementById('data-detail');
          if(_PesantrianFinance.rincian.hasOwnProperty(this.value)){
            udata={
              rincian:_PesantrianFinance.rincian[this.value],
            };
          }
          let table=_PesantrianFinance.dataDetail(udata);
          if(ddetail){
            ddetail.innerHTML='';
            ddetail.append(table);
          }
          if(dnominal){
            dnominal.value=table.totalNominal+'';
          }
        };
      }
      val=ts;
    }else if(key=='profile_id'){
      let ptype=document.getElementById('selection-type'),
      selects=ptype&&ptype.value?dtype[ptype.value]:dtype.student;
      val=_Pesantrian.findSelect({
        id:key,
        key:key,
        value:value,
        data:selects,
        placeholder:this.alias(ptype&&ptype.value?ptype.value:'student')+'...',
      });
    }else if(key=='method'){
      val=_Pesantrian.radioMethod(value);
    }else if(key=='transaction_date'){
      let ti=document.createElement('input');
      ti.type='date';
      ti.value=value;
      ti.min='2013-01-01';
      ti.max='2033-12-31';
      val=ti;
    }else if(integers.indexOf(key)>=0){
      let ti=document.createElement('input');
      ti.type='number';
      ti.value=value;
      if(key=='nominal'){
        alias+=' (Rp)';
      }
      val=ti;
    }else if(key=='evidence'){
      let tf=document.createElement('input'),
      tfb=document.createElement('input'),
      tfmain=document.createElement('div'),
      tfv=document.createElement('div');
      tfv.id='evidence-preview';
      tf.type='file';
      tf.dataset.key=key;
      tf.style.position='absolute';
      tf.style.left='0px';
      tf.style.opacity='0';
      tfb.type='submit';
      tfb.value='Upload';
      tfb.classList.add('button-add');
      tfmain.append(tfb);
      tfmain.append(tf);
      tfmain.append(tfv);
      tfmain.style.position='relative';
      tf.onchange=async function(e){
        let file=this.files[0],
        key=this.dataset.key,
        img=new Image,
        fr=new FileReader,
        data=new FormData,
        fname=(new Date).getTime()+'.jpg',
        tff=document.createElement('input'),
        tfv=document.getElementById('evidence-preview');
        tfv.innerHTML='';
        fr.onload=()=>{
          img.src=fr.result;
          tfv.append(img);
        };
        fr.readAsDataURL(file);
        delete tfmain.name;
        tff.name=key;
        tff.type='hidden';
        tff.value=fname;
        tfv.append(tff);
        data.append('uid',_Pesantrian.user.id);
        data.append('path','finance/evidence/'+fname);
        data.append('query','pesantrian uload EVA.data(data)');
        data.append('file',file);
        tfb.value='Uploading...';
        let loader=_Pesantrian.loader(),
        res=await _Pesantrian.eva.request(data),
        ress=_Pesantrian.decode(res);
        loader.remove();
        _Pesantrian.notif('upload:'+ress);
        if(ress=='ok'){
          tf.remove();
          tfb.remove();
        }
      };
      val=tfmain;
    }else{
      let ti=document.createElement('input');
      ti.type='text';
      ti.value=value;
      val=ti;
    }
    if(key!='method'){
      val.name=key;
    }
    row=this.row(alias,val);
    table.append(row);
  }

  this.app.body.append(table);
  let ti=document.createElement('input');
  ti.type='hidden';
  ti.value=trans.uid;
  ti.name='uid';
  this.app.body.append(ti);
  
  /* rincian */
  let ddetail=document.createElement('div');
  ddetail.id='data-detail';
  this.app.body.append(ddetail);
  table=this.dataDetail(udata);
  ddetail.append(table);
  
  /* button save */
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
    this.tableTransaction();
  };
  btn.onclick=async ()=>{
    let data={},
    user={},
    form=document.querySelectorAll('[name]');
    for(let i=0;i<form.length;i++){
      if(typeof form[i].value==='undefined'){
        continue;
      }else if(form[i].name.match(/^data/)){
        data[form[i].name]=form[i].value;
      }else if(form[i].type=='radio'){
        if(form[i].checked){
          user[form[i].name]=form[i].value;
        }
      }else{
        user[form[i].name]=form[i].value;
      }
    }
    let query=[];
    for(let k in data){
      query.push(k+'='+data[k]);
    }
    let parse=new parser,
    ndata=parse.parseQuery(query.join('&'));
    user.data=JSON.stringify(
      ndata.hasOwnProperty('data')?ndata.data:{rincian:{}}
    );
    let innerQuery=_Pesantrian.buildQuery(user),
    queries=[
      'insert into "transaction" '+innerQuery,
    ],
    loader=_Pesantrian.loader();
    /* student type */
    if(user.type=='student'&&(user.name=='contribution'||user.name=='saving')){
      let sdata=this.getStudentData(user.profile_id,dtype.student);
      if(sdata){
        let uids=this.getParentsUID(dtype.userParent,sdata.father_id,sdata.mother_id);
        for(let uid of uids){
          let message='Ananda '+sdata.name,
          callback={
            appName:'parent',
            next:'tableStudent',
            args:[],
          };
          if(user.name=='contribution'){
            message+=' sudah membayar '
              +this.alias(user.name)
              +' bulan '+user.month;
          }else{
            message+=user.method==1
              ?' sudah menabung':' sudah mengambil tabungan';
          }
          message+=' sebesar '+_Pesantrian.parseNominal(user.nominal);
          await _Pesantrian.sendNotification(uid,message,callback);
        }
      }
    }
    let res=await _Pesantrian.request('queries',queries.join(';')),
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
        await this.tableTransaction();
      },1600);
    }
  };
};
this.dataDetail=(udata)=>{
  let nomor=0,
  table=this.table(),
  row=this.rowHead('RINCIAN',3),
  tambah=document.createElement('input');
  tambah.classList.add('button-add');
  tambah.type='submit';
  tambah.value='Tambah';
  tambah.onclick=()=>{
    let id=(new Date).getTime(),
    inama=document.createElement('input'),
    iket=document.createElement('input'),
    ibtn=document.createElement('input');
    inama.type='number';
    iket.type='text';
    ibtn.type='submit';
    ibtn.value='Hapus';
    ibtn.classList.add('button-delete');
    row=this.row(inama,iket,ibtn);
    ibtn.dataset.id=id;
    row.id=id;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    ibtn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
    nomor++;
  };
  table.append(row);
  row=this.row('Nominal','Keterangan',tambah);
  table.append(row);
  table.totalNominal=0;
  for(let k in udata.rincian){
    let kel=udata.rincian[k],
    id='data-'+k,
    btn=document.createElement('input'),
    inama=document.createElement('input'),
    iket=document.createElement('input');
    btn.type='submit';
    btn.value='Hapus';
    btn.classList.add('button-delete');
    btn.dataset.id=id;
    inama.type='number';
    iket.type='text';
    inama.value=kel.nominal;
    iket.value=kel.keterangan;
    inama.name='data[rincian]['+nomor+'][nominal]';
    iket.name='data[rincian]['+nomor+'][keterangan]';
    row=this.row(inama,iket,btn);
    row.id=id;
    nomor++;
    table.totalNominal+=parseInt(kel.nominal);
    btn.onclick=function(){
      let id=this.dataset.id,
      el=document.getElementById(id);
      if(el){el.remove();}
    };
    table.append(row);
  }
  return table;
};
this.templateTransaction=()=>{
  return {
    name:'donation',
    type:'student',
    profile_id:0,
    method:1,
    nominal:2000000,
    transaction_date:(new Date).getFullYear()+'-'
      +((new Date).getMonth()+1).toString().padStart(2,'0')+'-'
      +(new Date).getDate().toString().padStart(2,'0'),
    transaction_code:'',
    account:'Yayasan - BSI 7164 540 558',
    status:'paid',
    report:'',
    evidence:'',
    explanation:'',
    uid:_Pesantrian.user.id,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    data:{
      rincian:{}
    }
  };
};
this.test=()=>{
  
};

/* ---------- inner ---------- */
this.tagDK=function(done){
  let tag=document.createElement('span');
  tag.innerText=done?'K':'D';
  tag.classList.add('gender');
  tag.classList.add(done?'gender-1':'gender-0');
  return tag;
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
this.getFinanceByType=function(data,ftype){
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
  return ftype&&res.hasOwnProperty(ftype)?res[ftype]:res;
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
this.getParentsUID=function(data,father_id,mother_id){
  data=Array.isArray(data)?data:[];
  let res=[];
  for(let line of data){
    if(line.profile_id==father_id
      ||line.profile_id==mother_id){
      res.push(line.id);
    }
  }return res;
};
this.evidencePath=function(fname){
  return _Pesantrian.eva.config.host
    +'pesantrian/finance/evidence/'+fname;
};
this.queryTransaction=function(config){
  config=typeof config==='object'&&config!==null?config:{};
  let names=[
    'register',
    'contribution',
    'donation',
    'petty_cash',
  ],
  types=[
    'student',
    'parent',
    'employee',
  ],
  statuses=[
    'unpaid',
    'partly_paid',
    'paid',
    'cash',
    'loan',
  ],
  keys={
    name:'', 
    type:'',
    profile_id:0,
    method:0,
    nominal:0,
    
    transaction_date:'',
    transaction_code:'',
    account:'',
    status:'',
  },
  limit=25,
  page=1,
  order_by='time',
  sorted='asc',
  query='select * from transaction',
  where=[];
  if(config.hasOwnProperty('studyYear')
    &&config.studyYear.toString().match(/^\d{4}\/\d{4}$/)
    &&config.studyYear!=''){
    let studyYear=config.studyYear.split('/'),
    yearMin=studyYear[0]+'-06-30',
    yearMax=studyYear[1]+'-07-01';
    where.push('date > "'+yearMin+'"');
    where.push('date < "'+yearMax+'"');
  }
  if(config.hasOwnProperty('name')&&config.name!=''){
    where.push('name="'+config.name+'"');
  }
  if(config.hasOwnProperty('type')&&config.type!=''){
    where.push('type="'+config.type+'"');
    if(config.hasOwnProperty('profile_id')
      &&config.profile_id.toString().match(/^\d+$/)
      &&config.profile_id!=''){
      where.push('profile_id='+config.profile_id);
    }
  }
  if(config.hasOwnProperty('status')&&config.status!=''){
    where.push('status="'+config.status+'"');
  }
  if(config.hasOwnProperty('method')
    &&config.method.toString().match(/^\d$/)
    &&config.method!=''){
    where.push('method='+config.method);
  }
  if(config.hasOwnProperty('nominal')
    &&config.nominal.toString().match(/^\d+$/)
    &&config.nominal!=''){
    where.push('nominal='+config.nominal);
  }
  if(config.hasOwnProperty('transaction_code')
    &&config.transaction_code!=''){
    where.push('transaction_code="'+config.transaction_code+'"');
  }
  if(config.hasOwnProperty('year')
    &&config.year.toString().match(/^\d{4}$/)
    &&config.year!=''){
    where.push('year='+config.year);
  }
  if(config.hasOwnProperty('month')
    &&config.month.toString().match(/^\d{1,2}$/)
    &&config.month!=''){
    where.push('month='+config.month);
  }
  if(where.length>0){
    query+=' where '+where.join(' and ');
  }
  if(config.hasOwnProperty('order_by')
    &&config.order_by!=''){
    order_by=config.order_by;
    if(config.hasOwnProperty('sorted')
      &&config.sorted!=''){
      sorted=config.sorted;
    }
    query+=' order by '+order_by+' '+sorted;
  }
  if(config.hasOwnProperty('limit')
    &&config.limit.toString().match(/^\d+$/)
    &&config.limit!=''){
    limit=parseInt(config.limit);
    if(config.hasOwnProperty('page')
      &&config.page.toString().match(/^\d+$/)
      &&config.page!=''){
      page=parseInt(config.page);
    }
    let start=(page-1)*limit;
    query+=' limit '+start+','+limit;
  }
  return query;
};
this.selector=function(config,dtype){
  config=typeof config==='object'&&config!==null?config:{};
  let name=document.createElement('select'),
  type=document.createElement('select'),
  profile_id=document.createElement('select'),
  method=document.createElement('select'),
  status=document.createElement('select'),
  month=document.createElement('select'),
  year=document.createElement('select'),
  studyYear=document.createElement('select'),
  nominal=document.createElement('input'),
  tcode=document.createElement('input'),
  methods=['Keluar','Masuk'],
  nameAll=document.createElement('option'),
  typeAll=document.createElement('option'),
  statusAll=document.createElement('option'),
  monthAll=document.createElement('option'),
  yearAll=document.createElement('option'),
  methodAll=document.createElement('option'),
  pidAll=document.createElement('option'),
  val=null;
  /* name */
  nameAll.value='';
  nameAll.textContent='Semua';
  name.append(nameAll);
  name.id='transkey-name';
  for(let tos of this.selection.name){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('name')&&config.name==tos){
      val.selected='selected';
    }
    name.append(val);
  }
  /* type */
  typeAll.value='';
  typeAll.textContent='Semua';
  type.append(typeAll);
  type.id='transkey-type';
  for(let tos of this.selection.type){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('type')&&config.type==tos){
      val.selected='selected';
    }
    type.append(val);
  }
  /* status */
  statusAll.value='';
  statusAll.textContent='Semua';
  status.append(statusAll);
  status.id='transkey-status';
  for(let tos of this.selection.status){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('status')&&config.status==tos){
      val.selected='selected';
    }
    status.append(val);
  }
  /* month */
  monthAll.value='';
  monthAll.textContent='Semua';
  month.append(monthAll);
  month.id='transkey-month';
  for(let tos of _Pesantrian.range(0,11)){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('month')&&tos===parseInt(config.month)){
      val.selected='selected';
    }
    month.append(val);
  }
  /* year */
  yearAll.value='',
  yearAll.textContent='Semua';
  year.append(yearAll);
  year.id='transkey-year';
  for(let tos of this.selection.year){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(config.hasOwnProperty('year')&&tos==config.year){
      val.selected='selected';
    }
    year.append(val);
  }
  /* studyYear */
  studyYear.id='transkey-studyYear';
  let thisStudyYear=config.hasOwnProperty('studyYear')
    ?config.studyYear:this.getStudyYear();
  for(let tos of this.selection.studyYear){
    val=document.createElement('option');
    val.value=tos;
    val.textContent=this.alias(tos);
    if(tos==thisStudyYear){
      val.selected='selected';
    }
    studyYear.append(val);
  }
  /* method */
  methodAll.value='';
  methodAll.textContent='Semua';
  method.append(methodAll);
  method.id='transkey-method';
  for(let tos in methods){
    val=document.createElement('option');
    val.value=tos+'';
    val.textContent=methods[tos];
    if(config.hasOwnProperty('method')&&config.method==tos){
      val.selected='selected';
    }
    method.append(val);
  }
  /* profile_id */
  pidAll.value='';
  pidAll.textContent='Semua';
  profile_id.append(pidAll);
  profile_id.id='transkey-profile_id';
  let users=config.hasOwnProperty('type')
    &&dtype.hasOwnProperty(config.type)
    ?dtype[config.type]:[];
  if(users.length>0){
    profile_id=_Pesantrian.findSelect({
      id:'transkey-profile_id',
      key:'profile_id',
      value:0,
      data:users,
      placeholder:this.alias(config.type?config.type:'student')+'...',
      callback:function(r){
        let res=document.getElementById('finder-result-profile_id');
        if(res){
          res.value=r.id;
        }
        _PesantrianFinance.transkeyExec();
      },
    });
  }
  /* transaction_code */
  tcode.type='text';
  tcode.id='transkey-transaction_code';
  tcode.placeholder=this.alias('transaction_code');
  if(config.hasOwnProperty('transaction_code')){
    tcode.value=config.transaction_code;
  }
  
  name.onchange=()=>{
    this.transkeyExec();
  };
  type.onchange=()=>{
    this.transkeyExec();
  };
  status.onchange=()=>{
    this.transkeyExec();
  };
  month.onchange=()=>{
    this.transkeyExec();
  };
  year.onchange=()=>{
    this.transkeyExec();
  };
  method.onchange=()=>{
    this.transkeyExec();
  };
  tcode.onkeyup=function(e){
    if(e.keyCode!=13){
      return;
    }
    _PesantrianFinance.transkeyExec();
  };
  studyYear.onchange=()=>{
    this.transkeyExec();
  };
  
  return {name,type,status,method,profile_id,transaction_code:tcode,month,year,studyYear};
};
this.transkeyExec=function(){
  let name=document.getElementById('transkey-name'),
  type=document.getElementById('transkey-type'),
  status=document.getElementById('transkey-status'),
  method=document.getElementById('transkey-method'),
  profile_id_old=document.getElementById('transkey-profile_id'),
  profile_id=document.getElementById('finder-result-profile_id'),
  tcode=document.getElementById('transkey-transaction_code'),
  month=document.getElementById('transkey-month'),
  year=document.getElementById('transkey-year'),
  studyYear=document.getElementById('transkey-studyYear'),
  config={
    name:name.value,
    type:type.value,
    status:status.value,
    method:method.value,
    profile_id:profile_id?profile_id.value:profile_id_old.value,
    transaction_code:tcode.value,
    month:month.value,
    year:year.value,
    studyYear:studyYear.value,
  };
  return this.tableTransaction(config);
};

/* ---------- inner o ---------- */
this.getCredit=function(profile_id,data=[],type='student'){
  let res=type=='employee'?100*1000:0;
  for(let i of data){
    if(i.profile_id==profile_id&&i.type==type){
      res-=parseInt(i.nominal);
    }
  }return res;
};
this.parseDate=function(value){
  let date=new Date(value),
  options={
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
  };
  return date.toLocaleDateString('id-ID',options);
};
this.parseNominal=function(nominal){
  let rupiah=new Intl.NumberFormat('id-ID',{
    style:'currency',
    currency:'IDR',
    maximumFractionDigits:0,
  });
  return rupiah.format(nominal);
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
      if(arguments[tk].toString().match(/^\d+$/)){
        td.classList.add('td-left');
      }
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


