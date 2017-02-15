'use strict';
let sass = require('node-sass');
let Lib = require('./buildLib.js');
let fs = require('fs');
let watch = require('watch');
let newAppFilePath = Lib.getOutDir();
let node_env = process.env.NODE_ENV;
if (node_env === 'watch') {
    watch.watchTree('src', function(f, curr, prev) {
        if (!(typeof f === "object" && prev === null && curr === null)) {
            let tmpPath = "" + f;
            let fileType = tmpPath.split('.').pop().toLowerCase();
            let fileName = tmpPath.split('\\').pop().replace(/\.\w+$/, '');
            if (curr.nlink === 0) {
                fs.unlinkSync(newAppFilePath + '\\' + fileName + '.' + fileType);
            } else { //新增文件，//修改文件
                if (fileType === 'scss') {
                    let result = sass.renderSync({
                        file: f,
                        outFile: newAppFilePath + '\\' + fileName + '.wxss',
                    });
                    let newPath = newAppFilePath + '\\' + fileName + '.wxss';
                    Lib.genWxss(newPath, result.css);
                } else {

                    let readable = fs.createReadStream(tmpPath);

                    let writable = fs.createWriteStream(newAppFilePath + '\\' + fileName + '.' + fileType);

                    readable.pipe(writable);
                }
            }
            console.log("fileChange => " + f);
        }
    });
}