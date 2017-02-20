'use strict';
import Com from './common';
import Component from './member_edit.component';
import BaseManager from './baseManager';
const {ACTION_505,ACTION_506} = Com;

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"member_edit");
        let _manager = this;
        //初始状态
        // this.initialState={
        // };
        //动作
        this.actions = {
            init(self){
                return (dispatch, getState) => {
                    Com.addNativeEvent("wxNotice",(wechat_nickname)=>{
                        self.setState({wxNickName:wechat_nickname});
                        dispatch({type:ACTION_506,data:{wechat_nickname:wechat_nickname}});
                    });
                    let member_id = Com.getPageParams("member_id");
                    Com.getVerify({act:'member_pos',op:'bind_wechat_qrcode',memberId:member_id},(res)=>{
                        let {code,data} = res;
                        if(code === 0){
                            dispatch({type:ACTION_505,url:data.url});
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            },
            editMessage(self){
                return (dispatch, getState)=> {
                    let memberId = Com.getPageParams('member_id');
                    let member_name = self.refs.member_name.value;
                    let member_mobile = self.refs.member_mobile.value;
                    let card_id = self.refs.card_id.value;
                    let member_sex = self.refs.member_sex.value;
                    if (!member_name) {
                        Com.toast('请输入会员名称');
                    }else if (!card_id) {
                        Com.toast('请输入会员卡号');
                    }else if(!Com.checkMobile(member_mobile)){
                        Com.toast('请输入正确的手机号');
                    }else {
                        Com.postVerify({act:'member_pos',op:'card_update',memberId:memberId,memberName:member_name,memberMobile:member_mobile,cardId:card_id,memberSex:member_sex},(res)=>{
                            if(res.code === 0){
                                Com.closeWin();
                                dispatch({type:ACTION_506,data:{member_id:memberId,member_name:member_name,member_mobile:member_mobile,card_id:card_id,member_sex:member_sex}});
                            }else{
                                Com.toast(res.msg);
                            }
                        });
                    }
                };
            }

        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_505:{
                    return {...state,url:action.url};
                }
                case ACTION_506:{
                    return {...state,data:action.data};
                }
                default:
                   return state;
            }
        };
    }
}
