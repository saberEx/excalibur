/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-25 14:32:39
* 块状输入框，支持右侧带按钮
* 用法1(带按钮)：<BlockInput s_placeholder="请输入验证码" f_clickHandle={this._sendMsg} b_haveBtn={true} s_btnTxt="发送验证码"/>
* 用法2：<BlockInput s_placeholder="请输入姓名"/>
* 获取输入文本框内容：this.getValue();
*/
'use strict';
require('blockInputCss');
class BlockInput extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			s_btnTxt:this.props.s_btnTxt,
			b_disabled:this.props.b_disabled
		}
	}
	static propTypes = {
		s_placeholder:React.PropTypes.string.isRequired,//placeholder文字
		s_inputType:React.PropTypes.string,//输入类型
		f_clickHandle:React.PropTypes.func,//右侧按钮点击事件
		b_haveBtn:React.PropTypes.bool,//是否有右侧按钮
		b_disabled:React.PropTypes.bool,//是否禁用右侧按钮
		s_btnTxt:React.PropTypes.string,//右侧按钮文字
		onChange:React.PropTypes.func,//输入文本改变
	}
	static defaultProps = {
		s_inputType:"text"
	}
	componentDidMount(){
        this.getValue = ()=>{
            return this.refs.inputRef ? this.refs.inputRef.value : "";
        };
        this.setValue = (value)=>{
        	if(this.refs.inputRef){
        		this.refs.inputRef.value = value;
        	}
        };
    }
    onChangeHandler(){
        if(this.props.onChange){
            this.props.onChange(this.getValue());
        }
    }
    render(){
		let inputEl = null;
		if(this.props.b_haveBtn){
			let e_btnEl = this.state.b_disabled ? (<input className="base-btn base-ellipsis" onClick={this.props.f_clickHandle} type="button" disabled value={this.state.s_btnTxt}/>) : (<input className="base-btn base-ellipsis" type="button" onClick={this.props.f_clickHandle} value={this.state.s_btnTxt}/>);
			inputEl = <div>
				<input className="haveBtnStyle" ref="inputRef" onChange={()=>this.onChangeHandler()} type={this.props.s_inputType} placeholder={this.props.s_placeholder}/>
				{e_btnEl}
			</div>;
		}else{
			inputEl = <input className="noBtnStyle" ref="inputRef" onChange={()=>this.onChangeHandler()} type={this.props.s_inputType} placeholder={this.props.s_placeholder} />;
		}
		return (
			<div className="blockInput">
				{inputEl}
			</div>
		);
	}
}
module.exports = BlockInput;
