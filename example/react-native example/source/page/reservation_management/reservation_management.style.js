'use strict';
import Com from './common';
const {px2dp,mainColor} = Com;
const s_height = px2dp(50);
const _pad20 = px2dp(20);
const _borderColor = "#E3E3E3";
let o_styles = {
   /* container:{
        backgroundColor:"#F2EEEB",
    },
    itemGroup:{
        backgroundColor:"#F2EEEB",
    },*/
    textHeight:{
      height: s_height,
    },
    itemGroupName:{
        justifyContent: 'space-between',
        paddingBottom:px2dp(10),
        paddingTop:px2dp(10),
        paddingLeft:_pad20,
        paddingRight:_pad20,
        borderBottomWidth:1,
        borderBottomColor:_borderColor,
    },
    itemGroupMT:{
        marginTop:px2dp(-10)
    },
    itemGroupTime:{
        lineHeight:s_height,
        fontSize:px2dp(28),
        textAlignVertical:"center",
        color:"#666666"
    },
    itemGroupCount:{
        lineHeight:s_height,
        fontSize:px2dp(28),
        textAlignVertical:"center",
        color:"#666666"
    },
    itemContainer:{
        backgroundColor:"#fff",
        borderBottomWidth:1,
        borderBottomColor:_borderColor,
        paddingTop:px2dp(15),
        paddingBottom:px2dp(15)
    },
    itemTop:{
        height:s_height,
        justifyContent: 'space-between',
        paddingRight:_pad20,
        paddingBottom:px2dp(10)
    },
    itemTopSpan:{
        backgroundColor:mainColor,
        width:px2dp(4),
        height:px2dp(30),
        marginRight:px2dp(16),
        alignSelf:"center",
    },
    itemContent:{
        paddingLeft:_pad20,
        paddingRight:_pad20,
    },
    cancelBtn:{
        backgroundColor:"transparent",
        padding:0,
    },
    cancelBtnNone:{
        backgroundColor:"transparent",
        padding:0,
        opacity:0
    },
    btnTextStyle:{
        color:"#4A8DFB",
        fontSize:px2dp(26),
    },
    arrowImage:{
        width:px2dp(16),
        resizeMode :"contain",
        position:'absolute',
        top:px2dp(70),
        right:px2dp(20),
    },
    scrollViewBg:{
        backgroundColor:"#F2EEEB",
    },
    scrollViewContent:{
      paddingBottom:  px2dp(70),
        backgroundColor:"#F2EEEB",
    },
    bottomBtnContainer:{
        paddingTop:px2dp(15),
        paddingBottom:px2dp(15),
        backgroundColor:"#fff",
        borderTopWidth:0.5,
        borderTopColor:_borderColor,
    },
    tabBarStyle:{
        height:px2dp(80),
        paddingBottom:0,
    },
};
export default Com.genStyle(o_styles);
