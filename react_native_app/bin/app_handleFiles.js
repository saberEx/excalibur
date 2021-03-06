/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:40:09
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-19 14:11:27
* 处理文件
* 遍历scipts目录，将APP端所有文件拷贝到输出目录，解决文件引入路径问题
* 遍历时，将输出入口文件索引文件
*/

var fs = require('fs');
var Lib = require('./app_lib.js');
//生成目录
function mkdirSync(path){
    if(!fs.existsSync(Lib.getPath(path))){
        fs.mkdirSync(Lib.getPath(path));
    }
}
//清空输出目录
if(fs.existsSync(Lib.getOutputUrl())){
    Lib.walk(Lib.getOutputUrl(),function(tmpPath){
        fs.unlinkSync(tmpPath);
    });
}
function handleFiles() {
    //将app端文件全部拷贝到输出目录
    mkdirSync(Lib.getOutputUrl());
    var entryConfigData = "";
    var o_componentsData = "export let o_components = {";
    var o_reducersData = "export let o_reducers = {";
    //复制文件到输出目录
    Lib.walk(Lib.scriptsUrl,function(temPath) {

        var fileName = Lib.getFileName(temPath,1);
        var outPutPath = Lib.getOutputUrl(fileName);
        Lib.copyFile(temPath,outPutPath,true);

        //将入口文件生成路由索引
        if(/\.entry\.js$/.test(fileName)){
            var fileNameNoEntry = fileName.replace(/\.entry\.js$/,'');
            var component  = fileNameNoEntry.replace(/(\w)/,function(v){return v.toUpperCase()});
            entryConfigData += "import * as "+ component + " from " + '\"./'+ fileNameNoEntry + '.manager\";\n';
            o_componentsData += "\n    "+fileNameNoEntry+":"+component+'.Component,';
            o_reducersData += "\n     ..."+component+".reducers"+",";
        }
    });
    o_componentsData += "\n};\n";
    o_reducersData += "\n};\n";
    entryConfigData += o_componentsData + o_reducersData;
    fs.writeFileSync(Lib.getPath(Lib.getOutputUrl('indexConfig.js')),entryConfigData);
}
handleFiles();
module.exports = handleFiles;
