/*
 * @Author: 黄权
 * @Date:   2016-12-19 16:16:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-19 17:25:22
 * 商品规格弹出层，带加入购物车和立即购买
 */
'use strict';
require('goodsSpecLayerCss');
let NumBox = require('numBox');
let commonDefaultImg = require("commonDefaultImg");
let ActionSheet = require("actionSheet");
let classSet = require("classnames");
//规格转换
function changeSpec(com_spec_list) {
    let a_spec = [];
    let {spec_name_list={},spec_value_list={}} = com_spec_list;
    for(let i in spec_name_list){
        if(spec_name_list[i]){
            a_spec.push({name:spec_name_list[i],value:spec_value_list[i]||{}});
        }
    }
    return a_spec;
}
class GoodsSpecLayer extends React.Component {
    constructor(props){
        super(props);
        let a_spec = changeSpec(this.props.com_spec_list || {});
        let all_com_goods = this.props.all_com_goods;
        let a_activeSpec = [];
        a_spec.forEach((item,key)=>{
            for(let i in item.value){
                if(all_com_goods[this.props.goods_alias].goods_spec[i]){
                    a_activeSpec[key] = i;
                    return;
                }
            }
        });
        this.state = {goods_alias:this.props.goods_alias,a_activeSpec:a_activeSpec,a_spec:a_spec,b_show:false,i_type:this.props.i_type||1,b_disabled:true};
    }
    closeCart(){
        this.setState({b_show:false});
    }
    //选取规格
    f_spec(index,value){
        let {a_activeSpec,goods_alias} = this.state;
        let all_com_goods = this.props.all_com_goods;
        a_activeSpec[index] = value;
        for(let i in all_com_goods){
            let goods_spec = all_com_goods[i].goods_spec;
            let isCurGoods = true;
            a_activeSpec.forEach((item)=>{
                if(!goods_spec[item]){
                    isCurGoods = false;
                }
            });
            if(isCurGoods){
                goods_alias = i;
                break;
            }
        }
        this.setState({goods_alias:goods_alias,a_activeSpec:a_activeSpec});
    }
    //确定加入购物车或者购买
    f_submit(index,goods_storage){
        if(goods_storage<=0){
            return;
        }
        let i_num = this.refs.numbox.value;
        let {goods_alias} = this.state;
        switch (index){
            case 1: //加入购物车
                Com.postVerify({act:"member_cart",op:"cart_add",goods_alias:goods_alias,quantity:i_num},(res)=>{
                    if(parseInt(res.code)===0){
                        if(!parseInt(res.data.shop_id) && parseInt(res.data.shop_id) !==0 ){
                            Com.toast("加入购物车成功");
                            let cart_goods_num = res.data.cart_goods_num;
                            this.setState({b_show:false},()=>{
                                this.props.f_changeCartNum && this.props.f_changeCartNum(cart_goods_num);
                            });
                        }else{
                            //是否清空原购物车或者先去购物车结算层
                            this.new_shop_id = res.data.shop_id;
                            this.refs.actionSheet.toggle();
                        }
                    }else {
                        Com.toast(res.msg);
                    }
                });
                break;
            case 2: //立即购买
                let o_params = {cartIds:`${goods_alias}|${i_num}`,ifcart:0};
                Com.openWin("order_submit",o_params);
                break;
        }
    }
    f_deleteCard(){
        let {goods_alias} = this.state;
        let i_num = this.refs.numbox.value;
        this.refs.actionSheet.toggle();
        Com.postVerify({act:"member_cart",op:"cart_add",is_drop:1,goods_alias:goods_alias,quantity:i_num},(res)=>{
            if(res.code == 0){
                this.props.f_changeCartNum && this.props.f_changeCartNum( res.data.cart_goods_num);
                Com.toast('删除原门店购物车商品并加入购物车成功');
            }else{
                Com.toast(res.msg);
            }
        });
    }
    f_toCard(){
        Com.openWin("myShopCart",{shop_id:this.new_shop_id})
    }
    render(){
        let {all_com_goods,b_twoBtn} = this.props;
        let {a_spec,a_activeSpec,goods_alias,b_show,i_type} = this.state;
        let maskStyle = b_show ? "base-mask" :"base-mask anim";
        let cartStyle = b_show ? "goodType anim" :"goodType";
        let o_data = all_com_goods[goods_alias] || {};
        let {goods_name,goods_price,goods_marketprice,goods_storage,goods_image} = o_data;
        let e_spec = null;
        e_spec = a_spec.map((item,key)=>{
            let {name,value} = item;
            let e_value = [];
            for(let i in value){
                let s_class = classSet({"active":a_activeSpec[key]==i,"noStorage":goods_storage<=0});
                e_value.push(<li className={s_class} key={i} onClick={()=>this.f_spec(key,i)}><span>{value[i]}</span></li>);
            }
            return <div className="typeNorms" key={key}>
                <h3>{name}</h3>
                <ul className="normsList">
                    {e_value}
                </ul>
            </div>;
        });
        let s_class_cart = classSet("shopCar",{"base-hide":(!b_twoBtn || (b_twoBtn&&goods_storage<=0)) && i_type!==1,"disabled":goods_storage<=0});
        let s_class_buy = classSet({"base-hide":(!b_twoBtn || (b_twoBtn&&goods_storage<=0)) && i_type!==2,"disabled":goods_storage<=0});
        return (
            <div className="goodsSpecLayer">
                <div className={maskStyle}>
                    <div className={cartStyle}>
                        <div className="typeHead">
                            <div className="cartImg">
                                <img src={Com.getGoodsImg(goods_image,60)} onError={(ev)=>ev.target.src=commonDefaultImg}/>
                            </div>
                            <div className="cartTit">
                                <h2 className="base-ellipsis">{goods_name}</h2>
                                <div className="cartPrice">
                                    ￥<em>{goods_price}</em>{/*goods_marketprice>0?<span>专柜价:{goods_marketprice}</span>:null*/}
                                    <span className="base-fr">库存：{goods_storage||0}</span>
                                </div>
                            </div>
                            <div className="cartClose" onClick={()=>this.closeCart()}>
                                <div className="cartBtn">
                                    <img src={require('goodsBuyCloseIconImg')}/>
                                </div>
                            </div>
                        </div>
                        {e_spec}
                        <div className={`typeNum ${a_spec.length>0?"":"base-border"}`}>
                            <h3>数量</h3>
                            <NumBox ref="numbox" i_min={parseInt(goods_storage)>0?1:0} i_max={parseInt(goods_storage)} i_value={parseInt(goods_storage)>0?1:0}/>
                        </div>
                        <div className={`typeBuy ${b_twoBtn&&goods_storage>0?"twoBtn":""}`}>
                            <button className={s_class_cart} onClick={()=>this.f_submit(1,goods_storage)}>{goods_storage>0?'加入购物车':"库存不足"}</button>
                            <button className={s_class_buy}  onClick={()=>this.f_submit(2,goods_storage)}>{goods_storage>0?"立即购买":"库存不足"}</button>
                        </div>
                    </div>
                    <ActionSheet ref="actionSheet" a_list={[{s_title:'删除原门店商品',f_onClick:()=>this.f_deleteCard()},{s_title:'进入购物车',f_onClick:this.f_toCard}]}/>
                </div>
            </div>
        )
    }
}

module.exports = GoodsSpecLayer;

