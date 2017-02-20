/*
 * @Author: 黄权
 * @Date:   2016-11-11 09:38:39
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-16 11:30:41
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("购物车");
    require("myShopCartCss");
    let NumBox = require('numBox');
    let commonDefaultImg = require('commonDefaultImg');
    let radio_sed_bg = require('radio_sed_bgImg');
    let radio_bg = require('radio_bgImg');
    let NotData = require("notData");
    //把服务端返回的数据处理成需要的模板样式
    function changeDataListModol(dataList) {
        if(dataList.length >0){
            let newDataList={};
            for(let i in dataList){
                let data = dataList[i];
                let cart_id = parseInt(data.cart_id);
                let shop_id = data.shop_id;
                if(!newDataList[shop_id]){
                    newDataList[shop_id] = {};
                    newDataList[shop_id].store_name = data.store_name;
                    newDataList[shop_id].shop_id = data.shop_id;
                    newDataList[shop_id].list = {};
                }
                newDataList[shop_id].list[cart_id] = data;
            }
            return newDataList;
        }
        return null;
    }
    class GoodsItem extends React.Component {
        constructor(props){
            super(props);
            this._checked = true;
            this.state = {b_checked:!this.props.b_editState,goods_num:this.props.data.goods_num};
        }
        f_check(b_checked){
            b_checked = !b_checked;
            this._checked = b_checked;
            this.props.f_changeSingle(b_checked);
        }
        f_goodsDetails(goods_alias,shop_id){
            Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
        }
        componentDidUpdate(){
        }
        render(){
            let {goods_image,goods_name,goods_alias,goods_price,goods_num,shop_id} = this.props.data;
            let {b_allSelected,b_editState,b_hasChecked} = this.props;
            // let {b_checked} = this.state;
            let b_checked = this._checked;
            b_checked = b_allSelected?true:b_checked;
            b_checked = !b_hasChecked?false:b_checked;
            this._checked = b_checked;
            return  <div className="goodsInfo">
                <img className="checked  base-transY" src={b_checked?radio_sed_bg:radio_bg} onClick={()=>this.f_check(b_checked)}/>
                <img className="goodsImg" src={Com.getGoodsImg(goods_image)} onError={(ev)=>ev.target.src=commonDefaultImg} onClick={()=>this.f_goodsDetails(goods_alias,shop_id)}/>
                <div className="goodsWrap">
                    {b_editState?<div className="goodsEdit">
                        <NumBox ref="numBox" i_value={parseInt(goods_num)} i_min={1}/>
                    </div>:
                        <div className="goodsTit base-ellipsis2"  onClick={()=>this.f_goodsDetails(goods_alias)}>
                            {goods_name}
                        </div>
                    }
                    <div className="goodsClassIfy">
                        &nbsp;
                    </div>
                    <div className="goodsPrice">
                        ￥<em>{goods_price}</em><span>&nbsp;</span>
                        {b_editState?null:<span className="base-fr">x{goods_num}</span>}
                    </div>
                </div>
            </div>;
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            let {cart_list,sum} = this.props.data;
            let a_list = changeDataListModol(cart_list);
            this._allCheckedPrice = sum;
            this.state = {a_list:a_list,n_totalPrice:sum,b_editState:false,b_allSelected:true,b_hasChecked:true};
        }
        //编辑、完成
        f_editClick(b_editState){
            if(b_editState){
                let refs = this.refs;
                let {a_list} = this.state;
                let a_card = [];
                for(let key in a_list){
                    if(a_list.hasOwnProperty(key)){
                        let item = a_list[key];
                        let {list} = item;
                        for(let key1 in list){
                            let i_value = refs[key1].refs.numBox.value;
                            list[key1].goods_num = i_value;
                            a_card.push(`${list[key1].cart_id}|${i_value}`);
                        }
                    }
                }
                Com.postVerify({act:"member_cart",op:'cart_edit_quantity',goodNums:a_card.join(',')},(res)=>{
                    if(parseInt(res.code)===0 && res.data){
                        this._allCheckedPrice = parseFloat(res.data.total_price);
                        this.setState({a_list:a_list,b_editState:false,b_allSelected:true,b_hasChecked:true,n_totalPrice:parseFloat(res.data.total_price)});
                    }else{
                        Com.toast(res.msg);
                    }
                });
            }else {
                this.setState({b_editState:true,b_allSelected:false,b_hasChecked:false});
            }
        }
        f_changeAll(){
            let b_selected = !this.state.b_allSelected;
            let n_totalPrice = b_selected?this._allCheckedPrice:0.00;
            this.setState({b_allSelected:b_selected,b_hasChecked:b_selected?true:false,n_totalPrice:n_totalPrice});
        }
        f_changeSingle(){
            let refs = this.refs;
            let {a_list} = this.state;
            let b_allSelected = true;
            let b_hasChecked = false;
            let n_totalPrice = 0;
            for(let key in a_list){
                if(a_list.hasOwnProperty(key)){
                    let item = a_list[key];
                    let {list} = item;
                    for(let key1 in list){
                        if(refs[key1]._checked){
                            let {goods_price,goods_num} = list[key1];
                            n_totalPrice += parseFloat(goods_price * goods_num);
                            b_hasChecked = true;
                        }else {
                            b_allSelected = false;
                        }

                    }
                }
            }
            this.setState({b_allSelected:b_allSelected,b_hasChecked:b_hasChecked,n_totalPrice:n_totalPrice});
        }
        //删除
        f_cancel(){
            let {b_hasChecked} = this.state;
            if(!b_hasChecked){
                return;
            }
            let refs = this.refs;
            let {a_list} = this.state;
            let a_card = [];
            let n_count = 0;
            for(let key in a_list){
                if(a_list.hasOwnProperty(key)){
                    let item = a_list[key];
                    let {list} = item;
                    for(let key1 in list){
                        n_count = n_count + 1;
                        if(refs[key1]._checked){
                            a_card.push(list[key1].cart_id);
                            delete list[key1];
                        }
                    }
                }
            }
            Com.postVerify({act:'member_cart',op:'cart_del',cartIds:a_card.join(',')},(res)=>{
                if(parseInt(res.code)===0){
                    if(n_count === a_card.length){
                        a_list = null;
                    }
                    this.setState({a_list:a_list,b_hasChecked:false});
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        //结算
        f_submit(){
            let {b_hasChecked} = this.state;
            if(!b_hasChecked){
                return;
            }
            let refs = this.refs;
            let {a_list} = this.state;
            let a_card = [];
            let i_shop_id = 0;
            for(let key in a_list){
                if(a_list.hasOwnProperty(key)){
                    let item = a_list[key];
                    let {list,shop_id} = item;
                    i_shop_id = parseInt(shop_id);
                    for(let key1 in list){
                        if(refs[key1]._checked){
                            a_card.push(`${list[key1].cart_id}|${list[key1].goods_num}`);
                        }
                    }
                }
            }
           Com.openWin("order_submit",{shop_id:i_shop_id,cartIds:a_card.join(','),ifcart:1,cartNum:a_card.length});
        }
        render(){
            let {a_list,n_totalPrice,b_editState,b_allSelected,b_hasChecked} = this.state;
            let e_list = null;
            if(a_list){
                e_list = [];
                for(let key in a_list){
                    if(a_list.hasOwnProperty(key)){
                        let item = a_list[key];
                        let {store_name,list} = item;
                        let e_goods = [];
                        for(let key1 in list){
                            e_goods.push(<GoodsItem ref={`${key1}`} f_changeSingle={(b_checked)=>this.f_changeSingle(b_checked)} key={key1}
                                                    data={list[key1]} b_editState={b_editState} b_allSelected={b_allSelected} b_hasChecked={b_hasChecked}/>);
                        }
                        e_list.push(<div className="cartWrap" key={key}>
                            <div className="storeName">
                                <img className="storeImg" src={require('storeIconImg')} />
                                {store_name}
                                <span onClick={()=>this.f_editClick(b_editState)} className="base-fr">{b_editState?"完成":"编辑"}</span>
                            </div>
                            {e_goods}
                        </div>);
                    }
                }
            }else {
                //空白页
                e_list = <NotData s_content="购物车是空" b_needBtn={true}/>;
            }
            return (
                <div className="myShopCart">
                    {e_list}
                    <div className="hideHeight"></div>
                    {a_list?<footer className="buy_fixed">
                        <div className="allBox">
                            <img className="bug_allImg base-transY" src={b_allSelected?radio_sed_bg:radio_bg} onClick={()=>this.f_changeAll()}/>
                            全选
                        </div>
                        <div className={`allCount base-fr ${b_editState?"base-hide":""}`}>
                            <p>总计：<em>￥{parseFloat(n_totalPrice).toFixed(2)}</em></p>
                            <p className="ems">不含运费</p>
                        </div>
                        {b_editState?<div className={`buy_btn ${b_hasChecked?"balance_btn":"del_btn"}`} onClick={()=>this.f_cancel()}>删除</div>:
                            <div className={`buy_btn ${b_hasChecked?"balance_btn":"del_btn"}`} onClick={()=>this.f_submit()}>结算</div>
                        }
                    </footer>:null}
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:"member_cart",op:"cart_list"},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
