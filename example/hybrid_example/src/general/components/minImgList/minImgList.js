/*
 * @Author: 程矩龙
 * @Date:   2016-10-25 16:07:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-10-27 14:00:00
 */
'use strict';
// require('minListCss');
let commonDefaultImg = require('commonDefaultImg');
let MinImgList = React.createClass({
    onHandle:function(){
        //Com.openWin("detail",{testAbc:JSON.stringify(this.props.listIndex)});
    },
	render:function(){
        let {imgList} = this.props;
        let listItem = null;
        if(imgList && imgList.length>0){
            listItem = imgList.map((res,key)=>{
                return <li key={key} ><img src={`${Com.UPLOAD_PATH}/bbsimg/${res}`}  onError={(ev)=>{ev.target.src=commonDefaultImg}}/></li>;
            });
        }else {
            return null;
        }
		return (
			<div>			  	
                <ul className="cardPhotoList tree">
                    {listItem}
                </ul>
			</div>
		);
	}
});
module.exports = MinImgList;
