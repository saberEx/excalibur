//获取应用实例
let app = getApp();
Page({
    data: {
        i_tabIndex: 0,
        a_controlItems: [],
        isAnim: false
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { cartIds, ifcart = 0, shop_id = 0 } = options;
        this.options = { cartIds: cartIds, ifcart: ifcart };
        this.setData({ shop_id: shop_id });
        app.getVerify({ act: "member_buy", op: "buy_step1", ifcart: ifcart, cart_id: cartIds, shop_id: shop_id }, (res) => {
            if (res.code === 0) {
                let totalPrice = "";
                let goods_list = [];
                let store_name = "";
                for (let key in res.data.store_cart_list) {
                    let store_cart_list = res.data.store_cart_list;
                    if (store_cart_list.hasOwnProperty(key)) {
                        totalPrice = store_cart_list[key].store_goods_total;
                        store_name = store_cart_list[key].store_name;
                        goods_list = store_cart_list[key].goods_list;
                    }
                }
                let card_info = "";
                if (res.data.card_info) {
                    card_info = JSON.parse(card_info)[0];
                }
                let address_id = "";
                let true_name = "";
                let mob_phone = "";
                if (res.data.address_info) {
                    address_id = res.data.address_info.address_id;
                    true_name = res.data.address_info.true_name;
                    mob_phone = res.data.address_info.mob_phone;
                }
                let a_controlItems = [];
                let freight_1 = 0;
                let delivery = res.data.delivery;
                let a_range = [];
                let a_range_self = [];
                if (delivery) {
                    if (delivery.express == 1) {
                        a_controlItems.push("物流配送");
                    }
                    if (delivery.seller_dispatching == 1) {
                        a_controlItems.push("店员配送");
                    }
                    if (delivery.call_by_self == 1) {
                        a_controlItems.push("到店自提");
                    }
                    if (delivery.seller_dispatching_info) {
                        freight_1 = parseFloat(delivery.seller_dispatching_info.freight).toFixed(2) || 0;
                        let time_limit = delivery.seller_dispatching_info.time_limit || [];
                        for (let i in time_limit) {
                            a_range.push(time_limit[i].start + "-" + time_limit[i].end);
                        }
                    }
                    if (delivery.call_by_self_info) {

                        let time_limit = delivery.call_by_self_info.time_limit || [];
                        for (let i in time_limit) {
                            a_range_self.push(time_limit[i].start + "-" + time_limit[i].end);
                        }
                    }
                }
                this.setData({
                    b_hasData: true,
                    data: res.data,
                    goods_list: goods_list,
                    totalPrice: totalPrice,
                    goods_total: totalPrice,
                    store_name: store_name,
                    card_info: card_info,
                    address_id: address_id,
                    delivery_type: 0,
                    a_controlItems: a_controlItems,
                    freight_1: 0,
                    freight_2: 0,
                    a_range: a_range,
                    a_range_self: a_range_self,
                    true_name: true_name,
                    mob_phone: mob_phone
                });
                if (res.data.address_info) {
                    this.getFreight(res.data.address_info);
                }
            } else {
                app.toast(res.msg);
            }
        });
        app.addEvt(app.ADDRESS_SELECT, (data) => {
            if (data.data) {
                this.data.data.address_info = data.data;
                this.setData({ data: this.data.data, true_name: data.data.true_name, mob_phone: data.data.mob_phone, address_id: data.data.address_id });
                this.b_hasGetFreight_0 = false;
                this.getFreight(data.data);
            }
        });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        this.setData({ s_currentDate: app.getTimeFormat(null, 0) });
        app.addEvt(app.TAB_BTN_GROUP, (data) => {
            let { a_controlItems, delivery_type, freight, freight_0, freight_1, freight_2 } = this.data;
            switch (a_controlItems[data]) {
                case "物流配送":
                    delivery_type = 0;
                    break;
                case "店员配送":
                    delivery_type = 1;
                    break;
                case "到店自提":
                    delivery_type = 2;
                    break;
            }
            this.setData({ i_tabIndex: data, delivery_type: delivery_type });
            this.getFreight(this.data.data.address_info);
        });
        app.addEvt(app.SELECT_ITEM, (data) => {
            switch (data.id) {
                case "date_1":
                    this.setData({ date_1_value: data.value });
                    break;
                case "date_2":
                    this.setData({ date_2_value: data.value });
                    break;
                case "time_1":
                    let { a_range } = this.data;
                    this.setData({ time_1_value: a_range[parseInt(data.value)] });
                    break;
                case "time_2":
                    let { a_range_self } = this.data;
                    this.setData({ time_2_value: a_range_self[parseInt(data.value)] });
                    break;
            }
        });
        app.addEvt(app.MEDIA_ITEM, (data) => {
            if (data.id === "shopMap") {
                let { shop_map_x, shop_map_y, shop_address } = this.data.data.shop_info;
                app.openMap({ lat: shop_map_x, lon: shop_map_y, name: this.data.shop_name, address: shop_address }, (res) => {

                });
            }
        });
        app.addEvt(app.LABEL_ITEM, (data) => {
            switch (data.id) {
                case "name":
                    this.setData({ true_name: data.value });
                    break;
                case "phone":
                    this.setData({ mob_phone: data.value });
                    break;
                case "mssage":
                    this.setData({ pay_message: data.value });
                    break;
            }
        });
        app.addEvt(app.ACTION_SHEET, (data) => {
            if (data.b_isMask) {
                this.setData({ isAnim: false });
            } else {
                //生成订单
                let { totalPrice } = this.data;
                let { pay_message, address_id, b_notsupport, delivery_type, date_1_value = "", time_1_value = "", date_2_value = "", time_2_value = "", true_name, mob_phone } = this.data;
                app.postVerify({
                    act: "member_buy",
                    op: "buy_step2",
                    ifcart: this.options.ifcart,
                    cart_id: this.options.cartIds,
                    address_id: address_id,
                    vat_hash: this.data.data.vat_hash,
                    offpay_hash: "",
                    offpay_hash_batch: "",
                    pay_name: "online",
                    invoice_id: 0,
                    voucher: 0,
                    pd_pay: 1,
                    password: 0,
                    rcb_pay: 0,
                    goods_fcode: 0,
                    member_email: "",
                    order_from: 2,
                    pay_message: pay_message,
                    delivery_type: delivery_type,
                    delivery_dlyo_time: date_2_value + " " + time_2_value,
                    delivery_dlyo_name: true_name,
                    delivery_dlyo_tel: mob_phone,
                    part_time: date_1_value + " " + time_1_value,
                    adds_x: "",
                    adds_y: "",
                    card_code: "",
                    card_id: ""
                }, (res) => {
                    if (parseInt(res.code) === 0 && res.data.pay_sn) {
                        if (data.id == "wxPay") { //微信支付
                            let param = { 'act': 'member_pay', 'op': 'pay_small', 'openid': app.member_openid, 'pay_sn': res.data.pay_sn, 'order_sn': 0 };
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
                                            app.openWin("pay_success", { totalPrice: totalPrice });
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
                });
            }
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.TAB_BTN_GROUP);
        app.removeEvt(app.SELECT_ITEM);
        app.removeEvt(app.MEDIA_ITEM);
        app.removeEvt(app.ACTION_SHEET);
        app.removeEvt(app.LABEL_ITEM);
    },
    getFreight(address_info) {
        let { goods_total, card_info, delivery_type } = this.data;
        let totalPrice = parseFloat(goods_total);
        // if (card_info) {
        //     totalPrice = totalPrice - parseFloat(card_info.discount / 100);
        // }
        if (delivery_type == 0) {
            let { freight_hash } = this.data.data;
            if (!freight_hash || !address_info || !address_info.hasOwnProperty("address_id")) {
                return;
            }
            let { area_id, city_id } = address_info;
            if (!this.b_hasGetFreight_0) {
                app.getVerify({ act: "member_buy", op: "change_address", freight_hash: freight_hash, city_id: city_id, area_id: area_id }, (res) => {
                    if (res.code === 0) {
                        this.b_hasGetFreight_0 = true;
                        let { content, notsupport } = res.data;
                        let freight = 0; //运费
                        for (let i in content) {
                            freight = content[i];
                        }
                        this.setData({ b_notsupport: notsupport, freight: parseFloat(freight).toFixed(2), freight_0: parseFloat(freight).toFixed(2), totalPrice: (totalPrice + parseFloat(freight)).toFixed(2) });
                    } else {
                        this.setData({ freight: 0, freight_0: 0, totalPrice: parseFloat(totalPrice).toFixed(2) });
                        app.toast(res.msg);
                    }
                });
            } else {
                this.setData({ freight: this.data.freight_0, totalPrice: (totalPrice + parseFloat(this.data.freight_0)).toFixed(2) })
            }
        } else if (delivery_type == 1) {
            let freight = parseFloat(this.data.data.delivery.seller_dispatching_info.freight);
            this.setData({ freight: freight.toFixed(2), freight_1: freight.toFixed(2), totalPrice: (totalPrice + freight).toFixed(2) });
        } else {
            this.setData({ freight: 0, freight_2: 0, totalPrice: parseFloat(totalPrice).toFixed(2) });
        }
    },
    //选取地址
    addressItem_handle(ev) {
        app.openWin("address_select");
    },
    //检查时间确保比当前时间大
    f_checkTime(s_date, s_time) {
        let preTime = s_time.split("-")[0];
        let a_time = preTime.split(":");
        return (Date.parse(s_date) + parseInt(a_time[0]) * 60 * 60 * 1000 + parseInt(a_time[1] * 60 * 1000)) < (new Date().getTime());
    },
    //提交订单验证
    f_l_labelOnClick() {
        let { shop_id, address_id, b_notsupport, delivery_type, date_1_value, time_1_value, date_2_value, time_2_value, true_name, mob_phone } = this.data;
        if (shop_id > 0) {
            if (delivery_type === 0) { //物流配送
                if (!address_id) {
                    return app.toast("请设置收货地址");
                }

            } else if (delivery_type === 1) { //店员配送
                if (!address_id) {
                    return app.toast("请设置收货地址");
                } else if (!date_1_value) {
                    return app.toast("请设置收货日期");
                } else if (!time_1_value) {
                    return app.toast("请设置收货时间");
                } else if (this.f_checkTime(date_1_value, time_1_value)) {
                    return app.toast("不能穿越哦！");
                }
            } else { //到店自提
                if (!date_2_value) {
                    return app.toast("请设置到店日期");
                } else if (!time_2_value) {
                    return app.toast("请设置到店时间");
                } else if (this.f_checkTime(date_2_value, time_2_value)) {
                    return app.toast("不能穿越哦！");
                } else if (!true_name) {
                    return app.toast("请填写收货人姓名");
                } else if (!mob_phone) {
                    return app.toast("请填写收货人手机号");
                } else if (!app.checkMobile(mob_phone)) {
                    return app.toast("手机号格式不正确");
                }
            }
        } else {
            if (!address_id) {
                return app.toast("请设置收货地址");
            }
            if (b_notsupport != 0) {
                return app.toast('该地区暂不支持配送');
            }
        }
        this.setData({ isAnim: true });
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.TAB_BTN_GROUP);
        app.removeEvt(app.SELECT_ITEM);
        app.removeEvt(app.ADDRESS_SELECT);
        app.removeEvt(app.MEDIA_ITEM);
        app.removeEvt(app.ACTION_SHEET);
        app.removeEvt(app.LABEL_ITEM);
    }
})