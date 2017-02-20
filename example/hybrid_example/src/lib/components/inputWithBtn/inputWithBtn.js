/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-19 10:17:40
* 左侧带标题，右侧带按钮的输入框
* 用法：
* <InputWithBtn s_left="姓名" s_right="代汉桥" s_btnTxt="发送" f_rightClick={this._sendMsg}/>
*/

'use strict';
require('inputWithBtnCss');
const classSet = require('classnames');
class InputWithBtn extends React.Component{
    constructor(props){
        super(props);
        this.state={
            s_btnTxt:this.props.s_btnTxt,
            b_disabled:this.props.b_disabled,
        }
    }
    static propTypes = {
        s_left:React.PropTypes.string,//左label
        s_right:React.PropTypes.string,//右label
        s_inputType:React.PropTypes.string,//输入类型，默认text
        s_btnTxt:React.PropTypes.string.isRequired,//按钮文本
        f_rightClick:React.PropTypes.func.isRequired,//右侧点击
        b_line:React.PropTypes.bool,//是否有线，默认无
        onChange:React.PropTypes.func,//输入文本改变
        b_disabled:React.PropTypes.bool,//按钮是否禁用
        o_params:React.PropTypes.object,//点击回调参数
    }
    static defaultProps = {
        s_inputType:"text"
    }
    componentDidMount(){
        this.getValue = ()=>{
            return this.refs.inputRef ? this.refs.inputRef.value : "";
        };
        this.setValue = (s_value)=>{
            if(this.refs.inputRef){
                this.refs.inputRef.value = s_value || "";
            }
        };
        if(this.props.s_inputType.toLowerCase() === "number"){
            this.refs.inputRef.setSelectionRange = null;
        }
    },
    onChangeHandler(){
        if(this.props.onChange){
            this.props.onChange(this.getValue());
        }
    }
    render(){
        let s_classSet = "";
        let s_right = this.props.s_right;
        s_classSet = classSet("labelBtn",{"base-after-line":this.props.b_line});
        let e_btnEl = this.state.b_disabled ? <input type="button" onClick={this.props.f_rightClick} disabled value={this.state.s_btnTxt}/> :<input type="button" onClick={this.props.f_rightClick} value={this.state.s_btnTxt}/>;
        return (
            <div className="inputWithBtn">
                <div className={s_classSet}>
                    <label>{this.props.s_left}</label>
                    <input onChange={this.onChangeHandler} ref="inputRef" type={this.props.s_inputType} placeholder={s_right} />
                    {e_btnEl}
                </div>
            </div>
        );
    }
}
module.exports = InputWithBtn;
