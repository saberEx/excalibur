/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2016-09-22 19:00:16
*/

'use strict';
require('salesGoodsCss');
var SalesGoodsItem = React.createClass({
	propTypes : {
		s_name : React.PropTypes.string.isRequired,//商品名称
		s_img : React.PropTypes.string,//商品图片
		s_price : React.PropTypes.string,//商品金额
		f_infoClick : React.PropTypes.func,//详情点击回调
		s_alias : React.PropTypes.string,//商品别名
		s_store_alias : React.PropTypes.string,//店铺别名
		s_shop_id : React.PropTypes.string,//店铺id
	},
	f_infoClick:function(){
		this.props.f_infoClick(this.props.s_alias,this.props.s_store_alias,this.props.s_shop_id);
	},
	render:function(){
		var {s_name,s_img,s_price} = this.props;
		return (
			<li >
                <div className="goods_img" onClick={this.f_infoClick} style={{'backgroundImage':'url('+s_img+')', backgroundPosition:'center center', backgroundRepeat:'no-repeat'}}></div>
                <p className="base-ellipsis">{s_name}</p>
                <p>
                    <span className="base-fl price">{s_price}</span>
                </p>
            </li>
		);
	}
});
var SalesGoods = React.createClass({
	propTypes : {
		a_data : React.PropTypes.array.isRequired,
		f_infoCallBack : React.PropTypes.func,//详情回调
	},
	f_infoCallBack(s_alias,store_alias,shop_id){
	    this.props.f_infoCallBack(s_alias,store_alias,shop_id);
	},
	render:function(){
		var _self = this;
		var e_items = this.props.a_data.map(function(item,key){
            return <SalesGoodsItem key={key} s_name={item.goods_name} s_img={item.goods_image} s_price={item.goods_price} s_store_alias={item.store_alias} s_shop_id={item.shop_id} s_alias={item.goods_alias} f_infoClick={_self.f_infoCallBack}/>;
        });
        return(
        	<div className="goods_list">
                 <ul>
					{e_items}
			 	 </ul>
            </div>
        );

	}
});
module.exports = SalesGoods;
