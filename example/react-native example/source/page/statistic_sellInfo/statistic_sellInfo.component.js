'use strict';
import React,{ Component } from 'react';
import { View , Text , ScrollView} from 'react-native';
import Com from './common';
import {TopBar,TitleView,Line,BlockBtn} from './components';
import {DateSelect} from './dateSelect';
import o_styles from './statistic_sellInfo.style';
import {ContentBlank} from './contentBlank';
const {baseContent,baseMT20,baseBgColorW,baseRow,baseColorMG,baseColorG,baseFlex} = Com;
const {itemStyle,groupItemStyle,paddingStyle,colorRed,buttonSty} = o_styles;
//item组
class ItemGroup extends Component {
    render(){
        let {list,common_name} = this.props;
        let num = 0;
        let money = 0;
        let items = list.map((data,index)=>{
            num += parseInt(data.ordergoodsnum);
            money += parseFloat(data.ordergamount);
            return <Item key={index} {...data}/>;
        });
        return (
            <View>
                <View style={[baseRow,groupItemStyle,paddingStyle]}>
                    <Text style={baseColorMG}>{Com.getSpliceStr(common_name,16)}</Text>
                    <Text style={baseColorMG}>  {num}笔</Text>
                    <Text style={colorRed}>{Com.getNumFormat(money)}元</Text>
                    <Line n_left={Com.px2dp(30)}/>
                </View>
                {items}
            </View>
        );
    }
}

//item
class Item extends Component {
    render(){
        let {order_add_time,goods_name,goods_commonname,ordergamount} = this.props;
        return (
            <View>
                <View style={[baseRow,itemStyle,paddingStyle]}>
                    <View style={[baseRow]}>
                        <Text style={baseColorG}>{Com.getTimeFormat(order_add_time)}  </Text>
                        <Text style={baseColorG}>{Com.getTimeFormat(order_add_time,1).replace(/\:\d{2}$/,'')}</Text>
                    </View>
                    <Text style={baseColorG}>{Com.getSpliceStr(goods_name.replace(goods_commonname,''),16)}</Text>
                    <Text style={baseColorG}>{ordergamount}</Text>
                </View>
                <Line n_left={Com.px2dp(30)}/>
            </View>
        );
    }
}

class Statistic_sellInfo extends Component {
    componentWillMount() {
        const curDate = new Date();
        const preDate = new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate(),0,0).getTime();
        this._startTime = parseInt(preDate/1000);
        this._endTime = parseInt(curDate.getTime()/1000);
    }
    componentDidMount(){
        this.props.requestList(this._startTime,this._endTime,this);
    }
    _selectDate(startTime,endTime){
        this.props.requestList(startTime,endTime,this);
    }
    render() {
        let {data} = this.props;
        let views = [];
        for(let key in data){
            if(data.hasOwnProperty(key)){
                let gc_name = "";
                let comData = data[key];
                let groups = [];
                for(let keyCom in comData){
                    if(comData.hasOwnProperty(keyCom)){
                        let list = comData[keyCom];
                        let common_name = '';
                        if(list && list[0]){
                            common_name = list[0].goods_commonname || '';
                            gc_name = list[0].gc_name || "分类";
                        }
                        groups.push(<ItemGroup key={keyCom} common_name={common_name} list={comData[keyCom]}/>);
                    }
                }
                views.push(<TitleView key={key} titleStyle={baseColorMG} s_title={` ${gc_name}`}>
                    {groups}
                </TitleView>);
            }
        }
        let btnEl = null;
        if(views.length < 1){
            views = <ContentBlank s_textContent="当前时间段没有销售数据" style={baseFlex}/>;
        }else{
            btnEl = <View style={buttonSty}>
                <BlockBtn text='打  印' onPress={()=>this.props.print(this)}></BlockBtn>
            </View>;
        }
        return (
            <View style={baseFlex}>
                <ScrollView style={[baseContent,baseFlex,baseBgColorW]}>
                    <View style={[baseMT20]}>
                        <DateSelect startTime={this._startTime} endTime={this._endTime} onPress={this._selectDate.bind(this)}/>
                        {views}
                    </View>
                </ScrollView>
                {btnEl}
                <TopBar s_title="销售情况"/>
            </View>
        );
    }
}
export default Statistic_sellInfo;
