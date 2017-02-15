/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-22 13:55:20
* 文本组件，支持左侧带标题，右侧带箭头
* 用法：
* <LabelInput s_left="姓名：" s_right="代汉桥" b_after={true} b_line={true}/>
* <LabelInput s_left="姓名：" s_right="代汉桥" b_after={true} b_line={true}/>
* <LabelInput s_left="姓名：" s_right="请输入姓名" b_isInput={true} b_line={true}/>
* <LabelInput s_left="姓名：" s_right="请输入姓名" b_isInput={true} b_line={true}/>
* <LabelInput s_left="收货地址管理" s_right="广东省深圳市南山区白石洲" s_leftImg={require('serviceIconImg')} b_leftImg={true} b_right={true} b_after={true} />   左侧图片
* <LabelInput s_left="收货地址管理" s_rightImg={require('serviceIconImg')} b_isInput={true} b_after={true} /> 右侧图片
*/

'use strict';
require('labelInputCss');
let classSet = require('classnames');
class LabelInput extends React.Component{
    static propTypes = {
        s_left:React.PropTypes.string,//左label
        s_right:React.PropTypes.string,//右label
        s_value:React.PropTypes.string,//输入框默认值
        b_isInput:React.PropTypes.bool,//是否为输入框
        s_inputType:React.PropTypes.string,//输入类型，默认text
        f_rightClick:React.PropTypes.func,//右侧点击
        b_after:React.PropTypes.bool,//是否有右箭头，默认无
        b_line:React.PropTypes.bool,//是否有线，默认无
        onClick:React.PropTypes.func,//label点击
        onChange:React.PropTypes.func,//输入文本改变
        b_right:React.PropTypes.bool,//是否靠右显示
        s_rightImg:React.PropTypes.string,//是否有右侧图片
        o_params:React.PropTypes.object,//点击回调参数
        b_leftImg:React.PropTypes.bool,//是否有左侧图片
    }
    static defaultProps = {
        s_inputType:"text",
    }
    componentDidMount(){
        this.getValue = ()=>{
            return this.refs.inputRef ? this.refs.inputRef.value : "";
        };
        this.setValue = (s_value)=>{
            if(this.refs.inputRef){
                this.refs.inputRef.value = s_value || "";
            }
            if(this.refs.rightEl){
                this.refs.rightEl.innerText = s_value || "";
            }
        };
        if(this.props.s_inputType.toLowerCase() === "number"){
            this.refs.inputRef.setSelectionRange = null;
        }
    }
    onChangeHandler(){
        if(this.props.onChange){
            this.props.onChange(this.getValue());
        }
    }
    onInput(){
        if(this.props.onInput){
            this.props.onInput(this.getValue());
        }
    }
    onClickHandler() {
        if(this.props.onClick){
            this.props.onClick(this.props.o_params);
        }
    }
    render(){
        let {b_isInput} = this.props;
        let e_labelEl = null;
        let s_classSet = "";
        let s_right = this.props.s_right;
        if(b_isInput){
            s_classSet = classSet({"base-after-line":this.props.b_line});
            let e_rightImg = this.props.s_rightImg ?  (<img className="r_img" onClick={this.props.f_rightClick} src={this.props.s_rightImg} />):"";
            e_labelEl = <div className={s_classSet} onClick={this.onClickHandler.bind(this)}>
                <label>{this.props.s_left}</label>
                <input onChange={()=>this.onChangeHandler()} onInput={()=>this.onInput()} ref="inputRef" defaultValue={this.props.s_value || ""} type={this.props.s_inputType} placeholder={s_right} />
                {e_rightImg}
            </div>;
        }else{
            s_classSet = classSet("pdBottom6",{"base-after-line":this.props.b_line,"iconRight":this.props.b_after,"leftImg":this.props.b_leftImg});
            let spanRight = classSet("base-ellipsis",{"base-fr":this.props.b_right},{"base-mR10":this.props.b_after});
            let e_leftImg = this.props.s_leftImg ?  (<img className="l_img" src={this.props.s_leftImg} />):"";
            e_labelEl = <div className={s_classSet} onClick={()=>this.onClickHandler()}>
                {e_leftImg}
                <label className="ovh">{this.props.s_left}</label>
                <span ref="rightEl" className={spanRight}>{s_right}</span>
            </div>;
        }
        return (
            <div className="labelInput">
                {e_labelEl}
            </div>
        );
    }
}
module.exports = LabelInput;
