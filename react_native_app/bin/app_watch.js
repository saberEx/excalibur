var Lib = require('./app_lib');
var fs = require('fs');
var watch = require('watch');
watch.watchTree(Lib.getPath(Lib.scriptsUrl), function (f, curr, prev) {
    if (!(typeof f === "object" && prev === null && curr === null)) {
        var outputUrl = Lib.getOutputUrl(Lib.getFileName(f,1));
        //移除文件
        if(curr.nlink === 0){
            fs.unlinkSync(outputUrl);
        }else{//新增文件，//修改文件
            Lib.copyFile(f,outputUrl);
        }
        console.log("fileChange => " + f);
    }
});
