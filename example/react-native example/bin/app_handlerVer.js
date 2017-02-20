/*
* @Author: 代汉桥
* @Date:   2016-06-07 13:41:30
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-07 13:59:36
* 处理文件版本
* 版本号第二位第三位不能超过10如1.10.1,1.0.10均不符合
*/

'use strict';

var Lib = require('./app_lib');
var fs = require('fs');
var version = JSON.parse(process.env.npm_config_argv).remain[0] || "";
var xmlPath = Lib.getPath('./app/src/main/AndroidManifest.xml');
//修改AndroidMainfest.xml
var xmlData=fs.readFileSync(xmlPath,"utf-8");
xmlData = xmlData.replace(/android:versionName="[\d|\.]+">/,'android:versionName="'+version+'">');
xmlData = xmlData.replace(/android:versionCode="[\d]+"/,'android:versionCode="'+verToCode(version)+'"');
fs.writeFileSync(xmlPath,xmlData);
function verToCode(ver){
	var a_ver = ver.split('.');
	return parseInt(a_ver[0])*100 + parseInt(a_ver[1])*10 + parseInt(a_ver[2])*1;
}
