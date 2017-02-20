/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-19 09:54:54
* 单选框
* 用法：<CheckBox s_label="checkBox文本" f_changeHandler={this._checkHandler}/>
*/

'use strict';
require("checkBoxCss");
class CheckBox extends React.Component{
    static propTypes = {
        s_name:React.PropTypes.string,//radio名称
        s_label:React.PropTypes.string,//文本
        b_default:React.PropTypes.bool,//是否为默认选中
        f_changeHandler:React.PropTypes.func,//选中回调
    }
    changeHandle(e) {
        if(this.props.f_changeHandler){
            this.props.f_changeHandler(e.target.checked);
        }
    }
    getValue(){
        return this.refs.input.checked;
    }
    render(){
        let s_name = this.props.s_name || 'checkBox';
        let s_label = this.props.s_label || "";
        let e_input = null;
        if(this.props.b_default){
            e_input = <input ref="input" onChange={this.changeHandle} type='checkbox' defaultChecked id={s_name} name={s_name} style={{display:"none"}}/>;
        }else{
            e_input = <input ref="input" onChange={this.changeHandle} type='checkbox' name={s_name} id={s_name} style={{display:"none"}}/>;
        }
        return (
            <div className="checkBox">
                <div className="warp">
                    <div className='box'>
                        {e_input}
                        <label htmlFor={s_name}></label>
                    </div>
                </div>
                <span>{s_label}</span>
            </div>
        );
    }
}
module.exports = CheckBox;
