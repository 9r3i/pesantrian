

(async function(){
  const cr=new card(100),
  count=2,
  students=[
    162,168,166,160,161,164,167,
    152,150,156,148,157,151,158,149,
    
  ];
  await cr.start(0,students,true,count);
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
    apiVersion:'1.0.5',
    token:'eva1.9wiLQfNaCBagfb2Yh47.vHhCajU2YRthfCOoPX2z58KN9pKHOveLhAb2YmTj1YiIBl5EChZfmskZ4QWy',
    authentication:'eva1.ewiLQfNaCB2Yh47agfb.vHhCajU8JLPj4PaNZQ40QbtBJDLneZ8Z_J8FP_JuypTJNs2fAak9f5OGCS3u',
  }),
  res=await evac.request({
    query:`call ldb ['localhost','aisyah','master','atibs'] query "select id,name,nis,graduated,gender,item_code from student where graduated=0"`,
  }),
  data=evac.parse(res).result;
  if(data){
    //document.body.append(JSON.stringify(data));
    let textarea=document.createElement('textarea');
    textarea.textContent=res;
    document.body.append(textarea);
    return;
  }
};
/*  */
this.fetchEmployee=async function(){
  let evac=new eva({
    host:'https://hotelbandara.com/api/eva/',
    apiVersion:'1.0.5',
    token:'eva1.6wiLQfNafuyaCB2Yh47.vHhCajUVIckY2155QKgDJ_PR1o7IuwCvG3S_NfeE_XmUr88QFWINs3_oUcXK',
    authentication:'eva1.1wafuyiLQfNaCB2Yh47.vHhCajUra_68YDCPVG3WiVcP7x2JOBry8J8CpoVYkGOrzAlhem.RWd2oUpTa',
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
    nis.innerText=d.item_code;
    
    
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
    "result": [
        {
            "id": 1,
            "name": "AMAR SUPENA",
            "position": "admin"
        },
        {
            "id": 3,
            "name": "ABU AYYUB AL ANSHARY",
            "position": "it"
        },
        {
            "id": 4,
            "name": "RACHMAT ADHIPUTRA KUSUMAH",
            "position": "teacher"
        },
        {
            "id": 6,
            "name": "RINA FERIANTI",
            "position": "finance"
        },
        {
            "id": 7,
            "name": "YAYASAN AISYAH MULYA",
            "position": "finance"
        },
        {
            "id": 8,
            "name": "SUHARDI",
            "position": "teacher"
        },
        {
            "id": 9,
            "name": "KHURIYAH TAMMAH ABIDIN",
            "position": "tahfidz"
        },
        {
            "id": 10,
            "name": "NURANI NIANDIATI",
            "position": "teacher"
        },
        {
            "id": 11,
            "name": "ADIWARMAN RAHMATULLAH",
            "position": "resign"
        },
        {
            "id": 12,
            "name": "TINI RUSTINI",
            "position": "resign"
        },
        {
            "id": 13,
            "name": "IMAM TOBRONI",
            "position": "teacher"
        },
        {
            "id": 14,
            "name": "SITI MUTIAH",
            "position": "tahfidz"
        },
        {
            "id": 15,
            "name": "SHAFIRA SALSABILA PUTRI",
            "position": "resign"
        },
        {
            "id": 16,
            "name": "TSALITSA HILYAH ATQIYA",
            "position": "resign"
        },
        {
            "id": 17,
            "name": "NISMA KARMIAHTUN FADILAH",
            "position": "laundry"
        },
        {
            "id": 18,
            "name": "FARAH FADHILAH",
            "position": "dormitory"
        },
        {
            "id": 19,
            "name": "GISDA SALSABILA",
            "position": "resign"
        },
        {
            "id": 20,
            "name": "KHAIRUNNISA NUR RAHMATIKA",
            "position": "tahfidz"
        },
        {
            "id": 21,
            "name": "PUTRI MAUDIYAH",
            "position": "tahfidz"
        },
        {
            "id": 22,
            "name": "DINDA MAULIYAH",
            "position": "tahfidz"
        },
        {
            "id": 23,
            "name": "BALQIS FARID",
            "position": "resign"
        },
        {
            "id": 24,
            "name": "SALSABILA NUR'AINI",
            "position": "tahfidz"
        },
        {
            "id": 25,
            "name": "ARYATI",
            "position": "kitchen"
        },
        {
            "id": 26,
            "name": "WAWAN",
            "position": "maintenance"
        },
        {
            "id": 27,
            "name": "CAHYA CAMILA HAMIDAH",
            "position": "resign"
        },
        {
            "id": 28,
            "name": "HAYI MUNFARIDA NUR AMRINA",
            "position": "tahfidz"
        },
        {
            "id": 29,
            "name": "SIH HAYUNINGTYAS HESTUTAMI",
            "position": "teacher"
        },
        {
            "id": 30,
            "name": "MUHAMMAD ADHAN",
            "position": "maintenance"
        },
        {
            "id": 31,
            "name": "IWAN DORO",
            "position": "security"
        },
        {
            "id": 32,
            "name": "ENTIN SANTINAH",
            "position": "laundry"
        },
        {
            "id": 33,
            "name": "MOH. SOLAHUDIN",
            "position": "security"
        },
        {
            "id": 34,
            "name": "ERWIN RENDIANSYAH",
            "position": "security"
        },
        {
            "id": 35,
            "name": "ANI",
            "position": "laundry"
        },
        {
            "id": 36,
            "name": "SUWARTI",
            "position": "resign"
        },
        {
            "id": 37,
            "name": "KOKOM KOMALASARI ",
            "position": "clean"
        },
        {
            "id": 38,
            "name": "ENUR",
            "position": "resign"
        },
        {
            "id": 39,
            "name": "AFIFAH NURLAILI",
            "position": "resign"
        },
        {
            "id": 40,
            "name": "NEPI NURDIANTI",
            "position": "teacher"
        },
        {
            "id": 41,
            "name": "SITI NURJANNAH",
            "position": "resign"
        },
        {
            "id": 42,
            "name": "GHAZIN FAUZI",
            "position": "teacher"
        },
        {
            "id": 43,
            "name": "YAZID ABDUL ALIM",
            "position": "teacher"
        },
        {
            "id": 44,
            "name": "MUHAMMAD LAILY SYABANI",
            "position": "teacher"
        },
        {
            "id": 45,
            "name": "MUHAMMAD ALI ANDY MARIJAN",
            "position": "resign"
        },
        {
            "id": 46,
            "name": "TSALTSA NADIA ASSYIFA",
            "position": "media"
        },
        {
            "id": 47,
            "name": "AHMAD HAVIY HIZBULLOH",
            "position": "teacher"
        },
        {
            "id": 48,
            "name": "MOHAMAD SYAHDAN MUBAROK",
            "position": "teacher"
        },
        {
            "id": 49,
            "name": "ABDUL LATIEF",
            "position": "tahfidz"
        },
        {
            "id": 50,
            "name": "ISTIQLAL WIRASARJANA",
            "position": "tahfidz"
        },
        {
            "id": 51,
            "name": "RUKHUL QUDFALAH",
            "position": "teacher"
        },
        {
            "id": 52,
            "name": "MUHAMMAD RASYA",
            "position": "admin"
        },
        {
            "id": 53,
            "name": "ABDULLAH KARIM",
            "position": "teacher"
        },
        {
            "id": 54,
            "name": "GHINA AFLAH MUTHMAINNAH",
            "position": "teacher"
        },
        {
            "id": 55,
            "name": "ICA MARISA AGUSTIANI",
            "position": "teacher"
        },
        {
            "id": 56,
            "name": "SYIFA MAULINA",
            "position": "teacher"
        },
        {
            "id": 57,
            "name": "SITI ALVIAH",
            "position": "teacher"
        },
        {
            "id": 58,
            "name": "ADAM HIDAYATULLOH",
            "position": "teacher"
        },
        {
            "id": 59,
            "name": "MILLAH SAFINAH",
            "position": "tahfidz"
        },
        {
            "id": 60,
            "name": "RAHMI ANNISA",
            "position": "tahfidz"
        },
        {
            "id": 61,
            "name": "LUTHFIYAH AZIZAH",
            "position": "tahfidz"
        },
        {
            "id": 62,
            "name": "UMMI LATHIFAH",
            "position": "teacher"
        },
        {
            "id": 63,
            "name": "PRISNA WATI",
            "position": "tahfidz"
        },
        {
            "id": 64,
            "name": "HENGKI YUSMITO",
            "position": "teacher"
        },
        {
            "id": 65,
            "name": "YUMNA ZAKIYAH",
            "position": "teacher"
        },
        {
            "id": 66,
            "name": "RITA AGUSTINA FAUZI",
            "position": "clean"
        },
        {
            "id": 67,
            "name": "YUYU ST YUNINGSIH",
            "position": "teacher"
        },
        {
            "id": 68,
            "name": "CHONSA ABDATULLAH",
            "position": "tahfidz"
        }
    ]
};
};
/* default data */
this.defaultData=function(){
  return {
    "code": 107,
    "status": "OK",
    "message": "Successfully executed.",
    "query": "call ldb ['localhost','aisyah','master','atibs'] query \"select id,name,nis,graduated,gender,item_code from student where graduated=0\"",
    "result": [
        {
            "id": 36,
            "name": "AGHNIA AZZA",
            "gender": 0,
            "nis": "17180143",
            "item_code": "B-269",
            "graduated": 0
        },
        {
            "id": 37,
            "name": "ANJELITA MUTIARA HAKIM",
            "gender": 0,
            "nis": "17180158",
            "item_code": "B-345",
            "graduated": 0
        },
        {
            "id": 38,
            "name": "ANNIDA KHAIRUNNISA",
            "gender": 0,
            "nis": "17180145",
            "item_code": "B-273",
            "graduated": 0
        },
        {
            "id": 39,
            "name": "AQILA NEFEEZA AHMAD",
            "gender": 0,
            "nis": "17180157",
            "item_code": "B-342",
            "graduated": 0
        },
        {
            "id": 41,
            "name": "AZKIYA HUMAIRA AHMAD",
            "gender": 0,
            "nis": "17180156",
            "item_code": "B-341",
            "graduated": 0
        },
        {
            "id": 43,
            "name": "BISMI AULIA IZZAT",
            "gender": 0,
            "nis": "17180147",
            "item_code": "B-279",
            "graduated": 0
        },
        {
            "id": 44,
            "name": "CARISSA SALWA DZAKIRA",
            "gender": 0,
            "nis": "17180137",
            "item_code": "B-256",
            "graduated": 0
        },
        {
            "id": 45,
            "name": "DINDA ALBANI NUR ALISYA",
            "gender": 0,
            "nis": "17180138",
            "item_code": "B-257",
            "graduated": 0
        },
        {
            "id": 46,
            "name": "FAYZA KHAIRUNNISA",
            "gender": "0",
            "nis": "17180149",
            "item_code": "B-282",
            "graduated": 0
        },
        {
            "id": 49,
            "name": "NAURAH SALWA",
            "gender": 0,
            "nis": "17180154",
            "item_code": "B-339",
            "graduated": 0
        },
        {
            "id": 50,
            "name": "PUTRI BILQIS AL BANNA",
            "gender": "0",
            "nis": "17180141",
            "item_code": "B-267",
            "graduated": 0
        },
        {
            "id": 51,
            "name": "RAJNI CALLISTA EKWIE",
            "gender": "0",
            "nis": "17180152",
            "item_code": "B-337",
            "graduated": 0
        },
        {
            "id": 52,
            "name": "RUMAISHA ASSHABIRAH",
            "gender": 0,
            "nis": "17180142",
            "item_code": "B-268",
            "graduated": 0
        },
        {
            "id": 54,
            "name": "SALLY SABILA KANZHA",
            "gender": 0,
            "nis": "17180146",
            "item_code": "B-276",
            "graduated": 0
        },
        {
            "id": 55,
            "name": "SHENNON ALLEGRA FIDIANSYAH",
            "gender": 0,
            "nis": "17180148",
            "item_code": "B-281",
            "graduated": 0
        },
        {
            "id": 56,
            "name": "SYAKILA DZAKIRAH FIRMANSYAH",
            "gender": 0,
            "nis": "17180153",
            "item_code": "B-338",
            "graduated": 0
        },
        {
            "id": 57,
            "name": "SYAMILA FAIZAH",
            "gender": 0,
            "nis": "17180144",
            "item_code": "B-271",
            "graduated": 0
        },
        {
            "id": 58,
            "name": "TINA MUSTIKA",
            "gender": 0,
            "nis": "17180135",
            "item_code": "B-197",
            "graduated": 0
        },
        {
            "id": 60,
            "name": "MARYAM HAYA LANGITA",
            "gender": 0,
            "nis": "17180140",
            "item_code": "B-263",
            "graduated": 0
        },
        {
            "id": 63,
            "name": "IBNATY SYARIFA MUJAHIDAH",
            "gender": 0,
            "nis": "15160219",
            "item_code": "B-287",
            "graduated": 0
        },
        {
            "id": 65,
            "name": "KHADIJAH AZ ZAHRA",
            "gender": 0,
            "nis": "15160223",
            "item_code": "B-291",
            "graduated": 0
        },
        {
            "id": 69,
            "name": "RAIHANAH LAKEISHA",
            "gender": 0,
            "nis": "15160229",
            "item_code": "B-297",
            "graduated": 0
        },
        {
            "id": 71,
            "name": "RUMAISHAH ANDRIYANI",
            "gender": 0,
            "nis": "15160227",
            "item_code": "B-295",
            "graduated": 0
        },
        {
            "id": 72,
            "name": "SALAMAH",
            "gender": "0",
            "nis": "15160217",
            "item_code": "B-295",
            "graduated": 0
        },
        {
            "id": 73,
            "name": "SYIFA FAUZIYYAH WIJAYANTO",
            "gender": 0,
            "nis": "15160225",
            "item_code": "B-293",
            "graduated": 0
        },
        {
            "id": 74,
            "name": "ADINDA LAYLA HANIFA",
            "gender": 0,
            "nis": "15160241",
            "item_code": "B-315",
            "graduated": 0
        },
        {
            "id": 75,
            "name": "CUT SYIFA RAMADHANI",
            "gender": 0,
            "nis": "15160239",
            "item_code": "B-313",
            "graduated": 0
        },
        {
            "id": 76,
            "name": "HUWAIDATUL HANUUN",
            "gender": 0,
            "nis": "15160232",
            "item_code": "B-306",
            "graduated": 0
        },
        {
            "id": 77,
            "name": "LAREINA TRI DAHAYU ABIYYAH",
            "gender": 0,
            "nis": "15160238",
            "item_code": "B-312",
            "graduated": 0
        },
        {
            "id": 78,
            "name": "MAULIDA ZULEIKA FEBRIANTI",
            "gender": 0,
            "nis": "15160231",
            "item_code": "B-305",
            "graduated": 0
        },
        {
            "id": 79,
            "name": "MUTIARA KHANSA ABDILLAH",
            "gender": 0,
            "nis": "15160230",
            "item_code": "B-304",
            "graduated": 0
        },
        {
            "id": 80,
            "name": "NAILAH KHANSA AZZAHRA",
            "gender": 0,
            "nis": "15160236",
            "item_code": "B-310",
            "graduated": 0
        },
        {
            "id": 81,
            "name": "SARAH AMELIA",
            "gender": "0",
            "nis": "15160234",
            "item_code": "B-308",
            "graduated": 0
        },
        {
            "id": 82,
            "name": "ZANETTA MAULIDA FEBRUADISHA",
            "gender": "0",
            "nis": "15160235",
            "item_code": "B-309",
            "graduated": "0"
        },
        {
            "id": 83,
            "name": "ZULFA ZAHIRA",
            "gender": 0,
            "nis": "15160237",
            "item_code": "B-311",
            "graduated": 0
        },
        {
            "id": 85,
            "name": "KEISHA VADINE ADANI",
            "gender": 0,
            "nis": "15160242",
            "item_code": "B-319",
            "graduated": 0
        },
        {
            "id": 86,
            "name": "ANNISA QURROTU A'YUN",
            "gender": 0,
            "nis": "15160256",
            "item_code": "B-334",
            "graduated": 0
        },
        {
            "id": 87,
            "name": "AQILA KAISA RAMADHANI",
            "gender": 0,
            "nis": "15160250",
            "item_code": "B-328",
            "graduated": 0
        },
        {
            "id": 88,
            "name": "AURYNA SALSABILLA",
            "gender": 0,
            "nis": "15160246",
            "item_code": "B-324",
            "graduated": 0
        },
        {
            "id": 89,
            "name": "DANISHA ANIQ DZULKARNAIN",
            "gender": "0",
            "nis": "15160257",
            "item_code": "B-335",
            "graduated": 0
        },
        {
            "id": 90,
            "name": "HANA FATHIYAH PUTRI",
            "gender": 0,
            "nis": "15160252",
            "item_code": "B-330",
            "graduated": 0
        },
        {
            "id": 91,
            "name": "HAURA SHOFIA ALYASRI",
            "gender": 0,
            "nis": "15160254",
            "item_code": "B-332",
            "graduated": 0
        },
        {
            "id": 92,
            "name": "HUMAIRA",
            "gender": 0,
            "nis": "151610248",
            "item_code": "B-326",
            "graduated": 0
        },
        {
            "id": 94,
            "name": "KHALISHAH NABILA",
            "gender": "0",
            "nis": "15160249",
            "item_code": "B-327",
            "graduated": 0
        },
        {
            "id": 178,
            "name": "KHANSA AISHA MAZAYA",
            "gender": 0,
            "nis": "15160247",
            "item_code": "B-325",
            "graduated": 0
        },
        {
            "id": 96,
            "name": "NAJWA ARIFATUN NISA",
            "gender": "0",
            "nis": "15160245",
            "item_code": "B-323",
            "graduated": 0
        },
        {
            "id": 97,
            "name": "NAYLA ALIYA",
            "gender": 0,
            "nis": "15160251",
            "item_code": "B-329",
            "graduated": 0
        },
        {
            "id": 98,
            "name": "RAIHANAH ALIYATU DZAKIYYAH",
            "gender": 0,
            "nis": "15160259",
            "item_code": "B-344",
            "graduated": 0
        },
        {
            "id": 99,
            "name": "SHAFIYYAH ALHARITSAH",
            "gender": "0",
            "nis": "15160244",
            "item_code": "B-322",
            "graduated": 0
        },
        {
            "id": 100,
            "name": "SYAFITRI RAMADHANI",
            "gender": "0",
            "nis": "15160260",
            "item_code": "B-346",
            "graduated": 0
        },
        {
            "id": 101,
            "name": "SYARIFAH AVRILANA MUFIDATUNNISA",
            "gender": 0,
            "nis": "15160253",
            "item_code": "B-331",
            "graduated": 0
        },
        {
            "id": 102,
            "name": "THALITA AZA JABIRAH",
            "gender": 0,
            "nis": "15160255",
            "item_code": "B-333",
            "graduated": 0
        },
        {
            "id": 103,
            "name": "AZQIYA DENOVA HARUN",
            "gender": 0,
            "nis": "15160261",
            "item_code": "B-348",
            "graduated": 0
        },
        {
            "id": 104,
            "name": "ABDULLAH AL-MUTTAQII",
            "gender": 1,
            "nis": "20142015049",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 105,
            "name": "MUHAMMAD ATHA FAUZAN",
            "gender": "1",
            "nis": "20142015050",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 106,
            "name": "IFAT NIZAR NURROHIM",
            "gender": 1,
            "nis": "20142015051",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 107,
            "name": "MUHAMAD AS'HAR SYAHREJA",
            "gender": 1,
            "nis": "20142015052",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 108,
            "name": "ALDAN GHAZA REZVAN",
            "gender": 1,
            "nis": "20142015053",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 110,
            "name": "ABDULLAH AZZAM AL-QUDSI",
            "gender": "1",
            "nis": "20142015037",
            "item_code": "AB 38",
            "graduated": "0"
        },
        {
            "id": 111,
            "name": "AHNAF SYAMIL ABDILLAH",
            "gender": "1",
            "nis": "20142015038",
            "item_code": "AB 39",
            "graduated": "0"
        },
        {
            "id": 112,
            "name": "ALBIANSYAH AHMAD RAMADHAN",
            "gender": "1",
            "nis": "20142015041",
            "item_code": "AB 42",
            "graduated": "0"
        },
        {
            "id": 113,
            "name": "ARYA SUTEDJA",
            "gender": "1",
            "nis": "20142015042",
            "item_code": "AB 43",
            "graduated": "0"
        },
        {
            "id": 117,
            "name": "MUHAMMAD TAMKIN AL-FARISI",
            "gender": 1,
            "nis": "20142015031",
            "item_code": "AB 32",
            "graduated": 0
        },
        {
            "id": 123,
            "name": "SAMUDRA FAWAZ ASY SYAFI",
            "gender": "1",
            "nis": "",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 124,
            "name": "IRSYAD HIDAYATULLOH",
            "gender": "1",
            "nis": "161710554",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 125,
            "name": "AHMAD FAUZAN PRASETIA",
            "gender": "1",
            "nis": "20142015039",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 126,
            "name": "AHMAD SYAFIQ ATH-THALIBI",
            "gender": "1",
            "nis": "20142015040",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 127,
            "name": "BINTANG PUTRA NUGROHO",
            "gender": "1",
            "nis": "20142015043",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 128,
            "name": "HADZIEQ AZFA",
            "gender": "1",
            "nis": "3422",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 129,
            "name": "MUHAMMAD SYAHDAN",
            "gender": 1,
            "nis": "",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 130,
            "name": "MUHAMMAD TAZKY ADLA",
            "gender": "1",
            "nis": "19204111",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 131,
            "name": "YASMINE HAFFAFA DE-ARA",
            "gender": "0",
            "nis": "",
            "item_code": "B-351",
            "graduated": "0"
        },
        {
            "id": 132,
            "name": "KHANSA BATRISYIA UFAIRA",
            "gender": "0",
            "nis": "",
            "item_code": "B-352",
            "graduated": "0"
        },
        {
            "id": 133,
            "name": "ISNAYNI SAFARIYAH SANTOSO",
            "gender": "0",
            "nis": "",
            "item_code": "B-353",
            "graduated": "0"
        },
        {
            "id": 134,
            "name": "AISYAH NURA WIBOWO",
            "gender": "0",
            "nis": "",
            "item_code": "B-356",
            "graduated": "0"
        },
        {
            "id": 135,
            "name": "AISYAH KHUMAIRA",
            "gender": "0",
            "nis": "",
            "item_code": "B-354",
            "graduated": "0"
        },
        {
            "id": 136,
            "name": "YASMIN AFIFAH ZAIDA",
            "gender": "0",
            "nis": "",
            "item_code": "B-355",
            "graduated": "0"
        },
        {
            "id": 137,
            "name": "FAIZA ELVARETTA PRASDYAPUTRI",
            "gender": "0",
            "nis": "",
            "item_code": "B-350",
            "graduated": "0"
        },
        {
            "id": 138,
            "name": "FAKHIRA ZAYN PRANATA",
            "gender": "0",
            "nis": "",
            "item_code": "B-358",
            "graduated": "0"
        },
        {
            "id": 139,
            "name": "ANINDYA PUTRI FADHILAH",
            "gender": "0",
            "nis": "",
            "item_code": "B-349",
            "graduated": "0"
        },
        {
            "id": 140,
            "name": "KAYSAA HAURA AZ-ZAAHIYAH",
            "gender": "0",
            "nis": "",
            "item_code": "B-363",
            "graduated": "0"
        },
        {
            "id": 141,
            "name": "RICHELLE HAYFA AI FIRDYAZ",
            "gender": "0",
            "nis": "",
            "item_code": "B-362",
            "graduated": "0"
        },
        {
            "id": 142,
            "name": "VERLITA AIDA NURSYIFA",
            "gender": "0",
            "nis": "",
            "item_code": "B-257",
            "graduated": "0"
        },
        {
            "id": 143,
            "name": "NAJWA ARRIDWAN FITRIA",
            "gender": 0,
            "nis": "",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 144,
            "name": "AZZAHRA KHAIRUNNISA NUR YAHYA",
            "gender": 0,
            "nis": "",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 147,
            "name": "ASHFIA HILYATUL ABIDAH",
            "gender": "0",
            "nis": "",
            "item_code": "",
            "graduated": "0"
        },
        {
            "id": 148,
            "name": "FEISYA ADLINA AZHARA",
            "gender": 0,
            "nis": "",
            "item_code": "B-376",
            "graduated": 0
        },
        {
            "id": 149,
            "name": "YAASMIIN SAKINAH",
            "gender": 0,
            "nis": "",
            "item_code": "B-377",
            "graduated": 0
        },
        {
            "id": 150,
            "name": "ANNISA YUANITA PUTRI",
            "gender": 0,
            "nis": "",
            "item_code": "B-378",
            "graduated": 0
        },
        {
            "id": 151,
            "name": "KHAYLA APRILYA",
            "gender": "0",
            "nis": "",
            "item_code": "B-379",
            "graduated": "0"
        },
        {
            "id": 152,
            "name": "ALIMAH SHAZIA ZULFAN",
            "gender": 0,
            "nis": "",
            "item_code": "B-368",
            "graduated": 0
        },
        {
            "id": 153,
            "name": "FURSAN HIBATULLOH",
            "gender": "1",
            "nis": "",
            "item_code": "AB.62",
            "graduated": "0"
        },
        {
            "id": 154,
            "name": "SYADDAD RABBANI",
            "gender": "1",
            "nis": "",
            "item_code": "AB.66",
            "graduated": "0"
        },
        {
            "id": 155,
            "name": "REHANDA AHMAD NURPAUJI",
            "gender": "1",
            "nis": "",
            "item_code": "AB.67",
            "graduated": "0"
        },
        {
            "id": 156,
            "name": "AUFIA AMALIA QONITA",
            "gender": "0",
            "nis": "",
            "item_code": "B-375",
            "graduated": "0"
        },
        {
            "id": 157,
            "name": "HAIFA ZAHIRA",
            "gender": 0,
            "nis": "",
            "item_code": "B-381",
            "graduated": 0
        },
        {
            "id": 158,
            "name": "SHOFIYAH KHAIRUNISA",
            "gender": "0",
            "nis": "",
            "item_code": "B-380",
            "graduated": "0"
        },
        {
            "id": 159,
            "name": "FARAH AULIA ZAHIDA",
            "gender": 0,
            "nis": "",
            "item_code": "B-365",
            "graduated": 0
        },
        {
            "id": 160,
            "name": "ATHIFA SAFIYA RAMADHANI",
            "gender": 0,
            "nis": "",
            "item_code": "B-366",
            "graduated": 0
        },
        {
            "id": 161,
            "name": "HAYYA KHAYRA KHALQILLA",
            "gender": "0",
            "nis": "",
            "item_code": "B-367",
            "graduated": "0"
        },
        {
            "id": 162,
            "name": "AISYAH NAJWA KAYANA",
            "gender": 0,
            "nis": "",
            "item_code": "B-369",
            "graduated": 0
        },
        {
            "id": 163,
            "name": "SYAFIRA RIZKHA ALTHAFUNNISA A",
            "gender": 0,
            "nis": "",
            "item_code": "B-370",
            "graduated": 0
        },
        {
            "id": 164,
            "name": "MIZA ZAKIA KURNIAWAN",
            "gender": 0,
            "nis": "",
            "item_code": "B-371",
            "graduated": 0
        },
        {
            "id": 165,
            "name": "FIYA RIZKY RAMADHANY",
            "gender": 0,
            "nis": "",
            "item_code": "B-372",
            "graduated": 0
        },
        {
            "id": 166,
            "name": "ASMA AQILATUSSYAHIDAH",
            "gender": "0",
            "nis": "",
            "item_code": "B-373",
            "graduated": "0"
        },
        {
            "id": 167,
            "name": "QURROTA AYUNIAH",
            "gender": 0,
            "nis": "",
            "item_code": "B-374",
            "graduated": 0
        },
        {
            "id": 168,
            "name": "AQILA NUR AFIFAH",
            "gender": 0,
            "nis": "",
            "item_code": "B-382",
            "graduated": 0
        },
        {
            "id": 169,
            "name": "UMAIR ABBASY MEGANTORO",
            "gender": "1",
            "nis": "",
            "item_code": "AB.58",
            "graduated": "0"
        },
        {
            "id": 170,
            "name": "MUHAMMAD YAHYA ABDUROHMAN",
            "gender": "1",
            "nis": "",
            "item_code": "AB.64",
            "graduated": "0"
        },
        {
            "id": 171,
            "name": "ABDULLAH KHAIRUL AZZAM",
            "gender": "1",
            "nis": "",
            "item_code": "AB.65",
            "graduated": "0"
        },
        {
            "id": 172,
            "name": "DAUD RASYID",
            "gender": "1",
            "nis": "",
            "item_code": "AB.60",
            "graduated": "0"
        },
        {
            "id": 173,
            "name": "FATHIR NURIL AUFA",
            "gender": "1",
            "nis": "",
            "item_code": "AB.59",
            "graduated": "0"
        },
        {
            "id": 174,
            "name": "ZHIBYAN MUHAMMAD AZZAM JORDAN SYAIKHUL MUJAHID",
            "gender": 1,
            "nis": "",
            "item_code": "",
            "graduated": 0
        },
        {
            "id": 175,
            "name": "WILDAN ALKAUTSAR",
            "gender": "1",
            "nis": "",
            "item_code": "AB.61",
            "graduated": "0"
        },
        {
            "id": 176,
            "name": "ADZKA",
            "gender": "1",
            "nis": "",
            "item_code": "AB.57",
            "graduated": "0"
        },
        {
            "id": 177,
            "name": "HAMZAH SYARIEF",
            "gender": "1",
            "nis": "",
            "item_code": "AB.63",
            "graduated": "0"
        }
    ]
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


