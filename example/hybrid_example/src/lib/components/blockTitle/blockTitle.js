/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-19 09:41:28
* 块级标题，如有子元素会自动缩进
* 用法：
* 	<BlockTitle s_title="blockTitle标题" b_after={true} onClick={this._click}>
 		内容
		<img src={imgSrc}/>
	</BlockTitle>
*/

'use strict';
require("blockTitleCss");
var classSet = require('classnames');
class BlockTitle extends React.Component{
	static propTypes = {
		s_title:React.PropTypes.string.isRequired,//标题
		onClick:React.PropTypes.func,//标题栏点击
		b_after:React.PropTypes.bool,//是否有右箭头
	}
	render(){
		let s_cls = classSet({'base-iconRight':this.props.b_after});
		let e_child = null;
		if(this.props.children){
			e_child = <div className="content">
						 <div className="content-wrap">
							{this.props.children}
						 </div>
					</div>;
		}
	 	return (
 			<div className={"blockTitle"}>
 				<div className="title" onClick = {this.props.onClick}>
 					<h3 className={s_cls}>{this.props.s_title}</h3>
 				</div>
 				{e_child}
 			</div>
	 	);
	}
}
module.exports = BlockTitle;
