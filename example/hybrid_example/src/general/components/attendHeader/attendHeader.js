/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-21 11:27:34
* 头部显示栏
*/

'use strict';
require('attendHeaderCss');
let AttendGuide = require("attendGuide");
let classSet = require('classnames');

class AttendHeader extends React.Component {
	constructor(props){
            super(props);
            this.state = {data:null};
        }
        f_attend(){
            this.refs.guide.toggle();
        }
        componentDidMount(){
            Com.getNormal({act:'normal_index',op:'getStoreSubscibeCode',channel:Com.getPageParams("channel")},(ret)=>{
                if(parseInt(ret.code) === 0){
                    if(ret.data.subscribe == 1){
                        return;
                    }
                    this.setState({data:ret.data});
                }
            },true,true);
        }
        render(){
            let data = this.state.data;
            if(!data){
                return null;
            }
            let {wechat_name,headimg} = data;
            return <div className="attendHeader">
                    <AttendGuide ref="guide" data={data}/>
                    <div className="topIntro">
                        <div className="storeInfo">
                            <img src={headimg} onError={(ev)=>ev.target.src=storeDefaultImg}/>
                            <div className="base-fl">
                                {wechat_name}
                            </div>
                        </div>
                        <div className="base-fr myAttendDiv" onClick={()=>this.f_attend()}>
                            <span>关注&nbsp;</span>
                        </div>
                    </div>
                </div>
            ;
        }
}
module.exports = AttendHeader;




