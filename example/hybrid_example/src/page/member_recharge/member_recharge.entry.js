/*
* @Author: 卢旺
* @Date:   2016-12-03 16:31:58
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-06 15:07:49
*会员卡充值
*/
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("充值");
    require("member_rechargeCss");
    let cardCode = Com.getPageParams("card_code");
    let cardId = Com.getPageParams("card_id");
    let RechargeBtn = require('rechargeBtn');
    let LabelInput = require('labelInput');
    let Radio = require('radio');
    let curIndex = 0;//当前选择项
    let recharge_money = 0;//充值金额
    let give_money = 0;//赠送金额
    require('payment');
    //页面组件
    class PageEeee extends React.Component {
        constructor(props){
            super(props);
            this.state = {i_currentIndex:-2};
        }
        f_clickHandler(index){
            curIndex = index;
            this.setState({i_currentIndex:index});
            if (this.refs.money) {
                this.refs.money.setValue("");
            }
        }
        f_onChange(){
            if (this.refs.money) {
                if (this.refs.money.getValue() != 0){
                    if (this.refs.money.getValue().length > 5) {
                        this.refs.money.setValue(this.refs.money.getValue().substring(0,5));
                    }
                    this.setState({i_currentIndex:-1});
                }
                else{
                    this.setState({i_currentIndex:-2});
                }
            }
        }
        f_rechargeBtn(){
            if (this.state.i_currentIndex === -2)
                return;
            if (this.refs.money && this.refs.money.getValue() && this.state.i_currentIndex === -1) {
                //自定义充值
                recharge_money = this.refs.money.getValue();
                give_money = 0;
                if (!isNum(recharge_money)) {
                    return Com.toast("金额只能为整数");
                }
                recharge_money = parseInt(recharge_money);
                if(recharge_money === 0){
                    return Com.toast("金额必须大于0");
                }
                if (recharge_money > 99999) {
                    return Com.toast("金额太大啦");
                }
            }else{
                recharge_money = this.props.list[curIndex].recharge;
                give_money = this.props.list[curIndex].gift;
            }
            recharge(recharge_money,give_money);
        }
         render(){
            let {balance,list} = this.props;
            let {i_currentIndex} = this.state;
            let tips = i_currentIndex != -1 ? "tips" : "tips show";
            let rechargeBtn = i_currentIndex === -2 ? "base-mB10 rechargeBtn" : "base-mB10 rechargeBtn show";
            let isShow = this.props.list.length === 0 ? "base-hide" : "base-pd10";
            return (
                <div className="member_recharge">
                    <div className="myInt base-mB10">
                        <p className="newInt">当前余额</p>
                        <h3 className="intNum"><em>¥</em>{balance}</h3>
                    </div>
                    <div className="base-mT10"></div>
                    <RechargeBtn f_callBack={(index)=>this.f_clickHandler(index)} i_currentItem={i_currentIndex} a_controlItems={list} />
                    {/*
                    <div className="">
                        <LabelInput ref="money" s_left="自定义金额：" b_lenght={true} b_isInput={true} b_line={true} b_right={false} s_right="请输入金额" onChange={()=>this.f_onChange()} s_inputType="number"/>
                    </div>
                    <div className={tips}>*自定义充值暂不赠送金额</div>
                    */}
                    <div className={isShow}>
                        <div className={rechargeBtn} onClick={()=>this.f_rechargeBtn()}>
                            充值
                        </div>
                    </div>
                </div>
            )
         }
     }
     Com.getNormal({act:"member_wx_card",op:"index",card_code:cardCode},(res)=>{
        if(parseInt(res.code) === 0){
            let total_balance = res.data.total_balance;
            Com.getNormal({act:"member_wx_card",op:"recharge_info",card_id:cardId},(res)=>{
                if(parseInt(res.code) === 0){
                    let list = res.data.dis_details;
                    ReactDOM.render(<PageEeee balance={total_balance} list={list}/>,document.getElementById('pageCon'));
                }else{
                    Com.toast(res.msg);
                }
            },false);
        }else{
            Com.toast(res.msg);
        }
    },true,true);

    //充值生成订单
    function recharge(recharge,g_recharge){
        Com.getNormal({act:"member_wx_card",op:"recharge",card_code:cardCode,recharge:recharge,g_recharge:g_recharge},(res)=>{
            if(parseInt(res.code) === 0){
                payment.payTypeRequest(res.data.order_sn,4);
            }else{
                Com.toast(res.msg);
            }
        });
    }

    function isNum(s) {
        let regu = "^([0-9]*[.0-9])$"; // 小数测试
        let re = new RegExp(regu);
        if (s.search(re) != -1)
            return true;
        else
            return false;
    }
});
