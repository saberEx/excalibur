'use strict';
import React,{ Component } from 'react';
import { View , Text } from 'react-native';
import Com from './common';
import {TopBar,MyListView} from './components';
import {MemberItemView} from './memberItemView';
import {ContentBlank} from './contentBlank';
import o_styles from './member_search_point.style';
const {scrollViewContent} = o_styles;
const {baseContent,baseFlex,baseRow,baseP10,baseBetween} = Com;

class Item extends Component{
    render(){
        let {pl_type,pl_points,shopname,pl_id,pl_addtime,pl_desc} = this.props.rowData;
        let s_add = parseInt(pl_type) === 1 ? '+' : '-';
        let s_money = `积分：${s_add}${Com.getNumFormat(pl_points,2)}`;
        return(
            <MemberItemView b_point={true} b_add={parseInt(pl_type) === 1} s_typeName={pl_desc} s_money={s_money} s_shopName={shopname || ''}
            s_orderSn={pl_id} s_ticketMoney={''} s_time={Com.getTimeFormat(pl_addtime,2).replace(/\:\d{2}/,'')}/>
        );
    }
}

class SectionHeader extends Component {
    render() {
        let {sectionID,sectionData} = this.props;
        let moneys = 0;
        sectionData.map((item,index)=>{
            let {pl_points,pl_type} = item;
            pl_points = parseFloat(pl_points) || 0;
            if(parseInt(pl_type) === 1){
                moneys += parseFloat(item.pl_points);
            }else{
                moneys -= parseFloat(item.pl_points);
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
class Member_search_point extends Component {
    componentDidMount(){
        this.props.init();
    }
  	render() {
        let {o_data,b_hasMore,f_paginate} = this.props;
        let el = null;
        if(!Com.isEmptyObject(o_data)){
            el = <MyListView
                        style={scrollViewContent}
                        SectionHeaderView={SectionHeader}
                        RowView={Item}
                        f_firstLoad={(callback)=>{callback(o_data,{allLoaded:!b_hasMore});}}
                        f_paginate={(page, callback)=>{f_paginate(page,callback);}}
                    />;
        }else{
            el = <ContentBlank s_textContent="当前没有记录"/>;
        }
	    return (
            <View style={baseFlex}>
                <View style={[baseContent,baseFlex]}>
                    {el}
                </View>
                <TopBar s_title="积分查询"/>
            </View>
        );
    }
}
export default Member_search_point;
