/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-18 18:34:18
* 块级按钮
* 用法：<BlockBtn s_label="块级按钮" onClick={this._click}/>
*/

'use strict';
class BlockBtn extends React.Component{
	static propTypes = {
		onClick:React.PropTypes.func.isRequired,
		s_label:React.PropTypes.string.isRequired
	}
	render(){
		return (
			<div className="blockBtn">
				<div onClick={this.props.onClick} className="base-btn base-btn-main" style={{display:"block"}}>
					{this.props.s_label}
				</div>
			</div>
		);
	}
}

module.exports = BlockBtn;
