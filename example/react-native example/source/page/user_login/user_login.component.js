'use strict';
import React,{ Component } from 'react';
import { View , Text,Image } from 'react-native';
import Com from './common';
import {TopBar,Input,Button} from './components';
//logo图片
const logoUrl = require("./logo.png");
//样式
import o_styles from './user_login.style';
const {logoImage,containerPadding,mBottomCom,btnStyle,bottonImg} = o_styles;
//页面组件
class User_login extends Component {
	componentDidMount(){
		this.props.autoLogin();
	}
	render() {
		return (
			<View style={Com.baseFlex}>
				<View style={[Com.baseContent,Com.baseCenter]}>
					<Image style={logoImage} source={logoUrl}/>
					<View style={containerPadding}>
						<Input ref="name" style={mBottomCom}  placeholder="用户名"  />
						<Input ref="password" password={true}  style={mBottomCom} placeholder="密码"  />
						<Button style={btnStyle}
							text="确定"
							onPress = {()=>this.props.login(this)}
						/>
					</View>
				</View>
				<TopBar s_title="用户登录" s_leftIcon={null}/>
				<Image style={bottonImg} source={require('./login_bottomImage.png')}/>
			</View>
		);
	}
}
export default User_login;
