'use strict';
import Base from './base';
let {px2dp} = Base;
let o_listViewStyle = {
    paginationView:{
        height:px2dp(70),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:"row",
        backgroundColor:"#f2EEEb"
    },
    paginationText:{
        fontSize:px2dp(26),
        fontFamily:"微软雅黑",
        color:"#999"
    }
};
export default Base.genStyle(o_listViewStyle);
