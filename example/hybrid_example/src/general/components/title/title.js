/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("titleCss");
let {Component} = React;
let classSet = require("classnames");
class WxTitle extends Component {
	render() {
		let {title,wx_title_date,wx_title_author,wx_title_link,wx_link} = this.props.data;
		return <div className="custom-wx-title">
				<h2 className="wx_title">{title}</h2>
				<p className="sub_title">
					<span className="sub_title_data">{wx_title_date}</span>
					<span className="sub_title_author">{wx_title_author}</span>
					<a className="sub_title_link a_linkToPage" onClick={wx_link && wx_link.link_url && Com.openWin(wx_link.link_url)}>{wx_title_link}</a>
				</p>
			</div>
	}
}
class ComTitle extends Component {
	render() {
		let {show_method,title,sub_title,color,sub_entry=""} = this.props.data;
		let s_title = classSet("custom-ct-title",{"base-tc":parseInt(show_method)===1,"base-tr":parseInt(show_method)===2});
		let e_sub = null;
		if(sub_entry && sub_entry.title && title.length){
			e_sub = <span className="ct_span">-
				<a className="sub_title_link"  onClick={()=>{sub_entry.link && sub_entry.link.link_url && Com.openWin(sub_entry.link.link_url)}}>
					{sub_entry.title}
				</a>
			</span>;
		}
		return <div className={s_title} style={{backgroundColor:color}}>
			<h2 className="ct_title">{title}
				{e_sub}
			</h2>
			<p className="sub_title">
			<span className="sub_title_data">{sub_title}</span>
			</p>
			</div>
	}
}
class Title extends Component{
	render(){
		let {cur_style_type} = this.props.data;
		let Sub =parseInt(cur_style_type) == 0 ? ComTitle : WxTitle;
		return (
			<div className="title com-diyControl">
				<Sub data={this.props.data}/>
			</div>
		)
	}
}
module.exports = Title;
