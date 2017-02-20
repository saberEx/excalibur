'use strict';
import Com from './common';
import Component from './statistic_sellInfo.component';
import BaseManager from './baseManager';
import BoxPay from './boxPay';

const {ACTION_601} = Com;

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"statistic_sellInfo");
        let _manager = this;
        _manager._list = [];
        //初始状态
        this.initialState={
            list:[]
        };
        //动作
        this.actions = {
            requestList(startTime,endTime,self){
                return (dispatch, getState) => {
                    console.log(startTime,endTime);
                    Com.getVerify({act:'sell',op:'index',startTime:startTime,endTime:endTime},(res)=>{
                        let {code,data} = res;
                        if(code === 0){
                            self._startTime = startTime;
                            self._endTime = endTime;
                            let dataDic = {};
                            let list = data.list || [];
                            _manager._list = list;
                            list.map((item,index)=>{
                                let {gc_id,goods_commonid} = item;
                                dataDic[gc_id] = dataDic[gc_id] || {};
                                dataDic[gc_id][goods_commonid] = dataDic[gc_id][goods_commonid] || [];
                                dataDic[gc_id][goods_commonid].push(item);
                            });
                            dispatch({type:ACTION_601,data:dataDic});
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            },
            print(self){
                return (dispatch, getState) => {
                    let data = {};
                    data.type = 1;
                    data.title = '销售情况';
                    let _startLabel = Com.getTimeFormat(self._startTime,2).replace(/\:\d{2}$/,"");
                    let _endLabel = Com.getTimeFormat(self._endTime,2).replace(/\:\d{2}$/,"");
                    data.subTitle = `时间： ${_startLabel} 到 ${_endLabel}`;
                    data.keys = [];
                    _manager._list.map((item,key)=>{
                        let {gc_id,gc_name,goods_name,order_add_time,ordergamount,ordergoodsnum} = item;
                        data[gc_id] = data[gc_id] || {};
                        data[gc_id].gc_name = gc_name;
                        data[gc_id].list = data[gc_id].list || [];
                        data[gc_id].list.push({goods_name,order_add_time:Com.getTimeFormat(order_add_time,2),ordergamount,ordergoodsnum});
                        data.keys.push(gc_id);
                    });
                    BoxPay.print(data);
                };
            }
        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_601:{
                    return {...state,data:action.data};
                }
                default:
                   return state;
            }
        };
    }
}
