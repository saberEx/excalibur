/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-19 17:21:06
* 拼团活动列表
*/
'use strict';
//拼团列表
Com.ready(function(){
    let TopBar = require('topBar');
    // let GroupGoodsList = require('groupGoodsList');
    let CommonDefault = require('commonDefaultImg');
    TopBar.create("拼团列表");
    require("group_listCss");
    let MyGroupGoods = require('myGroupGoods');
    let Scroll = require('scroll');
    let NotData = require('notData');
    const PAGE_SIZE = 10;
    let curPage = 1;
    let _self = null;
    let _h = document.body.offsetHeight;
    //页面组件
    class PageEl extends React.Component{
        constructor(props){
            super(props);
            this.state = {spell_list:this.props.data};
        }
        f_pullUpScroll(scroll){
            requestData(function(o_data){
                let curList = o_data;
                let totalList = _self.state.spell_list.concat(curList);
                let b_hasmore = curList.length === 0 ? true : false;
                _self.setState({spell_list:totalList});
                scroll.endScroll(b_hasmore);
            },true);
        }
        f_callBack(spell_id,spell_goods_alias){
            Com.openWin("group_goodDetails",{shop_id:0,spell_id:spell_id,goods_alias:spell_goods_alias});
        }
        render(){
            let {spell_list} = this.state;
            let e_item = null;
            if (spell_list.length > 0) {
                 e_item = <Scroll f_pullUpScroll={this.f_pullUpScroll} style={{height:_h}}>
                            <MyGroupGoods b_isList={true} a_array={spell_list} f_goodsCallBack={this.f_callBack}></MyGroupGoods>
                        </Scroll>;
            }else{
                e_item = <NotData/>;
            }
            return (
                <div className="group_list">
                    {e_item}
                </div>
            );
        }
    }

    //请求数据
    function requestData(f_callBack,b_noShow){
        Com.getNormal({act:"normal_index",op:"group_index",pagesize:PAGE_SIZE,curpage:curPage},function(res){
            console.log(res);
            if(res.code === 0){
                if (res.data) {
                    let list = res.data.spell_list;
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
       _self = ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    },false);
});
