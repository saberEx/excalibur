'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    require("apps_integration_indexCss");
    TopBar.create("兑换记录");
    let Scroll = require('scroll');
    const PAGE_SIZE = 10;
    let NotData = require('notData');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            console.log(props);
            let {order_list,page} = props.data;
            this.state = {a_list:order_list || [],b_allLoaded:!page.hasmore}
        }
        f_pullUpScroll(scroll,curPage){
            let {a_list,b_allLoaded} = this.state;
            requestData((data)=>{
                let {order_list,page} = data;
                a_list = a_list.concat(order_list);
                b_allLoaded = !page.hasmore;
                this.setState({a_list:a_list,b_allLoaded:b_allLoaded});
                scroll.endScroll(!page.hasmore);
            },curPage,true);
        }
        f_onClick(point_orderid){
            Com.openWin("apps_integration_orderDetail",{order_id:point_orderid});
        }
        render(){
            let {a_list,b_allLoaded} = this.state;
            let e_list = null;
            if(a_list.length>0){
                let e_con = a_list.map((item,key)=>{
                     let {point_allpoint,point_orderid,point_goodsimage,point_goodsname,point_addtime,point_orderstatetext} = item;
                    return <div className="integralInfo" key={key} onClick={()=>this.f_onClick(point_orderid)}>
                        <div className="img_box">
                            <img src={point_goodsimage} onError={(e)=>Com.setErrorImg(e.target)}/>
                        </div>
                        <div className="goodsInfo">
                            <div className="goodsTit base-ellipsis">
                                {point_goodsname}
                            </div>
                            <div className="groupType">
                                <div className="val_b">
                                    <span className="newGroup">兑换时间：{point_addtime}</span>
                                    <div><span className="newGroup ">消费积分：<em>{point_allpoint}</em></span></div>
                                    <div>
                                        <span className="newGroup">兑换状态 {point_orderstatetext}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>;
                });
                e_list = <Scroll b_allLoaded={b_allLoaded}  f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                    <div className="flow_box">
                    {e_con}
                </div>
                </Scroll>;
            }else{
                e_list = <NotData/>;
            }
            return (
                <div className="apps_integration_record apps_integration_index">
                    {e_list}
                    {/*<footer className="iMenu">
                        <span>
                            <p>积分商城</p>
                        </span>
                        <span className='active'>
                            <p>兑换记录</p>
                        </span>
                    </footer>*/}
                </div>
             );
        }
    };
    //请求数据
    function requestData(f_callBack,curPage=1,b_noShow){
        Com.postVerify({act:"activity_pointshop",op:"point_order",pagesize:PAGE_SIZE,curpage:curPage},function(res){
            if(parseInt(res.code) === 0){
                f_callBack(res.data);
            }else{
                Com.toast(res.msg);
            }
        });
    }
    requestData((data)=>{
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});