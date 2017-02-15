/*
 * @Author: {daihanqiao}
 * @Date:   2015-12-25 16:40:55
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-10-27 11:30:51
 * 计时器工具
 * 用法：
 * var Timing = require('timing');
 * Timing.start(10,function(value){
 * console.log(value
 * )},1);
 */
"use strict";
var i_interval = null;
var i_curTime = 0;
class Timing {
    constructor(){
        this.i_interval = null;
        this.i_curTime = 0;
    }
    //i_totalTime：总时间，f_callBack：执行回调，i_intervalTime：间隔时间，b_promptCall：立即执行回调函数
    start(i_totalTime,f_callBack,i_intervalTime,b_promptCall){
        i_intervalTime = i_intervalTime || 1;
        i_intervalTime = i_intervalTime * 1000;
        i_totalTime = i_totalTime || 0;
        i_totalTime = i_totalTime * 1000;
        this.i_curTime = 0;
        if(b_promptCall){
            f_callBack((i_totalTime - this.i_curTime)/1000);
        }
        let self = this;
        this.i_interval = window.setInterval(function(){
            self.i_curTime += i_intervalTime;
            if(i_totalTime >= self.i_curTime){
                f_callBack((i_totalTime - self.i_curTime)/1000);
            }else{
                if(self.i_interval){
                    window.clearInterval(self.i_interval);
                }
            }
        },i_intervalTime);
    }
    stop(f_callBack){
        if(this.i_interval){
            window.clearInterval(this.i_interval);
        }
        if(f_callBack){
            f_callBack();
        }
    }
}
module.exports = Timing;
