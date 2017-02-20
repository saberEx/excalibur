//关注提示
'use strict';
require('attendGuideCss');

class AttendGuide extends React.Component{
    constructor(props){
        super(props);
        this.state = {b_show:false};
        this.toggle = ()=>{this.setState({b_show:!this.state.b_show})};
    }
    render(){
        let {b_show} = this.state;
        let {img,wechat_name} = this.props.data;
        let e_content = null;
        if(Com.b_wechat){
            e_content = <div className="tips-cont">
                            <h3 className="tips-title">关注</h3>
                            <p>&nbsp;</p>
                            <p className="tips">请长按图片识别二维码</p>
                            <img src={img}  />
                            <div className="close_btn" onClick={()=>this.toggle()}>
                                <img  src={require("tips_closeImg")} alt=""/>
                            </div>
                        </div>;
        }else{
            e_content = <div className="tips-cont">
                            <h3 className="tips-title">关注后更好享受服务</h3>
                            <ul>
                                <li>
                                    <p>进入微信，在微信“通讯录”点击右上角+ <img src={require("subscibeAddFImg")} /></p>
                                    <p>搜索微信号：<code>{wechat_name}</code></p>
                                </li>
                                <li>
                                    <p>点击 详细资料 页面底部的 关注</p>
                                    <div className="follow">关注</div>
                                </li>
                            </ul>
                            <div className="close_btn" onClick={()=>this.toggle()}>
                                <img  src={require("tips_closeImg")} alt=""/>
                            </div>
                        </div>
        }
        return(
            <div className={`attendGuide ${b_show?"":"base-hide"}`}>
                <div className="layerBg"></div>
                <div className="layerCont">
                    {e_content}
                </div>
            </div>
        );
    }
}

module.exports = AttendGuide;
