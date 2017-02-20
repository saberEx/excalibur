'use strict';
import Com from './common';
let o_styles = {
    topInfo:{
    	flexDirection:"row",
    	backgroundColor:'#fff',
    	marginTop:Com.px2dp(20),
    },
    itemColumn:{
    	flexDirection:"column",
		flex:1,
		alignItems: 'center',
    },
    itemText:{
    	marginTop:Com.px2dp(20),
		color:'#AAAAAA',
    	fontSize:12,
    },
    midText:{
    	color:'#AAAAAA',
    	fontSize:12,
    },
    receivableItemMoney:{
    	marginTop:Com.px2dp(10),
    	marginBottom:Com.px2dp(20),
		color:'#F5620D',
    	fontSize:18,
    },
    totalItemMoney:{
    	marginTop:Com.px2dp(10),
    	marginBottom:Com.px2dp(20),
		color:'#70A9DB',
    	fontSize:18,
    },
    memberImg:{
        width:Com.px2dp(80),
        height:Com.px2dp(80),

    },
    memberIconSty:{
        width:Com.px2dp(25),
        height:Com.px2dp(25),
    },
    verticalLine:{
    	marginTop:Com.px2dp(20),
    	marginBottom:Com.px2dp(20),
    	width:1,
    	backgroundColor:'#D7D7D7',
    },
    verticalLine1:{
    	width:1,
    	backgroundColor:'#D7D7D7',
    },
    horizontalLine:{
    	// marginLeft:Com.px2dp(20),
    	// marginRight:Com.px2dp(20),
    	// height:1,
    	backgroundColor:'red',
    },
    img:{
    	width:Com.px2dp(80),
    	height:Com.px2dp(80),
    },
    submitCon:{
        paddingTop:Com.px2dp(10),
        paddingBottom:Com.px2dp(10),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
        backgroundColor:'#fff'

    },
    submitBtnLabel:{
        fontSize:Com.px2dp(24)
    },
    clearingForm:{
        backgroundColor:'#fff',
        marginTop:Com.px2dp(20),
    },
    clearingFormText:{
        color:'#626262',
        fontSize:Com.px2dp(22)
    },
    clearingFormItem:{
        marginTop:Com.px2dp(2),
    },
    vkeValueStyle:{
        padding:Com.px2dp(10),
        marginLeft:Com.px2dp(20),
        marginTop:Com.px2dp(10)
    },
    inputText:{
        paddingLeft:Com.px2dp(10),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection:'row',
        height:Com.px2dp(80)
    },
    pTitleStyle:{
        color:'#000',
        fontSize:Com.px2dp(25),
    },
    pTextStyle:{
        color:'#000',
        fontSize:Com.px2dp(40),
    },
};
export default Com.genStyle(o_styles);
