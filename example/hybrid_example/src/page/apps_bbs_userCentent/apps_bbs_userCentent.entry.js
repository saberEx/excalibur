'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("用户中心");
    require("apps_bbs_userCententCss");
    let MinNav = require('minNav');
    let userImg = require("userDefaultImg");
    let MinList = require('minList');
    let userId = Com.getPageParams("userId");
    let Scroll = require("scroll");
    let PAGE_SIZE = 15;
    let requestData = (index,curPage,f_callback,isNoShowProgress)=>{
        curPage = curPage || 1;
        let s_op = index == 0 ? 'threads' : 'posts';
        Com.postNormal({act:'bbs_member_common',op:s_op,mem_id:userId,pagesize:PAGE_SIZE,curpage:curPage},(res)=>{
            if(parseInt(res.code) === 0){
                f_callback(res);
            }else {
                Com.toast(res.msg);
            }
        },isNoShowProgress);
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                memberInfo:{},
                a_list:[null,null],
                a_allLoaded:[false,false],
                tabIndex:0
            }
        }
        componentDidMount(){
            requestData(0,1,(res)=>{
                let {memberInfo,threads,page} = res.data;
                let hasMore = page?page.hasmore:false;
                let {a_list,a_allLoaded} = this.state;
                a_list[0] = threads;
                a_allLoaded[0 ] = !hasMore;
                this.setState({memberInfo:memberInfo,a_list:a_list,a_allLoaded:a_allLoaded});
            });
        }
        f_pullUpScroll(scroll,curPage){
            let {tabIndex} = this.state;
            requestData(tabIndex,curPage,(res)=>{
                let {memberInfo,threads,posts,page} = res.data;
                let hasMore = page?page.hasmore:false;
                let {a_list,a_allLoaded} = this.state;
                let a_data = tabIndex === 0 ?threads : posts;
                a_list[tabIndex] = a_list[tabIndex].concat(a_data);
                a_allLoaded[tabIndex] = !hasMore;
                this.setState({memberInfo:memberInfo,a_list:a_list,a_allLoaded:a_allLoaded});
                scroll.endScroll(!hasMore);
            });
        }
        f_clickHandler(index){
            let {a_list} = this.state;
            if(!a_list[index]){
                this.setState({tabIndex:index},()=>{
                    requestData(index,1,(res)=>{
                        let {memberInfo,threads,posts,page} = res.data;
                        let {a_list,a_allLoaded} = this.state;
                        let hasMore = page?page.hasmore:false;
                        a_list[index] = index === 0 ?threads : posts;
                        a_allLoaded[index] = !hasMore;
                        this.setState({memberInfo:memberInfo,a_list:a_list,tabIndex:index,a_allLoaded:a_allLoaded});
                    });
                });
            }else{
                this.setState({tabIndex:index});
            }
        }
        render(){
            let {memberInfo,a_list,tabIndex,a_allLoaded} = this.state;
            let {member_avatar="",member_name=""} = memberInfo;
            member_name = Com.replaceName(member_name);
            let e_left = null;
            if(a_list[0] && a_list[0] .length>0){
                e_left =  <div className={`base-mT10 ${tabIndex===0?"scroll-container":"base-hide scroll-container"}`}>
                                <Scroll b_allLoaded={a_allLoaded[0]} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                                <MinList data={a_list[0] }/>
                                </Scroll>
                            </div>;
            }
            let e_right = null;
            if(a_list[1] && a_list[1] .length>0){
                e_right = <div className={`base-mT10 ${tabIndex===1?"scroll-container":"base-hide scroll-container"}`}>
                                <Scroll b_allLoaded={a_allLoaded[1]} f_pullUpScroll={(i_curPage,scroll)=>this.f_pullUpScroll(i_curPage,scroll)}>
                                    <MinList data={a_list[1]} b_posts={true}/>
                                </Scroll>
                            </div>;
            }
            return (
                <div className="apps_bbs_userCentent">
                    <header className="userInfo">
                        <div className="userImg base-positionRel"><img src={member_avatar || userImg} onError={(ev)=>ev.target.src=userImg}/></div>
                        <p className="mgt10">{member_name}</p>
                    </header>
                    <MinNav navIndex={["发布","回帖"]}  f_clickHandler={(index)=>this.f_clickHandler(index)} />
                    {e_left}
                    {e_right}
                </div>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"apps_bbs_userCentent",op:"apps_bbs_userCentent"},function(res){
    //     if(res.code === 0){

            ReactDOM.render(<PageEl  />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});
