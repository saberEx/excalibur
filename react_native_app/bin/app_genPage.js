/*
* @Author: 代汉桥
* @Date:   2016-05-19 11:38:32
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 14:45:19
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
var entName = pageName.toUpperCase()+'_DO_SOMETHING';
var s_requireCss = '\n    require(\"'+pageName+'.style\");';
var s_jsData = '\'use strict\';\n' +
'import React,{ Component } from \'react\';\n' +
'import { View } from \'react-native\';\n' +
'import Com from \'./common\';\n' +
'import TopBar from \'./topBar\';\n' +
'class '+component+' extends Component {\n' +
'  	render() {\n' +
'	    return (\n' +
'          	<View>\n' +
'          		<TopBar s_title="'+s_title+'"/>\n' +
'	         	<View style={Com.baseContent}>\n' +
'					\n'+
'	        	</View>\n' +
'        	</View>\n' +
'	    );\n' +
'  	}\n' +
'}\n' +
'export default '+component+';';
var s_styleData = '';
var s_managerData ='\'use strict\';\n' +
'import { createStore , bindActionCreators } from \'redux\';\n' +
'import { connect } from \'react-redux\';\n' +
'import Com from \'./common\';\n' +
'import '+ component +' from \'./'+pageName+'.entry\';\n' +
'\n' +
'//初始的redux state\n' +
'let initialState = {\n' +
'	\n' +
'};\n' +
'\n' +
'//actionType\n' +
'//动作类型用常量表示\n' +
'const '+entName+' = "'+entName.toLowerCase()+'";\n' +
'\n' +
'//action\n' +
'//动作写在这里，包括ajax\n' +
'const actions = {\n' +
'	doSomeThing( params ){\n' +
'		return (dispatch, getState) => {\n' +
'			dispatch({ type : '+entName+' ,"params" : params});\n' +
'		};\n' +
'	},\n' +
'};\n' +
'\n' +
'//reducer\n' +
'//保证传入确定的参数，会输出一样的结果，这里的state是当前组件的redux state\n' +
'export let reducers = {\n' +
'   ' + pageName+'Reducer(state=initialState,action){\n' +
'		switch( action.type ){\n' +
'			case '+entName+':\n' +
'				return { ...state , params : state.params };\n' +
'			default:\n' +
'				return state;\n' +
'		}\n' +
'	}\n' +
'};\n' +
'\n' +
'//将redux state绑定到组件属性中\n' +
'function mapStateToProps( state ) {\n' +
'  	return state.'+pageName+'Reducer;\n' +
'}\n' +
'\n' +
'//将actions绑定到组件属性中\n' +
'function mapDispatchToProps( dispatch ) {\n' +
'  	return bindActionCreators( actions, dispatch );\n' +
'}\n' +
'\n' +
'// 导出和redux连接后的组件\n' +
'export let Component = connect( mapStateToProps , mapDispatchToProps )( '+component+' );\n';

var exists = function(dst){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            throw "该目录已存在，请重命名-------";
        }else{
            fs.mkdir( dst, function(){
                var js_dst,style_dst,manager_dst;
                js_dst = dst + '/' + pageName + ".entry.js";
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


