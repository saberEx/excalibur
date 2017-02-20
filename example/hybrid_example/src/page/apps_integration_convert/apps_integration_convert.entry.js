/*
 * @Author: 黄权
 * @Date:   2016-12-14 10:36:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-14 15:39:11
 * 积分商城兑换提交页
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("提交兑换");
    require("apps_integration_convertCss");
    let AddRess = require('address');
    let MediaItem = require('mediaItem');
    let GoodsGroup = require('goodsGroup');
    let SubmitOrderBuy = require('submitOrderBuy');
    let LabelInput = require('labelInput');
    let AddGoodsNum = require('addGoodsNum'); 
    let classSet = require('classnames');
    let pgoods_id = Com.getPageParams("pgoods_id");
    let pgoods_num = Com.getPageParams("pgoods_num") ||0;
    let member_id = Com.getCookie("member_id");
    let wxLocation = require('wxLocation');
    let n_lat = "";
    let n_lon = "";
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            let {address_list,prod_info} = this.props.data;
            let o_address = {};
            if(address_list && address_list.length>0){
                for(let i =0,len=address_list.length;i<len;i++){
                    let {is_default,address_id} = address_list[i];
                    if(parseInt(is_default)===1){
                        this.address_id = address_id;
                        o_address = address_list[i];
                        break;
                    }
                }
            }
            let {pgoods_type,is_logistics,is_selfpick} = prod_info;
            let i_index =(parseInt(pgoods_type)===0 && is_logistics == 0 && is_selfpick !=0)?1:0;
            this._n_price = prod_info.pgoods_points*parseInt(pgoods_num);
            this.state = {o_address:o_address,i_tabIndex:i_index,o_shopData:{},b_showMask:false};
        }
        //选择更改地址
        f_address(){
            Com.setLocalData("apps_integration_convert_type",1);
            Com.openWin("address_select");
        }
        //数量改变
        f_numbox(value){
            let {pgoods_points} = this.props.data.prod_info;
            this._n_price = pgoods_points*value;
            this.refs.submitEl.setState({i_num:value,n_price:this._n_price});
        }
        //确定兑换
        f_submit(i_num,n_price){
            let {pgoods_type} = this.props.data.prod_info;
            let address_id = this.address_id;
            let {i_tabIndex,o_shopData} = this.state;
            if(parseInt(pgoods_type)===0){
                if(i_tabIndex===0 && !address_id){
                    return Com.toast("请先选择收货地址");
                }
                if(i_tabIndex===1){
                    if(!o_shopData.shop_id){
                        return Com.toast("请先选择提货门店");
                    }
                    if(!this.refs.trueName.getValue()){
                        return Com.toast("请输入姓名");
                    }
                    if(!Com.checkMobile(this.refs.tel.getValue())){
                        return Com.toast("请输入11位的手机号");
                    }
                }
            }else {
                if(!Com.checkMobile(this.refs.phone.getValue())){
                    return Com.toast("请输入11位的手机号");
                }
            }
            if(parseInt(i_num)<=0){
                return Com.toast("请选择兑换数量");
            }
            Com.postVerify({act:"activity_pointshop",op:"exchange_limit",pgoods_id:pgoods_id,quantity:i_num},(res)=>{
                Com.showProgress(false);
                if(parseInt(res.code) === 0){
                    this.i_submitNum = i_num;
                    this.setState({b_showMask:true});
                }else{
                    Com.toast(res.msg);
                }
            },false,true);
        }
        f_confirmSubmit(cancel){
            if(cancel){
                this.setState({b_showMask:false});
                return;
            }
            let {pgoods_type} = this.props.data.prod_info;
            let address_id = this.address_id;
            let {i_tabIndex,o_shopData} = this.state;
            let o_param = {act:"activity_pointshop",op:"point_submit",pgoods_id:pgoods_id,pgoods_num:this.i_submitNum};
            if(parseInt(pgoods_type)===0){
                o_param["pgoods_type"] = 0;
                if(i_tabIndex==0){
                    o_param["delivery_type"] = 1;
                    o_param["address_id"] = this.address_id;
                }else{
                    o_param["delivery_type"] = 2;
                    o_param["pshop_id"] = o_shopData.shop_id;
                    o_param["shop_name"] = o_shopData.shop_name;
                    o_param["true_name"] = this.refs.trueName.getValue();
                    o_param["tel"] = this.refs.tel.getValue();
                }
            }else {
                o_param["pgoods_type"] = 1;
                o_param["tel"] = this.refs.phone.getValue();
            }
            Com.postVerify(o_param,(ret)=>{
                if(parseInt(ret.code)===0){
                    this.setState({b_showMask:false});
                    Com.toast("兑换成功",()=>{
                        Com.openWin("apps_integration_orderDetail",{order_id:ret.data.data.order_id});
                    },3,1);
                } else {
                    Com.toast(ret.msg);
                }
            });
        }
        componentDidMount(){
            let i_convert_type = Com.getLocalData("apps_integration_convert_type");
            Com.addEvt("address_select",(res)=>{
               if(res && res.data){
                    this.address_id = res.data.address_id;
                    this.setState({o_address:res.data});
               }
            });
            let {i_tabIndex} = this.state;
            if(i_tabIndex === 1){
                 let o_data = Com.getLocalData("shop_all_select");
                 if(!(o_data && o_data.data)){
                    wxLocation.init((o_data)=>{
                        this.b_hasGetLocation = true;
                        if(o_data){
                            n_lat = o_data.lat;
                            n_lon = o_data.lon;
                        }
                        Com.postNormal({act:'shop_list',op:'getShopList',lat:n_lat,lon:n_lon,curpage:1,pagesize:1},(res)=>{
                            if(parseInt(res.code) === 0){
                                this.b_hasRequestShopList = true;
                                this.setState({o_shopData:res.data.shop_list[0] || {}});
                            }else{
                                Com.toast(res.msg);
                            }
                        });
                    });
                    Com.addEvt("shop_all_select",(res)=>{
                       if(res && res.data){
                            this.setState({o_shopData:res.data},()=>{
                                 Com.removeLocalData("apps_integration_convert_type");
                            });
                       }
                    });
                }else {
                    Com.addEvt("shop_all_select",(res)=>{
                       if(res && res.data){
                            this.setState({o_shopData:res.data},()=>{
                                 Com.removeLocalData("apps_integration_convert_type");
                            });
                       }
                    });
                }
            }else {
                Com.addEvt("shop_all_select",(res)=>{
                   if(res && res.data){
                        if(i_convert_type == 2){
                            this.setState({o_shopData:res.data,i_tabIndex:1});
                        }else {
                            this.setState({o_shopData:res.data});
                        }
                        Com.removeLocalData("apps_integration_convert_type");
                   }
                });
            }
        }
        f_changeIndex(index){
            let {i_tabIndex,o_shopData} = this.state;
            if(i_tabIndex !== index){
                this.setState({i_tabIndex:index},()=>{
                    if(index === 1 && !o_shopData.shop_id && !this.b_hasGetLocation){
                        if(this.b_hasGetLocation && !this.b_hasRequestShopList){
                            Com.postNormal({act:'shop_list',op:'getShopList',lat:n_lat,lon:n_lon,curpage:1,pagesize:1},(res)=>{
                                if(parseInt(res.code) === 0){
                                    this.b_hasRequestShopList = true;
                                    this.setState({o_shopData:res.data.shop_list[0] || {}});
                                }else{
                                    Com.toast(res.msg);
                                }
                            });
                        }else if(!this.b_hasGetLocation){
                            wxLocation.init((o_data)=>{
                                this.b_hasGetLocation = true;
                                if(o_data){
                                    n_lat = o_data.lat;
                                    n_lon = o_data.lon;
                                }
                                Com.postNormal({act:'shop_list',op:'getShopList',lat:n_lat,lon:n_lon,curpage:1,pagesize:1},(res)=>{
                                    if(parseInt(res.code) === 0){
                                        this.b_hasRequestShopList = true;
                                        this.setState({o_shopData:res.data.shop_list[0] || {}});
                                    }else{
                                        Com.toast(res.msg);
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
        f_checkShop(){
            Com.setLocalData("apps_integration_convert_type",2);
            Com.openWin("shop_all",{from:1});
        }
        f_openShopMap(){
            let {shop_map_x,shop_map_y,shop_name,shop_address} = this.state.o_shopData;
            if(shop_map_x && shop_map_y){
                 Com.openMap(shop_map_x,shop_map_y,shop_name,shop_address);
            }
        }
        //限制手机号输入最长11位
        f_onInput(value,type){
            if(value.length>11){
                if(type === 1){
                    this.refs.tel.setValue(value.substring(0, 11));
                }else if(type === 2){
                     this.refs.phone.setValue(value.substring(0, 11));
                }
            }
        }
        render(){
            let {address_list,prod_info} = this.props.data;
            let {o_address,i_tabIndex,o_shopData,b_showMask} = this.state;
            let {pgoods_type,pgoods_points,pgoods_image_max,pgoods_name,pgoods_price,pgoods_islimit,pgoods_limitnum,pgoods_storage,is_logistics,is_selfpick} = prod_info;
            let list=[{
                goods_image:pgoods_image_max,
                goods_name:pgoods_name,
                goods_price:parseFloat(pgoods_price).toFixed(2),
                goods_num:pgoods_num
            }];
            let e_type = null;
            pgoods_type = parseInt(pgoods_type);
            if(pgoods_type===0){
                e_type = <AddRess data={o_address} b_address={address_list.length>0} callback={(data)=>this.f_address(data)}/>;
            }else {
                e_type = <LabelInput ref="phone"  s_right="请输入您的手机号码" s_left="预留手机号：" b_line={true} b_isInput={true} b_right={true} s_inputType="number" onInput={(value)=>this.f_onInput(value,1)}/>;
            }
            let i_max = pgoods_storage;
            if(parseInt(pgoods_islimit)===1){
                i_max = parseInt(pgoods_limitnum)<parseInt(pgoods_storage)?pgoods_limitnum:pgoods_storage;
            }
            let s_left = classSet({"active":i_tabIndex===0,"base-hide":is_logistics==0});
            let s_right = classSet({"active":i_tabIndex===1,"base-hide":is_selfpick==0});
            return (
                <div className="apps_integration_convert">
                    <div className={`${pgoods_type===0?"covert_type":"covert_type base-hide"}`}>
                        <span className="covert_title">配送方式：</span>
                        <ul>
                            <li className={s_left} onClick={()=>this.f_changeIndex(0)}>物流配送</li>
                            <li  className={s_right}  onClick={()=>this.f_changeIndex(1)}>到店自提</li>
                        </ul>
                    </div>
                    <div className={`ziti_box base-mB10 ${pgoods_type===0&&i_tabIndex===1?"":"base-hide"}`}>  
                        <LabelInput s_left="提货门店："  s_right={`${o_shopData.shop_name || ""}`} b_right={true} b_line={true} b_after={true} onClick={()=>this.f_checkShop()}/>
                        {o_shopData.shop_address?<LabelInput s_left="查看位置" s_right={`${o_shopData.shop_address}`}  s_leftImg={require('address_iconImg')} onClick={()=>this.f_openShopMap()} b_right={true} b_leftImg={true}  b_line={true} b_after={true} />:null}
                        <LabelInput ref="trueName"  s_right="请输入您的姓名" s_value={o_address.true_name||""} s_left="用户姓名：" b_line={true} b_isInput={true} b_right={true}/>
                        <LabelInput ref="tel"  s_right="请输入您的手机号码" s_value={o_address.mob_phone||""} s_left="手机号码：" b_line={true} b_isInput={true} b_right={true} s_inputType="number" onInput={(value)=>this.f_onInput(value,1)}/>
                        <div className="tips">
                            <span>提货说明：</span>
                            兑换后，您会收到相应的兑换码，到店请出示给店员进行兑换。下单后请提前1-2天进行预约，以便门店尽快为您备货。
                        </div>
                    </div>
                    <div className={`base-mB10 ${i_tabIndex===0?"":"base-hide"}`}>
                        {e_type}
                    </div>
                    <div>
                        <MediaItem s_img={require('storeIconImg')} s_label="积分商城" b_line={true} />
                        <GoodsGroup a_goodsList={list} s_time={`所需积分：${pgoods_points}`} b_noNeedPath={true}/>
                        <AddGoodsNum s_tit={"兑换数量："} i_max={i_max} i_value={pgoods_num} i_min={1} f_callBack={(value)=>this.f_numbox(value)}/>
                    </div>
                    <div className={b_showMask?"":"base-hide"}>
                        <div className="fx_bg"></div>
                        <div className="exchange_limit">
                            <div className="headers">兑换确认</div>
                            <div className="exchange_content">
                                <h3>亲，本次兑换将消耗<span  className="intr_number">{this._n_price}</span>积分</h3>
                                <p>{i_tabIndex===0?"确认后请您留意物流配送信息，以便收件":"兑换后为方便您顺利提货，详情可咨询门店客服"}</p>
                            </div>
                            <div className="exchange_actions">
                                <span className="btn submit" onClick={()=>this.f_confirmSubmit()}>确定</span>
                                <span className="btn" onClick={()=>this.f_confirmSubmit(true)}>取消</span>
                            </div>
                        </div>
                    </div>
                    <SubmitOrderBuy ref="submitEl" onClick={(i_num,n_price)=>this.f_submit(i_num,n_price)} s_submit="确定兑换" i_type={2} i_num={pgoods_num} n_price={pgoods_points * pgoods_num}/>
                </div>
             );
        }
    };
    //请求数据
    Com.postNormal({act:"activity_pointshop",op:"point_exchange",pgoods_id:pgoods_id,member_id:member_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
