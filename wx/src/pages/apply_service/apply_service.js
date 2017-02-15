let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { order_id, type } = options;
        type = type == 1 ? 1 : 2;
        if (parseInt(type) === 1) {
            wx.setNavigationBarTitle({ title: '申请退款' });
            app.postVerify({ act: 'member_order', op: 'order_refund_all_view', order_id: order_id }, (res) => {
                if (parseInt(res.code) === 0) {
                    let a_goodsName = [];
                    let { extend_order_goods, order_amount, add_time } = res.data.order;
                    if (extend_order_goods && extend_order_goods.length > 0) {
                        extend_order_goods.forEach((item) => {
                            a_goodsName.push(item.goods_name);
                        });
                    }
                    let s_amount = `￥${order_amount>0?parseFloat(order_amount).toFixed(2):"0.00"}`;
                    app.assign(res.data.order, { i_applyType: type, s_goodsName: a_goodsName.join(","), s_amount: s_amount, s_add_time: app.getTimeFormat(add_time, 2) });
                    this.setData(res.data.order);
                } else {
                    app.toast(res.msg);
                }
            });
        } else {
            wx.setNavigationBarTitle({ title: '申请售后' });
            app.postVerify({ act: 'member_order', op: 'add_after_service', order_id: order_id }, (res) => {
                if (parseInt(res.code) === 0) {
                    let a_goodsName = [];
                    let { extend_order_goods, order_amount, add_time } = res.data.order;
                    let { refund_reason } = res.data;
                    if (extend_order_goods && extend_order_goods.length > 0) {
                        extend_order_goods.forEach((item) => {
                            a_goodsName.push(item.goods_name);
                        });
                    }
                    let s_amount = `￥${order_amount>0?parseFloat(order_amount).toFixed(2):"0.00"}`;

                    let a_range = [];
                    let a_range_index = [];
                    for (let i in refund_reason) {
                        if (refund_reason.hasOwnProperty(i)) {
                            let { reason_info } = refund_reason[i];
                            a_range.push(reason_info);
                            a_range_index.push(i);
                        }
                    }
                    app.assign(res.data.order, { i_applyType: type, s_goodsName: a_goodsName.join(","), s_amount: s_amount, s_add_time: app.getTimeFormat(add_time, 2), a_range: a_range, a_range_index: a_range_index });
                    this.setData(res.data.order);
                } else {
                    app.toast(res.msg);
                }
            });
        }
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        app.addEvt(app.LABEL_ITEM, (data) => {
            let { id, value } = data;
            switch (id) {
                case "info":
                    this._info = value;
                    break;
                case "contact":
                    this._contact = value;
                    break;
                case "phone":
                    this._phone = value;
                    break;
            }
        });
        app.addEvt(app.SELECT_ITEM, (data) => {
            let { id, value } = data;
            console.log(data);
            let { a_range, a_range_index } = this.data;
            switch (id) {
                case "reason":
                    value = parseInt(value);
                    this._reason_id = a_range_index[value]
                    this.setData({ s_range: a_range[value] });
                    break;
            }
        });
        app.addEvt(app.FIXED_BLOCK_BTN, (data) => {
            let { id } = data;
            let { order_id } = this.data;
            switch (id) {
                case "refund": //申请退款
                    if (!this._info) {
                        return app.toast("退款说明不能为空");
                    }
                    app.postVerify({ act: 'member_order', op: 'order_refund_all_commit', order_id: order_id, buyer_message: this._info }, (res) => {
                        if (parseInt(res.code) === 0) {
                            app.closeWin();
                        } else {
                            app.toast(res.msg);
                        }
                    });
                    break;
                case "refundAfter":
                    if (!this._reason_id) {
                        return app.toast("请选择退款原因");
                    }
                    if (!this._contact) {
                        return app.toast("请填写联系人");
                    }
                    if (!this._phone) {
                        return app.toast("请填写手机号码");
                    } else {
                        if (!app.checkMobile(this._phone)) {
                            return app.toast("请填写11位的手机号码");
                        }
                    }
                    if (!this._info) {
                        return app.toast("请填写退款说明");
                    }
                    this.a_post_pic = this.a_post_pic || [];
                    app.postVerify({
                        act: 'member_order',
                        op: 'do_add_after_service',
                        refund_amount: this.data.order_amount,
                        reason_id: this._reason_id,
                        phone: this._phone,
                        contacts: this._contact,
                        refund_type: "1",
                        buyer_message: this._info,
                        post_pic: this.a_post_pic.join(","),
                        order_id: order_id
                    }, (res) => {
                        if (parseInt(res.code) === 0) {
                            app.toast("申请售后成功", () => {
                                app.closeWin();
                            }, 1);
                        } else {
                            app.toast(res.msg);
                        }
                    });
                    break;
            }
        });
    },
    //上传凭证
    f_uploadImage(ev) {
        let index = parseInt(ev.currentTarget.dataset.index);
        wx.chooseImage({
            count: 1, // 默认9
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                app.sendFile({ act: 'member_upload', op: 'index', type: 2, pic: 'imageInput' }, tempFilePaths[0], "post_pic", (res) => {
                    if (parseInt(res.code) === 0) {
                        this.a_post_pic = this.a_post_pic || [];
                        this.a_post_pic[index] = res.data.file_name;
                        this.setData({
                            ['s_chooseImg_' + index]: tempFilePaths[0]
                        });
                    } else {
                        app.toast(res.msg);
                    }
                });
            }
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.LABEL_ITEM);
        app.removeEvt(app.FIXED_BLOCK_BTN);
        app.removeEvt(app.SELECT_ITEM);
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.LABEL_ITEM);
        app.removeEvt(app.FIXED_BLOCK_BTN);
        app.removeEvt(app.SELECT_ITEM);
    }
})