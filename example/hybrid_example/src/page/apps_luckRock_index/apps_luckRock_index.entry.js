/*
 * @Author: 程巨龙
 * @Date:   2016-12-13 10:09:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-07 15:39:32
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("摇一摇");
    require("apps_luckRock_indexCss");
    let Rule = require('rule');
    let LabelInput = require('labelInput');
    let id = Com.getPageParams("id");
    let member_id = Com.getCookie("member_id");
    let WxShare = require('wxShare');
    //页面组件

    class Win extends React.Component {
        closeTips(i_winnerId){
            if(i_winnerId){
                let {name,phone,address} = this.refs;
                if(!name.getValue()){
                    return Com.toast("请输入您的姓名");
                }
                if(!Com.checkMobile(phone.getValue())){
                    return Com.toast("请输入正确的手机号");
                }
                if(!address.getValue()){
                    return Com.toast("请输入您的地址");
                }
                Com.postVerify({act:"activity_luck",op:"applySubmit",id:id,memberId:member_id,winnerId:i_winnerId,
                    receiveName:name.getValue(),receiveMobile:phone.getValue(),receiveAddress:address.getValue()},(res)=>{
                    if(parseInt(res.code) === 0){
                       Com.toast("中奖信息提交成功");
                        this.props.closeWin();
                    }else{
                        Com.toast(res.msg);
                    }
                });
            }else {
                this.props.closeWin();
            }
        }
        render(){
            let {recordDate,issue,isWin,i_winnerId} = this.props;
            recordDate = recordDate || {};
            let {levelName,reawardName} = recordDate;
            let maskBlock = isWin ? "base-mask" :"base-mask anim"; // 规则
            let redStyle = isWin ? "win_tips base-transY anim" :"win_tips base-transY";
            return (
                <div className={maskBlock}>
                    <div className={redStyle}>
                        <div className="wrap">
                            <div className="winPrize">{`${levelName}：${reawardName}`}</div>
                            <p>请在下方提交您的联系方式，方便我们兑奖</p>
                        </div>
                        <div className="winInfo">
                            <LabelInput ref="name" s_left="姓名：" s_right="请输入您的姓名" b_isInput={true} b_line={true}/>
                            <LabelInput ref="phone" s_left="手机：" s_right="请输入您的手机" b_isInput={true} b_line={true}/>
                            <LabelInput ref="address" s_left="地址：" s_right="请输入您的地址" b_isInput={true} b_line={true}/>
                        </div>
                        <div className="closeBtn" onClick={()=>this.closeTips(i_winnerId)}>提交中奖信息</div>
                    </div>
                </div>
            )
        }
    }

    class Fail extends React.Component {
        closeTips(){
            this.props.closeFail();
        }
        render(){
            let maskBlock = this.props.isFail ? "base-mask" :"base-mask anim"; // 规则
            let redStyle = this.props.isFail ? "fail_tips base-transY anim" :"fail_tips base-transY";
            return (
                <div className={maskBlock}>
                    <div className={redStyle}>
                        <div className="closeBtn" onClick={()=>this.closeTips()}>我知道啦</div>
                    </div>
                </div>
            )
        }
    }

    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {isBlock:false,isFail:false,isWin:false,i_winnerId:0,i_winIndex:0,i_limit:this.props.data.luckDate.timeLeft || 0};
        }
        //点击摇一摇
        rockClick(){
            this.b_flag = true;
            let {limit} = this.props.data.luckDate;
            let {i_limit} = this.state;
            if(i_limit>=limit){
                this.b_flag = false;
                return Com.toast("您今天的抽奖次数已经用完了哦");
            }
            Com.postVerify({act:"activity_rock",op:"lottery",id:id,memberId:member_id},(res)=>{
                this.b_flag = false;
                if(parseInt(res.code) === 0){
                    if(parseInt(res.data.type)===1){
                        let {serial,winnerId} = res.data.data;
                        i_limit = parseInt(i_limit) + 1;
                        if(serial != -1){
                            this.setState({isWin:true,i_winnerId:winnerId,i_winIndex:parseInt(serial),i_limit:i_limit});
                        }else {
                            this.setState({isFail:true,i_limit:i_limit});
                        }
                    }else {
                        Com.toast(res.data.msg);
                    }
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        rule(){
            this.setState({isBlock:!this.state.isBlock});
        }
        closeTips(){
            this.setState({isBlock:!this.state.isBlock});
        }
        closeFail(){
            this.setState({isFail:!this.state.isFail});
        }
        closeWin(){
            this.setState({isWin:!this.state.isWin});
        }
        //中奖记录
        f_openRecord(){
            Com.openWin("apps_luckDraw_winnerInfo",{id:id});
        }
        componentDidMount(){
            let {status,ispaus} = this.props.data.luckDate;
            let self = this;
            if(parseInt(status)===1 && parseInt(ispaus)===1){
                if(window.DeviceMotionEvent) {
                    let speed = 25;
                    let x, y,z,lastX,lastY,lastZ;
                    x = y = z = lastX = lastY = lastZ = 0;
                    window.addEventListener('devicemotion', function(event){
                        var acceleration =event.accelerationIncludingGravity;
                        x = acceleration.x;
                        y = acceleration.y;
                        z = acceleration.z;
                        if(Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed) {
                            if(!self.b_flag){
                                self.rockClick();
                            }
                        }
                        lastX = x;
                        lastY = y;
                        lastZ = z;
                    }, false);
                }
            }
        }
        render(){
            let {i_winIndex,i_winnerId} = this.state;
            let {luckDate,recordDate} = this.props.data;
            let {intro,status,ispaus,issue} = luckDate;
            if(!status){
                Com.toast("链接参数错误");
                return null;
            }
            status = parseInt(status);
            ispaus = parseInt(ispaus);
            if(status===1){
                if(ispaus===1){
                    let e_prize = null;
                    if(recordDate && recordDate.length>0){
                        e_prize = recordDate.map((item,key)=>{
                            let {reawardPic,reawardName} = item;
                            if(key>2){
                                return null;
                            }
                            return <li key={key}>
                                <img src={reawardPic} />
                                <p>{reawardName}</p>
                            </li>;
                        });
                    }
                    let a_rule = [{title:"奖品",content:recordDate},{title:"说明",content:intro}];
                    return (
                        <div className="apps_luckRock_index">
                            <div className="rockRule">
                                <span onClick={()=>this.rule()}>活动规则</span><span className="base-fr" onClick={()=>this.f_openRecord()}>中奖记录</span>
                            </div>
                            <Rule closeTips={()=>this.closeTips()} isBlock={this.state.isBlock} data={a_rule} />
                            <Fail closeFail={()=>this.closeFail()} isFail={this.state.isFail}  />
                            <Win issue={issue} recordDate={recordDate[i_winIndex]} i_winnerId={i_winnerId} closeWin={()=>this.closeWin()} isWin={this.state.isWin}  />
                            <section className="prize">
                                <ul className="prize_list">
                                    {e_prize}
                                </ul>
                            </section>
                            <div className="fixedRock" onClick={()=>this.rockClick()}></div>
                        </div>
                    );
                }else{
                    Com.toast("活动已暂停");
                    return null;
                }
            }else if(status===2){
                Com.toast("活动已删除");
                return null;
            }
        }
    };
    //请求数据
    Com.postVerify({act:"activity_rock",op:"getRockDate",id:id,memberId:member_id},function(res){
        if(parseInt(res.code) === 0){
            let recordData = res.data.recordDate;
            let shareParams = {
                baseURL : document.location.href+"&channel=19",
                title : recordData.title,
                desc : recordData.intro,
                imgUrl : ""
            };
            WxShare.showShare(shareParams)
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
