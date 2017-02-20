/*
 * @Author: 程矩龙
 * @Date:   2016-10-25 16:07:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-10-27 17:16:00
 */
'use strict';
require('minListCss'); 
var HotImg = require('hotIconImg');
var MinList = React.createClass({ 
     propTypes: {
        // 可以声明 prop 为指定的 JS 基本类型。默认
        // 情况下，这些 prop 都是可传可不传的。 
        is_Img: React.PropTypes.bool, 
    },
    onHandle:function(tid){
        Com.openWin("apps_bbs_detail",{tid:tid});
    },
	render:function(){
        //console.log(this.props.listIndex);
        let {is_Img,data,b_posts} = this.props;
        if(!(data && data.length>0)){
            return null;
        }
        let listItem = null;
        var c_ls = this.props.is_Img ? "listUl beforeImg":"listUl circle";
        if(is_Img){
            listItem = data.map((res,key)=>{
                let {tid,subject} = res;
                return <li className="listItem base-after-line" key={key} onClick={()=>this.onHandle(tid)}>
                    <img src={HotImg} /><a className="base-ellipsis">{subject}</a></li>;
            });
        }else{
            if(b_posts){
                listItem = data.map((res,key)=>{
                    let {tid,content} = res;
                    return <li className="listItem base-after-line" key={key} onClick={()=>this.onHandle(tid)}>
                        <a className="base-ellipsis"  dangerouslySetInnerHTML={{__html:content}} />
                    </li>;
                });
            }else{
                listItem = data.map((res,key)=>{
                    let {tid,subject} = res;
                    return <li className="listItem base-after-line" key={key} onClick={()=>this.onHandle(tid)}>
                        <a className="base-ellipsis">{subject}</a>
                    </li>;
                });
            }
        }
		return (
			<div>			  	
                <ul className={c_ls}>
                    {listItem}
                </ul>
			</div>
		);
	}
});
module.exports = MinList;
