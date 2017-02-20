/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2016-11-22 18:28:51
*/

'use strict';
require('voteDesCss');

class VoteDes extends React.Component {
	render() {
		return (
			<div className="remark">
                <div className="remark_box">
                    <p>
                        {this.props.info}
                    </p>
                </div>
            </div>
		);
	}
}
module.exports = VoteDes;




