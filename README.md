# pesantrian
an app with pesantrian

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

## peureut heula
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



