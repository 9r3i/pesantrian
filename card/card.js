

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
    image.width=168;
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
    width:148,
    height:148,
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
    "result": [
        {
            "id": 3,
            "name": "AULIA RAHMA FARHIYA",
            "gender": 0,
            "nis": "17180121",
            "graduated": 0
        },
        {
            "id": 17,
            "name": "ALYSA SUKMA ZULFIANA PUTRI",
            "gender": "0",
            "nis": "17180133",
            "graduated": 0
        },
        {
            "id": 18,
            "name": "AZZAHRA CHAIRUNNISA AFRIYANTI",
            "gender": "0",
            "nis": "17180124",
            "graduated": 0
        },
        {
            "id": 19,
            "name": "EDIES ADELIA",
            "gender": 0,
            "nis": "17180131",
            "graduated": 0
        },
        {
            "id": 20,
            "name": "HUSNA AULIA RAHMAH",
            "gender": 0,
            "nis": "17180126",
            "graduated": 0
        },
        {
            "id": 21,
            "name": "JAYANTI",
            "gender": 0,
            "nis": "17180125",
            "graduated": 0
        },
        {
            "id": 22,
            "name": "KAYLA ALEASADYA",
            "gender": 0,
            "nis": "17180132",
            "graduated": 0
        },
        {
            "id": 23,
            "name": "LATHIFAH NUR AZIZAH",
            "gender": 0,
            "nis": "17180122",
            "graduated": 0
        },
        {
            "id": 24,
            "name": "MENTARI DWI KUSUMA HARUM DESRISATNINURIAN ",
            "gender": 0,
            "nis": "17180127",
            "graduated": 0
        },
        {
            "id": 25,
            "name": "MISYKA NAWWARA AQILA",
            "gender": 0,
            "nis": "17180120",
            "graduated": 0
        },
        {
            "id": 26,
            "name": "NABILA QONITA HASANAH",
            "gender": 0,
            "nis": "17180117",
            "graduated": 0
        },
        {
            "id": 27,
            "name": "NADIA NUR RAHMAH",
            "gender": 0,
            "nis": "17180118",
            "graduated": 0
        },
        {
            "id": 28,
            "name": "NAILA KAYYISAH ",
            "gender": 0,
            "nis": "17180119",
            "graduated": 0
        },
        {
            "id": 29,
            "name": "PUTRI SYAKIRA VELAYATI",
            "gender": 0,
            "nis": "17180114",
            "graduated": 0
        },
        {
            "id": 30,
            "name": "SALSABILA AZ ZAHRA",
            "gender": "0",
            "nis": "17180115",
            "graduated": 0
        },
        {
            "id": 31,
            "name": "SHOFIYAH RUFAIDAH AL ANSHORIYAH",
            "gender": 0,
            "nis": "17180128",
            "graduated": 0
        },
        {
            "id": 32,
            "name": "SITI KHALISHA NUR AFIFAH",
            "gender": 0,
            "nis": "17180130",
            "graduated": 0
        },
        {
            "id": 33,
            "name": "SUCI FITRIAH",
            "gender": 0,
            "nis": "17180129",
            "graduated": 0
        },
        {
            "id": 34,
            "name": "YASMIN NURIL RAMADHANI",
            "gender": 0,
            "nis": "17180116",
            "graduated": 0
        },
        {
            "id": 35,
            "name": "CALLISTA FAIRUZ ZAHID",
            "gender": 0,
            "nis": "17180134",
            "graduated": 0
        },
        {
            "id": 36,
            "name": "AGHNIA AZZA",
            "gender": 0,
            "nis": "17180143",
            "graduated": 0
        },
        {
            "id": 37,
            "name": "ANJELITA MUTIARA HAKIM",
            "gender": 0,
            "nis": "17180158",
            "graduated": 0
        },
        {
            "id": 38,
            "name": "ANNIDA KHAIRUNNISA",
            "gender": 0,
            "nis": "17180145",
            "graduated": 0
        },
        {
            "id": 39,
            "name": "AQILA NEFEEZA AHMAD",
            "gender": 0,
            "nis": "17180157",
            "graduated": 0
        },
        {
            "id": 40,
            "name": "AYU DIYYAH DEWI PASHA",
            "gender": 0,
            "nis": "17180159",
            "graduated": 0
        },
        {
            "id": 41,
            "name": "AZKIYA HUMAIRA AHMAD",
            "gender": 0,
            "nis": "17180156",
            "graduated": 0
        },
        {
            "id": 42,
            "name": "BALQIS NAJMI NUSYURA",
            "gender": 0,
            "nis": "17180150",
            "graduated": 0
        },
        {
            "id": 43,
            "name": "BISMI AULIA IZZAT",
            "gender": 0,
            "nis": "17180147",
            "graduated": 0
        },
        {
            "id": 44,
            "name": "CARISSA SALWA DZAKIRA",
            "gender": 0,
            "nis": "17180137",
            "graduated": 0
        },
        {
            "id": 45,
            "name": "DINDA ALBANI NUR ALISYA",
            "gender": 0,
            "nis": "17180138",
            "graduated": 0
        },
        {
            "id": 46,
            "name": "FAYZA KHAIRUNNISA",
            "gender": "0",
            "nis": "17180149",
            "graduated": 0
        },
        {
            "id": 48,
            "name": "NAILAH ZAHIDAH HAFIDZ",
            "gender": 0,
            "nis": "17180151",
            "graduated": 0
        },
        {
            "id": 49,
            "name": "NAURAH SALWA",
            "gender": 0,
            "nis": "17180154",
            "graduated": 0
        },
        {
            "id": 50,
            "name": "PUTRI BILQIS AL BANNA",
            "gender": "0",
            "nis": "17180141",
            "graduated": 0
        },
        {
            "id": 51,
            "name": "RAJNI CALLISTA EKWIE",
            "gender": "0",
            "nis": "17180152",
            "graduated": 0
        },
        {
            "id": 52,
            "name": "RUMAISHA ASSHABIRAH",
            "gender": 0,
            "nis": "17180142",
            "graduated": 0
        },
        {
            "id": 54,
            "name": "SALLY SABILA KANZHA",
            "gender": 0,
            "nis": "17180146",
            "graduated": 0
        },
        {
            "id": 55,
            "name": "SHENNON ALLEGRA FIDIANSYAH",
            "gender": 0,
            "nis": "17180148",
            "graduated": 0
        },
        {
            "id": 56,
            "name": "SYAKILA DZAKIRAH FIRMANSYAH",
            "gender": 0,
            "nis": "17180153",
            "graduated": 0
        },
        {
            "id": 57,
            "name": "SYAMILA FAIZAH",
            "gender": 0,
            "nis": "17180144",
            "graduated": 0
        },
        {
            "id": 58,
            "name": "TINA MUSTIKA",
            "gender": 0,
            "nis": "17180135",
            "graduated": 0
        },
        {
            "id": 60,
            "name": "MARYAM HAYA LANGITA",
            "gender": 0,
            "nis": "17180140",
            "graduated": 0
        },
        {
            "id": 63,
            "name": "IBNATY SYARIFA MUJAHIDAH",
            "gender": 0,
            "nis": "15160219",
            "graduated": 0
        },
        {
            "id": 65,
            "name": "KHADIJAH AZ ZAHRA",
            "gender": 0,
            "nis": "15160223",
            "graduated": 0
        },
        {
            "id": 69,
            "name": "RAIHANAH LAKEISHA",
            "gender": 0,
            "nis": "15160229",
            "graduated": 0
        },
        {
            "id": 71,
            "name": "RUMAISHAH ANDRIYANI",
            "gender": 0,
            "nis": "15160227",
            "graduated": 0
        },
        {
            "id": 72,
            "name": "SALAMAH",
            "gender": "0",
            "nis": "15160217",
            "graduated": 0
        },
        {
            "id": 73,
            "name": "SYIFA FAUZIYYAH WIJAYANTO",
            "gender": 0,
            "nis": "15160225",
            "graduated": 0
        },
        {
            "id": 74,
            "name": "ADINDA LAYLA HANIFA",
            "gender": 0,
            "nis": "15160241",
            "graduated": 0
        },
        {
            "id": 75,
            "name": "CUT SYIFA RAMADHANI",
            "gender": 0,
            "nis": "15160239",
            "graduated": 0
        },
        {
            "id": 76,
            "name": "HUWAIDATUL HANUUN",
            "gender": 0,
            "nis": "15160232",
            "graduated": 0
        },
        {
            "id": 77,
            "name": "LAREINA TRI DAHAYU ABIYYAH",
            "gender": 0,
            "nis": "15160238",
            "graduated": 0
        },
        {
            "id": 78,
            "name": "MAULIDA ZULEIKA FEBRIANTI",
            "gender": 0,
            "nis": "15160231",
            "graduated": 0
        },
        {
            "id": 79,
            "name": "MUTIARA KHANSA ABDILLAH",
            "gender": 0,
            "nis": "15160230",
            "graduated": 0
        },
        {
            "id": 80,
            "name": "NAILAH KHANSA AZZAHRA",
            "gender": 0,
            "nis": "15160236",
            "graduated": 0
        },
        {
            "id": 81,
            "name": "SARAH AMELIA",
            "gender": "0",
            "nis": "15160234",
            "graduated": 0
        },
        {
            "id": 82,
            "name": "ZANETTA MAULIDA FRBRUADISHA",
            "gender": "0",
            "nis": "15160235",
            "graduated": 0
        },
        {
            "id": 83,
            "name": "ZULFA ZAHIRA",
            "gender": 0,
            "nis": "15160237",
            "graduated": 0
        },
        {
            "id": 85,
            "name": "KEISHA VADINE ADANI",
            "gender": 0,
            "nis": "15160242",
            "graduated": 0
        },
        {
            "id": 86,
            "name": "ANNISA QURROTU A'YUN",
            "gender": 0,
            "nis": "15160256",
            "graduated": 0
        },
        {
            "id": 87,
            "name": "AQILA KAISA RAMADHANI",
            "gender": 0,
            "nis": "15160250",
            "graduated": 0
        },
        {
            "id": 88,
            "name": "AURYNA SALSABILLA",
            "gender": 0,
            "nis": "15160246",
            "graduated": 0
        },
        {
            "id": 89,
            "name": "DANISHA ANIQ DZULKARNAIN",
            "gender": "0",
            "nis": "15160257",
            "graduated": 0
        },
        {
            "id": 90,
            "name": "HANA FATHIYAH PUTRI",
            "gender": 0,
            "nis": "15160252",
            "graduated": 0
        },
        {
            "id": 91,
            "name": "HAURA SHOFIA ALYASRI",
            "gender": 0,
            "nis": "15160254",
            "graduated": 0
        },
        {
            "id": 92,
            "name": "HUMAIRA",
            "gender": 0,
            "nis": "151610248",
            "graduated": 0
        },
        {
            "id": 94,
            "name": "KHALISHAH NABILA",
            "gender": "0",
            "nis": "15160249",
            "graduated": 0
        },
        {
            "id": 95,
            "name": "KHANSA AISHA MAZAYA",
            "gender": 0,
            "nis": "15160247",
            "graduated": 0
        },
        {
            "id": 96,
            "name": "NAJWA ARIFATUN NISA",
            "gender": "0",
            "nis": "15160245",
            "graduated": 0
        },
        {
            "id": 97,
            "name": "NAYLA ALIYA",
            "gender": 0,
            "nis": "15160251",
            "graduated": 0
        },
        {
            "id": 98,
            "name": "RAIHANAH ALIYATU DZAKIYYAH",
            "gender": 0,
            "nis": "15160259",
            "graduated": 0
        },
        {
            "id": 99,
            "name": "SHAFIYYAH ALHARITSAH",
            "gender": "0",
            "nis": "15160244",
            "graduated": 0
        },
        {
            "id": 100,
            "name": "SYAFITRI RAMADHANI",
            "gender": "0",
            "nis": "15160260",
            "graduated": 0
        },
        {
            "id": 101,
            "name": "SYARIFAH AVRILANA MUFIDATUNNISA",
            "gender": 0,
            "nis": "15160253",
            "graduated": 0
        },
        {
            "id": 102,
            "name": "THALITA AZA JABIRAH",
            "gender": 0,
            "nis": "15160255",
            "graduated": 0
        },
        {
            "id": 103,
            "name": "AZQIYA DENOVA HARUN",
            "gender": 0,
            "nis": "15160261",
            "graduated": 0
        },
        {
            "id": 131,
            "name": "YASMINE HAFFAFA DE-ARA",
            "gender": "0",
            "nis": "",
            "graduated": "0"
        },
        {
            "id": 132,
            "name": "KHANSA BATRISYIA UFAIRA",
            "gender": "0",
            "nis": "",
            "graduated": "0"
        },
        {
            "id": 133,
            "name": "ISNAYNI SAFARIYAH SANTOSO",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 134,
            "name": "AISYAH NURA WIBOWO",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 135,
            "name": "AISYAH KHUMAIRA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 136,
            "name": "YASMIN AFIFAH ZAIDA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 137,
            "name": "FAIZA ELVARETTA PRASDYAPUTRI",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 138,
            "name": "FAKHIRA ZAYN PRANATA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 139,
            "name": "ANINDYA PUTRI FADHILAH",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 140,
            "name": "KAYSAA HAURA AZ-ZAAHIYAH",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 141,
            "name": "RICHELLE HAYFA AI FIRDYAZ",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 142,
            "name": "VERLITA AIDA NURSYIFA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 143,
            "name": "NAJWA ARRIDWAN FITRIA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 144,
            "name": "AZZAHRA KHAIRUNNISA NUR YAHYA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        },
        {
            "id": 145,
            "name": "NINDA SALLYCYA ILMA",
            "gender": 0,
            "nis": "",
            "graduated": 0
        }
    ]
};
};
/*  */
this.temp=function(){
  
};
}