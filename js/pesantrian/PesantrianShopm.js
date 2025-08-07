
/* PesantrianShopm */
;function PesantrianShopm(app){
this.app=app;
this.aliasData={
  name:'Keterangan',
  nominal:'Nominal',
  method:'Arus Dana',
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
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianShopm.billScannerForm();
      }
    },
    {
      name:'form4',
      title:'Report',
      callback:function(e){
        _PesantrianShopm.billReport();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianShopm.checkCredit();
      }
    },
  ],
  appsLower=[
    {
      name:'qrcode',
      title:'QRScan',
      callback:function(e){
        _PesantrianShopm.billScannerForm();
      }
    },
    {
      name:'qrcode',
      title:'QRCheck',
      callback:function(e){
        _PesantrianShopm.checkCredit();
      }
    },
  ],
  appOlder=[
    {
      name:'bill',
      title:'Keuangan',
      callback:function(e){
        _PesantrianShopm.tableBill();
      }
    },
    {
      name:'form3',
      title:'Stock Opname',
      callback:function(e){
        _PesantrianShopm.opname();
      }
    },
  ],
  theapps=_Pesantrian.user.privilege>=4?apps:appsLower,
  adminApps=_Pesantrian.buildApps(theapps);
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
  window._PesantrianShopm=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* stock opname -- new database */
this.opname=async function(){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let title='STOCK OPNAME',
  row=this.rowHead(title,6),
  table=this.table();
  table.append(row);
  row=this.row(
    'NO',
    'Nama Barang',
    'Jenis Barang',
    'Satuan',
    'Harga Pokok', /* jumlah dan nilai */
    'Harga Jual Satuan', /* jumlah dan nilai */
  );
  row.classList.add('tr-head');
  table.append(row);
  this.app.body.append(table);

};
this.opnameTamplate=function(){
  return {
    nama_barang:'',
    jenis_barang:'minuman',
    satuan:'',
    harga_pokok:0,
    harga_jual_satuan:0,
    persedian_awal:0, /* jumlah dan nilai */
    penjualan:0, /* jumlah dan nilai */
    barang_masuk:0, /* jumlah dan nilai */
    persediaan_akhir:0, /* jumlah dan nilai */
    persediaan_fisik:0, /* jumlah dan nilai */
    selisih_kurang_lebih:0, /* jumlah dan nilai */
  };
};

/* template jkm -- jurnal kas masuk */
this.templateJKM=function(){
  return {
    tanggal:'',
    keterangan:'',
    ref:'',
    debet:0, /* kas */
    kredit:0, /* penjualan, komisi konsinyasi, piutang, return pembelian */
    total:0, /* kas, penjualan dan komisi */
  };
};
/* template jkk -- jurnal kas keluar */
this.tempaleJKK=function(){
  return {
    tanggal:'',
    keterangan:'',
    ref:'',
    debet:0, /* pembelian, utang, akun, serba-serbi */ 
    kredit:0, /* kas, potongan pembelian */ 
    total:0, /* kas dan pembelian */
  };
};
/* laporan laba-rugi */
this.templateLabaRugi=function(){
  return {

  };
};


