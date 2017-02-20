/*
* @Author: 代汉桥
* @Date:   2016-12-06 11:04:26
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-06 16:36:02
*/

'use strict';
require('voucheItemCss');
let CommonDefault = require('commonDefaultImg');
class VoucheItem extends React.Component{
	render(){
		let data = this.props.data;
		let end_time = data.end_time;
		end_time = end_time ? Com.getTimeFormat(end_time) : '永久有效';
		return (
			<section className="voucheItem base-clearfix" onClick={this.props.callBack}>
			    <div className="img_wr">
			        <img src={data.logo_url} onError={(ev)=>ev.target.src=CommonDefault}></img>
			    </div>
			    <div className="dot_wp"></div>
			    <div className="info_content">
			        <h2>{data.card_name}</h2>
			        <p>
			            <span className="base-fl">{data.store_name}</span>
			            <span className="base-fr">有效期至：{end_time}</span>
			        </p>
			    </div>
			</section>
		)
	}
}
module.exports = VoucheItem;
