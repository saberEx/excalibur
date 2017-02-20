/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   黄权
* @Last Modified time: 2016-12-09 17:12:16
*/

'use strict';
require('starCss');

class Star extends React.Component {
	f_change(value){
		this.props.onClick && this.props.onClick(value);
	}
	render() {
		let forName = this.props.forName;

		return (
			<div className="starManage">
                <div id="starBg" className="star_bg">                    	
				    <input onChange={(ev)=>this.f_change(ev.target.value)} type="radio" id={forName+'1'} className="score score_1" value="1" name={forName} />
				    <a href={'#'+forName+'1'} className="star star_1" title="差"><label htmlFor={forName+'1'}>差</label></a>
				    <input onChange={(ev)=>this.f_change(ev.target.value)} type="radio" id={forName+'2'} className="score score_2" value="2" name={forName} />
				    <a href={'#'+forName+'2'} className="star star_2" title="较差"><label htmlFor={forName+'2'}>较差</label></a>
				    <input onChange={(ev)=>this.f_change(ev.target.value)} type="radio" id={forName+'3'} className="score score_3" value="3" name={forName} />
				    <a href={'#'+forName+'3'} className="star star_3" title="普通"><label htmlFor={forName+'3'}>普通</label></a>
				    <input onChange={(ev)=>this.f_change(ev.target.value)} type="radio" id={forName+'4'} className="score score_4" value="4" name={forName} />
				    <a href={'#'+forName+'4'} className="star star_4" title="较好"><label htmlFor={forName+'4'}>较好</label></a>
				    <input onChange={(ev)=>this.f_change(ev.target.value)} type="radio" id={forName+'5'} className="score score_5" value="5" name={forName} />
				    <a href={'#'+forName+'5'} className="star star_5" title="好"><label htmlFor={forName+'5'}>好</label></a>
				</div>               
            </div>
		);
	}
}
module.exports = Star;




