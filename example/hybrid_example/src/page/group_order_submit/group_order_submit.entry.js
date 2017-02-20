'use strict';
//拼团提交订单页面
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("提交订单");
    let LabelInput = require('labelInput');
    let SelectBtnGroup = require('selectBtnGroup');
    let GoodsGroup = require('goodsGroup');
    let MediaItem = require('mediaItem');
    let TimeLabel = require('timeLabel');
    let Address = require('address');
    let cartIds = Com.getPageParams('cartIds');
    let open_sn = Com.getPageParams('open_sn');
    let spell_id = Com.getPageParams('spell_id');
    let is_open_head = Com.getPageParams('is_open_head');
    let ifcart = Com.getPageParams('ifcart');
    require('payment');
    require("group_order_submitCss");
    let e_pageEl = null;
    let seller_info = null;//店员配送
    let _self = null;
    let b_isAddr = true;//地址是否正确
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            _self = this;
            this.state = {
                delivery_type:0,//0物流配送，1店员配送，2自提
                address_info:this.props.address_info,
                freight:0,
                totalPrice:this.props.goods_total ||0,
                card_item:"",
            };
        }
        clickHandler(index){
            this.setState({delivery_type:index});
            countFreight(index,this.props.goods_total,seller_info,this.state.address_info);
        }
        addressOnClick(){
            Com.openWin('address_select');
        }
        btnClick(){
            let address_id = this.state.address_info.address_id;
            let vat_hash = this.props.vat_hash;
            let card_item = this.state.card_item;//优惠券
            let pay_message = this.refs.message ? this.refs.message.getValue():"";//留言
            let delivery_type = this.state.delivery_type;
            let delivery_time = this.refs.delivery_date ? this.refs.delivery_date.getValue():"";
            let definite_delivery_time = this.refs.delivery_time ? this.refs.delivery_time.getSelectValue():"";
            let delivery_name = this.refs.name ? this.refs.name.getValue():"";
            let delivery_phone = this.refs.phone ? this.refs.phone.getValue():"";
            let part_time = this.refs.date_time ? this.refs.date_time.getValue():"";
            let definite_time = this.refs.part_time ? this.refs.part_time.getSelectValue():"";
            if (delivery_time){
                delivery_time = delivery_time.replace(new RegExp("-","g"),"/");
            }
            if (part_time) {
                part_time = part_time.replace(new RegExp("-","g"),"/");
            }
            let date = delivery_time || part_time;
            let time = definite_delivery_time || definite_time;
            let nowDate = Date.parse(new Date());
            let discount = "";//优惠金额
            let card_code = "";//优惠卡号
            let card_id = "";//优惠卡id
            if (card_item) {
                discount = card_item.discount;
                card_code = card_item.card_code;
                card_id = card_item.card_id;
            }
            if (delivery_type==0) {//物流配送
                if(!address_id){
                    Com.toast("请设置收货地址");
                    return;
                }else if (!b_isAddr) {//判断地址是否有效
                    Com.toast("请设置有效收货地址");
                    return;
                }
            }else if (delivery_type==1){//店员配送
                if(!address_id){
                    return Com.toast("请设置收货地址");
                }else if(!part_time){
                    return Com.toast("请设置收货日期");
                }else if(!definite_time){
                    return Com.toast("请设置收货时间");
                }else if(countTime(part_time,definite_time)){
                    return Com.toast("不能穿越哦！");
                }else if (!b_isAddr) {//判断地址是否有效
                    return Com.toast("请设置有效收货地址");
                }
            }else{//到店自提
                if(!delivery_time){
                    return Com.toast("请设置到店日期");
                }else if(!definite_delivery_time){
                    return Com.toast("请设置到店时间");
                }else if(countTime(delivery_time,definite_delivery_time)){
                    return Com.toast("不能穿越哦！");
                }else if(!delivery_name){
                    return Com.toast("请填写收货人姓名");
                }else if(!delivery_phone){
                    return Com.toast("请填写收货人手机号");
                }else if(!Com.checkMobile(delivery_phone)){
                    return Com.toast("手机号格式不正确");
                }
            }
            //open_sn:0 团号,spell_id:1 拼团号,is_open_head:1   0是参团 1是开团
            Com.postVerify({act:"activity_spell_group",op:"buy_step2",address_id:address_id,vat_hash:vat_hash,offpay_hash:"",offpay_hash_batch:"",pay_name:"online",invoice_id:0,voucher:0,pd_pay:1,password:0,rcb_pay:0,goods_fcode:0,member_email:"",order_from:2,pay_message:pay_message,cart_id:cartIds,open_sn:open_sn,spell_id:spell_id,is_open_head:is_open_head},function(res){
                    if (parseInt(res.code) === 0 && res.data.pay_sn) {
                        var type = (Com.getBrowserType() === Com.ENUM_BROWSER_WX) ? 1 : 2;
                        payment.payTypeRequest(res.data.pay_sn,3);
                    }else{
                        Com.toast(res.msg);
                    }
                });
        }
        componentDidMount(){
            let _self = this;
            let {address_info,goods_total,delivery} = this.props;
            let {delivery_type} = this.state;
            if(delivery_type ===0){
                getFreight(address_info);
            }else {
                //countFreight(delivery_type,goods_total,delivery.seller_dispatching_info,address_info);
            }
            Com.addEvt('address_select',(data)=>{
                if(data){
                    _self.setState({address_info:data.data});
                    if(delivery_type===0){
                        getFreight(data.data);
                    }else {
                        //countFreight(_self.state.delivery_type,_self.props.goods_total,_self.props.delivery.seller_dispatching_info,_self.state.address_info);
                    }
                    Com.setLocalData('address_select',null);
                }
            });

        }
        render(){
            let {goods_list,goods_total,shop_name,delivery,vat_hash,spell_price} = this.props;
            let {freight,totalPrice,card_item} = this.state;
            let {address_info} = this.state;
            let discount = "";//优惠金额
            // let group_price = parseFloat(goods_total) - parseFloat(spell_price);
            // group_price = group_price.toFixed(2);
            let card_alias_name = "";//优惠信息
            // let group_list = [];
            // for (var i = 0; i < goods_list.length; i++) {
            //     group_list[i] = goods_list[i];
            //     group_list[i].goods_price = spell_price;
            // }
            let goods_number = goods_list[0].goods_num;
            let pay_price = 0;
            let total_price = 0;
            let group_price = 0;
            if (goods_number > 0) {
                group_price = parseFloat(goods_total) - parseFloat(spell_price) * parseFloat(goods_number);
                pay_price = parseFloat(spell_price) * parseFloat(goods_number) + parseFloat(freight);
                total_price = parseFloat(spell_price) * parseFloat(goods_number);
            }
            if (card_item) {
                discount = card_item.discount/100;
                card_alias_name = card_item.card_alias_name;
            }
            seller_info = delivery.seller_dispatching_info ?"":"";
            let s_time_limit = delivery.seller_dispatching_info ? delivery.seller_dispatching_info.time_limit : [];
            let c_time_limit = delivery.call_by_self_info ? delivery.call_by_self_info.time_limit : [];
            // totalPrice;//商品总价
            let address_name= address_info.hasOwnProperty('address_id') ? address_info.true_name+" "+address_info.mob_phone :"请设置收货地址";
            let area_info = address_info.hasOwnProperty('address_id')  ? address_info.area_info : null;
            let address = address_info.hasOwnProperty('address_id')  ? address_info.address : null;
            let b_address = address_info.hasOwnProperty('address_id') ? true : false;
            let a_data ={"true_name":address_name,"area_info":area_info,"address":address};

            let curIndex;
            // if (Com.getLocalData("curType")) {
            //     curIndex = parseInt(Com.getLocalData("curType"));
            // }else{
                curIndex = this.state.delivery_type;
            // }
            //物流配送 0
            let wlItem = <div className={`${curIndex===0?"store_del_info base-mB10":"base-hide"}`}>
                            <Address data={a_data} b_address={b_address} callback={()=>this.addressOnClick()}></Address>
                            <LabelInput b_isInput={false} s_left={"当前店铺"} s_right={shop_name} b_right={true} b_after={false} />
                         </div>;
            //店员配送 1
            let dyItem = <div className={`${curIndex===1?"store_del_info base-mB10":"base-hide"}`}>
                            <Address data={a_data} b_address={b_address} callback={()=>this.addressOnClick()}></Address>
                            <TimeLabel ref="date_time" s_left={"收货日期"} b_type={true}></TimeLabel>
                            <TimeLabel ref="part_time" s_left={"收货时间"} b_type={false} a_time={s_time_limit}></TimeLabel>
                            <LabelInput  b_isInput={false} s_left={"当前店铺"} s_right={shop_name} b_right={true} b_line={true} b_after={true} />
                         </div>;
              //自提 2
            let ztItem = <div className={`${curIndex===2?"store_del_info base-mB10":"base-hide"}`}>
                            <LabelInput s_left={"目标门店："} s_right={shop_name} b_right={true} b_line={true} />
                            <TimeLabel ref="delivery_date" s_left={"到店日期"} b_type={true} ></TimeLabel>
                            <TimeLabel ref="delivery_time" s_left={"到店时间"} b_type={false} a_time={c_time_limit}></TimeLabel>
                            <LabelInput ref="name" b_isInput={true} s_left={"用户姓名"} s_right={"请输入姓名"} b_line={true} />
                            <LabelInput ref="phone" b_isInput={true} s_left={"手机号码"} s_right={"请输入号码"} s_inputType="number"/>
                         </div>;
            return (
                <div className="group_order_submit">
                    <div className="store_delivery base-mB10">
                        <div className="labelTit">配送方式：</div>
                        <SelectBtnGroup f_callBack={(index)=>this.clickHandler(index)} i_currentItem={0} a_dataItems={[[1,"物流配送"]]} />
                    </div>
                    <div className="order_fz12">
                        {wlItem}
                        {dyItem}
                        {ztItem}
                    </div>
                    <div className="base-mB10 shopC_submit_detail">
                        <MediaItem s_img={require('storeIconImg')}  s_label={shop_name || "暂无"}   />
                        <GoodsGroup a_goodsList={goods_list} />
                        <div className="sale_wrap">
                            <MediaItem s_img={require('group_saleImg')} s_label="拼团优惠" s_right={"-￥"+Com.getNumFormat(group_price)} b_after={false} b_line={true} />
                        </div>
                        <LabelInput s_left={"运费"} s_right={freight>0?"￥"+Com.getNumFormat(freight):'包邮'} b_right={true} b_line={true}/>
                        <div className="order_part  base-after-line">
                                <section className="detail-type ">
                                    <span>售后保障</span>
                                    <p className="ml">{"该商品由"+shop_name+"负责配送和售后服务"}</p>
                                </section>
                            </div>
                        <LabelInput s_left={"给卖家留言"} b_isInput={true} ref="message" s_right="选填，对本次交易有效"  b_right={true} />
                    </div>
                    <div className="shopC_submit">
                        <div className="shopC_rel">
                            <span>实付：<em>￥{Com.getNumFormat(pay_price)}</em></span>{/*共<em>1</em>件*/}
                            <div className="shopC_buy" onClick={()=>this.btnClick()}>提交订单</div>
                        </div>
                    </div>
                </div>
             );
        }
    };
    let freight_hash = '';
    //请求数据  ifcart：是否是购物车过来的商品，0==false  ifcart  cartIds  dvvbetbk|1
    Com.getVerify({act:"activity_spell_group",op:"buy_step1",cart_id:cartIds,open_sn:open_sn,spell_id:spell_id},function(res){
        if(res.code === 0){
            let address_info = res.data.address_info;//收货地址信息
            let store_cart_list = res.data.store_cart_list;//
            let shop_name = res.data.store_name;//店铺名称
            let goods_list = [];//商品列表
            let goods_total = "";//商品总价
            let delivery = res.data.delivery;//配送方式
            freight_hash = res.data.freight_hash;//运费hash
            let vat_hash = res.data.vat_hash;//物流信息hash
            let card_info = "";//优惠券
            let spell_price = res.data.spell_price;
            for(var key in store_cart_list){
                if(store_cart_list.hasOwnProperty(key)){
                    goods_total = store_cart_list[key].store_goods_total;
                    goods_list = goods_list.concat(store_cart_list[key].goods_list);
                }
            }
            e_pageEl = ReactDOM.render(<PageEl spell_price={spell_price} card_info={card_info} shop_info={res.data.shop_info} goods_list={goods_list} goods_total={goods_total} address_info={address_info} shop_name={shop_name} delivery={delivery} vat_hash={vat_hash}/>,document.getElementById('pageCon'));
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

    //解析腾讯地图返回的坐标
    window.geocoder = function(res){
        if (res.status === 0) {
            b_isAddr = true;
        }else if(res.status === 347){
            b_isAddr = false;
        }
    }

    //计算运费
    function countFreight(delivery_type,goods_total,seller_info,address_info){
        if (!seller_info || !goods_total) {
            _self.setState({freight:0});
            return;
        }
        if (_self.state.card_item) {//计算优惠
            goods_total = parseFloat(goods_total) - parseFloat(_self.state.card_item.discount/100);
        }
        if (delivery_type == 1) {
            if(parseFloat(goods_total) >= parseFloat(seller_info.free_freight)){
               _self.setState({freight:0,totalPrice:goods_total});
            }else{
                _self.setState({freight:seller_info.freight,totalPrice:(parseFloat(goods_total)+parseFloat(seller_info.freight))});
            }
        }else if(delivery_type == 0) {
            getFreight(address_info);
        }else{
            _self.setState({freight:0,totalPrice:goods_total});
        }
    }

    //请求运费
    function getFreight(address_info){
        if(!freight_hash || !address_info || !address_info.hasOwnProperty("address_id")){
            return;
        }
        Com.getNormal({act:"member_buy",op:"change_address",freight_hash:freight_hash,city_id:address_info.city_id,area_id:address_info.area_id},function(res){
            if (res.code === 0) {
                let content = res.data.content;
                let freight = 0;//运费
                let _goods_total = e_pageEl.props.goods_total;
                for (var key in content) {
                    freight = content[key];
                }
                if (_self.state.card_item) {//计算优惠
                    _goods_total = parseFloat(_goods_total) - parseFloat(_self.state.card_item.discount/100);
                }
                Com.getLocation(encodeURIComponent(address_info.area_info+address_info.address),"geocoder");
                e_pageEl.setState({freight:freight,totalPrice:parseFloat(_goods_total)+parseFloat(freight)});
            }else{
                Com.toast(res.msg);
            }
        });
    }

    function countTime(i_date,s_time){
        let time = s_time.split(":");
        let isTrue = true;
        //选择时间大于当前时间
        if (Date.parse(i_date) + parseInt(time[0])*60*60*1000 > Date.parse(new Date())) {
            isTrue = false;
        }else{
            let lastTime = time[1].split("-");
            //选择时间2大于当前时间
            if (Date.parse(i_date) + parseInt(lastTime[1])*60*60*1000 > Date.parse(new Date())) {
                isTrue = false;
            }
        }
        return isTrue;
    }

});
