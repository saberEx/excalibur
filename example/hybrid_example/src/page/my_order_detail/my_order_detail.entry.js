/*
* @Author: 卢旺
* @Date:   2016-08-18 09:28:01
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-17 14:11:48
* 订单详情
*/
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("订单详情");
    require("my_order_detailCss");
    let MediaItem =require("mediaItem");
    let GoodsGroup =require("goodsGroup");
    let AddRess =require("address");
    let LabelInput =require("labelInput");
    let ShopsOnline_info=require("shopsOnline_info");
    let NavBtnGroup = require('navBtnGroup');
    let OrderTop = require('orderTop');
    let Scroll = require('scroll');
    let PayPop = require('payPop');
    require('payment');

    let orderId = Com.getPageParams('orderId');
    let posX = Com.getLocalData('locationPos','lat') || "";
    let posY = Com.getLocalData('locationPos','lon') || "";
    let _self = null;
    let _h = "100%";

    let bottomList = [];//底部栏
    let noPay = [{text:"取消订单",i_cls:1,index:1},{text:"付款",i_cls:1,index:2}];
    let cancle = [{text:"取消并退款",i_cls:1,index:3},{text:"",i_cls:0,index:-1}]
    let okGoods = [{text:"申请售后",i_cls:1,index:4},{text:"确认收货",i_cls:1,index:5}];
    let evaluate = [{text:"申请售后",i_cls:1,index:4},{text:"评价订单",i_cls:1,index:6}];
    let evaluate1 = [{text:"申请售后",i_cls:1,index:4},{text:"评价回复",i_cls:1,index:7}];
    let finish = [{text:"申请售后",i_cls:1,index:4},{text:"",i_cls:0,index:6}];
    let refundItem = [{text:"查看进度",i_cls:1,index:8},{text:"",i_cls:0,index:-1}]
    let okGoods1 = [{text:"",i_cls:0,index:4},{text:"确认收货",i_cls:1,index:5}];
    let evaluate2 = [{text:"",i_cls:0,index:4},{text:"评价订单",i_cls:1,index:6}];
    let evaluate3 = [{text:"",i_cls:0,index:4},{text:"评价回复",i_cls:1,index:7}];
    let finish1 = [{text:"",i_cls:0,index:4},{text:"",i_cls:0,index:6}];

    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            _self = this;
            this.state = {
                card_list:[],
                b_showMask:false,
            };
        }
        openMap(){
            if (this.props.shop_info) {
                let lat = this.props.shop_info.shop_map_x || 0;
                let lon = this.props.shop_info.shop_map_y || 0;
                let address = this.props.shop_info.shop_address;
                Com.openMap(lat,lon,this.props.shop_info.shop_name,address);
            }else{
                Com.toast("暂无数据");
            }
        }
        bottom_onClick(index){
            let {orderState,shop_id,refund,after_service,extend_order_common} = this.props;
            switch(index){
                case 1://取消订单
                    Com.confirm("您确定要取消该订单吗？",()=>{
                        Com.getNormal({act:'member_order',op:'order_cancel',order_id:orderId},function(res){
                            if(parseInt(res.code) === 0){
                                Com.reload();//刷新页面
                            }else{
                                Com.toast(ret.msg);
                            }
                        })
                    });
                    break;
                  case 2://付款
                    if (this.props.pay_sn != 0) {
                        let {totalPrice} = this.props;
                        let paySn = this.props.pay_sn;
                        Com.postVerify({act:'wx_card_member',op:'get_member_card_list',shop_id:shop_id},(res)=>{
                            if(parseInt(res.code) === 0){
                                let card_list = res.data.card_list || [];
                                _self.setState({card_list:card_list,b_showMask:true,totalPrice:totalPrice});
                            }else {
                                Com.toast(res.msg);
                            }
                        });
                    }else{
                        Com.toast("支付失败");
                    }
                    break;
                case 3://取消并退款
                    // if (extend_order_common.delivery_state == "0") {//未发货订单直接取消退款
                    //     Com.postVerify({act:'member_order',op:'order_refund_all_commit',order_id:orderId,buyer_message:"未发货订单取消退款"},(res)=>{
                    //         if(parseInt(res.code)===0){
                    //             Com.reload();
                    //         }else{
                    //             Com.toast(res.msg);
                    //         }
                    //     });
                    // }else{
                        Com.openWin("order_refund",{order_id:orderId});
                    // }
                    break;
                case 4://申请售后
                    if (after_service) {
                        Com.openWin('order_refundGoods',{order_id:orderId,orderState:orderState});
                    }else{
                        Com.toast("已经申请过售后，不能重复申请");
                    }
                    break;
                case 5://确认收货
                    Com.confirm("是否确认收货？",()=>{
                        Com.getNormal({act:'member_order',op:'order_receive',order_id:orderId},function(ret){
                            if(parseInt(ret.code) === 0){
                                Com.reload();
                            }else{
                                Com.toast(ret.msg);
                            }
                        });
                    });
                    break;
                case 6://评价订单
                    let {goods_list} = this.props;
                    let a_evaluationData = [];
                    for(let i in goods_list){
                        let {goods_id,goods_image} = goods_list[i];
                        a_evaluationData.push([goods_id,Com.getGoodsImg(goods_image)]);
                    }
                    Com.openWin("order_evaluate",{order_id:orderId,evaluation:JSON.stringify(a_evaluationData)});
                    break;
                case 7://评价回复
                    Com.openWin("order_assess",{order_id:orderId});
                    break;
                case 8://查看售后进度
                    Com.openWin("order_refundDetails",{refund_id:refund.refund_id});
                    break;
                default:
                    break;
            }
        }
        handlerClick(e){
            _self.setState({b_showMask:false});
        }
        btnClick(cardCode,s_disable,e){
            if (e) {
                e.stopPropagation();
            }
            if(s_disable){
                return this.setState({b_showMask:false});
            }
            if(!this.props.pay_sn){
                return Com.toast("支付失败");
            }
            let {totalPrice,pay_sn} = this.props;
            if(cardCode){
                Com.postVerify({act:'member_pay',op:'membercard_pay',card_code:cardCode,pay_sn:this.props.pay_sn},(ret)=>{
                    if(parseInt(ret.code) === 0){
                        Com.openWin("pay_success",{totalPrice:totalPrice});
                    }else {
                        Com.toast(ret.msg);
                    }
                });
            }else {
                // let type = (Com.getBrowserType() === Com.ENUM_BROWSER_WX) ? 1 : 2;
                payment.payTypeRequest(pay_sn,1);//微信支付
            }
        }
        render(){
            //物流方式，物流状态，自提二维码,订单信息,商品列表,店铺名称,门店信息,运费,支付方式名称，支付方式,评价状态,订单状态，商品数量，商品价格,订单取消时间,订单编号,订单创建日期,订单完成/付款日期,是否有评价,门店id,总价格,售后,优惠券,是否申请售后
            let {delivery_type_name,deliver_status,s_erCode,extend_order_common,goods_list,store_name,shop_info,shipping_fee,payment_name,payment_code,evaluation_state,orderState,goods_count,goods_amount,delay_time,order_sn,add_time,order_time,geval_explain,shop_id,totalPrice,refund,card_info,after_service} = this.props;
            let i_state,claim_time;//物流状态，店员配送/提货时间
            let card_alias_name,discount;//优惠券名称 优惠金额
            let adress = {"true_name":extend_order_common.reciver_name,"mob_phone":extend_order_common.reciver_phone,"area_info":"","address":extend_order_common.reciver_address}
            if (card_info) {
                card_alias_name = card_info.card_alias_name;
                discount = parseInt(card_info.card_info.card.cash.reduce_cost)/100;
            }
            if (extend_order_common.delivery_type =="2") {//自提
                claim_time = extend_order_common.shipping_time_claim;
                claim_time = claim_time !=0 ? claim_time : "";
                if (extend_order_common.delivery_state == "0") {//自提待备货
                    i_state = 3;
                }else if (extend_order_common.delivery_state == "1"){//自提待自提
                    i_state = 4;
                }else if (extend_order_common.delivery_state == "2"){//自提已签收
                    i_state = 2;
                }
            }else{//物流店员配送
                if (extend_order_common.delivery_state == "0") {//未发货
                    i_state = 0;
                }else if (extend_order_common.delivery_state == "1"){//发货中
                    i_state = 1;
                    claim_time = extend_order_common.shipping_time;
                }else if (extend_order_common.delivery_state == "2"){//已签收
                    i_state = 2;
                }
            }
            let orderItem = null;
            let cancleOrder = "order_wrap";
            let s_left = "付款时间：";
            if (orderState === 0) {//已取消
                _h = "100%";
                bottomList = [];
                cancleOrder = "order_wrap cancleMb";
            }else if(orderState === 10){//未付款
                bottomList = noPay;
            }else if(orderState === 20){//已付款
                bottomList = cancle;
            }else if(orderState === 30){//已发货
                if (after_service) {
                    bottomList = okGoods;
                }else{
                    bottomList = okGoods1;
                }
            }else if(orderState === 40){//已收货
                s_left = "完成时间：";
                if (evaluation_state === 0) {//未评价
                   if (after_service) {
                      bottomList = evaluate;
                   }else{
                      bottomList = evaluate2;
                   }
                }else if(geval_explain){//已有评价
                   if (after_service) {
                      bottomList = evaluate1;
                   }else{
                      bottomList = evaluate3;
                   }
                }else{
                   if (after_service) {
                      bottomList = finish;
                   }else{
                      bottomList = finish1;
                   }
                }
            }
            let refund_state = null;
            if (typeof refund.length != 'number') {
                bottomList = refundItem;
                if (parseInt(refund.seller_time)==0) {
                    refund_state= 0;//"待商家确认"
                }else{
                    if (parseInt(refund.seller_state)==2) {
                        if (parseInt(refund.refund_type)==1) {
                            if (parseInt(refund.admin_time)==0) {
                                refund_state = 1;//"待系统退款"
                            }else{
                               refund_state = 3;//"已完成";
                            }
                        }else{
                            if (parseInt(refund.return_type)==1) {
                                if (parseInt(refund.admin_time)==0) {
                                   refund_state = 1;//"待系统退款"
                                }else{
                                    refund_state = 3;//"已完成"
                                }
                            }else{
                                if (parseInt(refund.receive_time)==0) {
                                    refund_state = 2;//"待商家处理"
                                }else{
                                    if (parseInt(refund.admin_time)==0) {
                                        refund_state = 1;//"待系统退款"
                                    }else{
                                        refund_state = 3;//"已完成"
                                    }
                                }
                            }
                        }
                    }else{
                        refund_state = 3;//"已完成"
                    }
                    if (refund.admin_time && parseInt(refund.admin_time)!=0) {
                        refund_state = 3;//"已完成"
                    }
                }
            }
            if(orderState != 0 && orderState != 10){
               orderItem = <div>
                               <LabelInput s_left="订单编号：" s_right={order_sn} b_isInput={false} b_line={true} b_right={true}/>
                               <LabelInput s_left="创建日期：" s_right={Com.getTimeFormat(add_time,2)} b_isInput={false} b_line={true} b_right={true}/>
                               <LabelInput s_left={s_left} s_right={Com.getTimeFormat(order_time,2)} b_isInput={false} b_line={true} b_right={true}/>
                           </div>;
            }else if(orderState === 10){
                orderItem = <div>
                               <LabelInput s_left="订单编号：" s_right={order_sn} b_isInput={false} b_line={true} b_right={true}/>
                               <LabelInput s_left="创建日期：" s_right={Com.getTimeFormat(add_time,2)} b_isInput={false} b_line={true} b_right={true}/>
                           </div>;
            }

            let navbtn = null;
            if (bottomList.length != 0) {
               navbtn = <NavBtnGroup f_onClick={(index)=>this.bottom_onClick(index)} a_datas={bottomList}/>
            }
            let shopItem = null;
            let shop_phone = null;
            if (shop_id > 0 ) {
                let shopName,shopAddr,distance;
                if (shop_info) {
                    shopName = shop_info.shop_name;
                    shop_phone = shop_info.shop_phone;
                    shopAddr = shop_info.shop_address ? shop_info.shop_address : "暂无";
                    if(shop_info.distance){
                        if (shop_info.distance > 1000) {
                            distance = shop_info.distance/1000 +"公里";
                        }else{
                            distance = shop_info.distance +"米";
                        }
                    }else {
                        distance = "无法定位您当前位置";
                    }
                }
                shopItem = <div>
                             <LabelInput s_left="当前门店" s_right={shopName} b_isInput={false} b_line={true} b_right={true}/>
                             <LabelInput s_left={distance} onClick={()=>this.openMap()} s_right={shopAddr} s_leftImg={require('address_iconImg')} b_isInput={false} b_line={true} b_after={true} b_right={true} b_leftImg={true}/>
                           </div>
            }
            let {b_showMask,card_list} = this.state;
            return (
                <div className="refactor_order_detail" onClick={this.handlerClick}>
                    <Scroll style={{height:_h}}>
                        <div>
                            <OrderTop refund_state={refund_state} s_validity={Com.getTimeFormat(delay_time,2)} reciver_tel={extend_order_common.reciver_phone} reciver_name={extend_order_common.reciver_name} s_erCode={s_erCode} pickup_code={extend_order_common.dlyo_pickup_code} s_time={claim_time} person_phone={extend_order_common.person_phone} person_name={extend_order_common.person_name} o_data={adress} i_order_status={orderState} delivery_type={extend_order_common.delivery_type} i_status={i_state} delivery_name={delivery_type_name} ></OrderTop>
                            <div className={cancleOrder}>
                                <MediaItem s_img={require("storeIconImg")} s_label={store_name}/>
                                <GoodsGroup  a_goodsList={goods_list} />
                                {shopItem}
                                <MediaItem s_img={require('favorable_iconImg')} s_label={card_alias_name || "暂无优惠券"} s_right={discount>0 ?"-"+discount : ""}b_after={false} b_line={true} />
                                <LabelInput s_left="支付方式" s_right={payment_name} b_isInput={false} b_line={true} b_right={true}/>
                                <div className="total_wrap">
                                    <span>共{goods_count}件，合计：</span><span className="total_number">￥{Com.getNumFormat(totalPrice)}</span>
                                </div>
                            </div>
                            <div className="order_wrap">
                                {orderItem}
                                <ShopsOnline_info phone={shop_phone}/>
                            </div>
                            <div className="blankDiv"></div>
                        </div>
                    </Scroll>
                    <PayPop a_data={card_list} totalPrice={totalPrice} b_showMask={b_showMask} f_wx_callBack={()=>this.btnClick()} f_card_callBack={(card_code,s_disable)=>this.btnClick(card_code,s_disable)} />
                    {navbtn}
                </div>

             );
        }
    };
    //请求数据
   Com.getNormal({act:"member_order",op:"order_info",order_id:orderId,pos_x:posX,pos_y:posY},function(res){
        if(parseInt(res.code) === 0){
            let data = res.data;
            if (data) {
                let deliver_status = data.deliver_info;//物流状态
                let delivery_type_name = data.delivery_type_name;//物流方式
                let extend_order_common = data.extend_order_common;//订单信息
                let geval_explain = data.evaluate_goods.length !==0 ? true:false;//是否有评价
                let order_sn = data.order_sn;//订单编号
                let pay_sn = data.pay_sn;//支付码
                let add_time = data.add_time;//订单创建日期
                let payment_time = data.payment_time;//订单付款时间
                let finnshed_time = data.finnshed_time;//订单完成日期
                let order_time = parseInt(finnshed_time) === 0 ? payment_time : finnshed_time;
                let extend_order_goods = data.extend_order_goods;//商品信息
                let goods_count = data.goods_count;//商品数量
                let goods_amount = data.goods_amount;//商品价格
                let shipping_fee = data.shipping_fee;//运费
                let totalPrice = parseFloat(goods_amount)+parseFloat(shipping_fee);
                let store_name = data.store_name;//商铺名称
                let shop_info = data.shop_info;//门店信息
                let payment_name = data.payment_name;//支付方式名称
                let payment_code = data.payment_code;//支付方式
                let s_erCode = data.self_delivery_qrcode ? data.self_delivery_qrcode : "";
                let evaluation_state = parseInt(data.evaluation_state);//评价状态
                let orderState = parseInt(data.order_state);//订单状态
                let shop_id = parseInt(data.shop_id);
                let refund = data.refund;//有数据则为售后订单
                let after_service = data.after_service;//是否申请过售后
                let delay_time = parseInt(data.order_confirm_day) || parseInt(data.order_cancel_day);//订单取消时间
                let card_info = data.card_info;//使用过优惠券才有此字段
                ReactDOM.render(<PageEl card_info={card_info} after_service={after_service} refund={refund} totalPrice={totalPrice} shop_id={shop_id} pay_sn={pay_sn} geval_explain={geval_explain} add_time={add_time} order_time={order_time} order_sn={order_sn} delay_time={delay_time} goods_count={goods_count} goods_amount={goods_amount} orderState={orderState} delivery_type_name={delivery_type_name} deliver_status={deliver_status} s_erCode={s_erCode} extend_order_common={extend_order_common} goods_list={extend_order_goods} store_name={store_name} shop_info={shop_info} shipping_fee={shipping_fee} payment_name={payment_name} payment_code={payment_code} evaluation_state={evaluation_state}/>,document.getElementById('pageCon'));
            }
        }else{
            Com.toast(res.msg);
        }
    });
});
