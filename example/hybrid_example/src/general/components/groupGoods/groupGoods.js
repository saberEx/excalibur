/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-09 15:14:08
* 拼团商品信息、优惠信息和详情
*/

'use strict';
require('groupGoodsCss');
let CommonDefault = require('commonDefaultImg');
class GroupGoods extends React.Component{
    static propTypes = {
        tips:React.PropTypes.string,//提示信息
        goodsImg:React.PropTypes.string,//商品图片
        goodsName:React.PropTypes.string,//商品名称
        groupBuyNum:React.PropTypes.string,//团购所需人数
        groupBuyPrice:React.PropTypes.string,//团购价格
        buyPrice:React.PropTypes.string,//原价
        open_sn:React.PropTypes.string,//团号
        goods_alias:React.PropTypes.string,//商品别名
    }
    static defaultProps = {
        isTips:false,//是否显示提示信息
        isDetial:false,//是否显示查看详情
    }
    f_goodsDetail(spell_id,open_sn,goods_alias){
         Com.openWin('group_goodDetails',{spell_id:spell_id,goods_alias:goods_alias});//,open_sn:open_sn
    }
    render(){
        let {isTips,isDetial,tips,goodsImg,goodsName,groupBuyNum,groupBuyPrice,buyPrice,spell_id,open_sn,goods_alias} = this.props;
        let show_tips = isTips ? <div className='groupTips'>{tips}</div> :"";
        let show_detial = isDetial ? <span className="base-fr btn_detial" >&#62;</span> :"";
        return(
            <div className="groupInfo" onClick={this.f_goodsDetail.bind(this,spell_id,open_sn,goods_alias)}>
                <img src={Com.getGoodsImg(goodsImg) || CommonDefault} onError={(ev)=>ev.target.src=CommonDefault}/>
                <div className="goodsInfo">
                    <div className="goodsTit base-ellipsis2">{goodsName}</div>
                    <div className="groupType">
                        <span className="newGroup">{groupBuyNum}人团 ￥<em>{groupBuyPrice}</em></span>
                        <span className="oldGroup">单卖价 ￥{buyPrice}</span>
                        {show_detial}
                    </div>
                    {show_tips}
                </div>
            </div>
        );

    }
}
module.exports = GroupGoods;
