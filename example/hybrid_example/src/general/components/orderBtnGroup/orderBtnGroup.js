//订单列表底部按钮
'use strict';
require("orderBtnGroupCss");
var classSet = require('classnames');
// i_cls 0 隐藏 1黑色 2红色
////[{text:"查看进度",i_cls:1,index:0},{text:"",i_cls:0,index:1}]
class OrderBtnGroup extends React.Component{
    constructor(props){
        super(props);
        // this.state = {
        //     a_data:this.props.a_datas,
        //     b_isShowNav:true,
        // }
    }
    f_onClick(index){
        this.props.f_onClick && this.props.f_onClick(index);// if  f_onClick=> f_onClick else null
    }
    render(){
        let {a_datas,b_isShowNav} = this.props;
        let s_container  = classSet("orderBtnGroup",{"base-hide":!b_isShowNav});
        let o_left = a_datas[0] || {};
        let o_right = a_datas[1] || {};
        let i_clsLeft = parseInt(o_left.i_cls);
        let i_clsRight = parseInt(o_right.i_cls);
        let s_clsLeft  = classSet("base-btn",{'hidden':(0==i_clsLeft),"goBuy":(i_clsLeft===2)});
        let s_clsRight  = classSet("base-btn ",{'hidden':(0==i_clsRight),"goBuy":(i_clsRight===2)});
        return (
            <div className={s_container}>
                <div className="order_handle">
                    <a href="javascript:void(0);" className={s_clsLeft} onClick={()=>{this.f_onClick(o_left.index)}}>{o_left["text"]}</a>
                    <a href="javascript:void(0);" className={s_clsRight} onClick={()=>{this.f_onClick(o_right.index)}}>{o_right["text"]}</a>
                </div>
            </div>
        )
    }
}
module.exports = OrderBtnGroup;
