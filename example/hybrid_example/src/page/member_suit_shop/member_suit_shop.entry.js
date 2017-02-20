'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("适用门店");
    let cardId = Com.getPageParams("card_id");
    let PAGE_SIZE = 10;
    let curPage = 1;
    let Scroll = require('scroll');
    let NotData = require('notData');
    let _self = null;
    let storeError = require('storeErrorImg');
    let CallEl = require("callEl");
    require("member_suit_shopCss");

    class ShopItem extends React.Component{
        constructor(props){
            super(props);
            this.state = {logoUrl:this.props.s_logo};
        }
        static proptypes = {
            s_logo:React.PropTypes.string,//图标
            s_name : React.PropTypes.string,//店名
            s_address : React.PropTypes.string,//地址栏
            s_phone : React.PropTypes.string,//电话
        }
        f_onError(){
            this.setState({logoUrl:storeError});
        }
        render(){
            let {s_logo,s_name,s_address,s_phone} = this.props;
            return(
                <div className="address_item">
                    <img src={this.state.logoUrl} alt="" onError={()=>this.f_onError()}/>
                    <div className="add_info">
                        <p>{s_name}</p>
                        <p className="base-ellipsis">{s_address || "暂无地址信息"}</p>
                    </div>
                    <CallEl mobile={s_phone}>
                        <img className="base-fr" src={require('store_phoneImg') }/>
                    </CallEl>
                </div>
            );
        }
    }
    class ShopList extends React.Component{
        static proptypes = {
            a_dataItems : React.PropTypes.array,
        }
        render(){
            let e_items = this.props.a_dataItems.map((item,key)=>{
                return <ShopItem key={key} s_logo={item.shop_img} s_name={item.shop_name} s_address={item.shop_address} s_phone={item.shop_fixed_phone}/>;
            });
            return(
                <div className="shopList">
                    {e_items}
                </div>
            );
        }
    }

    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {data:this.props.datas};
        }
        f_pullUpScroll(scroll){
            requestData((o_data)=>{
                console.log(o_data);
                let curList = o_data;
                let totalList = _self.state.data.concat(curList);
                let b_hasmore = curList.length === 0 ? true : false;
                _self.setState({data:totalList});
                scroll.endScroll(b_hasmore);
            },true);
        }
        render(){
            let items = null;
            if (this.state.data.length === 0) {
                items = <NotData/>;
            }else{
                items = <Scroll f_pullUpScroll={this.f_pullUpScroll}>
                            <ShopList a_dataItems={this.state.data}></ShopList>
                        </Scroll>;
            }
            return (
                <div className="suit_store">
                    {items}
                </div>
             );
        }
    };
    //请求数据
    function requestData(f_callBack,b_noShow){
        Com.getNormal({act:"member_wx_card",op:"apply_shop",card_id:cardId,pagesize:PAGE_SIZE,curpage:curPage},function(res){
            if(res.code === 0){
                 if (res.data.shop_list) {
                    let list = res.data.shop_list;
                    if (list.length !== 0) {
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
        _self = ReactDOM.render(<PageEl datas={data}/>,document.getElementById('pageCon'));
    });
});
