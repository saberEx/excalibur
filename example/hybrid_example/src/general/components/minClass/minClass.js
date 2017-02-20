/*
 * @Author: 程矩龙
 * @Date:   2016-10-25 16:07:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-10-27 15:34:00
 */
'use strict';
require('minClassCss'); 
class  MinItem extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentIndex:0
        }
    }
    handleClick(index,fid){
        this.setState({currentIndex:index});
        this.props.onClick && this.props.onClick(fid);
    }
	render(){
        let {data} = this.props;
        let {currentIndex} = this.state;
        let a_list = [{fid:-1,fname:"全部"},...data];
        let e_li = a_list.map((item,key)=>{
            let {fname,fid} = item;
            return <li key={key} className={`${key === currentIndex?"active":""}`} onClick={()=>{this.handleClick(key,fid)}}>
                        <div>{fname}</div>
                    </li>;
        });
		return (
			<div>			  	
                <ul className="classList">
                    {e_li}
                </ul>
			</div>
		);
	}
};
module.exports = MinItem;
