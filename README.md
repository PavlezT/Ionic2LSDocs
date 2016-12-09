# Ionic2LSDocs
mobile native app for LSDocs

git clone https://github.com/PavlezT/Ionic2LSDocs.git

cordova platform add android@4
//to specificate that cordova need 22 target build tools

cordova requirements 
//check android sdk installed properly

ionic state reset

# Pratices
use Allow-Control-Allow-Origin: *  - chrome extention to awoid CORS restritions and make possible to use REST api in browser

(Device.device.uuid) ? (consts.MSOnlineSts) : ('/api' + consts.MSOnlineSts);
//cheking diveci or browser is this
