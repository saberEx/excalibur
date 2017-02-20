/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-27 15:41:40
* 基础样式及基础样式配置
*/
import Utils,{isAndroid} from './utils';
const {px2dp} = Utils;

//基础样式配置
export let baseStyleConfig = {
    mainColor:'red',//主色调
    bottomHeight:59,//底部导航高
    //topBar相关
    topHeight:isAndroid ? Utils.px2dp(84) : Utils.px2dp(104),//topBar高
    topBarTitleColor:'#000',//topBar标题色
    topBarBgColor:'#fff',//topBar背景色
    //按钮相关
    btnColor:'#fff',//按钮主色
    btnTitleColor:'#000',//按钮文本色
    //输入框相关
    placeholderColor:'#BFC4CD',//输入框提示颜色
    tintColorColor:'#ccc',//输入框底线没选中是颜色
};

const value10 = px2dp(10);
const value20 = px2dp(20);
//基础样式
export let baseStyle = {
	//内容区样式
	baseContent:{
		marginTop:baseStyleConfig.topHeight,
	},
    baseCenter:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    baseRowCenter:{
        justifyContent: 'center',
    },
    baseBetween:{
        justifyContent: 'space-between',
    },
    baseColCenter:{
        alignItems: 'center'
    },
    baseFlex:{
        flex:1,
    },
    baseRow:{
        flexDirection:'row'
    },
    //边距
    baseP10:{
        paddingBottom:value10,
        paddingTop:value10,
        paddingLeft:value10,
        paddingRight:value10,
    },
    basePTB10:{
        paddingBottom:value10,
        paddingTop:value10,
    },
    basePTB20:{
        paddingBottom:value20,
        paddingTop:value20,
    },
    baseML20:{
        marginLeft:value20,
    },
    baseMB10:{
        marginBottom:value10,
    },
    baseMB20:{
        marginBottom:value20,
    },
    baseMT10:{
        marginTop:value10,
    },
    baseMT20:{
        marginTop:px2dp(20),
    },
    baseMR10:{
        marginRight:value10,
    },
    baseMR20:{
        marginRight:value20,
    },
    //颜色
    baseBodyBgColor:{
        backgroundColor:'#f2EEEb',
    },
    baseBgColorW:{
        backgroundColor:'#FFF',
    },
    baseColorG:{
        color:'#999',
    },
    baseColorMG:{
        color:'#666',
    },
    baseColorHG:{
        color:'#333',
    },
};
