/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-11-29 16:25:07
*/

'use strict';
require('voteListCss');

class VoteList extends React.Component {
	goDetail(oid){
		Com.openWin("apps_payvote_vote_detail",{roundid:this.props.roundid,oid:oid});
	}
	render() {
		let self = this;
		var item = this.props.list.map(function(item,key){
			return <li key={key}>
				<div className="logo-img">
                    <img src={item.logourl} alt=""/>
                    <span className="vote-num">{item.total_vote}</span>
                </div>
                <div className="info">
                    <p>{item.oname}</p>
                    <p>{item.total_vote} 票</p>
                    <a href="javascript:void(0);" onClick={()=>self.goDetail(item.oid)} className="btn_vote">投票</a>
                </div>
			</li>;
		})
		return (
			<div className="rankList">
                <ul id="rankUl">
                    {item}
                </ul>
            </div>
		);
	}
}
module.exports = VoteList;




