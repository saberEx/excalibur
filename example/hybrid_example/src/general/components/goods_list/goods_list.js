/*
* @Author: 代汉桥
* @Date:   2016-09-08 14:38:27
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-19 17:25:09
*/

'use strict';
require('goods_listCss');
let BuyIcon1 = require('good_buy_1Img');
let BuyIcon2 = require('good_buy_1Img');
let BuyIcon3 = require('good_buy_3Img');
let BuyIcon4 = require('good_buy_4Img');
let a_buyIcon = {1:BuyIcon1,2:BuyIcon2,3:BuyIcon3,4:BuyIcon4};
let classSet = require('classnames');
let h_img = Com.getPxReality((Com.getScreenWidth() - 12)/2);
let arrToTwoDimension = function(arr,twoLen){
	let num = Math.ceil(arr.length/twoLen);
	let newList = [];
	let startIndex = 0;
	for (let i = 0; i < num; i++){
		newList[i]=arr.slice(startIndex,startIndex+twoLen);
		startIndex += twoLen;
	}
	return newList;
};

//大图卡片
class BigCard extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	f_buy(ev){
		ev.stopPropagation();
		//购买或者加入购物车
		if(this.props.f_buy){
			this.props.f_buy(this.props.data.goods_alias);
		}
	}
	render() {
		let {goods_name,goods_price,goods_image,scale} = this.props.data;
		let {show_buy_Btn,buy_style,show_goods_name,show_goods_price,goods_style} = this.props;
		let s_buy = classSet("goods-buy",`btn${buy_style}`,{"base-hide":show_buy_Btn == 0});
		let s_title = classSet("goods-title base-ellipsis",{"base-hide":show_goods_name == 0 && goods_style != 3});
		let e_buyEl = a_buyIcon[buy_style]?<img src={a_buyIcon[buy_style]}/>:null;
		return (
			<li className="big-item" onClick={this.f_goodsDetails.bind(this)}>
                <div className="con border">
                    <div className="photo">
                        <img src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
                    </div>
                    <div className="info">
                        <p className={s_title}>{goods_name}</p>
                        <p className="goods-price"><em>{show_goods_price == 0?" ":`￥${goods_price}`}</em></p>
                    </div>
                    <div className={s_buy} onClick={this.f_buy.bind(this)}>
                    	{e_buyEl}
                    </div>
                </div>
            </li>
		);
	}
}
//大图极简
class BigNormal extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	render() {
		let {goods_name,goods_price,goods_image,scale} = this.props.data;
		let {show_goods_name,show_goods_price,goods_style} = this.props;
		let s_title = classSet("goods-title base-ellipsis",{"base-hide":show_goods_name == 0 && goods_style != 3});
		return (
			<li className="big-item" onClick={this.f_goodsDetails.bind(this)}>
				<div className="con">
				    <div className="photo">
				        <img src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
				    </div>
				    <div className="info-normal">
				        <p className={s_title}>{goods_name}</p>
				        <p className="goods-price base-fr"><em>{show_goods_price == 0?" ":`￥${goods_price}`}</em></p>
				    </div>
				</div>
			</li>
		);
	}
}
//小图卡片
class SmallCard extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	f_buy(ev){
		ev.stopPropagation();
		//购买或者加入购物车
		if(this.props.f_buy){
			this.props.f_buy(this.props.data.goods_alias);
		}
	}
	render() {
		let {goods_name,goods_price,goods_image,scale} = this.props.data;
		let {show_buy_Btn,buy_style,show_goods_name,show_goods_price,goods_style} = this.props;
		let s_buy = classSet("goods-buy",`btn${buy_style}`,{"base-hide":show_buy_Btn == 0});
		let s_title = classSet("goods-title base-ellipsis",{"base-hide":show_goods_name == 0 && goods_style != 3});
		let e_buyEl = a_buyIcon[buy_style]?<img src={a_buyIcon[buy_style]}/>:null;
		let s_priceCls = show_goods_price == 0 ? 'goods-price base-hide' :'goods-price';
		// style={{height:h_img}}
		return (
			<li className="small-item" onClick={this.f_goodsDetails.bind(this)}>
				<div className="con border">
				    <div className="photo">
				        <img src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
				    </div>
				    <div className="info">
				        <p className={s_title}>{goods_name}</p>
				        <p className={s_priceCls}><em>￥{goods_price}</em></p>
				    </div>
				    <div className={s_buy} onClick={this.f_buy.bind(this)}>
				    	{e_buyEl}
				    </div>
				</div>
			</li>
		);
	}
}
//小图极简
class SmallNormal extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	render() {
		let {goods_price,goods_image,scale} = this.props.data;
		let {show_goods_price} = this.props;
		let s_priceCls = show_goods_price == 0 ? 'goods-price base-hide' :'goods-price';
		//style={{height:h_img}} 图片高度
		return (
			<li className="small-item" onClick={this.f_goodsDetails.bind(this)}>
				<div className="con border">
				    <div className="photo">
				        <img  src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
				    </div>
				    <div className="info-normal">
				        <p className={s_priceCls}><em>￥{goods_price}</em></p>
				    </div>
				</div>
			</li>
		);
	}
}
//小图促销
class SmallPromotion extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	f_buy(ev){
		ev.stopPropagation();
		//购买或者加入购物车
		if(this.props.f_buy){
			this.props.f_buy(this.props.data.goods_alias);
		}
	}
	render() {
		let {goods_price,goods_marketprice,goods_image,scale} = this.props.data;
		let {show_goods_price} = this.props;
		//style={{height:h_img}}
		return (
			<li className="small-item" onClick={this.f_goodsDetails.bind(this)}>
				<div className="con border">
				    <div className="photo">
				        <img src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
				    </div>
				    <div className="info-promotion">
				        <p className="goods-price"><em>{show_goods_price == 0?" ":`￥${goods_price}`}</em></p>
				        <p className="goods-old-price"><em>￥{goods_marketprice}</em></p>
				    </div>
				    <div className={"goods-buy-label"} onClick={this.f_buy.bind(this)}>
				    	我要<br/>抢购
				    </div>
				</div>
			</li>
		);
	}
}
//详细卡片
class DetailCard extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	f_buy(ev){
		ev.stopPropagation();
		//购买或者加入购物车
		if(this.props.f_buy){
			this.props.f_buy(this.props.data.goods_alias);
		}
	}
	render() {
		let {goods_name,goods_price,goods_image,scale} = this.props.data;
		let {show_buy_Btn,buy_style,show_goods_name,show_goods_price,goods_style} = this.props;
		let s_buy = classSet("goods-buy",`btn${buy_style}`,{"base-hide":show_buy_Btn == 0});
		let s_title = classSet("goods-title base-ellipsis",{"base-hide":show_goods_name == 0 && goods_style != 3});
		return (
			<li className='detail-item' onClick={this.f_goodsDetails.bind(this)}>
				<div className="con border">
					<div className="photo">
						<img src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
					</div>
					<div className="info">
						<p className={s_title}>{goods_name}</p>
						<p className="goods-price"><em>{show_goods_price == 0?" ":`￥${goods_price}`}</em></p>
					</div>
					<div className={s_buy} onClick={this.f_buy.bind(this)}>
						<img src={a_buyIcon[`${buy_style}`]}/>
					</div>
				</div>
			</li>
		);
	}
}
//详细极简
class DetailNormal extends React.Component {
	f_goodsDetails(){
		let {goods_alias,shop_id} = this.props.data;
		let {isFavorites} = this.props;
		if (isFavorites === 1) {
			Com.openWin("goodDetails",{goods_alias:goods_alias,shop_id:shop_id});
		}else{
			Com.openWin("goodDetails",{goods_alias:goods_alias});
		}
	}
	f_buy(ev){
		ev.stopPropagation();
		//购买或者加入购物车
		if(this.props.f_buy){
			this.props.f_buy(this.props.data.goods_alias);
		}
	}
	render() {
		let {goods_name,goods_price,goods_image,scale} = this.props.data;
		let {show_buy_Btn,buy_style,show_goods_name,show_goods_price,goods_style} = this.props;
		let s_buy = classSet("goods-buy",`btn${buy_style}`,{"base-hide":show_buy_Btn == 0});
		let s_title = classSet("goods-title base-ellipsis",{"base-hide":show_goods_name == 0 && goods_style != 3});
		return (
			<li className='detail-item' onClick={this.f_goodsDetails.bind(this)}>
				<div className="con">
					<div className="photo">
						<img src={Com.getGoodsImg(goods_image)} onError={(e)=>Com.setErrorImg(e.target)}/>
						{scale>0?<div className="jfb-flag">
							<p className="jfb-tit">返养老金</p>
							<p className="jfb-salc">￥{parseFloat(scale)}</p>
						</div>:null}
					</div>
					<div className="info">
						<p className={s_title}>{goods_name}</p>
						<p className="goods-price"><em>{show_goods_price == 0?" ":`￥${goods_price}`}</em></p>
					</div>
					<div className={s_buy} onClick={this.f_buy.bind(this)}>
						<img src={a_buyIcon[`${buy_style}`]}/>
					</div>
				</div>
			</li>
		);
	}
}

