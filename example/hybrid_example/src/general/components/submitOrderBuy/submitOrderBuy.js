/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-14 11:37:16
*/

'use strict';
require('submitOrderBuyCss');

class SubmitOrderBuy extends React.Component {
    constructor(props){
        super(props);
        this.state = {i_num:this.props.i_num ||0,n_price:this.props.n_price || "0.00"}
    }
    onClick(){
        let {n_price,i_num} = this.state;
        this.props.onClick && this.props.onClick(i_num,n_price);
    }
	render() {
        //i_type 判断是金额钱还是积分
        let {s_submit="提交订单",i_type=0} = this.props;
        let {n_price,i_num} = this.state;
        n_price = parseFloat(n_price).toFixed(2);
		return (
			<div className="shopC_submit">
                <div className="shopC_rel">
                    <span>共<em>{i_num}</em>件总{i_type==0?"金额":"积分"}：<em>{i_type==0?"￥"+n_price:n_price}</em></span>
                    <div className="shopC_buy" onClick={()=>this.onClick()}>{s_submit}</div>
                </div>      
            </div>
		);
	}
}
module.exports = SubmitOrderBuy;




