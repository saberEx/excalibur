/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-21 14:08:37
* 拼团商品信息
*/

'use strict';
require('myGroupGoodsCss');
let CommonDefault = require('commonDefaultImg');
let CountTime = require('countTime');
class MyGroupGoodsItem extends React.Component{
    componentDidMount(){
        let _self = this;
        CountTime.countdown(_self.props.s_validity,_self.props.s_openSn,"","",function(e){
            clearInterval(e);
        },true);
    }
    static propTypes = {
        b_isList:React.PropTypes.bool,//是否是活动列表 true为活动列表，false为我的拼团
        i_state:React.PropTypes.number,//拼团状态
        s_openSn:React.PropTypes.string,//拼团单号
        spell_id:React.PropTypes.string,//拼团id
        spell_goods_alias:React.PropTypes.string,//拼团商品别名
        s_goodsImg:React.PropTypes.string,//商品图片
        s_goodsName:React.PropTypes.string,//商品名称
        s_groupBuyNum:React.PropTypes.string,//团购所需人数
        s_groupBuyPrice:React.PropTypes.string,//团购价格
        s_buyPrice:React.PropTypes.string,//原价
        i_total:React.PropTypes.number,//团购还差人数
        s_validity:React.PropTypes.string,//团购剩余时间
        f_detailCallBack:React.PropTypes.func,//拼团详情点击回调
        f_goodsCallBack:React.PropTypes.func,//拼团商品详情回调
    }
    f_itemClick(b_isList){
        if (b_isList) {
            this.props.f_goodsCallBack && this.props.f_goodsCallBack(this.props.spell_id,this.props.spell_goods_alias);
        }else{
            this.props.f_detailCallBack && this.props.f_detailCallBack(this.props.s_openSn);
        }
    }
    render(){
        let {b_isList,i_state,s_openSn,s_total,s_validity,s_goodsImg,s_goodsName,s_groupBuyNum,s_groupBuyPrice,s_buyPrice} = this.props;
        let state = "去开团";
        let bottom = "";
        let ongoing = "";
        let top = null;
        if (i_state == 0) {
            state = "进行中";
            ongoing = "goBuy";
            bottom = <div className="groupBottom">
                        <span className="groupTime">还剩：<span id={s_openSn}></span></span>
                        <span className="base-fr">还要<em>{s_total}</em>人 <em onClick={()=>this.f_itemClick(false)}>立即邀请&#62;</em></span>
                     </div>;
        }else if(i_state == 1){
            state = "已完成";
            ongoing = "goBuy ongoing";
        }else if(i_state == 2){
            state = "已关闭";
            ongoing = "goBuy ongoing";
        }
        if (!b_isList) {
            top = <div className="groupNum">拼团单号：<em>{s_openSn}</em></div>;
        }
        return(
            <section className="groupWarp">
                {top}
                <li className='item' onClick={()=>this.f_itemClick(b_isList)}>
                    <div className="img_box">
                        <img src={Com.getGoodsImg(s_goodsImg) || CommonDefault} onError={(ev)=>ev.target.src=CommonDefault}/>
                    </div>
                    <div className="fight_info">
                        <p className="title base-ellipsis">{s_goodsName}</p>
                        <p>
                            <span className="p_number">{s_groupBuyNum}人团</span>
                        </p>
                        <p className="price">
                            <span><em>￥</em>{s_groupBuyPrice}</span>
                        </p>
                        <p className={ongoing}>
                            <span className="base-fl">
                                单买价：￥{s_buyPrice}
                            </span>
                            <span className="base-fr">
                                {state}
                            </span>
                        </p>
                    </div>
                </li>
                {bottom}
            </section>
        );

    }
}
class MyGroupGoods extends React.Component{
    static propTypes = {
        a_array:React.PropTypes.array,//数据
        f_detailCallBack:React.PropTypes.func,//拼团详情回调
        f_goodsCallBack:React.PropTypes.func,//拼团商品详情
        b_isList:React.PropTypes.bool,//是否是活动列表 true为活动列表，false为我的拼团
    }
    f_detailCallBack(s_openSn){
        this.props.f_detailCallBack && this.props.f_detailCallBack(s_openSn);
    }
    f_goodsCallBack(spell_id,spell_goods_alias){
        this.props.f_goodsCallBack && this.props.f_goodsCallBack(spell_id,spell_goods_alias);
    }
    render(){
        let {a_array,b_isList} = this.props;
        let e_items = a_array.map((item,index)=>{
            return <MyGroupGoodsItem key={index} b_isList={b_isList} spell_id={item.spell_id} spell_goods_alias={item.spell_goods_alias} i_state={parseInt(item.open_state)} s_openSn={item.open_sn} s_goodsImg={item.goods_image} s_goodsName={item.spell_goods_name} s_groupBuyNum={item.spell_number} s_groupBuyPrice={item.spell_price} s_buyPrice={item.spell_goods_price} s_total={item.c_total} s_validity={item.validity} f_detailCallBack={(s_openSn)=>this.f_detailCallBack(s_openSn)} f_goodsCallBack={(spell_id,spell_goods_alias)=>this.f_goodsCallBack(spell_id,spell_goods_alias)}></MyGroupGoodsItem>
        });
        return(
            <div>
                {e_items}
            </div>

        );
    }

}
module.exports = MyGroupGoods;
