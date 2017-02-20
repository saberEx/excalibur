'use strict';
import React,{ Component } from 'react';
import { View , Text } from 'react-native';
import Com from './common';
import {TopBar,TabView,MyListView} from './components';
import o_styles from './member_search_list.style';
import {MemberItemView} from './memberItemView';
import {ContentBlank} from './contentBlank';
const {baseContent,baseRow,baseBgColorW,baseFlex,baseP10,baseBetween} = Com;
const {tabBarStyle,scrollViewBg,scrollViewContent} = o_styles;

const record_types = {'1':'充值','2':'消费'};
class Item extends Component{
    render(){
        let {record_type,balance_consumption,shop_name,record_id,credit_consumption,add_time} = this.props.rowData;
        let s_add = parseInt(record_type) === 1 ? '+' : '-';
        let s_money = `¥${s_add}${Com.getNumFormat(balance_consumption,2)}`;
        let s_ticketMoney = `券：${s_add}${Com.getNumFormat(credit_consumption,2)}`;
        return(
            <MemberItemView b_add={parseInt(record_type) === 1} s_typeName={record_types[record_type]} s_money={s_money} s_shopName={shop_name}
            s_orderSn={record_id} s_ticketMoney={s_ticketMoney} s_time={Com.getTimeFormat(add_time,2).replace(/\:\d{2}/,'')}/>
        );
    }
}

class SectionHeader extends Component {
    render() {
        let {sectionID,sectionData} = this.props;
        let moneys = 0;
        sectionData.map((item,index)=>{
            let {balance_consumption,record_type} = item;
            balance_consumption = parseFloat(balance_consumption) || 0;
            if(parseInt(record_type) === 1){
                moneys += parseFloat(item.balance_consumption);
            }else{
                moneys -= parseFloat(item.balance_consumption);
            }
        });
        return (
            <View style={[baseFlex,baseRow,baseP10,baseBetween]}>
                <Text>{sectionID}</Text>
                <Text>{`总计：${Com.getNumFormat(moneys)}`}</Text>
            </View>
        );
    }
}

let a_tabViewItem = [null,null,null,null];
class Member_search_list extends Component {
    componentWillMount() {
        this._initTab = parseInt(Com.getPageParams('type'));
    }
    componentWillUnmount(){
        a_tabViewItem = [null,null,null,null];
    }
    componentDidMount(){
        this.props.init();
    }
    render() {
        let {a_data,tabIndex,f_paginate,a_hasMore,tabViewChange} = this.props;
        if(tabIndex === -1){
            tabIndex = this._initTab;
        }else{
            if(a_data[tabIndex]){
                if(!Com.isEmptyObject(a_data[tabIndex]) || a_hasMore[tabIndex] ){
                    let curData = a_data[tabIndex];
                    a_tabViewItem[tabIndex] = <MyListView ref={`myListView_${tabIndex}`}
                                                style={scrollViewContent}
                                                SectionHeaderView={SectionHeader}
                                                RowView={Item}
                                                f_firstLoad={(callback)=>{callback(curData,{allLoaded:!a_hasMore[tabIndex]});}}
                                                f_paginate={(page, callback)=>{f_paginate(page,callback);}}
                                            />;
                }else {
                    a_tabViewItem[tabIndex] =  <ContentBlank s_textContent="当前没有记录"/>;
                }
            }
        }
        return (
            <View style={baseFlex}>
                <View style={[baseContent,baseFlex]}>
                    <TabView i_index={tabIndex} style={baseBgColorW} tabBarStyle={tabBarStyle} titleStyle={{marginTop:10}} n_lineHeight={2.5} s_activeColor="#333" f_change={(i)=>tabViewChange(i,a_tabViewItem[i])} >
                       <View style={[baseFlex,scrollViewBg]} tabLabel="全部">
                            {a_tabViewItem[0]}
                       </View>
                       <View style={[baseFlex,scrollViewBg]} tabLabel="充值">
                            {a_tabViewItem[1]}
                       </View>
                       <View style={[baseFlex,scrollViewBg]} tabLabel="消费">
                            {a_tabViewItem[2]}
                       </View>
                   </TabView>
                </View>
                <TopBar s_title="会员查询列表"/>
            </View>
        );
    }
}

export default Member_search_list;
