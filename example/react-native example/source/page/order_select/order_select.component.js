'use strict';
import React,{ Component } from 'react';
import { View,Text,ScrollView ,Image , TouchableOpacity,Animated} from 'react-native';
import Com from './common';
import {TopBar,NumBox,Button,NetImage} from './components';
//小箭头
const s_rightArrow = require("./rightSmallArrow.png");
//样式
import o_styles from './order_select.style';
const {listItem,itemImage,itemCon,itemConTop,itemConTopText,arrow,itemConBottom,priceText,categoryCon,categoryTextActive,categoryText,category,categoryLists,submitCon,submitText,textColorNum,submitBtnLabel,submitBtn} = o_styles;
const {baseCenter,baseContent,baseFlex,baseRow,px2dp,baseBgColorW} = Com;
//item组件
class Item extends Com.Component {
	constructor(props){
		super(props);
		let {changeNum,itemPress} = props;
		//修改数量
		this._changeNum = (oldValue,newValue)=>{
			let {index} = this.props;
			changeNum(oldValue,newValue,index);
		};
		//点击item
		this._onPress = ()=>{
			let {curTechIndex,remark,curSpecIndex,goods_list,goods_flag,title} = this.props;
			itemPress(goods_list,{curTechIndex,remark,curSpecIndex},goods_flag,title);
		};
	}
	render(){
		let {title,imgurl,price,num} = this.props;
		return 	(
			<TouchableOpacity onPress={this._onPress}>
				<View style={listItem}>
					<View style={baseCenter}>
						<NetImage style={itemImage} source={{uri:imgurl}}></NetImage>
					</View>
					<View style={itemCon}>
						<View style={itemConTop}>
							<Text style={itemConTopText}>
								{title}
							</Text>
							<Image style={arrow} source={s_rightArrow}></Image>
						</View>
						<View style={itemConBottom}>
							<Text style={priceText}>{price}元/份</Text>
							<NumBox i_value={num} onChange={this._changeNum} width={px2dp(200)} height={px2dp(60)}/>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}
//页面组件
class Order_select extends Component {
	constructor(props) {
		super(props);
		this._transformValue = new Animated.Value(1);
		this._translateY = this._transformValue.interpolate({inputRange: [0, 1],outputRange: [0,px2dp(96)]});
		this._marginBottomY = this._transformValue.interpolate({inputRange: [0, 1],outputRange: [px2dp(96),0]});
	}
	startAnimation(value,toValue) {
		this._transformValue.setValue(value);
		this._animated = Animated.timing(this._transformValue, {
			toValue: toValue,
			duration: 500,
		});
		this._animated.start();
	}
	componentDidUpdate(prevProps){
		if(prevProps.n_totalNum !== this.props.n_totalNum){
			if(this.props.n_totalNum === 0){
				this.startAnimation(0,1);
			}else if(prevProps.n_totalNum === 0){
				this.startAnimation(1,0);
			}
		}
	}
	componentDidMount(){
		this.props.init();
	}
  	render() {
		let listEl = null;
		let {activeIndex,a_data,a_categoryName,n_totalNum,n_totalPrice,itemPress,changeNum,selectCategory} = this.props;
		let categoryEl = [];
		for(let key in a_categoryName){
			if(a_categoryName.hasOwnProperty(key)){
				let item = a_categoryName[key];
				let a_style = activeIndex === key?[categoryCon,categoryTextActive] : categoryCon;
				categoryEl.push(
					<TouchableOpacity key={key} style={a_style} onPress={()=>selectCategory(key,this.refs.scrollView)} >
						<Text style={[categoryText]}>{item}</Text>
					</TouchableOpacity>
				);
			}
		}
		// categoryEl = a_categoryName.map((item,key)=>{
		// 	let a_style = activeIndex === key?[categoryCon,categoryTextActive] : categoryCon;
		// 	return <TouchableOpacity key={key} style={a_style} onPress={()=>selectCategory(key,this.refs.scrollView)} >
		// 				<Text style={[categoryText]}>{item}</Text>
		// 			</TouchableOpacity>;
		// });
		if(a_data[activeIndex]){
			listEl = a_data[activeIndex].map((item,key)=>{
				return <Item key={key} {...item} curSpecIndex={item.curSpecIndex} index={key} itemPress={itemPress} changeNum={changeNum}/>;
			});
		}
	    return (
          	<View style={baseFlex}>
          		<TopBar s_title="选择产品"/>
	         	<View style={[baseContent,baseFlex,baseBgColorW]}>
					<Animated.View style={[baseFlex,baseRow,{marginBottom:this._marginBottomY}]} >
						<ScrollView style={category}>
							{categoryEl}
						</ScrollView>
						<ScrollView ref="scrollView" style={categoryLists}>
							{listEl}
						</ScrollView>
					</Animated.View>
					<Animated.View style={[submitCon,{transform:[{translateY:this._translateY}]}]}>
						<Text style={submitText}>
							共<Text>{n_totalNum}</Text>件产品，总计：<Text style={textColorNum}>{Com.getNumFormat(n_totalPrice,2)}元</Text>
						</Text>
						<Button onPress={()=>this.props.submit(this.props)} text="结 算" textStyle={submitBtnLabel} style={submitBtn}/>
					</Animated.View>
	        	</View>
        	</View>
	    );
  	}
}
export default Order_select;
