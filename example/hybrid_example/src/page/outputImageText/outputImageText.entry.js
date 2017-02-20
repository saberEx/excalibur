/*
 * @Author: 黄权
 * @Date:   2017-01-04 11:52:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2017-01-04 16:30:09
 * 微信图文页
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("微信图文");
    require("outputImageTextCss");
    require("rich_textCss");
    let i_id = Com.getPageParams("id");
    let store_alias = Com.getPageParams("store_alias");
    let i_index = Com.getPageParams()["index"] || 0;
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {data:null};
        }
        componentDidMount(){
            Com.getJsonP({act:"custom",op:"media",id:i_id,store_alias:store_alias},(data)=>{
                let {list=[],wechat} = data;
                if(!list[i_index]){
                    Com.toast("页面参数有误");
                    return null;
                }
                if(list[i_index].documentTitle){
                    document.title = list[i_index].documentTitle;
                }
                if(Com.getBrowserType() === 0){
                    document.querySelector("html").style.fontSize = '37.5px';
                }
                this.setState({data:data});
            });
        }
        render(){
            let {data} = this.state;
            if(!data){
                return null;
            }
            let {list,wechat={}} = data;
            let {author,digest="",mainImageUrl,mainText,title,url,urlTitle,editTime,isShowInMainText} = list[i_index];
            let b_isPc =  Com.getBrowserType() === 0;
            return (
                <div className={`outputImageText ${b_isPc?"pc-con":""}`}>
                    <div className="main-content">
                        <div className="con-field">
                            <div className="appmsg">
                                <h4 className="title">{title}</h4>
                                <p className="meta"> <span>{editTime}</span> <a className="rich_media_meta">{author}</a> </p>
                                {isShowInMainText?<div className="appmsg-thumb-wrap"><img src={mainImageUrl}/></div>:null}
                                <div className="appmsg-digest">{digest}</div>
                            </div>
                        </div>
                        <div className="con-field rich_text">
                            <div className="custom-richtext custom-richtext" dangerouslySetInnerHTML={{__html:mainText}}></div>
                        </div>
                        {url?<div className="con-field">
                            <a className="meta_primary" href={url}>阅读原文</a>
                        </div>:null}
                        <div className={`qCode ${b_isPc?"":"base-hide"}`}>
                            <h3>手机扫码访问</h3>
                            <hr />
                            <p>微信“扫一扫”分享到朋友圈</p>
                            <img width="158" height="158" src={wechat.qrcode}/>
                        </div>
                    </div>
                </div>
             );
        }
    };
    //请求数据
   ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
});