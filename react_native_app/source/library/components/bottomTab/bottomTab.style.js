/*
* @Author: 代汉桥
* @Date:   2016-05-23 11:06:00
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 13:53:15
* 底部导航样式
*/

'use strict';

import Base from './base';
let o_bottomTabStyle = {
	container: {
        flex: 1,
        width: Base.deviceWidth,
        overflow: 'hidden',
        position: 'absolute',
        bottom : 0,
        // height : 100,
    },
    nav: {
        flexDirection: 'row',
        width: Base.deviceWidth,
    },
    navItem: {
        flex: 1,
        paddingTop: 6,
        paddingBottom: 6,
        alignItems: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navImage: {
        width: 24,
        height: 24,
        marginBottom: 2,
    },
    navText: {
        marginTop: 2,
    },
    horizonLine: {
        backgroundColor: '#adadad',
        height: 0.5,
        width: Base.deviceWidth,
    },
    badgeWithNumber: {
        flexDirection: 'row',
        justifyContent: 'center',
        top: -4,
        left: 24,
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff',
        backgroundColor: '#ff0000',
    },
    badgeText: {
        alignSelf: 'center',
        fontSize: 11,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
};
export default Base.genStyle(o_bottomTabStyle);
