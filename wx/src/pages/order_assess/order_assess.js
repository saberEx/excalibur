let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { order_id } = options;
        app.postVerify({ act: "member_order", op: "evaluate_reply", order_id: order_id }, (res) => {
            if (parseInt(res.code) === 0) {
                let data = res.data;
                data.forEach((item, index) => {
                    let { geval_goodsimage, geval_ordertime, geval_addtime, explain_time, geval_frommembername } = item;
                    item["goods_image"] = app.getGoodsImg(geval_goodsimage, 640);
                    item.geval_ordertime = app.getTimeFormat(geval_ordertime, 2);
                    item.geval_addtime = app.getTimeFormat(geval_addtime, 2);
                    item.explain_time = app.getTimeFormat(explain_time, 2);
                    item.geval_frommembername = app.replaceName(geval_frommembername);
                });
                this.setData({ a_list: data, b_onLoad: true });
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