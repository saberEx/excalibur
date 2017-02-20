/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-11-15 16:48:29
* 单选框
* <Radio f_changeHandler={this._change} s_value="1" s_label="测试radio"/>
*/

'use strict';
require("radioCss");
class Radio extends React.Component{
    static propTypes = {
        s_name:React.PropTypes.string,//radio名称
        b_default:React.PropTypes.bool,//是否为默认选中
        f_changeHandler:React.PropTypes.func.isRequired,//选中回调
        s_value:React.PropTypes.string.isRequired,//radio值
        s_label:React.PropTypes.string,//radio文字
    }
    changeHandle(e) {
        this.props.f_changeHandler && this.props.f_changeHandler(e.target.value);
    }
    render(){
        let s_name = this.props.s_name || "radio";
        let s_value = this.props.s_value;
        let s_id = "" + s_value + (new Date()).getTime();
        let e_input = null;
        if(this.props.b_default){
            e_input = <input id={s_id} className="base-hide" onChange={(e)=>this.changeHandle(e)} type="radio" name={s_name} defaultChecked value={s_value}/>;
        }else{
            e_input = <input id={s_id} className="base-hide" onChange={(e)=>this.changeHandle(e)} type="radio" name={s_name} value={s_value}/>;
        }
        return (
            <div className="radio base-positionRel">
                <div className="radioWrap">
                    <div className="radioGroup">
                        {e_input}
                        <label className="circle" htmlFor={s_id}>
                        </label>
                    </div>
                </div>
                <label className="radioTag" htmlFor={s_id}>{this.props.s_label}</label>
            </div>
        );
    }
}
module.exports = Radio;
