'use strict';
import Base from './base';
let o_inputStyle = {
    labelContainer :{
        flexDirection:"row",
    },
    inputText: {
        fontSize: Base.px2dp(28),
        paddingLeft:Base.px2dp(10)
    },
    label:{
        width:Base.px2dp(130),
        marginRight:Base.px2dp(20),
        textAlign:'right',
        alignSelf:'center',
    }
};
export default Base.genStyle(o_inputStyle);
