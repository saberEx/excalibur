'use strict';
import Base from './base';
let o_buttonStyle = {
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Base.btnColor,
        marginTop: 0,
        borderRadius:5,
        height:Base.px2dp(70),
    },
    buttonText: {
        fontSize: Base.px2dp(28),
        fontWeight: 'bold',
        color: Base.btnTitleColor,
    },
    blockBtnStyle:{
        marginLeft:Base.px2dp(20),
        marginRight: Base.px2dp(20),
    },
};
export default Base.genStyle(o_buttonStyle);
