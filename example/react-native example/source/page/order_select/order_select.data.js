/*
* @Author: 代汉桥
* @Date:   2016-06-04 13:49:51
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-07-01 14:24:20
* 下单页面数据类
*/

'use strict';
import Com from './common';

export class GoodData{
	constructor(props){
		//规格信息
		this._curSpecIndex = 0;//当前规格索引
		this.curTechIndex = -1;//当前技师索引
		this.remark = '';//留言
		this.goods_list = props.goods_list || [];//规格列表
		this.title = props.goods_name;//商品名称
		this.price = parseFloat(props.goods_price);//商品默认价格
		this.imgurl = Com.getGoodsImagePath(props.goods_image);//商品图片
		this.num = 0;//商品数量
		this.goods_flag = (this.goods_list && this.goods_list[0])?this.goods_list[0].goods_id:0;//产品标识
	}
	get curSpecIndex(){
		return this._curSpecIndex;
	}
	set curSpecIndex(value){
		this._curSpecIndex = value;
		if(this.goods_list[this._curSpecIndex]){
			this.price = parseFloat(this.goods_list[this._curSpecIndex].goods_price);
		}
	}
}
