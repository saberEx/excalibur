/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2016-11-22 17:51:54
*/

'use strict';
require('voteHeaderCss');

class VoteHeader extends React.Component {
	render() {
		return (
			<div className="header">
                <h1 id="voteTitle">{this.props.title}</h1>
            </div>
		);
	}
}
module.exports = VoteHeader;
