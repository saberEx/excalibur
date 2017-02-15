let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { refund_id } = options;
        app.postVerify({ act: 'member_order', op: 'after_service_view', refund_id: refund_id }, (res) => {
            if (parseInt(res.code) === 0) {
                let {
                    add_time,
                    refund_type,
                    reason_info,
                    refund_amount = "",
                    pic_info = "",
                    seller_time,
                    seller_state,
                    admin_time,
                    return_type,
                    receive_time
                } = res.data;
                let a_agree = ["同意", "同意且选择弃货", "不同意"];
                let a_states = ["待商家确认", "待商家处理", "待系统退款", "已完成"];
                let s_curState = a_states[0];
                let s_agree = "";
                let e_pic = [];
                if (seller_time > 0) {
                    res.data["s_seller_time"] = app.getTimeFormat(seller_time, 2);
                    if (parseInt(seller_state) === 2) {
                        if (parseInt(return_type) === 1) {
                            s_curState = a_states[2];
                            s_agree = a_agree[1];
                        } else {
                            s_curState = a_states[1];
                            s_agree = a_agree[0];
                            if (receive_time > 0) {
                                s_curState = a_states[2];
                            }
                        }
                        if (admin_time > 0) {
                            res.data["s_admin_time"] = app.getTimeFormat(admin_time, 2);
                            s_curState = a_states[3];
                        }
                    } else if (parseInt(seller_state) === 3) {
                        s_agree = a_agree[2];
                        s_curState = a_states[4];
                    }
                }
                let a_pic_info = [];
                if (pic_info && pic_info.buyer) {
                    let Config = require('config0.js');
                    for (let i in pic_info.buyer) {
                        a_pic_info.push(Config.UPLOAD_PATH + "shop/refund/" + pic_info.buyer[i]);
                    }
                }
                res.data["s_curState"] = s_curState;
                res.data["s_agree"] = s_agree;
                res.data["s_refund_amount"] = parseFloat(refund_amount).toFixed(2);
                res.data["s_add_time"] = app.getTimeFormat(add_time, 2);
                res.data["reason_info"] = reason_info || "取消订单，全部退款";
                res.data["a_pic_info"] = a_pic_info;
                this.setData(res.data);
            } else {
                app.toast(res.msg);
            }
        });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})