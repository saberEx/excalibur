/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-06 11:53:48
* tab按钮组
* 用法：
* <TabBtnGroup f_callBack={this.clickHandler} i_currentItem={1} a_controlItems={["type1","type2","type3"]} />
*/

'use strict';
var classSet = require('classnames');
require('rechargeBtnCss');
var RechargeItem = React.createClass({
    propTypes : {
        f_clickHandler: React.PropTypes.func.isRequired,//点击回调
		i_index : React.PropTypes.number.isRequired,//item索引
		s_recharge : React.PropTypes.string.isRequired,//充值金额
        s_gift : React.PropTypes.string,//赠送金额
        b_active: React.PropTypes.bool.isRequired,//是否为激活状态
	},
    f_clickHandler:function(){
        this.props.f_clickHandler(this.props.i_index);
    },
    render:function(){
        let e_input = null;
        if(this.props.b_active){
            e_input = <input key='1'  type="radio" name="radio" defaultChecked/>;
        }else{
            e_input = <input key='2' type="radio" name="radio"/>;
        }
        return (
            <div className="pay_number_item" onClick={this.f_clickHandler}>
                <span className="base-fl">{this.props.s_recharge}元<em>   (赠送{this.props.s_gift}元)</em></span>
                <span className="base-fr">
                    <span className="radio_box active" >
                        {e_input}
                        <span className="opcity_layer"></span>
                    </span>
                </span>
            </div>
        );
    }
});
var RechargeGroup = React.createClass({
    propTypes : {
        f_callBack: React.PropTypes.func.isRequired,//点击回调
		i_currentItem : React.PropTypes.number,//当前索引
		a_controlItems : React.PropTypes.array.isRequired,//item组
	},
    f_itemClickHandler:function(i_index){
        this.setState({i_currentItem: i_index});
        this.props.f_callBack(i_index);
    },
    getInitialState:function(){
        return {i_currentItem:this.props.i_currentItem || 0};
    },
    componentWillReceiveProps:function(nextProps){
        if(this.props.i_currentItem !== nextProps.i_currentItem){
            this.setState({i_currentItem:nextProps.i_currentItem});
        }
    },
    render:function(){
        var _self = this;
        // console.log(_self.state.i_currentItem);
        var e_items = this.props.a_controlItems.map(function(item,key){
            return <RechargeItem key={key} s_recharge={Com.getNumFormat(item.recharge)} s_gift={Com.getNumFormat(item.gift)} b_active={key===_self.state.i_currentItem} i_index={key} f_clickHandler={_self.f_itemClickHandler} />;
        });
        return (
            <div className="rechargeGroup">
                {e_items}
            </div>
        );
    }
});
module.exports = RechargeGroup;
