'use strict';
import React,{ Component } from 'react';
import { View,Text ,Image,ScrollView,TouchableOpacity } from 'react-native';
import Com from './common';
import {ContentBlank} from './contentBlank';
import {TopBar,Button,TabView,BlockBtn,Label,Line,MyListView} from './components';
import o_styles from './reservation_management.style';
const {baseContent,baseFlex,baseRow,baseColCenter,baseBgColorW,baseMB10,basePT10} = Com;
const {itemGroupName,itemGroupTime,itemGroupCount,textHeight,itemContainer,itemContent,itemTop,itemTopSpan,itemGroupMT,
        cancelBtn,btnTextStyle,cancelBtnNone,arrowImage,bottomBtnContainer,scrollViewContent,scrollViewBg,tabBarStyle} = o_styles;
const arrowPng = require('./mediaItem-rightIcon.png');
const o_labelColor = {color:"#333333",alignSelf:"center"};
const o_labelTitleStyle = {color:"#999999",alignSelf:"center",...Com.fzStyle(24)};
class Item extends Component {
    render() {
        let {rowData, sectionID, rowID,o_rowProps} = this.props;
        let {trueTime,reserve_sn,reserve_type,linkman,tel,id,remarks} = rowData;
        let {f_openDetails,f_cancel,tabIndex} = o_rowProps;
        let o_mB = baseMB10;
        let e_canael = null;
        if(tabIndex<2){
            e_canael = <Button style={cancelBtn} textStyle={btnTextStyle} onPress={()=>f_cancel(id,sectionID,rowID)} text="取消"/>;
        }else {
            e_canael = <Button style={cancelBtnNone} textStyle={btnTextStyle} text="取消"/>;
        }
        return (
            <View style={[baseBgColorW,itemContainer,o_mB]}>
                <View style={[baseRow,baseColCenter,itemTop]}>
                    <View style={itemTopSpan}>
                    </View>
                    <Label style={baseFlex} o_titleStyle={{color:"#666666",alignSelf:"center"}} o_labelStyle={o_labelColor} s_title="预定单号：" s_label={reserve_sn}></Label>
                    {e_canael}
                    <Line n_left={20}/>
                </View>
                <TouchableOpacity style={[itemContent]} onPress={()=>{f_openDetails(sectionID,rowID);}}>
                    <Label style={[textHeight,basePT10]} o_labelStyle={o_labelColor} o_titleStyle={o_labelTitleStyle} s_title="类　　型："
                            s_label={`线${parseInt(reserve_type)===1?"上":"下"}订单`}></Label>
                    <Label style={[baseFlex,textHeight]} o_titleStyle={o_labelTitleStyle} o_labelStyle={o_labelColor} s_title="联  系  人：" s_label={`${linkman}    ${tel}`}></Label>
                    <Label style={textHeight} o_titleStyle={o_labelTitleStyle} o_labelStyle={o_labelColor} s_title="备　　注：" s_label={remarks ||" "}></Label>
                    <Label style={textHeight} o_titleStyle={o_labelTitleStyle} o_labelStyle={o_labelColor} s_title="时　　间：" s_label={trueTime}></Label>
                    <Image style={arrowImage} source={arrowPng}></Image>
                </TouchableOpacity>
            </View>
        );
    }
}
class SectionHeader extends Component {
    render() {
        let {sectionID,sectionData} = this.props;
        let dateNum = sectionData.length;
        return (
            <View style={[baseFlex,baseRow,itemGroupName,itemGroupMT]}>
                <Text style={itemGroupTime}>{sectionID}</Text>
                <Text style={itemGroupCount}>{dateNum}笔</Text>
            </View>
        );
    }
}
let a_tabViewItem = [null,null,null,null];
function isEmptyObject(obj) {
    for(let i in obj){
        if(obj.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
}
class Reservation_management extends Component {
    componentWillUnmount(){
        a_tabViewItem = [null,null,null,null];
    }
    componentDidMount(){
       this.props.init();
   }
    componentDidUpdate(){
        this.props.f_updateRefs(this.refs);
    }
  	render() {
        let {a_data,tabIndex,f_openDetails,f_cancel,f_paginate,a_hasMore} = this.props;
        if(a_data[tabIndex]){
            if(!isEmptyObject(a_data[tabIndex]) || a_hasMore[tabIndex] ){
                let curData = a_data[tabIndex];
                a_tabViewItem[tabIndex] = <MyListView ref={`myListView_${tabIndex}`}
                                            style={scrollViewContent}
                                            SectionHeaderView={SectionHeader}
                                            RowView={Item}
                                            f_firstLoad={(callback)=>{callback(curData,{allLoaded:!a_hasMore[tabIndex]});}}
                                            o_rowProps={{f_openDetails,f_cancel,tabIndex}}
                                            f_paginate={(page, callback)=>{f_paginate(page,callback);}}
                                        />;
            }else {
                a_tabViewItem[tabIndex] =  <ContentBlank s_textContent="当前没有任何订单"/>;
            }
        }
        return (
           <View style={baseFlex}>
               <View style={[baseContent,baseFlex]}>
                   <TabView style={baseBgColorW} tabBarStyle={tabBarStyle} titleStyle={{marginTop:10}} n_lineHeight={2.5} s_activeColor="#333" f_change={(i)=>this.props.tabViewChange(i,a_tabViewItem[i])} >
                       <View style={[baseFlex,scrollViewBg]} tabLabel="待确认">
                           {a_tabViewItem[0]}
                       </View>
                       <View style={[baseFlex,scrollViewBg]} tabLabel="已过期">
                           {a_tabViewItem[1]}
                       </View>
                       <View style={[baseFlex,scrollViewBg]} tabLabel="已确认">
                           {a_tabViewItem[2]}
                       </View>
                       <View style={[baseFlex,scrollViewBg]} tabLabel="已取消">
                           {a_tabViewItem[3]}
                       </View>
                   </TabView>
                   <View style={bottomBtnContainer}>
                       <BlockBtn  onPress={()=>this.props.f_addReservation()} text="新建预定"/>
                   </View>
               </View>
               <TopBar s_title="预定管理"/>
           </View>
       );
   }
}
export default Reservation_management;
