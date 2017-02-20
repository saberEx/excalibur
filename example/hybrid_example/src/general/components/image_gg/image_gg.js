/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-19 11:57:05
*/
'use strict';
require("image_ggCss");
let Slider = require("slider");
let {Component} = React;
class Image_gg extends Component {
	_onClick(linkHref,event){
		event.stopPropagation();
		if(linkHref){
			Com.openWin(linkHref);
		}
	}
	render(){
		let {image_list,image_type,image_style} = this.props.data;
		let e_list = null;
		e_list = image_list.map((item,key)=>{
			let {title,image_url,link} = item;
			let e_h = null;
			if(title){
				e_h = <div className="title base-ellipsis">{title}</div>;
			}
			return <li key={key} className={parseInt(image_type)===1?"custom-image-small":""} onClick={(event)=>this._onClick(link.url,event)}>
					{e_h}
					<img src={image_url.replace(/_\d+\./,".")} />
				</li>
		});
		return (
			<div className="image_gg com-diyControl">
			{parseInt(image_style)===1?<ul>
				{e_list}
			</ul>:
				<Slider i_time={5} b_bullet={true}>
					{e_list}
				</Slider>}
			</div>
		);
	}
}
module.exports = Image_gg;
