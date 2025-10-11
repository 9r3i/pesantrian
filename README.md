# pesantrian
this readme.md file is just a note for myself, no one would know.

# configuration
dont forget to configure this global constants
```js
const EVA_API_HOST     = "EVA_ACCESS_TOKEN",
      EVA_ACCESS_TOKEN = "EVA_ACCESS_TOKEN",
      REPO_HOST        = "REPO_HOST",
      CORNER_HOST      = "CORNER_HOST",
      QR_HOST          = "QR_HOST";
```
or use raw constant segement from abl

# steps to compile and deploy
- make sure the production is true
- make sure the version code is up-to-date
- minify the files
- test the minified version
- obfuscate the files
- test the obfuscated version
- update emergency file version code
- update config file version code
- compile to appbase using abl app
- check status of the files
- deploy the changess to appbase server

# compile and deploy

## peureut heula a.k.a. minify
```
ai tool peureut css/pesantrian.css && ai tool peureut js/pesantrian.js
```

### obuscate
then obfuscate the minimized file in ```https://obfuscator.io/```


## move from download
```
mv -fv /sdcard/download/pesantrian.min.js js/pesantrian.min.obf.js
```

## compile the whole files to appbase
```
ai abl app config
```

## deploy to appbase host

### check status
```
ai vco status
```

### push the change
```
ai vco push
```

# cordova config
```
------[cordova]------
apt install npm
npm install -g cordova
apt install openjdk-17-jdk
apt install snapd
snap install core
snap install androidsdk
snap install gradle
--------------------------
add to ~/.bashrc
export ANDROID_SDK_ROOT=/opt/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```




# queries
these queries are made for eva api 

## scan_presence
```
scan_presence
- id      aid()
- time    time()
- year    int(4,2024)
- month   int(2,0)
- date    int(2,1)
- session int(2,1)
- tid     int(10,0)
- sid     int(10,0)
- pid     int(10,0)

[QUERY]
call ldb query "create table scan_presence id=aid()&time=time()&year=int(4,2024)&month=int(2,0)&date=int(2,1)&session=int(2,1)&tid=int(10,0)&sid=int(10,0)&pid=int(10,0)"
```

## tahfidz_valuation_plus
```
- tahfidz_valuation_plus (per semester)
  - id (INT / KEY)
  - name
  - student_id (INT)
  - teacher_id (INT)
  - value
  - semester
  - year
  - type (semester/subjective/--juz1-juz30)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE tahfidz_valuation_plus id=aid()&name=string()&student_id=int()&teacher_id=int()&value=int(3,0)&semester=int(1,1)&year=int(4,2024)&type=string()&time=time()"
```

## laundry_non
```
- laundry_non
  - id (INT / KEY)
  - type (student,employee)
  - profile_id (INT)
  - nominal (INT)
  - year (INT)
  - month (INT)
  - time (TIME)
  - weight (string)
  - kind (string)
  - flow (INT)
  
[QUERY]
call ldb query "CREATE TABLE laundry_non id=aid()&type=string()&profile_id=int()&nominal=int()&year=int(4,2024)&month=int(2,0)&time=time()&weight=string()&kind=string()&flow=int(1,0)"
```

## subjective_valuation
```
- subjective_valuation
  - id (INT / KEY)
  - name
  - student_id (INT)
  - teacher_id (INT)
  - value
  - semester
  - year
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE subjective_valuation id=aid()&name=string()&student_id=int()&teacher_id=int()&value=int(3,0)&semester=int(1,1)&year=int(4,2024)&time=time()"
```

## general
```
- general
  - id (INT / KEY)
  - year (INT)
  - month (INT)
  - type (:budget/:report)
  - note
  - many (INT)
  - price (INT)
  - total (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE general id=aid()&year=int(4,2024)&month=int(2,0)&type=string(20)&note=string()&many=int()&price=int()&total=int()&time=time()"
```

## permission
```
- permission
  - id (INT / KEY)
  - name
  - student_id (INT)
  - date
  - hour
  - long (INT)
  - type
  - back_date
  - back_hour
  - note
  - status
  - penalty
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE permission id=aid()&name=string()&student_id=int()&date=string(10)&hour=string(5)&long=int(3)&type=string(50)&back_date=string(10)&back_hour=string(5)&note=string()&status=string()&penalty=string()&time=time()"
```

## letter
```
- letter
  - id (INT / KEY)
  - method (INT)
  - serial
  - about
  - date (string:10)
  - hour (string:5)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE letter id=aid()&method=int(1,0)&serial=string()&about=string()&date=string(10)&hour=string(5)&time=time()"
```

