/*
 * @Author: 黄权
 * @Date:   2016-12-08 15:22:26
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-14 16:53:09
 * 退货申请提交页
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("申请售后");
    require("order_refundGoodsCss");
    let LabelInput =require("labelInput");
    let order_id =Com.getPageParams("order_id");
    let files_plusImg =require("files_plusImg");
    let BlockFixedBtn = require('blockFixedBtn');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_pic:[]};
        }
        //选择退款原因
        f_select(value){
            let {refund_reason} = this.props.data;
            if(refund_reason[value]){
                this._reason_id = refund_reason[value].reason_id;
                this.refs.reason.setValue(refund_reason[value].reason_info);
            }
        }
        //上传图片
        f_upload(ev,index){
            let form = new FormData();
            form.append('post_pic', ev.target.files[0]);
            let a_pic = this.state.a_pic;
            Com.sendFile({act:'member_upload',op:'index',type:2,pic:'imageInput','post_pic':ev.target.files[0]},(res)=>{
                if(parseInt(res.code) === 0) {
                    var s_image = res.data.file_name;
                    a_pic[index] = s_image;
                    this.setState({a_pic:a_pic});
                }else{
                    Com.toast(res.msg);
                }
            })
        }
        //提交
        f_submit(){
            let i_reason = this._reason_id;
            let s_contact = this.refs.contact.getValue();
            let s_phone = this.refs.phone.getValue();
            let s_buyer_message = this.refs.buyer_message.getValue();
            if(!i_reason){
                return Com.toast("请选择退款原因");
            }
            if(!s_contact){
                return Com.toast("请填写联系人");
            }
            if(!s_phone){
                return Com.toast("请填写手机号码");
            }else {
                if(!Com.checkMobile(s_phone)){
                    return Com.toast("请填写11位的手机号码");
                }
            }
            if(!s_buyer_message){
                return Com.toast("请填写退款说明");
            }
            let {a_pic} = this.state;
            let a_img = [];
            if(a_pic.length>0){
                a_pic.map((item)=>{
                    if(item){
                        a_img.push(item);
                    }
                });
            }
            Com.postVerify({act:'member_order',op:'do_add_after_service',refund_amount:this.props.data.order.order_amount,reason_id:i_reason,
                phone:s_phone,contacts:s_contact, refund_type:"1",buyer_message:s_buyer_message,post_pic:a_pic.join(","),order_id:order_id},(res)=>{
                if(parseInt(res.code)===0){
                    Com.toast("申请售后成功",()=>{
                        Com.closeWin();
                    },3,1);
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {order,refund_reason} = this.props.data;
            let {a_pic} = this.state;
            refund_reason = refund_reason || {};
            let {add_time,extend_order_goods,order_amount,order_sn} = order;
            let a_goodsName = [];
            if(extend_order_goods && extend_order_goods.length>0){
                extend_order_goods.forEach((item)=>{
                    a_goodsName.push(item.goods_name);
                });
            }
            let s_amount = `￥${order_amount>0?parseFloat(order_amount).toFixed(2):"0.00"}`;
            let a_option = [];
            for(let i in refund_reason){
                if(refund_reason.hasOwnProperty(i)){
                    let {reason_info} = refund_reason[i];
                    a_option.push(<option key={i} value={`${i}`}>{reason_info}</option>);
                }
            }
            return (
                <div className="order_refundGoods">
                    <div className="after_box_wrap">
                        <LabelInput s_left="商品名称：" s_right={`${a_goodsName.join(",")}`}  b_line={true} b_right={true}/>
                        <LabelInput s_left="订单金额：" s_right={`${s_amount}`} b_line={true} b_right={true}/>
                        <LabelInput s_left="订单编号" s_right={`${order_sn}`}  b_line={true} b_right={true}/>
                        <LabelInput s_left="下单时间：" s_right={`${Com.getTimeFormat(add_time,2)}`} b_line={false} b_right={true}/>
                    </div>
                    <div className="after_box_wrap">
                        <div className="apply_price">
                            <LabelInput s_left="退款金额：" s_right={`${s_amount}`} b_line={true} b_right={true}/>
                        </div>
                        <div className="apply_cause">
                            <LabelInput ref="reason" s_left="退款原因：" s_right="请选择退款原因"  b_right={true}  b_line={true} b_after={true}/>
                            <div className="dropdown_list" onClick={(ev)=>ev.stopPropagation()}>
                                <select name="drop" onChange={(ev)=>this.f_select(ev.target.value)}>
                                    <option value="" className="base-hide"></option>
                                    {a_option}
                                </select>
                            </div>
                        </div>



                        <div className="apply_cause">
                            <LabelInput ref="contact" s_left="联系人：" s_right="请输入联系人" b_isInput={true}  b_line={true} b_right={true}/>
                        </div>
                        <div className="apply_cause">
                            <LabelInput ref="phone" s_left="手机：" s_right="请输入11位手机号码" s_inputType="number" b_isInput={true}  b_line={true} b_right={true}/>
                        </div>
                        <div className="apply_cause">
                            <LabelInput ref="buyer_message" s_left="退款说明：" s_right="请输入退款说明" b_isInput={true}   b_right={true}/>
                        </div>
                    </div>

                    <div className="after_box_wrap">
                        <div>
                            <LabelInput s_left="上传凭证：" s_right="可上传3张图片" b_isInput={false}  b_line={true} b_right={true}/>
                        </div>
                        <div className="upload_alum_img">
                            <ul>
                                <li>
                                    <img src={a_pic[0]?`${Com.UPLOAD_PATH}shop/refund/${a_pic[0]}`:files_plusImg} onError={(ev)=>ev.target.src=files_plusImg}/>
                                    <input type="file" accept="image/*" onChange={(ev)=>this.f_upload(ev,0)}/>
                                </li>
                                <li>
                                    <img src={a_pic[1]?`${Com.UPLOAD_PATH}shop/refund/${a_pic[1]}`:files_plusImg}  onError={(ev)=>ev.target.src=files_plusImg}/>
                                    <input type="file" accept="image/*" onChange={(ev)=>this.f_upload(ev,1)}/>
                                </li>
                                <li>
                                    <img src={a_pic[2]?`${Com.UPLOAD_PATH}shop/refund/${a_pic[2]}`:files_plusImg}  onError={(ev)=>ev.target.src=files_plusImg}/>
                                    <input type="file"  accept="image/*" onChange={(ev)=>this.f_upload(ev,2)}/>
                                </li>
                            </ul>
                            <p>*如有退货请保留好物流运单，作为维权凭证</p>
                        </div>
                    </div>
                    <BlockFixedBtn s_label={"提交"} onClick={()=>this.f_submit()}/>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:'member_order',op:'add_after_service',order_id:order_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });

});
