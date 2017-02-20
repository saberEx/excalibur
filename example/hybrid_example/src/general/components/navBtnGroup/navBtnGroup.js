'use strict';
require("navBtnGroupCss");
var classSet = require('classnames');
// i_cls 0 隐藏 1显示
////[{text:"查看进度",i_cls:1,index:0},{text:"",i_cls:0,index:1}]
class NavBtnGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:this.props.a_datas,
            b_isShowNav:true,
        }
    }
    f_onClick(index){
        this.props.f_onClick && this.props.f_onClick(index);// if  f_onClick=> f_onClick else null
    }
    render(){
        let {data,b_isShowNav} = this.state;
        let s_container  = classSet("navBtnGroup",{"base-hide":!b_isShowNav});
        let o_left = data[0] || {};
        let o_right = data[1] || {};
        let i_clsLeft = parseInt(o_left.i_cls);
        let i_clsRight = parseInt(o_right.i_cls);
        let btn_ones = i_clsLeft === 0 || i_clsRight === 0 ? "btn_ones" : "";
        var s_clsLeft = i_clsLeft === 0 ? "base-hide" : "";
        var s_clsRight = i_clsRight === 0 ? "base-hide" : "";
        let s_bottom = classSet("fix_bottom_actions",{btn_ones});
        return (
            <div className={s_container}>
                <div className={s_bottom}>
                        <ul>
                            <li className={s_clsLeft} onClick={()=>{this.f_onClick(o_left.index)}}>{o_left["text"]}</li>
                            <li className={s_clsRight} onClick={()=>{this.f_onClick(o_right.index)}}>{o_right["text"]}</li>
                        </ul>
                </div>
            </div>
        )
    }
}
module.exports = NavBtnGroup;
