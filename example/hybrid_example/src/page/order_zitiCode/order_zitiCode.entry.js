'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("自提码情况");
    require("order_zitiCodeCss");
    var order_id = Com.getPageParams("order_id");
    //页面组件
    class PageEl extends React.Component {
        render(){
            var o_data = this.props.o_data;
            return (
                <div className="order_zitiCode">
                    <h4 className="title">自提二维码</h4>
                    <div className="code-con">
                        <img src={o_data.self_delivery_qrcode} />
                    </div>
                    <p className="info">
                        请对准自提验证盒子进行扫描!
                    </p>
                    <h4>自提码</h4>
                    <div className="code-number">{o_data.dlyo_pickup_code}</div>
                </div>
             );
        }
    };
    //请求数据
    Com.getVerify({act:"member_order",op:"takeDeliveryOfGoods",order_id:order_id},(res)=>{
        console.log(res);
        if(res.code === 0){
            ReactDOM.render(<PageEl o_data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