/* qrscanner -- bill */
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
      transaction_code:'qrbill_shopm',
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
        +student_id+' and name="saving" ',
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
    qrQuery='insert into shopm_qrbill '+qrInnerQuery,
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
  query='select * from shopm_qrbill where year='+year+' and month='+month+' and date='+date,
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
this.billReport=async function(date,month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      this.init();
    })
  );
  /* month and year and table */
  date=date||(new Date).getDate();
  month=typeof month==='number'?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  /* month and year and table */
  let query='select * from shopm_qrbill where year='
    +year+' and month='+month+' and date='+date
    +' ',
  title='Bill Report',
  total=0,
  loader=_Pesantrian.loader(),
  queries=[
    query,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  row=this.rowHead(title,4),
  table=this.table();
  loader.remove();
  table.append(row);
  this.app.body.append(table);
  /* selector */
  let mdates=[31,year%4==0?29:28,31,30,31,30,31,31,30,31,30,31],
  sdate=document.createElement('select'),
  smonth=document.createElement('select'),
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
  for(let dt of _Pesantrian.range(1,mdates[month])){
    let opt=document.createElement('option');
    opt.value=dt;
    opt.textContent=dt;
    if(dt==date){
      opt.selected='selected';
    }
    sdate.append(opt);
  }
  sdate.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  smonth.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
      parseInt(smonth.value),
      parseInt(syear.value),
    );
  };
  syear.onchange=()=>{
    this.billReport(
      parseInt(sdate.value),
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
  row=this.row('Tanggal',sdate);
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
      bill.student_name,
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


/* keuangan */
this.addBill=function(month,year){
  this.clearBody();
  month=month||(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let lines=this.templateBill(),
  row=this.rowHead('INPUT TRANSAKSI<br />'
    +'Bulan '+this.month[month]+' '+year,2),
  table=this.table();
  table.append(row);
  lines.month=month;
  lines.year=year;
  for(let key in lines){
    let value=lines[key],
    val=document.createElement('input');
    val.name=key;
    val.value=value;
    if(['month','year'].indexOf(key)>=0){
      val.type='hidden';
      this.app.body.append(val);
      continue;
    }else if(key=='method'){
      val=_Pesantrian.radioMethodBill(value);
    }else{
      val.type=key=='nominal'?'number':'text';
      val.placeholder=this.alias(key)+'...';
      val.classList.add('kitchen-find');
    }
    row=this.row(this.alias(key),val);
    table.append(row);
  }
  
  this.app.body.append(table);
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableBill(month,year);
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
    query='insert into "shop" '+innerQuery,
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
        await this.tableBill(month,year);
      },1600);
    }
  };
  
};
this.tableBill=async function(month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  month=month?month:(new Date).getMonth();
  year=year||(new Date).getFullYear();
  let loader=_Pesantrian.loader(),
  queries=[
    'select * from shop where month='+month+' and year='+year,
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  thisMonth=(new Date).getMonth(),
  thisYear=(new Date).getFullYear(),
  add=document.createElement('input'),
  title='KEUANGAN KANTIN<br />'+this.month[month]+' '+year,
  row=this.rowHead(title,5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row(
    'Tgl',
    'Keterangan',
    'Kredit',
    'Debet',
    year==thisYear&&month==thisMonth?add:'',
  );
  row.classList.add('tr-head');
  table.append(row);
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.dataset.month=''+month;
  add.dataset.year=''+year;
  add.onclick=function(){
    _PesantrianShopm.addBill(this.dataset.month,this.dataset.year);
  };
  /* month selector */
  let monsel=document.createElement('select'),
  studyYear=thisMonth<6?[thisYear-1,thisYear]:[thisYear,thisYear+1];
  monsel.classList.add('extra-high');
  for(let eyear of _Pesantrian.range(2024,2030)){
    for(let mon of _Pesantrian.range(0,11)){
      let opt=document.createElement('option');
      opt.value=[mon,eyear].join(':');
      opt.textContent=this.month[mon]+' '+eyear;
      if(month==mon&&year==eyear){
        opt.selected='selected';
      }
      monsel.append(opt);
    }
  }
  monsel.onchange=async function(){
    let dval=this.value,
    val=dval.split(':');
    await _PesantrianShopm.tableBill(val[0],val[1]);
  };
  row=this.row('','','','',monsel);
  table.append(row);
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
        let query='delete from shop where id='
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
    tgl=(new Date(item.time*1000)).getDate();
    if(item.method==1){
      row=this.row(
        tgl,item.name,nominal,'',
        year==thisYear&&month==thisMonth?del:'',
      );
      totalPlus+=parseInt(item.nominal);
    }else{
      row=this.row(
        tgl,item.name,'',nominal,
        year==thisYear&&month==thisMonth?del:'',
      );
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
  row.classList.add('tr-head');
  row.id='shop-total';
  table.append(row);
  this.app.body.append(table);
};


this.templateBill=function(){
  return {
    name:'',
    nominal:0,
    method:0,
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


