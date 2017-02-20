'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("全部商品");
    let GoodsList = require('goods_list');
    let Scroll = require('scroll');
    let NotData = require("notData");
    require("search_resultCss");
    let shop_id = Com.getPageParams('shop_id');
    const PAGE_SIZE = 10;
    let o_param = {};
    //商家端页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {a_list:this.props.a_list,b_allLoaded:this.props.b_allLoaded};
        }
        _pullUpScroll(scroll,curPage){
            var self = this;
            _storeRequestData((res)=>{
                let a_resList = res.data.list;
                let a_list = self.state.a_list.concat(a_resList);
                let b_allLoaded = !res.data.page.hasmore;
                scroll.endScroll(b_allLoaded);
                self.setState({a_list:a_list,b_allLoaded:b_allLoaded});
            },curPage,true);
        }
        render(){
            let {a_list,b_allLoaded} = this.state;
            let e_list = null;
            if(a_list && a_list.length>0){
                e_list = <Scroll f_pullUpScroll={(scroll,curPage)=>this._pullUpScroll(scroll,curPage)} b_allLoaded={b_allLoaded}>
                    <GoodsList data={{goods_style:1,block_style:0,goods_list:a_list}}/>
                </Scroll>;
            }else {
                e_list = <NotData />
            }
            return (
                <div className="search_result">
                    {e_list}
                </div>
             );
        }
    };
    //门店端页面组件
    class ShopCPageEl extends React.Component{
        render(){
            return (
                <div>123445</div>
            );
        }
    }
    //请求商家端商品数据
    function _storeRequestData(f_callback,curPage=1,b_noShow){
        o_param['curpage'] = curPage;
        Com.getNormal(o_param,function(res){
            if(parseInt(res.code) === 0){
                f_callback(res);
                o_param.pageOffset += PAGE_SIZE;
            }else{
                Com.toast(res.msg);
            }
        },b_noShow);
    }
    let type = parseInt(Com.getPageParams('type'));
    let value = Com.getPageParams('value');
    o_param = {act:"normal_index",op:"searchInfo",type:type,value:value,pagesize:PAGE_SIZE};
    _storeRequestData((res)=>{
        ReactDOM.render(<PageEl a_list={res.data.list} b_allLoaded={res.data.page?!res.data.page.hasmore:false}/>,document.getElementById('pageCon'));
    });

});
