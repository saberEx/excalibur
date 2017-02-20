'use strict';
import React,{ Component } from 'react';
import { View ,ScrollView,Text } from 'react-native';
import Com from './common';
import {TopBar,TitleView,BlockBtn,Line} from './components';
import {DateSelect} from './dateSelect';
import o_styles from './statistic_summary.style';
import {ContentBlank} from './contentBlank';
const {baseContent,baseFlex,baseBgColorW,baseMT20,baseColorG,baseRow,baseColorMG} = Com;
const {itemStyle,groupItemStyle,paddingStyle,colorRed,buttonSty} = o_styles;

//item组
class ItemGroup extends Component {
    render(){
        let {datas,subName,nums,totalMoney} = this.props;
        datas = datas || [];
        let items = datas.map((data,index)=>{
            return <Item key={index} {...data}/>;
        });
        return (
            <View>
                <View style={[baseRow,groupItemStyle,paddingStyle,{flexWrap:"wrap"}]}>
                    <Text style={baseColorMG}>{subName}</Text>
                    <View style={baseRow}>
                        <Text style={baseColorMG}>{nums}</Text>
                        <Text style={colorRed}>          {totalMoney}</Text>
                    </View>
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
        let {name,num,money} = this.props;
        return (
            <View>
                <View style={[baseRow,itemStyle,paddingStyle,{flexWrap:"wrap"}]}>
                    <Text style={baseColorG}>{name}  </Text>
                    <View style={baseRow}>
                        <Text style={baseColorG}>{num}</Text>
                        <Text style={baseColorG}>          {money}</Text>
                    </View>
                </View>
                <Line n_left={Com.px2dp(30)}/>
            </View>
        );
    }
}

class Statistic_summary extends Component {
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
                let {title,list} = data[key];
                let groups = list.map((item,index)=>{
                    return <ItemGroup key={index} {...item}/>;
                });
                views.push(<TitleView key={key} titleStyle={baseColorMG} s_title={` ${title}`}>
                    {groups}
                </TitleView>);
            }
        }
        let btnEl = null;
        if(views.length < 1){
            views = <ContentBlank s_textContent="当前时间段没有结班数据" style={baseFlex}/>;
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
                <TopBar s_title="结班"/>
            </View>
        );
    }
}
export default Statistic_summary;
