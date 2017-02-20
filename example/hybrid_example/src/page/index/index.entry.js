'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("首页");
    require("indexCss");
    let BottomNav = require('bottomNav');
    let store_alias = Com.getPageParams('store_alias');
    let shop_id = Com.getPageParams('shop_id');
    let isFrom = Com.getPageParams('isFrom',window.parent.location.href);
    let curUrl = Com.getPageParams('curUrl');
    // let WxLocation = require('wxLocation');
    if(curUrl){
        if(curUrl.indexOf('?') !== -1){
            curUrl += '&shop_id='+shop_id;
        }else{
            curUrl += '?shop_id='+shop_id;
        }
    }
    let s_curIframe = curUrl || `./storeIndex.html?store_alias=${store_alias}&shop_id=${shop_id}`;
    // let n_iframeHeight = document.body.offsetHeight - Com.getPxReality(44);
    //页面组件
    let PageEl = React.createClass({
        componentDidMount(){
            if(s_curIframe.indexOf("/storeIndex.html?")>-1){

            }else {

                document.title = "会员中心";
            }
        },
        render(){
            return (
                <div className="index">
                    <iframe src={s_curIframe} frameBorder='0' marginWidth="0" name="indexGroup" id="indexGroup" seamless="seamless" width="100%" scrolling="yes"></iframe>
                    <BottomNav list={this.props.list} shop_id={shop_id} isFrom={isFrom}></BottomNav>
                </div>
             );
        }
    });
    window.f_wxLocation = (callback)=>{
        WxLocation.init((res)=>{
            callback(res);
        });
    }
    Com.getJsonP({act:"custom",op:"page_nav",store_alias:store_alias,shop_id:shop_id},(res)=>{
        let list = res.list?res.list:[];
        ReactDOM.render(<PageEl list={list}/>,document.getElementById('pageCon'));
    },true,true);
});
