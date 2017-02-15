let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        let { order_id } = options;
        app.postVerify({ act: "member_order", op: "search_deliver", order_id: order_id }, (res) => {
            if (parseInt(res.code) === 0) {
                let data = res.data;
                let { deliver_info } = data;
                deliver_info = deliver_info || [];
                deliver_info.reverse();
                deliver_info.forEach((item, index) => {
                    item = item.split("&nbsp;&nbsp;");
                    deliver_info[index] = item;
                });
                data["b_onLoad"] = true;
                this.setData(data);
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