'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("会员卡列表");
    require("member_listCss");
    let NotData = require('notData');
    let MemberItem = require('memberItem');
    let Scroll = require('scroll');
    let scroll_h = document.body.offsetHeight;
    //页面组件
    class PageEl extends React.Component {
        f_itemClick(card_code){
            Com.openWin("member_center",{pageParam:card_code});
        }
        f_erClick(card_code){
            Com.openWin("member_scan_code",{card_code:card_code});
        }
        render(){
            let {datas} = this.props;
            let items = null;
            if (datas.length === 0) {
                items = <NotData/>;
            }else{
                items = datas.map((item,index)=>{
                    return <MemberItem key={index} f_erCodeBack={(card_code)=>this.f_erClick(card_code)} f_callBack={(card_code)=>this.f_itemClick(card_code)} s_cardName={item.card_alias_name} s_storeName={item.store_name} s_cardCode={item.card_code} i_balance={item.balance} s_qrcode={item.qrcode} s_background={item.color} s_icon={item.logo_url}/>;
                });
            }
            return (
                <div className="member_list">
                    <Scroll style={{height:scroll_h}}>
                        {items}
                    </Scroll>
                </div>
             );
        }
    };
    //请求数据
    Com.getVerify({act:"member_wx_card",op:"list"},(res)=>{
        if(res.code === 0){
            ReactDOM.render(<PageEl datas={res.data.list}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
