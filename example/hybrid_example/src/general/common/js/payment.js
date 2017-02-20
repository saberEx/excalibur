;(function(window){
	var u = {};

	u.wxPay = function(ret){//微信支付
		if(ret.code != 0){
			if(ret.code == 500){
				window.parent.location.href = ret.data.url;
			}else{
				Com.toast(ret.msg);
			}
		}else{
			var wx_mode = 1;
			var total_fee = ret.data.total_fee;
			var is_jfb = ret.data.is_jfb;
			var is_spell = ret.data.is_spell;//是否团购
			var open_sn = ret.data.open_sn;
			var card_code = ret.data.card_code;//会员卡支付
			if(wx_mode == 1){
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					{
						'appId': ret.data.appId,
						'timeStamp': ret.data.timeStamp,
						'nonceStr': ret.data.nonceStr,
						'package': ret.data.package,
						'signType': ret.data.signType,
						'paySign': ret.data.paySign
					},
					function(res){
						if(res.err_msg == "get_brand_wcpay_request:ok"){
							if(is_jfb == 1){
								Com.openWin("jfbPaySuccess",{total_fee:total_fee});
							}else if(is_spell == 1){
								Com.openWin("group_detail",{open_sn:open_sn});
							}else if(card_code){
								Com.openWin("pay_success",{card_code:card_code,totalPrice:total_fee});
							}else{
								Com.openWin("pay_success",{totalPrice:total_fee});
							}
						}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
//							alert('cancel');
						}else if(res.err_msg == "get_brand_wcpay_request:fail"){
							Com.toast('支付失败');
						}else{
							Com.toast("支付失败",res.err_msg);
						}
					}
				);
			}else{
				wx.chooseWXPay({
					timestamp: ret.data.timeStamp,
					nonceStr: ret.data.nonceStr, // 支付签名随机串，不长于 32 位
					package: ret.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: ret.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: ret.data.paySign, // 支付签名
					success: function(res){// 支付成功后的回调函数
//						alert('success');
					},
					fail: function(){//接口调用失败时执行的回调函数
						Com.toast('支付失败');
					},
					complete: function(){//接口调用完成时执行的回调函数，无论成功或失败都会执行
//						alert('complete');
					},
					cancel: function(){//用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
//						alert('cancel');
					}
				});
			}
		}
	}

	u.alipayPay = function(ret){
		if(ret.code == 0){
			window.location.href = ret.data.url;
		}else{
			Com.toast(ret.msg);
		}
	}

	u.payTypeRequest = function(pay_sn,type){
		switch(type){
			case 1:
				var param = {'act': 'member_pay', 'op': 'pay_wx', 'pay_sn': pay_sn, 'order_sn': 0};
				Com.getVerify(param, u.wxPay);
				break;
			case 2:
				var param = {'act': 'member_pay', 'op': 'pay_alipay', 'pay_sn': pay_sn, 'order_sn': 0};
				Com.getVerify(param, u.alipayPay);
				break;
			case 3:
				var param = {'act': 'member_pay', 'op': 'pay_wx', 'pay_sn': 0, 'order_sn': pay_sn, 'order_type':'spell'};
				Com.getVerify(param, u.wxPay);
				break;
			case 4:
				var param = {'act': 'member_pay', 'op': 'pay_wx', 'pay_sn': pay_sn, 'order_sn': 0, 'order_type':'recharge'};
				Com.getVerify(param, u.wxPay);
				break;
		}
	}

	window.payment = u;
})(window);
