
/* PesantrianMaintenance */
;function PesantrianMaintenance(app){
this.app=app;
this.aliasData={
  name:'Nama Barang',
  item_code:'Kode Barang',
  quantity:'Quantity',
  condition:'Kondisi',
};
this.table=_Pesantrian.table;
this.row=_Pesantrian.row;
this.rowHead=_Pesantrian.rowHead;
this.places=[
    'gudang',
    'kelas-7',
    'kelas-8',
    'kelas-9',
    'kelas-10',
    'kelas-11',
    'kelas-12',
    'kantor-mudir',
    'kantor-bendahara',
    'kantor-media',
    'kantor-ikhwan',
    'kantor-ruang-tamu',
    'kantor-kamar-tamu',
    'kantor-receptionist',
    'kantor-dapur',
    'kantor-toilet',
    'masjid',
    'toilet-akhwat-1-masjid',
    'toilet-akhwat-2-masjid',
    'toilet-ikhwan-masjid',
    'dapur',
    'toilet-dapur',
    'peralatan-kebersihan',
    'kantin',
    'perpustakaan',
    'ruang-lab',
    'aula-dapur',
    'ruang-rapat',
    'ukm',
    'klinik',
    'kantor-keasramaan',
    'kantor-tahfizh',
    'guest-house',
    'asrama-bawah-1',
    'asrama-bawah-2',
    'asrama-bawah-3',
    'asrama-bawah-4',
    'asrama-bawah-5',
    'asrama-bawah-6',
    'gedung-serbaguna',
    'asrama-mudir',
    'asrama-asma',
    'asrama-erwin',
    'asrama-guru-1',
    'asrama-guru-2',
    'asrama-guru-3',
    'asrama-guru-4',
    'asrama-marwah-1',
    'asrama-marwah-2',
    'asrama-marwah-3',
    'asrama-marwah-4',
    'asrama-marwah-5',
    'asrama-marwah-6',
    'asrama-shofa-1',
    'asrama-shofa-2',
    'asrama-shofa-3',
    'asrama-shofa-4',
    'asrama-shofa-5',
    'asrama-shofa-6',
    'asrama-arafah-1',
    'asrama-arafah-2',
    'asrama-arafah-3',
    'asrama-arafah-4',
    'asrama-arafah-5',
    'asrama-arafah-6',
    'toilet-marwah',
    'toilet-shofa',
    'toilet-arafah',
    'lorong-shofa',
    'lorong-marwah',
    'lorong-arafah',
    'laundry',
    'pos-security-1',
    'pos-security-2',
    'electronic',
    'other-1',
    'other-2',
    'other-3',
    'temporary',
    '----------------',
    'kelas-7-abu-bakar',
    'kelas-8-abu-bakar',
    'kelas-9-abu-bakar',
    'kelas-10-abu-bakar',
    'kelas-11-abu-bakar',
    'kelas-12-abu-bakar',
    'kantor-abu-bakar',
    'dapur-abu-bakar',
    'masjid-abu-bakar',
    'peralatan-kebersihan-abu-bakar',
    'gudang-1-abu-bakar',
    'gudang-2-abu-bakar',
    'kantin-abu-bakar',
    'saung-kebun-abu-bakar',
    'asrama-hanzhalah-abu-bakar',
    'asrama-umair-abu-bakar',
];

this.months=[
  'JANUARY',
  'FEBRUARY',
  'MARET',
  'APRIL',
  'MEI',
  'JUNI',
  'JULI',
  'AGUSTUS',
  'SEPTEMBER',
  'OKTOBER',
  'NOVEMBER',
  'DESEMBER',
];
this.monthTA=[6,7,8,9,10,11,0,1,2,3,4,5,];

this.init=async function(){
  this.app.menuButton.remove();
  
  /* inside apps */
  let apps=[
    {
      name:'inventory',
      title:'Inventory',
      callback:function(e){
        _PesantrianMaintenance.tableInventory();
      }
    },
    {
      name:'form3',
      title:'Laporan',
      callback:function(e){
        _PesantrianMaintenance.tableReport('report');
      }
    },
    {
      name:'form4',
      title:'Anggaran',
      callback:function(e){
        _PesantrianMaintenance.tableReport('budget');
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
  window._PesantrianMaintenance=this;
  /* next execution */
  if(typeof this.app.next==='string'
    &&typeof this[this.app.next]==='function'){
    let args=Array.isArray(this.app.args)?this.app.args:[];
    return this[this.app.next].apply(this,args);
  }
};

/* report and budget */
this.tableReportMonthly=async function(type='report',month,year){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.tableReport(type);
    })
  );
  year=year||(new Date).getFullYear();
  month=month||(new Date).getMonth();
  let studyYear=this.getStudyYear().split('/'),
  thisYear=(new Date).getFullYear(),
  types={
    report:'LAPORAN KEUANGAN',
    budget:'ANGGARAN',
  },
  typer=types.hasOwnProperty(type)?types[type]:types['report'],
  loader=_Pesantrian.loader(),
  queries=[
    'select * from general where type="'+type+'" and year='+year+' and month='+month,
    'select * from general where type="receive" and year='+year+' and month='+month,
  ].join(';'),
  datas=await _Pesantrian.request('queries',queries),
  row=this.rowHead(typer+'<br />BAGIAN UMUM<br />BULAN '
    +this.months[month]+' '+year,6),
  nomor=1,
  total=0,
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  loader.remove();
  let add=document.createElement('input');
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    let rid='add-row', 
    nrow=document.getElementById(rid),
    note=document.createElement('input'),
    many=document.createElement('input'),
    price=document.createElement('input'),
    total=document.createElement('input'),
    submit=document.createElement('input');
    if(nrow){return;}
    nrow=this.row('',note,many,price,total,submit);
    nrow.id=rid;
    table.insertBefore(nrow,table.childNodes[2]);
    note.classList.add('extra-high');
    many.type='number';
    many.value='0';
    many.price=price;
    many.total=total;
    many.onkeyup=function(){
    };
    total.type='number';
    total.value='0';
    price.type='number';
    price.total=total;
    price.many=many;
    price.value='0';
    price.onkeyup=function(){
    };
    submit.type='submit';
    submit.value='Simpan';
    submit.classList.add('button-view');
    submit.classList.add('extra-high');
    submit.onclick=async ()=>{
      let loader=_Pesantrian.loader(),
      innerQuery=_Pesantrian.buildQuery({
        type,
        year,
        month,
        note:note.value,
        many:many.value,
        price:price.value,
        total:total.value,
      }),
      query='insert into general '+innerQuery,
      res=await _Pesantrian.request('query',query);
      loader.remove();
      this.tableReportMonthly(type,month,year);
    };
  };
  row=this.row('NO','Keterangan','Banyak','Harga','Jumlah',add);
  row.classList.add('tr-head');
  table.append(row);
  let dlData=[];
  for(let item of datas[0]){
    let del=document.createElement('input');
    del.type='submit';
    del.value='Hapus';
    del.classList.add('button-delete');
    del.classList.add('extra-high');
    del.dataset.id=item.id;
    del.dataset.note=item.note;
    del.dataset.total=item.total;
    del.onclick=async function(){
      let yes=await _Pesantrian.confirmX('Hapus data?',this.dataset.note);
      if(!yes){return;}
      this.disabled=true;
      let query='delete from general where id='+this.dataset.id,
      loader=_Pesantrian.loader(),
      el=document.getElementById('item-'+this.dataset.id),
      trow=document.getElementById('row-total'),
      res=await _Pesantrian.request('query',query);
      loader.remove();
      if(el){el.remove();}
      if(trow){
        let ctotal=parseInt(this.dataset.total),
        total=parseInt(trow.dataset.total)-ctotal;
        trow.dataset.total=total+'';
        trow.childNodes[1].innerHTML=_Pesantrian.parseNominal(total);
      }
    };
    row=this.row(nomor,
      item.note,
      item.many+' Kwitansi',
      _Pesantrian.parseNominal(item.price),
      _Pesantrian.parseNominal(item.total),
      del);
    table.append(row);
    row.childNodes[2].style.textAlign='right';
    row.childNodes[3].style.textAlign='right';
    row.childNodes[4].style.textAlign='right';
    row.id='item-'+item.id;
    total+=parseInt(item.total);
    dlData.push({
      NO:nomor,
      Keterangan:item.note,
      Banyak:item.many+' Kwitansi',
      Harga:_Pesantrian.parseNominal(item.price),
      Jumlah:_Pesantrian.parseNominal(item.total),
    });
    nomor++;
  }
  let dlb=document.createElement('input');
  dlb.type='submit';
  dlb.value='JSON';
  dlb.classList.add('button-view');
  dlb.classList.add('extra-high');
  dlb.onclick=()=>{
    _Pesantrian.downloadJSON(dlData);
  };
  row=this.row('Total Pengeluaran',_Pesantrian.parseNominal(total),dlb);
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].style.textAlign='center';
  row.childNodes[1].style.textAlign='right';
  row.classList.add('tr-head');
  row.dataset.total=total+'';
  row.id='row-total';
  table.append(row);
  /* summary */
  if(type!='report'){return;}
  row=this.rowHead('SUMMARY',6);
  table.append(row);
  let rtotal=datas[1].length>0?parseInt(datas[1][0].total):0,
  updateID=datas[1].length>0?datas[1][0].id:0,
  rspan=document.createElement('span'),
  rinput=document.createElement('input'),
  rsubmit=document.createElement('input');
  rinput.type='number';
  rinput.value=rtotal+'';
  rspan.innerHTML=_Pesantrian.parseNominal(rtotal);
  rspan.inputEl=rinput;
  rspan.onclick=function(){
    this.parentNode.append(this.inputEl);
    this.inputEl.focus();
    this.remove();
  };
  rsubmit.type='submit';
  rsubmit.value='Simpan';
  rsubmit.classList.add('button-view');
  rsubmit.classList.add('extra-high');
  rsubmit.dataset.id=updateID+'';
  rsubmit.inputEl=rinput;
  rsubmit.dataset.month=month;
  rsubmit.dataset.year=year;
  rsubmit.dataset.type=type;
  rsubmit.onclick=async function(){
    this.disabled=true;
    let loader=_Pesantrian.loader(),
    innerQuery=_Pesantrian.buildQuery({
      year:this.dataset.year,
      month:this.dataset.month,
      type:'receive',
      total:this.inputEl.value,
    }),
    query=this.dataset.id=='0'
      ?'insert into general '+innerQuery
      :'update general ('+innerQuery+') where id='+this.dataset.id,
    res=await _Pesantrian.request('query',query);
    loader.remove();
    _PesantrianMaintenance.tableReportMonthly(
      this.dataset.type,
      parseInt(this.dataset.month),
      parseInt(this.dataset.year)
    );
  };
  row=this.row('','Total Pemasukan',rspan,rsubmit);
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].style.textAlign='right';
  table.append(row);
  row=this.row('','Total Pengeluaran',_Pesantrian.parseNominal(total),'');
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].style.textAlign='right';
  table.append(row);
  row=this.row('','Sisa',_Pesantrian.parseNominal(rtotal-total),'');
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].style.textAlign='right';
  table.append(row);
  let ttd=new Image,
  ttdName=document.createElement('span');
  ttd.src='https://github.com/9r3i/pesantrian/releases/download/images/maintenance.signature.png';
  ttdName.innerText='Ustadz Wawan Wijaya';
  row=this.rowHead(ttd,6);
  row.childNodes[0].classList.add('ttd');
  row.childNodes[0].append(ttdName);
  table.append(row);
};
this.tableReport=function(type='report'){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  let studyYear=this.getStudyYear().split('/'),
  types={
    report:'LAPORAN KEUANGAN',
    budget:'ANGGARAN',
  },
  typer=types.hasOwnProperty(type)?types[type]:types['report'],
  thisYear=(new Date).getFullYear(),
  row=this.rowHead(typer+'<br />BAGIAN UMUM<br />Tahun Ajaran'
    +studyYear.join('/'),2),
  table=this.table();
  table.append(row);
  this.app.body.append(table);
  for(let mon of this.monthTA){
    let year=mon<6?studyYear[1]:studyYear[0],
    open=document.createElement('input');
    open.type='submit';
    open.value='Buka';
    open.classList.add('button-take');
    open.dataset.year=year;
    open.dataset.month=mon;
    open.dataset.type=type;
    open.onclick=function(){
      _PesantrianMaintenance.tableReportMonthly(
        this.dataset.type,
        parseInt(this.dataset.month),
        parseInt(this.dataset.year)
      );
    };
    row=this.row(this.months[mon]+' '+year,open);
    table.append(row);
  }
};

