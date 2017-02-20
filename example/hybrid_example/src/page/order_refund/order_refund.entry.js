/*
 * @Author: 黄权
 * @Date:   2016-12-07 15:10:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-07 16:22:10
 * 退款申请提交页
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("退款申请");
    require("order_refundCss");
    let LabelInput = require('labelInput');
    let BlockFixedBtn = require('blockFixedBtn');
    let order_id = Com.getPageParams("order_id");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        submit(){
            let s_info = this.refs.info.getValue();
            if(!s_info){
                return Com.toast("退款说明不能为空");
            }
            Com.postVerify({act:'member_order',op:'order_refund_all_commit',order_id:order_id,buyer_message:s_info},(res)=>{
                if(parseInt(res.code)===0){
                    Com.closeWin();
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {add_time,payment_name,order_amount,order_sn,extend_order_goods} = this.props.data;
            payment_name = payment_name || "默认支付";
            let a_goodsName = [];
            if(extend_order_goods && extend_order_goods.length>0){
                extend_order_goods.forEach((item)=>{
                    a_goodsName.push(item.goods_name);
                });
            }
            let s_amount = `￥${order_amount>0?parseFloat(order_amount).toFixed(2):"0.00"}`;
            return (
                <div className="order_refund">
                    <LabelInput s_left="商品名称：" s_right={`${a_goodsName.join(",")}`} b_right={true} b_line={true}/>
                    <LabelInput s_left="订单金额：" s_right={`${s_amount}`} b_right={true} b_line={true}/>
                    <LabelInput s_left="订单编号：" s_right={`${order_sn}`} b_right={true} b_line={true}/>
                    <LabelInput s_left="下单时间：" s_right={`${Com.getTimeFormat(add_time,2)}`} b_right={true} b_line={true}/>
                    <LabelInput s_left="支付方式：" s_right={`${payment_name}`} b_right={true} />
                    <div className="base-mT10 apply_price">
                        <LabelInput s_left="退款金额：" s_right={`${s_amount}`} b_right={true} b_line={true}/>
                    </div>
                    <div className="apply_cause">
                        <LabelInput s_left="退款原因：" s_right="取消订单，全部退款" b_right={true} b_line={true}/>
                    </div>
                    <div className="apply_cause">
                        <LabelInput ref="info" s_left="退款说明：" s_right="请输入退款说明" b_isInput={true}/>
                    </div>
                    <BlockFixedBtn s_label={"申请退款"} onClick={()=>this.submit()}/>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:'member_order',op:'order_refund_all_view',order_id:order_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data.order}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});