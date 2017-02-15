let app = getApp();
Page({
    data: {
        cart_list: [],
        sum: 0,
        b_edit: false,
        b_allChecked: true,
        b_allNotChecked: false
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        //把服务端返回的数据处理成需要的模板样式
        this.f_changeDataListModol = (dataList) => {
                this.b_noData = true;
                if (dataList.length > 0) {
                    let newDataList = {};
                    this.b_noData = false;
                    for (let i in dataList) {
                        let data = dataList[i];
                        let cart_id = parseInt(data.cart_id);
                        let shop_id = data.shop_id;
                        if (!newDataList[shop_id]) {
                            newDataList[shop_id] = {};
                            newDataList[shop_id].store_name = data.store_name;
                            newDataList[shop_id].shop_id = data.shop_id;
                            newDataList[shop_id].list = {};
                        }
                        data.b_checked = true;
                        data.goods_num = parseInt(data.goods_num);
                        data.b_minus_dis = data.goods_num > 1 ? false : true;
                        data.params = { i_a_index: shop_id, i_b_index: cart_id };
                        newDataList[shop_id].list[cart_id] = data;
                    }
                    return newDataList;
                }
                return [];
            }
            //编辑、完成改变选中状态方法
        this.f_changeSelect = (checked) => {
            let { cart_list } = this.data;
            for (let i in cart_list) {
                let o_cartList = cart_list[i].list;
                for (let j in o_cartList) {
                    o_cartList[j].b_checked = checked;
                }
            }
        }
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        app.postVerify({ act: "member_cart", op: "cart_list" }, (res) => {
            if (parseInt(res.code) === 0) {
                let { cart_list, sum } = res.data;
                this.setData({ cart_list: this.f_changeDataListModol(cart_list), sum: sum, totalPrice: sum, b_noData: this.b_noData, b_allNotChecked: false });
            } else {
                app.toast(res.msg);
            }
        });
        app.addEvt(app.NUM_BOX, (data) => {
            this.f_setNumBoxState(data);
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.NUM_BOX);
    },
    onUnload: function() {
        // 页面关闭
    },
    //弹性盒选取数量
    f_setNumBoxState(data) {
        let { cart_list } = this.data;
        let { value, params } = data;
        let { i_a_index, i_b_index } = params;
        let o_data = cart_list[i_a_index].list[i_b_index];
        o_data.b_minus_dis = false;
        if (value <= 1 || !value) {
            value = 1;
            o_data.b_minus_dis = true;
        }
        o_data.goods_num = value;
        this.setData({ cart_list: cart_list });
    },
    //检查是否全选
    f_checkIfAllChecked() {
        let { cart_list } = this.data;
        this.b_allSelected = true;
        this.b_hasChecked = false;
        for (let i in cart_list) {
            let o_cartList = cart_list[i].list;
            for (let j in o_cartList) {
                if (o_cartList[j].b_checked) {
                    this.b_hasChecked = true;
                } else {
                    this.b_allSelected = false;
                }
            }
        }
    },
    //勾选回调
    f_radioChange(ev) {
        let { i_a_index, i_b_index } = ev.currentTarget.dataset;
        let o_data = this.data.cart_list[i_a_index].list[i_b_index];
        o_data.b_checked = !o_data.b_checked;
        this.f_checkIfAllChecked();
        let { goods_price, goods_num } = o_data;
        let sum = parseFloat(this.data.sum).toFixed(2);
        if (o_data.b_checked) {
            sum = parseFloat(sum) + parseFloat(goods_price) * goods_num;
        } else {
            sum = parseFloat(sum) - parseFloat(goods_price) * goods_num;
        }
        sum = parseFloat(sum).toFixed(2);
        this.setData({ cart_list: this.data.cart_list, b_allChecked: this.b_allSelected, sum: sum, b_allNotChecked: !this.b_hasChecked });
    },
    //编辑、完成
    mediaItem_r_label_handler(ev) {
        let labelId = ev.currentTarget.id;
        if (labelId === "editLabel") {
            let { b_edit, cart_list, b_allChecked } = this.data
            if (b_edit) {
                b_allChecked = true;
                let a_card = [];
                for (let i in cart_list) {
                    let o_cartList = cart_list[i].list;
                    for (let j in o_cartList) {
                        let { goods_num, cart_id } = o_cartList[j];
                        a_card.push(`${cart_id}|${goods_num}`);
                        o_cartList[j].b_checked = true;
                    }
                }
                app.postVerify({ act: "member_cart", op: 'cart_edit_quantity', goodNums: a_card.join(',') }, (res) => {
                    if (parseInt(res.code) === 0 && res.data) {
                        let sum = parseFloat(res.data.total_price).toFixed(2);
                        this.setData({ b_edit: !b_edit, cart_list: cart_list, b_allChecked: b_allChecked, sum: sum, totalPrice: sum, b_allNotChecked: false });
                    } else {
                        app.toast(res.msg);
                    }
                });
            } else {
                this.f_changeSelect(false);
                b_allChecked = false;
                this.setData({ b_edit: !b_edit, cart_list: cart_list, b_allChecked: b_allChecked, b_allNotChecked: true });
            }
        }
    },
    //全选
    f_radioAllChange() {
        let { b_allChecked, sum, cart_list, totalPrice, b_allNotChecked } = this.data;
        if (b_allChecked) {
            this.f_changeSelect(false);
            sum = "0.00";
            b_allNotChecked = true;
        } else {
            this.f_changeSelect(true);
            sum = totalPrice;
            b_allNotChecked = false;
        }
        this.setData({ b_allChecked: !b_allChecked, sum: sum, cart_list: cart_list, b_allNotChecked: b_allNotChecked });
    },
    //结算、删除
    f_l_labelOnClick() {
        let { b_edit, cart_list } = this.data;
        let a_card = [];
        let i_shop_id = 0;
        let n_count = 0;
        for (let i in cart_list) {
            let o_cartList = cart_list[i].list;
            i_shop_id = cart_list[i].shop_id;
            for (let j in o_cartList) {
                let { goods_num, cart_id, b_checked } = o_cartList[j];
                n_count = n_count + 1;
                if (b_checked) {
                    a_card.push(`${cart_id}|${goods_num}`);
                    if (b_edit) {
                        delete o_cartList[j];
                    }
                }
            }
        }
        if (a_card.length === 0) {
            return;
        }
        if (b_edit) {
            app.postVerify({ act: 'member_cart', op: 'cart_del', cartIds: a_card.join(',') }, (res) => {
                if (parseInt(res.code) === 0) {
                    if (n_count == a_card.length) {
                        cart_list = [];
                        this.b_noData = true;
                    }
                    this.setData({ cart_list: cart_list, b_allNotChecked: true, b_noData: this.b_noData })
                } else {
                    app.toast(res.msg);
                }
            });
        } else {
            app.openWin("order_submit", { shop_id: i_shop_id, cartIds: a_card.join(','), ifcart: 1 });
        }
    }
})