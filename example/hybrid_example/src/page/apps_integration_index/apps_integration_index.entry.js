/*
 * @Author: 卢旺
 * @Date:   2016-11-24 10:00:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-14 17:35:11
 * 积分商城与兑换记录
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("积分商城");
    require('apps_integration_indexCss');
    let Scroll = require('scroll');
    const PAGE_SIZE = 10;
    let NotData = require('notData');

    class IntegralGoodsItem extends React.Component{
        static propTypes = {
            b_isGoods:React.PropTypes.bool,//true为商品列表，false为兑换记录
            s_point:React.PropTypes.string,//兑换积分
            s_pgoods_id:React.PropTypes.string,//兑换id
            s_point_time:React.PropTypes.string,//兑换时间
            s_con_number:React.PropTypes.string,//消费积分
            s_point_state:React.PropTypes.string,//兑换状态描述
            i_point_state:React.PropTypes.number,//兑换状态码
            s_point_orderid:React.PropTypes.string,//收货id
            s_goodsImg:React.PropTypes.string,//商品图片
            s_goodsName:React.PropTypes.string,//商品名称
            f_callBack:React.PropTypes.func,//兑换回调
            f_goodsBack:React.PropTypes.func,//商品详情回调
        }
        f_itemClick(ev){
            let {pgoods_points,pgoods_id} = this.props.data;
            this.props.f_callBack && this.props.f_callBack(pgoods_id,pgoods_points);
            ev.stopPropagation();
        }
        f_goodsClick(){
            let {pgoods_id} = this.props.data;
            this.props.f_goodsBack && this.props.f_goodsBack(pgoods_id);
        }
        f_liClick(){
            let {b_isGoods} = this.props;
            if(!b_isGoods){
                let {pgoods_points,pgoods_id} = this.props.data;
                this.props.f_callBack && this.props.f_callBack(pgoods_id,pgoods_points);
            }
        }
        render(){
            let {b_isGoods} = this.props;
            let {pgoods_points,pgoods_id,pgoods_image,pgoods_name,card_start_time,card_end_time} = this.props.data;
            let val_a = <div>
                            <div className="newGroup">所需积分 <em>{pgoods_points}</em></div>
                        </div>;
            /*let val_b = <div className="val_b">
                            <span className="newGroup">兑换时间：{s_point_time}</span>
                            <div><span className="newGroup ">消费积分：<em>{s_con_number}</em></span></div>
                            <div>
                                <span className="newGroup">兑换状态 {s_point_state}</span>
                            </div>
                        </div>;*/
            let val_c = <div className="val_b">
                        <span className="newGroup">有效期{Com.getTimeFormat(card_start_time,0)}至{Com.getTimeFormat(card_end_time,0)}</span>
                        <div>
                            <span className="newGroup inter_number">{pgoods_points}积分</span>
                        </div>
                    </div>;
            let classN_tar=b_isGoods ? 'integralInfo_record' : 'integralInfo';
            let item = b_isGoods ? val_a : val_c;
            return(
                <div className={classN_tar} onClick={()=>this.f_liClick()}>
                    <div className="img_box">
                        <img src={pgoods_image} onError={(e)=>Com.setErrorImg(e.target)} onClick={this.f_goodsClick.bind(this)}/>
                    </div>
                    <div className="goodsInfo">
                        <div className={`goodsTit ${this.props.isGoods ? "base-ellipsis2" : "base-ellipsis"}`}>{pgoods_name}
                            <span className="base-fr groupBtn" onClick={this.f_itemClick.bind(this)}>兑</span>
                        </div>
                        <div className="groupType">
                            {item}
                        </div>
                    </div>
                </div>
            );


        }
    }
    class IntegralGoods extends React.Component{
        static propTypes = {
            a_data:React.PropTypes.array,//数据
            f_callBack:React.PropTypes.func,//兑换回调
            f_goodsBack:React.PropTypes.func,//商品详情回调
            b_isGoods:React.PropTypes.bool,//true为商品列表，false为兑换记录
        }
        f_groupClick(pgoods_id,pgoods_points){
            this.props.f_callBack && this.props.f_callBack(pgoods_id,pgoods_points);
        }
        f_goodsClick(pgoods_id){
            this.props.f_goodsBack && this.props.f_goodsBack(pgoods_id);
        }
        render(){
            let items = this.props.a_data.map((item,index)=>{
                return <IntegralGoodsItem key={index} b_isGoods={this.props.b_isGoods} data={item} f_callBack={this.f_groupClick.bind(this)} f_goodsBack={this.f_goodsClick.bind(this)}/>;
            });
            return(
                <div className="flow_box">
                    {items}
                </div>
            );
        }
    }

    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_list:[null,null],a_allLoaded:[false,false],total:0,used_total:0,i_index:0,a_hasRequest:[false,false],b_showMask:false,i_spoint:0,i_cardId:0};
        }
        f_pullUpScroll(scroll,curPage){
            let {a_list,a_allLoaded,i_index} = this.state;
            requestData(i_index,(data)=>{
                let {prod_list,total,used_total,page} = data;
                if(i_index === 0){
                    a_list[0] = a_list[0].concat(prod_list);
                    a_allLoaded[0] = !page.hasmore;
                }else {
                    a_list[1] = a_list[1].concat(prod_list);
                    a_allLoaded[1] = !page.hasmore;
                }
                this.setState({a_list:a_list,a_allLoaded:a_allLoaded,total:total,used_total:used_total});
                scroll.endScroll(!page.hasmore);
            },curPage,true);
        }
        f_change(type){
            let {a_list,a_allLoaded,a_hasRequest} = this.state;
            this.setState({i_index:type},()=>{
                if(!a_hasRequest[type]){
                    requestData(type,(data)=>{
                        a_hasRequest[type] = true;
                        let {prod_list,total,used_total,page} = data;
                        if(type === 0){
                            a_list[0] = prod_list;
                            a_allLoaded[0] = !page.hasmore;
                        }else {
                            a_list[1] = prod_list;
                            a_allLoaded[1] = !page.hasmore;
                        }
                        this.setState({a_list:a_list,a_allLoaded:a_allLoaded,total:total,used_total:used_total,a_hasRequest:a_hasRequest});
                    });
                }
            });
        }
        f_changeMask(i_cardId){
            if(i_cardId){
                Com.postVerify({act:"activity_pointshop",op:"point_submit",pgoods_id:i_cardId,pgoods_num:1,pgoods_type:3},(ret)=>{
                    if(parseInt(ret.code)===0){
                        this.setState({b_showMask:false},()=>{
                            let {wechat_card_id,store_id} = ret.data.cardInfo || {};
                            let {point_ordersn,order_id} = ret.data.data;
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
                                                Com.openWin("apps_integration_orderDetail",{order_id:order_id});
                                            },
                                            fail:function(res){
                                                Com.openWin("apps_integration_orderDetail",{order_id:order_id});
                                            }
                                        });
                                    }else{
                                        Com.toast("请求数据失败，请重试尝试");
                                    }
                                }else{
                                    Com.toast(res.msg);
                                }
                            });
                        });
                    } else {
                        Com.toast(ret.msg);
                    }
                });
            }else{
                this.setState({b_showMask:false});
            }
        }
        f_exchange(pgoods_id,s_point){//兑换回调
            let {i_index} = this.state;
            Com.postVerify({act:"activity_pointshop",op:"exchange_limit",pgoods_id:pgoods_id,quantity:1},(res)=>{
                if(parseInt(res.code) === 0){
                    if(i_index === 0){
                         Com.openWin("apps_integration_convert",{pgoods_id:pgoods_id,pgoods_num:1});
                    }else {
                        Com.showProgress(false);
                        this.setState({b_showMask:true,i_spoint:s_point,i_cardId:pgoods_id});
                    }
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        f_detail(pgoods_id){//商品详情
            Com.openWin("apps_integral_detail",{pgoods_id:pgoods_id});
        }
        componentDidMount(){
            let {i_index,a_list,a_allLoaded,a_hasRequest} = this.state;
            requestData(i_index,(data)=>{
                let {prod_list,total,used_total,page,order_list} = data;
                if(i_index ===0){
                    a_list[i_index] = prod_list;
                    a_allLoaded[i_index] = !page.hasmore;
                    a_hasRequest[i_index] = true;
                    this.setState({a_list:a_list,a_allLoaded:a_allLoaded,total:total,used_total:used_total,a_hasRequest:a_hasRequest});
                }
            });
        }
        render(){
            let {a_list,a_allLoaded,i_index,total,used_total,b_showMask,i_spoint,i_cardId} = this.state;
            let e_left = null;
            let e_right = null;
            if(a_list[0]){
                if(a_list[0].length>0){
                    e_left =  <Scroll b_allLoaded={a_allLoaded[0]}  f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                        <IntegralGoods a_data={a_list[0]} b_isGoods={true} f_callBack={this.f_exchange.bind(this)} f_goodsBack={this.f_detail}/>
                    </Scroll>;
                }else {
                    e_left = <NotData/>;
                }
            }
            if(a_list[1]){
                if(a_list[1].length>0){
                    e_right =  <Scroll b_allLoaded={a_allLoaded[1]}  f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                        <IntegralGoods a_data={a_list[1]} b_isGoods={false} f_callBack={this.f_exchange.bind(this)}/>
                    </Scroll>;
                }else {
                    e_right = <NotData/>;
                }
            }
            return (
                <div className="apps_integration_index">
                    <div className="integ_menu">
                        <ul>
                            <li>
                                <img src={require("icon_shengyuImg")}/>
                                <span>剩余积分：<em>{total}</em></span>
                            </li>
                            <li>
                                {/*<span>已兑换积分：{used_total}</span>*/}
                                <span className="mar_right" onClick={()=>Com.openWin("apps_integration_record")}>兑换记录&#62;</span>
                                <img src={require("icon_yinImg")} />
                            </li>
                        </ul>
                    </div>
                    <div className="integration_type">
                        <ul>
                            <li className={i_index ===0 ? 'active' :''} onClick={()=>this.f_change(0)}>  
                                商品
                            </li>
                            <li className={i_index ===1 ? 'active' :''} onClick={()=>this.f_change(1)}>
                                优惠券
                            </li>   
                        </ul>
                    </div>
                    <div className={`container ${i_index===0?"":"base-hide"}`}> 
                        {e_left}
                    </div> 
                    <div className={`container ${i_index===1?"":"base-hide"}`}>
                        {e_right}
                    </div>
                    {/*<footer className="iMenu">
                        <span className={i_index ===0 ? 'active' :''}   onClick={()=>this.f_change(0)}>
                            <p>积分商城</p>
                        </span>
                        <span className={i_index ===1 ? 'active' :''} onClick={()=>this.f_change(1)}>
                            <p>兑换记录</p>
                        </span>
                    </footer>*/}
                    <div className={b_showMask?"":"base-hide"}>
                        <div className="fx_bg"></div>
                        <div className="exchange_limit">
                            <div className="headers">兑换确认</div>
                            <div className="exchange_content">
                                <h3>亲，本次兑换将消耗<span  className="intr_number">{i_spoint}</span>积分</h3>
                                <p>确定后您将收到领取链接，优惠数量有限请及时领取</p>
                            </div>
                            <div className="exchange_actions">
                                <span className="btn submit" onClick={()=>this.f_changeMask(i_cardId)}>确定</span>
                                <span className="btn" onClick={()=>this.f_changeMask()}>取消</span>
                            </div>
                        </div>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    //type为当前点击按钮 0为积分商城 1为优惠券"point_order"
    function requestData(type=0,f_callBack,curPage=1,b_noShow){
        let o_param = {act:"activity_pointshop",op:"point_index",pagesize:PAGE_SIZE,curpage:curPage};
        if(type === 1){
            o_param["pgoods_type"] = 3;
        }
        Com.getVerify(o_param,(res)=>{
            if (parseInt(res.code) === 0) {
                f_callBack(res.data);
            }else{
                Com.toast(res.msg);
            }
        },b_noShow);
    }
    requestData(0,(data)=>{
        // console.log(data);
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    },false)
});
