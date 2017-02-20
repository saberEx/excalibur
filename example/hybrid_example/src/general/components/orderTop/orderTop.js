/*
* @Author: 卢旺
* @Date:   2016-08-18 09:28:01
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-20 16:45:25
* 订单详情顶部
*/
'use strict';
require("orderTopCss");
var classSet = require('classnames');
let CallEl = require('callEl');
// let CountTime = require('countTime');
let AddRess = require('address');

class OrderTop extends React.Component{
    constructor(props){
        super(props);
        let _self = this;
        // CountTime.countdown(_self.props.s_validity,"nopay","","",function(e){
        //     clearInterval(e);
        // },true);
    }
    static propTypes = {
        i_status:React.PropTypes.number,//物流状态 0未发货，1发货中 2已签收 3自提待备货 4自提待自提
        delivery_name:React.PropTypes.string,//物流方式名称
        delivery_type:React.PropTypes.string,//物流方式代码 0物流1店员2自提
        i_order_status:React.PropTypes.number,//订单状态 0已取消，10未付款 20已付款 30已发货 40已收货
        s_validity:React.PropTypes.string,//订单剩余时间
        o_data:React.PropTypes.object,//地址
        person_name:React.PropTypes.string,//配送员姓名
        person_phone:React.PropTypes.string,//配送员电话
        s_time:React.PropTypes.string,//配送/要求自提时间
        pickup_code:React.PropTypes.string,//自提码
        s_erCode:React.PropTypes.string,//自提二维码
        reciver_name:React.PropTypes.string,//收货人姓名
        reciver_tel:React.PropTypes.string,//收货人电话
        refund_state:React.PropTypes.number,//售后状态
    }
    render(){
        let {reciver_tel,reciver_name,o_data,i_status,delivery_name,s_time,s_erCode,pickup_code,delivery_type,person_phone,person_name,i_order_status,refund_state} = this.props;
        let orderStatus = "";
        let d_item = <p><span>物流方式：</span><span>{delivery_name}</span></p>;
        let statusImg = null;//显示订单状态图标
        let address = <AddRess data={o_data} b_address={true} b_right={false}/>;
        let ztItem = <div className="order_user_info">
                        <p>
                            <span className="base-fl">收货人：{reciver_name}</span>
                            <span className="base-fr">{reciver_tel}</span>
                        </p>
                        <p>自提时间:{s_time}<span className="time_status"></span></p>{/*(超时)*/}
                     </div>;
        if (i_status === 1) {
            if (delivery_type == "1") {//店员配送
                address = <div>
                            <div className="clerk_box">
                                <p>
                                   <span>配送员：{person_name}</span>
                                </p>
                                <p>
                                   <span>配送时间：{s_time}</span>
                                </p>

                                    <CallEl mobile={person_phone}>
                                        <img src={require("tel_iconImg")} alt="" />
                                    </CallEl>

                            </div>
                            <AddRess data={o_data} b_address={true} b_right={false}/>
                            </div>;
            }
        }else if(i_status === 2){
            if (delivery_type == "2") {//自提已签收
                address = ztItem;
            }else{
                address = <AddRess data={o_data} b_address={true} b_right={false}/>;
            }
        }else if(i_status === 3){//自提待备货
            address = ztItem;
        }else if(i_status === 4){//自提待自提
           address = <div>
                     <div className="custom_box" >
                        <span className="base-fl">自提号：<em>{pickup_code}</em></span>
                        <span className="base-fr">
                            <img src={s_erCode} alt="" />
                        </span>
                     </div>
                     <div className="order_user_info">
                        <p>
                            <span className="base-fl">收货人：{reciver_name}</span>
                            <span className="base-fr">{reciver_tel}</span>
                        </p>
                        <p>自提时间:{s_time}<span className="time_status"></span></p>{/*(超时)*/}
                     </div>
                     </div>;
        }

        if (i_order_status === 0) {
            orderStatus = "已取消";
            statusImg = require("order_status_07Img");
        }else if(i_order_status === 10){
            orderStatus = "待付款";
            statusImg = require("order_status_03Img");
            d_item = <p><span>请尽快完成支付，超时系统将自动取消</span><span id="nopay"></span></p>;
        }else if(i_order_status === 20){
            orderStatus = "已支付";
            statusImg = require("order_status_02Img");
        }else if(i_order_status === 30){
            orderStatus = "已发货";
            statusImg = require("order_status_05Img");
        }else if(i_order_status === 40){
            orderStatus = "已收货";
            statusImg = require("order_status_06Img");
        }
        if (refund_state === 0) {
            orderStatus = "待商家确认";
            statusImg = require("order_status_10Img");
        }else if(refund_state === 1){
           orderStatus = "待系统退款";
           statusImg = require("order_status_09Img");
        }else if(refund_state === 2){
            orderStatus = "待商家处理";
            statusImg = require("order_status_12Img");
        }else if(refund_state === 3){
            orderStatus = "售后已完成";
            statusImg = require("order_status_11Img");
        }

        return (
                <div className="order_wrap notop">
                    <div className="order_status_info">
                        <p className="status"><span>订单状态：</span><span>{orderStatus}</span></p>
                        {d_item}
                        <img src={statusImg} alt="" />
                    </div>
                    {address}
                </div>
        )
    }
}
module.exports = OrderTop;
