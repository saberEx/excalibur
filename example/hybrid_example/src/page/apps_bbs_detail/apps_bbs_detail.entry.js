/*
 * @Author: 黄权
 * @Date:   2016-10-27 17:07:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-07 17:27:59
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("帖子详情");
    require("apps_bbs_detailCss");
    let tid = Com.getPageParams("tid");
    let PAGE_SIZE = 3;
    let MinComment = require('minComment');
    let userImg = require("userDefaultImg");
    let MinList = require('minList');
    let MinTit = require('minTit');
    let MinPost = require('minPost');
    let ZanImg = require('zanIconImg');
    let cancelZanImg = require('cancleZanImg');
    let commentImg = require('commentIconImg');
    let opcIconImg = require('opcIconImg');
    let recommendIconImg = require('recommendIconImg');
    let closeIconImg = require('closeIconImg');
    let delIconImg = require('delIconImg');
    let Scroll = require("scroll");
    let member_id = Com.getCookie("member_id");

    //页面组件
    class Rep extends React.Component {
        constructor(props){
            super(props);
            let {heats,t_praise_id} = this.props.data;
            console.log(t_praise_id);
            t_praise_id = (t_praise_id === false || t_praise_id === "false")? 0 : t_praise_id;
            this.state = {praiseId:t_praise_id,i_heats:heats};
        }
        cardClick(){
            this.refs.minPost.f_show();
        }
        submitClick(s_value){
            if(!s_value){
                return Com.toast("回复内容不能为空");
            }
            let {fid} = this.props.data;
            Com.postVerify({act:'bbs_post',op:'create',tid:tid,content:s_value,member_id:member_id,fid:fid},(res)=>{
                if(parseInt(res.code) === 0){
                    window.location.reload();
                } else {
                    Com.toast(res.msg);
                }
            });
        }
        f_zan(){
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
        render(){
            let {i_heats,praiseId} = this.state;
            return (
                <div className="fixed-container">
                    <footer className="fixedCont">
                        <span className="cardGood" onClick={()=>this.cardClick()}><img src={commentImg} /><em>评论</em></span>
                        <span className="cardZan"  onClick={()=>this.f_zan()}><img src={praiseId>0?cancelZanImg:ZanImg} /><em>{i_heats}</em></span>
                    </footer>
                    <MinPost ref="minPost" submitClick={(value)=>this.submitClick(value)}/>
                </div>
             );
        }
    };

    class DetailImg extends React.Component {
        render(){
            let detail = null;
            if(this.props.detailImg && this.props.detailImg.length>0){
                detail = this.props.detailImg.map((res,key)=>{
                    return <p key={key}><img src={`${Com.UPLOAD_PATH}bbsimg/${res}`} /></p>;
                });
            }
            return (
                <div>
                    {detail}
                </div>
            )
        }
    };
    //帖子详情组件
    let a_optionImg = [opcIconImg,recommendIconImg,closeIconImg,delIconImg];
    let a_optionTitle= ["精华","推荐","关闭","删除"];
    class DetailInfo extends React.Component {
        f_option(index,tid){
            let a_params = ["e","s_1","s_2","s_3"];
            let a_msg = ["你确定要加精该帖子吗?","你确定要推荐该帖子吗?","你确定要关闭该帖子吗?","你确定要删除该帖子吗?"];
            Com.confirm(a_msg[index],()=>{
                Com.postVerify({act:'bbs_thread',op:'status',tid:tid,type:a_params[index]},(res)=>{
                    if(parseInt(res.code) === 0){
                        Com.closeWin();
                    }else {
                        Com.toast(res.msg);
                    }
                });
            });
        }
        render(){
            let {member_avatar,member_name='',subject,add_time,content,imgs,member_id,m_id,tid} = this.props.data;
            let e_option = null;
            if(m_id && m_id.length>0){
                e_option =  m_id.map((item,key)=>{
                    if(item.member_id == Com.getCookie('member_id') && key<4){
                        return <span onClick={()=>this.f_option(key,tid)}><img src={a_optionImg[key]} /><em>{a_optionTitle[key]}</em></span>;
                    }else{
                        return null;
                    }
                });
            }
            if(e_option){
                e_option = <div className="landlordCardOption">
                    {e_option}
                </div>;
            }
            return (
                <div className="landlord">
                    <div className="landlordWrap">
                        <div className="landlordInfo base-positionRel base-after-line base-line-left">
                            <a className="base-positionRel base-iconRight" onClick={()=>{Com.openWin("apps_bbs_userCentent",{userId:member_id})}}>
                                <img src={member_avatar || userImg} onError={(ev)=>ev.target.src=userImg}/>
                                {Com.replaceName(member_name)}
                            </a>
                        </div>
                        <div className="landlordCardInfo">
                            <h2 className="cardTitle">{subject} </h2>
                            <p className="cardTime">{Com.getTimeFormat(add_time,0)}</p>
                            <div className="cardContent">
                                <p dangerouslySetInnerHTML={{__html:content}}>
                                </p>
                                <DetailImg detailImg={imgs} />
                            </div>
                        </div>
                    </div>
                    {e_option}
                </div>
             );
        }
    };
    //推荐话题组件
    class Hot extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                data:null
            }
        }
        componentDidMount(){
            Com.postNormal({act:'bbs_thread',op:'list',type:"heats"},(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({data:res.data.thread_list});
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {data} = this.state;
            if(!(data && data.length>0)){
                return null;
            }
            return (
                <div className="base-mT10">
                    <MinTit title={"推荐话题"} />
                    <MinList data={data} />
                </div>
            );
        }
    };
    //全部评论组件
    class Reply extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                data:null,
                b_allLoaded:false
            }
        }
        componentDidMount(){
            Com.postNormal({act:'bbs_post',op:'posts',tid:tid,pagesize:PAGE_SIZE},(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({data:res.data.post_list,b_allLoaded:!res.data.page.hasmore});
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        f_pullUpScroll(scroll,curPage){
            let {data} = this.state;
            Com.postNormal({act:'bbs_post',op:'posts',tid:tid,pagesize:PAGE_SIZE,curpage:curPage},(res)=>{
                if(parseInt(res.code) === 0){
                    data = data.concat(res.data.post_list);
                    this.setState({data:data});
                    scroll.endScroll(!res.data.page.hasmore);
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {data,b_allLoaded} = this.state;
            let e_list = null;
            if(data){
                /*if(data.length>0){
                    e_list = <Scroll b_allLoaded={b_allLoaded} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                        <MinComment data={data} />
                    </Scroll>;
                }else {*/
                    e_list =  <MinComment data={data} />;
                // }
            }
            return (
                <div className="base-mT10">
                    <MinTit title={"全部评论"} />
                    {e_list}
                </div>
            );
        }
    };



    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_reply:null,b_allLoaded:false};
        }
        f_pullUpScroll(scroll,curPage){
            let {a_reply} = this.state;
            Com.postNormal({act:'bbs_post',op:'posts',tid:tid,pagesize:PAGE_SIZE,curpage:curPage},(res)=>{
                if(parseInt(res.code) === 0){
                    a_reply = a_reply.concat(res.data.post_list);
                    this.setState({a_reply:a_reply});
                    scroll.endScroll(!res.data.page.hasmore);
                }else {
                    Com.toast(res.msg);
                }
            },true);
        }
        componentDidMount(){
            Com.postNormal({act:'bbs_post',op:'posts',tid:tid,pagesize:PAGE_SIZE},(res)=>{
                if(parseInt(res.code) === 0){
                    let hasmore = res.data.page?res.data.page.hasmore:false;
                    this.setState({a_reply:res.data.post_list,b_allLoaded:!hasmore});
                }
            },true);
        }
        render(){
            let {a_reply,b_allLoaded} = this.state;
            let e_list = null;
            if(a_reply && a_reply.length>0){
                 e_list =  <Scroll b_allLoaded={b_allLoaded}  f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                     <DetailInfo data={this.props.data}/>
                     <Hot />
                     <div className="base-mT10">
                         <MinTit title={"全部评论"} />
                         <MinComment data={a_reply} />
                     </div>
                 </Scroll>;
            }else {
                e_list =  <div>
                            <DetailInfo data={this.props.data}/>
                            <Hot />
                            <div className="base-mT10">
                                <MinTit title={"全部评论"} />
                                <MinComment data={[]} />
                            </div>
                        </div>;
            }
            return (
                <div className="apps_bbs_detail">
                    {e_list}
                    <Rep data={this.props.data}/>
                </div>
             );
        }
    };


    //请求数据
    Com.postNormal({act:'bbs_thread',op:'detail',tid:tid},(res)=>{
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else {
            Com.toast(res.msg);
        }
    });
});
