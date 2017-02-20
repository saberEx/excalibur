/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-26 09:25:10
* 折叠Item
* 使用方法：<FoldItem o_params={{"id":1}} f_callBack={self.f_hander} i_state = {1} s_title={'标题'} />
*/

'use strict';
require('foldItemCss');
var classSet = require('classnames');
class foldItem extends React.Component{
	constructor(props){
		super(props);
		this.state={
			b_isOpen:false,
			i_state:this.props.i_state
		}
	}
	static propTypes = {
		s_title : React.PropTypes.string.isRequired,//标题
		i_state : React.PropTypes.number,//当前状态
		f_callBack : React.PropTypes.func,//展开回调
		o_params : React.PropTypes.object,//回调参数
	}
	f_clickHandler(){
		this.setState({b_isOpen:!this.state.b_isOpen,i_state:1});
		if(this.props.i_state === 0 && this.props.f_callBack){
			this.props.f_callBack(this.props.o_params);
		}
	}
	render(){
		let s_classSet = classSet({"fold-group":true,"open":this.state.b_isOpen});
		let s_menuClassSet = classSet("base-after-line",{"fold-menu":true});
		let e_tips = (this.state.i_state === 0) ? (<i className="msg-tips"></i>) : "";
		return (
			<div className="foldItem">
				<div className={s_classSet}>
					<div className={s_menuClassSet} onClick={this.f_clickHandler.bind(this)}>
						{e_tips}
						<span className="msgTitle">{this.props.s_title}</span>
						<i className="base-iconUp"></i>
					</div>
					<div className="fold-conent base-after-line base-line-left">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}
module.exports = foldItem;
