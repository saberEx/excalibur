/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-07 09:51:55
* 余额item
*/

'use strict';
require('balanceListCss');

class BalanceItem extends React.Component{
    static proptypes = {
        s_type:React.PropTypes.string,//类型
        s_time:React.PropTypes.string,//时间
        s_money:React.PropTypes.string,//余额
    }
    render(){
        let {s_type,s_time,s_money} = this.props;
        let s_colorStyle = 'integral_number base-tr base-fr'
        if(parseFloat(s_money) < 0){
            s_colorStyle = "integral_number base-tr base-fr minus_red";
        }else{
            s_money = "+"+s_money;
        }
        // let order_type = {pos:"pos",recharge:"充值",shop:"商家电商"};
        // let s_orderType = order_type[s_type];
        // if(!s_orderType){
        //     s_orderType = parseFloat(s_money) >= 0 ? "充值":"消费";
        // }
        return(
            <div className="i_list">
                {/*<div className="i_item">
                    <div className="i_tit">
                        {s_orderType}
                        <span className={s_colorStyle}>{s_money}</span>
                    </div>
                    <div className="i_time">{Com.getTimeFormat(s_time)}</div>
                </div>*/}
                <ul>
                    <li>
                        <span className="xf_name">{s_type}</span>
                        <span  className={s_colorStyle}>
                            {s_money} <br/>
                            <em>{Com.getTimeFormat(s_time)}</em>
                        </span>
                    </li>
                </ul>
            </div>
        );
    }
}
class BalanceList extends React.Component{
    static proptypes = {
        a_data:React.PropTypes.array,//类型
    }
    render(){
        let items = this.props.a_data.map((item,index)=>{
            return <BalanceItem key={index} s_type={item.order_type_desc} s_time={item.add_time} s_money={item.c_balance}></BalanceItem>
        });
        return(
            <div className="balanceList">
                {items}
            </div>
        );
    }
}
module.exports = BalanceList;