## tahfidz_inventory
```
- tahfidz_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - teacher_id (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE tahfidz_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&teacher_id=int()&time=time()"
```

## clinic_inventory
```
- clinic_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE clinic_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&time=time()"
```

## tahfidz_presence
```
- tahfidz_presence
  - id (INT / KEY)
  - name
  - student_id (INT)
  - teacher_id (INT)
  - presence
  - note
  - date
  - month
  - year
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE tahfidz_presence id=aid()&name=string()&student_id=int()&teacher_id=int()&presence=int(5)&note=string()&date=int(2,1)&month=int(2,0)&year=int(4,2024)&time=time()"
```

## academic_inventory
```
- academic_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE academic_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&time=time()"
```

## dorm_inventory
```
- dorm_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - building
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE dorm_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&building=string()&time=time()"
```

## scholarship
```
- scholarship
  - id (INT / KEY)
  - name
  - student_id (INT)
  - nominal (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE scholarship id=aid()&name=string()&student_id=int()&nominal=int()&time=time()"
```

## it_inventory
```
- it_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE it_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&time=time()"
```

## room_teacher
```
- room_teacher
  - id (INT / KEY)
  - name
  - teacher_id (INT)
  - class
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE room_teacher id=aid()&name=string()&teacher_id=int()&class=int(2,7)&time=time()"
```

## presence
```
- presence
  - id (INT / KEY)
  - name
  - student_id (INT)
  - class (INT)
  - presence
  - note
  - date
  - month
  - year
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE presence id=aid()&name=string()&student_id=int()&class=int(2)&presence=int(5)&note=string()&date=int(2,1)&month=int(2,0)&year=int(4,2024)&time=time()"
```

## class_inventory
```
- class_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - class (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE class_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&class=int()&time=time()"
```

## extracurricular
```
- extracurricular
  - id (INT / KEY)
  - name
  - student_id (INT)
  - class (INT)
  - ex_name
  - value
  - presence
  - month
  - year
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE extracurricular id=aid()&name=string()&student_id=int()&class=int(2)&ex_name=string()&value=int(5)&presence=int(5)&month=int(2,0)&year=int(4,2024)&time=time()"
```

## event
```
- event
  - id (INT / KEY)
  - name
  - student_id (INT)
  - class (INT)
  - event_name
  - event_org
  - date
  - note
  - month
  - year
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE event id=aid()&name=string()&student_id=int()&class=int()&event_name=string()&event_org=string()&date=string(20)&note=string(200)&month=int(2,0)&year=int(4,2024)&time=time()"
```

## shop
```
- shop
  - id (INT / KEY)
  - name
  - nominal (INT)
  - method (INT)
  - month (INT)
  - year (INT)
  - time (TIME)
  - evidence (string)
  
[QUERY]
CREATE TABLE shop id=aid()&name=string()&nominal=int()&method=int(1,0)&month=int(2,0)&year=int(4,2024)&time=time()&evidence=string()
```

## shopm
```
- shopm
  - id (INT / KEY)
  - name
  - nominal (INT)
  - method (INT)
  - month (INT)
  - year (INT)
  - time (TIME)
  - evidence (string)
  
[QUERY]
CREATE TABLE shopm id=aid()&name=string()&nominal=int()&method=int(1,0)&month=int(2,0)&year=int(4,2024)&time=time()&evidence=string()
```

## clean_inventory
```
- clean_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE clean_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&time=time()"
```

## maintenance_inventory
```
- maintenance_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE maintenance_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&time=time()"
```

## media_inventory
```
- media_inventory
  - id (INT / KEY)
  - name
  - quantity (INT)
  - item_code
  - condition
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE media_inventory id=aid()&name=string()&quantity=int()&item_code=string(50)&condition=string(100)&time=time()"
```

## class
```
- class
  - id (INT / KEY)
  - name
  - student_id (INT)
  - class (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE class id=aid()&name=string()&student_id=int()&class=int()&time=time()"
```

## dorm_value
```
- dorm_value
  - id (INT / KEY)
  - name
  - student_id (INT)
  - teacher_id (INT)
  - year (INT)
  - month (INT)
  - data (JSON)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE dorm_value id=aid()&name=string()&student_id=int()&teacher_id=int()&year=int(4,2024)&month=int(2,0)&data=string(30000,LDB_BLANK)&time=time()"
```

