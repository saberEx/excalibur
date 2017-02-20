/*
 * @Author: 卢旺
 * @Date:   2016-12-09 11:40:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-07 14:39:14
 * 门店提交订单
 */
'use strict';
require('shopOrderSubmitCss');
let SelectBtnGroup = require('selectBtnGroup');
let TimeLabel = require('timeLabel');
let LabelInput = require('labelInput');
let MediaItem = require('mediaItem');
let PayPop = require('payPop');
let GoodsGroup = require('goodsGroup');
let Address = require('address');
let Scroll = require('scroll');
require('payment');
let _self = null;
let adds_x = "";//纬度
let adds_y = "";//经度
let b_isAddr = true;//地址是否正确  默认正确
let seller_info = null;//店员配送

class ShopOrderSubmit extends React.Component{
	static propsTypes = {
		delivery:React.PropTypes.Object,//物流信息
		address_info:React.PropTypes.Object,//地址信息
		goods_total:React.PropTypes.string,//价格
		card_item:React.PropTypes.Object,//优惠券
		shop_info:React.PropTypes.Object,//店铺信息
		goods_list:React.PropTypes.array,//商品列表
		shop_name:React.PropTypes.string,//门店名称
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
        let type = null;
        if (Com.getLocalData("curType")) {
            type = parseInt(Com.getLocalData("curType"));
        }else{
            type = this.props.delivery.express==1 ? 0 : 1;
        }
        this.state = {
            delivery_type:type,//0物流配送，1店员配送，2自提
            address_info:this.props.address_info,
            freight:this.props.freight,
            totalPrice:this.props.goods_total || 0,
            card_item:this.props.card_item || "",
            card_list:[],
            b_hasRequestCard:false,
            b_showMask:false
        };
    }
    clickHandler(index){
        this.setState({delivery_type:index,b_showMask:false});
        Com.setLocalData("curType",index);
        countFreight(index,this.props.goods_total,seller_info,this.state.address_info);
    }
    addressOnClick(){
        saveData();
        Com.setLocalData("curType",_self.state.delivery_type);
        Com.openWin('address_select');
    }
    openMap(){
        if (this.props.shop_info) {
            let shop_info = this.props.shop_info;
            let lat = shop_info.shop_map_x;
            let lon = shop_info.shop_map_y;
            let address = shop_info.shop_address;
            saveData();
            if(lat && lon && address){
                Com.openMap(lat,lon,this.props.shop_name,address);
            }else{
                Com.toast('获取门店位置失败');
            }

        }
    }
    btnClick(cardCode,s_disable,e){
        if (e) {
            e.stopPropagation();
        }
        if(s_disable){
            return this.setState({b_showMask:false});
        }
        let address_id = getAddress().address_id;
        let {vat_hash,ifcart,cartIds} = this.props;
        let card_item = this.state.card_item;//优惠券
        let pay_message = this.refs.message ? this.refs.message.getValue():"";//留言
        let delivery_type = parseInt(this.state.delivery_type);
        let delivery_time = this.refs.delivery_date ? this.refs.delivery_date.getValue():"";//自提日期
        let definite_delivery_time = this.refs.delivery_time ? this.refs.delivery_time.getSelectValue():"";//自提时间
        let delivery_name = this.refs.name ? this.refs.name.getValue():"";
        let delivery_phone = this.refs.phone ? this.refs.phone.getValue():"";
        let part_time = this.refs.date_time ? this.refs.date_time.getValue():"";//收货日期
        let definite_time = this.refs.part_time ? this.refs.part_time.getSelectValue():"";//收货时间
        // if (delivery_time){
        //     delivery_time = delivery_time.replace(new RegExp("/","g"),"-");
        // }
        // if (part_time) {
        //     part_time = part_time.replace(new RegExp("/","g"),"-");
        // }
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
        if (delivery_type===0) {//物流配送
            if(!address_id){
               return Com.toast("请设置收货地址");
            }else if (!b_isAddr) {//判断地址是否有效
                Com.toast("请设置有效收货地址");
                return;
            }
        }else if (delivery_type===1){//店员配送
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
        if (!adds_x || !adds_y) {
            //防止初始化页面未请求经纬度
            Com.getLocation(encodeURIComponent(getAddress().area_info+getAddress().address),"geocoder");
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
                password:0,rcb_pay:0,goods_fcode:0,member_email:"",order_from:2,pay_message:pay_message,delivery_type:delivery_type,
                delivery_dlyo_time:date+" "+time,delivery_dlyo_name:delivery_name,delivery_dlyo_tel:delivery_phone,
                part_time:date+" "+time,adds_x:adds_x,adds_y:adds_y,card_code:card_code,card_id:card_id},function(res){
                if (parseInt(res.code) === 0 && res.data.pay_sn) {
                    // Com.removeLocalData("curType");
                    if(cardCode){
                        Com.postVerify({act:'member_pay',op:'membercard_pay',card_code:cardCode,pay_sn:res.data.pay_sn},(ret)=>{
                            if(parseInt(ret.code) === 0){
                                clearData();
                                Com.openWin("pay_success",{totalPrice:totalPrice});
                            }else {
                                Com.toast(ret.msg);
                            }
                        },false);
                    }else {
                        payment.payTypeRequest(res.data.pay_sn,1);//微信支付
                    }
                }else{
                    Com.toast(res.msg);
                }
                _self.setState({b_showMask:false});
            },false,false);
        }
    }
    saleOnClick(){//所有优惠券
        if (this.state.card_item) {
            saveData();
            Com.setLocalData("curType",_self.state.delivery_type);
            Com.openWin("my_vouche_list",{submit:1});
        }
    }
    handlerClick(e){
        _self.setState({b_showMask:false});
    }
    componentDidMount(){
        let _self = this;
        let {goods_total,delivery} = this.props;
        let {delivery_type} = this.state;
        let address_info = getAddress();
        if(delivery_type === 0){//物流配送 请求运费
            getFreight(address_info);
        }else {
            countFreight(delivery_type,goods_total,delivery.seller_dispatching_info,address_info);
        }
        if(address_info && address_info.hasOwnProperty('address_id')){
            this.refs.name && this.refs.name.setValue(address_info.true_name);
            this.refs.phone && this.refs.phone.setValue(address_info.mob_phone);
        }
        Com.addEvt('address_select',(data)=>{
            if(data){
                _self.setState({address_info:data.data},()=>{
                    if(data && data.data.hasOwnProperty('address_id')){
                        _self.refs.name && _self.refs.name.setValue(data.data.true_name);
                        _self.refs.phone && _self.refs.phone.setValue(data.data.mob_phone);
                    }
                });
                Com.setLocalData("address_info",data.data);
                Com.getLocation(encodeURIComponent(data.data.area_info+data.data.address),"geocoder");
                if(delivery_type===0){
                    getFreight(data.data);
                }else {
                    countFreight(_self.state.delivery_type,_self.props.goods_total,_self.props.delivery.seller_dispatching_info,_self.state.address_info);
                }
                Com.setLocalData('address_select',null);
            }else{
                Com.getLocation(encodeURIComponent(getAddress().area_info+getAddress().address),"geocoder");
            }
            if (Com.getLocalData("curType")) {
                _self.setState({delivery_type:parseInt(Com.getLocalData("curType"))});
            }
        });
        setData();
    }
    render(){
        let {goods_list,goods_total,shop_name,delivery,vat_hash} = this.props;
        let {freight,totalPrice,card_item,card_list,b_showMask} = this.state;
        let address_info = getAddress();
        let discount = "";//优惠金额
        let card_alias_name = "";//优惠信息
        if (card_item) {
            discount = card_item.discount/100;
            card_alias_name = card_item.card_alias_name;
        }
        seller_info = delivery.seller_dispatching_info;
        let s_time_limit = delivery.seller_dispatching_info ? delivery.seller_dispatching_info.time_limit : [];
        let c_time_limit = delivery.call_by_self_info ? delivery.call_by_self_info.time_limit : [];
        let address_name= address_info.hasOwnProperty('address_id') ? address_info.true_name+" "+address_info.mob_phone :"请设置收货地址";
        let area_info = address_info.hasOwnProperty('address_id')  ? address_info.area_info : null;
        let address = address_info.hasOwnProperty('address_id')  ? address_info.address : null;
        let b_address = address_info.hasOwnProperty('address_id') ? true : false;
        let freight_type = address_info ? "包邮" : 0;
        let curItem,curIndex;
        if (Com.getLocalData("curType")) {
            curItem = parseInt(Com.getLocalData("curType"));
            curIndex = parseInt(Com.getLocalData("curType"));
        }else{
            curIndex = this.state.delivery_type;
            if (delivery.express ==0 && delivery.seller_dispatching==1) {
                curItem = 1;
            }else if(delivery.express ==0 && delivery.seller_dispatching==0){
                curItem = 2;
            }else {
                curItem = 0;
            }
        }
        let a_data ={"true_name":address_name,"area_info":area_info,"address":address};
        //物流配送 0
        let wlItem = <div className={`${curIndex===0?"store_del_info base-mB10":"base-hide"}`}>
        				<Address data={a_data} b_address={b_address} callback={()=>this.addressOnClick()}></Address>
                        <LabelInput b_isInput={false} onClick={()=>{this.openMap()}} s_left={"当前门店"} s_right={shop_name} b_right={true} b_line={true} b_after={true} />
                     </div>;
        //店员配送 1
        let dyItem = <div className={`${curIndex===1?"store_del_info base-mB10":"base-hide"}`}>
                        <Address data={a_data} b_address={b_address} callback={()=>this.addressOnClick()}></Address>
                        <TimeLabel ref="date_time" s_left={"收货日期"} b_type={true}></TimeLabel>
                        <TimeLabel ref="part_time" s_left={"收货时间"} b_type={false} a_time={s_time_limit}></TimeLabel>
                        <LabelInput onClick={()=>{this.openMap()}} b_isInput={false} s_left={"当前门店"} s_right={shop_name} b_right={true} b_line={true} b_after={true} />
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
            <div id="submit" className="store_order_submit" onClick={this.handlerClick}>
                <div className="store_delivery">
                    <div className="labelTit">配送方式：</div>
                    <SelectBtnGroup f_callBack={(index)=>this.clickHandler(index)} i_currentItem={curItem} a_dataItems={[[delivery.express,"物流配送"],[delivery.seller_dispatching,"店员配送"],[delivery.call_by_self,"到店自取"]]} />
                </div>
                <Scroll>
                {wlItem}
                {dyItem}
                {ztItem}
                <div className="base-mB10 shopC_submit_detail">
                    <MediaItem s_img={require('storeIconImg')}  s_label={shop_name || "暂无"} b_line={true} />
                    <GoodsGroup a_goodsList={goods_list} />
                    <div className="yh">
                        <MediaItem s_img={require('favorable_iconImg')} onClick={()=>this.saleOnClick()} s_label={card_alias_name || "暂无优惠券"} s_right={discount?"￥"+Com.getNumFormat(discount):""} b_after={true} b_line={true} />
                    </div>
                    <LabelInput s_left={"运费"} s_right={freight>0?"￥"+Com.getNumFormat(freight):freight_type} b_right={true} b_line={true}/>
                    <div className="order_part  base-after-line">
                        <section className="detail-type">
                            <span>售后保障</span>
                            <p className="ml">{"该商品由"+shop_name+"负责配送和售后服务"}</p>
                        </section>
                    </div>
                    <div className="mjly">
                        <LabelInput s_left={"给卖家留言"} b_isInput={true} ref="message" s_right="选填，对本次交易有效"  b_right={true} />
                    </div>
                </div>
                </Scroll>
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

//解析腾讯地图返回的坐标
    window.geocoder = function(res){
        console.log("经纬度",res);
        if (res.status === 0) {
            let location = res.result.location;
            adds_x = location.lat;
            adds_y = location.lng;
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
            goods_total = goods_total.toFixed(2);
        }
        if (delivery_type === 1) {
            if(parseFloat(goods_total) >= parseFloat(seller_info.free_freight)){
               _self.setState({freight:0,totalPrice:goods_total});
            }else if(seller_info.free_freight){
                let price = parseFloat(goods_total)+parseFloat(seller_info.freight);
                _self.setState({freight:seller_info.freight,totalPrice:price});
            }
        }else if(delivery_type == 0) {
            getFreight(address_info);
        }else{
            _self.setState({freight:0,totalPrice:goods_total});
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

    function getAddress(){
        let address_info = null;
        if (Com.getLocalData("address_info")) {
            address_info = Com.getLocalData("address_info");
        }else{
            address_info = _self.state.address_info;
        }
        return address_info;
    }

    //选择日期 选择时间
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

    //保存填写数据
    function saveData(){
        if (_self.refs.date_time && _self.refs.date_time.getValue()) {
            Com.setLocalData("date_time",_self.refs.date_time.getValue());
        }
        if (_self.refs.part_time && _self.refs.part_time.getSelectValue()) {
            Com.setLocalData("part_time",_self.refs.part_time.getSelectValue());
        }
        if (_self.refs.delivery_date && _self.refs.delivery_date.getValue()) {
            Com.setLocalData("delivery_date",_self.refs.delivery_date.getValue());
        }
        if (_self.refs.delivery_time && _self.refs.delivery_time.getSelectValue()) {
            Com.setLocalData("delivery_time",_self.refs.delivery_time.getSelectValue());
        }
    }
    //清除填写数据
     function clearData(){
        Com.removeLocalData("date_picker");
        if (_self.refs.date_time && _self.refs.date_time.getValue()) {
            Com.removeLocalData("date_time");
        }
        if (_self.refs.part_time && _self.refs.part_time.getSelectValue()) {
            Com.removeLocalData("part_time");
        }
        if (_self.refs.delivery_date && _self.refs.delivery_date.getValue()) {
            Com.removeLocalData("delivery_date");
        }
        if (_self.refs.delivery_time && _self.refs.delivery_time.getSelectValue()) {
            Com.removeLocalData("delivery_time");
        }
        if (_self.state.address_info) {
            Com.removeLocalData("address_info");
        }
    }
     function setData(){
        if (_self.refs.date_time && Com.getLocalData("date_time")) {
            _self.refs.date_time.setValue(Com.getLocalData("date_time"));
        }
        if (_self.refs.part_time && Com.getLocalData("part_time")) {
            _self.refs.part_time.setSelectValue(Com.getLocalData("part_time"));
        }
        if (_self.refs.delivery_date && Com.getLocalData("delivery_date")) {
            _self.refs.delivery_date.setValue(Com.getLocalData("delivery_date"));
        }
        if (_self.refs.delivery_time && Com.getLocalData("delivery_time")) {
            _self.refs.delivery_time.setSelectValue(Com.getLocalData("delivery_time"));
        }
    }

module.exports = ShopOrderSubmit;
