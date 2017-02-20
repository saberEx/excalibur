/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-14 09:49:16
*/

'use strict';
require('addGoodsNumCss');
let NumBox = require('numBox');

class AddGoodsNum extends React.Component {
	get value(){
		return this.refs.numbox.value;
	}
	render() {
		return (
			<div className="addGoodsNum">
                {this.props.s_tit}<NumBox f_callBack={this.props.f_callBack} i_value={parseInt(this.props.i_value) || 0} ref="numbox" i_max={parseInt(this.props.i_max)||0} i_min={parseInt(this.props.i_min)||0}/>
            </div>
		);
	}
}
module.exports = AddGoodsNum;




