/*
* @Author: 卢旺
* @Date:   2016-08-17 19:02:33
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-13 15:51:55
* 商品列表
*/

'use strict';
require("goodsGroupCss");
const error = require('commonDefaultImg');
class GoodsItem extends React.Component{
	constructor(props){
		super(props);
	}
	static propTypes = {
		s_path:React.PropTypes.string.isRequired,//商品图片
		s_name:React.PropTypes.string.isRequired,//商品名称
		s_price:React.PropTypes.string.isRequired,//商品原价
		i_num:React.PropTypes.string.isRequired,//商品数量
		s_order_id:React.PropTypes.string,//订单id
		f_itemCallBack:React.PropTypes.func,//点击回调
	}
	f_onClick(){
		this.props.f_itemCallBack && this.props.f_itemCallBack(this.props.s_order_id);
	}
	render(){
		let {s_path,s_name,s_price,i_num,s_time,b_noNeedPath} = this.props;
		return(
			<li className=" " onClick={()=>this.f_onClick()}>
			    <img className="goods_img" src={b_noNeedPath?s_path:Com.getGoodsImg(s_path) || error} onError={(ev)=>ev.target.src=error}/>
			    <div className="goods_info">
			        <div className="good_tit base-ellipsis2">{s_name}</div>
			        {/*<div className="good_type">
			        	商品类型、商品规格
			        	</div>
			    	*/} 
			    	{s_time?<div className='s_time'>{s_time}</div>:null}
			        <div className="good_num">
			            <span>￥{Com.getNumFormat(s_price)}</span>
			            <p className="">x{i_num}</p>
			        </div>
			    </div>
			</li>
		);
	}
}

class GoodsGroup extends React.Component{
	static propTypes = {
		a_goodsList:React.PropTypes.array.isRequired,//商品列表
		f_callBack:React.PropTypes.func,//点击回调
	}
	f_onClick(order_id){
		this.props.f_callBack && this.props.f_callBack(order_id);
	}
	render(){
		let {s_time,b_noNeedPath} = this.props;
		let e_items = this.props.a_goodsList.map((item,key)=>{
			return <GoodsItem key={key} s_time={s_time} b_noNeedPath={b_noNeedPath} f_itemCallBack={(order_id)=>this.f_onClick(order_id)} s_path={item.goods_image} s_name={item.goods_name} s_price={item.goods_price} i_num={item.goods_num.toString()} s_order_id={item.order_id}/>;
		});
		return(
			<ul className="goodsGroup">
		          {e_items}
	        </ul>
		);
	}
}
module.exports = GoodsGroup;
