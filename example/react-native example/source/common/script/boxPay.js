/*
* @Author: 卢旺
* @Date:   2016-05-27 18:03:20
* @Last Modified by:   卢旺
* @Last Modified time: 2016-07-04 17:15:11
*/

'use strict';
import { NativeModules } from 'react-native';
import Com from './common';
let {CashBoxAndroid} = NativeModules;

let o_boxPay = {
	cashBoxInit(appCode,merchantNo,f_callBack){
        if(Com.DEBUG){
            f_callBack({code:0,msg:'success'});
        }else{
            CashBoxAndroid.cashBoxInit(appCode,merchantNo).then((res)=>{
                Com.log(res);
                f_callBack(res);
            });
        }
    },
    pay(o_param,f_callBack){
    	if(Com.DEBUG){
            f_callBack({code:0,msg:'success'});
        }else{
            CashBoxAndroid.pay(o_param).then((res)=>{
        		Com.log(res);
        		f_callBack(res);
        	});
        }
    },
    print(o_param){
        if(Com.DEBUG){
            console.log('打印成功');
        }else{
    	   CashBoxAndroid.print(JSON.stringify(o_param));
        }
    },
    cancle(o_param,f_callBack){
        if(Com.DEBUG){
            f_callBack({code:0,msg:'success'});
        }else{
            CashBoxAndroid.cancleOrder(o_param).then((res)=>{
                Com.log(res);
                f_callBack(res);
            });
        }
    }
};
export default o_boxPay;