class GoodsList extends React.Component {
	render() {
		let {isFavorites,goods_style,block_style,goods_list,show_buy_Btn,buy_style,show_goods_des,show_goods_name,show_goods_price,f_buy} = this.props.data;
		let o_props = {isFavorites,show_buy_Btn,buy_style,show_goods_des,show_goods_name,show_goods_price,goods_style};
		block_style = parseInt(block_style);
		let LiComponent = null;
		let e_ul = null;
		switch (parseInt(goods_style)){
			case 0:
				LiComponent = block_style ===0 ? BigCard : BigNormal;
				break;
			case 1:
				switch (block_style){
					case 0:
						LiComponent = SmallCard;
						break
					case 2:
						LiComponent = SmallNormal;
						break
					case 3:
						LiComponent = SmallPromotion;
						break
				}
				break;
			case 2:
				let a_newLists = arrToTwoDimension(goods_list,3);
				if(block_style === 0){
					e_ul = a_newLists.map((item,key)=>{
						return <ul key={`ulKey_${key}`} className="sc-goods-list pic">
							{
								item.map((item1,key1)=>{
									if(key1%3===0){
										return 	<BigCard f_buy={f_buy} key={`${key}_${key1}`} data={item1} {...o_props}/>;
									}else {
										return 	<SmallCard f_buy={f_buy} key={`${key}_${key1}`} data={item1} {...o_props}/>;
									}
								})
								}
						</ul>
					});
				}else{
					e_ul = a_newLists.map((item,key)=>{
							return <ul className="sc-goods-list pic">
								{item.map((item1,key1)=>{
								if(key%3===0){
									return 	<BigNormal f_buy={f_buy} key={`${key}_${key1}`} data={item1} {...o_props}/>;
								}else {
									return 	<SmallNormal f_buy={f_buy} key={`${key}_${key1}`} data={item1} {...o_props}/>;
								}
							})}
							</ul>
							});
				}

				break;
			case 3:
				LiComponent = block_style ===0 ? DetailCard : DetailNormal;
				break;
		}
		if(!e_ul){
			e_ul = <ul className="sc-goods-list">
						{goods_list.map((item,key)=>{
							return <LiComponent f_buy={f_buy} key={key} data={item} {...o_props}/>
						})}
					</ul>;
		}
		return (
			<div className="goods_list com-diyControl">
				{e_ul}
			</div>
		);
	}
}
module.exports = GoodsList;

