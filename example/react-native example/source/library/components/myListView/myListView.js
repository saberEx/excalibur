import React, {PropTypes,Component} from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import Base from './base';
import GiftedListView from 'react-native-gifted-listview';
import GiftedSpinner from 'react-native-gifted-spinner';
import o_styles from './myListView.style.js';
const {paginationView,paginationText} = o_styles;
export class MyListView extends Component {
    constructor(props){
        super(props);
        this.f_updateRows = (rows,options)=>{
            if(typeof (rows) === "object"){
                rows = JSON.parse(JSON.stringify(rows));
            }
            let giftedListView = this.giftedListView;
            if(giftedListView){
                if(options){
                    giftedListView._updateRows(rows,options);
                }else {
                    giftedListView._updateRows(rows,{allLoaded:giftedListView.state.paginationStatus==="allLoaded"});
                }
            }
        };
        this.f_postPaginate = (rows, options = {})=> {
            this.giftedListView._setPage(this.giftedListView._getPage() + 1);
            this.f_updateRows(rows, options);
        };
    }
    static  propTypes = {
        ...GiftedListView.propTypes,
        SectionHeaderView:PropTypes.any,//小节头部组件
        RowView:PropTypes.any.isRequired,//每行组件
        EmptyView:PropTypes.any,//空白组件
        f_firstLoad:PropTypes.func,//当前组件首次渲染完成回调
        f_paginate:PropTypes.func,//分页上拉加载回调
        f_onRefresh:PropTypes.func,//下拉刷新回调
        o_rowProps:PropTypes.object//父容器传给行组件的属性
    };
    static defaultProps = {
        pagination:true,
        refreshable:false,
        firstLoader:true
    };
    _onFetch(page = 1, callback, options){
        let {f_paginate,f_firstLoad,f_onRefresh,refreshable,pagination} = this.props;
        if(options.firstLoad){
            //首次
            f_firstLoad && f_firstLoad(callback);
        }else {
            let giftedListView = this.giftedListView;
            let {isRefreshing,paginationStatus} = giftedListView.state;
            //上拉加载
            if(pagination && page>giftedListView._getPage()){
                f_paginate && f_paginate(page, this.f_postPaginate);
                return;
            }
            //下拉刷新
            if(refreshable && isRefreshing && paginationStatus!=="fetching"){
                f_onRefresh && f_onRefresh(page, callback);
            }
        }
    }
    get giftedListView(){
        return this.refs.giftedListView;
    }
    _paginationWaitingView(paginateCallback){
        return (
            <View style={[paginationView]}>
                <Text style={[paginationText]}>上拉加载更多</Text>
            </View>
        );
    }
    _paginationFetchingView(){
        return (
            <View style={[paginationView]}>
                <GiftedSpinner />
                <Text style={[paginationText]}>正在加载</Text>
            </View>
        );
    }
    _paginationAllLoadedView(){
        return (
            <View style={[paginationView]}>
                <Text style={[paginationText]}>没有更多数据了</Text>
            </View>
        );
    }
    render(){
        let {SectionHeaderView,EmptyView,RowView,o_rowProps,o_sectionProps,onEndReachedThreshold=Base.px2dp(100)} = this.props;
        return (
            <GiftedListView ref="giftedListView"  {...this.props}
                paginationWaitingView = {this._paginationWaitingView}
                paginationFetchingView={this._paginationFetchingView}
                paginationAllLoadedView={this._paginationAllLoadedView}
                sectionHeaderView = {SectionHeaderView?(sectionData, sectionID)=><SectionHeaderView {...{sectionData, sectionID,o_sectionProps}}/>:""}
                emptyView = {(refreshCallback)=><EmptyView f_refreshCallback={refreshCallback}/>}
                rowView = {(rowData, sectionID, rowID, highlightRow)=><RowView {...{rowData, sectionID, rowID, highlightRow,o_rowProps}}/>}
                onFetch = {this._onFetch.bind(this)}
                withSections = {SectionHeaderView?true:false}
                onEndReached = {()=>{this.giftedListView._onPaginate();}}
                onEndReachedThreshold = {onEndReachedThreshold}
            />
        );
    }
}
