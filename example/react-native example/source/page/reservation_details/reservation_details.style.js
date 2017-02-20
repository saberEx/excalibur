'use strict';
import Com from './common';
const {px2dp,mainColor} = Com;
const s_height = px2dp(50);
const _pad20 = px2dp(20);
const _borderColor = "#E3E3E3";
let o_styles = {
    container:{
        backgroundColor:"#F2EEEB",
    },
    textHeight:{
        height: s_height,
    },
    itemContainer:{
        borderBottomWidth:0.5,
        borderBottomColor:_borderColor,
        marginTop:px2dp(26),
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
        alignSelf:"center"
    },
    itemAddTime:{
        marginRight:  px2dp(70),
        color:"#999999"
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
    goodsItem:{
        flexDirection:"row",
        height:px2dp(160),
        borderBottomWidth:0.5,
        borderBottomColor:"#E7E5E5",
        overflow:"hidden",
        paddingRight:_pad20,
        paddingLeft:_pad20,
    },
    goodsItemImage:{
        width:px2dp(100),
        height:px2dp(100),
        marginTop:px2dp(30),
        borderRadius: 8,
    },
    goodsItemCon:{
        flex:1,
        paddingLeft:_pad20
    },
    goodsItemTopText:{
        flex:1,
        color:"#333333",
        fontFamily:"微软黑雅",
        fontSize:px2dp(28),
        textAlignVertical:"center"
    },
    goodsItemConBottom:{
        flexDirection:"row",
        flex:1,
    },
    goodsItemTextCon:{
        fontSize:px2dp(24),
        textAlignVertical:"center",
        color:"#999999"
    },
    priceText:{
        color:"#DD354E",
    },
    goodsItemTextNum:{
        marginLeft:px2dp(20),
    },
    goodsItemTotalPrice:{
        textAlign:"right",
    },
    submitCon:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection:"row",
        justifyContent:"flex-end",
        height:px2dp(96),
        padding:_pad20,
        borderTopWidth:1,
        borderTopColor:"#C6C6C6"

    },
    submitText:{
        flex:1,
        textAlignVertical:"center",
        textAlign:"left",
    },
    textColorNum:{
        color:"#DE3D55"
    },
    submitBtn:{
        width:px2dp(150),
        height:px2dp(55),
        backgroundColor:"#EE4E46",
        borderRadius:3
    },
    submitBtnLabel:{
        fontSize:px2dp(24)
    },
    labelInputLabel:{
        fontSize:px2dp(24),
        color:"#999999",
        textAlign:"left",
        marginRight:0
    },
    textInputStyle:{
        paddingLeft:0,
        fontSize:px2dp(26),
        color:"#333333",
    }
};
export default Com.genStyle(o_styles);
