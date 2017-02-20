/*
* @Author: 代汉桥
* @Date:   2016-05-31 13:36:51
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-31 15:42:01
*/

'use strict';
import Base from './base';
let o_styles = {
    container: {
        flexDirection:'row',
    },
    inputView:{
    	borderBottomColor:"#A09E9E",
    	borderTopColor:"#A09E9E",
    	borderBottomWidth: 0.5,
    	borderTopWidth: 0.5,
    	backgroundColor: '#fff',
    },
    input:{
    	textAlignVertical: "center",
    	paddingTop:0,
    	paddingBottom:0,
    	textAlign: "center"
    }
};
export default Base.genStyle(o_styles);
