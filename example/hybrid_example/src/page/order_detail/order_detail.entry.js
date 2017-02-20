'use strict';
//微信支付成功后进入的订单详情
Com.ready(function(){
    require("order_detailCss");
    var Config = require(__CONFIG__);
    var logoImg=require("logoImg");
    var bg_bottomImg=require("bg_bottomImg");
    var car_bgImg=require("car_bgImg");
    var GoodsList = require('paySuccessGoodsList');
    var SalesGoods = require('salesGoods');
    var store_name = '';

    var guid = Com.getPageParams("guid");
    var guide_type = Com.getPageParams("guide_type");


    //页面组件
    var PageEl = React.createClass({
        getInitialState(){
            return{
                b_isShow : true,//是否展开，默认不展开显示两条，展开显示全部
            };
        },
        handlerToggle:function(){
            var o = document.getElementById("pay_div").style.display;
            if(o == "none"){//显示
                this.setState({b_isShow:false});//显示全部商品信息
                document.getElementById("toogle_s").classList.add("show");
                document.getElementById("pay_div").style.display="";
            }else{//隐藏

                this.setState({b_isShow:true});//只显示两条商品
                document.getElementById("toogle_s").classList.remove("show");
                document.getElementById("pay_div").style.display="none";
            }
        },
        infoClick:function(s_alias,store_alias,shop_id){
            Com.openWin("goodDetails",{goods_alias:s_alias,store_alias:store_alias,shop_id:shop_id});
        },
        itemHandleClick:function(card_id,store_id){
            var _this=this;
            Com.getNormal({act:"card_view",op:"get_card_api",wechat_card_id:card_id,store_id:store_id,mod:'wap',b_box:1},function(res){
                if(res.code === 0){
                    _this.wechat_ready(res.data.card_id,res.data.timestamp,res.data.nonce_str,res.data.cardSign);
                }else{
                    Com.toast(res.msg);
                }
            });

        },
        wechat_ready:function(cardId, timestamp, nonceStr, cardSign){
            wx.addCard({
                cardList: [{
                    cardId: cardId,
                    cardExt: JSON.stringify({timestamp:timestamp,nonce_str:nonceStr,signature:cardSign})
                }], // 需要添加的卡券列表
                success: function (res) {
                    var cardList = res.cardList; // 添加的卡券列表信息
                }
            });
        },
        render:function(){
            var {store_name,shop_name,online_real_money,real_money,total_money,payment,card_info,member_card_info,atime,goods_list,sales_goods} = this.props.data;
            var cardItem = null;
            var memberCardItem = null;
            if (card_info) {
                cardItem = <div className="quan_box">
                            <div className="quan_bg_box" onClick={()=>this.itemHandleClick(card_info.wechat_card_id,card_info.store_id)}>
                                <img src={card_info.logo_url} alt="" /><span className="quan_name">{card_info.card_alias_name}</span><a href="javascript:;" className="base-fr">立即领取</a>
                            </div>
                            <div className="dot_bg"></div>
                            <p className="bshadow">
                                <span className="base-fl">商贸通</span>
                                <span className="base-fr">有效期至：{card_info.end_time}</span>
                            </p>
                        </div>;
            }
            if (member_card_info) {
                var memeber_bg = member_card_info.background_pic_url ? member_card_info.background_pic_url : car_bgImg;
                memberCardItem = <div className="quan_box card_box" style={{'backgroundImage':'url('+memeber_bg+')', backgroundPosition:'center center'}}>
                                    <div className="quan_bg_box" onClick={()=>this.itemHandleClick(member_card_info.wechat_card_id,member_card_info.store_id)}>
                                        <img src={member_card_info.logo_url} alt="" />
                                        <span className="quan_name">
                                            {member_card_info.card_alias_name}
                                            <span>{member_card_info.brand_name}</span>
                                        </span>
                                        <a href="javascript:;" className="base-fr">立即领取</a>
                                    </div>
                                    <p>
                                        <span className="base-fl">商贸通</span>
                                        <span className="base-fr">有效期至：{member_card_info.end_time}</span>
                                    </p>
                                </div>;
            }
            if (this.state.b_isShow && goods_list.length > 2) {
                goods_list = [goods_list[0],goods_list[1]];
            }
            return (
                <div className="order_detail">
                    <div className="shop_name_wrap">
                        <span className="shop_type">{store_name}-</span><span className="shop_name">{shop_name}</span>
                    </div>
                    <div className="order_info_wrap">
                        <p className="order_info_de">
                            <span className="base-fl o_title">支付总额：</span>
                            <span className="base-fr order_price">￥{online_real_money}</span>
                        </p>
                        <p className="order_info_de">
                            <span className="base-fl o_title">支付方式：</span>
                            <span className="base-fr color">{payment}</span>
                        </p>
                        <p className="order_info_de">
                            <span className="base-fl o_title">交易时间：</span>
                            <span className="base-fr color">{Com.getTimeFormat(atime,2)}</span>
                        </p>
                        <div className="goods_info">
                            <table>
                                <thead>
                                    <tr>
                                        <td className="base-tl">商品</td>
                                        <td className="base-tc">数量</td>
                                        <td className="base-tr">金额(元)</td>
                                    </tr>
                                </thead>

                                <GoodsList a_data={goods_list}/>
                            </table>
                        </div>
                        <div className="toogle_box" id="pay_div" style={{display:'none'}}>
                            <p className="gds_info">
                                <span className="base-fl color">应付金额：</span>
                                <span className="base-fr color">{total_money}元</span>
                            </p>
                            <p className="gds_info">
                                <span className="base-fl color">实收金额：</span>
                                <span className="base-fr color">{real_money}元</span>
                            </p>
                        </div>
                        <div className="toogle_s" id="toogle_s" onClick={this.handlerToggle}>
                            <img src={require('card_downIconImg')} alt="" />
                        </div>
                    </div>

                    <div className="card_quan_wrap">
                        {cardItem}
                        {memberCardItem}
                    </div>
                    <SalesGoods a_data={sales_goods} f_infoCallBack={(s_alias,store_alias,shop_id)=>this.infoClick(s_alias,store_alias,shop_id)}/>
                </div>
             );
        }
    });
    //请求数据
    Com.getVerify({act:"Order_detail",op:"index",mod:'wap',guid:guid,guide_type:guide_type,b_box:1},function(res){
        console.log(res);
       if(res.code === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
           Com.toast(res.msg);
        }
    });


});
