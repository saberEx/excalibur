'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("会员中心");
    require("member_centerCss");
    let MemberItem=require("memberItem");
    let cardCode = Com.getPageParams("pageParam");
    let LabelInput=require("labelInput");
    //页面组件
    class PageEl extends React.Component {
        f_onlinePay(card_id,card_code){
            if (card_code && card_id) {
                Com.openWin("member_recharge",{card_id:card_id,card_code:card_code});
            }
        }
        f_mermber(card_id){
            if (card_id) {
                Com.openWin("member_cardDetail",{card_id:card_id});
            }
        }
        f_store(card_id){
            if (card_id) {
                Com.openWin("member_suit_shop",{card_id:card_id});
            }
        }
        f_erClick(card_code){
            if (card_code) {
                Com.openWin("member_scan_code",{card_code:card_code});
            }
        }
        f_balanceClick(card_code){
            if (card_code) {
                Com.openWin("member_balance",{card_code:card_code});
            }
        }
        render(){
            let {card_code,total_balance,store_name,qrcode,logo_url,card_alias_name,card_id,color} = this.props.data;
            return (
                <div className="member_cneter">
                    <MemberItem s_cardName={card_alias_name} f_erCodeBack={(card_code)=>this.f_erClick(card_code)} s_storeName={store_name} s_cardCode={card_code} i_balance={total_balance} s_qrcode={qrcode} s_background={color} s_icon={logo_url}/>
                    <div className="base-mT10"></div>
                    <LabelInput s_left="在线充值" onClick={()=>this.f_onlinePay(card_id,card_code)}  s_leftImg={require('icon_chonzhiImg')} b_isInput={false} b_after={true} b_line={true}  b_leftImg={true}/>
                    <LabelInput s_left="会员卡详情" onClick={()=>this.f_mermber(card_id)}  s_leftImg={require('icon_vipcardImg')} b_isInput={false} b_after={true} b_line={true}  b_leftImg={true}/>
                    <LabelInput s_left="适用门店"   onClick={()=>this.f_store(card_id)} s_leftImg={require('icon_storeImg')} b_isInput={false} b_after={true} b_line={true}  b_leftImg={true}/>
                    <LabelInput s_left="我的余额" onClick={()=>this.f_balanceClick(card_code)}  s_leftImg={require('icon_meonyImg')} b_isInput={false} b_after={true} b_line={true}  b_leftImg={true}/>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"member_wx_card",op:"index",card_code:cardCode},(res)=>{
        if(res.code === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
