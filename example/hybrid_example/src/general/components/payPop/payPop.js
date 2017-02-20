/*
* @Author: 卢旺
* @Date:   2016-12-11 16:52:27
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-28 18:01:12
* 支付弹出层
*/
'use strict';
require("payPopCss");
let Scroll = require('scroll');
class PayItem extends React.Component {
	static propsTypes = {
		card_alias_name:React.PropTypes.string,//卡别名
		card_code:React.PropTypes.number,//卡号
		g_rc_balance:React.PropTypes.number,//赠送金额
		rc_balance:React.PropTypes.number,//充值余额
		logo_url:React.PropTypes.string,//图标
		totalPrice:React.PropTypes.number,//总金额
		f_item_callBack:React.PropTypes.func,//选择回调
	}
	itemClick(card_code,s_disable){
		this.props.f_item_callBack(card_code,s_disable);
	}
	render() {
		let {card_alias_name,card_code,totalPrice,g_rc_balance,logo_url,rc_balance} = this.props;
        let n_price = parseFloat(g_rc_balance) + parseFloat(rc_balance);
        let s_disable = totalPrice > n_price?"disable":"";
        return(
	    	<li className={`mui-table-view-cell ${s_disable}`}  onClick={()=>this.itemClick(card_code,s_disable)}>
                <a href="javascript:;" className="mui-navigate-right">
                    <img className="base-fl" src={logo_url}/>
                    <div className="base-fl">
                        <span className="payWayTextUp">{card_alias_name}：{card_code}</span>
                        <div className="payWayTextDown">余额：
                            <span>￥{Com.getNumFormat(n_price)}</span>
                            <span className={totalPrice>n_price?"":"base-hide"}>余额不足</span>
                        </div>
                    </div>
                </a>
            </li>
        );
	}
}
class PayPop extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			b_showMask:this.props.b_showMask
		}
	}
	static propTypes = {
		f_wx_callBack: React.PropTypes.func,//点击微信支付回调
		f_card_callBack: React.PropTypes.func,//点击会员卡回调
	    b_showMask : React.PropTypes.bool,//是否显示
	    a_data: React.PropTypes.array,//item组
	    totalPrice:React.PropTypes.number,//总金额
	}
	componentWillReceiveProps(nextProps){//属性改变
	    if(this.props.b_showMask !== nextProps.b_showMask){
	        this.setState({b_showMask:nextProps.b_showMask});
	    }
	}
	f_itemClick(card_code,s_disable){
		this.setState({b_showMask:false});
		this.props.f_card_callBack(card_code,s_disable);
	}
	f_wxClick(){
		this.setState({b_showMask:false});
		this.props.f_wx_callBack();
	}
	render(){
		let _self = this;
		let {a_data,totalPrice,b_showMask} = this.props;
		let s_popover = this.state.b_showMask ? "active":"";
		let e_card = null;
		if (a_data && a_data.length >0) {
			e_card = a_data.map((item,key)=>{
	 			return <PayItem key={key} card_alias_name={item.card_alias_name} totalPrice={parseFloat(totalPrice)} card_code={item.card_code} g_rc_balance={item.g_rc_balance} rc_balance={item.rc_balance} logo_url={item.logo_url} f_item_callBack={(card_code,s_disable)=>_self.f_itemClick(card_code,s_disable)}/>;
			});
		}
		let e_mask = this.state.b_showMask ? <div className={`backdrop ${s_popover}`} onClick={()=>{this.setState({b_showMask:false})}}/>:null;
		return(
			<div className="pay_pop" onClick={(e)=>e.stopPropagation()}>
				<div className={`card-popover ${s_popover}`} ref="popover">
	                <ul className="mui-table-view">
	                    {e_card}
	                    <li  className="mui-table-view-cell" onClick={()=>this.f_wxClick()}>
	                        <a href="javascript:;" className="mui-navigate-right">
	                            <img className="base-fl" src={require("wx_payImg")}/>
	                            <div className="base-fl">
	                                <span className="payWayTextUp">微信支付</span>
	                                <div className="payWayTextDown">微信安全支付</div>
	                            </div>
	                        </a>
	                    </li>
	                </ul>
	            </div>
	            {e_mask}
            </div>
		);
	}
}
module.exports = PayPop;
