/*
 * @Author: 程矩龙
 * @Date:   2016-10-25 16:07:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-22 17:48:47
 */
'use strict';
require('minItemCss');
let MinImgList = require('minImgList');
let ZanImg = require('zanIconImg');
let cancelZanImg = require('cancleZanImg');
let userImg = require("userDefaultImg");
let commentImg = require('commentIconImg');
let NewsImg = require('newsIconImg');
class Item extends React.Component {
    constructor(props){
        super(props);
        let {heats,replies,t_praise_id} = this.props.data;
        t_praise_id = (t_praise_id === false || t_praise_id === "false")? 0 : t_praise_id;
        this.state = {
            i_heats:heats || 0,
            i_replies:replies || 0,
            praiseId : t_praise_id
        };
    }
    openDetail(tid){
        Com.openWin("apps_bbs_detail",{tid:tid});
    }
    f_zan(ev,tid){
        ev.stopPropagation();
        let o_param = {act:'bbs_thread',op:'status',tid:tid};
        let {praiseId,i_heats} = this.state;
        if(praiseId === 0){
            o_param["type"] = "h";
            Com.getVerify(o_param,(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({i_heats:parseInt(i_heats)+1,praiseId:res.data.t_praise_id});
                    Com.toast("点赞成功");
                } else {
                    Com.toast(res.msg);
                }
            });
        }else {
            o_param["type"] = "nh";
            o_param["t_praise_id"] = praiseId;
            Com.getVerify(o_param,(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({i_heats:parseInt(i_heats)-1,praiseId:0});
                    Com.toast("已取消点赞");
                } else {
                    Com.toast(res.msg);
                }
            });
        }
    }
    f_reply(ev,tid,fid){
        ev.stopPropagation();
        this.props.f_reply && this.props.f_reply(tid,fid,this);
    }
    f_userCenter(ev,userId){
        ev.stopPropagation();
        Com.openWin("apps_bbs_userCentent",{userId:userId});
    }
    f_checkTime(time){
        if(time.indexOf("天")>-1 || time.indexOf("月")>-1 || time.indexOf("年")>-1){
            return true;
        }
        return false;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps != this.props){
            let {heats,replies,t_praise_id} = nextProps.data;
            heats = heats || 0;
            replies = replies || 0;
            t_praise_id = (t_praise_id === false || t_praise_id === "false")? 0 : t_praise_id;
            this.setState({i_heats:heats,i_replies:replies,praiseId:t_praise_id});
        }
    }
    render(){
        let {member_avatar,member_name,add_time,tid,subject,content,imgs,bbs_level=0,member_id,fid} = this.props.data;
        let {i_heats,i_replies,praiseId} = this.state;
        member_name = member_name || "";
        member_name = Com.replaceName(member_name);
        bbs_level = bbs_level || 0;
        return <div className="contentWrap base-mT10" onClick={()=>this.openDetail(tid)}>
            <div className="cardHeader"  onClick={(ev)=>this.f_userCenter(ev,member_id)}>
                <img src={member_avatar || userImg} onError={(ev)=>{ev.target.src=userImg}}/>
                <div className="cardInfo">
                    <h3 className="cardUserName"><em>{member_name}</em><span className="cardFans">LV.{bbs_level}</span></h3>
                    <p className="cardTime">{add_time}</p>
                </div>
            </div>
            <div className="cardDescribe">
                <a >
                    <h2 className="base-ellipsis">
                        <img src={NewsImg} className={`${this.f_checkTime(add_time)?"base-hide":""}`}/>{subject}
                    </h2>
                    <div className="cardDesInfo">
                        <p className="base-ellipsis2" dangerouslySetInnerHTML={{__html:content}} />
                        <MinImgList imgList={imgs} />
                    </div>
                </a>
            </div>
            <div className="cardOption">
                <span className="carLook rLine" onClick={(ev)=>this.f_zan(ev,tid)}><img src={praiseId>0?cancelZanImg:ZanImg}/>点赞 {i_heats}</span>
                <span className="cardGood" onClick={(ev)=>this.f_reply(ev,tid,fid)}><img src={commentImg} />评论 {i_replies}</span>
            </div>
        </div>
    }
}
let MinItem = React.createClass({
    f_reply(tid,fid,self){
        this.props.f_reply && this.props.f_reply(tid,fid,self);
    },
	render(){
        let {data} = this.props;
        let indexDetail = data.map((res,key)=>{
            return <Item key={key} data={res} f_reply={(tid,fid,self)=>this.f_reply(tid,fid,self)}/> ;
        });

		return (
			<div>
                {indexDetail}
			</div>
		);
	}
});


module.exports = MinItem;
