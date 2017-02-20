/*
* @Author: 卢旺
* @Date:   2016-09-21 15:23:08
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-06 11:09:00
* 拼团商品状态显示
*/

'use strict';
require('groupMenberCss');
 const countTime=require("countTime");
class GroupMenber extends React.Component{
    static propTypes = {
        i_state:React.PropTypes.number,//拼团状态 1拼团完成，2拼团失败，0拼团中
        i_buyNum:React.PropTypes.number,//拼团人数
        s_time:React.PropTypes.string,//剩余时间
        s_spell_time:React.PropTypes.string,//发货时间
        f_callBack:React.PropTypes.func,//点击回调
    }
    componentDidMount(){
        let {i_state} = this.props;
        console.log(this.props);
        if(parseInt(i_state) === 0){
            //加一秒。防止立即刷新服务端未停止
            let i_time = new Date(this.props.s_time).getTime()+1000;
            countTime.countdown(i_time,"t_h","","",function(e){
                Com.reload();
            },true);
        }
    }
    render(){
        let {i_state,i_buyNum,s_spell_time,s_time,f_callBack} = this.props;
        let item = "";
        if(i_state == 1){
            item = <div>
                        <div className="groupIcon"><img src={require('group_yesImg')}   alt=""/></div>
                        <div className='group_des scuess'>拼团成功</div>
                        <div className='group_tips'>请耐心等待商家发货<em onClick={()=>f_callBack()}>玩法详情</em></div>
                    </div>;
        }else if(i_state == 2){
            item = <div>
                        <div className="groupIcon"><img src={require('group_noImg')}   alt=""/></div>
                        <div className='group_des'>拼团失败</div>
                        <div className='group_tips'>您的拼团订单等待商家退款</div>
                    </div>;
        }else{
            item = <div>
                        <div className="groupIcon"><img src={require('colonelImg')}   alt=""/></div>
                        <div className='group_des'>拼团中，还差{parseInt(i_buyNum) < 0 ? 0 : i_buyNum}人成团</div>
                        <div className='group_time'>还剩：<span id="t_h" ref="t_h"></span></div>
                        <div className='group_tips' >成团后{s_spell_time}小时内发货，如人数不足退款，<br />详情查看<em onClick={()=>f_callBack()}>拼团流程&#62;</em></div>
                    </div>;
        }
        return(
            <div className="goGroup">

                {item}
            </div>
        );

    }
}

module.exports = GroupMenber;
