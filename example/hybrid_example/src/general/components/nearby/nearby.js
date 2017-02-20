/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("nearbyCss");
const shop_img_url = Com.getStorage('shop_img_url');
class Nearby extends React.Component {
	render() {
		let e_list = null;
		let list = Com.getLocalData('locationData');
		var shop_img_url = Com.getLocalData('shop_img_url');
		if(!list || (typeof(list)=="object" && (!list.hasOwnProperty("length") || list.length ==0)) ){
			return null;
		}
		e_list = list.map((item,key)=>{
			let {shop_id,shop_img,shop_address,shop_name,distance} = item;
			return (
				<li shop_id={shop_id} key={key}>
			<img className="store_img" src={shop_img_url+shop_img} />
			<div className="nearby_info">
				<h2 className="store_name">
					{shop_name}<em>{parseInt(distance/1000)}Km</em>
					</h2>'+
				<p className="mui-ellipsis">{shop_address}</p>
				</div>
			</li>
			);
		});
		return <div className="nearby com-diyControl">
					<h3>附近门店</h3>
					<ul >
						{e_list}
					</ul>
				</div>;
	}
}
module.exports = Nearby;
