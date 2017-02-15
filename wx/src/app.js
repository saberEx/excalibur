//app.js
let Config = require('config0.js');
let Base = require('base.js');
let General = require('general.js');
let BaseHandler = require('baseHandler.js');
//供测试使用，正式环境清空
let _sign = '';
let _member_id = '';
App({
    onLaunch() {
        Base.assign(this, Base);
        Base.assign(this, General);
        this.baseHandler = BaseHandler;
        this._autoLogin(null, true);
    },
    _autoLogin(f_callBack, b_launch) {
        if (_sign) {
            f_callBack && f_callBack();
            return;
        }
        let self = this;
        wx.login({
            success(res) {
                self.postNormal({ act: 'login', op: 'index', mod: 'applet', code: res.code }, (res) => {
                    if (res.code === 0) {
                        let { session_key, openid } = res.data;
                        wx.getUserInfo({
                            success(res) {
                                let { rawData, signature, encryptedData, iv } = res;
                                self.postNormal({ act: 'login', op: 'login_in', mod: 'applet', rawData: rawData, signature: signature, encryptedData: encryptedData, iv: iv, session_key: session_key, openid: openid }, (res) => {
                                    if (res.code === 0) {
                                        let { member_id, sign, token, store_name } = res.data;
                                        _sign = sign;
                                        self.store_name = store_name;
                                        _member_id = member_id;
                                        self.member_openid = openid;
                                        f_callBack && f_callBack();
                                    }
                                }, b_launch, true)
                            },
                            fail() {
                                self.toast('获取用户数据失败');
                            }
                        })
                    }
                }, b_launch, true)
            }
        });
    },
    //get请求normal
    getNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        let api_url = Config.API_URL;
        o_param = o_param || {};
        o_param['store_alias'] = Config.STORE_ALIAS;
        o_param['shop_id'] = o_param['shop_id'] || this.shop_id || 0;
        this.request(api_url, o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress, 'GET');
    },
    //get请求Verify
    getVerify(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        let api_url = Config.API_URL;
        o_param = o_param || {};
        o_param['store_alias'] = Config.STORE_ALIAS;
        o_param['shop_id'] = o_param['shop_id'] || this.shop_id || 0;
        this._autoLogin(() => {
            o_param['member_id'] = _member_id;
            o_param['sign'] = _sign;
            this.request(api_url, o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress, 'GET');
        })
    },
    //post请求normal
    postNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        let api_url = Config.API_URL;
        o_param = o_param || {};
        o_param['store_alias'] = Config.STORE_ALIAS;
        o_param['shop_id'] = o_param['shop_id'] || this.shop_id || 0;
        this.request(api_url, o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress, 'POST');
    },
    //post请求Verify
    postVerify(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        let api_url = Config.API_URL;
        o_param = o_param || {};
        o_param['store_alias'] = Config.STORE_ALIAS;
        o_param['shop_id'] = o_param['shop_id'] || this.shop_id || 0;
        this._autoLogin(() => {
            o_param['member_id'] = _member_id;
            o_param['sign'] = _sign;
            this.request(api_url, o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress, 'POST');
        })
    },
    //上传图片
    sendFile(o_param, filePath, name, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        let api_url = Config.API_URL + "?";
        o_param = o_param || {};
        o_param['store_alias'] = Config.STORE_ALIAS;
        o_param['shop_id'] = o_param['shop_id'] || this.shop_id || 0;
        this._autoLogin(() => {
            o_param['member_id'] = _member_id;
            o_param['sign'] = _sign;
            for (let i in o_param) {
                if (o_param.hasOwnProperty(i)) {
                    api_url += i + '=' + o_param[i] + '&';
                }
            }!b_isNoShowProgress && this.showProgress(true);
            wx.uploadFile({
                url: api_url,
                filePath: filePath,
                name: name,
                success: (res) => {
                    !b_isNoHideProgress && this.showProgress(false);
                    f_callBack && f_callBack(JSON.parse(res.data));
                },
                fail: (res) => {
                    !b_isNoHideProgress && this.showProgress(false);
                }
            })

        });
    }
})