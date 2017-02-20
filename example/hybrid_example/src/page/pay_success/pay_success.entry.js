'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    require('pay_successCss');
    let NotData = require("notData");
    let totalPrice = Com.getPageParams("totalPrice");
    let card_code = Com.getPageParams("card_code");
    let tips = card_code ? "充值成功" : "支付成功";
    let btn = card_code ? "查看余额" : "查看订单";

    TopBar.create(tips);
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        componentDidMount(){
            document.title = tips;
        }
        handlerClick(){
            if (card_code) {//会员卡充值
                Com.openWin("member_balance",{card_code:card_code});
            }else{
                Com.openWin("order_list",{orderState:2});
            }
        }
        render(){
            return (
                <div className="pay_success">
                    <img src={require("successImg")} alt=""/>
                    <p>{tips+totalPrice}元</p>
                    <div className="pay_div">
                        <a className="base-btn" onClick={()=>Com.openWin("index")}>去逛逛</a>
                        <p onClick={()=>this.handlerClick()}><span>{btn}</span></p>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"pay_success",op:"pay_success"},function(res){
    //     if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});
