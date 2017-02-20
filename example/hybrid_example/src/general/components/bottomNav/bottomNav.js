/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-17 15:14:46
*/

'use strict';
require('bottomNavCss');
import Classnames from "classnames";
let e_lastTabItem = null;
//多级菜单
class BottomItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {b_open:false};
	}
	topItemHandler(url){
		let list = this.props.data.list || [];
		if(list.length > 0){
			if(e_lastTabItem && e_lastTabItem != this && e_lastTabItem.state.b_open === true){
				e_lastTabItem.setState({b_open:false});
			}
			this.setState({b_open:!this.state.b_open});
			e_lastTabItem = this;
		}else{
			Com.openWin(url,{shop_id:this.props.shop_id,isFrom:this.props.isFrom});
		}
	}
	clickHandler(url){
		Com.openWin(url,{shop_id:this.props.shop_id,isFrom:this.props.isFrom});
	}
	render() {
		let self = this;
		let {data} = this.props;
		let {b_open} = this.state;
		let list = data.list || [];
		let e_items = list.map((item,index)=>{
			return <li key={index}><a onClick={()=>self.clickHandler(item.url)} >{item.title}</a></li>;
		})
		let cls = Classnames('submenu js-submenu',{'base-hide':!b_open});
		let arrowCls = Classnames('arrow-weixin',{'base-hide':e_items.length===0});
		return (
			<div className="nav-item-www">
			    <a className="mainmenu" onClick={()=>this.topItemHandler(data.url)}>
			    	<i className={arrowCls}></i>
			    	<span className="mainmenu-txt">{data.title}</span>
			    </a>
			    <div className={cls}>
			        <div className="js-nav-2nd-region">
			            <ul>
			                {e_items}
			            </ul>
			        </div>
			    </div>
			</div>
		);
	}
}
class BottomNav extends React.Component {
	render() {
		let {list,shop_id,isFrom} = this.props;
		let e_items = list.map((data,index)=>{
			return <BottomItem key={index} data={data} shop_id={shop_id} isFrom={isFrom}/>
		})
		return (
			<div className='bottomNav'>
				<div className="preview-nav-menu">
					<div className={"js-navmenu nav-show nav-menu-1 nav-menu has-menu-" + e_items.length}>
						<div className="nav-special-item nav-item">
						    <a className="home" href="">主页</a>
						</div>
						<div className="js-nav-preview-region nav-items-wrap">
							<div className="nav-items">
								{e_items}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
module.exports = BottomNav;
