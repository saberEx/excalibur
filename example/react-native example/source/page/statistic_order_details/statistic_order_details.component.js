'use strict';
import React,{ Component } from 'react';
import { View , Text ,Image} from 'react-native';
import Com from './common';
import {TopBar,NetImage,Line} from './components';
import o_styles from './statistic_order_details.style';
import {OrderItemView} from './orderItemView';
const {baseContent,baseMT20,baseRow,baseBetween,baseColCenter,baseFlex} = Com;
const {imgStyle,itemStyle,priceStyle,nameStyle,bgColor} = o_styles;

const labelFz = Com.fzStyle(20);
class GoodsItem extends Component {
    render(){
        let {goods_name,goods_num,goods_image,goods_price,goods_pay_price} = this.props;
        return (
            <View style={[baseFlex,baseRow,baseColCenter,itemStyle]}>
                <NetImage style={imgStyle} source={{uri:Com.getGoodsImagePath(goods_image)}}/>
                <View style={baseFlex}>
                    <Text style={nameStyle}>{goods_name}</Text>
                    <View style={[baseFlex,baseRow,baseBetween]}>
                        <View style={[baseRow,baseFlex]}>
                            <Text style={[labelFz,priceStyle]}>{goods_price}元/个</Text>
                            <Text style={labelFz}>   数量：{goods_num}</Text>
                        </View>
                        <Text style={[labelFz,baseFlex]}>{goods_pay_price}</Text>
                    </View>
                </View>
                <Line/>
            </View>
        );
    }
}

class Statistic_order_details extends Component {
    componentWillMount() {
        this._data = Com.getPageParams('data');
    }
  	render() {
        let {order_goods} = this._data || [];
        let goodsEl = order_goods.map((item,index)=>{
            return <GoodsItem key={index} {...item}/>;
        });
	    return (
            <View>
                <View style={[baseContent,bgColor]}>
                    <View style={[baseMT20,bgColor]}>
                        <OrderItemView {...this._data} pageType={1}/>
                        {goodsEl}
                    </View>
                </View>
                <TopBar s_title="订单详情"/>
            </View>
        );
    }
}
export default Statistic_order_details;
