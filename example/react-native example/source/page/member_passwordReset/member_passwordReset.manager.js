'use strict';
import Com from './common';
import Component from './member_passwordReset.component';
import BaseManager from './baseManager';

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"member_passwordReset");
        let _manager = this;
        //动作
        this.actions = {
            updatePwd(self){
                return (dispatch, getState) => {
                    let password = self.refs.password.value;
                    let repassword = self.refs.repassword.value;
                    let member_id = Com.getPageParams('member_id');
                    if(!(/^\d{6}$/.test(password))){
                        Com.toast('请输入正确的新密码，密码只能是6位数字');
                    }else if (password !== repassword) {
                        Com.toast('两次输入不一致');
                    }else{
                        Com.postVerify({act:'member_pos',op:'reset_pwd',password:password,repassword:repassword,memberId:member_id},(res)=>{
                            if(res.code === 0){
                                Com.closeWin();
                            }else{
                                Com.toast(res.msg);
                            }
                        });
                    }
                };

            },
        };
    }
}
