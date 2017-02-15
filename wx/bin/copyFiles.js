'use strict';
//小程序复制文件脚本
var Lib = require('./buildLib.js');
var newAppFilePath = Lib.getOutDir();;
var fs = require('fs');
var stat = fs.stat;
let sass = require('node-sass');
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
    fs.exists(dst, function(exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function() {
                callback(src, dst);
            });
        }
    });
};
/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var a_ignoreFile = ['.scss', '.gitignore'];
var copy = function(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function(err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function(path) {
            var _src = src + '/' + path,
                _dst = newAppFilePath + '/' + path,
                readable, writable;
            stat(_src, function(err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    if (a_ignoreFile.indexOf(path) !== -1) {
                        return;
                    }
                    let fileType = path.split('.').pop().toLowerCase();
                    if (fileType === 'scss') {
                        let result = sass.renderSync({
                            file: _src
                        });
                        let newPath = newAppFilePath + '\\' + path.replace(/\.scss/, '') + '.wxss';
                        Lib.genWxss(newPath, result.css);
                        return false;
                    }
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                } else if (st.isDirectory()) { // 如果是目录则递归调用自身
                    copy(_src, _dst);
                }
            });
        });
    });
};

exists('./src', newAppFilePath, copy);