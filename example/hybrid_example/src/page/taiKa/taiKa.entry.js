'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("台卡");
    require("taiKaCss");
    let LabelInput = require("labelInput");
    let BlockBtn = require("blockBtn");
    // require('payment');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        onClick(){
            console.log(11);
            //payment.payTypeRequest(res.data.pay_sn,1);//微信支付
        }
        render(){
            return (
                <div className="taiKa">
                    <LabelInput s_left="金额：" b_line={true} b_isInput={true} b_right={true}/>
                    <BlockBtn  s_label="提交" onClick={()=>this.onClick()}/>  
                </div>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"taiKa",op:"taiKa"},function(res){
    //     if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});