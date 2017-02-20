
'use strict';
import Base from './base';
let {px2dp} = Base;
//图片宽高
let o_contentBlankStyle = {
    container:{
        flex:1,
        paddingTop:px2dp(180),
        alignItems:"center"
    },
    contentBlankImg:{
        resizeMode :"contain",
        width:px2dp(257),
        height:px2dp(253),
        marginBottom:px2dp(50)
    },
    contentBlankText:{
        textAlignVertical:"center",
        fontSize:px2dp(28),
        color:"#666666",
        textAlign:"center"
    }
};
export default Base.genStyle(o_contentBlankStyle);
