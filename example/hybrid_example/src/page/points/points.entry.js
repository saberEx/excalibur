/*
 * @Author: 黄权
 * @Date:   2016-12-16 10:46:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-16 16:52:10
 * 个人中心积分
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("积分明细");
    require("pointsCss");
    let Scroll = require("scroll");
    let PAGE_SIZE = 10;
    let LabelInput = require('labelInput');
    let MediaItem = require('mediaItem');
    let NotData = require("notData");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
               a_list :this.props.data.list,
                b_allLoaded:this.props.data.pageCount<2
            }
        }
        f_mediaClick(){
            Com.openWin("apps_integration_index");
        }
        f_rule(){
             Com.openWin("points_rule");
        }
        f_pullUpScroll(scroll,curPage){
            let {a_list} = this.state;
            requestData((data)=>{
                let {pageCount,list} = data;
                a_list = a_list.concat(list);
                this.setState({a_list:a_list,b_allLoaded:curPage>=pageCount});
                scroll.endScroll(pageCount<=curPage);
            },curPage,true);

        }
        render(){
            let {total} = this.props.data;
            let {a_list,b_allLoaded} = this.state;
            let e_list = null;
            if(a_list && a_list.length>0){
                let e_li = a_list.map((item,key)=>{
                    let {pl_addtime,pl_points,pl_desc} = item;
                    return <li key={key}>
                            <span className="xf_name">{pl_desc}</span>
                            <span  className="integral_number base-tr base-fr">
                                {pl_points>0?"+"+pl_points:pl_points} <br/>
                                <em>{Com.getTimeFormat(pl_addtime,2)}</em>
                            </span>
                            </li>;
                });
                e_list = <Scroll f_pullUpScroll={(scroll,curPage)=>this.f_pullUpScroll(scroll,curPage)} b_allLoaded={b_allLoaded}>
                     <ul>
                     {e_li}
                    </ul>
                </Scroll> ;
            }else {
                e_list = <NotData />;
            }
            return (
                <div className="points">
                    <div className="myInt base-mB10">
                        <p className="newInt">当前总积分</p>
                        <h3 className="intNum"><em></em>{total ||0}</h3>
                    </div>
                    <div className="mem_items s_shop"> 
                        <MediaItem ref="input_0" s_img={require('storeIconImg')} s_label="积分商城" onClick={()=>{this.f_mediaClick();}} b_after={true} b_line={true} />
                    </div>
                    <div className="mem_items"> 
                        <MediaItem ref="input_0" s_img={require('order_detail_iconImg')} s_label="积分规则" onClick={()=>{this.f_rule();}} b_after={true} />
                    </div>
                    <div className="integral_box base-mT10">
                        {e_list}
                    </div>
                </div>
             );
        }
    };
    //请求数据
    function requestData(callBack,curPage=1,b_noShow) {
        Com.getVerify({act:"member_points",op:"member_points_log",pagesize:PAGE_SIZE,curpage:curPage},(res)=>{
            if(parseInt(res.code) === 0){
                callBack(res.data);
            }else{
                Com.toast(res.msg);
            }
        },b_noShow);
    }
    requestData((data)=>{
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});