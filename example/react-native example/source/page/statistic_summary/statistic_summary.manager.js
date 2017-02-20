'use strict';
import Com from './common';
import Component from './statistic_summary.component';
import BaseManager from './baseManager';
import BoxPay from './boxPay';
const {ACTION_602} = Com;

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"statistic_summary");
        let _manager = this;
        _manager.keys = [];
        //动作
        this.actions = {
            print(self){
                return (dispatch, getState) => {
                    let data = _manager.getCurState('data');
                    data.type = 2;
                    data.title = "结班";
                    let _startLabel = Com.getTimeFormat(self._startTime,2).replace(/\:\d{2}$/,"");
                    let _endLabel = Com.getTimeFormat(self._endTime,2).replace(/\:\d{2}$/,"");
                    data.subTitle = `${_startLabel}--${_endLabel}`;
                    data.keys = _manager.keys;
                    BoxPay.print(data);
                };
            },
            requestList(startTime,endTime){
                return (dispatch, getState) => {
                    Com.getVerify({act:'sell',op:'get_settlement',startTime,endTime},(res)=>{
                        if(res.code === 0){
                            self._startTime = startTime;
                            self._endTime = endTime;
                            let {goods_list,recharge_list,order_amount,up_order_amount,up_order_count,down_order_amount,down_order_count,discount_amount,discount_amount_count,discount_order_amount,payment_list,list,count_un_order,un_order_amount,expenses_record} = res.data;
                            let totalCount = up_order_count + down_order_count;
                            let data = {};
                            _manager.keys = [];
                            if(parseInt(totalCount) > 0){
                                data.orderInfo = {
                                    title:"订单情况",
                                    list:[
                                        {subName:'已结订单',nums:`${totalCount}笔`,totalMoney:Com.getNumFormat(order_amount),datas:[{name:'线下订单',num:`${up_order_count}笔`,money:Com.getNumFormat(up_order_amount)},{name:'线上订单',num:`${down_order_count}笔`,money:Com.getNumFormat(down_order_amount)},]},
                                        {subName:'订单平均单价',totalMoney:Com.getNumFormat(order_amount/totalCount) || "0.00"},
                                    ],
                                };
                                _manager.keys.push('orderInfo');
                            }
                            let incomeNums = 0;
                            let payments = [];
                            payment_list.map((item,index)=>{
                                if(parseInt(item.up_pay_count) > 0){
                                    incomeNums += parseInt(item.up_pay_count);
                                    payments.push({
                                        name:item.payment_name,
                                        money:Com.getNumFormat(item.up_pay || 0),
                                        num:`${item.up_pay_count}笔` || "0笔",
                                    });
                                }
                            });
                            if(incomeNums > 0){
                                data.incomeInfo = {
                                    title:'收入情况',
                                    list:[
                                        {subName:'线下结算',nums:`${incomeNums}笔`,totalMoney:Com.getNumFormat(order_amount),datas:payments},
                                    ],
                                };
                                _manager.keys.push('incomeInfo');
                            }
                            let favorableList = [];
                            discount_order_amount = parseFloat(discount_order_amount) || 0;
                            discount_amount_count = parseInt(discount_amount_count) || 0;
                            if(discount_order_amount > 0){
                                favorableList.push({subName:'订单金额合计',totalMoney:Com.getNumFormat(discount_order_amount)},);
                            }
                            if(discount_amount_count > 0){
                                favorableList.push({subName:'优惠合计',nums:`${discount_amount_count}笔`,totalMoney:Com.getNumFormat(discount_amount)});
                            }
                            if(favorableList.length > 0){
                                data.favorableInfo = {
                                    title:'优惠情况',
                                    list:favorableList
                                };
                                _manager.keys.push('favorableInfo');
                            }
                            let goodsClass = {};
                            list.map((item,index)=>{
                                goodsClass[item.gc_id] = goodsClass[item.gc_id] || [];
                                goodsClass[item.gc_id].push(item);
                            });
                            let goods = [];
                            for(let goodsKey in goodsClass){
                                if(goodsClass.hasOwnProperty(goodsKey)){
                                    let goodDatasList = goodsClass[goodsKey];
                                    if(goodDatasList.length > 0){
                                        let goodsNums = 0;
                                        let goodDatas = goodDatasList.map((item,index)=>{
                                            goodsNums += parseInt(item.ordergoodsnum);
                                            return {
                                                name:item.goods_name,
                                                money:Com.getNumFormat(item.ordergamount || 0),
                                                num:`${item.ordergoodsnum}笔` || "0笔",
                                            };
                                        });
                                        goods.push({subName:goodDatasList[0].gc_name,nums:`${goodsNums}个`,datas:goodDatas});
                                    }
                                }
                            }
                            if(goods.length > 0){
                                data.goodsSell = {
                                    title:'商品销售',
                                    list:goods,
                                };
                                _manager.keys.push('goodsSell');
                            }
                            let {recharge_num,recharge_amount,give_amount,sell_cards} = expenses_record;
                            let memberRechargeList = [];
                            sell_cards = parseInt(sell_cards) || 0;
                            if(sell_cards > 0){
                                memberRechargeList.push({subName:'售卡情况',totalMoney:`${sell_cards}张` || "0张"});
                            }
                            recharge_num = parseInt(recharge_num);
                            recharge_num > 0 && memberRechargeList.push({subName:'充值合计',nums:`${recharge_num}笔`,totalMoney:Com.getNumFormat(recharge_amount)},{subName:'赠送金额',nums:`${recharge_num}笔`,totalMoney:Com.getNumFormat(give_amount)});
                            let realityLits = [];
                            recharge_list.map((item,index)=>{
                                if(parseInt(item.recharge_count) > 0){
                                    realityLits.push({
                                        name:item.payment_name,
                                        money:Com.getNumFormat(item.recharge_amount || 0),
                                        num:`${item.recharge_count}笔` || "0笔",
                                    });
                                }
                            });
                            if(recharge_num > 0){
                                memberRechargeList.push({subName:'实收情况',nums:`${recharge_num}笔`,totalMoney:Com.getNumFormat(recharge_amount),datas:realityLits});
                            }
                            if(memberRechargeList.length > 0){
                                data.memberRecharge = {
                                    title:'会员充值情况',
                                    list:memberRechargeList
                                };
                                _manager.keys.push('memberRecharge');
                            }
                            if(parseInt(count_un_order) > 0){
                                data.cancelOrderInfo = {
                                    title:'取消订单情况',
                                    list:[
                                        {subName:'取消订单情况',nums:`${count_un_order}笔`,totalMoney:Com.getNumFormat(un_order_amount)}
                                    ]
                                };
                                _manager.keys.push('cancelOrderInfo');
                            }
                            let cancelGoodsDic = {};
                            goods_list.map((item,index)=>{
                                cancelGoodsDic[item.gc_id] = cancelGoodsDic[item.gc_id] || [];
                                cancelGoodsDic[item.gc_id].push(item);
                            });
                            let cancelgoods = [];
                            for(let cancelKey in cancelGoodsDic){
                                if(cancelGoodsDic.hasOwnProperty(cancelKey)){
                                    let goodDatasList = cancelGoodsDic[cancelKey];
                                    if(goodDatasList.length > 0){
                                        let goodsNums = 0;
                                        let goodDatas = goodDatasList.map((item,index)=>{
                                            goodsNums += parseInt(item.goods_num);
                                            return {
                                                name:item.goods_name,
                                                money:Com.getNumFormat(item.goods_pay_price || 0),
                                                num:`${item.goods_num}笔` || "0笔",
                                            };
                                        });
                                        cancelgoods.push({subName:goodDatasList[0].gc_name,nums:`${goodsNums}个`,datas:goodDatas});
                                    }
                                }
                            }
                            if(cancelgoods.length > 0){
                                data.cancelGoodsInfo = {
                                    title:'取消商品数',
                                    list:cancelgoods
                                };
                                _manager.keys.push('cancelGoodsInfo');
                            }
                            dispatch({type:ACTION_602,data});
                        }else{
                            Com.toast(res.msg);
                        }
                    });
                };
            }
        };
        //处理
        this.reducers = (state,action)=>{
            switch( action.type ){
                case ACTION_602:{
                    return {...state,data:action.data};
                }
                default:
                   return state;
            }
        };
    }
}
