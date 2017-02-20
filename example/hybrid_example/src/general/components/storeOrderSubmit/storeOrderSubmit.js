/*
 * @Author: 卢旺
 * @Date:   2016-12-09 11:40:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2016-12-29 09:39:26
 * 商家提交订单
 */
'use strict';
require('storeOrderSubmitCss');
let LabelInput = require('labelInput');
let MediaItem = require('mediaItem');
let GoodsGroup = require('goodsGroup');
let Address = require('address');
let PayPop = require('payPop');
require('payment');
let _self = null;
let offpay_hash_batch = null;
let notSupport = 1;	//是否支持配送

class StoreOrderSubmit extends React.Component{
	static propsTypes = {
		address_info:React.PropTypes.Object,//地址信息
		goods_total:React.PropTypes.string,//价格
		card_item:React.PropTypes.Object,//优惠券
		goods_list:React.PropTypes.array,//商品列表
		store_name:React.PropTypes.string,//商家名称
		vat_hash:React.PropTypes.string,//物流hash
		freight_hash:React.PropTypes.string,//运费hash
		ifcart:React.PropTypes.string,//是否是购物车过来的商品，0=false
		cartIds:React.PropTypes.string,
	}
	componentWillReceiveProps(nextProps){//属性改变
	    if(this.props.card_item !== nextProps.card_item){
	        this.setState({card_item:nextProps.card_item});
	    }
	}
	constructor(props){
        super(props);
        _self = this;
        this.state = {
            address_info:this.props.address_info,
            freight:this.props.freight,
            totalPrice:this.props.goods_total || 0,
            card_item:this.props.card_item || "",
            card_list:[],
            b_hasRequestCard:false,
            b_showMask:false
        };
    }
    addressOnClick(){
        Com.openWin('address_select');
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
        let address_id = this.state.address_info.address_id;
        if(!address_id){
            return Com.toast("请设置收货地址");
        }
        if(notSupport == 1){
			return Com.toast('该地区暂不支持配送');
		}

        let {vat_hash,ifcart,cartIds} = this.props;
        let card_item = this.state.card_item;//优惠券
        let pay_message = this.refs.message ? this.refs.message.getValue():"";//留言
        let discount = "";//优惠金额
        let card_code = "";//优惠卡号
        let card_id = "";//优惠卡id
        if (card_item) {
            discount = card_item.discount;
            card_code = card_item.card_code;
            card_id = card_item.card_id;
        }
        let {totalPrice,b_hasRequestCard,b_showMask} = this.state;
        if(!b_hasRequestCard){
            //会员列表
            Com.postVerify({act:'wx_card_member',op:'get_member_card_list'},(res)=>{
                if(parseInt(res.code) === 0){
                    if (res.data) {
                        let card_list = res.data.card_list || [];
                        _self.setState({card_list:card_list,b_hasRequestCard:true,b_showMask:true});
                    }
                }else {
                    Com.toast(res.msg);
                }
            });
        }else {
            if(!b_showMask){
                this.setState({b_showMask:true});
                return;
            }
            Com.postNormal({act:"member_buy",op:"buy_step2",ifcart:ifcart,cart_id:cartIds,address_id:address_id,
                vat_hash:vat_hash,offpay_hash:"",offpay_hash_batch:"",pay_name:"online",invoice_id:0,voucher:0,pd_pay:1,
                password:0,rcb_pay:0,goods_fcode:0,member_email:"",order_from:2,pay_message:pay_message,
                card_code:card_code,card_id:card_id},function(res){
                if (parseInt(res.code) === 0 && res.data.pay_sn) {
                    if(cardCode){
                        Com.postVerify({act:'member_pay',op:'membercard_pay',card_code:cardCode,pay_sn:res.data.pay_sn},(ret)=>{
                            if(parseInt(ret.code) === 0){
                                Com.openWin("pay_success",{totalPrice:totalPrice});
                            }else {
                                Com.toast(ret.msg);
                            }
                        },true);
                    }else {
                        payment.payTypeRequest(res.data.pay_sn,1);//微信支付
                    }
                }else{
                    Com.toast(res.msg);
                }
                _self.setState({b_showMask:false});
            },false,true);
        }
    }
    saleOnClick(){//所有优惠券
        if (this.state.card_item) {
            Com.openWin("my_vouche_list",{submit:1});
        }
    }
    itemClick(){
        this.setState({b_showMask:false});
    }
    componentDidMount(){
        let _self = this;
        let {goods_total} = this.props;
        let {address_info} = this.state;
        getFreight(address_info);
        Com.addEvt('address_select',(data)=>{
            if(data){
                _self.setState({address_info:data.data},()=>{
                    if(data && data.data.hasOwnProperty('address_id')){
                        _self.refs.name && _self.refs.name.setValue(data.data.true_name);
                        _self.refs.phone && _self.refs.phone.setValue(data.data.mob_phone);
                    }
                });
                getFreight(data.data);
                Com.setLocalData('address_select',null);
            }
        });

    }
    render(){
        let {goods_list,goods_total,store_name,vat_hash} = this.props;
        let {freight,totalPrice,card_item,card_list,b_showMask} = this.state;
        let {address_info} = this.state;
        let discount = "";//优惠金额
        let card_alias_name = "";//优惠信息
        if (card_item) {
            discount = card_item.discount/100;
            card_alias_name = card_item.card_alias_name;
        }
        let address_name= address_info.hasOwnProperty('address_id') ? address_info.true_name+" "+address_info.mob_phone :"请设置收货地址";
        let area_info = address_info.hasOwnProperty('address_id')  ? address_info.area_info : null;
        let address = address_info.hasOwnProperty('address_id')  ? address_info.address : null;
        let b_address = address_info ? true : false;
        let freight_type = address_info ? "包邮" : 0;
        let a_data ={"true_name":address_name,"area_info":area_info,"address":address};
        return (
            <div className="store_order_submit" onClick={this.handlerClick}>
                <div className="store_delivery base-mB10">
                    <div className="store_del_info base-mB10">
        				<Address data={a_data} b_address={b_address} callback={()=>this.addressOnClick()}></Address>
                     </div>
                </div>
                <div className="base-mB10 shopC_submit_detail">
                    <MediaItem s_img={require('storeIconImg')} onClick={()=>this.itemClick()} s_label={store_name || "暂无"} b_line={true} />
                    <GoodsGroup a_goodsList={goods_list} />
                    <MediaItem s_img={require('favorable_iconImg')} onClick={()=>this.saleOnClick()} s_label={card_alias_name || "暂无优惠券"} s_right={discount?"￥"+Com.getNumFormat(discount):""} b_after={true} b_line={true} />
                    <LabelInput s_left={"运费"} s_right={freight>0?"￥"+Com.getNumFormat(freight):freight_type} b_right={true} b_line={true}/>
                    <div className="order_part  base-after-line">
                        <section className="detail-type ">
                            <span>售后保障</span>
                            <p className="ml">{"该商品由"+store_name+"负责配送和售后服务"}</p>
                        </section>
                    </div>
                    <LabelInput s_left={"给卖家留言"} b_isInput={true} ref="message" s_right="选填，对本次交易有效"  b_right={true} />
                </div>
                <div className="shopC_submit">
                    <div className="shopC_rel">
                        <span>总金额：<em>￥{Com.getNumFormat(totalPrice)}</em></span>{/*共<em>1</em>件*/}
                        <div className="shopC_buy" onClick={(e)=>this.btnClick(null,null,e)}>提交订单</div>
                    </div>
                </div>
                <PayPop a_data={card_list} totalPrice={parseFloat(totalPrice)} b_showMask={b_showMask} f_wx_callBack={()=>this.btnClick()} f_card_callBack={(card_code,s_disable)=>this.btnClick(card_code,s_disable)} />
            </div>
         );
    }
}

//请求运费
function getFreight(address_info){
    if(!_self.props.freight_hash || !address_info || !address_info.hasOwnProperty("address_id")){
        return;
    }
    Com.getNormal({act:"member_buy",op:"change_address",freight_hash:_self.props.freight_hash,city_id:address_info.city_id,area_id:address_info.area_id},function(res){
        if (res.code === 0) {
            let content = res.data.content;
            let freight = 0;//运费
            let _goods_total = _self.props.goods_total;
            offpay_hash_batch = res.data.offpay_hash_batch;
            notSupport = res.data.notsupport;
            for (var key in content) {
                freight = content[key];
            }
            if (_self.state.card_item) {//计算优惠
                _goods_total = parseFloat(_goods_total) - parseFloat(_self.state.card_item.discount/100);
            }
            let price = parseFloat(_goods_total)+parseFloat(freight);
            price = price.toFixed(2);
            _self.setState({freight:freight,totalPrice:price});
        }else{
            Com.toast(res.msg);
        }
    },true);
}

module.exports = StoreOrderSubmit;
