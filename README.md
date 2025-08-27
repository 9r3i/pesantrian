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



