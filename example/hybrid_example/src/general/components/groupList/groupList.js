/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-06 11:08:18
* 参团列表
*/

'use strict';
require('groupListCss');
let userImg = require("userDefaultImg");
let GroupList = React.createClass({
	render:function(){
        var array;
        var spell_number=this.props.data.spell_info.spell_number;
        var open_total=this.props.data.open_total;

        if (this.props.data.open_list) {
            array=this.props.data.open_list.map(function(val,key){
               return <li className="base-after-line" key={key}>
                    <img className="userImg" src={val.member.member_avatar || userImg} onError={(ev)=>ev.target.src=userImg}/>
                    <span>{Com.replaceName(val.member.member_name)} { val.is_open_head =='1' ? <img className="userColonel" src={require('colonel_iconImg')} alt=""/>:"" }</span>
                    <span className="base-fr">{val.open_addtime}<em>{  val.is_open_head =='1'?'开团':'参团' }</em></span>
                </li>;
            })
        };
        let n = spell_number-open_total;
        return(
        	<div className="gMenber">
                <div className="lineWarp">
                    <div className="partake">已有<em>{open_total}</em>人参团，还要<em>{parseInt(n) < 0 ? 0 : n}</em>人</div>
                </div>
                <ul className="menberList">
                    {array}
                </ul>
            </div>
        );

	}
});
module.exports = GroupList;
