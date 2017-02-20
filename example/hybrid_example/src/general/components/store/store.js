/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("storeCss");
class Store extends React.Component {
	render() {
		let {store_url,store_name,store_enter} = this.props.data;
		return <div className="store com-diyControl">
				<a className="custom-store-link base-clearfix" onClick={()=>Com.openWin(store_url)}>
					<div className="custom-store-img"></div>
					<div className="custom-store-name">{store_name}</div>
					<div className="custom-store-enter"> {store_enter} <i className="icon-chevron-right"></i></div>
				</a>
			</div>
	}
}
module.exports = Store;
