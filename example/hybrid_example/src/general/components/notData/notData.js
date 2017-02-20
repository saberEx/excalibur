/*
* @Author: 代汉桥
* @Date:   2016-10-18 13:57:35
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-19 16:12:35
*/

'use strict';
require('notDataCss');
let shop_id = Com.getPageParams('shop_id') || 0;
let store_alias = Com.getPageParams('store_alias') || "";
let s_logo_string = "STORE_LOGO_BLANK_"+store_alias+shop_id;
let no_detailImg = require('icon_data_emptyImg');
class NotData extends React.Component {
    constructor(props){
        super(props);
        this.state = {imgUrl:this.props.imgUrl};
    }
    static defaultProps = {
        imgUrl:"", //logo
        s_content:"暂无数据", // 提示文字
        s_btn:"去逛逛",  //按钮文字
        b_isLogo:false, //是否是请求公共logo
        link:"index", //点击按钮跳转的链接
        b_needBtn:false  //是否需要按钮
    }
    componentDidMount(){
        let {b_isLogo} = this.props;
        if(b_isLogo){
            let s_logoUrl = Com.getLocalData(s_logo_string);
            if(!s_logoUrl){
                Com.getNormal({act: 'store_logo', op: 'get_logo'},(res)=>{
                    if(parseInt(res.code) === 0){
                        Com.setLocalData(s_logo_string,res.data);
                        this.setState({imgUrl:res.data});
                    } else {
                        this.setState({imgUrl:no_detailImg});
                    }
                },true);
            }else {
                this.setState({imgUrl:s_logoUrl});
            }
        }else {
            if(!this.props.imgUrl){
                this.setState({imgUrl:no_detailImg});
            }
        }
    }
    f_btn(){
        let {link} = this.props;
        Com.openWin("main",{shop_id:shop_id,redirect:"./index.html"});
    }
	render() {
		let {s_content,s_btn,b_needBtn} = this.props;
        let {imgUrl} = this.state;
        let e_btn = b_needBtn?<button onClick={()=>this.f_btn()}>{s_btn}</button>:null;
		return (
			<div className="notData">
                <div>
                    <img src={imgUrl} onError={(ev)=>ev.target.src=no_detailImg}/>
                    <p>{s_content}</p>
                    {e_btn}
                </div>
            </div>
		);
	}
}
module.exports = NotData;




