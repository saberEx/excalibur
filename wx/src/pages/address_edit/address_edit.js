//获取应用实例
let app = getApp();
Page({
    data: {
        true_name: '',
        mob_phone: '',
        area_info: '',
        address: '',
        maskVisual: 'hidden',
        cityData: [],
        provinceName: '请选择',
        current: 0
    },
    onLoad: function(options) {
        let self = this;
        try {
            var res = wx.getSystemInfoSync()
            self._animationW = 285 * res.windowWidth / 375;
        } catch (e) {
            self._animationW = 285;
        }
        this.cityData = require('city.data.js');
        this.setData({ cityData: this.cityData });
        this._options = options;
        this.setData(options);
        app.assign(this, app.baseHandler);
        app.addEvt(app.LABEL_ITEM, (labelData) => {
            this.setData({
                [labelData.id]: labelData.value
            });
        });
        app.addEvt(app.FIXED_BLOCK_BTN, () => {
            let data = self.data;
            let { address_id, true_name, mob_phone = "", area_info, address, city_id, area_id } = data;
            console.log(city_id, area_id, area_info);
            console.log(true_name, mob_phone, address);
            if (!true_name) {
                return app.toast('请输入收件人姓名');
            }
            if (!app.checkMobile(mob_phone)) {
                return app.toast('请输入正确的手机号');
            }
            if (!address) {
                return app.toast('请输入正确的地址');
            }
            if (!area_info) {
                return app.toast('请选择省市区');
            }
            //判断地区
            var o_params = { act: 'member_address', true_name: true_name, mob_phone: mob_phone, area_info: area_info, address: address, tel_phone: 0, city_id: city_id, area_id: area_id }
            if (data.hasOwnProperty("address_id")) { //编辑
                o_params['address_id'] = address_id;
                o_params['op'] = 'address_edit';
            } else { //新增
                o_params['op'] = 'address_add';
            }
            app.postVerify(o_params, (res) => {
                if (parseInt(res.code) === 0) {
                    app.closeWin();
                } else {
                    app.toast(res.msg);
                }
            });
        });
    },
    cityItem_handler() {
        this.cascadePopup();
    },
    currentChanged: function(e) {
        var current = e.detail.current;
        this.setData({
            current: current
        });
    },
    provinceTapped: function(e) {
        // 标识当前点击省份，记录其名称与主键id都依赖它
        var index = e.currentTarget.dataset.index;
        // current为1，使得页面向左滑动一页至市级列表
        // provinceIndex是市区数据的标识
        this.setData({
            provinceName: this.cityData[index].text,
            regionName: '',
            provinceIndex: index,
            cityIndex: -1,
            regionIndex: -1,
            region: [],
        });
        this.setData({
            cityName: '请选择',
            city: this.cityData[index].children,
        });
        // 确保生成了数组数据再移动swiper
        this.setData({
            current: 1
        });
    },
    cityTapped: function(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            cityIndex: index,
            regionIndex: -1,
            area_id: 0,
            cityName: this.data.city[index].text,
            regionName: '',
        });
        this.setData({
            regionName: '请选择',
            region: this.data.city[index].children,
        });
        // 确保生成了数组数据再移动swiper
        this.setData({
            current: 2
        });
    },
    regionTapped(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            regionIndex: index,
            regionName: this.data.region[index].text,
        });
        var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName;
        this.setData({
            area_info: areaSelectedStr,
            area_id: this.data.region[index].value,
            city_id: this.data.city[this.data.cityIndex].value,
        });
        this.cascadeDismiss();
    },
    cascadePopup: function() {
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-in-out',
        });
        this.animation = animation;
        animation.translateY(-this._animationW).step();
        this.setData({
            animationData: this.animation.export(),
            maskVisual: 'show'
        });
    },
    cascadeDismiss: function() {
        this.animation.translateY(this._animationW).step();
        this.setData({
            animationData: this.animation.export(),
            maskVisual: 'hidden'
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        app.removeEvt(app.FIXED_BLOCK_BTN);
        app.removeEvt(app.LABEL_ITEM);
    },
})