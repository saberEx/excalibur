let app = getApp();
Page({
    data: {
        i_tabIndex: 0, //顶部tab下标
        indicatorDots: false,
        autoplay: false,
        interval: 3000,
        duration: 1000,
        storeApprove: 'approveIcon.png',
        service: 'serviceIco.png',
        collect: 'collectIcon.png',
        collect_o: 'collectIcon_o.png',
        is_favorites: false, //是否已收藏
        shopCart: 'shopCartIcon.png',
        tips_close: 'tips_close.png',
        zay: 'zay.jpg',
        isAnim: false, //规格弹出层是否展示
        a_evaluate: [, , , ], // 评论列表数组
        i_evaluateIndex: 0, //评论tab下标
        a_count: [0, 0, 0, 0], //评论数量数组,
        b_showSpreadCon: false, //门店配送方式块初始隐藏
        spec_goods_alias: "",
        a_activeSpec: [],
        i_openSpecType: 0,
        i_inputValue: 1, //购买数量
        b_plus_dis: false,
        b_minus_dis: true
    },
    //评论tab切换
    f_evaluateTab(ev) {
        let { index } = ev.target.dataset;
        index = parseInt(index);
        if (index !== this.data.i_evaluateIndex) {
            this.setData({ i_evaluateIndex: index });
            let { a_evaluate } = this.data;
            if (!a_evaluate[index]) {
                this.requestEvaluateInfo(index, (data) => {
                    a_evaluate[index] = data;
                    this.setData({ a_evaluate: a_evaluate });
                });
            }
        }
    },
    f_changeSpreadCon() {
        this.setData({ b_showSpreadCon: !this.data.b_showSpreadCon });
    },
    //规格层选择规格
    f_changeSpec(ev) {
        let { a_activeSpec, spec_goods_alias, i_inputValue } = this.data;
        let all_com_goods = this.data.data.all_com_goods;
        let { index, value } = ev.target.dataset;
        a_activeSpec[index] = value;
        for (let i in all_com_goods) {
            let goods_spec = all_com_goods[i].goods_spec;
            let isCurGoods = true;
            a_activeSpec.forEach((item) => {
                if (!goods_spec[item]) {
                    isCurGoods = false;
                }
            });
            if (isCurGoods) {
                spec_goods_alias = i;
                break;
            }
        }
        let goods_limit = parseInt(this.data.data.goods_info.goods_limit) || 0;
        let goods_storage = parseInt(all_com_goods[spec_goods_alias].goods_storage) || 0;
        let i_value = goods_limit > 0 ? (goods_limit > goods_storage ? goods_storage : goods_limit) : goods_storage;
        i_inputValue = i_inputValue > i_value ? i_value : i_inputValue;
        this.setData({ spec_goods_alias: spec_goods_alias, a_activeSpec: a_activeSpec, i_inputValue: i_inputValue });
    },
    //购买或者加入购物车
    f_buyBtn() {
        let { i_openSpecType, data, spec_goods_alias, i_inputValue } = this.data;
        let { goods_storage } = data.all_com_goods[spec_goods_alias];
        if (goods_storage <= 0) {
            return;
        }
        if (!i_inputValue && i_inputValue != 0) {
            return app.toast("请输入有效数量");
        }
        if (i_inputValue == 0) {
            return app.toast("数量不能为0");
        }
        switch (i_openSpecType) {
            case 0: //加入购物车
                app.postVerify({ act: "member_cart", op: "cart_add", goods_alias: spec_goods_alias, quantity: i_inputValue }, (res) => {
                    if (parseInt(res.code) === 0) {
                        if (!parseInt(res.data.shop_id) && parseInt(res.data.shop_id) !== 0) {
                            app.toast("加入购物车成功");
                            data.shopping_cart = res.data.cart_goods_num;
                            this.setData({ data: data, isAnim: false });
                        } else {
                            //是否清空原购物车或者先去购物车结算层
                            app.showActionSheet(["删除原门店商品", "进入购物车"], (clickIndex) => {
                                switch (clickIndex) {
                                    case 0: //清空原购物车
                                        app.postVerify({ act: "member_cart", op: "cart_add", is_drop: 1, goods_alias: spec_goods_alias, quantity: i_inputValue }, (res) => {
                                            if (parseInt(res.code) === 0) {
                                                // this.props.f_changeCartNum( res.data.cart_goods_num);
                                                data.shopping_cart = res.data.cart_goods_num;
                                                this.setData({ data: data, isAnim: false });
                                                app.toast('操作成功');
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
                        app.toast(res.msg);
                    }
                });
                break;
            case 1: //购买
                let o_params = { cartIds: `${spec_goods_alias}|${i_inputValue}`, ifcart: 0 };
                this.setData({ isAnim: false });
                app.openWin("order_submit", o_params);
                break;
        }
    },
    //收藏
    f_favorites() {
        let { goods_alias, shop_id, is_favorites } = this.data;
        app.postVerify({ act: 'member_favorites', op: 'favorites_add', alias: goods_alias, shop_id: shop_id, type: 1 }, (res) => {
            if (parseInt(res.code) === 0) {
                this.setData({ is_favorites: !is_favorites });
            } else {
                app.toast(res.msg);
            }
        });
    },
    //去购物车
    f_toMyShopCart() {
        app.openWin("myShopCart");
    },
    //滑动到底部上拉加载
    f_scrollToLower(ev) {
        switch (parseInt(ev.currentTarget.id)) {
            case 2:
                let { o_salesRecord } = this.data;
                if (o_salesRecord.page.hasmore === true) {
                    this.requestSaleRecord((o_data) => {
                        o_data.salesRecord = o_salesRecord.salesRecord.concat(o_data.salesRecord);
                        this.setData({ o_salesRecord: o_data });
                    }, true);
                }
                break;
            case 3:
                let { a_evaluate, i_evaluateIndex } = this.data;
                if (a_evaluate[i_evaluateIndex].page.hasmore === true) {
                    this.requestEvaluateInfo(i_evaluateIndex, (data) => {
                        a_evaluate[index].list = a_evaluate[index].list.concat(data.list);
                        a_evaluate[index].page = data.page;
                        this.setData({ a_evaluate: a_evaluate });
                    }, true);
                }
                break;
        }
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数 228749299
        app.assign(this, app.baseHandler);
        let { goods_alias, shop_id } = options;
        if (!goods_alias) {
            return app.toast("参数错误");
        }
        if (shop_id == 0) {
            shop_id = "0";
        }
        if (!shop_id && shop_id != 0) {
            shop_id = app.shop_id || 0;
        }
        this.setData({ shop_id: shop_id, goods_alias: goods_alias, spec_goods_alias: goods_alias });
        let o_params = {};
        if (shop_id > 0) {
            o_params = { mod: "openapi", act: "goods", op: "getGoodInfo", goods_alias: goods_alias, shop_id: shop_id };
        } else {
            o_params = { act: 'normal_index', op: 'getGoodDetails', goods_alias: goods_alias, shop_id: '0' };
        }
        //规格转换
        function changeSpec(com_spec_list) {
            let a_spec = [];
            let { spec_name_list, spec_value_list } = com_spec_list;
            for (let i in spec_name_list) {
                if (spec_name_list[i]) {
                    a_spec.push({ name: spec_name_list[i], value: spec_value_list[i] || {} });
                }
            }
            return a_spec;
        }
        app.postVerify(o_params, (res) => {
            if (parseInt(res.code) === 0) {
                let a_com_spec_list = changeSpec(res.data.com_spec_list);
                let a_activeSpec = [];
                a_com_spec_list.forEach((item, key) => {
                    for (let i in item.value) {
                        if (res.data.all_com_goods[goods_alias].goods_spec[i]) {
                            a_activeSpec[key] = i;
                            return;
                        }
                    }
                });
                for (let i in res.data.all_com_goods) {
                    res.data.all_com_goods[i].s_goods_image = app.getGoodsImg(res.data.all_com_goods[i].goods_image);
                }
                // let doc = (new DOMParser()).parseFromString(res.data.goods_info.mobile_body, "text/html");
                // let a_childNodes = doc.querySelector("body").children;
                let s_mobile_body = res.data.goods_info.mobile_body || '';
                let c_mobile_body = s_mobile_body.split('<img');
                let a_mobile_body = [];
                s_mobile_body.split('<img').map((item, index) => {
                    if (item) {
                        a_mobile_body = a_mobile_body.concat(item.match(/(http(s?)\:\/\/).+([(\.jpg)|(\.png)|(\.gif)|(\.jpeg)])/ig));
                    }
                })
                this.setData({
                    data: res.data,
                    a_com_spec_list: a_com_spec_list,
                    a_activeSpec: a_activeSpec,
                    i_inputValue: res.data.all_com_goods[goods_alias].goods_storage > 0 ? 1 : 0,
                    is_favorites: res.data.goods_info.is_favorites,
                    a_mobile_body: a_mobile_body
                });
            } else {
                app.toast(res.msg);
            }
        });
        //评论列表接口
        this.a_evaluateInfoCurPage = [1, 1, 1, 1];
        this.requestEvaluateInfo = (index = 0, callBack, b_isNoShow) => {
            app.getNormal({ act: "normal_index", op: "evaluate", type: 2, goods_alias: goods_alias, mode: index, pagesize: 15, curpage: this.a_evaluateInfoCurPage[index] }, (res) => {
                if (parseInt(res.code) === 0) {
                    this.a_evaluateInfoCurPage[index]++;
                    if (res.data.list && res.data.list.length > 0) {
                        res.data.list.forEach((item) => {
                            let { geval_frommembername, geval_addtime, geval_isanonymous } = item;
                            item.s_geval_frommembername = app.replaceName(geval_frommembername);
                            if (geval_isanonymous == 1) {
                                item.s_geval_frommembername = app.anonymousName(item.s_geval_frommembername);
                            }
                            item.s_geval_addtime = app.getTimeFormat(geval_addtime, 2);
                        });
                    }
                    callBack(res.data);
                } else {
                    app.toast(res.msg);
                }
            }, b_isNoShow);
        };
        //销售记录接口
        this.i_saleRecordCurPage = 1;
        this.requestSaleRecord = (callBack, b_isNoShow) => {
            app.getNormal({ act: "normal_index", op: "getSalesRecord", goods_alias: goods_alias, pagesize: 15, curpage: this.i_saleRecordCurPage }, (res) => {
                if (parseInt(res.code) === 0) {
                    this.i_saleRecordCurPage++;
                    let { salesRecord } = res.data;
                    if (salesRecord.length > 0) {
                        salesRecord.forEach((item) => {
                            let { add_time, buyer_name } = item;
                            item.s_add_time = app.getTimeFormat(add_time, 2);
                            item.s_buyer_name = app.anonymousName(buyer_name);
                        });
                    }
                    callBack(res.data);
                } else {
                    app.toast(res.msg);
                }
            }, b_isNoShow);
        };
        //numBox回调
        this.f_setNumBoxState = (value) => {
            let goods_limit = parseInt(this.data.data.goods_info.goods_limit) || 0;
            let goods_storage = parseInt(this.data.data.all_com_goods[this.data.spec_goods_alias].goods_storage) || 0;
            let i_min = goods_storage > 0 ? 1 : 0;
            let i_max = goods_limit > 0 ? (goods_limit > goods_storage ? goods_storage : goods_limit) : goods_storage;
            let b_plus_dis = false;
            let b_minus_dis = false;
            if (value >= i_max) {
                b_plus_dis = true;
                value = i_max;
            }
            if (value <= i_min) {
                value = i_min;
                b_minus_dis = true;
            }
            this.setData({ i_inputValue: value, b_plus_dis: b_plus_dis, b_minus_dis: b_minus_dis });
        }
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        app.addEvt(app.TAB_BTN_GROUP, (data) => {
            this.setData({ i_tabIndex: data });
            let { goods_alias, a_evaluate } = this.data;
            if (data === 2 && !this.data.b_hasRequestSaleRecord) {
                this.requestSaleRecord((o_data) => {
                    this.setData({ o_salesRecord: o_data, b_hasRequestSaleRecord: true });
                });
            } else if (data === 3 && !this.data.b_hasRequestEvaluate) {
                app.getNormal({ act: "normal_index", op: "evaluate", type: 1, goods_alias: goods_alias }, (res) => {
                    if (parseInt(res.code) === 0) {
                        let { all, good, normal, bad } = res.data;
                        if (!a_evaluate[0]) {
                            this.requestEvaluateInfo(0, (data) => {
                                a_evaluate[0] = data;
                                this.setData({ a_evaluate: a_evaluate });
                            });
                        }
                        this.setData({ a_count: [all, good, normal, bad], b_hasRequestEvaluate: true });
                    } else {
                        app.toast(res.msg);
                    }
                }, false, true);
            }
        });
        app.addEvt(app.MEDIA_ITEM, (data) => {
            switch (data.id) {
                case "storeIndexMediaItem":
                    app.openWin("index");
                    break;
                default:
                    break;
            }
        });
        app.addEvt(app.NUM_BOX, (data) => {
            this.f_setNumBoxState(data.value);
        });
        let { goods_alias } = this.data;
        app.postVerify({ act: 'member_index', op: 'setBrowse', alias: goods_alias, type: 1 }, null, false);
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.TAB_BTN_GROUP);
        app.removeEvt(app.MEDIA_ITEM);
        app.removeEvt(app.NUM_BOX);
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.TAB_BTN_GROUP);
        app.removeEvt(app.MEDIA_ITEM);
        app.removeEvt(app.NUM_BOX);
    },
    //加入购物车或者购买弹出规格层
    f_showSpecMask(ev) {
        let index = parseInt(ev.target.dataset.index);
        this.setData({ isAnim: true, i_openSpecType: index });
    },
    closeType: function() {
        this.setData({ isAnim: false });
    }
})