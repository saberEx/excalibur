'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("扫码");
    require("member_scan_codeCss");
    let cardCode = Com.getPageParams("card_code");
    let tipsStr = '很抱歉，获取二维码失败，请<em>刷新重试</em>';
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {qrcode:this.props.data.qrcode};
        }
        closeClick(){
            Com.closeWin();
        }
        _errorHandler(e){
            this.setState({qrcode:""});
        }
        _refreshHandler(){
            Com.reload();
        }
        render(){
            let {card_code} = this.props.data;
            let {qrcode} = this.state;
            let e_code = null;
            if(!qrcode){
                e_code = <div className="er_code" onClick={this._refreshHandler} dangerouslySetInnerHTML={{__html: tipsStr}}></div>;
            }else{
                e_code = <img src={qrcode} onError={(e)=>this._errorHandler(e)}/>;
            }
            return (
                <div className="scan_code">
                    <div className="page_tips" onClick={this.closeClick}>
                        当前二维码
                    </div>
                    {e_code}
                    <div className="card_wrap">
                        <p>{card_code}</p>
                        会员卡号 
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"member_wx_card",op:"qrcode",card_code:cardCode},(res)=>{
        if(res.code === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
