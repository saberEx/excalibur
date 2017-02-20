/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
//栏目
'use strict';
require("columsCss");

class Colums extends React.Component {
	render() {
		let {fontColor,title} = this.props.data;
		return (
			<div className="colums com-diyControl">
				<h3 className="colums-title round base-ellipsis" style={{color:fontColor}}><i></i>{title}</h3>
			</div>
		);
	}
}
module.exports = Colums;

