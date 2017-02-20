'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("积分订单详情");
    require("apps_integration_orderDetailCss");
    let LabelInput = require('labelInput');
    let GoodsGroup = require('goodsGroup');
    let order_id = Com.getPageParams("order_id");
    let AddRess = require('address');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {o_cardInfo:props.data.cardInfo || null};
        }
        f_openShopMap(){
            let {shop_map_x,shop_map_y,shop_name,shop_address} = this.props.data.shopInfo;
            if(shop_map_x && shop_map_y){
                 Com.openMap(shop_map_x,shop_map_y,shop_name,shop_address);
            }
        }
        f_receive(){
            let {point_ordersn} = this.props.data;
            let {wechat_card_id,store_id} = this.state.o_cardInfo || {};
            if(!wechat_card_id){
                return;
            }
            let _self = this;
            Com.getNormal({act:"card_view",op:'get_card_api',mod:'wap',b_box:1,point_ordersn:point_ordersn,wechat_card_id:wechat_card_id,store_id:store_id},(res)=>{
                if(parseInt(res.code) === 0){
                    if (res.data) {
                        let {card_id,timestamp,nonce_str,cardSign,outer_str} = res.data;
                        wx.addCard({
                            cardList: [{
                                cardId: card_id,
                                cardExt: JSON.stringify({timestamp:timestamp,nonce_str:nonce_str,signature:cardSign,outer_str:"pOrderSn_"+point_ordersn})
                            }], // 需要添加的卡券列表
                            success: function (res) {
                                _self.setState({o_cardInfo:null,i_orderState:40});
                            }
                        });
                    }else{
                        Com.toast("请求数据失败，请重试尝试");
                    }
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {addressInfo,point_order_type,point_ordersn,delivery_type,point_orderstate,point_addtime,point_goodsname,point_allpoint,point_goodsnum,
                point_goodsimage,self_delivery_qrcode,shopInfo,take_goods_code,store_phone} = this.props.data;
            let  {o_cardInfo,i_orderState} = this.state;
            delivery_type = parseInt(delivery_type);
            let s_orderStatus = "";
            let o_address = {};
            let e_way = null;
            if(point_order_type === "gift"){
                switch (delivery_type) {
                    case 1: //物流
                    if(addressInfo){
                        let {point_mobphone,point_truename,point_areainfo,point_address} = addressInfo;
                            o_address = {true_name:point_truename,mob_phone:point_mobphone,area_info:point_areainfo,address:point_address};
                        }
                        if(point_orderstate == 20){
                            s_orderStatus = "待商家发货";
                        }else if(point_orderstate == 30){
                            s_orderStatus = "商家已发货";
                        }else if(point_orderstate == 40){
                            s_orderStatus = "已完成";
                        }
                        e_way = <div className="base-mT10">
                                    <LabelInput s_left="提货方式" b_right={true} s_right="物流配送" b_line={true} />
                                    <AddRess data={o_address} b_address={true} b_right={false}/>
                                </div>;
                        break;
                    case 2: //自提
                        let {shop_name,shop_address,shop_fixed_phone,shop_mobile_phone} = shopInfo;
                        store_phone = shop_mobile_phone?shop_mobile_phone: shop_fixed_phone;
                        if(point_orderstate == 20){
                            s_orderStatus = "待提货";
                        }else if(point_orderstate == 30){
                            s_orderStatus = "已发货";
                        }else if(point_orderstate == 40){
                            s_orderStatus = "已提货";
                        }
                        e_way =  <div>
                                    <div className="base-mT10">
                                        <div className="input_wrap_number"> <LabelInput s_left="提货码：" b_right={true} s_right={take_goods_code} b_line={true}/></div>
                                        <LabelInput s_left="提货门店：" b_right={true} s_right={shop_name} b_line={true}/>
                                        <LabelInput s_left="查看位置" s_right={shop_address} b_after={true} s_leftImg={require('address_iconImg')} onClick={()=>this.f_openShopMap()} b_right={true} b_leftImg={true}  b_line={true}  />
                                        <div className="tips">
                                            <span>提货说明：</span>
                                            下单成功后，您将收到礼品兑换码，到店请出示给店员确认。为确保您顺利提货，您可提前咨询门店，以免货品不足给您造成麻烦。
                                        </div>
                                    </div>
                                    <div className="qr_code base-mT10">
                                        <img src={self_delivery_qrcode} />
                                        <p>门店扫码提货</p>
                                    </div>
                                </div>;
                        break;
                    default: //虚物
                        if(point_orderstate == 20){
                            s_orderStatus = "待商家发货";
                        }else if(point_orderstate == 30){
                            s_orderStatus = "商家已发货";
                        }else if(point_orderstate == 40){
                            s_orderStatus = "已完成";
                        }
                        e_way = <div className="base-mT10">
                                    <LabelInput s_left="预留手机：" b_right={true} s_right={addressInfo.point_rsphone} b_line={true} />
                                </div>;
                        break;
                }
            }else if(point_order_type === "coupon"){ //优惠券
                point_orderstate  = i_orderState?i_orderState:point_orderstate;
                if(point_orderstate == 20){
                    s_orderStatus = "待商家发货";
                }else if(point_orderstate == 30){
                    s_orderStatus = "已发货";
                }else if(point_orderstate == 40){
                    s_orderStatus = "已完成";
                }
                e_way = <div className="links  base-mT10">
                            <span className="base-fl">领取链接：</span>
                            <span className={`base-fr btn_start ${o_cardInfo?"":"disabled"}`} onClick={()=>this.f_receive()}>{o_cardInfo?"马上领取":"已领取"}</span>
                        </div>;
            }
            return (
                <div className="apps_integration_orderDetail">
                    <div className="input_wrap"> 
                        <p>
                            <span className="base-fl">
                                订单号：{point_ordersn}
                            </span>
                            <span className="base-fr">{s_orderStatus}</span>
                        </p>
                        <p className="titmes">
                             订单日期：{Com.getTimeFormat(point_addtime,2)}
                        </p>
                    </div> 
                    <div className="goodsWrap">
                        <img className="goods_img" src={point_goodsimage}/>
                        <div className="goods_info">
                            <div className="good_tit base-ellipsis2">{point_goodsname}</div>
                            <div className="s_time">所需积分：<span className="points">{point_allpoint}</span></div>
                            <p className="">x{point_goodsnum}</p>
                        </div>
                    </div>
                    {e_way}
                    <a href={`tel:${store_phone}`} >
                        <button className="callBtn">拨打电话</button>
                    </a>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:"activity_pointshop",op:"point_order_show","point_orderid":order_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});