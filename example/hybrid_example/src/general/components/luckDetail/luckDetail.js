/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-10-19 11:44:21
*/

'use strict';
require('luckDetailCss');
var BlockTitle = require('blockTitle');
class LuckDetail extends React.Component {
	componentDidMount(){
		this.refs.intro.innerText = this.props.data || "";
	}
	render() {		
		return (
			<div className="luckDetialCont">
                <BlockTitle s_title={"活动说明"}>
					<div>
						<p ref="intro">
						</p>
					</div>
                </BlockTitle>
            </div>
		);
	}
}
module.exports = LuckDetail;




