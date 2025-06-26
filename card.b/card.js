

(async function(){
  const cr=new card(100);
  await cr.start();
})();


function card(limit){
this.version='1.0.0';
this.limit=limit||10;

this.start=async function(){
  let data=this.defaultData().result;
  this.parse(data);
};
this.fetch=async function(){
  let evac=new eva({
    host:'https://9r3i.web.id/api/eva/',
    apiVersion:'1.0.3',
    token:'eva1.dwiLQfNaCB2Yh4aa3h7.vHhCajUD7gLau6XKal6Di5Fi1fmS.OpJ4OISmeMsGzkGHeMXpWgZ045N6F5e',
    authentication:'eva1.mwiLQfNaCB2Yh47.vHhCajUaa3hKUyIQg2_8WfFYO.yFQkRxeEaU_5aPx9rgArZAT.Jn7Rix3f4ihs2S',
  }),
  res=await evac.request({
    query:`call ldb ['localhost','aisyah','master','atibs'] query "select id,name,nis,graduated,gender from student where graduated=0 and gender=0"`,
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
this.parse=function(data){
  data=Array.isArray(data)?data:[];
  let limit=this.limit,
  counter=0;
  /*  */
  for(let d of data){
    counter++;
    /* create elements */
    let id=d.id,
    qrcode=[d.id,d.name,d.nis].join(':'),
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
this.qrPut=function(id,data){
  new QRCode(id,{
    text:data,
    width:220,
    height:220,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
};
/* default data */
this.defaultData=function(){
  return {
    "code": 107,
    "status": "OK",
    "message": "Successfully executed.",
    "query": "call ldb ['localhost','aisyah','master','atibs'] query \"select id,name,nis,graduated,gender from student where graduated=0 and gender=0\"",
    "result": []
};
};
/*  */
this.temp=function(){
  
};
}