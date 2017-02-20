/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-21 10:23:56
*/

'use strict';
require('addressCss');
let classSet = require('classnames');

class AddRess extends React.Component {
	static propTypes = {
		callback:React.PropTypes.func,//回调
		b_right:React.PropTypes.bool,//是否有右箭头，默认有
	}
	static defaultProps = {
		b_right:true,
	}
	_clickHandler(data){
		this.props.callback && this.props.callback(data);
	}
	render() {
		let addRess = "";
		let data = this.props.data;
		let {true_name,mob_phone,area_info,address} = data;
		let true_address = area_info+address;
		if(this.props.b_address){
			let checkAddr = classSet("checkAddr_on",{"base-iconRight":this.props.b_right});
			addRess = <div className={checkAddr} onClick={()=>this._clickHandler(data)}>
	                    <img src={require('addres_sed_infoImg')} className="addrIcon base-transY"/>
	                    <div className="addrUser">
	                        收货人：{true_name || "暂无"} <span className="base-fr">{mob_phone}</span>
	                    </div>
	                    <div className="addrInfo">
	                        收货地址：{true_address || "暂无"}
	                    </div>
	                </div>;
		}else{
			let checkAddr = classSet("checkAddr_off",{"base-iconRight":this.props.b_right});
			addRess = <div className={checkAddr} onClick={()=>this._clickHandler(null)}>
                    <img className="addrIcon base-transY " src={require('addres_sed_infoImg')} />请选择收货地址
                </div>;
		}


		return (
			<div className="addrManage">
                {addRess}
            </div>
		);
	}
}
module.exports = AddRess;




