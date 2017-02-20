'use strict';
import Com from './common';
import Base from './base';
const i_padding = Com.px2dp(20);
let o_styles = {
	specItem:{
		marginTop:Com.px2dp(20),
		justifyContent: 'space-between',
	},
	specLable:{
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: Com.px2dp(20),
		flexDirection:'row'
	},
	specPriceLabel:{
		color:'#B3B3B3'
	},
	specPrice:{
		color:'#DE3D55',
		marginLeft:Com.px2dp(8)
	},
	nameLable:{
		marginTop:Base.px2dp(20),
		paddingLeft:Base.px2dp(30),
		paddingRight:Base.px2dp(30),
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection:'row',
		height:Base.px2dp(80)
	},
	nameListText:{
		color:Com.mainColor,
		marginRight:Com.px2dp(10),
		// position:'absolute',
		// right:25,
	},
	b3Text:{
		color:'#B3B3B3'
	},
	c59Text:{
		color:'#595959',
		marginLeft:Com.px2dp(10)
	},
	inputText:{
		marginTop:Base.px2dp(20),
		paddingLeft:Base.px2dp(20),
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		// flexDirection:'row',
		height:Base.px2dp(80)
	},
	rightArrowImg:{
		// position:'absolute',
		// right:10,
	},
	container: {
        backgroundColor: '#f1f1f1',
        height:Com.DeviceHeight,
        flex:1
    },
    submitCon:{
        paddingTop:Com.px2dp(20),
        paddingBottom:Com.px2dp(20),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
        backgroundColor:'#fff'

    },
    submitBtn:{
        width:Com.deviceWidth,
        height:Com.px2dp(70),
        backgroundColor:Com.mainColor,
      	paddingLeft:Com.px2dp(20),
		paddingRight:Com.px2dp(20)
    },
    submitBtnLabel:{
        fontSize:Com.px2dp(24)
    },
    imageBg:{
    	flex:1,
    	width:Com.deviceWidth,
    }
};
export default Com.genStyle(o_styles);