## dowm
```
- dorm
  - id (INT / KEY)
  - name
  - student_id (INT)
  - teacher_id (INT)
  - room_name
  - building_name
  - rest_room
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE dorm id=aid()&name=string()&student_id=int()&teacher_id=int()&room_name=string()&building_name=string()&rest_room=string()&time=time()"
```

## tahfidz_team
```
- tahfidz_team
  - id (INT / KEY)
  - name
  - student_id (INT)
  - teacher_id (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE tahfidz_team id=aid()&name=string()&student_id=int()&teacher_id=int()&time=time()"
```

## tahfidz
```
- tahfidz
  - id (INT / KEY)
  - student_id (INT)
  - teacher_id (INT)
  - juz_total (INT)
  - memorize_target (INT)
  - memorize_total (INT)
  - tajwid (INT)
  - tahsin (INT)
  - note
  - month (int)
  - year (int)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE tahfidz id=aid()&student_id=int()&teacher_id=int()&juz_total=int()&memorize_total=int()&memorize_target=int()&tajwid=int()&tahsin=int()&note=string(200)&month=int(2,0)&year=int(4,2024)&time=time()"
```

## package
```
- package
  - id (INT / KEY)
  - name
  - type
  - profile_id (INT)
  - hour
  - courier
  - report
  - month (INT)
  - year (INT)
  - given (INT)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE package id=aid()&name=string()&type=string()&profile_id=int()&hour=string(10)&courier=string(20)&report=string(512)&month=int(2,0)&year=int(4,2024)&given=int(1,0)&time=time()"
```

## guest
```
- guest
  - id (INT / KEY)
  - name
  - month (INT)
  - year (INT)
  - student_id (INT)
  - purpose
  - checkin
  - checkout
  - plate
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE guest id=aid()&name=string()&month=int(2,0)&year=int(4,2024)&student_id=int()&purpose=string(512)&checkin=string()&checkout=string()&plate=string(12)&time=time()"
```

## laundry
```
- laundry
  - id (INT / KEY)
  - type (student,employee)
  - profile_id (INT)
  - nominal (INT)
  - year (INT)
  - month (INT)
  - time (TIME)
  - weight (string)
  - kind (string)
  - flow (INT)
  
[QUERY]
call ldb query "CREATE TABLE laundry id=aid()&type=string()&profile_id=int()&nominal=int()&year=int(4,2024)&month=int(2,0)&time=time()&weight=string()&kind=string()&flow=int(1,0)"
```

## kitchen
```
- kitchen
  - id (INT / KEY)
  - name  -- (breakfast/lunch/dinner)
  - student_id (INT)
  - father_id (INT)
  - mother_id (INT)
  - done (INT,1,0)
  - uid (INT)
  - employee_id (INT)
  - time (TIME)

[QUERY]
call ldb query "CREATE TABLE kitchen id=aid()&name=string()&student_id=int()&father_id=int()&mother_id=int()&done=int()&uid=int()&employee_id=int()&time=time()"

select id,name,father_id,mother_id,graduated from student where graduated=0;
select id,profile_id,type from user where type="parent"
```

## notification
```
- notification
  - id (INT / KEY)
  - user_id (INT) (target_id)
  - message string(512)
  - read (INT:1,0)
  - callback
  - uid (INT) (initiator)
  - time (TIME)

[QUERY]
call ldb query "CREATE TABLE notification id=aid()&user_id=int()&message=string(512)&read=int(1,0)&callback=string()&uid=int()&time=time()"
```

## transaction
```
- transaction
  - id          (INT / KEY)
  - name        (register/contribution/donation/petty_cash)
  - type        (student/parent/employee)
  - profile_id  (INT)
  - method      (INT) (0=out|1=in)
  - nominal     (INT:15)
  - transaction_date 
  - transaction_code 
  - status      -- status 
  - report      -- laporan
  - evidence    -- bukti
  - explanation -- keterangan
  - time        (TIME)
  - date        (DATE)
  - account     (string:50) number

[QUERY]
call ldb query "CREATE TABLE transaction id=aid()&name=string()&type=string()&profile_id=int()&method=int(1)&nominal=int(15)&transaction_date=string()&code=string()&status=string()&report=string(512)&evidence=string()&explanation=string()&time=time()&date=date()&account=string(50)"
```

