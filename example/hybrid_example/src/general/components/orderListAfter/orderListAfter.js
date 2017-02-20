/*
 * @Author: 黄权
 * @Date:   2016-12-07 10:23:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-07 11:25:10
 * 售后订单item
 */
'use strict';
require('orderListAfterCss');
let MediaItem = require('mediaItem');
let GoodsGroup = require('goodsGroup');
let OrderBtnGroup = require('orderBtnGroup');

class OrderListItem extends React.Component{
	static propTypes = {
		f_item_bottomCallBack: React.PropTypes.func,//底部按钮点击回调
	    a_itemDatas : React.PropTypes.array,//数据源
	}
	bottom_onClick(refund_id){//底部按钮块
		Com.openWin("order_refundDetails",{refund_id:refund_id});
	}
	goods_onClick(orderId){//商品点击回调
		Com.openWin('my_order_detail',{orderId:orderId});
	}
	render(){
		let data = this.props.data;
		let topStateList = [{text:"待商家确认",index:-1},{text:"待商家处理",index:-1},{text:"待系统退款",index:-1},{text:"已完成",index:-1}];
		let bottomList = [{text:"售后明细",index:12},{text:"",i_cls:0,index:1}];//底部栏
		let e_items = data.map((item,key)=>{
			let {order_state,shop_id,delivery_type_name,order_sn,shop_name,store_name,refund_id,refund_type,
				refund_amount,goods_list,seller_state,shipping_fee,admin_time,seller_time,return_type,receive_time} = item;
			order_state = parseInt(order_state/10);
			let topBtnStatus = topStateList[order_state];
			let s_shopType = shop_id>0?"门店":"商家";
			let s_nameType = shop_id>0?shop_name:store_name;
			let s_shipping_fee = shipping_fee>0?`含运费￥${parseFloat(shipping_fee).toFixed(2)}）`:"";
			if (refund_type == 1) {
				if (parseInt(seller_time) == 0) {
					topBtnStatus = topStateList[0];
				} else {
					if (parseInt(seller_state) == 2) {
						if (parseInt(admin_time) === 0) {
							topBtnStatus = topStateList[2];
						} else {
							topBtnStatus = topStateList[3];
						}
					} else {
						topBtnStatus = topStateList[3];
					}
				}
			} else {
				if (parseInt(seller_time) === 0) {
					topBtnStatus = topStateList[0];
				} else {
					if (parseInt(seller_state) === 2) {
						if (parseInt(return_type) === 1) {
							topBtnStatus = topStateList[2];
							if (parseInt(admin_time) === 0) {
								topBtnStatus = topStateList[2];
							} else {
								topBtnStatus = topStateList[3];
							}
						} else {
							if (parseInt(receive_time) === 0) {
								topBtnStatus = topStateList[1];
							} else {
								if (parseInt(admin_time) === 0) {
									topBtnStatus = topStateList[2];
								} else {
									topBtnStatus = topStateList[3];
								}
							}
						}
					} else {
						topBtnStatus = topStateList[3];
					}
				}
			}
            let e_navbtn = <OrderBtnGroup f_onClick={()=>this.bottom_onClick(refund_id)} a_datas={bottomList} b_isShowNav={true}/>;
			return  <section key={key} className="order_list_wrap base-mB10">
                        <div className="store_num">
                            <MediaItem s_img={require('order_detail_iconImg')} s_label={"订单号:"+order_sn} s_right={topBtnStatus.text} b_line={true}  />
                        </div>
                        <div className="store_info">
                            <MediaItem s_label={s_shopType+":"+s_nameType} s_right={"配送方式:"+delivery_type_name} b_line={true}  />
                        </div>
                        <GoodsGroup a_goodsList={goods_list} f_callBack={this.goods_onClick}/>
                        <div className="store_price">
                        	<MediaItem s_right={`合计：￥${parseFloat(refund_amount).toFixed(2)} ${s_shipping_fee}`} b_line={true}  />
                        </div>
                        {e_navbtn}
                    </section>;
		});
		return(
			<div>
		        {e_items}
	        </div>
		);
	}
}

class OrderListAfter extends React.Component{
	constructor(){
		super();
	}
	f_itemClick(index,data){
	    this.props.f_bottomCallBack(index,data);
	}
	render(){
		let e_items = null;
		let data = this.props.data;
		if (data && data.length>0) {
			e_items = <OrderListItem data={data} f_item_bottomCallBack={(index,data)=>this.f_itemClick(index,data)}></OrderListItem>;
		}
		return(
			<div className="orderListAfter">
		        {e_items}
	        </div>
		);
	}
}
module.exports = OrderListAfter;
