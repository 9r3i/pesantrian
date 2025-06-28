/*  */
function card(){
this.version='1.0.0';
/*  */
this.start=function(place='KANTOR',minute=0x0a){
  this.parse(place,minute);
  setTimeout(e=>{
    this.start(place,minute);
  },0x25a*0x3e8);
};
/*  */
this.parse=function(place='KANTOR',minute=0x0a){
    /* create elements */
    let qrcode=this.newEP(place,minute),
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
    el.append(image);
    el.append(qr);
    el.append(name);
    el.append(nis);
    el.append(ibg);
    image.alt='';
    image.src='logo-aatibs-tosca-cutted.png';
    image.width=164;
    ibg.alt='';
    ibg.src='logo-al-anshary-software-700x197.png';
    qr.id='qrcode.ep';
    name.innerText=place;
    nis.innerText=(new Date).getTime()+(3600*1111);
    
  /* document.body */
  document.body.innerText='';
  document.body.append(el);
  document.body.style.height=window.innerHeight+'px';
  this.qrPut(qr,qrcode);
};
/*  */
this.newEP=function(name='KANTOR',minute=0x0a){
  let dtime=(new Date).getTime(),
  hour=(minute*0x3c*0x3e8),
  ns=Math.floor(dtime/hour).toString(36).padStart(8,'0');
  return btoa([
    'ep',
    ns,
    name,
    dtime+hour,
  ].join(':')).split('').reverse().join('');
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
}

