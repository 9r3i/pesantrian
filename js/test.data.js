if(window.hasOwnProperty('screen')){
}


;document.addEventListener("deviceready",function(){if(typeof navigator.splashscreen==='object'&&navigator.splashscreen!==null&&typeof navigator.splashscreen.hide==='function'){navigator.splashscreen.hide();}},false);




;document.addEventListener("deviceready",function(){
  if(typeof navigator.splashscreen==='object'
    &&navigator.splashscreen!==null
    &&typeof navigator.splashscreen.hide==='function'
    ){
    navigator.splashscreen.hide();
  }
},false);

;(function(){
  if(typeof navigator.splashscreen==='object'
    &&navigator.splashscreen!==null
    &&typeof navigator.splashscreen.hide==='function'
    ){
    navigator.splashscreen.hide();
  }
})();


let tos={
  name:'',
};


/* employee data */
function testEmployee(){
  return {
    name:'AMAR SUPENA',
gender:1,
birthplace:'Tasikmalaya',
birthdate:'28 November 1977',
nik:'',
address:'Kp. Geger Bitung RT. 02/04, Desa Cijeruk, Kecamatan Cijeruk, Kabupaten Bogor, JAWA BARAT, 16740',
blood_group:'O',
religion:'Islam',
phone:'0813 8554 3030',
email:'masrbuana18@gmail.com',
position:'Admin',
start_date:'April 2015',
illness:'',
employee_status:'Tetap',
marritial_status:'Menikah',
children:0,
siblings:4,
spouse_name:'Siti Rohimah',
father_name:'Otong Mistam (Alm)',
mother_name:'Nana Resnawati',
nationality:'Indonesia',
height:167,
weight:96,
data:JSON.stringify(testData()),
  };
}

/* test data */
function testData(){
  return {

keluarga:[
{
  nama:'Otong Mistam',
  keterangan:'Ayah',
},
{
  nama:'Nana Resnawati',
  keterangan:'Ibu',
},
{
  nama:'Andi Suandi',
  keterangan:'Kakak',
},
{
  nama:'Arti Sriharyati',
  keterangan:'Kakak',
},
{
  nama:'Atit Supartini',
  keterangan:'Adik',
},
{
  nama:'Arief Sugandhi',
  keterangan:'Adik',
},
],

pasangan:[
{
  nama:'Siti Rohimah',
  tanggal_lahir:'4-4-1981',
  tempat_lahir:'Bogor',
  tanggal_menikah:'9-2-2004',
  tempat_menikah:'Bogor',
  pekerjaan:'IRT',
},
],

anak:[
  {
    nama:'',
    kelamin:'',
    status:'AK/AA/AT',
    tanggal_lahir:'',
    tempat_lahir:'',
    keterangan:'',
  },
],

pendidikan:{
  formal:[
    {
      instritusi:'SDN Nagarasari V',
      no_ijazah:'',
      tahun_ijazah:'1990',
      keterangan:'Berijazah',
    },
    {
      instritusi:'SMPN 5 Tasikmalaya',
      no_ijazah:'',
      tahun_ijazah:'1993',
      keterangan:'Berijazah',
    },
    {
      instritusi:'SMAN 2 Tasikmalaya',
      no_ijazah:'',
      tahun_ijazah:'1996',
      keterangan:'Berijazah',
    },
    {
      instritusi:'',
      no_ijazah:'',
      tahun_ijazah:'',
      keterangan:'',
    },
  ],
  kursus:[
    {
      penyelenggara:'',
      jenis:'',
      keterangan:'',
    },
  ],
},

pengalaman_kerja:[
  {
    perusahaan:'BPN',
    posisi:'Tenaga Honorer',
    tahun:'1996',
    keterangan:'Pertanahan',
  },
  {
    perusahaan:'CV. KENCANA WUNGU',
    posisi:'Kepala Gudang',
    tahun:'1999',
    keterangan:'Garment',
  },
  {
    perusahaan:'PT. PRISMA CITRA PERSADA',
    posisi:'Adm Pelaporan',
    tahun:'2001',
    keterangan:'Konsultan Kehutanan',
  },
  {
    perusahaan:'',
    posisi:'',
    tahun:'',
    keterangan:'',
  },
],

organisasi:[
  {
    nama_organisasi:'',
    jabatan:'',
    tahun:'',
  },
],

keahlian:{
  hardskill:[
    'Microsoft Office',
    'Desain',
    'Programmer',
    'Manajemen Data',
    'Finansial Report'
  ],
  softskill:[
    'Teamwork',
    'Leadership',
    'Amanah',
    'Disiplin',
    'Jujur',
    'Kemampuan Beradaptasi',
  ],
},


visi_obsesi:'',

hafalan:[
  {
    juz:30,
    status:'masih hafal',
  },
],

  };
}
