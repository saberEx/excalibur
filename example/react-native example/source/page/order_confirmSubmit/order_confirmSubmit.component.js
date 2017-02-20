'use strict';
import React,{ Component } from 'react';
import { View ,ScrollView,Text,Image,Animated} from 'react-native';
import Com from './common';
import {TopBar,CheckBox,NumBox,Button,NetImage} from './components';
const s_rightArrow = require("./rightSmallArrow.png");
import o_styles from './order_confirmSubmit.style';
const {listItem,itemImage,checkBox,itemCon,itemConTop,itemConTopText,arrow,itemConBottom,
        priceText,categoryLists,submitCon,submitText,textColorNum,submitBtnLabel,submitBtn} = o_styles;
const {px2dp,baseContent,baseFlex,baseBgColorW} = Com;
class Item extends Com.Component {
    constructor(props){
        super(props);
        this._changeNum = (oldValue,newValue)=>{
            let {changeNum,index} = props;
            changeNum(oldValue,newValue,index);
        };
        this._checkChange = (checked)=>{
            let {checkChange,index} = props;
            checkChange(index,checked);
        };
    }
    render(){
        let {title,imgurl,price,num,checked} = this.props;
        return 	(
            <View style={listItem}>
                <CheckBox checked={checked} f_change={this._checkChange} style={checkBox} />
                <NetImage style={itemImage} source={{uri:imgurl}}></NetImage>
                <View style={itemCon}>
                    <View style={itemConTop}>
                        <Text style={itemConTopText}>
                            {title}
                        </Text>

                    </View>
                    <View style={itemConBottom}>
                        <Text style={priceText}>{price}元/份</Text>
                        <NumBox i_min={1} i_value={num} onChange={this._changeNum} width={px2dp(150)} height={px2dp(50)}/>
                    </View>
                </View>
            </View>
        );
    }
}
class Order_confirmSubmit extends Component {
    constructor(props) {
        super(props);
        this._transformValue = new Animated.Value(0);
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
        let {a_checkedData,n_totalNum,n_totalPrice,checkChange} = this.props;
        if(a_checkedData){
            listEl = a_checkedData.map((item,key)=>{
                return <Item key={key} {...item} index={key} checkChange={checkChange} changeNum={this.props.changeNum}/>;
            });
        }
	    return (
           <View style={baseFlex}>
               <View style={[baseContent,baseFlex,baseBgColorW]}>
                   <Animated.View style={{flex:1,marginBottom:this._marginBottomY}}>
                       <ScrollView  style={categoryLists}>
                           {listEl}
                       </ScrollView>
                   </Animated.View>
                   <Animated.View style={[submitCon,{transform:[{translateY:this._translateY}]}]}>
                       <Text style={submitText}>
                           共<Text>{n_totalNum}</Text>件产品，总计：<Text style={textColorNum}>{Com.getNumFormat(n_totalPrice)}元</Text>
                       </Text>
                       <Button onPress={()=>this.props.submit()} text="结算" textStyle={submitBtnLabel} style={submitBtn}/>
                   </Animated.View>
               </View>
               <TopBar s_title="提交确认"/>
           </View>
       );
   }
}
export default Order_confirmSubmit;
