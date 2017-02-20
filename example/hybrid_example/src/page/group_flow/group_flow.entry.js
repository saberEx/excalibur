'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("拼团流程");
    require("group_flowCss");
    //页面组件
    var PageEl = React.createClass({
        render:function(){
            return (
                <div className="group_flow">
                    <h2>拼团流程<span>（若人数不足将自动退款）</span></h2>
                    <img src={require('pt_lccImg')} alt=""/>
                    <p><span>开团：</span>选择心仪商品支付开团并邀请好友参团；</p>

                    <p><span>参团：</span>进入朋友分享的页面，点击“立即参团”按钮，付款后即参团成功；</p>

                    <p><span>拼团成功：</span>开团或参团成功后，在指定时间内达到指定人数，则拼团成功。<br/>
                             系统将生产订单，由商家安排发货。您可在“我的拼团”内<br/>
                             查看订单发货进度；</p>

                    <p><span>拼团失败：</span>在指定时间内未达指定人数，则拼团失败，将退还支付款项；</p>

                    <p><span>退款：</span>拼团退款将在1-12个工作日原路返回到您的支付账户里面，具体到账以微信/银行卡为准，请注意查收。</p>

                    <p><span>创建订单失败：</span>拼团商品数量有限，先成团先得。商品被抢光后，将无法再创建发货订单或开/参团。所以成团要趁早喔~</p>
                </div>
             );
        }
    });
    ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
});
