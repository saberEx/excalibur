/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("rich_textCss");
class RichText extends React.Component {
	componentDidMount(){
		this.refs.richText.innerHTML = this.props.data.richData;
	}
	render() {
		let {color,richData} = this.props.data;

		return <div className="rich_text" style={{backgroundColor:color}}>
					<div ref="richText" className="custom-richtext"></div>
					<div className="component-border"></div>
				</div>
	}
}
module.exports = RichText;

