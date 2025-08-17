# pesantrian
an app with pesantrian

# compile to appbase and deploy to appbase host

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

## compile the whole files
```
ai abl app config
```

## deploy

### check status
```
ai vco status
```

### push the change
```
ai vco push
```



