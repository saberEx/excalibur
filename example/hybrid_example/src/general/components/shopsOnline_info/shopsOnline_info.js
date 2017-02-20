/*
* @Author: 万敏
* @Date:   2016-11-28 14:45:49
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-15 15:49:52
*/

'use strict';
require('shopsOnline_infoCss');
let store_alias = Com.getPageParams("store_alias");
let CallEl = require('callEl');
let ContactSeller = require("contactSeller");

class ShopsOnline_info extends React.Component {
	leftClick(){
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
		let item =	null;
		if (this.props.phone) {
			item =	<ul className="line_box">
			                <li onClick={()=>this.leftClick()}>
			                    <img src={require("store_shophomeImg")} alt="" />联系卖家
			                </li>
			                <CallEl mobile={this.props.phone}>
				                <li>
				                    <img src={require("store_home_telImg")} alt="" />
				                    卖家电话
				                </li>
			                </CallEl>
			            </ul>
		}else{
			item = <ul className="line_box one_box">
		                <li onClick={()=>this.leftClick()}>
		                    <img src={require("store_shophomeImg")} alt=""/>联系卖家
		                </li>
		            </ul>;
		}
		return (
			<div>
			{item}
			</div>
		);
	}
}
module.exports = ShopsOnline_info;




