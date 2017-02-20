/*
 * @Author: 黄权
 * @Date:   2016-12-07 09:57:26
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-14 13:38:39
 * 售后订单列表
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    let PAGE_SIZE = 10;
    TopBar.create("售后订单");
    require("order_customerServiceOrderCss");
    let OrderListAfter = require("orderListAfter");
    let Scroll = require("scroll");
    let NotData = require("notData");
    let noDataIcon_myOrderImg = require("noDataIcon_myOrderImg");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            let {order_group_list,page} = this.props.data;
            this.state = {a_list:order_group_list,b_allLoaded:!page.hasmore};
        }
        f_pullUpScroll(scroll,i_curPage){
            let {a_list,b_allLoaded} = this.state;
            requestData((data)=>{
                a_list = a_list.concat(data.order_group_list);
                b_allLoaded = !data.page.hasmore;
                this.setState({a_list:a_list,b_allLoaded:b_allLoaded});
                scroll.endScroll(b_allLoaded);
            },i_curPage,true);
        }
        render(){
            let {a_list,b_allLoaded} = this.state;
            let e_list = null;
            if(a_list && a_list.length>0){
                e_list = <Scroll b_allLoaded={b_allLoaded} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                    <OrderListAfter data={a_list}/>
                </Scroll>
            }else {
                e_list = <NotData s_content="还没有此类订单" b_needBtn={true} imgUrl={noDataIcon_myOrderImg}/>;
            }
            return (
                <div className="order_customerServiceOrder">
                    {e_list}
                </div>
             );
        }
    };
    //请求数据
    function requestData(callBack,curPage=1,b_isNoShowProgress) {
        Com.postVerify({act:"member_order",op:"after_service_list",curpage:curPage,pagesize:PAGE_SIZE},function(res){
            if(parseInt(res.code) === 0){
                callBack(res.data);
            }else{
                Com.toast(res.msg);
            }
        },b_isNoShowProgress);
    }
    requestData((data)=>{
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});
