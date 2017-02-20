'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    //微信sdk  分享等功能
    // var wx_share = require('wxShare');
    let WxShare = require('wxShare');
    TopBar.create("卡券列表");
    let VoucheItem = require('voucheItem');
    require("vouche_listCss");
    //从公众号菜单栏进入，显示所有该公众号放出的卡券，有card_id或member_card_id时，只显示当前id的卡券
    let card_id = Com.getPageParams("card_id");
    let member_card_id = Com.getPageParams("member_card_id");
    let Scroll = require('scroll');
    let scroll_h = document.body.offsetHeight;

    let NotData = require('notData');
    //页面组件
    class PageEl extends React.Component{
        itemHandleClick(o_param){
            let _this=this;
            Com.getNormal({act:"card_view",op:'get_card_api',mod:'wap',b_box:1,wechat_card_id:o_param.wechat_card_id,store_id:o_param.store_id},function(res){
                if(parseInt(res.code) === 0){
                    if (res.data) {
                        let {card_id,timestamp,nonce_str,cardSign,outer_str} = res.data;
                        wx.addCard({
                            cardList: [{
                                cardId: card_id,
                                cardExt: JSON.stringify({timestamp:timestamp,nonce_str:nonce_str,signature:cardSign,outer_str:outer_str})
                            }], // 需要添加的卡券列表
                            success: function (res) {}
                        });
                    }else{
                        Com.toast("请求数据失败，请重试尝试");
                    }
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let list = null;
            if (this.props.data) {
                if (this.props.data.length === 0) {
                    list = <NotData></NotData>
                }else{
                    list = this.props.data.map((item,key)=>{
                        var data = {};
                        var o_param = {};
                        var card_infos = JSON.parse(item.card_info);
                        var cardtype = item.card_type;
                        data.card_name = item.card_alias_name;     // 会员卡或优惠券名称
                        data.logo_url = Com.XBOX_UPLOAD_PATH + item.logo_url;//logo
                        data.store_name = item.store_name;         // 门店名称
                        o_param.wechat_card_id=item.wechat_card_id; //卡券ID
                        o_param.store_id=item.store_id;            //门店ID
                        let date_info = null;
                        let type = '';
                        if(cardtype== 'MEMBER_CARD'){
                            if(card_infos && card_infos.card && card_infos.card.member_card && card_infos.card.member_card.base_info){
                                date_info = card_infos.card.member_card.base_info.date_info;
                            }
                        }else{
                            if(card_infos && card_infos.card && card_infos.card.cash && card_infos.card.cash.base_info){
                                date_info = card_infos.card.cash.base_info.date_info;
                            }
                        }
                        if(date_info){
                            type = date_info.type;
                            switch(type){
                                case "DATE_TYPE_FIX_TIME_RANGE":
                                    data.end_time = date_info.end_timestamp;
                                break;
                                case "DATE_TYPE_PERMANENT":
                                    data.start_time = '';
                                break;
                            }
                        }
                        return <VoucheItem key={key} data={data} callBack={()=>this.itemHandleClick(o_param)}/>;
                    });
                }
            };
            return (
                <div className="vouche_list">
                    <Scroll style={{height:scroll_h}}>
                        {list}
                    </Scroll>
                </div>
            );
        }
    };

    //请求数据
    Com.getNormal({act:"card_view",op:"index",mod:'wap',card_id:card_id,member_card_id:member_card_id,b_box:1},function(res){
        if(res.code === 0){
            let shareParams = {
                baseURL : window.location.href,
                title : "卡券列表",
                desc : "点击进入领取优惠券和会员卡",
                imgUrl : Com.XBOX_UPLOAD_PATH + res.data[0].store_logo
            };
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl  data={res.data}/>,document.getElementById('pageCon'));
            //分享功能
            // wx_share.init(shareParams);
        }else{
            Com.toast(res.msg);
        }
    });
});
