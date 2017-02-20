'use strict';
import Com from './common';
const {px2dp,mainColor} = Com;
const _pad20 = px2dp(20);
const _borderColor = "#E3E3E3";
const _rowHeight = 32;
let o_styles = {
    paddingCon:{
        paddingLeft:_pad20,
        paddingRight:_pad20
    },
    labelStyle:{
        fontSize:px2dp(26),
        color:"#999"
    },
    bottomBtnContainer:{
        paddingTop:px2dp(15),
        paddingBottom:px2dp(15),
        backgroundColor:"#fff",
        borderTopWidth:0.5,
        borderTopColor:_borderColor,
    },
    arrowImage:{
        width:px2dp(12),
        resizeMode :"contain",
        alignSelf:"center",
    },
    labelTitleStyle:{
        alignSelf:"center",
        color:"#999"
    },
    o_labelStyle:{
        alignSelf:"center",
        color:"#333",
        textAlign:"right",
        flex:1,
        marginRight:_pad20
    },
    rowHeight:{
        height:_rowHeight
    },
    radioItem:{
        paddingTop:0,
        paddingBottom:0,
        height:_rowHeight
    },
    mulText:{
        paddingTop:10,
        paddingBottom:10,
        lineHeight:32,
        color:"#333",
        backgroundColor:"#fff",
        fontSize:px2dp(28),
        textAlignVertical:"top"
    }
};
export default Com.genStyle(o_styles);