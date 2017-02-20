/*
 * @Author: 黄权
 * @Date:   2016-11-10 10:00:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 10:55:37
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("活动详情");
    require("apps_registration_indexCss");
    let BlockTitle = require('blockTitle');
    let i_id = Com.getPageParams("id");
    let member_id = Com.getCookie("member_id");
    let ShareTips = require('shareTips');
    let WxShare = require('wxShare');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        componentDidMount(){
            let {reg_title} = this.props.data;
            document.title = reg_title;
        }
        f_register(){
            let {isApply} = this.props.data;
            if(!isApply){
                Com.openWin("apps_registration_join",{id:i_id});
            }else{
                Com.toast('您已经报名了哦，赶紧分享出去吧');
            }
        }
        f_share(){
            ShareTips.show();
        }
        render(){
            let {activity_img,reg_regstarts_time,reg_regends_time,reg_start_time,reg_end_time,reg_address,reg_title,reg_price,reg_isprice,
                activity_signNum,reg_sponsor,reg_details,reg_details_img,isApply} = this.props.data;
            let infoBg = {
                "backgroundImage":"url("+activity_img+")",
            }
            let e_img = null;
            if(reg_details_img && reg_details_img.length>0){
                e_img = reg_details_img.map((item,key)=>{
                    return <img src={item} key={key}/>
                });
            }
            // reg_isprice=0;
            let content_str=null;
            if (!e_img && !reg_details) {
                content_str = <div className="emptty"><img src={require("icon_data_emptyImg")} alt="" /><br/>暂无数据</div>
            }else{
                content_str= <div>{e_img}<p>{reg_details}</p></div>
            }

            return (
                <div className="apps_registration_index">
                    <section className="reg_info">
                        {/*
                          <div className="infoLeft" style={infoBg} />
                        <div className="infoRight">
                            <div className="infoName">
                                {reg_title}
                            </div>
                            <div className="infoTime">
                                报名时间：
                                <p>{Com.getTimeFormat(reg_regstarts_time,2)} 至 {Com.getTimeFormat(reg_regends_time,2)}</p>
                            </div>
                            <div className="infoPrice">
                                <div className="payActivity">
                                   <em>&nbsp;</em>
                                </div>
                                <div className="freeActivity">
                                    费用：<em>{reg_price>0?"￥"+reg_price:"免费"}</em>
                                </div>
                            </div>
                            <div className="infoAttention">
                                已报名<em>{activity_signNum}</em>人
                            </div>
                        </div>
                          */}
                        { reg_isprice==0 ?  <img className="activity_status" src={require("mfImg")} alt="" />: ''}
                        <div className="infoLeft" style={infoBg} />
                        <div className="rev_right">
                            <div className="infoName base-ellipsis">
                                {reg_title}
                            </div>
                            <p>报名时间：</p>
                            <p className="times">{Com.getTimeFormat(reg_regstarts_time,2)} 至 {Com.getTimeFormat(reg_regends_time,2)}</p>
                            <div className="infoAttention">
                                已报名：<em>{activity_signNum}</em>人  { reg_isprice==0 ?  null : <span className="base-fr"><i>￥</i>{reg_isprice}</span>}
                            </div>
                        </div>
                    </section>
                    <section className="reg_sponsor">
                        <div className="sponItem">
                            <label>主办方：</label>
                            <span>{reg_sponsor}</span>
                        </div>
                        <div className="sponItem">
                            <label>活动时间：</label>
                            <span>{Com.getTimeFormat(reg_start_time,2)} 至 {Com.getTimeFormat(reg_end_time,2)}</span>
                        </div>
                        <div className="sponItem">
                            <label>详细地址：</label>
                            <span>{reg_address}</span>
                        </div>
                    </section>
                    <div className="title_s">活动详情</div>
                    <section className="reg_detail">
                        {content_str}
                    </section>
                    <div className="fixedBtn">
                        <div className={`itemBtn ${!isApply?"active":""}`} onClick={()=>this.f_register()}>
                            {isApply?"我已报名":"我要报名"}
                        </div>
                        {/*<div className={`itemBtn ${isApply?"active":""}`} onClick={()=>this.f_share()}>
                            立即分享
                        </div>*/}
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"apps_normal",op:"getWeibaoDate",id:i_id,memberId:member_id},function(res){
        if(parseInt(res.code) === 0){
            var shareParams = {title: res.data.reg_title, desc:res.data.reg_details, imgUrl: res.data.activity_img, baseURL: document.location.href+"&channel=15"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
