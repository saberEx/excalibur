/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("text_navCss");
class TextNav extends React.Component {
	render() {
		let {list} = this.props.data;
		let {background} = this.props;
		var e_list = null;
		e_list = list.map((item,key)=>{
			let {link,title=""} = item;
			return (<li key={key}>
						<a className="clearfix " onClick={()=>{link && link.url && Com.openWin(link.url)}}>
							<span className="custom-nav-title base-ellipsis">{title}</span>
							<i className="icon-chevron-right"></i>
						</a>
					</li>);
		});
		return <div className="text_nav com-diyControl">
				<ul >
					{e_list}
				</ul>
			</div>;
	}
}
module.exports = TextNav;
