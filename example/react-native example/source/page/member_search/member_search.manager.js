'use strict';
import Com from './common';
import Component from './member_search.component';
import BaseManager from './baseManager';
const {ACTION_503,ACTION_506} = Com;

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"member_search");
        let _manager = this;
        //初始状态
        this.initialState={
            memberData:null
        };
        //动作
        this.actions = {
            search(self){
                return (dispatch, getState) => {
                    let key = self._inputValue;
                    if(!key){
                        return;
                    }
                    self._searchInput.blur();
                    Com.getVerify({act:'member_pos',op:'get_card',key:key},(res)=>{
                        let {code,data} = res;
                        if(code === 0){
                            let {member_id} = data;
                            Com.setAlias("shopId"+member_id);
                            dispatch({type:ACTION_503,data:res.data});
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            },
            itemPress(pageName,type){
                return (dispatch, getState) => {
                    let memberData = _manager.getCurState("memberData");
                    memberData.type = type;
                    Com.log("跳转",memberData);
                    Com.openWin(pageName,memberData);
                };
            }
        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_503:{
                    return {...state,...this.initialState,memberData:action.data};
                }
                case ACTION_506:{
                    let memberData = {...state.memberData};
                    let data = action.data;
                    for(let key in data){
                        if(data.hasOwnProperty(key)){
                            if(key === 'card_balance' || key==="card_presentation"){
                                memberData[key] = parseFloat(memberData[key]) + parseFloat(data[key]);
                            }else{
                                memberData[key] = data[key];
                            }
                        }
                    }
                    return {...state,...this.initialState,memberData:memberData};
                }
                default:
                   return state;
            }
        };
    }
}
