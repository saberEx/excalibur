'use strict';
import Com from './common';
const i_padding = Com.px2dp(20);
let o_styles = {
    category:{
        flex:1,
        backgroundColor:"#F2EEEB",
        overflow:"hidden"
    },
    categoryCon:{
        borderBottomWidth:1,
        borderBottomColor:"#E7E5E5",
        backgroundColor:"#EAE9E9",
        paddingLeft:i_padding
    },
    categoryText:{
        height:Com.px2dp(80),
        textAlignVertical:"center",
        fontSize:Com.px2dp(28),
        color:"#000"
    },
    categoryTextActive:{
        backgroundColor:"#fff",
    },
    categoryLists:{
        flex:2,
        paddingLeft:i_padding,
        overflow:"hidden",
    },
    listItem:{
        flexDirection:"row",
        height:Com.px2dp(160),
        borderBottomWidth:1,
        borderBottomColor:"#E7E5E5",
        overflow:"hidden",
    },
    itemImage:{
        width:Com.px2dp(100),
        height:Com.px2dp(100),
        marginTop:Com.px2dp(10),
        borderRadius: 8,
    },
    itemCon:{
        flex:1,
        paddingLeft:i_padding
    },
    itemConTop:{
        flexDirection:"row",
        flex:1,
        paddingTop:i_padding,
        paddingRight:i_padding,
        justifyContent:"flex-end"
    },
    itemConTopText:{
        flex:1,
        color:"#000",
        fontFamily:"微软黑雅",
        fontSize:Com.px2dp(28),
    },
    itemConBottom:{
        flexDirection:"row",
        flex:2,
        alignItems:"flex-end",
        justifyContent:"flex-end",
        paddingBottom:i_padding,
        paddingRight:i_padding,
    },
    arrow:{
        resizeMode :"contain",
        width:6
    },
    priceText:{
        flex:1,
        color:"#E67082",
        fontSize:Com.px2dp(24),
        textAlign:"left",
    },
    submitCon:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection:"row",
        justifyContent:"flex-end",
        height:Com.px2dp(96),
        padding:i_padding,
        borderTopWidth:1,
        borderTopColor:"#D3D3D3"

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
        width:Com.px2dp(150),
        height:Com.px2dp(55),
        backgroundColor:"#EE4E46",
    },
    submitBtnLabel:{
        fontSize:Com.px2dp(24)
    }
};
export default Com.genStyle(o_styles);
