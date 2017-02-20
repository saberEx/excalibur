/*
* @Author: {daihanqiao}
* @Date:   2015-11-10 14:22:26
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-09 10:17:34
* 订单列表
*/
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("全部订单");
    require("order_listCss");
    let TabBtnGroup = require('tabBtnGroup');
    let Scroll = require('scroll');
    let NotData = require('notData');
    require('payment');
    let PayPop = require('payPop');
    let OrderListGroup = require('orderListGroup');
    let PAGE_SIZE = 5;
    let orderState = parseInt(Com.getPageParams('orderState'));
    let _self = null;
    let tabBtnList = ["全部","待付款","待发货","待收货","待自提","已完成"];
    let tabIndex = ["all",10,20,30,50,40];
    let i_index = orderState;//用于处理共用scroll，无法刷新问题
    let noDataIcon_myOrderImg = require("noDataIcon_myOrderImg");
    // let h_scroll = document.body.offsetHeight - Com.getPxReality(50);
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                order_list:this.props.list,
                card_list:[],
                b_showMask:false,
                totalPrice:0,
                paySn:0,
                page:this.props.page,
                b_allLoaded:!this.props.page.hasmore
            };
        }
        clickHandler(index){
            i_index = index;
            requestData(tabIndex[index],(data)=>{
               _self.setState({b_showMask:false,order_list:data.order_group_list,page:data.page,b_allLoaded:!data.page.hasmore});
            })
        }
        btnClick(cardCode,s_disable,e){
            if (e) {
                e.stopPropagation();
            }
            if(s_disable){
                return this.setState({b_showMask:false});
            }
            let {paySn,totalPrice} = this.state;
            if(cardCode){
                Com.postVerify({act:'member_pay',op:'membercard_pay',card_code:cardCode,pay_sn:paySn},(ret)=>{
                    if(parseInt(ret.code) === 0){
                        Com.openWin("pay_success",{totalPrice:totalPrice});
                    }else {
                        Com.toast(ret.msg);
                    }
                });
            }else {
                // let type = (Com.getBrowserType() === Com.ENUM_BROWSER_WX) ? 1 : 2;
                payment.payTypeRequest(paySn,1);//微信支付
            }
        }
        bottomBtnClick(index,data){
            switch(index){
                case 1://取消订单
                    Com.confirm("您确定要取消该订单吗？",()=>{
                        Com.getNormal({act:'member_order',op:'order_cancel',order_id:data.order_id},function(res){
                            if(parseInt(res.code) === 0){
                                Com.reload();//刷新页面
                            }else{
                                Com.toast(ret.msg);
                            }
                        })
                    });
                    break;
                  case 2://付款
                    if (data.pay_sn != 0) {
                        let totalPrice = parseFloat(data.order_amount);
                        let paySn = data.pay_sn;
                        Com.postVerify({act:'wx_card_member',op:'get_member_card_list',shop_id:data.shop_id},(res)=>{
                            if(parseInt(res.code) === 0){
                                let card_list = res.data.card_list || [];
                                _self.setState({paySn:paySn,card_list:card_list,b_showMask:true,totalPrice:totalPrice});
                            }else {
                                Com.toast(res.msg);
                            }
                        });
                    }else{
                        Com.toast("支付失败");
                    }
                    break;
                case 3://取消并退款
                    // if (data.extend_order_common.delivery_state == "0") {//未发货订单直接取消退款
                    //     Com.postVerify({act:'member_order',op:'order_refund_all_commit',order_id:data.order_id,buyer_message:"未发货订单取消退款"},(res)=>{
                    //         if(parseInt(res.code)===0){
                    //             Com.reload();
                    //         }else{
                    //             Com.toast(res.msg);
                    //         }
                    //     });
                    // }else{
                        Com.openWin("order_refund",{order_id:data.order_id});
                    // }
                    break;
                case 4://查看物流
                    Com.openWin("order_logisticsDetails",{order_id:data.order_id});
                    // Com.openWin('order_refundGoods',{order_id:data.order_id,orderState:data.order_state});
                    break;
                case 5://确认收货
                    Com.confirm("是否确认收货？",()=>{
                        Com.getNormal({act:'member_order',op:'order_receive',order_id:data.order_id},function(ret){
                            if(parseInt(ret.code) === 0){
                                Com.reload();
                            }else{
                                Com.toast(ret.msg);
                            }
                        });
                    });
                    break;
                case 6://评价订单
                    if (data.goods_list) {
                        let a_evaluationData = [];
                        for(let i in data.goods_list){
                            let {goods_id,goods_image} = data.goods_list[i];
                            a_evaluationData.push([goods_id,Com.getGoodsImg(goods_image)]);
                        }
                        Com.openWin("order_evaluate",{order_id:data.order_id,evaluation:JSON.stringify(a_evaluationData)});
                    }
                    break;
                case 7://评价回复
                    Com.openWin("order_assess",{order_id:data.order_id});
                    break;
                default:
                    break;
            }
        }
        handlerClick(e){
            _self.setState({b_showMask:false});
        }
        f_pullUpScroll(scroll,curPage){
            requestData(tabIndex[i_index],(data)=>{
                let curList = data.order_group_list;
                let totalList = _self.state.order_list.concat(curList);
                let b_hasmore = data.page.hasmore;
                _self.setState({order_list:totalList});
                scroll.endScroll(!b_hasmore);
            },curPage,true);
        }
        render(){
            let {order_list,b_showMask,card_list,totalPrice,page,b_allLoaded} = this.state;
            let e_item = null;
            if (order_list.length === 0) {
                e_item = <NotData s_content="还没有此类订单" b_needBtn={true} imgUrl={noDataIcon_myOrderImg}/>;
            }else{
                e_item = <Scroll  f_pullUpScroll={this.f_pullUpScroll} b_allLoaded={b_allLoaded} i_index={""+i_index}>
                            <OrderListGroup a_datas={order_list} f_bottomCallBack={(index,data)=>this.bottomBtnClick(index,data)}></OrderListGroup>
                         </Scroll>;
            }
            return (
                <div className="order_list" onClick={this.handlerClick}>
                    <TabBtnGroup i_currentItem={i_index} f_callBack={(index)=>this.clickHandler(index)}  a_controlItems={tabBtnList} />
                    {e_item}
                    <PayPop a_data={card_list} totalPrice={totalPrice} b_showMask={b_showMask} f_wx_callBack={()=>this.btnClick()} f_card_callBack={(card_code,s_disable)=>this.btnClick(card_code,s_disable)} />
                </div>
             );
        }
    };

    //请求数据
    function requestData(orderState,f_callBack,curPage=1,b_noShow){//type  "all":全部订单;10:未付款;20:已付款;30:已发货;40:已收货;50:待自提;
        Com.getNormal({act:"member_order",op:"order_list",curpage:curPage,order_state:orderState,pagesize:PAGE_SIZE},(res)=>{
            if(parseInt(res.code) === 0){
                if (res.data) {
                    let data = res.data;
                    f_callBack(data);
                    }
            }else{
                Com.toast(res.msg);
            }
        },curPage,b_noShow);
    }

    requestData(tabIndex[orderState],(data)=>{
       _self = ReactDOM.render(<PageEl list={data.order_group_list} page={data.page}/>,document.getElementById('pageCon'));
    })
});
