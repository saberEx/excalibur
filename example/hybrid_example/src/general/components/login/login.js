/*
* @Author: 代汉桥
* @Date:   2016-08-13 18:36:21
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-19 11:33:56
*/

'use strict';
let e_loginCon = null;
let BlockInput = require('blockInput');
let BlockBtn = require('blockBtn');
require('loginCss');

class Login extends React.Component {
	_clickHandler(){
		// let self = this;
		let mobileNum = this.refs.mobileNum.getValue();
		let password = this.refs.password.getValue();
		if(!Base.checkMobile(mobileNum)){
            return Base.toast('请输入正确的手机号');
        }
        if(!password){
            return Base.toast('请输入正确的密码');
        }
        Base.getNormal({act:'member_connect',op:'login',from:'web',type:3,mode:1,mobile:mobileNum,password:password,deviceId:Base.getDeviceId()},function(res){
			if(res.code == 0){
				let date = new Date();
				date.setTime(date.getTime() + 60 * 60 * 1000);
				document.cookie = `member_id=${res.member_id};expires=${date.toUTCString()}`;
				document.cookie = `member_wx_login=1;expires=${date.toUTCString()}`;
				Base.reload();
			}else{
			    Base.toast(res.msg);
			}
		})
	}
	render(){
		return (
			<div className='login'>
				<div className='login-bg'></div>
				<div className='login-fixed'>
					<h3>登 录</h3>
					<BlockInput ref='mobileNum' s_placeholder='请输入手机号'/>
					<BlockInput ref='password' s_placeholder='请输入6-16位密码' s_inputType="password"/>
					<BlockBtn s_label='确 定' onClick={()=>this._clickHandler()}/>
				</div>
			</div>
		)
	}
}

module.exports = {
	show(b_reload){
		if(!e_loginCon){
			e_loginCon = document.createElement('div');
			e_loginCon.style.zIndex = 20000;
			e_loginCon.style.position = "fixed";
			e_loginCon.addEventListener('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
			e_loginCon.addEventListener('mousemove',function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
			document.body.appendChild(e_loginCon);
		}
		ReactDOM.render(<Login b_reload={b_reload}/>,e_loginCon);
	},
};
