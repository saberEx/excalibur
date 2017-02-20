/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-19 11:20:27
*/
'use strict';
require("noticeCss");
const width = (/android/gi).test(navigator.appVersion)?document.body.clientWidth:window.screen.availWidth;
class Notice extends React.Component {
	render() {
		let {data} = this.props;

		return <div className="notice">
				<div className="custom-notice-inner">
					<div className="custom-notice-scroll">
						<marquee ref="marquee" direction="left" loop="-1" width={width} height="37" >
							{data}
						</marquee>
					</div>
				</div>
			</div>
	}
}
module.exports = Notice;

