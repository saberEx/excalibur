let app = getApp();
Page({
    data: {
        member_avatar: "",
        member_mobile: "",
        member_name: "",
        needPayOrderNum: "",
        waitPayOrderNum: "",
        alreadyPayOrderNum: "",
        sinceOrderNum: ""
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
    },
    onShow: function() {
        app.postVerify({ act: 'member_index', op: 'getUserCenterData' }, (res) => {
            this.setData({
                member_avatar: res.data.member_avatar || 'userDefault.png',
                member_mobile: res.data.member_mobile || '欢迎回来',
                member_name: res.data.member_name,
                needPayOrderNum: res.data.needPayOrderNum,
                waitPayOrderNum: res.data.waitPayOrderNum,
                alreadyPayOrderNum: res.data.alreadyPayOrderNum,
                sinceOrderNum: res.data.sinceOrderNum
            });
        });
        app.addEvt(app.MEDIA_ITEM, (data) => {
            app.openWin(data.params[0]);
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.MEDIA_ITEM);
    },
    onUnload: function() {
        // 页面关闭
    },
    errorImg: function() {
        this.setData({
            member_avatar: "userDefault.png"
        });
    },
    clickRecord: function(e) {
        let type = e.currentTarget.dataset.type;
        app.openWin('goods_record', { type: parseInt(type) || 0 });
    },
    clickGoodsState: function(ev) {
        let { index } = ev.currentTarget.dataset;
        app.openWin('order_list', { orderState: index });
    }
})