## user
```
- user
  - id (INT / KEY)
  - name
  - passcode
  - type (table: employee/parent/student/...)
  - profile_id (INT)
  - active (INT)
  - privilege (INT: 1/2/4/8/16/32)
  - scope (JSON - array of scopes)
  - data (JSON)
  - time (TIME)
  
[QUERY]
call ldb query "CREATE TABLE user id=aid()&name=string()&passcode=string(512)&active=int(1,0)&type=string()&profile_id=int()&privilege=int()&scope=string(512)&data=string(30000,LDB_BLANK)&time=time()"
```

## clinic
```
- clinic
  - id
  - name
  - student_id
  - checkout --date
  - checkin  --date
  - clinic_name
  - doctor_name
  - treatment
  - cost (INT)
  - level (very_low/low/average/high/very_high)
  - ailment
  - medicine
  - date  --date (INT)
  - year  --year (INT)
  - month --month (INT)
  - height (INT)
  - weight (INT)
  - time (TIME)

- [report]
  - sick (INT)
  - 

[QUERY]
call ldb query "create table clinic id=aid()&name=string()&student_id=int()&checkin=string()&checkout=string()&clinic_name=string()&doctor_name=string()&treatment=string()&cost=int()&ailment=string()&level=string()&medicine=string()&height=int()&weight=int()&date=int(2,1)&month=int(2,0)&year=int(4,2024)&time=time()"
```

## tahfidz_valuation
```
- tahfidz_valuation
  - id (INT/KEY)
  - student_id (INT)
  - juz (INT)
  - tajwid (INT)
  - fluency (INT)
  - formative
  - data (JSON)
  - time (TIME)
[QUERY]
call ldb query "CREATE TABLE tahfidz_valuation id=aid()&student_id=int()&juz=int()&tajwid=int()&fluency=int()&formative=string(512)&data=string(30000,LDB_BLANK)&time=time()"

[DATA]
------
tahfidz
A+ = 96 - 100
A- = 86 - 95
B+ = 76 - 85
B- = 71 - 75
C+ = 66 - 70
C- = 60 - 65
```

## valuation
```
- valuation
  - id (INT/KEY)
  - student_id (INT)
  - subject_id (INT)
  - value (INT)
  - letter
  - time (TIME)
[QUERY]
call ldb query "CREATE TABLE valuation id=aid()&student_id=int()&subject_id=int()&value=int()&letter=string()&time=time()"

------
asrama
A = Istimewa ( 91 - 100 ) 
B = Baik ( 81 - 90 ) 
C = Sedang ( 71 - 80 ) 
D = Cukup ( 60 - 70 )
```

## daily_valuation
```
- daily_valuation
  - id (INT/KEY)
  - student_id (INT)
  - subject_id (INT)
  - value (INT)
  - letter
  - date
  - time (TIME)
[QUERY]
call ldb query "CREATE TABLE daily_valuation id=aid()&student_id=int()&subject_id=int()&value=int()&letter=string()&date=string(10)&time=time()"
```

## subject
```
- subject
  - id (INT/KEY)
  - name
  - teacher_id (INT)
  - min_criteria (INT)
  - predicate
  - year
  - semester (INT)
  - class (INT)
  - data (JSON)
  - time (TIME)
[QUERY]
call ldb query "CREATE TABLE subject id=aid()&name=string(256)&teacher_id=int()&min_criteria=int()&predicate=string()&year=string()&semester=int()&class=int()&data=string(30000,LDB_BLANK)&time=time()"

[DATA]
- min_criteria (the result column)
  - id (INT/KEY)
  - subject_name
  - subject_id
  - complexity
  - intake
  - support (carrying capacity)
    - facility
    - teacher
    - money
    - material
  - result (calculated from all and divided from count)
```

