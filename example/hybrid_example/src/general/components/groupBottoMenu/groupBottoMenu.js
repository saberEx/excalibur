/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-12 13:57:35
* 参加拼团或者邀请朋友参加拼团（底部浮动菜单）
*/

'use strict';
require('groupBottoMenuCss');
let GoodShare = require('goodShare');
var GroupBottoMenu = React.createClass({
    propTypes:{
        f_callBack:React.PropTypes.func,//点击回调
        s_isShare:React.PropTypes.string,//是否分享
        b_over:React.PropTypes.bool,//是否结束  true为拼团结束
    },
    igroupClick:function(spell_id,alias){
        if (!this.props.b_over) {
            if (spell_id && alias) {
                Com.openWin('group_goodDetails',{goods_alias:alias,spell_id:spell_id,open_sn:this.props.open_sn});
            }else{
                this.props.f_callBack && this.props.f_callBack();
            }
        }
    },
    MyClick:function(e){
        Com.openWin('group_myGroup');
    },
    homeClick:function(e){
        Com.openWin('group_list');
    },
	render:function(){
        var info=this.props.data;
        var goods_info=this.props.data.goods_info;
        var spell_id = this.props.data.spell_id;
        var {s_isShare,b_over} = this.props;
        var btn;
        var style = "iGroup";
        if(b_over){
            style = "nGroup";
        }
        if (info.is_open == 1) {
            btn =<div className={style} onClick={this.igroupClick}>
                    邀请朋友参团
                </div>
        }else{
             btn =<div className={style}  onClick={this.igroupClick.bind(this,spell_id,info.spell_goods_alias)}>
                我要参团
            </div>
        }
        var e_item = "";
        if (s_isShare) {
            e_item =<div className="indexGroup" onClick={this.homeClick}>
                        <img src={require('group_indexImg')} alt=""/>
                        <span>拼团首页</span>
                    </div>;
        }else{
            e_item = <div>
                        <div className="mGroup" onClick={this.MyClick}>
                            <img src={require('my_groupImg')} alt=""/>
                            <span>我的拼团</span>
                        </div>
                        <div className="indexGroup" onClick={this.homeClick}>
                            <img src={require('group_indexImg')} alt=""/>
                            <span>拼团首页</span>
                        </div>
                     </div>
;
        }
        return(
        	<footer className="gMenu">
                {e_item}
                {btn}
            </footer>
        );

	}
});
module.exports = GroupBottoMenu;
