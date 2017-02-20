/*
 * @Author: 程巨龙
 * @Date:   2016-10-20 16:00:27
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-04 11:28:48
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("会员中心");
    require("user_centerCss");
    let defaultUserImg = require('defaultUserImgImg');
    let MediaItem = require('mediaItem');
    let Scroll = require('scroll');

    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                data : {}
            }
        }
        //地址管理
        goAddress(){
            Com.openWin('address_manage');
        }
        //我的订单
        f_goToMyOrder(orderState){
            Com.openWin("order_list",{orderState:orderState});
        }
        //打开页面
        f_open(type,page,pageParams){
            switch(type){
                case 0:
                    Com.openWin(page,pageParams);
                    break;
                case 1:
                    if (parseInt(page) === 1 && pageParams) {
                        Com.openWin("member_center",{pageParam:pageParams});
                    }else{
                        Com.openWin("member_list");
                    }
                    break;
            }
        }
        componentDidMount(){
            Com.postVerify({act:'member_index',op:'getUserCenterData'},(res)=>{
                if(parseInt(res.code) === 0){
                    let {data} = res;
                    Com.setLocalData("userCenterData",data);
                    this.setState({data:data});
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {jfb,member_avatar,member_mobile,member_name="",needPayOrderNum,waitPayOrderNum,alreadyPayOrderNum,sinceOrderNum,buyShopNum,member_card_num,card_code} = this.state.data;
            // let b_hasJfb = jfb && jfb.length !==0;
            let userName = member_mobile?member_mobile:member_name;
            return (
                <Scroll>
                    <div className="user_center">
                        <section className="cardInfo">
                            <div className="base-ovh headerCon">
                                <img src={member_avatar?member_avatar:defaultUserImg} className="userImg"/>
                                <div className="userInfo">
                                    <h2 className="userName">{Com.replaceName(userName)}</h2>
                                    {<div className="userLevel">欢迎回来</div>}
                                </div>
                            </div>
                            {/*<div className="userMessage"><img src={require('messageImg')} /></div>
                            <div className="userAddress" onClick={this.goAddress}>收货地址管理</div>*/}
                            <div className="myAttendCon">
                                <div className="base-ellipsis" onClick={()=>{this.f_open(0,"record_myFavorites")}} >
                                    商品收藏
                                </div>
                                {/*<div className="base-ellipsis" onClick={()=>{this.f_open(0,"record_myFavorites")}} >
                                    店铺收藏
                                </div>*/}
                                <div className="base-ellipsis" onClick={()=>{this.f_open(0,"record_myBrowse")}} >
                                    浏览记录
                                </div>
                            </div>
                        </section>
                        <section className="userOrder base-mT10 base-mB10">
                            <div className="listCon">
                                <div className="listItem" onClick={()=>{this.f_goToMyOrder(1);}}>
                                    {needPayOrderNum>0?<span className="badge">{needPayOrderNum}</span>:null}
                                    <img src={require('order_paymentImg')} className="orderIcon"/>
                                    <p>待付款</p>
                                </div>
                                <div className="listItem" onClick={()=>{this.f_goToMyOrder(2);}}>
                                    {waitPayOrderNum>0?<span className="badge">{waitPayOrderNum}</span>:null}
                                    <img src={require('order_waitImg')} className="orderIcon"/>
                                    <p>待发货</p>
                                </div>
                                <div className="listItem" onClick={()=>{this.f_goToMyOrder(3);}}>
                                    {alreadyPayOrderNum>0?<span className="badge">{alreadyPayOrderNum}</span>:null}
                                    <img src={require('order_receiptImg')} className="orderIcon"/>
                                    <p>待收货</p>
                                </div>
                                <div className="listItem" onClick={()=>{this.f_goToMyOrder(4);}}>
                                    {sinceOrderNum>0?<span className="badge">{sinceOrderNum}</span>:null}
                                    <img src={require('order_sinceImg')} className="orderIcon"/>
                                    <p>待自提</p>
                                </div>
                                <div className="listItem" onClick={()=>{this.f_goToMyOrder(5);}}>
                                    <img src={require('order_okImg')} className="orderIcon"/>
                                    <p>已完成</p>
                                </div>
                            </div>
                        </section>

                        <section className="base-mT10 base-mB10">
                            <MediaItem s_img={require('u_allOrderImg')} s_label="全部订单" onClick={()=>{this.f_goToMyOrder(0);}} b_after={true} b_line={true} />
                            <MediaItem s_img={require('u_groupImg')} s_label="我的拼团" onClick={()=>{this.f_open(0,"group_myGroup")}} b_after={true} b_line={true} />
                            <MediaItem s_img={require('u_afterSalesImg')} s_label="售后订单" onClick={()=>{this.f_open(0,"order_customerServiceOrder")}} b_after={true} b_line={true} />
                            <MediaItem s_img={require('u_cardImg')} s_label="会员卡" onClick={()=>{this.f_open(1,member_card_num,card_code)}} b_after={true} b_line={true} />
                            <MediaItem s_img={require('u_couponsImg')} s_label="优惠券列表" onClick={()=>{this.f_open(0,"my_vouche_list")}} b_after={true} b_line={true} />
                            <MediaItem s_img={require('u_intImg')} s_label="积分" onClick={()=>{this.f_open(0,"points")}} b_after={true} b_line={true} />
                            <MediaItem s_img={require('u_shopCarImg')} s_label="我的购物车" onClick={()=>{this.f_open(0,"myShopCart")}} s_right={`${buyShopNum>0?buyShopNum+"件商品":""}`} b_after={true} b_line={true} />
                            {/*<MediaItem s_img={require('order_paymentImg')} s_label="我的活动" b_after={true} b_line={true} />*/}
                            <MediaItem s_img={require('u_manageImg')} s_label="地址管理" onClick={()=>{this.f_open(0,"address_manage")}} b_after={true} b_line={true} />
                        </section>
                    </div>
                 </Scroll>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"user_center",op:"user_center"},function(res){
    //     if(res.code === 0){
            ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});
