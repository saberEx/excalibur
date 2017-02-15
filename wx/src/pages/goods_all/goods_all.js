let app = getApp();
var order = ['green', 'red', 'yellow', 'blue', 'green']
Page({
    data: {
        toView: '',
        addCart: 'addGoods.png',
        shopC_shopCar: 'shopC_shopCar.png',
        minus_dis: false,
        plus_dis: false,
        inputValue: 1,
        i_stc_index: 0, //左侧分类菜单选中下标
        o_goodsAdd: {} //已添加购物车的商品集
    },
    onLoad(options) {
        app.assign(this, app.baseHandler);
        this.b_isFirstShow = true;
        this.setGoodsStc = (data) => {
            let { stc_list, goods_list } = data;
            data.cart_num = parseInt(data.cart_num) || 0;
            data.old_cart_num = parseInt(data.cart_num) || 0;
            stc_list = stc_list || [];
            goods_list = goods_list || [];
            stc_list.push({ stc_id: '0', stc_name: '未分组' });
            let a_newList = [];
            let a_newStc = [];
            stc_list.forEach((item) => {
                let { stc_id, stc_name } = item;
                let len = a_newList.length;
                goods_list.forEach((goodData) => {
                    let { goods_stcids } = goodData;
                    if (goods_stcids.indexOf(`,${stc_id},`) !== -1 || (stc_id === '0' && goods_stcids === '')) {
                        if (!a_newList[len]) {
                            a_newStc[len] = item;
                            a_newList[len] = { stc_id: stc_id, stc_name: stc_name, list: [] };
                        }
                        goodData.goods_image = app.getGoodsImg(goodData.goods_image);
                        goodData.isGA = goodData.goods_storage > 0 ? 1 : -1;
                        a_newList[len].list.push(goodData);
                    }
                });
            });
            data["goods_list"] = a_newList;
            if (a_newStc.length === 0) {
                a_newStc.push({ stc_id: '0', stc_name: '未分组' });
            }
            data["stc_list"] = a_newStc;
            return data;
        }
    },
    onShow() {
        if (!this.b_isRequestIng || this.b_isFirstShow) { //避免卡死
            this.b_isRequestIng = true;
            app.postVerify({ act: "goods", op: "list", mod: "openapi" }, (res) => {
                if (parseInt(res.code) === 0) {
                    let b_empty = res.data.goods_list.length <= 0 ? true : false;
                    let data = this.setGoodsStc(res.data);
                    this.setData({ data: data, i_right_toView: data["stc_list"][0].stc_id, i_left_toView: data["stc_list"][0].stc_id, b_empty: b_empty });
                    this.b_isRequestIng = false;
                } else {
                    this.b_isRequestIng = false;
                    app.toast(res.msg);
                }
            });
        }
        this.b_isFirstShow = false;
        app.addEvt(app.NUM_BOX, (data) => {
            this.f_setNumBoxState(data);
        });
    },
    onHide() {
        app.removeEvt(app.NUM_BOX);
    },
    //弹性盒选取数量
    f_setNumBoxState(data) {
        console.log(data);
        let o_goodsAdd = this.data.o_goodsAdd;
        let { value, params, oldValue } = data;
        let { i_a_index, i_b_index } = params;
        let o_data = this.data.data.goods_list[i_a_index].list[i_b_index];
        if (value < 1) {
            value = 0;
            o_data.isGA = 1;
        }
        if (value >= parseInt(o_data.goods_storage)) {
            o_data.b_plus_dis = true;
            value = parseInt(o_data.goods_storage);
        } else {
            o_data.b_plus_dis = false;
        }
        o_goodsAdd[o_data.goods_alias] = value;
        o_data.numBoxValue = value;
        this.data.data.cart_num = this.data.data.cart_num + value - oldValue;
        this.setData({ data: this.data.data, o_goodsAdd: o_goodsAdd });
    },
    //分组类别下标切换
    f_stcClick(ev) {
        let { stcid, index } = ev.currentTarget.dataset;
        this.setData({ i_stc_index: index, i_right_toView: stcid });
    },
    //查看商品详情
    f_godds_detail(ev) {
        let { goods_alias } = ev.currentTarget.dataset;
        app.openWin("goods_detail", { goods_alias: goods_alias });
    },
    //添加商品变numBox
    f_addGoodsNum(ev) {
        let { isga, i_a_index, i_b_index } = ev.currentTarget.dataset;
        if (isga == 1) {
            let o_goodsAdd = this.data.o_goodsAdd;
            let o_data = this.data.data.goods_list[i_a_index].list[i_b_index];
            o_data.isGA = 0;
            this.data.data.cart_num = parseInt(this.data.data.cart_num) || 0;
            this.data.data.cart_num = this.data.data.cart_num + 1;
            o_data.numBoxValue = 1;
            o_goodsAdd[o_data.goods_alias] = 1;
            o_data.params = { i_a_index: i_a_index, i_b_index: i_b_index };
            if (o_data.goods_storage == 1) {
                o_data.b_plus_dis = true;
            }
            this.setData({ data: this.data.data, o_goodsAdd: o_goodsAdd });
        }
    },
    //批量添加购物车
    f_addCart() {
        let { cart_num, old_cart_num } = this.data.data;
        let o_goodsAdd = this.data.o_goodsAdd;
        if (cart_num == old_cart_num) {
            if (old_cart_num == 0) {
                return app.toast("请选择商品");
            } else {
                return app.openWin('myShopCart');
            }
        }
        let a_goods = [];
        for (let i in o_goodsAdd) {
            let num = o_goodsAdd[i];
            if (num > 0) {
                a_goods.push(`${i}-${num}`);
            }
        }
        app.postVerify({ act: "member_cart", op: "cart_add_batch", goods_list: a_goods.join(",") }, (res) => {
            if (parseInt(res.code) === 0) {
                let shop_id = parseInt(res.data.shop_id);
                if (!shop_id && shop_id !== 0) {
                    app.openWin('myShopCart');
                } else {
                    app.showActionSheet(["删除原门店商品", "进入购物车"], (clickIndex) => {
                        switch (clickIndex) {
                            case 0: //清空原购物车
                                app.postVerify({ act: "member_cart", op: "cart_add", is_drop: 1, goods_alias: a_goods.join(",") }, (res) => {
                                    if (parseInt(res.code) === 0) {
                                        app.openWin('myShopCart');
                                    } else {
                                        app.toast(res.msg);
                                    }
                                });
                                break;
                            case 1: //先去购物车
                                app.openWin("myShopCart");
                                break;
                        }
                    });
                }
            } else if (parseInt(res.code) === 1) { //库存不足商品列表
                let a_data = res.data;
                let s_info = "";
                if (a_data.length > 0) {
                    a_data.forEach((item) => {
                        s_info = s_info + Com.getSpliceStr(item.goods_name, 6) + " 库存：" + item.goods_storage + ";\n";
                    });
                }
                app.confirm("以下商品库存不足：", s_info, () => {
                    app.postVerify({ act: "member_cart", op: "cart_add_batch", goods_list: a_goods.join(","), is_delete: 1 }, (ret) => {
                        if (parseInt(ret.code) === 0) {
                            let shop_id = parseInt(res.data.shop_id);
                            if (!shop_id && shop_id !== 0) {
                                app.openWin('myShopCart');
                            } else {
                                app.showActionSheet(["删除原门店商品", "进入购物车"], (clickIndex) => {
                                    switch (clickIndex) {
                                        case 0: //清空原购物车
                                            app.postVerify({ act: "member_cart", op: "cart_add", is_drop: 1, goods_alias: a_goods.join(",") }, (res) => {
                                                if (parseInt(res.code) === 0) {
                                                    app.openWin('myShopCart');
                                                } else {
                                                    app.toast(res.msg);
                                                }
                                            });
                                            break;
                                        case 1: //先去购物车
                                            app.openWin("myShopCart");
                                            break;
                                    }
                                });
                            }
                        } else {
                            app.toast(ret.msg);
                        }
                    });
                });
            } else {
                app.toast(res.msg);
            }
        });
    },
    //图片加载错误回调
    f_binderror(ev) {
        let { i_a_index, i_b_index } = ev.currentTarget.dataset;
        let o_data = this.data.data.goods_list[i_a_index].list[i_b_index];
        o_data.goods_image = "commonDefault.png";
        this.setData({ data: this.data.data });
    },
    upper: function(e) {
        console.log(e);
    },
    lower: function(e) {
        console.log(e)
    },
    scroll: function(e) {
        console.log(e)
    },
    scrollToTop: function(e) {
        this.setAction({
            scrollTop: 0
        })
    },
    tap: function(e) {
        for (var i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                console.log(order[i + 1]);
                this.setData({
                    toView: order[i + 1],
                    scrollTop: (i + 1) * 200
                })
                break
            }
        }
    },
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    }

})