## employee
```
- employee
  - id (INT/KEY)
  - name
  - gender int(1)
  - birthdate
  - birthplace
  - nik
  - address (JSON)
    - name 
    - rt
    - rw
    - sub_district (desa/kelurahan)
    - district (kecamatan)
    - regency (kabupaten/kota)
    - province (provinsi)
    - zipcode
  - phone
  - email
  - religion
  - blood_group
  - illness
  - position (teacher/staff/admin/...)
  - employee_status
  - marritial_status
  - children
  - siblings
  - spouse_name
  - father_name
  - mother_name
  - nationality
  - data (JSON)
  - time (TIME)
  - start_date
[QUERY]
call ldb query "CREATE TABLE employee id=aid()&name=string(256)&address=string(512)&gender=int(1)&birthdate=date()&birthplace=string(100)&nik=string(20)&phone=string(20)&email=string(100)&religion=string(64)&blood_group=string(3)&illness=string(256)&position=string(100)&employee_status=string(32)&marritial_status=string(32)&children=int()&siblings=int()&spouse_name=string(100)&father_name=string(100)&mother_name=string(100)&data=string(30000,LDB_BLANK)&nationality=string(100)&time=time()"

[DATA]
- keluarga (array)
  - nama
  - keterangan
- pasangan (array)
  - nama
  - tanggal_lahir
  - tempat_lahir
  - tanggal_menikah
  - tempat_menikah
  - pekerjaan
- anak (array)
  - nama
  - kelamin
  - status enum(AK/AA/AT)
  - tanggal_lahir
  - tempat_lahir
  - keterangan
- pendidikan (object)
  - formal (array)
    - instritusi
    - no_ijazah
    - tahun_ijazah
    - keterangan
  - kursus (array)
    - penyelenggara
    - jenis
    - keterangan
- pengalaman_kerja (array)
  - perusahaan
  - posisi
  - tahun
  - keterangan
- organisasi
  - nama_organisasi
  - jabatan
  - tahun
- keahlian (array)
- visi_obsesi
- hafalan
  - juz
  - status8
```

## student
```
- student
  - id (INT / KEY)
  - name
  - address (JSON)
    - name 
    - rt
    - rw
    - sub_district (desa/kelurahan)
    - district (kecamatan)
    - regency (kabupaten/kota)
    - province (provinsi)
    - zipcode
  - gender int(1)
  - birthdate
  - birthplace
  - father_id (INT)
  - mother_id (INT)
  - nis
  - nisn
  - nik
  - nickname
  - data (JSON)
  - nationality
  - time (INT / TIME)
[QUERY]
call ldb query "CREATE TABLE student id=aid()&name=string(256)&address=string(512)&gender=int(1)&birthdate=date()&birthplace=string(100)&father_id=int(10)&mother_id=int(10)&nis=string(20)&nisn=string(20)&nik=string(20)&data=string(30000,LDB_BLANK)&nationality=string(100)&time=time()"

[MUTATION]
- religion
- child_order
- siblings (INT)
- step_siblings (INT)
- foster_siblings (INT)
- family_status
- language
- live_with
- school_distance
- blood_group
- illness
- abnormality
- weight
- height
- hobby

call ldb query "ALTER TABLE student ADD_COLUMN(religion=string()&child_order=string()&siblings=int()&step_siblings=int()&foster_siblings=int()&family_status=string()&language=string()&live_with=string()&school_distance=string()&blood_group=string()&illness=string()&abnormality=string()&weight=int()&height=int()&hobby=string())"

[DATA]
- pendidikan_sebelumnya
  - sekolah_asal
  - tanggal_ijazah
  - no_ijazah
  - lama_belajar
- pindahan
  - dari_sekolah
  - alasan
- diterima_di_sekolah_ini
  - kelas
  - angkatan
  - jurusan
  - tanggal
- akhir_pendidikan
  - tanggal
  - alasan
  - no_ijazah
  - melanjutkan_ke
  - mulai_bekerja
  - nama_perusahaan
  - penghasilan
```

## parent
```
- parent
  - id (INT / KEY)
  - name
  - address (JSON)
    - name 
    - rt
    - rw
    - sub_district (desa/kelurahan)
    - district (kecamatan)
    - regency (kabupaten/kota)
    - province (provinsi)
    - zipcode
  - gender int(1)
  - birthdate
  - phone
  - data (JSON)
  - time (INT / TIME)
  - nationality
  - education
  - job
  - salary
[QUERY]
call ldb query "CREATE TABLE parent id=aid()&name=string(256)&address=string(512)&gender=int(1)&birthdate=date()&phone=string(20)&data=string(30000,LDB_BLANK)&time=time()&nationality=string(100)&education=string(100)&job=string(100)&salary=string(100)"
[DATA]
- 
```

## browser
```
- browser
  - id (int aid)
  - code string
  - data string
  - time time
```

## employee_presence
```
- employee_presence
  - id
  - time
  - year
  - month
  - date
  - hour
  - minute
  - employee_id
  - employee_name
  - note
[QUERY]
create table employee_presence id=aid()&time=time()&year=int(4,2024)&month=int(2,0)&date=int(2,1)&hour=int(2,0)&minute=int(2,0)&employee_id=int(10)&employee_name=string(100)&note=string(100)
------
qrcode: ep:2024:kantor/dapur:time
  table: ep
  id   : 2024
  name : kantor/dapur
  space: time (expire)
```



































