'use strict';
import Com from './common';
let deviceW = Com.deviceWidth;
let num = 3;
let itemMargin = Com.px2dp(40);
let itemW = (deviceW - (num+1)*itemMargin) / num;
let o_styles = {
	titleViewStyle:{
		fontSize:Com.px2dp(24),
	},
	textStyel:{
		marginTop:Com.px2dp(20),
    	marginBottom:Com.px2dp(10),
		alignSelf:'center',
		fontSize:Com.px2dp(20),
		color:'gray',
	},
    balanceStyle:{
    	marginBottom:Com.px2dp(20),
    	alignSelf:'center',
    	fontSize:Com.px2dp(46),
    	color:'#EC7D31',
    },
    balanceViewStyle:{
    	alignSelf:'center',
    },
    okbtnViewStyle:{
        paddingTop:Com.px2dp(10),
        paddingBottom:Com.px2dp(10),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
    },
    okBtnSytle:{
    	marginLeft:Com.px2dp(20),
    	marginRight:Com.px2dp(20),
    },
    btnStyle:{
        marginTop:Com.px2dp(20),
        marginLeft:itemMargin,
        marginBottom:Com.px2dp(20),
        borderRadius:6,
        height:itemW,
        width:itemW,
        borderColor:Com.mainColor,
        borderWidth:Com.px2dp(2),
    },
    bigBtnAvtiveBorder:{
        borderColor:Com.mainColor,
        backgroundColor:Com.mainColor,
    },
    textColWhite:{
        color:'#fff',
    },
    btnTextOne:{
        marginBottom:Com.px2dp(10),
        marginTop:Com.px2dp(40),
        color:Com.mainColor,
        fontSize:Com.px2dp(36),
        alignSelf:'center',
    },
    btnTextTwo:{
        fontSize:Com.px2dp(24),
        color:'#C5C5C5',
        alignSelf:'center',
    },
    lineStyle:{
        borderTopWidth:0.5,
        borderTopColor:"#D3D3D3",
    },
    litileTextOne:{
        marginTop:Com.px2dp(6),
    },
    litileTextTwo:{
        marginTop:Com.px2dp(6),
        color:Com.mainColor,
    },
};
export default Com.genStyle(o_styles);
