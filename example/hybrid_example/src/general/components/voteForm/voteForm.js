/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-03 15:25:11
*/

'use strict';
require('voteFormCss');
var Radio = require('radio');
class VoteForm extends React.Component {
	static propTypes = {
        f_onChange:React.PropTypes.func,//选中回调
    }
	_change(value){
		this.props.f_onChange && this.props.f_onChange(value);
	}
	getValue(){
		return this.refs.input ? this.refs.input.value : "";
	}
	componentDidMount(){
		if (this.props.b_type) {
			if (this.props.b_type.toLowerCase() === "number") {
				if (this.refs.input) {
					this.refs.input.setSelectionRange = null;
				}
			}
		}

	}
	render() {
		let thisHtml = "";
		if(this.props.b_isArea){
			thisHtml = <div className="formItem">
                <span className="jName base-transY">{this.props.l_str}：</span>
                <textarea ref="input" name="" placeholder={this.props.s_plac} ></textarea>
                <span className="jRe base-transY"><em>*</em>必填</span>
            </div>
		}else{
			let t_type = this.props.b_type ? this.props.b_type :"text";
			thisHtml = <div className="formItem">
	            <span className="jName base-transY">{this.props.l_str}：</span>
	            <input ref="input" type={t_type} placeholder={this.props.s_plac}/>
	            <span className="jRe base-transY"><em>*</em>必填</span>
	        </div>
		}

		if(this.props.b_isSex){
			thisHtml = <div className="formItem">
	            <span className="jName base-transY">{this.props.l_str}：</span>
	            <div className="sexWrap">
	            	<Radio f_changeHandler={(value)=>this._change(value)} s_value="1" s_label="男"/>
	            	<Radio f_changeHandler={(value)=>this._change(value)} s_value="2" s_label="女"/>
	            </div>
	            <span className="jRe base-transY"><em>*</em>必填</span>
	        </div>
		}

		return (
			<div >
	            {thisHtml}
	        </div>
		);
	}
}
module.exports = VoteForm;




