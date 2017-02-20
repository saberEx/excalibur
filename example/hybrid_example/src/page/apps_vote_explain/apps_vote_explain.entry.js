/*
 * @Author: 黄权
 * @Date:   2016-11-17 09:19:39
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-03 16:13:18
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("活动说明");
    let ApposeFixedBtn = require('apposeFixedBtn');
    require("apps_vote_explainCss");
    let BlockTitle = require('blockTitle');
    let i_voteId = Com.getPageParams("id");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        f_leftClick(){
            Com.openWin("apps_vote_index",{id:i_voteId});
        }
        _clickAppose(){
            let {is_applay} = this.props.data;
            if(parseInt(is_applay) === 1){
                Com.toast('您已经报名了哦，赶紧分享出去吧');
            }else{
                Com.openWin("apps_vote_join",{id:i_voteId});
            }
        }
        render(){
            let {vote_details_img,vote_details,is_applay,applyEndTime,applyStartTime,voteStartTime,voteEndTime} = this.props.data;
            let e_img = null;
            if(vote_details_img && vote_details_img.length>0){
                e_img = vote_details_img.map((item,key)=>{
                    return <img src={item} key={key}/>
                });
            }
            return (
                <div className="apps_vote_explain">
                    <div className="activityImage">
                        {e_img}
                    </div>
                    <div className="acIntro">
                        <BlockTitle s_title="报名时间">
                            <p>{Com.getTimeFormat(applyStartTime,2)+'~'+Com.getTimeFormat(applyEndTime,2)}</p>
                        </BlockTitle>
                        <BlockTitle s_title='投票时间'>
                            <p>{Com.getTimeFormat(voteStartTime,2)+'~'+Com.getTimeFormat(voteEndTime,2)}</p>
                        </BlockTitle>
                        <BlockTitle s_title={"活动说明"}>
                            <p>{vote_details}</p>
                        </BlockTitle>
                    </div>
                    <ApposeFixedBtn s_leftLabel="活动首页" s_rightLabel={parseInt(is_applay) === 1?"已报名":"我要报名"} f_leftClick={this.f_leftClick} f_rightClick={()=>this._clickAppose()}/>
                </div>
             );
        }
    };
    //请求数据
    Com.getVerify({act:"apps_vote",op:"apply",id:i_voteId},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
