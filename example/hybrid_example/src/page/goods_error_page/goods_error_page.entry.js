'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("宝贝不见了");
    require("goods_error_pageCss");
    let GoodsList = require("goods_list");
    let Scroll = require('scroll');
    let _h = document.body.offsetHeight;
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        render(){
            let {commendGoodList,wechat} = this.props.data;
            let qrcode,tips,wx_account,hide;
            if (parseInt(wechat.subscription) === 0) {
                tips = '(关注微信号，可以随时来逛)';
                wx_account = wechat.account;
                qrcode = wechat.qrcode;
            } else {
                tips = '微信扫一扫或长按识别进入店铺';
                qrcode = wechat.qrcode_store;
            }
            if (commendGoodList.length === 0) {
                hide = 'base-hide';
            }
            return (
                <div className="goods_error_page">
                    <div className="box">
                        <div className="box_Line">
                            <div className="g_left">
                                <img src={qrcode} alt="" />
                            </div>
                            <div className="g_right">
                                <h2>这个宝贝已经不见了</h2>
                                <p>看看我们最新的商品吧</p>
                                <p>{tips}</p>
                                <p>{wx_account}</p>
                                <p onClick={()=>Com.openWin('index')}><span>去逛逛</span></p>
                            </div>
                        </div>
                    </div>
                    <div className={hide}>
                        <label className="titleLabel">本店优选</label>
                        <Scroll style={{height:_h}}>
                            <GoodsList data={{goods_list:commendGoodList,goods_style:1,block_style:0}}/>
                        </Scroll>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"normal_index",op:"storeInfo"},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
