'use strict';
import Com from './common';
import Component from './statistic_order.component';
import BaseManager from './baseManager';

const {ACTION_603,ACTION_604,ACTION_605} = Com;
const PAGESIZE = 15;
export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"statistic_order");
        let _manager = this;
        _manager.o_componentRefs = null;
        //初始状态
        this.initialState={
            a_data:[],
            a_hasMore:[],
            tabIndex:0,
        };
        //动作
        this.actions = {
            init(){
                return (dispatch, getState) => {
                    Com.getVerify({act:'order',op:'order_finish',shop_order_state:0,pagesize:PAGESIZE},(res)=>{
                        let {code,data} = res;
                        if (parseInt(code) === 0) {
                            let {order_list} = data;
                            let {hasmore} = data.page;
                            let a_data = [{},{}];
                            order_list.forEach((item,index)=>{
                                let cur_month = Com.getTimeFormat(item.add_time);
                                a_data[0][cur_month] = a_data[0][cur_month] || [];
                                a_data[0][cur_month].push(item);
                            });
                            dispatch({ type : ACTION_603 , a_data,hasmore });
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            },
            //tab切换回调
            tabViewChange(index,curEl){
                return (dispatch, getState) => {
                    if(curEl){
                        dispatch({ type : ACTION_604 ,curIndex:index});
                    }else {
                        //请求当前tab位置的数据
                        Com.getVerify({act:'order',op:'order_finish',shop_order_state:index,pagesize:PAGESIZE},(res)=>{
                            let {code,data,msg} = res;
                            if(code===0){
                                let {order_list} = data;
                                let curData = {};
                                let {hasmore} = data.page;
                                order_list.forEach((item,key)=>{
                                    let cur_month = Com.getTimeFormat(item.add_time);
                                    curData[cur_month] = curData[cur_month] || [];
                                    curData[cur_month].push(item);
                                });
                                dispatch({ type : ACTION_604 , curData : curData,curIndex:index,hasmore});
                            }else {
                                Com.toast(msg);
                            }
                    });
                }};
            },
            //分页上拉加载回调
            f_paginate(page,callback){
                return (dispatch, getState) => {
                    let {a_data,tabIndex,a_hasMore} = _manager.getCurState();
                    let curData = a_data[tabIndex];
                    Com.getVerify({act:'order',op:'order_finish',shop_order_state:tabIndex,pagesize:PAGESIZE},(res)=>{
                        let {code,data,msg} = res;
                            if(code===0){
                                let {hasmore} = data.page;
                                let {order_list} = data;
                                order_list.forEach((item,key)=>{
                                    let cur_month = Com.getTimeFormat(item.add_time).replace(/\-\d{2}/,'');
                                    curData[cur_month] = curData[cur_month] || [];
                                    curData[cur_month].push(item);
                                });
                                a_hasMore[tabIndex] = hasmore;
                                callback(curData,{allLoaded:!hasmore});
                            }else {
                                Com.toast(msg);
                            }
                    },true);
                };
            },
            //更新保存组件的refs
            f_updateRefs(refs){
                return (dispatch, getState) => {
                    _manager.o_componentRefs = refs ;
                };
            }
        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_603:{
                    let {a_data,hasmore} = action;
                    let a_hasMore = [];
                    a_hasMore[0] = hasmore;
                    return { ...state , ...this.initialState , a_data,a_hasMore};
               }
               case ACTION_604:{
                    let {curData,curIndex,hasmore} = action;
                    let {a_data,tabIndex,a_hasMore} = state;
                    tabIndex = curIndex;
                    if(curData){
                        a_hasMore[tabIndex] = hasmore;
                        a_data[tabIndex] = curData;
                        return { ...state,a_data: a_data,tabIndex:curIndex,a_hasMore};
                    }
                    return { ...state,a_data: a_data.concat(),tabIndex:curIndex,a_hasMore};
                }
                case ACTION_605:{
                    let {order_id,sectionID,rowID} = action;
                    let {a_data} = state;
                    let data = a_data[0][sectionID].splice(rowID,1)[0];
                    if(a_data[0][sectionID].length===0){
                        delete a_data[0][sectionID];
                    }
                    if(_manager.o_componentRefs && _manager.o_componentRefs[`myListView_0`]){
                        _manager.o_componentRefs[`myListView_0`].f_updateRows(a_data[0]);
                    }
                    if(a_data[1]){
                        a_data[1][sectionID] = a_data[1][sectionID] || [];
                        data.shop_order_state = "1";
                        a_data[1][sectionID].push(data);
                        if(_manager.o_componentRefs && _manager.o_componentRefs[`myListView_1`]){
                            _manager.o_componentRefs[`myListView_1`].f_updateRows(a_data[1]);
                        }
                    }
                    return { ...state,a_data:a_data.concat()};
                }
               default:
                   return state;
            }
        };
    }
}
