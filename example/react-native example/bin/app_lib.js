// @Author: daihanqiao
// @Date:   2016-04-22 11:18:14
// Copyright (c) 2016 by daihanqiao. All Rights Reserved.
// 脚本公共库
'use strict';
var path = require('path');
var fs = require('fs');
var com = {
    //代码文件所在源目录
    scriptsUrl:'./source',
    //输出目录
    getOutputUrl:function(fileName){
        fileName = fileName || "";
        return this.getPath('./output/' + fileName);
    },
    //获取绝对路径
    getPath:function(url){
        return path.resolve('./', url);
    },
    //遍历文件
    walk:function(path, handleFile){
        var self = this;
        self.files = fs.readdirSync(path);
        self.files.forEach(function(item) {
            var tmpPath = path + '/' + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                if(item === '.svn' || item === 'node_modules'){
                    return false;
                }
                self.walk(tmpPath,handleFile);
            } else {
                handleFile(tmpPath,stats);
            }
        });
    },
    //获取文件名，type:0,不带文件类型,1:带文件类型
    getFileName:function(filePath,type){
        return type === 1 ? path.basename(filePath) : path.basename(filePath).split('.')[0];
    },
    //复制文件
    copyFile:function(filePath,outputPath,checkExists){
        if(checkExists){
            if(fs.existsSync(outputPath)){
                throw "出现重名文件："+ filePath;
            }
        }
        // 创建读取流
        var readable = fs.createReadStream(filePath);
        // 创建写入流
        var writable = fs.createWriteStream(outputPath);
        // 通过管道来传输流
        readable.pipe(writable);
    }
};
module.exports = com;
