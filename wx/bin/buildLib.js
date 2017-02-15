// @Author: daihanqiao
// @Date:   2016-04-22 11:18:14
// Copyright (c) 2016 by daihanqiao. All Rights Reserved.
// 脚本公共库
'use strict';
var path = require('path');
var fs = require('fs');
//参数0
var param0 = JSON.parse(process.env.npm_config_argv).remain[0] || "";
//是否为数字的正则
var numRe = new RegExp(/^(\d+)$/);
var com = {
    //是否为发布版
    isRelease: (process.env.NODE_ENV === 'release'),
    //获取绝对路径
    getPath: function(url) {
        return path.resolve('./', url);
    },
    //获取命令参数，数字则为打对应config
    getConfigType: function() {
        if (numRe.test(param0)) {
            return parseInt(param0);
        }
        return 0;
    },
    //获取输出目录
    getOutDir: function(afterUrl) {
        return this.getPath('release');
    },
    //遍历文件
    walk: function(path, handleFile) {
        var self = this;
        self.files = fs.readdirSync(path);
        self.files.forEach(function(item) {
            var tmpPath = path + '/' + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                if (item === '.svn' || item === '.git') {
                    return false;
                }
                self.walk(tmpPath, handleFile);
            } else {
                handleFile(tmpPath, stats);
            }
        });
    },
    genWxss(newPath, cssData) {
        fs.writeFileSync(newPath, cssData);
        var data = fs.readFileSync(newPath, "utf-8");
        data = data.replace(/\/\*\s*(\@import .+)(\.wxss)(.+;)\s*\*\//g, '$1$2$3');
        data = data.replace(/(\d+)(px)/g, function(res) {
            var rpxValue = parseInt(res) * 2;
            return res.replace(/\d+/, rpxValue + 'r');
        });
        fs.writeFileSync(newPath, data);
    }
};
module.exports = com;