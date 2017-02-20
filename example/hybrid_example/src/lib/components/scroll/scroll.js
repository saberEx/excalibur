/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-23 18:20:46
* 滚动组件，支持上拉刷新，下拉刷新
* 用法：
<Scroll f_pullUpScroll={this.pullUpScroll} >
    <ul>
         {e_list}
     </ul>
 </Scroll>;
*/

"use strict";
let IScroll = require('iscroll-lite');
require('scrollCss');
//上拉组件
class BottomEl extends React.Component{
    constructor(props){
        super(props);
        this.state={
            i_scrollType:0
        }
    }
    render(){
        let e_list = [];
        let b_notBottomEl = this.props.b_notBottomEl;
        for(var i = 0;i<12;i++){
            e_list.push(<div key={i} className={"weui_loading_leaf weui_loading_leaf_"+i}></div>);
        }
        let e_item = null;
        if(this.props.i_scrollType===0){
            e_item = <div className="loadingBody">
                <span >上拉加载更多</span>
            </div>;
        }else if(this.props.i_scrollType===1) {
            e_item = <div className="loadingBody">
                <div className="weui_loading">
                    {e_list}
                </div>
                <span className="loadingInfo"><span>正在加载</span></span>
            </div>;
        }else{
            e_item = <div className="loadingBody">
                <span >没有更多数据了</span>
            </div>;
        }

        return (
            <div className={`scroll-bottom ${b_notBottomEl?"base-hide":""}`}>
                {e_item}
            </div>
        );
    }
}
//下拉刷新组件
class TopEl extends React.Component{
    constructor(props){
        super(props);
        this.state={
            i_scrollType:0
        }
    }
    render(){
        let e_list = [];
        for(var i = 0;i<12;i++){
            e_list.push(<div key={i} className={"weui_loading_leaf weui_loading_leaf_"+i}></div>);
        }
        let e_item = null;
        if(this.props.i_scrollType===0){
            e_item = <div className="scroll-bottom">
                        <div className="loadingBody">
                        <span >下拉刷新</span>
                        </div>
                    </div>;
        }else if(this.props.i_scrollType===1) {
            e_item = <div className="scroll-bottom">
                <div className="loadingBody">
                    <span >松开刷新</span>
                </div>
            </div>;
        }else if(this.props.i_scrollType===2){
            e_item = <div className="scroll-bottom">
                <div className="loadingBody">
                    <div className="weui_loading">
                        {e_list}
                    </div>
                    <span className="loadingInfo">正在刷新</span>
                </div>
            </div>;
        } else {
            e_item = null;
        }
        return (
            e_item
        );
    }
}

