/*
* @Author: 万敏
* @Date:   2016-12-03 16:31:58
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-08 17:07:18
*
*/
'use strict';
require("group_ComonentCss");

class Group_Comonent extends React.Component{
	constructor(props){
		super(props);
		this.state = {data:this.props.data,o_time:{}};
	}
	componentDidMount(){
		let {state,validity,spell_state,open_state=0} = this.state.data;
		let open_sn = this.props.open_sn;
		state = parseInt(state);
		let i_currentTime = Math.floor(new Date().getTime()/1000);
		let i_day,hour,minute,second,interval;
		let self = this;
		//倒计时
		function setShowTime() {
			second = second - 1;
			if(second<0){
				second = 59;
				minute = minute - 1;
				if(minute<0){
					minute = 59;
					hour = hour - 1;
					if(hour<0){
						if(i_day){
							hour = 23;
							i_day = i_day - 1;
							if(i_day == 0){

							}else if(i_day<0){
								hour = 0;
								minute = 0;
								second = 0;
								clearInterval(interval);
                                Com.reload();
							}
						}else {
							hour = 0;
							minute = 0;
							second = 0;
							clearInterval(interval);
                            Com.reload();
						}
					}
				}
			}
			self.setState({o_time:{i_day,hour,minute,second}});
		}
		function calculateTime(time) {
            time = parseInt(time) + 1;
			hour = parseInt(time/60/60);
			minute = parseInt((time-hour*60*60)/60);
			second = parseInt(time-hour*60*60-minute*60);
			if(hour>23){
				i_day = parseInt(hour/24);
				hour = hour - i_day*24;
			}
			setShowTime();
			interval = setInterval(function () {
				setShowTime();
			},1000);
		}
		if(parseInt(spell_state) !==0 && (state === 1 || state === 2)){
			if(state === 2 && open_sn && parseInt(open_state) === 2){
				return;
			}
			if(validity){
                calculateTime(validity - i_currentTime);
            }
		}
	}
    render(){
		let {spell_price,spell_goods_price,spell_number,state,spell_state,open_state=0} = this.state.data;
		let open_sn = this.props.open_sn;
		let {i_day=0,hour=0,minute=0,second=0} = this.state.o_time;
		let a_state = ["","距离开始还有","距离结束还有","已结束"];
		let s_state = "";
		let b_showTime = false;
		if(parseInt(spell_state)===0){
			s_state = "已停用";
		}else {
			state = parseInt(state);
			s_state = a_state[state];
			if(state === 2){
				b_showTime = true;
				if(open_sn && open_state!=0){
					if(parseInt(open_state) === 2){
						s_state = "拼团已失败";
						b_showTime = false;
					}
				}
			}
			if(state===1){
				b_showTime = true;
			}
		}
        return (
            <div className="group_Comonent">
                <div className="group_left base-fl">
                	<span className="g_prices"><i>￥</i>{spell_price}</span>
                	<span className="g_pri_info">
                		<span>{spell_number}人团</span><br/>
                		<span className="one_prices">单买价￥{spell_goods_price}</span>
                	</span>
                </div>
                <div className="group_right  base-fr">
                	<p className={`g_tips ${b_showTime?"":"align"}`}>{s_state}</p>
					{i_day&&i_day>0?<p className={`times_box ${b_showTime?"":"base-hide"}`}>
						<span>{i_day}天</span>:
						<span>{hour<10?"0"+hour:hour}</span>:
						<span>{minute<10?"0"+minute:minute}</span>:
						<span>{second<10?"0"+second:second}</span>
					</p>:<p className={`times_box ${b_showTime?"":"base-hide"}`}>
						<span>{hour<10?"0"+hour:hour}</span>:
						<span>{minute<10?"0"+minute:minute}</span>:
						<span>{second<10?"0"+second:second}</span>
					</p>}
                </div>
            </div>
        )
    }
}
module.exports = Group_Comonent;
