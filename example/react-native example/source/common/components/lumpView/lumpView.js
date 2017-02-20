/*
* @Author: 卢旺
* @Date:   2016-06-13 16:15:56
* @Last Modified by:   卢旺
* @Last Modified time: 2016-06-15 15:43:10
*/

'use strict';
import React, {PropTypes,Component} from 'react';
import {View,TouchableWithoutFeedback,Image,Text} from 'react-native';
import Common from './common';
import {Line} from './line';
import o_styles from './lumpView.style';
const {itemColumn,img,midText,leftLine,horizontalLine} = o_styles;
const {baseCenter,baseRow,baseFlex} = Common;

class LumpItem extends Common.Component{
	static propTypes = {
		b_line : PropTypes.bool,//是否有线
        s_url : PropTypes.number.isRequired,//图片
        s_label : PropTypes.string,//标签
        s_id : PropTypes.string,
        f_callBack: PropTypes.func,//点击回调
	};
	static defaultProps={
		s_label:'暂无'
	};
	render(){
		let {b_line,s_label,s_id,s_url,f_callBack,style} = this.props;
		return(
			<TouchableWithoutFeedback onPress={()=>{
				f_callBack && f_callBack(s_id);
			}}>
				<View style={[itemColumn,style]}>
					<View style={[baseCenter]}>
						<Image style={img} source={s_url}/>
						<View style={[horizontalLine]}></View>
	                  	<Text style={midText}>{s_label}</Text>
					</View>
					{ b_line ?<View style={{backgroundColor:Common.mainColor,height:1}}/>:null }
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export class LumpGroup extends Component {
	constructor(props){
		super(props);
		this.state = {
			cur_id:props.s_curId || "-1"
	    };
	    let {f_callBack} = props;
	    this._change = (s_id)=>{
	    	this.setState({cur_id:s_id});
	    	f_callBack && f_callBack(parseInt(s_id));
	    };
	}
    static propTypes = {
        s_curId: PropTypes.string,//当前s_id
        f_callBack : PropTypes.func,
    };
	render() {
		let {cur_id} = this.state;
		let {style,a_group} = this.props;
		let self = this;
		let e_items = a_group.map((item,index)=>{
			let {s_url,s_label} = item;
			let s_id = index.toString();
			return <LumpItem s_id={s_id} b_line={s_id===cur_id} style={index === 0 ? {} : leftLine} key={index} s_url={s_url} s_label={s_label} f_callBack={self._change}/>;
		});
		return (
			<View style={[baseRow,baseFlex,style]}>
				{e_items}
			</View>
		);
	}
}