class Scroll extends React.Component{
    constructor(props){
        super(props);
        this.state={
            i_scrollType:this.props.b_allLoaded?2:0,
            i_positiveUpType:3
        }
        this.i_requestState = 0;//0:可请求，1:正在请求，2:禁止请求
        this.i_downRequestState = 0;//0:可刷新，1:正在刷新，2:禁止刷新
        this.i_curPage = 2;//当前请求分页页数
        this.b_needRefresh = true;//用来解决子元素有图片高度不确定时容器高度计算错误重新计算判定
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.children !== this.props.children){
            this.b_needRefresh = true;
            this.myScroll.refresh();
        }
    }
    //请求到数据调用
    endScroll(b_forbid){
        //设置能否滚动
        if(this.props.f_pullUpScroll){
            this.i_curPage = this.i_curPage + 1;
            if(!b_forbid){
                this.i_requestState = 0;
                this.setState({i_scrollType:0});
            }else {
                this.i_requestState = 2;
                this.setState({i_scrollType:2});
            }
        }
        if(this.props.f_pullDownScroll){
            this.i_downRequestState = 0;
            this.setState({i_positiveUpType:3});
        }
    }
    //当scroll做为数据渲染前就加载属性b_allLoaded无效时用
    initAllLoaded(b_forbid){
        if(this.props.f_pullUpScroll){
            if(!b_forbid){
                this.i_requestState = 0;
                this.setState({i_scrollType:0});
            }else {
                this.i_requestState = 2;
                this.setState({i_scrollType:2});
            }
        }
    }
    componentWillUnmount(){
        this.myScroll.destroy();
    }
    componentWillReceiveProps(nextProps){
        if(typeof this.props.i_index != "undefined"  && typeof nextProps.i_index != "undefined" && this.props.i_index != nextProps.i_index){
            this.i_curPage = 2;
            if(nextProps.b_allLoaded){
                this.i_requestState = 2;
                this.setState({i_scrollType:2});
            }else {
                this.i_requestState = 0;
                this.setState({i_scrollType:0});
            }
            this.myScroll.scrollTo(0,0);
        }
    }
    componentDidMount(){
        Base.setImmerseBar('.scroll-wrapper',20,1);
        var options = this.props.options || {};
        function iScrollClick(){
            if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)){
                return false;
            }
            if (/Chrome/i.test(navigator.userAgent)){
                return (/Android/i.test(navigator.userAgent));
            }
            if (/Silk/i.test(navigator.userAgent)){
                return false;
            }
            if (/Android/i.test(navigator.userAgent)) {
               var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
               return parseFloat(s[0]+s[3]) < 44 ? false : true;
            }
        }
        if(this.props.b_allLoaded){
            this.i_requestState = 2;
        }
        options['click'] = iScrollClick();
        options['bounce'] = true;
        options['checkDOMChanges'] = true;
        this.myScroll =  new IScroll(this.refs.wrapper,options);
        let self= this;
        var b_pullDown = !!this.props.f_pullDownScroll;
        this.myScroll.on("scrollEnd",function(){
            self.b_needRefresh = false;
            if(self.i_requestState === 0 && this.maxScrollY === this.y){
                if(self.props.f_pullUpScroll && !self.props.b_notBottomEl){
                    self.i_requestState = 1;
                    self.setState({i_scrollType:1});
                    self.props.f_pullUpScroll(self,self.i_curPage);
                 }else if(self.b_pullUpBounce && self.props.f_scrollEnd){
                    self.props.f_scrollEnd(1);
                }
            }
            if(self.i_downRequestState === 0 && this.y===0 ){
                if(b_pullDown && self.state.i_positiveUpType===1){
                    self.i_downRequestState = 1;
                    self.setState({i_positiveUpType:2});
                    self.props.f_pullDownScroll(self);
                }else {
                    self.setState({i_positiveUpType:3});
                }
                if(self.props.f_scrollEnd){
                    self.props.f_scrollEnd(2);
                }
            }
        });
        var b_hor = this.props.b_hor;
        this.myScroll.on('scrollStart',function(){
            if(self.b_needRefresh || self.props.b_needRefresh){
                self.myScroll.refresh();
            }
/*            if(!b_hor){
                if(this.directionY === -1 && !b_pullDown){
                    this.options.bounce = false;
                }else{
                    this.options.bounce = true;
                }
            }else{
                this.options.bounce = true;
            }*/
        });
        this.myScroll.on('scroll',function(){
            if(b_pullDown){
                if(this.y>0 && this.y <=50){
                    if(self.state.i_positiveUpType !==0){
                        self.setState({i_positiveUpType:0});
                    }
                }else if(this.y>50){
                    if(self.state.i_positiveUpType !==1){
                        self.setState({i_positiveUpType:1});
                    }
                }else {
                    if(self.state.i_positiveUpType !==3){
                        self.setState({i_positiveUpType:3});
                    }
                }
            }
            if(this.y < this.maxScrollY - 100){
                self.b_pullUpBounce = true;
            }else{
                self.b_pullUpBounce = false;
            }
        });
    }
    scrollTo(x , y , time, relative){
        if(this.myScroll){
            x = x || 0;
            y = y || 0;
            time = time || 300;
            this.myScroll.scrollTo(x,y,time,relative);
        }
    }
    render(){
        let s_cls = this.props.b_hor ? "horizontal" : "vertical";
        let e_bottomEl = null;
        let e_topEl = null;
        if(this.props.f_pullUpScroll){
            e_bottomEl = <BottomEl i_scrollType={this.state.i_scrollType} b_notBottomEl={this.props.b_notBottomEl}/>;
        }
        e_topEl = <TopEl i_scrollType={this.state.i_positiveUpType} />;
        return (
            <div className="scroll" style={this.props.style}>
                <div ref="wrapper"  className={s_cls}>
                    <div className="sdd">
                        {e_topEl}
                        {this.props.children}
                        {e_bottomEl}
                    </div>
                </div>
            </div>
        );
    }
}
if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function(){
        return Scroll;
    });
} else if(typeof module !== 'undefined' && module.exports){
    module.exports = Scroll;
} else{
    window.ScrollBottom = Scroll;
}
