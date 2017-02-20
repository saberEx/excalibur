/*
 * @Author: 黄权
 * @Date:   2016-11-17 13:45:39
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 11:46:07
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("商品详情");
    require("group_goodDetailsCss");
    require("goodDetailsCss");
    let TabBtnGroup = require('tabBtnGroup');
    let Slider = require('slider');
    let Group_Component=require('group_Comonent');
    let LabelInput = require('labelInput');
    let GoodsArgument = require('goodsArgument');
    let NumBox = require('numBox');
    let Scroll = require('scroll');
    // let shop_id = Com.getPageParams("shop_id");
    // shop_id = parseInt(shop_id) || 0;
    let shop_id = 0;//拼团目前为店铺级别，无门店商品拼团，防止在应用中打开该页面带入shop_id，设置为0。0161207-代汉桥
    let goods_alias = Com.getPageParams("goods_alias");
    let member_id = Com.getCookie("member_id");
    let commonDefaultImg = require("commonDefaultImg");
    let spell_id = Com.getPageParams("spell_id");
    let open_sn = Com.getPageParams("open_sn") || "";
    let NotData = require('notData');
    let classSet = require("classnames");
    let WxShare = require('wxShare');
    //规格转换
    function changeSpec(com_spec_list) {
        let a_spec = [];
        let {spec_name_list,spec_value_list} = com_spec_list;
        for(let i in spec_name_list){
            if(spec_name_list[i]){
                a_spec.push({name:spec_name_list[i],value:spec_value_list[i]||{}});
            }
        }
        return a_spec;
    }
    //商品信息
    class GoodsInfo extends React.Component {
        f_toIndex(){
            if(shop_id>0){
                Com.openWin("goods_all");
            }else {
                Com.openWin("index");
            }
        }
        render(){
            let {goods_name,goods_price,goods_marketprice,goods_freight,store_name} = this.props.data;
            let e_wrap = null;
            let s_name = store_name || "";
            let s_info = "进入店铺";
            if(shop_id>0){
                s_name = this.props.shop_info.shop_name || "";
                let {call_by_self,call_by_self_info,express,seller_dispatching,seller_dispatching_info} = this.props.shop_config_info;
                let a_way = [];
                let a_el = [];
                if(express == 1){
                    a_way.push("物流配送");
                    a_el.push(<GoodsArgument s_left={"物流配送："} s_right={`运费：${goods_freight>0?goods_freight:"包邮"}`} />);
                }
                if(seller_dispatching == 1){
                    a_way.push("店员配送");
                    let {money_limit,free_freight,freight,time_limit} = seller_dispatching_info;
                    let s_time = "";
                    if(time_limit.length>0){
                        s_time = "配送时间："
                        for(let i in time_limit){
                            let {start,end} = time_limit[i];
                            s_time += start + "-"+ end;
                        }
                    }
                    a_el.push(<GoodsArgument s_left={"店员配送："} s_right={`${money_limit}元起送,${free_freight}元包邮,运费${freight}元`} s_subRight={s_time}/>);
                }
                if(call_by_self == 1){
                    a_way.push("自提");
                    let {time_limit} = call_by_self_info;
                    let s_time = "";
                    if(time_limit.length>0){
                        s_time = "自提时间："
                        for(let i in time_limit){
                            let {start,end} = time_limit[i];
                            s_time += start + "-"+ end;
                        }
                    }
                    a_el.push(<GoodsArgument s_left={"自提："} s_right={s_time} />)
                }
                e_wrap = <div className="goodsWrap base-mT10">
                    <GoodsArgument s_left={"配送方式："} b_psfs={true} a_right={a_way}/>
                    {a_el}
                </div>;
            }else {
                let a_spec = changeSpec(this.props.com_spec_list);
                if(a_spec.length>0){
                    let e_list = a_spec.map((item,key)=>{
                        let {name,value} = item;
                        let s_value = "";
                        for(let i in value){
                            s_value = s_value + (value[i] || "")+" ";
                        }
                        return <GoodsArgument key={key} s_left={name+"："} s_right={s_value} />
                    });
                    e_wrap = <div className="goodsWrap base-mT10">
                        {e_list}
                    </div>
                }
            }
            return (
                <div>
                    <div className="goods_sm_info base-mT10">
                        <p className="good_name">{this.props.spell_goods_name}</p>
                        <p>
                            <span className="base-fl"></span>
                            <span className="base-fr ti_tuan" onClick={()=>Com.openWin("group_flow")}><i>团</i>拼团介绍</span>
                        </p>
                    </div>
                    {e_wrap}
                    <div className="goodsWrap base-mT10 goStore">
                        <div className="base-positionRel base-after-line">
                            <LabelInput s_left={s_name} s_right={s_info} s_leftImg={require('storeIconImg')} b_leftImg={true} b_right={true} onClick={()=>this.f_toIndex()}/>
                        </div>
                        <div className="storeApprove">
                            <span><img src={require('approveIconImg')} />企业认证</span>
                            <span><img src={require('approveIconImg')} />担保交易</span>
                            <span></span>
                        </div>
                    </div>

                </div>
            )
        }
    }

    //商品详情
    class GoodsDetail extends React.Component {
        render(){
            let data = this.props.data;
            let e_edtails = null;
            if(data){
                data = Com.replaceHtml(data);
                e_edtails = <div className="goodsWrap goodDetail" dangerouslySetInnerHTML={{__html:data}}>
                </div>;
            }else {
                e_edtails = <div className="goodsWrap goodDetail noImg">
                    <NotData s_content="暂无描述"/>
                </div>;
            }
            return(
                e_edtails
            )
        }
    }

    //销售记录
    class GoodsMarket extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_list:null,b_allLoaded:false};
        }
        componentDidMount(){
            this._PAGESIZE = 15;
            Com.getNormal({act:"normal_index",op:"getSalesRecord",goods_alias:goods_alias,pagesize:this._PAGESIZE},(res)=>{
                if(parseInt(res.code)===0){
                    if(res.data.salesRecord.length>0){
                        this.setState({a_list:res.data.salesRecord,b_allLoaded:!res.data.page.hasmore});
                        if(this.refs.saleScroll){
                            this.refs.saleScroll.initAllLoaded(!res.data.page.hasmore);
                        }
                    }
                } else{
                    Com.toast(res.msg);
                }
            },true);
        }
        f_pullUpScroll(scroll,curPage){
            let {a_list,b_allLoaded} = this.state;
            Com.getNormal({act:"normal_index",op:"getSalesRecord",goods_alias:goods_alias,pagesize:this._PAGESIZE,curpage:curPage},(res)=>{
                if(parseInt(res.code)===0){
                    a_list = a_list.concat(res.data.salesRecord);
                    b_allLoaded = !res.data.page.hasmore;
                    this.setState({a_list:a_list,b_allLoaded:b_allLoaded});
                    scroll.endScroll(b_allLoaded);
                } else{
                    Com.toast(res.msg);
                }
            },true);
        }
        render(){
            let {a_list,b_allLoaded} = this.state;
            let e_tr = null;
            let b_notBottomEl = false;
            if(a_list && a_list.length>0){
                e_tr = a_list.map((item,key)=>{
                    let {add_time,buyer_name,goods_num} = item;
                    return <tr key={key}>
                        <td>{Com.replaceName(buyer_name)}</td>
                        <td>{goods_num}</td>
                        <td>{Com.getTimeFormat(add_time,2)}</td>
                    </tr>;
                });
            }else {
                b_notBottomEl = true;
                e_tr = <tr>
                    <td className="noImg" colSpan="3">
                        <NotData />
                    </td>
                </tr>
            }
            return (
                <div className="goodsMarket base-pdT10">
                    <Scroll ref="saleScroll" b_allLoaded={b_allLoaded} b_notBottomEl={b_notBottomEl} f_pullUpScroll={(scroll,curPage)=>this.f_pullUpScroll(scroll,curPage)}>
                        <table className="markeTable">
                            <thead className={`${(a_list && a_list.length>0)?"":"base-hide"}`}>
                            <tr>
                                <td>买家</td>
                                <td>数量</td>
                                <td>购买时间</td>
                            </tr>
                            </thead>
                            <tbody>
                            {e_tr}
                            </tbody>
                        </table>
                    </Scroll>
                </div>
            )
        }
    }

    //商品评价
    class GoodsEvaluate extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_list:[null,null,null,null],a_allLoaded:[false,false,false,false],index:0,a_count:[0,0,0,0]};
        }
        componentDidMount(){
            this._PAGESIZE = 15;
            this.b_hasRequestIndex = [false,false,false,false];
            let {a_list,a_allLoaded} = this.state;
            this.requestEvaluateInfo = (index=0,callBack,curPage=1)=>{
                Com.getNormal({act:"normal_index",op:"evaluate",type:2,goods_alias:goods_alias,mode:index,pagesize:this._PAGESIZE,curpage:curPage},(res)=>{
                    if(parseInt(res.code)===0){
                        callBack(res.data);
                    } else{
                        Com.toast(res.msg);
                    }
                },true);
            }
            this.requestEvaluateInfo(0,(data)=>{
                this.b_hasRequestIndex[0] = true;
                a_list[0] = data.list;
                a_allLoaded[0] = !data.page.hasmore;
                this.setState({a_list:a_list,a_allLoaded:a_allLoaded});
                if(this.refs.postScroll){
                    this.refs.postScroll.initAllLoaded(!data.page.hasmore);
                }
            });
            Com.getNormal({act:"normal_index",op:"evaluate",type:1,goods_alias:goods_alias},(res)=>{
                if(parseInt(res.code)===0){
                    let {all,good,normal,bad} = res.data;
                    this.setState({a_count:[all,good,normal,bad]});
                } else{
                    Com.toast(res.msg);
                }
            });
        }
        f_tabChange(index){
            let {a_list,a_allLoaded} = this.state;
            this.setState({index:index},()=>{
                if(!this.b_hasRequestIndex[index]){
                    this.requestEvaluateInfo(index,(data)=>{
                        this.b_hasRequestIndex[index] = true;
                        a_list[index] = data.list;
                        a_allLoaded[index] = !data.page.hasmore;
                        this.setState({a_list:a_list,a_allLoaded:a_allLoaded});
                    });
                }
            });
        }
        f_pullUpScroll(scroll,curPage){
            let {index,a_list,a_allLoaded} = this.state;
            this.requestEvaluateInfo(index,(data)=>{
                a_list[index] = a_list[index].concat(data.list);
                a_allLoaded[index] = !data.page.hasmore;
                this.setState({a_list:a_list,a_allLoaded:a_allLoaded});
                scroll.endScroll(!data.page.hasmore);
            },curPage);
        }
        render(){
            let {index,a_list,a_count,a_allLoaded} = this.state;
            let e_list = [null,null,null,null];
            let a_notBottomEl = [false,false,false,false];
            for(let i=0;i<4;i++){
                if(a_list[i] && a_list[i].length>0){
                    e_list[i] = a_list[i].map((item,key)=>{
                        let {geval_frommembername,geval_isanonymous,geval_addtime,geval_content,geval_scores,geval_explain} = item;
                        let explain = null;//店家回复
                        geval_frommembername = Com.replaceName(geval_frommembername);
                        if (geval_explain) {
                            explain = <div className="store">
                                <div className="evaUser laberColor" >
                                    {geval_isanonymous==1?"店主回复@"+geval_frommembername.substr(0,1) + "*****":"店主回复@"+geval_frommembername}
                                </div>
                                <div className="eavDetail">
                                    {geval_explain}
                                </div>
                            </div>;
                        }
                        return <li key={key}>
                            <div className="evaUser">
                                {geval_isanonymous==1?geval_frommembername.substr(0,1) + "*****":geval_frommembername}
                                <span className="base-fr">{Com.getTimeFormat(geval_addtime,0)}</span>
                            </div>
                            <div className="eavDetail">
                                {geval_content}
                            </div>
                            {explain}
                        </li>;
                    });
                }else {
                    a_notBottomEl[i] = true;
                    e_list[i] = <li className="noImg">
                        <NotData />
                    </li>;
                }
            }
            return (
                <div className="goodsEva">
                    <div className={`${a_count[0]>0?"evaGroup":"evaGroup base-hide"}`}>
                        <span className={`${index===0?"active":""}`} onClick={()=>this.f_tabChange(0)}>
                            <button>全部({a_count[0]})</button>
                        </span>
                        <span className={`${index===1?"active":""}`} onClick={()=>this.f_tabChange(1)}>
                            <button>好评({a_count[1]})</button>
                        </span>
                        <span className={`${index===2?"active":""}`} onClick={()=>this.f_tabChange(2)}>
                            <button>中评({a_count[2]})</button>
                        </span>
                        <span className={`${index===3?"active":""}`} onClick={()=>this.f_tabChange(3)}>
                            <button>差评({a_count[3]})</button>
                        </span>
                    </div>
                    <Scroll ref="postScroll"  i_index={`${index}`} b_notBottomEl={a_notBottomEl[index]} b_allLoaded={a_allLoaded[index]} f_pullUpScroll={(scroll,curPage)=>this.f_pullUpScroll(scroll,curPage)}>
                        <ul className={`evaList ${index===0?"":"base-hide"}`}>
                            {e_list[0]}
                        </ul>
                        <ul className={`evaList ${index===1?"":"base-hide"}`}>
                            {e_list[1]}
                        </ul>
                        <ul className={`evaList ${index===2?"":"base-hide"}`}>
                            {e_list[2]}
                        </ul>
                        <ul className={`evaList ${index===3?"":"base-hide"}`}>
                            {e_list[3]}
                        </ul>
                    </Scroll>
                </div>
            )
        }
    }

    //加入购物车
    class GoodsType extends React.Component {
        constructor(props){
            super(props);
            let a_spec = changeSpec(this.props.com_spec_list);
            let all_com_goods = this.props.all_com_goods;
            let a_activeSpec = [];
            a_spec.forEach((item,key)=>{
                for(let i in item.value){
                    if(all_com_goods[goods_alias].goods_spec[i]){
                        a_activeSpec[key] = i;
                        return;
                    }
                }
            });
            this.state = {goods_alias:goods_alias,a_activeSpec:a_activeSpec,a_spec:a_spec,b_showSpec:false,i_type:1,b_disabled:true};
        }
        closeCart(){
            this.setState({b_showSpec:false});
        }
        //选取规格
        f_spec(index,value){
            let {a_activeSpec,goods_alias} = this.state;
            let all_com_goods = this.props.all_com_goods;
            a_activeSpec[index] = value;
            for(let i in all_com_goods){
                let goods_spec = all_com_goods[i].goods_spec;
                let isCurGoods = true;
                a_activeSpec.forEach((item)=>{
                    if(!goods_spec[item]){
                        isCurGoods = false;
                    }
                });
                if(isCurGoods){
                    goods_alias = i;
                    break;
                }
            }
            this.setState({goods_alias:goods_alias,a_activeSpec:a_activeSpec});
        }
        //确定加入购物车或者购买
        f_submit(index,goods_storage){
            if(goods_storage<=0){
                return;
            }
            let i_num = this.refs.numbox.value;
            let {goods_alias} = this.state;
            switch (index){
                case 1: //单人购买
                    let o_params = {cartIds:`${goods_alias}|${i_num}`,ifcart:0};
                    Com.openWin("order_submit",o_params);
                    break;
                case 2: //拼团购买
                    Com.openWin("group_order_submit",{cartIds:`${goods_alias}|${i_num}`,ifcart:0,spell_id:spell_id,open_sn:open_sn});
                    break;
            }
        }
        render(){
            let {all_com_goods} = this.props;
            let {a_spec,a_activeSpec,goods_alias,b_showSpec,i_type} = this.state;
            let maskStyle = b_showSpec ? "base-mask" :"base-mask anim";
            let cartStyle = b_showSpec ? "goodType anim" :"goodType";
            let o_data = all_com_goods[goods_alias];
            let {goods_name,goods_price,goods_marketprice,goods_storage,goods_image} = o_data;
            let {spell_purchasing} = this.props.spell_info;
            let s_storage = "库存：";
            if(i_type ===2 && spell_purchasing){
                goods_storage = spell_purchasing<=goods_storage?spell_purchasing:goods_storage;
                s_storage = "限购：";
            }
            let e_spec = null;
            e_spec = a_spec.map((item,key)=>{
                let {name,value} = item;
                let e_value = [];
                for(let i in value){
                    let s_class = classSet({"active":a_activeSpec[key]==i,"noStorage":goods_storage<=0});
                    e_value.push(<li className={s_class} key={i} onClick={()=>this.f_spec(key,i)}><span>{value[i]}</span></li>);
                }
                return <div className="typeNorms" key={key}>
                    <h3>{name}</h3>
                    <ul className="normsList">
                        {e_value}
                    </ul>
                </div>;
            });
            let s_class_cart = classSet("shopCar",{"base-hide":i_type!==1,"disabled":goods_storage<=0});
            let s_class_buy = classSet({"base-hide":i_type!==2,"disabled":goods_storage<=0});
            return (
                <div className={maskStyle}>
                    <div className={cartStyle}>
                        <div className="typeHead">
                            <div className="cartImg">
                                <img src={Com.getGoodsImg(goods_image,240)} onError={(ev)=>ev.target.src=commonDefaultImg}/>
                            </div>
                            <div className="cartTit">
                                <h2 className="base-ellipsis2">{goods_name}</h2>
                                <div className="cartPrice">
                                    ￥<em>{goods_price}</em>{goods_marketprice>0?<span>专柜价:{goods_marketprice}</span>:null}
                                    <span className="base-fr">{s_storage}{i_type ===2 && spell_purchasing?spell_purchasing:goods_storage}</span>
                                </div>
                            </div>
                            <div className="cartClose" onClick={()=>this.closeCart()}>
                                <div className="cartBtn">
                                    <img src={require('goodsBuyCloseIconImg')}/>
                                </div>
                            </div>
                        </div>
                        {e_spec}
                        <div className="typeNum base-border">
                            <h3>数量</h3>
                            <NumBox ref="numbox" i_min={parseInt(goods_storage)>0?1:0} i_max={parseInt(goods_storage)} i_value={parseInt(goods_storage)>0?1:0}/>
                        </div>
                        <div className="typeBuy">
                            <button className={s_class_cart} onClick={()=>this.f_submit(1,goods_storage)}>{goods_storage>0?'单独购买':"库存不足"}</button>
                            <button className={s_class_buy}  onClick={()=>this.f_submit(2,goods_storage)}>{goods_storage>0?"拼团购买":"库存不足"}</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {i_tabIndex:0,b_showSpec:false,i_specIndex:1};
        }
        clickHandler(index){
            this.setState({i_tabIndex:index});
        }
        //规格层
        f_spec(type){
            if(this.refs.spec){
                let spell_info = this.props.data.spell_info || {};
                let {state,open_state} = spell_info;
                if(type ===2){
                    if(parseInt(state) !== 2){
                        return;
                    }else {
                        if(open_sn && open_state && open_state !=0){
                            return;
                        }
                    }
                }
                this.refs.spec.setState({b_showSpec:true,i_type:type});
            }
        }
        //加入购物车成功回调
        f_changeCartNum(num){
            if(this.refs.footerBuy){
                this.refs.footerBuy.setState({b_cartNum:num});
            }
        }
        //滑动到底部自动切换下一个tab
        f_scrollEnd(type){
            let {i_tabIndex} = this.state;
            if(type==1 && i_tabIndex<3){
                this.setState({i_tabIndex:i_tabIndex+1});
            }/*else if(type==2 && i_tabIndex>0){
             this.setState({i_tabIndex:i_tabIndex-1});
             }*/
        }
        componentDidMount(){
            //更新浏览记录
            Com.postVerify({act:'member_index',op:'setBrowse',alias:goods_alias,type:1},null,false);
            let s_height = document.body.clientHeight - document.querySelector(".tabBtnGroup").offsetHeight - document.querySelector(".footerBuy").offsetHeight + "px";
            this.refs.index_3.style.height = s_height;
            this.refs.index_4.style.height = s_height;
        }
        render(){
            let {i_tabIndex,b_showSpec,i_specIndex} = this.state;
            let {all_com_goods,com_spec_list,goods_image_mobile,goods_info,shop_info={},is_jfb,shopping_cart,store_info,spell_info={},
                store_service_conf,shop_config_info={}} = this.props.data;
            let e_slide = goods_image_mobile.map((item,index)=>{
                return <li key={index}><img src={item} onError={(ev)=>ev.target.src=commonDefaultImg}/></li>
            });
            let b_bullet = true;
            if (goods_image_mobile.hasOwnProperty("length") && goods_image_mobile.length === 1) {
                b_bullet = false;
            }
            let b_canSpell = false;
            if(parseInt(spell_info.state) === 2){
                b_canSpell = true;
                let {open_state=0} = spell_info;
                if(open_sn && open_state && parseInt(open_state)!==0){
                    b_canSpell = false;
                }
            }
            let {mobile_body,plate_bottom,plate_top} = goods_info;
            mobile_body = mobile_body || "";
            if(plate_top){
                mobile_body = plate_top + mobile_body;
            }
            if(plate_bottom){
                mobile_body = mobile_body + plate_bottom;
            }
            return (
                <div className="group_goodDetails goodDetails">
                    <TabBtnGroup f_callBack={(index)=>this.clickHandler(index)} i_currentItem={i_tabIndex} a_controlItems={["商品信息","商品详情","销售记录","累计评价"]} />
                    <Scroll f_scrollEnd={(type)=>this.f_scrollEnd(type)} b_needRefresh={i_tabIndex===1?true:false}>
                        <div className={`${i_tabIndex===0?"":"base-hide"}`}>
                            <Slider i_time={3} b_bullet={b_bullet} >
                                {e_slide}
                            </Slider>
                            <Group_Component data={spell_info}/>
                            <GoodsInfo spell_goods_name={spell_info.spell_goods_name} data={goods_info} com_spec_list={com_spec_list} shop_info={shop_info} shop_config_info={shop_config_info}/>
                        </div>
                        <div className={`${i_tabIndex===1?"":"base-hide"}`}>
                            <GoodsDetail data={mobile_body}/>
                        </div>
                        <div ref="index_3" className={`${i_tabIndex===2?"container-3":"container-3 base-hide"}`}>
                            <GoodsMarket />
                        </div>
                        <div ref="index_4" className={`${i_tabIndex===3?"":"base-hide"}`}>
                            <GoodsEvaluate />
                        </div>
                    </Scroll>
                    <footer className="footerBuy">
                        <div className="footerItem">
                            <button className="footBuyBtn buyAlone" onClick={()=>this.f_spec(1)}>单独购买：￥{spell_info.spell_goods_price}</button>
                        </div>
                        <div className="footerItem">
                            <button className={`footBuyBtn ${b_canSpell?"":"disabled"}`} onClick={()=>this.f_spec(2)}>{open_sn?"我要参团":spell_info.spell_number+"人团："}￥{spell_info.spell_price}</button>
                        </div>
                    </footer>
                    <GoodsType ref="spec" spell_info={spell_info} f_changeCartNum={(num)=>this.f_changeCartNum(num)} i_type={i_specIndex} showCart={b_showSpec} data={goods_info}  com_spec_list={com_spec_list} all_com_goods={all_com_goods} />
                </div>
            );
        }
    };
    function requestData() {
        Com.postNormal({act:'normal_index',op:'getGoodDetails',spell_id:spell_id,goods_alias:goods_alias,open_sn:open_sn},(res)=>{
            if(parseInt(res.code) === 0){
                var goodsInfo = res.data.goods_info;
                var shareParams = {title: goodsInfo.goods_name, desc: '价格：￥'+goodsInfo.goods_price+' '+goodsInfo.goods_name, imgUrl: Com.getGoodsImg(goodsInfo.goods_image,240), baseURL: document.location.href+"&channel=11" };
                WxShare.showShare(shareParams);
                ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
            }else{
                Com.toast(res.msg);
            }
        });
    }
    //请求数据
    requestData();
});
