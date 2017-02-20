/*
 * @Author: 黄权
 * @Date:   2016-10-27 10:07:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2017-01-05 11:22:19
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("商贸通论坛");
    require("apps_bbs_indexCss");
    let AddPostImg = require('postIconImg');
    let HeaderNav = require('headerNav');
    let MinNav = require('minNav');
    let MinList = require('minList');
    let MinClass = require('minClass');
    let MinItem = require('minItem');
    let hotIconImg = require('hotIconImg');
    let newsIconImg = require('newsIconImg');
    let cancleZanImg = require('cancleZanImg');
    let zanIconImg = require("zanIconImg");
    let MinPost = require('minPost');
    let commentIconImg = require("commentIconImg");
    let Scroll = require("scroll");
    let NotData = require("notData");
    const a_nav = ["最新","热帖","精华","分类","我的"];
    const PAGE_SIZE = 10;
    let e_classifyEl = null;
    let e_pageEl = null;
    let a_ajaxParams = [{act:'bbs_thread',op:'list',type:"new"},{act:'bbs_thread',op:'list',type:"hot"},
        {act:'bbs_thread',op:'list',type:"essence"},{act:'bbs_forum',op:'categorylist'}];
    let requestData = (i_index,curPage,f_callback,isNoShowProgress)=>{
        curPage = curPage || 1;
        i_index = i_index || 0;
        a_ajaxParams[i_index]["curpage"] = curPage;
        a_ajaxParams[i_index]["pagesize"] = PAGE_SIZE;
        Com.getVerify(a_ajaxParams[i_index],(res)=>{
            if(parseInt(res.code) === 0){
                f_callback(res);
            }else {
                Com.toast(res.msg);
            }
        },isNoShowProgress);
    };
    //置顶组件
    class HeatEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                a_list:[]
            };
        }
        componentDidMount(){
            //置顶帖子
            Com.getNormal({act:'bbs_thread',op:'list',type:"heats"},(res)=>{
                if(parseInt(res.code) === 0){
                    this.setState({a_list:res.data.thread_list});
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let s_hide = this.props.i_tabIndex === 3 ? "base-hide":"";
            return <div className={`base-mT10 ${s_hide}`}>
                <MinList data={this.state.a_list} is_Img={true}/>
            </div>;
        }
    }
    //分类组件
    class ClassifyEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                a_list:[],
                b_allLoaded:false,
                n_fid:-1
            };
        }
        componentDidMount(){
            e_classifyEl = this;
            //全部分类
            requestData(0,1,(res)=>{
                let {thread_list,page} = res.data;
                let hasMore = page?page.hasmore:false;
                // this.setState({a_list:thread_list,b_allLoaded:!hasMore});
                e_pageEl.setState({a_classifyList:thread_list,b_allLoaded:!hasMore});
                if(e_pageEl.refs.scroll_3){
                    e_pageEl.refs.scroll_3.initAllLoaded(!hasMore);
                }
            });
        }
        //分类点击
        f_classify(fid){
            if(fid == -1){
                requestData(0,1,(res)=>{
                    let {thread_list,page} = res.data;
                    let hasMore = page?page.hasmore:false;
                    // this.setState({a_list:thread_list,b_allLoaded:!hasMore,n_fid:fid});
                    e_pageEl.setState({a_classifyList:thread_list,b_allLoaded:!hasMore,n_fid:fid});
                });
            }else {
                Com.postNormal({act:'bbs_forum',op:'getlistbyc',fid:fid,pagesize:PAGE_SIZE},(res)=>{
                    if(parseInt(res.code) === 0){
                        let {thread_list,page} = res.data;
                        let hasMore = page?page.hasmore:false;
                        // this.setState({a_list:thread_list,b_allLoaded:!hasMore,n_fid:fid});
                        e_pageEl.setState({a_classifyList:thread_list,b_allLoaded:!hasMore,n_fid:fid});
                    }else {
                        Com.toast(res.msg);
                    }
                });
            }
        }
        f_pullUpScroll(scroll,curPage){
            let {a_list,n_fid,a_classifyList} = e_pageEl.state;
            if(n_fid == -1){
                requestData(0,curPage,(res)=>{
                    let {thread_list,page} = res.data;
                    a_classifyList = a_classifyList.concat(thread_list);
                    let hasMore = page?page.hasmore:false;
                    // this.setState({a_list:a_list,b_allLoaded:!hasMore});
                    e_pageEl.setState({a_classifyList:a_classifyList,b_allLoaded:!hasMore});
                    scroll.endScroll(!hasMore);
                },true);
            }else{
                Com.postNormal({act:'bbs_forum',op:'getlistbyc',fid:n_fid,pagesize:PAGE_SIZE,curpage:curPage},(res)=>{
                    if(parseInt(res.code) === 0){
                        let {thread_list,page} = res.data;
                        a_classifyList = a_classifyList.concat(thread_list);
                        let hasMore = page?page.hasmore:false;
                        e_pageEl.setState({a_classifyList:a_classifyList,b_allLoaded:!hasMore});
                        scroll.endScroll(!hasMore);
                    }else {
                        Com.toast(res.msg);
                    }
                },true);
            }
        }
        render(){
            let {a_list,b_allLoaded,n_fid,a_classifyList} = e_pageEl.state;
            let e_list = null;
            if(a_classifyList && a_classifyList.length>0){
                /*e_list = <Scroll i_index={`${n_fid}`} b_allLoaded={b_allLoaded} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                        <MinItem data={a_list}  f_reply={(tid,fid,self)=>this.props.f_reply(tid,fid,self)}/>
                    </Scroll> ;*/
                e_list =  <MinItem data={a_classifyList}  f_reply={(tid,fid,self)=>this.props.f_reply(tid,fid,self)}/>;
            }else if(a_classifyList && a_classifyList.length===0){
                e_list = <NotData />;
            }
            return <div className={`base-mT10 classContainer`}>
                <MinClass data={this.props.data} onClick={(fid)=>this.f_classify(fid)}/>
                {e_list}
            </div>;
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                a_list:null,
                i_tabIndex:0,
                a_classify:null,
                i_classifyIndex:0,
                b_allLoaded:false,
                a_classifyList:null,
                n_fid:-1
            };
        }

        f_clickHandler(index){
            if(index != 4){
                requestData(index,1,(res)=>{
                    if(index == 3){
                        this.setState({a_list:null,i_tabIndex:index,a_classify:res.data});
                    }else {
                        let {thread_list,page} = res.data;
                        let hasMore = page?page.hasmore:false;
                        this.setState({a_list:thread_list,i_tabIndex:index,b_allLoaded:!hasMore});
                    }
                });
            }else {
                Com.openWin("apps_bbs_userCentent",{userId:Com.getCookie("member_id")});
            }
        }
        componentDidMount(){
            e_pageEl = this;
            requestData(0,1,(res)=>{
                let {thread_list,page} = res.data;
                let hasMore = page?page.hasmore:false;
                this.setState({a_list:thread_list,b_allLoaded:!hasMore});
            });
        }
        //去发帖
        f_addPost(){
            Com.openWin("apps_bbs_posts");
        }
        //点评论
        f_reply(tid,fid,self){
            this.reply_tid = tid;
            this.reply_fid = fid;
            this.reply_Item = self;
            this.refs.minPost.f_show();
        }
        //发表评论
        submitClick(s_value){
            if(!s_value){
                return Com.toast("回复内容不能为空");
            }
            Com.postVerify({act:'bbs_post',op:'create',tid:this.reply_tid,content:s_value,fid:this.reply_fid},(res)=>{
                if(parseInt(res.code) === 0){
                    this.reply_Item.setState({i_replies:parseInt(this.reply_Item.state.i_replies)+1});
                    Com.toast("评论成功");
                } else {
                    Com.toast(res.msg);
                }
            });
        }
        f_pullUpScroll(scroll,curPage){
            let {i_tabIndex,a_list} = this.state;
            if(i_tabIndex !==3){
                requestData(i_tabIndex,curPage,(res)=>{
                    let {thread_list,page} = res.data;
                    a_list = a_list.concat(thread_list);
                    let hasMore = page?page.hasmore:false;
                    this.setState({a_list:a_list,b_allLoaded:!hasMore});
                    scroll.endScroll(!hasMore);
                },true);
            }else {
                if(e_classifyEl){
                    e_classifyEl.f_pullUpScroll(scroll,curPage);
                }
            }
        }
        render(){
            let {a_list,i_tabIndex,a_classify,b_allLoaded,n_fid,a_classifyList} = this.state;
            let e_list = null;
            let e_page = null;
            let e_classify = null;
            if(i_tabIndex == 3 && a_classify){
                e_classify = <ClassifyEl data={a_classify} f_reply={(tid,fid,self)=>this.f_reply(tid,fid,self)}/>;
            }
            if((a_list && a_list.length>0)){
                e_list =  <MinItem data={a_list} f_reply={(tid,fid,self)=>this.f_reply(tid,fid,self)}/>;
                e_page = <Scroll i_index={`${i_tabIndex}`}  b_allLoaded={b_allLoaded} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                            <HeaderNav data={this.props.data} />
                            <MinNav navIndex={a_nav} f_clickHandler={(index)=>this.f_clickHandler(index)} />
                            <HeatEl i_tabIndex={i_tabIndex}/>
                            {e_classify}
                            {e_list}
                        </Scroll>;
            }else{
                if(a_list && a_list.length===0){
                    e_list = <NotData />;
                }
                if(i_tabIndex == 3){
                    if(a_classifyList && a_classifyList.length>0){
                        e_page = <Scroll ref="scroll_3" i_index={`_${n_fid}`}  b_allLoaded={b_allLoaded} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                            <HeaderNav data={this.props.data} />
                            <MinNav navIndex={a_nav} f_clickHandler={(index)=>this.f_clickHandler(index)} />
                            <HeatEl i_tabIndex={i_tabIndex}/>
                            {e_classify}
                            {e_list}
                        </Scroll>;
                    }else {
                        e_page = <Scroll ref="scroll_3" i_index={`_${n_fid}`}  b_allLoaded={b_allLoaded}>
                            <HeaderNav data={this.props.data} />
                            <MinNav navIndex={a_nav} f_clickHandler={(index)=>this.f_clickHandler(index)} />
                            <HeatEl i_tabIndex={i_tabIndex}/>
                            {e_classify}
                            {e_list}
                        </Scroll>;
                    }
                }else {
                    e_page = <Scroll i_index={`${i_tabIndex}`}  b_allLoaded={b_allLoaded}>
                        <HeaderNav data={this.props.data} />
                        <MinNav navIndex={a_nav} f_clickHandler={(index)=>this.f_clickHandler(index)} />
                        <HeatEl i_tabIndex={i_tabIndex}/>
                        {e_classify}
                        {e_list}
                    </Scroll>;
                }
            }
            return (
                <div className="apps_bbs_index">
                    {e_page}
                    <div className="addCardBtn" onClick={()=>this.f_addPost()}><img src={AddPostImg} /></div>
                    <MinPost ref="minPost" submitClick={(value)=>this.submitClick(value)}/>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:'bbs_setting',op:'topinfo'},(res)=>{
        if(parseInt(res.code) === 0){
            let {sdata,fdata} = res.data;
            if(sdata.length===0 && fdata.length===0){
                Com.confirm("当前社区已关闭，请联系管理员",function () {
                    return ;
                });
                return ;
            }
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else {
            Com.toast(res.msg);
        }
    });
});
