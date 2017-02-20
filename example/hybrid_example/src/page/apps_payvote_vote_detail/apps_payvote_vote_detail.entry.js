'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("投票详情");
    require("apps_payvote_vote_detailCss");
    require('payment');
    var VoteHeader = require('voteHeader');
    var VoteDes = require('voteDes');
    let roundid = Com.getPageParams('roundid');
    let oid = Com.getPageParams('oid');
    let WxShare = require('wxShare');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                voteNumber : this.props.data.round.max_vote,
            }
        }
        plusClick(){
            let i_num = this.refs.input.value;
            let max_vote = this.props.data.round.max_vote;
            if(parseInt(i_num)<parseInt(max_vote)){
                    this.setState({voteNumber:parseInt(i_num)+1});
                }else {
                    Com.toast("最多只能投"+max_vote+"票");
                }
        }
        subClick(){
            let i_num = this.refs.input.value;
            if(parseInt(i_num)>1 ){
                this.setState({voteNumber:parseInt(i_num)-1});
            }
        }
        voteBtn(){
            let votenum = this.state.voteNumber;
            Com.postVerify({act:'pay_vote',op:'createorder',roundid:roundid,obid:oid,votenum:parseInt(votenum)},(res)=>{
                if (parseInt(res.code) === 0 && res.data.pay_sn) {
                    var type = (Com.getBrowserType() === Com.ENUM_BROWSER_WX) ? 1 : 2;
                    payment.payTypeRequest(res.data.pay_sn,1);
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        allvote(){
            Com.openWin("apps_payvote_ranking",{roundid:roundid});
        }
        myAdd(){
            Com.openWin("apps_payvote_running",{roundid:roundid});
        }
        render(){
            let {info,round} = this.props.data;
            return (
                <div className="apps_payvote_vote_detail">
                    <VoteHeader title={round.title}/>
                    <div className="industry_info_vote">
                        <div className="text_info">
                            <img src={info.oblogo} alt=""/>
                            <span className="vote-name">第{info.ranking}名</span>
                            <span className="vote-num">{info.total_vote}票</span>
                        </div>
                        <div className="industry_name">{info.obname}</div>
                        <div className="vote_piao">
                            <div className="num-box">
                                <span className="plus" onClick={()=>this.plusClick()}>+</span>
                                <input ref="input" type="text" id="vote_number" pattern="[0-9]{1,}" value={this.state.voteNumber} />
                                <span className="sub" onClick={()=>this.subClick()}>-</span>
                            </div>
                        </div>
                        <div className="btn_vote_box">
                            <a onClick={()=>this.voteBtn()}>支持投票</a>
                            <p className="tips">{info.introduce || "暂无简介"}</p>
                        </div>
                        <div className="warp">
                            <div className="remark_box mmok">
                                <p>{round.meaning}</p>
                            </div>
                            <div className="detai_all_info">
                                <a onClick={this.allvote} className="allvote_list">查看所有排名</a>
                                <a onClick={this.myAdd} className="my_add">我要参选</a>
                            </div>
                        </div>
                        <VoteDes info={round.rule}/>
                    </div>

                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:"pay_vote",op:"payvote",roundid:roundid,obid:oid},function(res){
        if(parseInt(res.code) === 0){
            let info = ret.data.info;
            let round = ret.data.round;
            let shareParams = {title: round.title, desc:"快来支持"+info.obname+"的投票吧", imgUrl: info.oblogo||"",
                        baseURL: document.location.href+"&channel=17"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
