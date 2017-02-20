'use strict';
import Com from './common';
import BoxPay from './boxPay';
import Component from './statistic_order_accredit.component';
import BaseManager from './baseManager';

const {ACTION_605} = Com;
export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"statistic_order_accredit");
        let _manager = this;
        //动作
        this.actions = {
            okHandler(self){
                return (dispatch, getState) => {
                    let order_id = self._orderId;
                    if(!self._password.value){
                        return Com.toast('请输入店长密码');
                    }
                    Com.postVerify({act:'order',op:'order_cancel',order_id:order_id,member_passwd:self._password.value},(res)=>{
                        let {code,data} = res;
                        console.log("取消订单",res);
                        if(code === 0){
                            let rowId = self._rowId;
                            let sectionID = self._sectionID;
                            if (data) {
                                let {amount,sign,tradeNo,outTradeNo,transactionId} = data;
                                let cancleData = {amount:amount.toString(),transactionId:transactionId.toString(),sign:sign,tradeNo:tradeNo,outTradeNo:outTradeNo};
                                BoxPay.cancle(cancleData,(res)=>{
                                    let {code,data} = res;
                                    if (code === 0) {
                                        dispatch({type:ACTION_605,order_id,rowId,sectionID});
                                        Com.toast("取消订单成功");
                                        Com.closeWin();
                                    }else{
                                        Com.toast("取消订单失败");
                                    }
                                });
                            }else{
                                dispatch({type:ACTION_605,order_id,rowId,sectionID});
                                Com.toast("取消订单成功");
                                Com.closeWin();
                            }
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            }
        };
    }
}
