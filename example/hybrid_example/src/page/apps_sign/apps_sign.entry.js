/*
 * @Author: 黄权
 * @Date:   2016-11-4 11:40:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 10:58:30
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("签到");
    let ShareTips = require("shareTips");
    require('apps_signCss');
    let userImg = require("userDefaultImg");
    let sign_id = Com.getPageParams("sign_id");
    var BlockTitle = require('blockTitle');
    let WxShare = require('wxShare');
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            let {total_points,continue_days,today_sign} = this.props.data;
            this.state = {isBlock:false,iShare:false,i_points:total_points || 0,i_day:continue_days||0,s_signInfo:"",b_sign:today_sign==1};
        }
        rultClick(){
            this.setState({isBlock:!this.state.isBlock});
        }
        close_rultClick(){
            this.setState({isBlock:!this.state.isBlock});
        }
        closeTips(){
            this.setState({isBlock:!this.state.isBlock});
        }
        //签到
        signClick(today_sign){
            if(today_sign == 1){
                return;
            }
            let {rule_info,continue_days} = this.props.data;
            continue_days = continue_days || 0;
            let {i_day,i_points,s_signInfo} = this.state;
            let len = rule_info.length;
            let modDays = (parseInt(continue_days)+1) % rule_info[len-1]["days"] ;
            let self = this;
            Com.postVerify({act:'activity_sign',op:'applySubmit',id:sign_id},(res)=>{
                if(parseInt(res.code)===0){
                    let todayPoints = parseInt(res.data.today_point) || 0;
                    for (var i=0;i<len;i++) {
                        let ruleInfo = rule_info[i];
                        let nextInfo = rule_info[i+1];
                        if(modDays == parseInt(ruleInfo["days"]) || (modDays==0 && i==len-1)){
                            // todayPoints = ruleInfo["points"];
                            if(nextInfo){
                                s_signInfo = "签到成功，获得"+todayPoints+"积分，再连续签到"+(nextInfo["days"]-ruleInfo["days"])+"天，可以获得"+nextInfo["points"]+"积分奖励！";
                            }else {
                                s_signInfo = "签到成功，获得"+todayPoints+"积分，再连续签到"+rule_info[0]["days"]+"天，可以获得"+rule_info[0]["points"]+"积分奖励！";
                            }
                        }else{
                            if((ruleInfo["days"]<modDays) && nextInfo && (modDays<nextInfo["days"])){
                                s_signInfo = "签到成功，获得"+todayPoints+"积分，再连续签到"+(nextInfo["days"]-modDays)+"天，可以获得"+nextInfo["points"]+"积分奖励！"
                            }
                        }
                    }
                    self.setState({b_sign:true,iShare:true,i_day:parseInt(i_day)+1,i_points:parseInt(i_points)+parseInt(todayPoints),s_signInfo:s_signInfo});
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        iShareClick(b_show){
            if(b_show){
                ShareTips.show();
            }
            this.setState({iShare:false});
        }
        render(){
            let {member_avatar,member_name,states,rule_info,intro} = this.props.data;
            let {i_day = 0,i_points,s_signInfo,b_sign} = this.state;
            if(states == 0){
                return <div className="apps_sign">
                            <div className="base-mask">
                                <div className="singUpedInfoContain">
                                    <div className="singUpedInfo">
                                        <p>签到活动未开始！</p>
                                        <span onClick={()=>Com.closeWin()} >知道了</span>
                                    </div>
                                </div>
                            </div>
                        </div>;
            }
            let e_list = null;
            if(rule_info && rule_info.length>0){
                e_list = rule_info.map((item,key)=>{
                    let {days,points} = item;
                    return  <p key={key}>{key+1}.连续签到{days}天，获得{points}积分奖励；</p>;
                });
            }
            let maskShare = this.state.iShare ? "base-mask" :"base-mask anim"; // 分享
            let shareStyle = this.state.iShare ? "share_tips anim" :"share_tips ";
            let maskBlock = this.state.isBlock ? "base-mask" :"base-mask anim"; // 规则
            let redStyle = this.state.isBlock ? "red_tips anim" :"red_tips";

            return (
                <div className="apps_sign">
                    <header className="sign_user">
                        <div className="sign_head">
                            <img className="base-fl" src={member_avatar || userImg} onError={(ev)=>ev.target.src=userImg} />
                            <p className="userName">{Com.replaceName(member_name)} <span onClick={()=>this.rultClick()} className="sign_ruleBtn">签到规则</span></p>
                        </div>
                        <div className="sign_int">
                            积分：{i_points}
                        </div>
                        <div className="sign_day">
                            <h2>
                                <em className="base-trans">{i_day}</em>
                            </h2>
                        </div>
                    </header>
                    <section className="sign_body">
                        <BlockTitle s_title="签到说明" >
                            {intro ||""}
                        </BlockTitle>
                        <a onClick={()=>this.signClick(b_sign,rule_info)} className={`click-sign ${b_sign?"disabled":""}`} href="javascript:;">
                            {`${b_sign?"已签到":"点击签到"}`}
                        </a>
                    </section>

                    <div className={maskBlock}>
                        <div className={redStyle}>
                            <h2>活动规则 <img className="tipsClose" src={require('tips_closeImg')}  onClick={()=>this.closeTips()} /></h2>
                            <div className="tips_cont">
                                {e_list}
                            </div>
                        </div>
                    </div>

                    <div className={maskShare}>
                        <div className={shareStyle}>
                            <h2>
                                恭喜您<img className="tipsClose" src={require('tips_closeImg')}  onClick={()=>this.iShareClick()}/>
                            </h2>
                            <div className="tips_cont">
                                <p>{s_signInfo}</p>
                                <a  className="shareBtn" href="javascript:void(0);" onClick={()=>this.iShareClick(true)}>立即分享</a>
                            </div>
                        </div>
                    </div>

                </div>
             );
        }
    };
    //请求数据
    if(sign_id){
        Com.postVerify({act:'activity_sign',op:'getSignDate',id:sign_id},(res)=>{
            if(parseInt(res.code) === 0){
                var shareParams = {title: res.data.title, desc:res.data.content?res.data.content:"",imgUrl: Com.UPLOAD_PATH+"/image/activity/signUpShareImg.png", baseURL: document.location.href+"&channel=20"};
                WxShare.showShare(shareParams);
                ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
            }else{
                Com.toast(res.msg);
            }
        });
    }
});
