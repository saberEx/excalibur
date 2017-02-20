//订单
'use strict';
require('orderListGroupCss');
let MediaItem = require('mediaItem');
let GoodsGroup = require('goodsGroup');
let OrderBtnGroup = require('orderBtnGroup');

class OrderListItem extends React.Component{
	static propTypes = {
		f_item_bottomCallBack: React.PropTypes.func,//底部按钮点击回调
	    a_itemDatas : React.PropTypes.array,//数据源
	}
	bottom_onClick(index,data){//底部按钮块
		this.props.f_item_bottomCallBack(index,data);
	}
	goods_onClick(orderId){//商品点击回调 需要区分门店订单或商家订单
		Com.openWin('my_order_detail',{orderId:orderId});
	}
	render(){
		// let topStateList = [{text:"已取消",cls:"btn-noline",index:-1},{text:"待支付",cls:"btn-noline",index:-1},{text:"待发货",cls:"btn-noline",index:-1},{text:"已发货",cls:"btn-noline",index:-1},{text:"已完成",cls:"btn-noline",index:-1},{text:"订单状态",cls:"btn-noline",index:-1},{text:"待自提",cls:"btn-noline",index:-1}];
		let _self = this;
		let bottomList = [];//底部栏
        let noPay = [{text:"取消订单",i_cls:1,index:1},{text:"付款",i_cls:2,index:2}];
        let cancle = [{text:"取消并退款",i_cls:1,index:3},{text:"",i_cls:0,index:-1}]
        let okGoods = [{text:"查看物流",i_cls:1,index:4},{text:"确认收货",i_cls:2,index:5}];
        let okGoods1 = [{text:"",i_cls:0,index:0},{text:"确认收货",i_cls:2,index:5}];//自提订单
        let evaluate = [{text:"",i_cls:0,index:0},{text:"评价订单",i_cls:2,index:6}];
        let evaluate1 = [{text:"",i_cls:0,index:0},{text:"评价回复",i_cls:2,index:7}];
        let finish = [{text:"",i_cls:0,index:0},{text:"",i_cls:0,index:0}];
		let e_items = this.props.a_itemDatas.map((item,key)=>{
			let order_state = parseInt(item.order_state)/10;
			// let topBtnStatus = topStateList[order_state];
			let topBtnStatus = item.state_desc;//新增订单状态字段
			let s_shopType = item.shop_id>0?"门店":"商家";
			let s_nameType = item.shop_id>0?item.shop_name:item.store_name;
			let geval_explain = item.extend_evaluate.length != 0?true :false;
			let delivery_type_name = item.delivery_type_name;//物流方式名称
			let extend_order_common = item.extend_order_common || {};
			let evaluation_state = item.evaluation_state;//评价状态
			let lock_state = item.lock_state;//大于0是锁定状态
			let refund_state = item.return_refund_state || -1;//申请状态:1为处理中,2为待管理员审核,3为同意,4不同意 默认为1
			let expressCost = parseFloat(item.shipping_fee);
        	let expressCostStr = "（含运费￥"+expressCost+"）";
        	if(expressCost == 0){
        		expressCostStr = "（免运费）";
        	};
        	// if(order_state == 2 && delivery_type_name=="自提"){
	        //     topStateList[2].text = "待备货";
	        // };
	        // if(extend_order_common.delivery_type == 2 && extend_order_common.delivery_state==1){
	        //     topStateList[order_state] = {text:"待自提",cls:"btn-noline",index:-1};
	        // };
	        switch(parseInt(refund_state)) {
	        	case 1:
	        		// topStateList[2].text = "处理中";
	        		topBtnStatus = "处理中";
	        		break;
	        	case 2:
	        		// topStateList[2].text = "待审核";
	        		topBtnStatus = "待审核";
	        		break;
	        	case 3:
	        		// topStateList[2].text = "申请通过";
	        		topBtnStatus = "申请通过";
	        		break;
	        	case 4:
	        		// topStateList[2].text = "申请不通过";
	        		break;
	        }
			let totalPrice = item.order_amount;
			if (order_state === 0) {//已取消
                bottomList = [];
            }else if(order_state === 1){//未付款
                bottomList = noPay;
            }else if(order_state === 2){//已付款
                bottomList = cancle;
            }else if(order_state === 3){//已发货
            	if(extend_order_common.delivery_type == 2 && extend_order_common.delivery_state==1){
		            bottomList = okGoods1;
		        }else{
		        	bottomList = okGoods;
		        }
            }else if(order_state === 4){//已收货
                if (parseInt(evaluation_state) === 0) {//未评价
                   bottomList = evaluate;
                }else if(geval_explain){
                   bottomList = evaluate1;
                }else{
                   bottomList = finish;
                }
            }
            if (parseInt(lock_state) > 0) {
            	bottomList = finish;
            }
            let navbtn = null;
            if (bottomList.length != 0) {
               navbtn = <OrderBtnGroup f_onClick={(index)=>this.bottom_onClick(index,item)} a_datas={bottomList} b_isShowNav={true}/>
            }
			return  <section key={key} className="order_list_wrap base-mB10">
                        <div className="store_num">
                            <MediaItem s_img={require('order_detail_iconImg')} s_label={"订单号:"+item.order_sn} s_right={topBtnStatus} b_line={true}  />
                        </div>
                        <div className="store_info">
                            <MediaItem s_label={s_shopType+":"+s_nameType} s_right={"配送方式:"+delivery_type_name} b_line={true}  />
                        </div>
                        <GoodsGroup a_goodsList={item.goods_list} f_callBack={this.goods_onClick}/>
                        <div className="store_price">
                        	<MediaItem s_right={"合计：￥"+totalPrice+expressCostStr} b_line={true}  />
                        </div>
                        {navbtn}
                    </section>;
		});
		return(
			<div>
		        {e_items}
	        </div>
		);
	}
}

class OrderListGroup extends React.Component{
	constructor(){
		super();
	}
	static propTypes = {
		f_bottomCallBack: React.PropTypes.func,//底部点击回调
	    a_datas : React.PropTypes.array,//数据源
	}
	f_itemClick(index,data){
	    this.props.f_bottomCallBack(index,data);
	}
	render(){
		let _self = this;
		let e_items = null;
		if (this.props.a_datas) {
			e_items = this.props.a_datas.map((item,key)=>{
				return  <OrderListItem key={key} a_itemDatas={item.order_list} f_item_bottomCallBack={(index,data)=>this.f_itemClick(index,data)}></OrderListItem>;
			});
		}
		return(
			<div>
		        {e_items}
	        </div>
		);
	}
}
module.exports = OrderListGroup;
