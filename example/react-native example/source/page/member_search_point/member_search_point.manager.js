'use strict';
import Com from './common';
import Component from './member_search_point.component';
import BaseManager from './baseManager';

const {ACTION_509} = Com;
const PAGESIZE = 15;

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"member_search_point");
        let _manager = this;
        //初始状态
        this.initialState={
            o_data:{},
            b_hasMore:false,
        };
        //动作
        this.actions = {
            init(){
                return (dispatch, getState) => {
                    _manager.memberId = Com.getPageParams('member_id');
                    Com.getVerify({act:'member_pos',op:'get_points',memberId:_manager.memberId,type:0,pagesize:PAGESIZE},(res)=>{
                        let {code,data} = res;
                        if (parseInt(code) === 0) {
                            let {list} = data;
                            let {hasmore} = data.page;
                            let o_data = {};
                            list.forEach((item,index)=>{
                                let cur_month = Com.getTimeFormat(item.pl_addtime).replace(/\-\d{2}/,'');
                                o_data[cur_month] = o_data[cur_month] || [];
                                o_data[cur_month].push(item);
                            });
                            dispatch({ type : ACTION_509 , o_data,hasmore});
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            },
            //分页上拉加载回调
            f_paginate(page,callback){
                return (dispatch, getState) => {
                    let {o_data} = _manager.getCurState();
                    Com.getVerify({act:"member_pos",op:"get_points",memberId:_manager.memberId,type:0,curpage:page,pagesize:PAGESIZE},(res)=>{
                        let {code,data,msg} = res;
                            if(code===0){
                                let {hasmore} = data.page;
                                let {list} = data;
                                list.forEach((item,key)=>{
                                    let {add_time} = item;
                                    let cur_month = Com.getTimeFormat(item.add_time).replace(/\-\d{2}/,'');
                                    o_data[cur_month] = o_data[cur_month] || [];
                                    o_data[cur_month].push(item);
                                });
                                callback(o_data,{allLoaded:!hasmore});
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
                case ACTION_509:{
                    return {...state,...this.initialState,o_data:action.o_data,b_hasMore:action.hasmore};
                }
                default:
                   return state;
            }
        };
    }
}
