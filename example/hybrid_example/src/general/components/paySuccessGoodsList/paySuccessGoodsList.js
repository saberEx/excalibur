/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2016-11-28 11:51:09
*/

'use strict';
require('paySuccessGoodsListCss');
var GoodsItem = React.createClass({
	propTypes : {
		s_name : React.PropTypes.string.isRequired,//商品名称
		s_number : React.PropTypes.string,//商品数量
		s_price : React.PropTypes.string,//商品金额
	},
	render:function(){
		var {s_name,s_number,s_price} = this.props;
		return (
			<tr className="color">
                <td className="base-tl">{s_name}</td>
                <td className="base-tc">{s_number}</td>
                <td className="base-tr">{s_price}</td>
            </tr>
		);
	}
});
var PaySuccessGoodsList = React.createClass({
	propTypes : {
		a_data : React.PropTypes.array.isRequired,
	},
	render:function(){
		var {a_data} = this.props;
		var e_items = a_data.map(function(item,key){
            return <GoodsItem key={key} s_name={item.goods_name} s_number={item.goods_num} s_price={item.goods_amount}/>;
        });
        return(
        	<tbody>
				{e_items}
			</tbody>
        );

	}
});
module.exports = PaySuccessGoodsList;
