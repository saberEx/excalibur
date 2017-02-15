let app = getApp();
Page({
    data: {
        goodsList: [],
    },
    _PAGE_SIZE: 100,
    onLoad: function(options) {
        app.assign(this, app.baseHandler);
        this._type = parseInt(options.type);
        this._requestParam = {
            act: 'member_favorites',
            op: 'favorites_list',
            type: 1,
            pagesize: this._PAGE_SIZE,
            curpage: 1
        }
        if (this._type === 1) {
            this._requestParam['act'] = 'member_favorites';
            this._requestParam['op'] = 'favorites_list';
            wx.setNavigationBarTitle({ title: '商品收藏' });
        } else {
            this._requestParam['act'] = 'member_index';
            this._requestParam['op'] = 'browse_list';
            wx.setNavigationBarTitle({ title: '浏览记录' });
        }
    },
    _getGoodsList(arr) {
        let a_list = arr.map((item, index) => {
            item.goods_image = app.getGoodsImg(item.goods_image, 640);
            return item;
        });
        return a_list;
    },
    onShow: function() {
        let self = this;
        let keyStr = this._type === 1 ? 'favorites_list' : 'browse_list';
        this._requestData((data) => {
            self.setData({ goodsList: self._getGoodsList(data[keyStr]) });
        });
        app.addEvt(app.SCROLL_BOTTOM, () => {
            console.log(12314);
        });
    },
    onHide: function() {
        // 页面隐藏
        app.removeEvt(app.SCROLL_BOTTOM);
    },
    _requestData(callback, b_isNoShowProgress) {
        console.log(this._requestParam);
        app.getVerify(this._requestParam, (res) => {
            if (parseInt(res.code) === 0) {
                callback(res.data);
            } else {
                app.toast(res.msg);
            }
        }, b_isNoShowProgress);
    },
    onUnload: function() {
        app.removeEvt(app.SCROLL_BOTTOM);
    },
    goodsList_click_item(ev) {
        app.openWin("goods_detail", { goods_alias: ev.currentTarget.dataset.goods_alias, shop_id: ev.currentTarget.dataset.shop_id });
    },
})