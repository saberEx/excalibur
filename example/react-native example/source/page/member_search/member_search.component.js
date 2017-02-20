'use strict';
import React,{ Component } from 'react';
import { View , Text , Image, TextInput , TouchableOpacity } from 'react-native';
import Com from './common';
import {TopBar,IconBtn,Label,NetImage} from './components';
import o_styles from './member_search.style';
const {inputStype,textStyle,bottomBorderStyle,bottomIcon,bottomItem,memberImg,colorMoney,colorCard,colorInte} = o_styles;
const {baseContent,baseRow,baseFlex,baseCenter,baseColCenter,baseBgColorW,baseMB10,basePTB10,basePTB20,baseMR20,baseBodyBgColor,baseML20,baseMT20} = Com;
const arrow = require('./rightSmallArrow.png');
const searchBtn = require('./member_searchBtn.png');
class Item extends Component {
    _onPress(){
        let {itemPress,pageName,type} = this.props;
        itemPress && itemPress(pageName,type);
    }
    render(){
        let {style,s_label} = this.props;
        return (
            <TouchableOpacity onPress={()=>this._onPress()}>
                <View style={[baseRow,baseCenter,baseFlex,bottomItem,bottomBorderStyle,style]}>
                    <Text>
                        {s_label}
                    </Text>
                    <Image source={arrow} style={bottomIcon}/>
                </View>
            </TouchableOpacity>
        );
    }
}

class MemberItem extends Component {
    render(){
        let {member_avatar,member_name,card_id,member_mobile,wechat_nickname,card_balance,card_presentation,member_points} = this.props;
        return(
            <View style={[baseMT20,baseBgColorW]}>
                <View style={[baseRow,baseColCenter]}>
                    <NetImage style={[baseML20,baseMR20,memberImg]} source={{uri:member_avatar}}/>
                    <View style={[baseML20,baseFlex]}>
                        <Label style={basePTB10} b_line={true} s_title="会员名称：" s_label={member_name}/>
                        <Label style={basePTB10} b_line={true} s_title="会员卡号：" s_label={card_id}/>
                        <Label style={basePTB10} b_line={true} s_title="手机号码：" s_label={member_mobile}/>
                        <Label style={basePTB10} s_title="微信昵称：" s_label={wechat_nickname || "未绑定微信"}/>
                    </View>
                </View>
                <View style={[baseRow,baseFlex,Com.borderStyle(),basePTB10]}>
                    <View style={[baseColCenter,baseFlex,Com.borderStyle(1)]}>
                        <Text style={[Com.fzStyle(26),baseMB10,colorMoney]}>余额</Text>
                        <Text style={Com.fzStyle(22)}>{card_balance}元</Text>
                    </View>
                    <View style={[baseColCenter,baseFlex,Com.borderStyle(1)]}>
                        <Text style={[Com.fzStyle(26),baseMB10,colorCard]}>赠券</Text>
                        <Text style={Com.fzStyle(22)}>{card_presentation}元</Text>
                    </View>
                    <View style={[baseColCenter,baseFlex]}>
                        <Text style={[Com.fzStyle(26),baseMB10,colorInte]}>积分</Text>
                        <Text style={Com.fzStyle(22)}>{member_points}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

class Member_search extends Component {
    componentWillMount() {
        this._pageType = parseInt(Com.getPageParams('pageType'));
        let a_bottom = [];
        if(this._pageType === 1){
            a_bottom = [
                {s_label:'编辑资料',pageName:'member_edit'},
                {s_label:'充值',pageName:'member_recharge'},
                {s_label:'重置密码',pageName:'member_passwordReset'},
            ];
        }else{
            a_bottom = [
                {s_label:'会员查询',pageName:'member_search_list',type:0},
                {s_label:'充值查询',pageName:'member_search_list',type:1},
                {s_label:'消费查询',pageName:'member_search_list',type:2},
                {s_label:'积分查询',pageName:'member_search_point'},
            ];
        }
        const deviceW = Com.deviceWidth/a_bottom.length;
        this._bottomEl = a_bottom.map((item,index)=>{
            return <Item key={index} {...item} itemPress={this.props.itemPress} style={{width:deviceW}}/>;
        });
    }
    _search(){
        this.props.search(this);
    }
    _onChangeText(value){
        this._inputValue = value;
    }
    render() {
        let {memberData} = this.props;
        let bottomEl = null;
        let memberEl = null;
        if(memberData){
            bottomEl = this._bottomEl;
            memberEl = <MemberItem {...memberData}/>;
        }
        return (
            <View style={[baseFlex]}>
                <View style={[baseFlex,baseContent,baseBodyBgColor]}>
                    <View style = {[baseRow,baseBgColorW,basePTB20]}>
                        <View style={inputStype}>
                            <TextInput ref={(component)=>this._searchInput = component} onChangeText={this._onChangeText.bind(this)} style={textStyle} placeholder = "输入会员手机号或卡号" keyboardType = "numeric" autoFocus={true} underlineColorAndroid="transparent"/>
                        </View>
                        <IconBtn onPress={()=>this._search()} s_icon={searchBtn} width={Com.px2dp(100)} height={Com.px2dp(65)}/>
                    </View>
                    {memberEl}
                </View>
                <TopBar s_title={this._pageType === 1?"会员操作":"会员查询"}/>
                <View style={[baseRow,baseCenter,baseBgColorW]}>
                    {bottomEl}
                </View>
            </View>
        );
    }
}
export default Member_search;
