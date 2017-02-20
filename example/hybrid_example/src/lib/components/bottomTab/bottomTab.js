/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-26 09:24:43
* 底部tab
* BottomTab.create(function(index){},[{s_label:"首页",s_icon:require('shouye_1Img'),s_activeIcon:require('shouyeImg')},{s_label:"会员",s_icon:require('huiyuan_1Img'),s_activeIcon:require('huiyuanImg')},{s_label:"我的",s_icon:require('wode_1Img'),s_activeIcon:require('wodeImg')}]);
*/
'use strict';
require('bottomTabCss');
class BottomTabItem extends React.Component{
	static propTypes = {
		f_handleChange : React.PropTypes.func.isRequired,//点击回调
		s_label : React.PropTypes.string.isRequired,//tab文字
		i_index : React.PropTypes.number.isRequired,//tab索引
		s_icon: React.PropTypes.string,//tab图标
		s_activeIcon: React.PropTypes.string,//tab激活图标
		b_active:React.PropTypes.bool,//是否为激活状态
	}
	f_clickHandler(){
		document.title = this.props.s_label;
		let s_url = window.location.href.replace(/\?i_index=\d+/,'');
		s_url += '?i_index='+this.props.i_index;
		window.history.replaceState(null,this.props.s_label,s_url);
		this.props.f_handleChange(this.props.i_index);
	}
	render(){
		let s_tabIcon = this.props.s_icon;
		let s_activeCls = "";
		if(this.props.b_active){
			s_tabIcon = this.props.s_activeIcon;
			s_activeCls = "active";
		}
		return (
			<a className={s_activeCls} onClick={this.f_clickHandler.bind(this)}>
				<img className="bTab-topImg" src={s_tabIcon}/>
				<span>{this.props.s_label}</span>
			</a>
		);
	}
}

class BottomTab extends React.Component{
	constructor(props){
		super(props);
		this.state={
			i_curIndex:this.props.i_curIndex
		}
	}
	static propTypes = {
		f_callBack : React.PropTypes.func,
		a_tabIcons : React.PropTypes.array.isRequired
	}
	f_handleChange(i_index){
		this.setState({i_curIndex:i_index});
		if(this.props.f_callBack){
			this.props.f_callBack(i_index);
		}
	}
	render(){
		let _self = this;
		let bottomEl = this.props.a_tabIcons.map(function(item,key){
			return <BottomTabItem key={key} f_handleChange={_self.f_handleChange} s_label={item.s_label} b_active={_self.state.i_curIndex === key} i_index={key} s_icon={item.s_icon} s_activeIcon={item.s_activeIcon}/>;
		});
		return (
			<div className="bottomTab">
				{bottomEl}
			</div>
		);
	}
}
let e_bottomTabEl = null;
module.exports = {
    create(f_callBack,a_tabIcons,i_curIndex) {
        if(!e_bottomTabEl){
			e_bottomTabEl = document.createElement('nav');
			document.body.appendChild(e_bottomTabEl);
			a_tabIcons = a_tabIcons || [];
			//有topbar或bottomTba时，因为.base-container为100%,将其高度减去topbar高
            let containerHChange = 50;
            if(document.querySelector('.topBar')){
            	if(Base.isNeedImmerse()){
            		containerHChange += 64;
            	}else{
            		containerHChange += 44;
            	}
            }
            document.querySelector('.base-container').style.height = parseInt(document.body.offsetHeight - Base.getPxReality(containerHChange)) + 'px';
        }
		i_curIndex = i_curIndex || 0;
		document.title = a_tabIcons[i_curIndex].s_label;
		ReactDOM.render(<BottomTab f_callBack={f_callBack} a_tabIcons={a_tabIcons} i_curIndex={i_curIndex}/>,e_bottomTabEl);
    },
	destroy(){
		if(e_bottomTabEl){
			ReactDOM.unmountComponentAtNode(e_bottomTabEl);
			if(e_bottomTabEl.parentNode){
				e_bottomTabEl.parentNode.removeChild(e_bottomTabEl);
			}
			e_bottomTabEl = null;
		}
	}
};
