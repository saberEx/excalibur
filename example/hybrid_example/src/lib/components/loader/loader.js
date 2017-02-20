/*
* @Author: daihanqiao
* @Date:   2015-12-05 23:12:33
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-19 10:22:45
* 加载loading
* 用法：Loader.show();
*/

'use strict';
require("loaderCss");
const Loading = require("loadingLogoImg");
const LoadingRotate = require("loadingImg");
//组件
class Loader extends React.Component{
	render() {
		return (
			<div className="loader">
				{/*<div className='loader-bg'></div>
				<div className="loader-fixed">
				    <img className="fixedRotate" src={LoadingRotate} alt=""/>
				    <img className="fixedImg" src={Loading} alt=""/>
				</div>*/}
				<div className="loader_compatible">
					<div className="ball-spin-fade-loader">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</div>
		);
	}
}
//对外接口
let e_loaderCon = null;
module.exports = {
	show(){
		if(!e_loaderCon){
			e_loaderCon = document.createElement('div');
			e_loaderCon.style.zIndex = 10000;
			e_loaderCon.style.position = "fixed";
			e_loaderCon.style.height = "100vh";
			document.body.appendChild(e_loaderCon);
			e_loaderCon.addEventListener('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
			e_loaderCon.addEventListener('mousemove',function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}
		ReactDOM.render(<Loader></Loader>,e_loaderCon);
	},
	hide(){
		if(e_loaderCon){
			ReactDOM.unmountComponentAtNode(e_loaderCon);
		}
	}
};
