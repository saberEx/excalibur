'use strict';
import React,{ Component } from 'react';
import { View ,Text,ScrollView,TouchableNativeFeedback} from 'react-native';
import Com from './common';
import {TopBar,TitleView,Button,RadioGroup,Line} from './components';
import o_styles from './member_recharge.style';
const {baseContent,baseBgColorW,baseMT20,baseFlex,baseRow,baseCenter} = Com;
const {textStyel,balanceStyle,titleViewStyle,balanceViewStyle,textColWhite,bigBtnAvtiveBorder,btnStyle,okbtnViewStyle,okBtnSytle,btnTextOne,btnTextTwo,lineStyle,litileTextOne,litileTextTwo} = o_styles;
//充值item
class Bigbtn extends Com.Component {
    _onPress(){
        let {f_callBack,index,recharge} = this.props;
        f_callBack && f_callBack(index,recharge);
    }
    render(){
        let {recharge,handsel,b_active} = this.props;
        let activeBorder = b_active ? bigBtnAvtiveBorder : {};
        let textColW = b_active ? textColWhite :{};
        return (
               <TouchableNativeFeedback onPress={this._onPress.bind(this)}>
                   <View style={[btnStyle,activeBorder,baseCenter]}>
                      <Text style={[btnTextOne,textColW]}>{recharge}元</Text>
                      <Text style={btnTextTwo}>赠送{handsel}元券</Text>
                  </View>
              </TouchableNativeFeedback>
        );
    }
}
//充值item组[{b_active,recharge,handsel},{}]
class BigbtnGroup extends Component{
    constructor(props){
      super(props);
      this.state = {
          curIndex:0
      };
      this._onChange = (value,recharge)=>{
          this.setState({curIndex:value});
          let {f_callBack} = this.props;
          f_callBack && f_callBack(recharge);
      };
    }
    getValue(key){
        let {curIndex} = this.state;
        let {a_group} = this.props;
        if(a_group && a_group[curIndex]){
            return a_group[curIndex][key];
        }
        return 0;
    }
    render(){
      let {curIndex} = this.state;
      let {a_group} = this.props;
      let e_items = a_group.map((item,index)=>{
          return <Bigbtn key={index} {...item} b_active={curIndex===index} index={index} f_callBack={this._onChange}/>;
      });
      return (
          <View style={[baseRow,baseFlex,{flexWrap:"wrap"}]}>
              {e_items}
          </View>
      );
    }
}
class Member_recharge extends Component {
    constructor(props){
        super(props);
        this.state = {
            moneyText:0,
            moneyId:0,
        };
    }
    componentWillMount() {
        this._member_id = Com.getPageParams('member_id');
        this._member_card = Com.getPageParams('card_id');
        this._balance = Com.getPageParams('card_balance') || 0;
    }
    componentDidMount(){
        this.props.init();
    }
    _chooseRecharge(){
        let {chooseRecharge,a_pay} = this.props;
        let {value} = this._payTypeRadio;
        let item = a_pay.find((item,index)=>{
            return item.payment_id.toString() === value.toString();
        });
        let _rechargeGetValue = this._payMoney.getValue.bind(this._payMoney);
        chooseRecharge(this._member_id,value,_rechargeGetValue('rule_id'),item.payment_type,_rechargeGetValue('recharge'),_rechargeGetValue('handsel'));
    }
  	render() {
      let {a_data} = this.props;
      let temMoney = 0;
      let a_group = a_data.map((item,index)=>{
          if(index === 0){
              temMoney = item.recharge;
          }
          return{recharge:item.recharge,handsel:item.handsel,rule_id:item.rule_id};
      });
      let moneyText = this.state.moneyText || temMoney;
      let {a_pay} = this.props;
      let s_defaultId = "0";
      const lastIndex = a_pay.length - 1;
      let n_left = Com.px2dp(20);
      let a_groupb = a_pay.map((item,index)=>{
          if(index === 0){
              s_defaultId = item.payment_id;
          }else if(index === lastIndex){
              n_left = 0;
          }
          return{s_label:item.payment_name,s_id:item.payment_id,n_left:n_left,style:{height:Com.px2dp(85)}};
      });
	    return (
           <View style={baseFlex}>
               <View style={[baseContent,baseFlex]}>
                  <View style={[baseBgColorW,baseRow]}>
                    <TitleView titleStyle={titleViewStyle} s_title='卡号：'/>
                    <Text style={litileTextOne}>{this._member_card}</Text>
                  </View>
                  <View style={[baseBgColorW]}>
                    <Text style={textStyel}>会员金额</Text>
                    <Text style={balanceStyle}>{this._balance}元</Text>
                  </View>
                  <View style={[baseBgColorW,baseMT20,baseRow]}>
                    <TitleView titleStyle={titleViewStyle} s_title='请选择充值金额：'/>
                    <Text style={litileTextTwo}>{moneyText}</Text>
                  </View>
                  <View style={[baseBgColorW,baseRow]}>
                    <BigbtnGroup ref={(component)=>{this._payMoney = component;}} a_group={a_group} f_callBack={(value)=>{this.setState({moneyText:value});}}/>
                  </View>
                  <View style={[baseBgColorW,lineStyle]}>
                      <TitleView titleStyle={titleViewStyle} s_title='支付：'/>
                  </View>
                  <ScrollView>
                    <RadioGroup ref={(component)=>{this._payTypeRadio = component;}} s_curId={s_defaultId} a_group={a_groupb} />
                  </ScrollView>
                  <Line/>
               </View>
               <TopBar s_title="会员充值"/>
               <View style={[baseBgColorW,okbtnViewStyle]}>
                 <Button style={okBtnSytle} text='充值' onPress={()=>this._chooseRecharge()}/>
               </View>
           </View>
       );
   }
}
export default Member_recharge;
