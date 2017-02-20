/*
 * @Author: 黄权
 * @Date:   2016-11-24 10:48:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-10 14:10:22
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("我的收藏");
    require("record_myFavoritesCss");
    let PAGE_SIZE = 10;
    let GoodsList = require("goods_list");
    let Scroll = require("scroll");
    let NotData = require("notData");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_list:this.props.data.favorites_list,b_allLoaded:!this.props.data.page.hasmore};
        }
        f_pullUpScroll(scroll,i_curPage){
            requestData((data)=>{
                let {a_list,b_allLoaded} = this.state;
                a_list = a_list.concat(data.favorites_list);
                let hasMore = data.page.hasmore;
                b_allLoaded = !hasMore;
                this.setState({a_list:a_list,b_allLoaded:b_allLoaded});
                scroll.endScroll(!hasMore);
            },i_curPage,true);
        }
        render(){
            let {a_list,b_allLoaded} = this.state;
            let e_list = null;
            if(a_list && a_list.length>0){
                e_list = <Scroll f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)} b_allLoaded={b_allLoaded} >
                    <GoodsList data={{goods_list:a_list,isFavorites:1,goods_style:1,block_style:0}}/>
                </Scroll>;
            }else {
                e_list = <NotData s_content="暂无收藏记录" imgUrl={require("noDataIcon_record_myFavoritesImg")} b_needBtn={true}/>;
            }
            return (
                <div className="record_myFavorites">
                    {e_list}
                </div>
             );
        }
    };
    //请求数据
    function requestData(callback,curPage=1,b_isNoShowProgress) {
        Com.getNormal({act:'member_favorites',op:'favorites_list',type:1,pagesize:PAGE_SIZE,curpage:curPage},function(res){
            if(parseInt(res.code) === 0){
                callback(res.data);
            }else{
                Com.toast(res.msg);
            }
        },b_isNoShowProgress);
    }
    requestData((data)=>{
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});
