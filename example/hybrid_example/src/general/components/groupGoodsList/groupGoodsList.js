/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-09 15:47:08
* 拼团商品列表
*/

'use strict';
require('groupGoodsListCss');
class GroupGoodsItem extends React.Component{
    static propTypes = {
        i_id:React.PropTypes.string,//商品id
        s_img:React.PropTypes.string,//商品图片
        s_name:React.PropTypes.string,//商品名称
        i_buyNum:React.PropTypes.string,//团购所需人数
        s_buyPrice:React.PropTypes.string,//团购价格
        s_price:React.PropTypes.string,//原价
        s_goods_alias:React.PropTypes.string,//商品别名
        f_itemCallBack:React.PropTypes.func,//点击回调
    }
    f_itemOnClick(){
        let o_data = {spell_id:this.props.i_id,goods_alias:this.props.s_goods_alias};
        this.props.f_itemCallBack(o_data);
    }
    render(){
        let {s_img,s_name,i_buyNum,s_buyPrice,s_price} = this.props;
        return(
            <li>
                <img src={Com.getGoodsImg(s_img,640)} onClick={()=>this.f_itemOnClick()} alt="" />
                <div className="g_pc_info">
                    <div className="goods_name">{s_name}</div>
                    <div className="gg_pc">
                        <span className="p_number">{i_buyNum}人团</span>
                        <span className="price"><i>￥</i><em>{s_buyPrice}</em></span>
                        <span>单买价￥{s_price}</span>
                        <span className="base-fr pay_start_tuan" onClick={()=>this.f_itemOnClick()}>去开团</span>
                    </div>
                </div>
            </li>
        );

    }
}
class GroupGoodsList extends React.Component{
    static propTypes = {
        a_data:React.PropTypes.array,//列表数据
        f_callBack:React.PropTypes.func,//点击回调
    }
    f_onClick(o_data){
        this.props.f_callBack(o_data);
    }
    render(){
        let e_items = this.props.a_data.map((item,key)=>{
            return <GroupGoodsItem key={key} i_id={item.spell_id} s_goods_alias={item.spell_goods_alias} s_img={item.goods_image} s_name={item.spell_goods_name} i_buyNum={item.spell_number} s_buyPrice={item.spell_price} s_price={item.spell_goods_price} f_itemCallBack={this.f_onClick.bind(this)}></GroupGoodsItem>
        });

        return(
             <div className="goods_list_wrap">
                    <ul className="goods_list">
                        {e_items}
                    </ul>
            </div>
        );

    }
}
module.exports = GroupGoodsList;
