let app = getApp();
Page({
    data: {
        data: null,
        orderState: "all",
        isAnim: false,
        pay_sn: 0
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { orderState } = options;
        orderState = orderState || "all";
        let a_title = ["全部订单", "待付款订单", "待发货订单", "待收货订单", "待自提订单", "已完成订单"];
        let s_title = "订单列表";
        if (orderState == "all") {
            s_title = a_title[0];
        } else if (orderState == 10) {
            s_title = a_title[1];
        } else if (orderState == 20) {
            s_title = a_title[2];
        } else if (orderState == 30) {
            s_title = a_title[3];
        } else if (orderState == 40) {
            s_title = a_title[5];
        } else if (orderState == 50) {
            s_title = a_title[4];
        }
        wx.setNavigationBarTitle({ title: s_title });
        this.setData({ orderState: orderState });
    },
    onReady: function() {
        // 页面渲染完成
    },
    setOrderList(data) {
        let { order_group_list } = data;
        let order_data = []; //返回处理好的数据
        let expressCost = ""; //运费
        let expressCostStr = "（免运费）";
        let topStateList = ["已取消", "待支付", "待发货", "已发货", "已完成", "待自提"];
        let topOrderState = ""; //顶部订单状态显示
        let order_state = ""; //订单状态
        let delivery_type_name = ""; //物流方式名称
        let refund_state = -1; //申请状态:1为处理中,2为待管理员审核,3为同意,4不同意 默认为1
        let extend_order_common = {};
        let evaluation_state = ""; //评价状态
        let lock_state = ""; //大于0是锁定状态
        let bottomList = []; //底部栏
        let cur_name = ""; //门店或店铺名称
        let s_shopType = "";
        let s_nameType = "";
        let geval_explain = false; //是否有评论内容
        let noPay = [{ text: "取消订单", i_cls: 1, index: 1 }, { text: "付款", i_cls: 2, index: 2 }];
        let cancle = [{ text: "", i_cls: 0, index: -1 }, { text: "取消并退款", i_cls: 1, index: 3 }]
        let okGoods = [{ text: "查看物流", i_cls: 1, index: 4 }, { text: "确认收货", i_cls: 2, index: 5 }];
        let okGoods1 = [{ text: "", i_cls: 0, index: 0 }, { text: "确认收货", i_cls: 2, index: 5 }]; //自提订单
        let evaluate = [{ text: "", i_cls: 0, index: 0 }, { text: "评价订单", i_cls: 2, index: 6 }];
        let evaluate1 = [{ text: "", i_cls: 0, index: 0 }, { text: "评价回复", i_cls: 2, index: 7 }];
        order_group_list.forEach((item) => {
            let { order_list, pay_sn } = item;
            order_list.forEach((item) => {
                expressCost = parseFloat(item.shipping_fee);
                if (expressCost != 0) {
                    expressCostStr = "（含运费￥" + expressCost + "）";
                }
                order_state = parseInt(item.order_state) / 10;
                delivery_type_name = item.delivery_type_name;
                refund_state = item.return_refund_state || -1;
                topOrderState = topStateList[order_state];
                extend_order_common = item.extend_order_common || {};
                evaluation_state = item.evaluation_state;
                lock_state = item.lock_state;
                s_shopType = item.shop_id > 0 ? "门店：" : "商家："
                s_nameType = item.shop_id > 0 ? item.shop_name : item.store_name;
                cur_name = s_shopType + s_nameType;
                geval_explain = item.extend_evaluate.length != 0 ? true : false;

                if (order_state == 2 && delivery_type_name == "自提") {
                    topOrderState = "待备货";
                };
                if (extend_order_common.delivery_type == 2 && extend_order_common.delivery_state == 1) {
                    topOrderState = "待自提";
                };
                switch (parseInt(refund_state)) {
                    case 1:
                        topOrderState = "处理中";
                        break;
                    case 2:
                        topOrderState = "待审核";
                        break;
                    case 3:
                        topOrderState = "申请通过";
                        break;
                    case 4:
                        // topOrderState = "申请不通过";
                        break;
                }
                if (order_state === 0) { //已取消
                    bottomList = [];
                } else if (order_state === 1) { //未付款
                    bottomList = noPay;
                } else if (order_state === 2) { //已付款
                    bottomList = cancle;
                } else if (order_state === 3) { //已发货
                    if (extend_order_common.delivery_type == 2 && extend_order_common.delivery_state == 1) {
                        bottomList = okGoods1;
                    } else {
                        bottomList = okGoods;
                    }
                } else if (order_state === 4) { //已收货
                    if (parseInt(evaluation_state) === 0) { //未评价
                        bottomList = evaluate;
                    } else if (geval_explain) {
                        bottomList = evaluate1;
                    } else {
                        bottomList = [];
                    }
                }
                if (parseInt(lock_state) > 0) {
                    bottomList = [];
                }
                item['cur_name'] = cur_name;
                item['bottomList'] = bottomList;
                item['topOrderState'] = topOrderState;
                item['expressCostStr'] = expressCostStr;
                item['goods_list'] = this._getGoodsList(item.goods_list);
                order_data.push({ data: item, pay_sn: pay_sn });
            });
        });
        return order_data;
    },
    _getGoodsList(arr) {
        let a_list = arr.map((item, index) => {
            item.goods_image = app.getGoodsImg(item.goods_image, 640);
            return item;
        });
        return a_list;
    },
    _requsetData() {
        let self = this;
        let { orderState } = this.data;
        let o_params = { act: "member_order", op: "order_list", order_state: orderState, pagesize: 10, curpage: this._curpage };
        app.postVerify(o_params, (res) => {
            if (parseInt(res.code) === 0) {
                let data = self.setOrderList(res.data);
                let old_data = this._curpage == 1 ? [] : self.data.data;
                self.setData({ data: old_data.concat(data) });
                self._hasMore = res.data.page.hasmore;
                self._curpage++;
            } else {
                app.toast(res.msg);
            }
        });
    },
    onShow: function() {
        // 页面显示
        let self = this;
        this._curpage = 1;
        this._requsetData();
        app.addEvt(app.SCROLL_BOTTOM, () => {
            if (self._hasMore) {
                self._requsetData();
            }
        });
        app.addEvt(app.ACTION_SHEET, (data) => {
            if (data.b_isMask) {
                this.setData({ isAnim: false });
            } else {
                let { pay_sn } = this.data;
                let order_amount = this.order_amount;
                if (pay_sn != 0) {
                    if (data.id == "wxPay") { //微信支付
                        let param = { 'act': 'member_pay', 'op': 'pay_small', 'openid': app.member_openid, 'pay_sn': pay_sn, 'order_sn': 0 };
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
                                        //刷新页面
                                        let list = self.data.data;
                                        app.rmObjFromArr(list, 'pay_sn', pay_sn);
                                        self.setData({ data: list });
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
                    }
                } else {
                    app.toast(res.msg);
                }
                this.setData({ isAnim: false });
            }
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.SCROLL_BOTTOM);
        app.removeEvt(app.ACTION_SHEET);
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.SCROLL_BOTTOM);
        app.removeEvt(app.ACTION_SHEET);
    },
    f_order_detail(ev) { //跳转订单详情
        let { order_id } = ev.currentTarget.dataset;
        app.openWin("order_detail", { orderId: order_id });
    },
    f_bottom_btn(ev) { //底部按钮
        let { index, pay_sn, data, key } = ev.currentTarget.dataset;
        let { order_id, order_amount } = data;
        let self = this;
        switch (index) {
            case 1: //取消订单
                app.confirm("提示", "您确定要取消该订单吗？", () => {
                    app.getVerify({ act: 'member_order', op: 'order_cancel', order_id: order_id }, function(res) {
                        if (parseInt(res.code) === 0) {
                            //刷新页面
                            let list = self.data.data;
                            app.rmObjFromArr(list, 'pay_sn', pay_sn);
                            self.setData({ data: list });
                        } else {
                            app.toast(res.msg);
                        }
                    })
                });
                break;
            case 2: //付款
                if (pay_sn != 0) {
                    this.order_amount = order_amount;
                    this.setData({ pay_sn: pay_sn, isAnim: true });
                } else {
                    app.toast("支付失败");
                }
                break;
            case 3: //取消并退款
                app.openWin("apply_service", { order_id: order_id, type: 1 });
                break;
            case 4: //查看物流
                app.openWin("order_logisticsDetails", { order_id: order_id });
                break;
            case 5: //确认收货
                app.confirm("提示", "是否确认收货", () => {
                    app.getVerify({ act: 'member_order', op: 'order_receive', order_id: order_id }, function(ret) {
                        if (parseInt(ret.code) === 0) {
                            //刷新页面
                            let list = self.data.data;
                            app.rmObjFromArr(list, 'pay_sn', pay_sn);
                            self.setData({ data: list });
                        } else {
                            app.toast(ret.msg);
                        }
                    });
                });
                break;
            case 6: //评价订单
                if (data.goods_list) {
                    let a_evaluationData = [];
                    for (let i in data.goods_list) {
                        let { goods_id, goods_image } = data.goods_list[i];
                        a_evaluationData.push([goods_id, goods_image]);
                    }
                    app.openWin("evaluate_order", { order_id: data.order_id, evaluation: JSON.stringify(a_evaluationData) });
                }
                break;
            case 7: //评价回复
                app.openWin("order_assess", { order_id: order_id });
                break;
        }
    }
})