/*
* @Author: 卢旺
* @Date:   2016-08-25 17:01:10
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-27 16:25:24
*/

'use strict';
require('timeLabelCss');
require('react-day-picker/lib/style.css');
let  DayPicker = require('react-day-picker');
class TimeLabel extends React.Component{
    static propTypes = {
        s_left:React.PropTypes.string,//左label
        s_inputType:React.PropTypes.string,//输入类型，默认date
        b_type:React.PropTypes.bool,//类型 true为date,false为select
        a_time:React.PropTypes.array,//时间数组
    };
    static defaultProps = {
        s_inputType:"date",
    }
    constructor(props){
        super(props);
        this.state = {
            date:"",
            time:"",
        };
    }
    componentDidMount(){
        let self = this;
        Com.addEvt('date_picker',(res)=>{
            self.setState({date:res.date});
        })
        if (this.refs.time_select) {
            this.refs.time_select.selectedIndex = -1;
        }
        this.getValue = ()=>{
            return this.state.date ? this.state.date : "";
        };
        this.setValue = (s_value)=>{
            this.setState({date:s_value});
        };
        this.getSelectValue = ()=>{
            return this.state.time ? this.state.time : "";
        };
        this.setSelectValue = (s_value)=>{
            this.setState({time:s_value});
        };
    }
    timeSelect(value){
        this.setState({time:value});
    }
    dateClick(){
        Com.openWin('datePicker');
    }
    render(){
        let {a_time,s_left,b_type,s_inputType} = this.props;
        let {date,time,overlayStyle} = this.state;
        let a_t = [];
        let item = null;
        if (b_type) {
            item = <div className='base-positionRel base-iconRight'>
                       <div className="con base-after-line">
                           <label>{s_left}</label>
                           <span className="base-fr base-ellipsis base-mR10" onClick={()=>this.dateClick()}>{date || "请选择"}</span>
                       </div>
                   </div>
        }else{
            if (a_time) {
                a_t = a_time.map((item,index)=>{
                    let value = item.start+"-"+item.end;
                    return <option key={index} value={value}>{value}</option>;
                });
            }
            item = <div className='base-positionRel base-iconRight'>
                    <div className="con base-after-line">
                        <label>{s_left}</label>
                        <span className="base-fr base-ellipsis base-mR10">{time || "请选择"}</span>
                        <select ref="time_select" id="time_select" onChange={(e)=>this.timeSelect(e.target.value)}>
                            {a_t}
                        </select>
                    </div>
                </div>
        }
        return(
            <div className="timeLabel">
                {item}
            </div>
        );
    }
}
module.exports = TimeLabel;
