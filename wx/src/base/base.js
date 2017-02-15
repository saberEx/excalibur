/**
 * 基础类
 */
let Pubsub = require('pubsub.js');
import * as EMUN from 'EMUN.js';
let Base = {
    //打开窗口，暂不支持外链
    openWin(s_name, o_pageParam) {
        if (!s_name) {
            return;
        }
        o_pageParam = o_pageParam || {}
        let s_urlParam = "";
        for (let s_key in o_pageParam) {
            if (o_pageParam.hasOwnProperty(s_key)) {
                let value = o_pageParam[s_key];
                s_urlParam += (s_key + "=" + value + "&");
            }
        }
        s_urlParam = s_urlParam.replace(/&$/, "");
        let s_division = /\?/.test(s_name) ? '&' : '?';
        s_name = s_urlParam ? (s_name + s_division + s_urlParam) : s_name;
        wx.navigateTo({ url: './' + s_name });
    },
    //关闭窗体
    closeWin() {
        wx.navigateBack();
    },
    //发送事件
    sendEvt(s_evtName, o_data) {
        Pubsub.publish(s_evtName, o_data);
    },
    //监听事件
    addEvt(s_evtName, f_callBack) {
        Pubsub.subscribe(s_evtName, (evt, data) => {
            f_callBack && f_callBack(data);
        });
    },
    //移除事件
    removeEvt(s_evtName) {
        Pubsub.unsubscribe(s_evtName);
    },
    assign(o_a, o_b) {
        for (let variable in o_b) {
            if (o_b.hasOwnProperty(variable)) {
                o_a[variable] = o_b[variable];
            }
        }
        return o_a;
    },
    //校验手机号
    checkMobile(i_mobileNum) {
        let re = new RegExp(/^1(3|4|5|7|8)\d{9}$/);
        return re.test(i_mobileNum);
    },
    //隐藏手机号
    hideMobile(i_mobileNum) {
        return i_mobileNum.toString().replace(/(^\d{3})(\d){7}(\d{1}$)/, '$1*******$3');
    },
    //格式化数字，比如：0->0.00
    getNumFormat(n_num, i_len) {
        n_num = parseFloat(n_num) || 0;
        i_len = i_len || 2;
        return n_num.toFixed(i_len);
    },
    //格式化时间日期,time:秒数,type:0,输出年月日,1.输出时分秒,2.全部输出
    getTimeFormat(s_time, i_type) {
        s_time = s_time ? new Date(parseInt(s_time) * 1000) : new Date();
        i_type = i_type || 0;
        let a_YMDList = [s_time.getFullYear(), s_time.getMonth() + 1, s_time.getDate()];
        let a_HMSList = [s_time.getHours(), s_time.getMinutes(), s_time.getSeconds()];
        a_YMDList.map(function(value, index) {
            a_YMDList[index] = value.toString().replace(/(^\d{1}$)/, "0" + "$1");
        });
        a_HMSList.map(function(value, index) {
            a_HMSList[index] = value.toString().replace(/(^\d{1}$)/, "0" + "$1");
        });
        if (i_type === 0) {
            return a_YMDList.join('-');
        } else if (i_type === 1) {
            return a_HMSList.join(':');
        }
        return a_YMDList.join('-') + " " + a_HMSList.join(':');
    },
    //截取字符串长度,超出部分显示...，一个中文算两个字符
    getSpliceStr(s_str, i_len) {
        s_str = s_str || "";
        if (i_len >= s_str.replace(/[^\x00-\xff]/g, 'xx').length) {
            return s_str;
        }
        let s_newStr = '',
            i_newLen = 0,
            i_index = 0,
            i_charCode = 0;
        while (i_newLen < i_len) {
            s_newStr += s_str[i_index];
            i_charCode = s_str.charCodeAt(i_index);
            i_newLen += (i_charCode >= 0 && i_charCode <= 128) ? 1 : 2;
            i_index++;
        }
        return s_newStr + '...';
    },
    //根据数组中obj的字段值移除该obj，例如[{a:1},{b:1,a:2}] 移除a===1，修改原数组
    rmObjFromArr(a_list, s_key, s_value) {
        let len = a_list.length;
        for (let i = 0; i < len; i++) {
            if (a_list[i][s_key] === s_value) {
                a_list.splice(i, 1);
                break;
            }
        }
    },
    //格式化html文本
    replaceHtml(s_str) {
        return s_str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "'").replace(/&amp;/g, "&");
    },
    //显示toast
    toast(s_msg, f_callBack, n_seconds) {
        n_seconds = n_seconds || 2;
        wx.showToast({
            title: s_msg,
            icon: 'success',
            duration: n_seconds * 1000
        });
        if (f_callBack) {
            setTimeout(f_callBack, n_seconds * 1000);
        }
    },
    //确定框
    confirm(s_title, s_msg, f_callback) {
        wx.showModal({
            title: s_title,
            content: s_msg,
            success: function(res) {
                if (res.confirm) {
                    f_callback && f_callback();
                }
            }
        })
    },
    //显示隐藏loading
    showProgress(b_show) {
        if (b_show) {
            wx.showToast({
                title: 'loading',
                icon: 'loading',
                duration: 10000
            });
        } else {
            wx.hideToast();
        }
    },
    //弹出showActionSheet
    showActionSheet(a_list, f_callBack, itemColor = "#000000", f_fail) {
        wx.showActionSheet({
            itemList: a_list,
            itemColor: itemColor,
            success: function(res) {
                f_callBack && f_callBack(res.tapIndex);
                console.log(res.tapIndex)
            },
            fail: function(res) {
                f_fail && f_fail(res);
            }
        });
    },
    //打开地图
    openMap(option, f_success, f_fail) {
        let { lat, lon, name, address } = option;
        if (!lat || !lon) {
            return;
        }
        wx.openLocation({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            name: name,
            address: address,
            success: function(res) {
                f_success && f_success(res);
            },
            fail: function(res) {
                f_fail && f_fail(res);
            }
        });
    },
    //https请求
    request(s_requestUrl, o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress, s_method, f_errorCallBack) {
        s_method = s_method || "POST";
        !b_isNoShowProgress && this.showProgress(true);
        let _self = this;
        wx.request({
            url: s_requestUrl,
            data: o_param,
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res.data);
                !b_isNoHideProgress && _self.showProgress(false);
                f_callBack && f_callBack(res.data);
            },
            fail(e) {
                !b_isNoHideProgress && _self.showProgress(false);
                f_errorCallBack && f_errorCallBack(e);
            }
        });
    },
}
Base.assign(Base, EMUN);
module.exports = Base;