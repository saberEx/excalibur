/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
if(Com.getBrowserType() != 3){
	require("showcase_selectionCss");
}
class ShowcaseSelection extends React.Component {
	render() {
		let {title,style,list=[],body_title,body_desc} = this.props.data;
		var e_list = null;
		e_list = list.map((item,key)=>{
			let {link_url,img_url} = item;
			var s_li = `custom-showcase-${key===0?"big":"small"}`;
			return (
				<li className={s_li} key={key}>
					<a onClick={()=>Com.openWin(link_url)}>
						<img src={img_url} />
					</a>
				</li>
				);
		});
		return <div className="showcase_selection com-diyControl">
			<div className="custom-showcase-wrap-title base-ellipsis">
				<hr className="newHr" />
				<span className="newSpan">{title}</span>
			</div>
			<div className={`custom-showcase-wrap-${style}`}>
				<ul className="custom-showcase base-clearfix">
					{e_list}
				</ul>
			</div>
			<div className="showcase-body-title base-ellipsis">{body_title}</div>
			<p className="showcase-body-desc ellipsis">{body_desc} </p>
		</div>
	}
}
module.exports = ShowcaseSelection;

