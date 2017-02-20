'use strict';
import Com from './common';
import Component from './order_select.component';
import BaseManager from './baseManager';
import {GoodData} from './order_select.data';
//actionType
const {ACTION_201,ACTION_202,ACTION_203,ACTION_205} = Com;

//技师列表
let a_tech = [];

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'order_select');
		//初始状态
		this.initialState = {
			activeIndex:0,
			a_data:[],
			a_categoryName :[],
			n_totalNum: 0,
			n_totalPrice: 0
		};
		//动作
		this.actions = {
			init( params ){
				return (dispatch, getState) => {
					Com.getNormal({act:'product',op:'get_product_list'},(res)=>{
						let {code,data} = res;
						if(parseInt(code)===0){
							let {list=[],tech} = data;
							a_tech = tech;
							let a_data = {};
							let a_categoryName = {};
							let activeIndex = 0;
							for(let id in list){
								if(list.hasOwnProperty(id)){
									let gcData = list[id];
									a_categoryName[id] = gcData.stc_name;
									a_data[id] = a_data[id] || [];
									activeIndex = activeIndex || id;
									let goods = gcData.goods;
									for(let n = 0,len=goods.length;n<len;n++){
										a_data[id].push(new GoodData(goods[n]));
									}
								}
							}
							// for(let i=0,len=list.length;i< len;i++){
							// 	let item = list[i];
							// 	let gc_name = item.gc_name;
							// 	if(a_categoryName.indexOf(gc_name) < 0){
							// 		a_categoryName.push(gc_name);
							// 	}
							// 	let categoryIndex = a_categoryName.indexOf(gc_name);
							// 	a_data[categoryIndex] = a_data[categoryIndex] || [];
							// 	let goodData = new GoodData(item);
							// 	a_data[categoryIndex].push(goodData);
							// }
							dispatch({ type : ACTION_201 ,"params" : {a_data,a_categoryName,activeIndex}});
						}else {
							Com.toast(res.msg);
						}
					});
				};
			},
			//修改数量
			changeNum(oldValue,newValue,index){
				return (dispatch, getState) => {
					dispatch({ type : ACTION_203 ,"data" : {oldValue,newValue,index}});
				};
			},
			//选择类别
			selectCategory(index,scrollView){
				return (dispatch, getState) => {
					dispatch({ type : ACTION_202 ,"params" : index,"scrollView":scrollView});
				};
			},
			//点击item
			itemPress(goods_list,specInfo,goods_flag,goods_name){
				return (dispatch, getState) => {
					Com.openWin('order_normsSelect',{goods_name,goods_list,a_tech,...specInfo,goods_flag});
				};
			},
			//结算
			submit(props){
				return (dispatch, getState) => {
					let {a_data,n_totalNum,n_totalPrice} = props;
					let a_checkedData = [];
					for(let id in a_data){
						if(a_data.hasOwnProperty(id)){
							let goods = a_data[id];
							for(let j=0,jLen=goods.length;j<jLen;j++){
								let a = {...goods[j]};
								a.curSpecIndex = goods[j].curSpecIndex;
								if(a.num>0){
									a.checked = true;
									a_checkedData.push(a);
								}
							}
						}
					}
					Com.openWin("order_confirmSubmit",{a_checkedData,n_totalNum,n_totalPrice});
				};
			}
		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_201:
					return {...state,...this.initialState,...action.params};
				case ACTION_202:{
					let {params,scrollView} = action;
						scrollView.scrollTo({x: 0, y: 0, animated: true});
					return { ...state , activeIndex : action.params };
				}
				case ACTION_203:{
					let {oldValue,newValue,index} = action.data;
					let {n_totalNum,n_totalPrice,activeIndex} = state;
					let {price} = state.a_data[activeIndex][index];
					let changeNum = newValue-oldValue;
					state.a_data[activeIndex][index].num = newValue;
					return { ...state,n_totalNum : n_totalNum+changeNum, n_totalPrice:n_totalPrice+changeNum*price};
				}
				case ACTION_205:{
					let {curSpecIndex,curTechIndex,remark} = action.specInfo;
					let {goods_flag} = action;
					let {a_data,activeIndex,n_totalPrice} = state;
					let curData = a_data[activeIndex].find((data)=>{
						return data.goods_flag === goods_flag;
					});
					let oldPrice = curData.price;
					let num = curData.num;
					curData.curSpecIndex = curSpecIndex;
					curData.curTechIndex = curTechIndex;
					curData.remark = remark;
					return {...state,a_data:{...a_data},n_totalPrice:n_totalPrice+(curData.price - oldPrice)*num};
				}
				default:
					return state;
			}
		};
	}
}
