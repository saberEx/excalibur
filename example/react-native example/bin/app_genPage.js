/*
* @Author: 代汉桥
* @Date:   2016-05-19 11:38:32
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-24 11:09:19
*/
'use strict';
var Lib = require('./app_lib.js');
var fs = require('fs');
var a_remain = JSON.parse(process.env.npm_config_argv).remain;
var pageName =  a_remain[0];
var s_title = a_remain[1];
if(!pageName){
    throw "必须输入新页面名字";
}
if(!s_title){
    throw "必须输入页面标题";
}
//页面组件名，首字母大写
var component  = pageName.replace(/(\w)/,function(v){return v.toUpperCase()});
var entName = pageName.toUpperCase()+'_INIT_COMPONENT';
var s_jsData = '\'use strict\';\n' +
'import React,{ Component } from \'react\';\n' +
'import { View } from \'react-native\';\n' +
'import Com from \'./common\';\n' +
'import {TopBar} from \'./components\';\n'+
'import o_styles from \'./'+pageName+'.style\';\n' +
'const {baseContent} = Com;\n' +
'class '+component+' extends Component {\n' +
'    componentDidMount(){\n' +
'        this.props.init();\n' +
'    }\n' +
'  	render() {\n' +
'	    return (\n' +
'            <View>\n' +
'                <View style={baseContent}>\n' +
'                    \n'+
'                </View>\n' +
'                <TopBar s_title="'+s_title+'"/>\n' +
'            </View>\n' +
'        );\n' +
'    }\n' +
'}\n' +
'export default '+component+';';
var s_styleData = "'use strict';" +
"\nimport Com from './common';" +
"\nlet o_styles = {" +
"\n    " +
"\n};" +
"\nexport default Com.genStyle(o_styles);";
var s_managerData ='\'use strict\';\n' +
'import Com from \'./common\';\n' +
'import Component from \'./'+pageName+'.component\';\n' +
'import BaseManager from \'./baseManager\';\n' +
'\n' +
'export default class Manager extends BaseManager{\n' +
'    constructor(props){\n' +
'        super(Component,"'+pageName+'");\n' +
'        let _manager = this;\n' +
'        //初始状态\n'+
'        //this.initialState={};\n' +
'        //动作\n' +
'        this.actions = {\n' +
'            init(){\n' +
'                return (dispatch, getState) => {\n' +
'                    \n' +
'                };\n' +
'            }\n' +
'        };\n' +
'        //处理\n' +
'        //this.reducers = (state,action)=>{\n' +
'            //switch( action.type ){\n' +
'               //default:\n' +
'                   //return state;\n' +
'            //}\n' +
'        //};\n' +
'    }\n' +
'}\n';

var exists = function(dst){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            throw "该目录已存在，请重命名-------";
        }else{
            fs.mkdir( dst, function(){
                var js_dst,style_dst,manager_dst;
                js_dst = dst + '/' + pageName + ".component.js";
                style_dst = dst + '/' + pageName + ".style.js";
                manager_dst = dst + '/' + pageName + ".manager.js";
                fs.writeFileSync(js_dst,s_jsData);
                fs.writeFileSync(style_dst,s_styleData);
                fs.writeFileSync(manager_dst,s_managerData);
            });
        }
    });
};
exists(Lib.getPath('./source/page/'+pageName));


