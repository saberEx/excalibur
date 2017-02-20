/*
 * @Author: 黄权
 * @Date:   2016-11-15 14:35:39
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 10:59:53
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("活动首页");
    require("apps_vote_indexCss");
    let TabBtnGroup = require('tabBtnGroup');
    let ApposeFixedBtn = require('apposeFixedBtn');
    let i_voteId = Com.getPageParams("id");
    let Scroll = require('scroll');
    let NotData = require("notData");
    let curpage = 1;
    let WxShare = require('wxShare');
    class Itme extends React.Component {
        constructor(props){
            super(props);
            let {isVoted,voteNum} = this.props.data;
            this.state = {b_vote:isVoted == 1,voteNum:parseInt(voteNum) || 0};
        }
        componentDidUpdate(prevProps){
            if(prevProps.data !== this.props.data){
                let {isVoted,voteNum} = this.props.data;
                this.setState({b_vote:isVoted == 1,voteNum:parseInt(voteNum) || 0});
            }
        }
        f_vote(){
            let {b_vote} = this.state;
            if(!b_vote){
                Com.postVerify({act:"apps_vote",op:"changeData",voteId:i_voteId,candidateId:this.props.data.id},(res)=>{
                    if(parseInt(res.code) === 0){
                        if(res.data.type == 1){
                            this.setState({b_vote:true,voteNum:this.state.voteNum+1});
                        }else {
                            Com.toast(res.data.msg);
                        }
                    }else {
                        Com.toast(res.msg);
                    }
                });
            }
        }
        render(){
            let {imagePath,name,serial,intro} = this.props.data;
            let {b_vote,voteNum} = this.state;
            let e_vote = null;
            if(b_vote){
                e_vote = <div className="voteBtn disabled" >已投票</div>
            }else{
                e_vote = <div className="voteBtn" onClick={()=>this.f_vote()}>投票</div>;
            }
            return <li className="wf-box">
                    <div className="uImg" onClick={()=>Com.openWin("apps_vote_userInfo",{id:i_voteId,candidateId:this.props.data.id})}>
                        <img src={imagePath}/>
                        <div className="uName">{name}</div>
                    </div>
                    <div className="uNum">
                        <span>编号：{serial}</span>
                        <span className="base-fr">{voteNum}票</span>
                        <div className="uCont base-ellipsis">{intro}</div>
                    </div>
                    {e_vote}
                </li>;
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            let {playlist,voteDate} = this.props.data;
            this.i_index = 0;
            this.state = {i_tabIndex:0,data:this.props.data,b_allLoaded:playlist.length>=voteDate.total,b_search:false};
        }
        f_tabChange(index){
            this.refs.search.value = "";
            curpage = 1;
            requestData(index,(data)=>{
                this.i_index = index;
                this.setState({data:data,i_tabIndex:index,b_allLoaded:false});
            });
        }
        _clickAppose(){
            let {voteDate} = this.props.data;
            let {is_applay} = voteDate;
            if(parseInt(is_applay) === 0){
                Com.openWin("apps_vote_join",{id:i_voteId});
            }else{
                Com.toast('您已经报名了哦，赶紧分享出去吧');
            }
        }
        f_voteDetails(){
            Com.openWin('apps_vote_explain',{id:i_voteId});
        }
        f_search(){
            let s_value = this.refs.search.value;
            if(s_value){
                let {i_tabIndex} = this.state;
                curpage = 1;
                requestData(i_tabIndex,(data)=>{
                    this.i_index = 2;
                    this.setState({data:data,b_allLoaded:false});
                },s_value);
            }
            this.setState({b_search:false});
        }
        show_search(){
            this.refs.search.value = '';
            this.setState({b_search:true});
        }
        componentDidMount(){
            let {voteDate} = this.state.data;
            document.title = voteDate.voteTitle;
        }
        f_pullUpScroll(scroll){
            let s_value = this.refs.search.value || "";
            let {i_tabIndex,data} = this.state;
            let {playlist,voteDate} = data;
            console.log(playlist);
            requestData(i_tabIndex,(o_data)=>{
                voteDate = o_data.voteDate;
                o_data.playlist = playlist.concat(o_data.playlist);
                let b_allLoaded = playlist.length>=voteDate.total;
                this.setState({data:o_data,i_tabIndex:i_tabIndex,b_allLoaded:b_allLoaded});
                scroll.endScroll(b_allLoaded);
            },s_value,true);
        }
        render(){
            let {i_tabIndex,data,b_allLoaded} = this.state;
            let {playlist,voteDate} = data;
            let {ad_img,playerNum,click,voteUserNum,is_applay} = voteDate;
            let e_list = null;
            let f_pullUpScroll = null;
            let show_search = this.state.b_search ? "fixedSearch anim" :"fixedSearch n_anim";
            if(playlist && playlist.length>0){
                e_list = playlist.map((item,key)=>{
                   return <Itme data={item} key={key}/>
                });
                f_pullUpScroll=(scroll)=>this.f_pullUpScroll(scroll);
            }else {
                e_list = <NotData s_content="赶紧来第一个报名吧~" b_needBtn={false}/>;
            }
            return (
                <div className="apps_vote_index">
                    <Scroll ref='scroll' i_index={`${this.i_index}`} b_allLoaded={b_allLoaded} f_pullUpScroll={f_pullUpScroll}>
                        <section className="advertisement">
                            <img src={ad_img} />
                        </section>
                        <section className="ranking">
                            <div className="rankItem">
                                <span>{playerNum}</span>
                                <p>已报名</p>
                            </div>
                            <div className="rankItem">
                                <span>{voteUserNum}</span>
                                <p>投票数</p>
                            </div>
                            <div className="rankItem">
                                <span>{click}</span>
                                <p>访问量</p>
                            </div>
                            <div className="rankItem noR" onClick={()=>this.show_search()}>
                                <img src={require('searchIconImg')} className="searchBtn" />
                                <p>点击搜索</p>
                            </div>
                            <div className={show_search}>
                                <input type="search" ref="search" placeholder={"输入姓名或编号搜索"}/>
                                <img src={require('searchIconImg')} className="searchBtn base-transY" onClick={()=>this.f_search()}/>
                            </div>
                        </section>
                        <section className="userList base-mT10">
                            <TabBtnGroup f_callBack={(index)=>this.f_tabChange(index)} i_currentItem={i_tabIndex} a_controlItems={["新人排行榜","人气排行榜"]} />
                            <ul className="uList wf-container">
                                {e_list}
                            </ul>
                        </section>
                    </Scroll>
                    <ApposeFixedBtn s_leftLabel={parseInt(is_applay) === 1 ? "已报名":"我要报名"} s_rightLabel="活动说明" f_leftClick={()=>this._clickAppose()} f_rightClick={()=>this.f_voteDetails()}/>
                </div>
             );
        }
    };
    //请求数据
    function requestData(index,f_callBack,s_keyword="",b_isNoShowProgress) {
        let rank = index === 0 ? 1 :2;
        Com.getVerify({act:"apps_vote",op:"getVoteDate",id:i_voteId,keyword:s_keyword,isRank:rank,curpage:curpage,pagesize:3},function(res){
            if(parseInt(res.code) === 0){
                curpage ++;
                f_callBack(res.data);
            }else{
                Com.toast(res.msg);
            }
        },b_isNoShowProgress);
    }
    requestData(0,(data)=>{
        var voteData = data['voteDate'];
        var shareParams = {title: voteData.voteTitle , desc:voteData.vote_details, imgUrl:voteData.ad_img, baseURL: document.location.href+"&channel=16"};
        WxShare.showShare(shareParams);
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});
