let app = getApp();
Page({
    data: {
        a_star_des: [false, false, false, false, false],
        a_star_ship: [false, false, false, false, false],
        a_star_service: [false, false, false, false, false],
        b_allChecked: false
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { evaluation, order_id } = options;
        evaluation = evaluation ? JSON.parse(evaluation) : [];
        if (evaluation.length <= 0 || !order_id) {
            return app.toast("页面参数错误");
        }
        this._goodsCode = [];
        this._goodsEva = [];
        let a_goods_star = [];
        evaluation.forEach(() => {
            a_goods_star.push([false, false, false, false, false]);
        });
        this.setData({ b_onLoad: true, a_goods_star: a_goods_star, evaluation: evaluation, order_id: order_id });
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
    },
    //评分
    radio_group_handler(ev) {
        let name = ev.currentTarget.dataset.name;
        let value = parseInt(ev.detail.value);
        let { a_star_des, a_star_ship, a_star_service, a_goods_star } = this.data;
        let a_current = [];
        let o_data = {};
        if (name == 'des') {
            a_current = a_star_des;
            o_data['a_star_des'] = a_current;
            this._desCode = value;
        } else if (name == 'service') {
            a_current = a_star_service;
            o_data['a_star_service'] = a_current;
            this._serverCode = value;
        } else if (name == 'shipments') {
            a_current = a_star_ship;
            o_data['a_star_ship'] = a_current;
            this._shipCode = value;
        } else {
            let a_name = name.split("_");
            let index = parseInt(a_name[1]);
            a_current = a_goods_star[index];
            o_data['a_goods_star'] = a_goods_star;
            this._goodsCode[index] = `${a_name[2]}%hsy%${value}`;
        }
        for (let i = 0; i < 5; i++) {
            if (i < value) {
                a_current[i] = true;
            } else {
                a_current[i] = false;
            }
        }
        this.setData(o_data);
    },
    //是否匿名
    f_radioAllChange() {
        let { b_allChecked } = this.data;
        this.setData({ b_allChecked: !b_allChecked });
    },
    //提交
    f_l_labelOnClick() {
        let a_goods = [];
        let { evaluation, b_allChecked, order_id } = this.data;
        for (let i = 0, len = evaluation.length; i < len; i++) {
            if (!this._goodsCode[i]) {
                return app.toast("请给商品评分");
            }
            if (!this._goodsEva[i]) {
                return app.toast("请输入商品评价");
            }
            a_goods.push(`${this._goodsCode[i]}%hsy%${this._goodsEva[i]}`);
        }
        if (!this._desCode) {
            return app.toast("请给商品与描述相符项评分");
        }
        if (!this._serverCode) {
            return app.toast("请给卖家的服务态度项评分");
        }
        if (!this._shipCode) {
            return app.toast("请给卖家的发货速度项评分");
        }
        let anony = b_allChecked ? 1 : 0;
        app.postVerify({
            act: 'member_order',
            op: 'evaluate',
            type: 3,
            order_id: order_id,
            goods: a_goods.join("%bdhs%"),
            anony: anony,
            store_desccredit: this._desCode,
            store_servicecredit: this._serverCode,
            store_deliverycredit: this._shipCode
        }, function(ret) {
            if (parseInt(ret.code) === 0) {
                app.toast("评论成功!", () => {
                    app.closeWin();
                }, 1);
            } else {
                app.toast(ret.msg);
            }
        });
    },
    //文本框评论
    textarea_handler(ev) {
        let index = parseInt(ev.currentTarget.dataset.index);
        this._goodsEva[index] = ev.detail.value;
    }
})