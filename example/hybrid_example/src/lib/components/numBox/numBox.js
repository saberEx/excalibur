/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-21 15:57:20
* 数量选择框
* 用法：
* <NumBox />
* <NumBox i_value={1} i_min={1} i_max={100}/>
*/

'use strict';
require('numBoxCss');
class NumBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
           i_value:this.props.i_value || 0
        }
    }
    static propTypes = {
        i_value:React.PropTypes.number,//当前值
        i_min:React.PropTypes.number,//最小值
        i_max:React.PropTypes.number,//最大值
    }
    static defaultProps = {
        i_min:0,
        i_max:Number.MAX_VALUE
    }
    get value(){
        return this.refs.input.value;
    }
    leftClick(e){
        let i_value = parseInt(this.state.i_value);
        let i_newValue = Math.max(i_value - 1,this.props.i_min);
        this.setState({i_value:i_newValue});
    }
    rightClick(e){
        let i_value = parseInt(this.state.i_value);
        let i_newValue = Math.min(i_value + 1,this.props.i_max);
        this.setState({i_value:i_newValue});
    }
    inputChange(e){
        let i_value = parseInt(this.refs.input.value) || parseInt(this.props.i_min);
        let i_newValue = Math.min(i_value,this.props.i_max);
        i_newValue = Math.max(i_newValue,this.props.i_min);
        this.setState({i_value:i_newValue});
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props.f_callBack && prevState.i_value !== this.state.i_value){
            this.props.f_callBack(this.state.i_value);
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.i_value !== this.props.i_value){
            this.setState({i_value:nextProps.i_value});
        }
    }
    render(){
        return (
            <div style={this.props.style} className="numBox" data-params={this.props.params} onClick={(e)=>{e.stopPropagation();}}>
                <button onClick={this.leftClick.bind(this)} className="numbox-btn-minus" type="button">-</button>
                <input ref="input" value={this.state.i_value} className="numbox-input" type="text" onChange={()=>this.inputChange()}/>
                <button onClick={this.rightClick.bind(this)} className="numbox-btn-plus" type="button">+</button>
            </div>
        );
    }
}
module.exports = NumBox;
