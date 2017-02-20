/*
* @Author: {daihanqiao}
* @Date:   2015-11-10 14:22:26
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-07 15:39:59
* 付费投票
*/
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("投票排名");
    require("apps_payvote_rankingCss");
    var VoteHeader = require('voteHeader');
    var VoteList = require('voteList');
    var VoteDes = require('voteDes');
    let roundid = Com.getPageParams('roundid');
    let WxShare = require('wxShare');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        myAdd(){
             switch (parseInt(this.props.data.round.status)){
                case 2:
                    Com.openWin("apps_payvote_running",{roundid:roundid});
                    break;
                case 1:
                    Com.toast("投票活动尚未开始");
                    break
                case 3:
                    Com.toast("投票活动已结束");
                    break;
            }
        }
        render(){
            let {join_ob,round} = this.props.data;
            return (
                <div className="apps_payvote_ranking">
                    <VoteHeader title={round.title}/>
                    <div className="ranking_box">
                        <VoteList list={join_ob} roundid={round.roundid}/>
                        <button className="my_add" onClick={()=>this.myAdd()}>我要参选</button>
                        <VoteDes info={round.rule}/>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:"pay_vote",op:"oblist",roundid:roundid},function(res){
        if(parseInt(res.code) === 0){
            let round = res.data.round;
            let shareParams = {title: round.title, desc:round.rule, imgUrl: "",
                        baseURL: document.location.href+"&channel=17"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
