/*
 * @Author: 卢旺
 * @Date:   2016-11-24 10:00:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 11:13:47
 * 选手信息
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("选手信息");
    let ShareTips = require('shareTips');
    require("apps_vote_userInfoCss");
    var ApposeFixedBtn = require('apposeFixedBtn');
    var BlockTitle = require('blockTitle');
    let candidateId = Com.getPageParams('candidateId');
    let id = Com.getPageParams('id');
    let _self = null;
    let avatarError = require('defaultUserImgImg');
    let WxShare = require('wxShare');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            _self = this;
            this.state = {
                data : this.props.data,
                voteSty : !this.props.data.isVoted ? "voteBtn" : "voteBtn close",
                voteText : !this.props.data.isVoted ? "投我一票" : "您已投票",
            }
        }
        _rightClick(){
            Com.openWin('apps_vote_explain',{id:id});
        }
        _leftClick(){
            Com.openWin("apps_vote_index",{id:id});
        }
        _voteClick(){
            let {data} = this.state;
            if (!data.isVoted) {
                 Com.postVerify({act:"apps_vote",op:"changeData",voteId:id,candidateId:candidateId},(res)=>{
                    if (parseInt(res.code) === 0) {
                        if(res.data.type == 1){
                            data.isVoted = true;
                            data.voteNum = parseInt(data.voteNum) + 1;
                            _self.setState({data:data,voteSty:"voteBtn close",voteText:"您已投票"});
                        }
                    }
                    Com.toast(res.data.msg);
                });
            }
        }
        _canvassClick(){//拉票
            ShareTips.show();
        }
        render(){
            let {name,imagePath,age,sex,intro,serial,rank,voteNum,member_avatar} = this.state.data;
            let img_item = null;
            if (imagePath) {
                img_item = imagePath.map((item,index)=>{
                    return <img key={index} src={item} alt=""/>;
                });
            }
            return (
                <div className="apps_vote_userInfo">
                    <section className="itemWrap">
                        <section className="uName">
                            <img className="uImg base-transY" src={member_avatar || avatarError} onError={(ev)=>ev.target.src=avatarError} />
                            <div className="usInfo">
                                <span>编号：{serial}</span>
                                <h2 className="base-fr">{name}</h2>
                            </div>
                        </section>
                        <section className="ranking">
                            <div className="rankItem">
                                <span>{rank}</span>
                                <p>名次</p>
                            </div>
                            <div className="rankItem">
                                <span>{voteNum}</span>
                                <p>票数</p>
                            </div>
                            <div className="rankItem">
                                <span>{parseInt(sex) === 1 ? "男" : "女"}</span>
                                <p>性别</p>
                            </div>
                            <div className="rankItem noR">
                                <span>{age}</span>
                                <p>年龄</p>
                            </div>
                        </section>
                    </section>
                    <section className="itemWrap">
                        <BlockTitle s_title={"说明"}>
                            <div className="fillText">
                                {intro}
                            </div>
                            {img_item}
                        </BlockTitle>
                        <div className="voteWrap">
                            <span onClick={()=>this._voteClick()}>
                                <img src={require("vote_1Img")} alt=""/>
                                {this.state.voteText}
                            </span>
                            <span onClick={()=>this._canvassClick()}>
                                <img src={require("vote_2Img")} alt=""/>
                                帮我拉票
                            </span>
                        </div>
                    </section>
                    <ApposeFixedBtn s_leftLabel="活动首页" s_rightLabel="活动说明" f_leftClick={this._leftClick} f_rightClick={this._rightClick}/>
                </div>
             );
        }
    };
    //请求数据
    Com.getVerify({act:"apps_vote",op:"getVoteUserDate",id:id,candidateId:candidateId},function(res){
        if(parseInt(res.code) === 0){
            let data = res.data;
            var shareParams = {title: "【"+data.title+"】来帮{"+data.name+"}投上一票吧", desc:data.intro, imgUrl:imagePath[0], baseURL: document.location.href+"&channel=16"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
