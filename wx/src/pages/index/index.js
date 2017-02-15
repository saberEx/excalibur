let app = getApp();
Page({
    data: {
        goodsList: null,
        address: '',
        shop_name: '',
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        app.assign(this, app.baseHandler);
        this._curpage = 1;
    },
    searchInput(e) {
        this.searchStr = e.detail.value;
    },
    addressHandler() {
        let self = this;
        wx.chooseLocation({
            // latitude: self._lat,
            // longitude: self._lon,
            // scale: 28,
            success(res) {
                self._lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self._lon = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                self.setData({ address: res.address });
                self._getLocationData(true);
            },
            fail() {
                app.toast('切换地址失败');
            }
        })
    },
    searchHandler() {
        if (!this.searchStr) {
            return app.toast('请输入商品关键字');
        }
        this._curpage = 1;
        this._requsetData(true);
    },
    _getGoodsList(arr) {
        let a_list = arr.map((item, index) => {
            item.goods_image = app.getGoodsImg(item.goods_image, 640);
            return item;
        });
        return a_list;
    },
    _requsetData(b_search, b_noShowLoading) {
        let self = this;
        let o_params = { act: 'normal_index', op: 'searchInfo', type: '3', pagesize: 10, curpage: this._curpage };
        if (b_search) {
            o_params.type = 1;
            o_params.value = this.searchStr;
        }
        app.getNormal(o_params, (res) => {
            if (parseInt(res.code) === 0) {
                let list = res.data.list;
                list = self._getGoodsList(list);
                if (b_search && self._curpage === 1) {
                    self.setData({ goodsList: list });
                } else {
                    let goodsList = self.data.goodsList || [];
                    self.setData({ goodsList: goodsList.concat(list) });
                }
                self._hasMore = res.data.page.hasmore;
                self._curpage++;
            } else {
                app.toast(res.msg);
            }
        }, b_noShowLoading);
    },
    onShow: function() {
        let self = this;
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                self._lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self._lon = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                self._getLocationData();
            },
            fail() {
                self._getLocationData();
            }
        })
        app.addEvt(app.SCROLL_BOTTOM, () => {
            if (self._hasMore) {
                self._requsetData();
            }
        });
    },
    _getLocationData(b_noGetAddress) {
        let self = this;
        if (self._lat && self._lon) {
            if (!b_noGetAddress) {
                app.getNormal({ act: 'login', op: 'address', mod: 'applet', location: self._lat + ',' + self._lon }, (res) => {
                    if (parseInt(res.code) === 0) {
                        self.setData({ address: res.data.address });
                    } else {
                        self.setData({ address: '' });
                    }
                }, true);
            }
            app.getNormal({ act: 'location', op: 'index', lat: self._lat, long: self._lon }, (res) => {
                if (parseInt(res.code) === 0) {
                    let params = res.data.redirect.split('&');
                    let len = params.length;
                    for (let i = 0; i < len; i++) {
                        var a_item = params[i].split('=');
                        if (a_item[0] === 'shop_id') {
                            app.shop_id = parseInt(a_item[1]);
                            break;
                        }
                    }
                    if (res.data.list.length > 0) {
                        self.setData({ shop_name: res.data.list[0].shop_name });
                    } else {
                        self.setData({ shop_name: '附近没有门店' });
                    }
                } else {
                    self.setData({ shop_name: '附近没有门店' });
                }
                self._requsetData(false, true);
            }, false, true);
        } else {
            self._requsetData();
        }
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.SCROLL_BOTTOM);
    },
    onUnload: function() {
        // 页面关闭
        app.removeEvt(app.SCROLL_BOTTOM);
    },
    goodsList_click_item(ev) {
        app.openWin("goods_detail", { goods_alias: ev.currentTarget.dataset.goods_alias });
    },
    errorImgHandler(e) {
        console.log(e);
    }
})