/*
 * @Author: 黄权
 * @Date:   2016-12-07 14:11:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-08 10:19:10
 * 退款明细
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("退款明细");
    require("order_refundDetailsCss");
    let MediaItem = require('mediaItem');
    let LabelInput = require('labelInput');
    let refund_id = Com.getPageParams("refund_id");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        render(){
            let {add_time,refund_type,reason_info,refund_sn="",refund_amount="",contacts="",phone="",buyer_message="",pic_info="",
                seller_time,seller_state,admin_time,return_type,receive_time} = this.props.data;
            let a_agree = ["同意","同意且选择弃货","不同意"];
            let a_states = ["待商家确认","待商家处理","待系统退款","已完成"];
            let e_type = null;
            let s_curState = a_states[0];
            let s_agree = "";
            let e_pic = [];
            reason_info = reason_info || "取消订单，全部退款";
            if(pic_info && pic_info.buyer){
                for(let i in pic_info.buyer){
                    e_pic.push(<li key={i}>
                        <img src={Com.UPLOAD_PATH+"shop/refund/"+pic_info.buyer[i]}/>
                    </li>);
                }
            }
            e_type = <div>
                {contacts?<LabelInput s_left={"联系人："} s_right={contacts} b_right={true} b_line={true} />:null}
                {phone?<LabelInput s_left={"手机号："} s_right={phone} b_right={true} b_line={true} />:null}
                {e_pic.length>0?<div className="after_box_wrap">
                    <LabelInput s_left="图片凭证：" b_isInput={false}  b_line={true} />
                    <div className="upload_alum_img">
                        <ul>
                            {e_pic}
                        </ul>
                        <p>*如有退货请保留好物流运单，作为维权凭证</p>
                    </div>
                </div>:null}
            </div>;
            if(seller_time>0){
                if(parseInt(seller_state)===2){
                    if(parseInt(return_type)===1){
                        s_curState = a_states[2];
                        s_agree = a_agree[1];
                    }else {
                        s_curState = a_states[1];
                        s_agree = a_agree[0];
                        if(receive_time>0){
                            s_curState = a_states[2];
                        }
                    }
                    if(admin_time>0){
                        s_curState = a_states[3];
                    }
                }else if(parseInt(seller_state)===3){
                    s_agree = a_agree[2];
                    s_curState = a_states[4];
                }
            }

            return (
                <div className="order_refundDetails">
                    <section className="base-mB10">
                        <div className="store_num">
                            <MediaItem s_img={require('storeIconImg')} s_label="处理状态" s_right={s_curState} b_line={true}  />
                        </div>
                        <LabelInput s_left={"退款编号："} s_right={refund_sn} b_right={true} b_line={true} />
                        <LabelInput s_left={"申请时间："} s_right={Com.getTimeFormat(add_time,2)} b_right={true} b_line={true} />
                        <LabelInput s_left={"处理方式："} s_right={"退款"} b_right={true} b_line={true} />
                        <LabelInput s_left={"退款金额："} s_right={refund_amount} b_right={true} b_line={true} />
                        <LabelInput s_left={"退款原因："} s_right={reason_info} b_right={true} b_line={true} />
                        {buyer_message?<LabelInput s_left={"退款说明："} s_right={buyer_message} b_right={true} b_line={true} />:null}
                        {e_type}
                    </section>
                    <section>
                        <div className="store_info">
                            <MediaItem s_label="操作记录" b_line={true}  />
                        </div>
                        <div className="refund_list">
                            <p>{Com.getTimeFormat(add_time,2)} 您提交退款申请</p>
                            {seller_time>0?<p>{Com.getTimeFormat(seller_time,2)} 商家审核，审核结果：{s_agree}</p>:null}
                            {/*<p>您已将商品退回：</p>*/}
                            {receive_time>0?<p>卖家确认收到商品,待平台审核中</p>:null}
                            {admin_time>0?<p>{Com.getTimeFormat(admin_time,2)}系统退款,售后完成</p>:null}
                        </div>
                    </section>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:'member_order',op:'after_service_view',refund_id:refund_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});