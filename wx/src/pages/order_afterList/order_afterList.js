let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        this.PAGE_SIZE = 10;
        this.curPage = 1;
        this.f_requestData = (b_reset) => {
            if (b_reset) {
                this.curPage = 1;
            }
            app.postVerify({ act: "member_order", op: "after_service_list", curpage: this.curPage, pagesize: this.PAGE_SIZE }, (res) => {
                if (parseInt(res.code) === 0) {
                    let { order_group_list, page } = res.data;
                    order_group_list = this.f_setOrderList(order_group_list);
                    let a_list = this.data.data || [];
                    if (b_reset) {
                        a_list = [];
                    }
                    a_list = a_list.concat(order_group_list);
                    this.setData({ b_hasRequest: true, data: a_list, page: page });
                    this.curPage++;
                    this._hasMore = page.hasmore;
                } else {
                    app.toast(res.msg);
                }
            });
        };
        this.f_requestData();
    },
    f_setOrderList(order_group_list) {
        let topStateList = ["待商家确认", "待商家处理", "待系统退款", "已完成"];
        order_group_list.forEach((item) => {
            let {
                order_state,
                shop_id,
                delivery_type_name,
                order_sn,
                shop_name,
                store_name,
                refund_id,
                refund_type,
                refund_amount,
                goods_list,
                seller_state,
                shipping_fee,
                admin_time,
                seller_time,
                return_type,
                receive_time
            } = item;
            order_state = parseInt(order_state / 10);
            let topBtnStatus = topStateList[order_state];
            let s_shopType = item.shop_id > 0 ? "门店：" : "商家："
            let s_nameType = item.shop_id > 0 ? item.shop_name : item.store_name;
            let cur_name = s_shopType + s_nameType;
            if (refund_type == 1) {
                if (parseInt(seller_time) == 0) {
                    topBtnStatus = topStateList[0];
                } else {
                    if (parseInt(seller_state) == 2) {
                        if (parseInt(admin_time) === 0) {
                            topBtnStatus = topStateList[2];
                        } else {
                            topBtnStatus = topStateList[3];
                        }
                    } else {
                        topBtnStatus = topStateList[3];
                    }
                }
            } else {
                if (parseInt(seller_time) === 0) {
                    topBtnStatus = topStateList[0];
                } else {
                    if (parseInt(seller_state) === 2) {
                        if (parseInt(return_type) === 1) {
                            topBtnStatus = topStateList[2];
                            if (parseInt(admin_time) === 0) {
                                topBtnStatus = topStateList[2];
                            } else {
                                topBtnStatus = topStateList[3];
                            }
                        } else {
                            if (parseInt(receive_time) === 0) {
                                topBtnStatus = topStateList[1];
                            } else {
                                if (parseInt(admin_time) === 0) {
                                    topBtnStatus = topStateList[2];
                                } else {
                                    topBtnStatus = topStateList[3];
                                }
                            }
                        }
                    } else {
                        topBtnStatus = topStateList[3];
                    }
                }
            }
            item['cur_name'] = cur_name;
            item['topOrderState'] = topBtnStatus;
            item["goods_list"] = this._getGoodsList(item["goods_list"]);
        });
        return order_group_list;
    },
    _getGoodsList(arr) {
        let a_list = arr.map((item, index) => {
            item.goods_image = app.getGoodsImg(item.goods_image, 640);
            return item;
        });
        return a_list;
    },
    //订单明细
    f_order_detail(ev) {
        let { order_id } = ev.currentTarget.dataset;
        app.openWin("order_detail", { orderId: order_id });
    },
    //售后明细
    f_bottom_btn(ev) {
        let { refund_id } = ev.currentTarget.dataset;
        app.openWin("after_order", { refund_id: refund_id });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        if (this.b_onShow) {
            this.f_requestData(true);
        }
        this.b_onShow = true;
        app.addEvt(app.SCROLL_BOTTOM, () => {
            if (this._hasMore) {
                this.f_requestData();
            }
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.SCROLL_BOTTOM);
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.SCROLL_BOTTOM);
    }
})