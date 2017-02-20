/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-21 13:52:44
* 我的拼团列表
*/
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("我的拼团");
    require("group_myGroupCss");
    let MyGroupGoods = require('myGroupGoods');
    let Scroll = require('scroll');
    let NotData = require('notData');
    const PAGE_SIZE = 10;
    let curPage = 1;
    let _self = null;
    //页面组件
    class PageEl extends React.Component{
        constructor(props){
            super(props);
            this.state = {data:this.props.list};
        }
        f_pullUpScroll(scroll){
            requestData(function(o_data){
                let curList = o_data;
                let totalList = _self.state.data.concat(curList);
                let b_hasmore = curList.length === 0 ? true : false;
                _self.setState({data:totalList});
                scroll.endScroll(b_hasmore);
            },true);
        }
        f_callBack(open_sn){
            Com.openWin('group_detail',{open_sn:open_sn});
        }
        render(){
            let {data} = this.state;
            let e_item = "";
            if (data.length > 0){
                e_item = <Scroll f_pullUpScroll={this.f_pullUpScroll}>
                            <MyGroupGoods b_isList={false} a_array={data} f_detailCallBack={this.f_callBack}></MyGroupGoods>
                        </Scroll>;
            }else{
                e_item = <NotData/>;
            }
            return (
                <div className="myGroup">
                    {e_item}
                </div>
             );
        }
    };
    //请求数据
    function requestData(f_callBack,b_noShow){
        Com.getNormal({act:"activity_spell_group",op:"member_spell_list",pagesize:PAGE_SIZE,curpage:curPage},function(res){
            if(res.code === 0){
                 if (res.data.list) {
                    let list = res.data.list.open_list;
                    if (list.length != 0) {
                        curPage++;
                    }
                    f_callBack(list);
                }
            }else{
                Com.toast(res.msg);
            }
        },b_noShow);
    }
    requestData((data)=>{
       _self = ReactDOM.render(<PageEl list={data}/>,document.getElementById('pageCon'));
    },false)
});
