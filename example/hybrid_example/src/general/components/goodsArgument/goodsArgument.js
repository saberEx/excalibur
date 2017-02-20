/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-16 14:45:21
*/

'use strict';
require('goodsArgumentCss');

class GoodsArgument extends React.Component {
	onClick(){
		this.props.onClick && this.props.onClick();
	}
	render() {		
		let item = "";
		if(this.props.b_psfs){
			item = <div className="argument base-iconRight" onClick={()=>this.onClick()}>
						<span className="aName">{this.props.s_left}</span>
		                <div className="aParameter">
		                	<div className="psfs">
                                {this.props.a_right?this.props.a_right.map((item,key)=>{
                                    return <span key={key}>{item}</span>;
                                }):null}
		                	</div>
		                </div>
					</div>;
		}else{
			item = <div className="argument">
		                <span className="aName">{this.props.s_left}</span>
		                <div className="aParameter">
		                    {this.props.s_right}
                            {this.props.s_subRight?<div>{this.props.s_subRight}</div>:null}
		                </div>
		            </div>;
		}
		return (
			<div>
                {item}
            </div>
		);
	}
}
module.exports = GoodsArgument;




