var Lib = require('./app_lib');
var fs = require('fs');
var releaseUrl = Lib.getPath('../release');
var version = JSON.parse(process.env.npm_config_argv).remain[0] || "";
var buildPath = Lib.getPath('./app/build/outputs/apk');
//生成目录
function mkdirSync(path){
    if(!fs.existsSync(Lib.getPath(path))){
        fs.mkdirSync(Lib.getPath(path));
    }
}
mkdirSync(releaseUrl);
Lib.walk(buildPath,function(temPath) {
    if(/\-release\.apk$/.test(temPath)){
        var fileName = Lib.getFileName(temPath);
        if(version){
            fileName = fileName.replace('\-release','-release-'+version);
        }
        // 创建读取流
        var readable = fs.createReadStream(temPath);
        // 创建写入流
        var writable = fs.createWriteStream(Lib.getPath(releaseUrl+'/'+fileName));
        // 通过管道来传输流
        readable.pipe( writable);
    }
})
