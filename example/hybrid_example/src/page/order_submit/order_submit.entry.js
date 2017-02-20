'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("订单提交");
    require("order_submitCss");
    let Scroll = require('scroll');

    let shop_id = Com.getPageParams('shop_id') || 0;
    let cartIds = Com.getPageParams('cartIds');
    let ifcart = Com.getPageParams('ifcart');
    let ShopOrderSubmit = require("shopOrderSubmit");//门店提交订单
    let StoreOrderSubmit = require("storeOrderSubmit");//商家提交订单

    let _self = null;
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            _self = this;
            this.state = {
                card_item:"",
            };
        }
        render(){
            let {shop_info,goods_list,goods_total,shop_name,delivery,vat_hash,address_info,store_name,freight_hash} = this.props;
            let {card_item} = this.state;
            let item = null;
            if (parseInt(shop_id) >0 ) {
                item = <ShopOrderSubmit cartIds={cartIds} ifcart={ifcart} freight_hash={freight_hash} address_info={address_info} card_item={card_item} goods_list={goods_list} goods_total={goods_total} shop_name={shop_name} delivery={delivery} vat_hash={vat_hash} shop_info={shop_info}></ShopOrderSubmit>;
            }else{
                item = <StoreOrderSubmit cartIds={cartIds} ifcart={ifcart} freight_hash={freight_hash} address_info={address_info} card_item={card_item} goods_list={goods_list} goods_total={goods_total} store_name={store_name}  vat_hash={vat_hash}></StoreOrderSubmit>;
            }
            return(
                item
            );
        }
    };
    //请求数据  ifcart：是否是购物车过来的商品，0==false  ifcart  cartIds  dvvbetbk|1
    Com.getVerify({act:"member_buy",op:"buy_step1",ifcart:ifcart,cart_id:cartIds},function(res){
        if(res.code === 0){
            let address_info = res.data.address_info;//收货地址信息
            let store_cart_list = res.data.store_cart_list;//
            let shop_name = res.data.shop_name;//门店名称
            let goods_list = [];//商品列表
            let goods_total = "";//商品总价
            let delivery = res.data.delivery;//配送方式
            let freight_hash = res.data.freight_hash;//运费hash
            let vat_hash = res.data.vat_hash;//物流信息hash
            let card_info = res.data.card_info;//优惠券
            let store_name = null;//商家名称
            for(var key in store_cart_list){
                if(store_cart_list.hasOwnProperty(key)){
                    goods_total = store_cart_list[key].store_goods_total;
                    store_name = store_cart_list[key].store_name;
                    goods_list = goods_list.concat(store_cart_list[key].goods_list);
                }
            }
            ReactDOM.render(<PageEl store_name={store_name} freight_hash={freight_hash} card_info={card_info} shop_info={res.data.shop_info} goods_list={goods_list} goods_total={goods_total} address_info={address_info} shop_name={shop_name} delivery={delivery} vat_hash={vat_hash}/>,document.getElementById('pageCon'));
            if (card_info) {
                let card_array = JSON.parse(card_info);
                _self.setState({card_item:card_array[0]});
            }
            Com.addEvt("shopC_vouche_list",(data)=>{
                if (data) {
                    _self.setState({card_item:data});
                    Com.setLocalData('shopC_vouche_list',null);
                }
            });
        }else{
            Com.toast(res.msg);
        }
    });


});
