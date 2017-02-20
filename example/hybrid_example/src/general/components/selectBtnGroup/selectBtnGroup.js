//配送方式 按钮块
'use strict';
const classSet = require('classnames');
require('selectBtnGroupCss');
class SelectBtnItem extends React.Component{
	static propsTypes = {
		f_clickHandler: React.PropTypes.func.isRequired,//点击回调
        i_index:React.PropTypes.number.isRequired,//item索引
        s_itemName : React.PropTypes.string.isRequired,//item标题
        b_active : React.PropTypes.bool.isRequired,//是否为激活状态
        i_disabled : React.PropTypes.number,//是否隐藏 0隐藏，1显示
	}
	f_clickHandler(){
        this.props.f_clickHandler(this.props.i_index);
    }
    render(){
        let b_active = this.props.b_active;
        let s_className = classSet("item",{
            "active":b_active,
        });
        let i_disabled = this.props.i_disabled;
        let item = i_disabled===1 ?
			       <a className={s_className} onClick={this.f_clickHandler.bind(this)}>
			            {this.props.s_itemName}
			       </a>
        		:null;
       return(
   			item
       	);
    }
}
class SelectBtnGroup extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			i_currentItem:this.props.i_currentItem || 0
		}
	}
	static propTypes = {
		f_callBack: React.PropTypes.func,//点击回调
	    i_currentItem : React.PropTypes.number,//当前索引
	    a_dataItems : React.PropTypes.array.isRequired,//item组
	}
	f_itemClickHandler(i_index){
	    this.setState({i_currentItem: i_index});
	    this.props.f_callBack(i_index);
	}
	componentWillReceiveProps(nextProps){//属性改变
	    if(this.props.i_currentItem !== nextProps.i_currentItem){
	        this.setState({i_currentItem:nextProps.i_currentItem});
	    }
	}
	render(){
		let _self = this;
		let o_itemStyle = {backgroundColor:"#fff"};
        let o_progressStyle = {
            zIndex: 1,
            height: 2,
            transition: "transform 0.5s",
            WebkitTransition: "transform 0.5s",
        };
        o_progressStyle.width = parseFloat(100/this.props.a_dataItems.length).toFixed(3)+"%";
        o_progressStyle['transform'] = "translate3d("+100*this.state.i_currentItem+"%, 0px, 0px) translateZ(0px)";
        o_progressStyle['WebkitTransform'] = "translate3d("+100*this.state.i_currentItem+"%, 0px, 0px) translateZ(0px)";
		let e_items = this.props.a_dataItems.map((item,key)=>{
 			return <SelectBtnItem key={key} s_itemName={item[1]} b_active={key===_self.state.i_currentItem} i_index={key} i_disabled={item[0]} f_clickHandler={(i_index)=>_self.f_itemClickHandler(i_index)}/>;
		});
		return(
			<div className="selectBtnGroup">
				<div className="segmented-control" style={o_itemStyle}>
                    {e_items}
                </div>
                <div className="line" style={o_progressStyle}></div>
	        </div>
		);
	}
}
module.exports = SelectBtnGroup;
