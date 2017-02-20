/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-20 09:29:27
*/
'use strict';
require("navCss");
class Nav extends React.Component {
	render() {
		let {list} = this.props.data;
		var e_list = null;
		e_list = list.map((item,key)=>{
			let {link,img_url,title} = item;
			return (
				<li key={key}>
					<a onClick={()=>Com.openWin(link.url)}>
						<span className="nav-img-wap">
							<img src={img_url} />
						</span>
						<span className="base-ellipsis">{title}</span>
					</a>
				</li>
			);
		});
		return <div className="nav com-diyControl">
				<ul>
					{e_list}
				</ul>
			</div>;
	}
}
module.exports = Nav;
