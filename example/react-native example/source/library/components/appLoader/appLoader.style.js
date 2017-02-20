/*
 * loading组件样式
 */

'use strict';
import Base from './base';
//图片宽高
let n_img_wh = Base.px2dp(80);
let o_loadingSpannerStyle = {
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.3)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingLogo:{
        position: 'absolute',
        width: n_img_wh,
        height: n_img_wh,
        left:( Base.deviceWidth - n_img_wh)* 0.5,
    },
    loadingWarp:{
        width:n_img_wh,
        height:n_img_wh,
    },
};
export default Base.genStyle(o_loadingSpannerStyle);
