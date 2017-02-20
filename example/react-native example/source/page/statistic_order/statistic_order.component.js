'use strict';
import React,{ Component } from 'react';
import { View , Text } from 'react-native';
import Com from './common';
import {TopBar,TabView,MyListView} from './components';
import o_styles from './statistic_order.style';
import {ContentBlank} from './contentBlank';
import {OrderItemView} from './orderItemView';
const {baseContent,baseFlex,baseBgColorW,baseRow,baseP10,baseBetween} = Com;
const {bgColor,tabBarStyle} = o_styles;

class Item extends Component{
    render(){
        let rowID = this.props.rowID;
        let sectionID = this.props.sectionID;
        let data = this.props.rowData;
        return(
            <OrderItemView {...data} rowID={rowID} sectionID={sectionID} pageType={0}/>
        );
    }
}

class SectionHeader extends Component {
    render() {
        let {sectionID,sectionData} = this.props;
        return (
            <View style={[baseFlex,baseRow,baseP10,baseBetween]}>
                <Text>{sectionID}</Text>
                <Text>{`${sectionData.length}笔`}</Text>
            </View>
        );
    }
}

let a_tabViewItem = [null,null];
class Statistic_order extends Component {
    componentDidMount(){
        this.props.init();
    }
    componentDidUpdate(){
        this.props.f_updateRefs(this.refs);
    }
    componentWillUnmount(){
        a_tabViewItem = [null,null];
    }
  	render() {
        let {a_data,tabIndex,f_paginate,a_hasMore,tabViewChange} = this.props;
        if(a_data[tabIndex]){
            if(!Com.isEmptyObject(a_data[tabIndex]) || a_hasMore[tabIndex] ){
                let curData = a_data[tabIndex];
                a_tabViewItem[tabIndex] = <MyListView ref={`myListView_${tabIndex}`}
                                            SectionHeaderView={SectionHeader}
                                            RowView={Item}
                                            f_firstLoad={(callback)=>{callback(curData,{allLoaded:!a_hasMore[tabIndex]});}}
                                            f_paginate={(page, callback)=>{f_paginate(page,callback);}}
                                        />;
            }else {
                a_tabViewItem[tabIndex] =  <ContentBlank s_textContent="当前没有记录"/>;
            }
        }
	    return (
            <View style={baseFlex}>
                <View style={[baseContent,baseFlex]}>
                    <TabView i_index={tabIndex} style={baseBgColorW} tabBarStyle={tabBarStyle} titleStyle={{marginTop:10}} n_lineHeight={2.5} s_activeColor="#333" f_change={(i)=>tabViewChange(i,a_tabViewItem[i])} >
                       <View style={[baseFlex,bgColor]} tabLabel="已完成">
                            {a_tabViewItem[0]}
                       </View>
                       <View style={[baseFlex,bgColor]} tabLabel="已取消">
                            {a_tabViewItem[1]}
                       </View>
                   </TabView>
                </View>
                <TopBar s_title="已结订单"/>
            </View>
        );
    }
}
export default Statistic_order;
