/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
//关联链接
'use strict';
require("linkCss");
class Link extends React.Component {
	render() {
		let {list} = this.props.data;
		var e_list = null;
		e_list = list.map((item,key)=>{
			let {title,goods_list=[],url,source_type} = item;
			if(source_type && source_type==="link"){
				return (
					<li key={key}>
						<a className="clearfix base-clearfix" onClick={(event)=>{Com.openWin(url);event.stopPropagation();}}>
							<span className="custom-nav-title ellipsis">{title}</span>
							<i className="icon-chevron-right"></i>
						</a>
					</li>
				);
			}else{
				var e_goodList = null;
				e_goodList = goods_list.map((item,key)=>{
					let {goods_alias,goods_name} = item;
					let linkParam = (goods_alias && {goods_alias}) || {};
					return (
						<li key={key}>
							<a className="clearfix base-clearfix" onClick={(event)=>{Com.openWin("goodDetails",linkParam);event.stopPropagation();}}>
							<span className="custom-nav-title ellipsis">{goods_name}</span>
							<i className="icon-chevron-right"></i>
							</a>
					</li>
					);
				});
				return e_goodList;
			}
		});
		return <div className="link com-diyControl">
					<ul>
						{e_list}
					</ul>
				</div>;
	}
}
module.exports = Link;