/* inventory */
this.addItem=function(place){
  this.clearBody();
  place=place?place:'gudang';
  let lines=this.templateItem(),
  row=this.rowHead('INPUT BARANG<br />Tempat: '+place,2),
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
      await this.tableInventory(place);
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
    data.place=place;
    if(false){
      alert(_Pesantrian.parser.likeJSON(data,3));
      return;
    }
    let innerQuery=_Pesantrian.buildQuery(data),
    query='insert into "maintenance_inventory" '+innerQuery,
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
        await this.tableInventory(place);
      },1600);
    }
  };
};
this.tableInventory=async function(place){
  this.clearBody();
  /* goback button */
  this.app.body.append(
    _Pesantrian.goback(async ()=>{
      await this.init();
    })
  );
  place=place?place:'gudang';
  let loader=_Pesantrian.loader(),
  places=this.places,
  queries=[
    'select * from maintenance_inventory where place="'+place+'"',
  ].join(';'),
  data=await _Pesantrian.request('queries',queries),
  items=data[0],
  add=document.createElement('input'),
  row=this.rowHead('MAINTENANCE INVENTORY<br />Tempat: '+place+'',5),
  table=this.table();
  loader.remove();
  table.append(row);
  row=this.row('Kode','Nama Barang','Qty',
    this.alias('condition'),add);
  row.classList.add('tr-head');
  table.append(row);
  /* add */
  add.type='submit';
  add.value='Tambah';
  add.classList.add('button-add');
  add.onclick=()=>{
    this.addItem(place);
  };
  /* place selector */
  let placeSelector=document.createElement('select');
  for(let pl of places){
    let opt=document.createElement('option');
    opt.value=pl;
    opt.textContent=pl;
    if(place==pl){
      opt.selected='selected';
    }
    placeSelector.append(opt);
  }
  placeSelector.onchange=async function(){
    await _PesantrianMaintenance.tableInventory(this.value);
  };
  /* finder */
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
  row=this.row('',find,'','',placeSelector);
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
        let query='delete from maintenance_inventory where id='
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

/* inner */
this.templateItem=function(){
  return {
    name:'',
    quantity:0,
    item_code:'',
    condition:'',
  };
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


