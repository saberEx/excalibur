'use strict';
import Com from './common';
import Component from './member_search_list.component';
import BaseManager from './baseManager';

const {ACTION_507,ACTION_508} = Com;
const PAGESIZE = 15;
export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"member_search_list");
        let _manager = this;
        //初始状态
        this.initialState={
            pageType : 0,
            a_data:[],
            a_hasMore:[],
            tabIndex:-1,
        };
        //动作
        this.actions = {
            init(){
                return (dispatch, getState) => {
                    let pageType = parseInt(Com.getPageParams('type'));
                    _manager.memberId = Com.getPageParams('member_id');
                    Com.getVerify({act:'member_pos',op:'get_expense_list',memberId:_manager.memberId,type:pageType,pagesize:PAGESIZE},(res)=>{
                        let {code,data} = res;
                        if (parseInt(code) === 0) {
                            let {list} = data;
                            let {hasmore} = data.page;
                            let a_data = [{},{},{}];
                            list.forEach((item,index)=>{
                                let cur_month = Com.getTimeFormat(item.add_time).replace(/\-\d{2}/,'');
                                a_data[pageType][cur_month] = a_data[pageType][cur_month] || [];
                                a_data[pageType][cur_month].push(item);
                            });
                            let tabIndex = pageType;
                            dispatch({ type : ACTION_507 , a_data,hasmore,tabIndex});
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
                        dispatch({ type : ACTION_508 ,curIndex:index});
                    }else {
                        //请求当前tab位置的数据
                        Com.getVerify({act:"member_pos",op:"get_expense_list",memberId:_manager.memberId,type:index,pagesize:PAGESIZE},(res)=>{
                            let {code,data,msg} = res;
                            if(code===0){
                                let {list} = data;
                                let curData = {};
                                let {hasmore} = data.page;
                                list.forEach((item,key)=>{
                                    let cur_month = Com.getTimeFormat(item.add_time).replace(/\-\d{2}/,'');
                                    curData[cur_month] = curData[cur_month] || [];
                                    curData[cur_month].push(item);
                                });
                                dispatch({ type : ACTION_508 , curData : curData,curIndex:index,hasmore});
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
                    Com.getVerify({act:"member_pos",op:"get_expense_list",memberId:_manager.memberId,type:tabIndex,curpage:page,pagesize:PAGESIZE},(res)=>{
                        let {code,data,msg} = res;
                            if(code===0){
                                let {hasmore} = data.page;
                                let {list} = data;
                                list.forEach((item,key)=>{
                                    let {add_time} = item;
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
        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_507:{
                    let {a_data,hasmore,tabIndex} = action;
                    let a_hasMore = [];
                    a_hasMore[tabIndex] = hasmore;
                    return { ...state , ...this.initialState , a_data,a_hasMore ,tabIndex};
               }
               case ACTION_508:{
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
               default:
                   return state;
            }
        };
    }
}
