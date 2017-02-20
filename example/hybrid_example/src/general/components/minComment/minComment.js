/*
 * @Author: 程巨龙
 * @Date:   2016-10-25 16:07:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-07 17:27:22
 */
'use strict';
require('minCommentCss');
let ShafaImg = require('shafaImg');
let ZanImg = require('zanIconImg');
let CommentImg = require('commentIconImg');
let MaleIconImg = require('maleIconImg');
let FemaleIconImg = require('femaleIconImg');
let userImg = require("userDefaultImg");
let cancelZanImg = require('cancleZanImg');
class Item extends  React.Component {
    constructor(props){
        super(props);
        let {post_heats,p_praise_id} = this.props.data;
        p_praise_id = (p_praise_id === false || p_praise_id === "false")? 0 : p_praise_id;
        this.state = {
            i_heats:post_heats || 0,
            praiseId : p_praise_id
        };
    }
    f_zan(pid){
        let {praiseId,i_heats} = this.state;
        if(praiseId === 0){
            Com.postVerify({act:'bbs_post',op:'post_heats',pid:pid},(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({praiseId:res.data.p_praise_id,i_heats:parseInt(i_heats)+1});
                }else{
                    Com.toast(res.msg);
                }
            });
        }else {
            Com.postVerify({act:'bbs_post',op:'post_heats',pid:pid,p_praise_id:praiseId},(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({praiseId:0,i_heats:parseInt(i_heats)-1});
                }else{
                    Com.toast(res.msg);
                }
            });
        }
    }
    render(){
        let {member_name='',member_avatar,bbs_level=0,member_sex,content,dateline,pid,pos} = this.props.data;
        let {praiseId,i_heats} = this.state;
        bbs_level = bbs_level || 0;
        return (
            <li className="base-after-line">
                <img className="replyUserIcon" src={member_avatar || userImg}  onError={(ev)=>{ev.target.src=userImg}}/>
                <div className="replyWrap">
                    <div className="replyOne">
                        <span className="replyName">{Com.replaceName(member_name)} <em className="rLevel">LV.{bbs_level}</em></span>
                        {member_sex != 2 ? <img className="sex" src={MaleIconImg} /> : <img className="sex" src={FemaleIconImg} />}
                        <span className="replyLandlord base-fr">{pos}楼</span>
                    </div>
                    <div className="replyTwo" dangerouslySetInnerHTML={{__html:content}}>
                    </div>
                    <div className="replyThree">
                        <em className="base-fl">{dateline}</em>
                        <span className="cardZan" onClick={()=>this.f_zan(pid)}><img src={praiseId>0?cancelZanImg:ZanImg} /><em>{i_heats}</em></span>
                        {/*<span className="cardGood"><img src={CommentImg}/><em></em></span>*/}
                    </div>
                </div>
            </li>
        )
    }
}
class MinComment extends React.Component{
	render(){
        let {data} = this.props;
        let contInfo = null;
        let e_empty = null;
        if(data.length > 0){
            contInfo = data.map(function(res,key){
                return <Item key={key} data={res}/>
            });
        }else{
            e_empty = <div className="noReply">
                <img src={ShafaImg} />
                <p>暂无评论，快来抢沙发！</p>
            </div>;
        }

		return (
            <div className="replyContent">
                {e_empty}
                <ul className="replyList">
                    {contInfo}
                </ul>
            </div>
		);
	}
};
module.exports = MinComment;
