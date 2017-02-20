/*
* @Author: 代汉桥
* @Date:   2016-11-30 13:46:19
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-11-30 13:53:51
*/

'use strict';
require('shareTipsCss');
class ShareTips extends React.Component {
	_cancleShare(){
		if(e_shareTipsCon){
			ReactDOM.unmountComponentAtNode(e_shareTipsCon);
		}
	}
	render() {
		return (
			<div className='shareTips'>
 				<div className="shareBlank"></div>
                <div className="shareCon">
                    <img src={require("shearTopImg")}/>
                    <p className="shearP">点击右上角选择【发送给朋友】或者【分享到朋友圈】</p>
                    <div className="btn" onClick={()=>this._cancleShare()}>知道了~</div>
                </div>
            </div>
		);
	}
}
//对外接口
let e_shareTipsCon = null;
module.exports = {
	show(){
		if(!e_shareTipsCon){
			e_shareTipsCon = document.createElement('div');
			e_shareTipsCon.style.zIndex = 300;
			e_shareTipsCon.style.position = "fixed";
			e_shareTipsCon.style.height = document.body.offsetHeight;
			document.body.appendChild(e_shareTipsCon);
			e_shareTipsCon.addEventListener('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
			e_shareTipsCon.addEventListener('mousemove',function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}
		ReactDOM.render(<ShareTips></ShareTips>,e_shareTipsCon);
	},
	hide(){
		if(e_shareTipsCon){
			ReactDOM.unmountComponentAtNode(e_shareTipsCon);
		}
	}
};


