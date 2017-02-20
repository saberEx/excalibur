'use strict';
import Com from './common';
import Component from './member_bindWechat.component';
import BaseManager from './baseManager';

const {ACTION_504} = Com;

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"member_bindWechat");
        let _manager = this;
        //初始状态
        //this.initialState={};
        //动作
        this.actions = {
            init(){
                return (dispatch, getState) => {
                    let memberId = Com.getPageParams('member_id');
                    Com.getNormal({act:'member_pos',op:'bind_wechat_qrcode',memberId:memberId},(res)=>{
                        if(res.code === 0){
                            dispatch({type:ACTION_504,url:res.data.url});
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            }
        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_504:{
                    return {state,url:action.url};
                }
                default:
                   return state;
            }
        };
    }
}
