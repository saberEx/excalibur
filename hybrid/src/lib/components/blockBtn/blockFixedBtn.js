/*
* @Author: 代汉桥
* @Date:   2016-08-03 09:59:53
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-08-03 10:13:50
*/

'use strict';
var BlockBtn = require('blockBtn');
require('blockBtnCss');
var BlockFixedBtn = React.createClass({
	propTypes:{
		onClick:React.PropTypes.func.isRequired,
		s_label:React.PropTypes.string.isRequired
	},
	render:function(){
		return (
			<div className="blockFixedBtn">
				<BlockBtn onClick={this.props.onClick} s_label={this.props.s_label}/>
			</div>
		);
	}
});
module.exports = BlockFixedBtn;
