/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
class White extends React.Component{
	render(){
		let {data} = this.props;
		return <div className="white" style={{height:`${data}px`,background:"#ffffff"}}>

				</div>;
	}
}
module.exports = White;
