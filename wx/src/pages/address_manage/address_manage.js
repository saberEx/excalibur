//获取应用实例
let app = getApp();
Page({
    data: {
        address_list: []
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
    },
    //设置默认
    setDefaultHandler(e) {
        let index = e.currentTarget.dataset.index;
        let address_list = this.data.address_list;
        let self = this;
        let { address_id, true_name, mob_phone, area_info, address, tel_phone, city_id, area_id } = address_list[index];
        app.getVerify({
            act: 'member_address',
            op: 'address_edit',
            address_id: address_id,
            true_name: true_name,
            mob_phone: mob_phone,
            area_info: area_info,
            address: address,
            tel_phone: tel_phone,
            city_id: city_id,
            area_id: area_id,
            is_default: 1
        }, (ret) => {
            if (parseInt(ret.code) === 0) {
                address_list[0].is_default = 0;
                address_list[index].is_default = 1;
                address_list.sort(self._sortList);
                self.setData({ address_list: address_list });
            } else {
                app.toast(ret.msg);
            }
        })
    },
    //删除
    delHandler(e) {
        let self = this;
        let data = e.currentTarget.dataset.item;
        if (parseInt(data.is_default) === 1) {
            return app.toast("默认地址不能删除哦!");
        }
        let { address_id } = data;
        var address_list = this.data.address_list;
        app.getVerify({ act: 'member_address', op: 'address_del', address_id: address_id }, (ret) => {
            if (parseInt(ret.code) === 0) {
                app.rmObjFromArr(address_list, 'address_id', address_id);
                self.setData({ address_list: address_list });
            } else {
                app.toast(ret, msg);
            }
        });
    },
    //编辑
    editHandler(e) {
        app.openWin('address_edit', e.currentTarget.dataset.item);
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
})