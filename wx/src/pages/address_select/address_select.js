//获取应用实例
let app = getApp();
Page({
    data: {

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
    },
    _sortList(a, b) {
        if (parseInt(a.is_default) === 1) {
            return -1
        }
        return 1;
    },
    onShow: function() {
        let self = this;
        //页面数据
        app.getVerify({ act: "member_address", op: "address_list" }, function(res) {
            if (res.code === 0) {
                let address_list = res.data.address_list;
                address_list.sort(self._sortList);
                self.setData({ address_list: address_list });
            } else {
                app.toast(res.msg);
            }
        });
        // 按钮处理
        app.addEvt(app.FIXED_BLOCK_BTN, (data) => {
            app.openWin(data.params);
        });
    },
    onHide: function() {
        app.removeEvt(app.FIXED_BLOCK_BTN);
    },
    onUnload: function() {
        app.removeEvt(app.FIXED_BLOCK_BTN);
    },
    addressItem_handle(e) {
        app.sendEvt(app.ADDRESS_SELECT, { data: e.currentTarget.dataset.params });
        app.closeWin();
    }
})