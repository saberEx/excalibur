let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { totalPrice } = options;
        this.setData({ totalPrice: totalPrice });
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
    f_toIndex() {
        app.openWin("index");
    },
    f_toOrderList() {
        app.openWin("order_list", { orderState: 20 });
    }
})