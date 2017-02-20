/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-13 11:34:10
*/

'use strict';
require('ruleCss');
class AddRess extends React.Component {
	closeTips(){
        this.props.closeTips();
    }
	render() {
		let {isBlock,data} = this.props;
		let maskBlock = isBlock ? "base-mask" :"base-mask anim"; // 规则
        let redStyle = isBlock ? "red_tips anim" :"red_tips";
		let e_cont = null;
		e_cont = data.map((item,key)=>{
			let {title,content} = item;
			let e_list = null;
			if(typeof(content) === "object" && content.length>0){
				e_list = content.map((item1,key1)=>{
					let {levelName,quantity,reawardName} = item1;
					return <p key={key1}>{`${levelName}：${reawardName},数量：${quantity}`}</p>
				});
			}else {
				e_list = <p>{content}</p>
			}
			return <div key={key} className="contItem">
						<h3 className="r_color">{title}</h3>
						{e_list}
					</div>;
		});
        return (
            <div className={maskBlock}>
                <div className={redStyle}>
                    <h2>活动规则 <img className="tipsClose" src={require('tips_closeImg')}  onClick={()=>this.closeTips()} /></h2>
                    <div className="tips_cont">
						{e_cont}
                    </div>
                </div>
            </div>
         );
	}
}
module.exports = AddRess;




