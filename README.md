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














