let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { orderId } = options;
        let lat = ""; //到时取首页定位存起来经纬度
        let lon = "";
        this.setData({ _orderId: orderId, _lat: lat, _lon: lon });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        let { _orderId, _lat, _lon } = this.data;
        let o_bottom = { l_id: -1, r_id: -1, l_label: "", r_label: "" };
        app.postVerify({ act: "member_order", op: "order_info", order_id: _orderId, pos_x: _lat, pos_y: _lon, shop_id: "228749299" }, (res) => {
            if (parseInt(res.code) === 0) {
                let { order_state, shop_id, extend_order_common, extend_order_goods, goods_amount, add_time, after_service, refund, evaluation_state, geval_explain, payment_time, finnshed_time, shop_info } = res.data;
                res.data.goods_amount = parseFloat(goods_amount).toFixed(2);
                res.data.s_add_time = app.getTimeFormat(add_time, 2);
                let s_orderState = "";
                let s_orderStateImg = "";
                let o_address = {};
                let s_payment_time = payment_time ? app.getTimeFormat(payment_time, 2) : "";
                let s_finnshed_time = finnshed_time > 0 ? app.getTimeFormat(finnshed_time, 2) : "";
                switch (parseInt(order_state)) {
                    case 0:
                        s_orderState = "已取消";
                        s_orderStateImg = "order_status_07.png";
                        break;
                    case 10:
                        s_orderState = "待付款";
                        o_bottom = { l_id: 1, r_id: 2, l_label: "取消订单", r_label: "付款" };
                        s_orderStateImg = "order_status_03.png";
                        break;
                    case 20:
                        s_orderState = "已支付";
                        o_bottom = { l_id: 3, r_id: -1, l_label: "取消并退款", r_label: "" };
                        s_orderStateImg = "order_status_02.png";
                        break;
                    case 30:
                        s_orderState = "已发货";
                        if (after_service) {
                            o_bottom = { l_id: 4, r_id: 5, l_label: "申请售后", r_label: "确认收货" };
                        } else {
                            o_bottom = { l_id: -1, r_id: 5, l_label: "", r_label: "确认收货" };
                        }
                        s_orderStateImg = "order_status_05.png";
                        break;
                    case 40:
                        s_orderState = "已收货";
                        if (parseInt(evaluation_state) === 0) { //未评论
                            if (after_service) {
                                o_bottom = { l_id: 4, r_id: 6, l_label: "申请售后", r_label: "评价订单" };
                            } else {
                                o_bottom = { l_id: -1, r_id: 6, l_label: "", r_label: "评价订单" };
                            }
                        } else if (geval_explain) { //已有评价
                            if (after_service) {
                                o_bottom = { l_id: 4, r_id: 7, l_label: "申请售后", r_label: "评价回复" };
                            } else {
                                o_bottom = { l_id: -1, r_id: 7, l_label: "", r_label: "评价回复" };
                            }
                        } else {
                            if (after_service) {
                                o_bottom = { l_id: 4, r_id: -1, l_label: "申请售后", r_label: "" };
                            } else {
                                o_bottom = { l_id: -1, r_id: -1, l_label: "", r_label: "" };
                            }
                        }
                        s_orderStateImg = "order_status_06.png";
                        break;
                }
                //若申请过退款售后
                if (refund && refund.length != 0) {
                    o_bottom = { l_id: 8, r_id: -1, l_label: "查看进度", r_label: "" };
                    let refund_state = null;
                    if (parseInt(refund.seller_time) == 0) {
                        refund_state = 0; //"待商家确认"
                    } else {
                        if (parseInt(refund.seller_state) == 2) {
                            if (parseInt(refund.refund_type) == 1) {
                                if (parseInt(refund.admin_time) == 0) {
                                    refund_state = 1; //"待系统退款"
                                } else {
                                    refund_state = 3; //"已完成";
                                }
                            } else {
                                if (parseInt(refund.return_type) == 1) {
                                    if (parseInt(refund.admin_time) == 0) {
                                        refund_state = 1; //"待系统退款"
                                    } else {
                                        refund_state = 3; //"已完成"
                                    }
                                } else {
                                    if (parseInt(refund.receive_time) == 0) {
                                        refund_state = 2; //"待商家处理"
                                    } else {
                                        if (parseInt(refund.admin_time) == 0) {
                                            refund_state = 1; //"待系统退款"
                                        } else {
                                            refund_state = 3; //"已完成"
                                        }
                                    }
                                }
                            }
                        } else {
                            refund_state = 3; //"已完成"
                        }
                        if (refund.admin_time && parseInt(refund.admin_time) != 0) {
                            refund_state = 3; //"已完成"
                        }
                    }
                    if (refund_state === 0) {
                        s_orderState = "待商家确认";
                        s_orderStateImg = "order_status_10.png";
                    } else if (refund_state === 1) {
                        s_orderState = "待系统退款";
                        s_orderStateImg = "order_status_09.png";
                    } else if (refund_state === 2) {
                        s_orderState = "待商家处理";
                        s_orderStateImg = "order_status_12.png";
                    } else if (refund_state === 3) {
                        s_orderState = "售后已完成";
                        s_orderStateImg = "order_status_11.png";
                    }
                }
                let delivery_type = 0;
                let i_state, claim_time; //物流状态，店员配送/提货时间
                if (extend_order_common) {
                    let { reciver_name, reciver_phone, reciver_address, delivery_type, shipping_time_claim, delivery_state, shipping_time } = extend_order_common;
                    o_address = { true_name: reciver_name, mob_phone: reciver_phone, area_info: "", address: reciver_address };
                    delivery_type = parseInt(delivery_type) || 0;
                    if (delivery_type == 2) { //自提
                        claim_time = shipping_time_claim;
                        claim_time = claim_time != 0 ? claim_time : "";
                        if (delivery_state == 0) { //自提待备货
                            i_state = 3;
                        } else if (delivery_state == 1) { //自提待自提
                            i_state = 4;
                        } else if (delivery_state == 2) { //自提已签收
                            i_state = 2;
                        }
                    } else { //物流店员配送
                        if (delivery_state == 0) { //未发货
                            i_state = 0;
                        } else if (delivery_state == 1) { //发货中
                            i_state = 1;
                            claim_time = shipping_time;
                        } else if (delivery_state == 2) { //已签收
                            i_state = 2;
                        }
                    }
                }
                if (extend_order_goods.length > 0) {
                    for (let i = 0, len = extend_order_goods.length; i < len; i++) {
                        extend_order_goods[i].goods_image = app.getGoodsImg(extend_order_goods[i].goods_image);
                    }
                }
                if (shop_info) {
                    let { distance } = shop_info;
                    if (distance) {
                        if (distance > 1000) {
                            shop_info.distance = parseFloat(distance / 1000).toFixed(2) + "公里";
                        } else {
                            shop_info.distance = distance + "米";
                        }
                    } else {
                        shop_info.distance = "无法定位您当前位置";
                    }
                }
                this.setData({
                    b_hasLoad: true,
                    data: res.data,
                    s_orderState: s_orderState,
                    s_orderStateImg: s_orderStateImg,
                    shop_id: shop_id,
                    o_address: o_address,
                    delivery_type: delivery_type,
                    o_bottom: o_bottom,
                    i_state: i_state,
                    claim_time: claim_time,
                    s_payment_time: s_payment_time,
                    s_finnshed_time: s_finnshed_time
                });
            } else {
                app.toast(res.msg);
            }
            app.addEvt(app.MEDIA_ITEM, (data) => {
                if (data.id === "shopMap") {
                    let { shop_map_x, shop_map_y, shop_address } = this.data.data.shop_info;
                    app.openMap({ lat: shop_map_x, lon: shop_map_y, name: this.data.shop_name, address: shop_address }, (res) => {

                    });
                }
            });
            app.addEvt(app.APPOSE_FIXED_BTN, (data) => {
                console.log(data);
                let id = parseInt(data.id) || -1;
                let { order_state, order_id, shop_id, refund, after_service, extend_order_common, pay_sn, extend_order_goods, order_amount } = this.data.data;
                switch (id) {
                    case 1: //取消订单
                        app.confirm("取消订单", "您确定要取消该订单吗？", () => {
                            app.postVerify({ act: 'member_order', op: 'order_cancel', order_id: order_id }, (res) => {
                                if (parseInt(res.code) === 0) {
                                    //刷新页面
                                    this.onHide();
                                    this.onShow();
                                } else {
                                    app.toast(ret.msg);
                                }
                            })
                        });
                        break;
                    case 2: //付款
                        if (pay_sn != 0) {
                            let param = { 'act': 'member_pay', 'op': 'pay_wx', 'pay_sn': pay_sn, 'order_sn': 0 };
                            app.postVerify(param, (ret) => {
                                if (parseInt(ret.code) === 0) {
                                    let packageStr = ret.data['package'];
                                    let { timeStamp, nonceStr, signType, paySign } = ret.data;
                                    wx.requestPayment({
                                        'timeStamp': timeStamp,
                                        'nonceStr': nonceStr,
                                        'package': packageStr,
                                        'signType': signType,
                                        'paySign': paySign,
                                        'success': function(res) {
                                            app.openWin("pay_success", { totalPrice: order_amount });
                                        },
                                        'fail': function(res) {
                                            if (res.errMsg == "get_brand_wcpay_request:cancel") {

                                            } else {
                                                app.toast("支付失败");
                                            }
                                        }
                                    })
                                } else if (parseInt(ret.code) === 500) {

                                } else {
                                    app.toast(ret.msg);
                                }
                            });
                        } else {
                            app.toast("支付失败");
                        }
                        break;
                    case 3: //取消并退款
                        app.openWin("apply_service", { order_id: order_id, type: 1 });
                        break;
                    case 4: //申请售后
                        if (after_service) {
                            app.openWin("apply_service", { order_id: order_id, type: 2 });
                        } else {
                            app.toast("已经申请过售后，不能重复申请");
                        }
                        break;
                    case 5: //确认收货
                        app.confirm("确认收货", "是否确认收货？", () => {
                            app.postVerify({ act: 'member_order', op: 'order_receive', order_id: order_id }, (ret) => {
                                if (parseInt(ret.code) === 0) {
                                    this.onHide();
                                    this.onShow();
                                } else {
                                    app.toast(ret.msg);
                                }
                            });
                        });
                        break;
                    case 6: //评价订单
                        let a_evaluationData = [];
                        for (let i in extend_order_goods) {
                            let { goods_id, goods_image } = goods_list[i];
                            a_evaluationData.push([goods_id, goods_image]);
                        }
                        app.openWin("evaluate_order", { order_id: order_id, evaluation: JSON.stringify(a_evaluationData) });
                        break;
                    case 7: //评价回复
                        app.openWin("order_assess", { order_id: order_id });
                        break;
                    case 8: //查看售后进度
                        app.openWin("after_order", { refund_id: refund.refund_id });
                        break;
                    default:
                        break;
                }
            });
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.MEDIA_ITEM);
        app.removeEvt(app.APPOSE_FIXED_BTN);
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.MEDIA_ITEM);
        app.removeEvt(app.APPOSE_FIXED_BTN);
    },
    //卖家电话
    f_call_seller() {
        wx.makePhoneCall({
            phoneNumber: this.data.data.shop_info.shop_phone
        });
    },
    //联系卖家
    f_contact_seller() {

    },
    //呼叫配送员
    f_call_deliveryPerson(ev) {
        wx.makePhoneCall({
            phoneNumber: this.data.data.extend_order_common.person_phone
        });
    }
})