/*
* @Author: 代汉桥
* @Date:   2016-11-16 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-10 10:46:32
*/

'use strict';
require('footerBuyCss');
let store_alias = Com.getPageParams("store_alias");
let shop_id = Com.getPageParams("shop_id");
let ContactSeller = require("contactSeller");
class FooterBuy extends React.Component {
	constructor(props){
		super(props);
		this.state = {b_cartNum:this.props.data||0,is_favorites:this.props.is_favorites,s_collection:this.props.is_favorites?"已收藏":"收藏"};
	}
	f_spec(type){
		this.props.f_spec(type);
	}
	f_collection(){
		let {is_favorites,s_collection} = this.state;
		s_collection = is_favorites?"收藏":"已收藏";
		Com.postVerify({act:'member_favorites',op:'favorites_add',alias:this.props.goods_alias,shop_id:shop_id,type:1},(res)=>{
			if(parseInt(res.code)===0){
				this.setState({is_favorites:!is_favorites,s_collection:s_collection})
			}else{
				Com.toast(res.msg);
			}
		});
	}
	f_service(){
		if(!this.b_hasService){
			Com.getNormal({act:'normal_index',op:'getStoreSubscibeCode',store_alias:store_alias},(res)=>{
				if(parseInt(res.code)===0){
					this.b_hasService = res.data.img;
					ContactSeller.show(res.data.img);
				}else{
					Com.toast(res.msg);
				}
			});
		}else {
			ContactSeller.show(this.b_hasService);
		}
	}
	render() {
		let {s_collection,is_favorites,b_cartNum} = this.state;
		return (
			<footer className="footerBuy">
                <div className="footerItem w16 service" onClick={()=>this.f_service()}>
                	<span className="itemIco"></span>
                	<p>客服</p>
                </div>
                <div className={`footerItem w16 collect ${is_favorites?"active":""}`} onClick={()=>this.f_collection()}>
                	<span className="itemIco"></span>
                	<p>{s_collection}</p>
                </div>
                <div className="footerItem w20 shopCart" onClick={()=>Com.openWin("myShopCart")}>
                	<span className="itemIco"></span>
					{b_cartNum>0?<span className="shopNum">{b_cartNum}</span>:null}
                	<p>购物车</p>
                </div>
                <div className="footerItem w25">
                	<button className="footBuyBtn shopCar" onClick={()=>this.f_spec(1)}>加入购物车</button>
                </div>
                <div className="footerItem w25">
                	<button className="footBuyBtn"  onClick={()=>this.f_spec(2)}>立即购买</button>
                </div>
            </footer>
		);
	}
}
module.exports = FooterBuy;




