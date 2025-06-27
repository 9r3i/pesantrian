

(async function(){
  const cr=new card(10);
  await cr.start(0,34,true,3);
})();


function card(limit){
this.version='1.0.0';
this.limit=limit||10;

this.start=async function(act=0,id=0,all=true,count=1){
  if(act==1){
    this.fetch();
    return;
  }
  if(act==2){
    this.termParse();
    return;
  }
  if(act==3){
    let data=this.presenceData(1,52,2501);
    this.presenceParse(data);
    return;
  }
  if(act==4){
    this.fetchEmployee();
    return;
  }
  if(act==5){
    let data=this.defaultDataEmployee().result;
    this.parseEmployee(data,id,all);
    return;
  }
  if(act==6){
    this.cardList(1,limit);
    return;
  }
  let data=this.defaultData().result;
  if(id>0){
    let ndata=[],
    nd=this.getDataByKey('id',id,data);
    for(let c=0;c<count;c++){
      ndata.push(nd);
    }
    this.parse(ndata);
    return;
  }else if(Array.isArray(id)){
    let ndata=[];
    for(let i of data){
      if(id.indexOf(i.id)>=0){
        for(let c=0;c<count;c++){
          ndata.push(i);
        }
      }
    }
    this.parse(ndata);
    return;
  }
  this.parse(data);
};
/*  */
this.cardList=function(start=1,limit=10){
  for(let i=start;i<=limit;i++){
    /* create ns */
    let ns=i.toString(36).padStart(8,'0'),
    nid=i+1000000,
    expire=(new Date).getTime()+(3*365*24*3600*1000),
    ndate=new Date(expire),
    qrcode=btoa([
      'x',
      ns,
      'xcard',
      expire,
    ].join(':')).split('').reverse().join(''),
    /* create elements */
    el=document.createElement('div'),
    image=document.createElement('img'),
    ibg=document.createElement('img'),
    qr=document.createElement('div'),
    name=document.createElement('div'),
    nis=document.createElement('div');
    /*  */
    el.classList.add('card');
    el.classList.add('card-dark');
    image.classList.add('header');
    qr.classList.add('qrcode');
    name.classList.add('name');
    nis.classList.add('nis');
    ibg.classList.add('ibg');
    /*  */
    el.append(image);
    el.append(qr);
    el.append(name);
    el.append(nis);
    el.append(ibg);
    image.alt='';
    image.src='images/logo-aatibs-tosca-cutted.png';
    image.width=164;
    ibg.alt='';
    ibg.src='images/logo-al-anshary-software-700x197.png';
    qr.id=i;
    name.innerText=nid;
    nis.innerText=[
      ndate.getFullYear(),
      (ndate.getMonth()+1).toString().padStart(2,'0'),
      ndate.getDate().toString().padStart(2,'0')
    ].join('-');
    /*  */
    document.body.append(el);
    this.qrPut(qr,qrcode);
  }
};
/*  */
this.fetch=async function(){
  let evac=new eva({
    host:'https://hotelbandara.com/api/eva/',
    apiVersion:'1.0.4',
    token:'eva1.0aaurwiLQfNaCB2Yh47.vHhCajU_KB4Rq6rwiO901zIdJ5OGuvqOUe255iI_ZEVEl3aYOnR2XL3fc4re',
    authentication:'eva1.6wiLQfNaav2aCB2Yh47.vHhCajUbxuLHloam0DpR26DrA7C9OyU7xakS0dv.Jr1vD3W2mFvEMMb6MHsG',
  }),
  res=await evac.request({
    query:`call ldb ['localhost','aisyah','master','atibs'] query "select id,name,nis,graduated,gender from student where graduated=0"`,
  }),
  data=evac.parse(res).result;
  if(data){
    //document.body.append(JSON.stringify(data));
    let pre=document.createElement('pre');
    pre.append(res);
    document.body.append(pre);
    return;
  }
};
/*  */
this.fetchEmployee=async function(){
  let evac=new eva({
    host:'https://hotelbandara.com/api/eva/',
    apiVersion:'1.0.4',
    token:'eva1.0aaurwiLQfNaCB2Yh47.vHhCajU_KB4Rq6rwiO901zIdJ5OGuvqOUe255iI_ZEVEl3aYOnR2XL3fc4re',
    authentication:'eva1.6wiLQfNaav2aCB2Yh47.vHhCajUbxuLHloam0DpR26DrA7C9OyU7xakS0dv.Jr1vD3W2mFvEMMb6MHsG',
  }),
  res=await evac.request({
    query:`call ldb ['localhost','aisyah','master','atibs'] query "select id,name,position from employee"`,
  }),
  data=evac.parse(res).result;
  if(data){
    //document.body.append(JSON.stringify(data));
    let pre=document.createElement('pre');
    pre.append(res);
    document.body.append(pre);
    return;
  }
};
/*  */
this.termParse=function(){
  for(let i=0;i<this.limit;i++){
    let el=document.createElement('div'),
    ibg=document.createElement('img'),
    ol=this.term();
    el.classList.add('term');
    ibg.classList.add('ibg');
    ibg.alt='';
    ibg.src='images/logo-al-anshary-software-700x197.png';
    el.append(ol);
    el.append(ibg);
    document.body.append(el);
  }
};
/*  */
this.term=function(){
  let ol=document.createElement('ol'),
  st=document.createElement('strong'),
  tc=[
    'Kartu hanya boleh dipindai oleh aplikasi ATIBS dan hanya boleh digunakan didalam area ma\'had. Serta akan mendapat penalti jika digunakan diluar aplikasi tersebut.',
    'Kartu tidak boleh dibawa keluar area ma\'had, dan wajib dikembalikan jika pulang atau masa pendidikan usai.',
    'Denda sebesar Rp. 10.000 (sepuluh ribu rupiah) jika kartu hilang atau rusak. Dan penalti tidak dapat menggunakan kartu selama 1 bulan.',
    'Kartu berfungsi untuk transaksi di Kantin dan Laundry ATIBS, serta untuk absensi Akademik dan Tahfizh.',
    'Kami berhak menutup akses kartu jika pemegang kartu melanggar ketentuan.',
    'Kami berhak merubah semua syarat dan ketentuan tanpa pemberitahuan terlebih dahulu.',
  ],
  counter=0;
  st.innerText='Syarat dan ketentuan:';
  ol.append(st);
  for(let i of tc){
    counter++;
    let li=document.createElement('li');
    li.innerText=i;
    ol.append(li);
  }
  return ol;
};
/*  */
this.presenceData=function(start=1,limit=10,idp=0){
  let res=[],
  sday=7*24*3600*1000,
  nd=new Date,
  ndate=nd.getDate(),
  end=start+limit;
  nd.setHours(23);
  if(nd.getDay()!=6){
    let nday=6-nd.getDay();
    nd.setDate(ndate+nday);
  }
  for(let i=start;i<end;i++){
    let dtime=nd.getTime(),
    nis=dtime+(i*sday)+(i*11111);
    res.push({
      id:i+idp,
      name:'KANTOR AISYAH',
      nis:nis,
    });
    res.push({
      id:i+idp,
      name:'DAPUR AISYAH',
      nis:nis,
    });
    res.push({
      id:i+idp,
      name:'KANTOR ABU BAKAR',
      nis:nis,
    });
  }
  return res;
};
/*  */
this.presenceParse=function(data){
  data=Array.isArray(data)?data:[];
  let limit=this.limit,
  counter=0;
  /*  */
  for(let d of data){
    counter++;
    /* create elements */
    let id=d.id,
    ns=d.id.toString(36).padStart(8,'0'),
    qrcode=btoa([
      'ep',
      ns,
      d.name,
      d.nis,
    ].join(':')).split('').reverse().join(''),
    el=document.createElement('div'),
    image=document.createElement('img'),
    ibg=document.createElement('img'),
    qr=document.createElement('div'),
    name=document.createElement('div'),
    nis=document.createElement('div');
    /*  */
    el.classList.add('presence');
    image.classList.add('header');
    qr.classList.add('qrcode');
    name.classList.add('name');
    nis.classList.add('nis');
    ibg.classList.add('ibg');
    /*  */
    /*  */
    /*  */
    el.append(image);
    el.append(qr);
    el.append(name);
    el.append(nis);
    el.append(ibg);
    image.alt='';
    image.src='images/logo-aatibs-tosca-cutted.png';
    image.width=164;
    ibg.alt='';
    ibg.src='images/logo-al-anshary-software-700x197.png';
    qr.id=id;
    name.innerText=d.name;
    nis.innerText=d.nis;
    
    
    document.body.append(el);
    this.qrPut(qr,qrcode);
    if(counter>=limit){break;}
  }
};
/*  */
this.parseEmployee=function(data,ids=[],all=true){
  data=Array.isArray(data)?data:[];
  ids=Array.isArray(ids)?ids:[];
  let limit=this.limit,
  counter=0;
  /*  */
  for(let d of data){
    if(!all&&ids.indexOf(d.id)<0){
      continue;
    }
    counter++;
    let tables=d.id==3
      ?['e','eq','e','eq','e','eq','e','eq','e','eq',]
      :['eq'],
    passes=[7,];
    if(d.position=='resign'||passes.indexOf(d.id)>=0){
      continue;
    }
    for(let table of tables){
      /* create elements */
      let id=d.id,
       ns=d.id.toString(36).padStart(8,'0'),
      nid=parseInt(d.id,10)+(table=='e'?11000:1000),
      expire=(new Date).getTime()+(3*365*24*3600*1000),
      qrcode=btoa([
        table,
        ns,
        d.name,
        (table=='e'?nid:expire),
      ].join(':')).split('').reverse().join(''),
      el=document.createElement('div'),
      image=document.createElement('img'),
      ibg=document.createElement('img'),
      qr=document.createElement('div'),
      name=document.createElement('div'),
      nis=document.createElement('div');
      /*  */
      el.classList.add('card');
      image.classList.add('header');
      qr.classList.add('qrcode');
      name.classList.add('name');
      nis.classList.add('nis');
      ibg.classList.add('ibg');
      /*  */
      if(table=='e'){
        el.classList.add('card-dark');
      }
      /*  */
      el.append(image);
      el.append(qr);
      el.append(name);
      el.append(nis);
      el.append(ibg);
      image.alt='';
      image.src='images/logo-aatibs-tosca-cutted.png';
      image.width=164;
      ibg.alt='';
      ibg.src='images/logo-al-anshary-software-700x197.png';
      qr.id=id;
      name.innerText=d.name;
      nis.innerText=nid;
      /*  */
      document.body.append(el);
      this.qrPut(qr,qrcode);
    } /* end of for table */
    if(counter>=limit){break;}
  }
};
/*  */
this.parse=function(data){
  data=Array.isArray(data)?data:[];
  let limit=this.limit,
  counter=0;
  /*  */
  for(let d of data){
    counter++;
    /* create elements */
    let id=d.id,
    ns=d.id.toString(36).padStart(8,'0'),
    qrcode=btoa([
      's',
      ns,
      d.name,
      d.nis
    ].join(':')).split('').reverse().join(''),
    el=document.createElement('div'),
    image=document.createElement('img'),
    ibg=document.createElement('img'),
    qr=document.createElement('div'),
    name=document.createElement('div'),
    nis=document.createElement('div');
    /*  */
    el.classList.add('card');
    image.classList.add('header');
    qr.classList.add('qrcode');
    name.classList.add('name');
    nis.classList.add('nis');
    ibg.classList.add('ibg');
    /*  */
    /*  */
    /*  */
    el.append(image);
    el.append(qr);
    el.append(name);
    el.append(nis);
    el.append(ibg);
    image.alt='';
    image.src='images/logo-aatibs-tosca-cutted.png';
    image.width=164;
    ibg.alt='';
    ibg.src='images/logo-al-anshary-software-700x197.png';
    qr.id=id;
    name.innerText=d.name;
    nis.innerText=d.nis;
    
    
    document.body.append(el);
    this.qrPut(qr,qrcode);
    if(counter>=limit){break;}
  }
};
/*  */
this.test=function(){
  let code=this.qrEncode('s',23,'AANG',124);
  console.log(code);
  let obj=this.qrDecode(code);
  console.log(obj);
};
/*  */
this.qrEncode=function(table='',id=0,name='',space=''){
  if(id<=0){
    if(!table.match(/^[0-9a-z\+\/]+$/i)){
      return false;
    }
    let a='ABCDEFGHIJKLMNOPQRSTUPWXYZ'
         +'abcdefghijklmnopqrstupwxyz'
         +'0123456789/+',
    b=a.split('').reverse(),
    c=a.split(''),
    map={},res='';
    for(let i in c){
      map[c[i]]=b[i];
    }
    for(let i=0;i<table.length;i++){
      let k=table[i];
      res+=map.hasOwnProperty(k)?map[k]:'';
    }
    return res;
  }
  let raw=btoa([
    table,
    id.toString(36).padStart(8,'0'),
    name,
    space,
  ].join(':'))
  .split('').reverse().join('')
  .replace(/=/g,'');
  return this.qrEncode(raw);
};
/*  */
this.qrDecode=function(str='',first=''){
  if(first==''){
    if(!str.match(/^[0-9a-z\+\/]+$/i)){
      return false;
    }
    let a='ABCDEFGHIJKLMNOPQRSTUPWXYZ'
         +'abcdefghijklmnopqrstupwxyz'
         +'0123456789/+',
    b=a.split('').reverse(),
    c=a.split(''),
    map={},res='';
    for(let i in b){
      map[b[i]]=c[i];
    }
    for(let i=0;i<str.length;i++){
      let k=str[i];
      res+=map.hasOwnProperty(k)?map[k]:'';
    }
    return this.qrDecode(res,str);
  }
  let res=false;
  try{
  let base=str.split('').reverse().join(''),
  data=atob(base).split(':');
  res={
    table:data[0]||'',
    id:parseInt(data[1]||'0',0x24),
    name:data[2]||'',
    space:data[3]||'',
    data:data,
    raw:str,
    origin:first,
  };
  }catch(e){}
  return res;
};
/*  */
this.qrPut=function(id,data){
  new QRCode(id,{
    text:data,
    width:144,
    height:144,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
};
/* default data employee */
this.defaultDataEmployee=function(){
  return {
    "code": 107,
    "status": "OK",
    "message": "Successfully executed.",
    "query": "call ldb ['localhost','aisyah','master','atibs'] query \"select id,name,position from employee\"",
    "result": []
};
};
/* default data */
this.defaultData=function(){
  return {
    "code": 107,
    "status": "OK",
    "message": "Successfully executed.",
    "query": "call ldb ['localhost','aisyah','master','atibs'] query \"select id,name,nis,graduated,gender from student where graduated=0\"",
    "result": []
  };
};
/*  */
this.getDataByKey=function(key='',value='',data=[],unbreak=false){
  data=Array.isArray(data)?data:[];
  let res=unbreak?[]:null;
  for(let i of data){
    if(i.hasOwnProperty(key)&&i[key]==value){
      if(unbreak){
        res.push(i);
      }else{
        res=i;
        break;
      }
    }
  }
  return res;
};
/*  */
this.temp=function(){
  
};
}


