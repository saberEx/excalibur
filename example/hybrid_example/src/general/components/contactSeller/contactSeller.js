/*
 * @Author: 黄权
 * @Date:   2016-12-03 17:14:59
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-03 17:40:17
 * 联系专家层
 */
'use strict';
require("contactSellerCss");
let e_contactSeller = null;
class ContactSeller extends React.Component{
    f_close(){
        if(e_contactSeller){
            ReactDOM.unmountComponentAtNode(e_contactSeller);
        }
    }
    render(){
        return (
            <div className="contactSeller">
                <div className="sellerImg">

                    <p className="close"> 
                        <img className="closeBtn" onClick={()=>this.f_close()} src={require("tips_closeImg")}/>
                    </p>
                    <p className="prevx mt0">
                        <img src={require("contactSeller_2Img")}/>
                    </p>
                    <p>
                        <img src={require("contactSeller_3Img")} />
                    </p>
                    <p className="prevx">
                        <img src={require("contactSeller_1Img")} />
                    </p>
                    <p>
                        <img src={require("contactSeller_4Img")} />
                    </p>
                    <div className="qrcode">
                        <p>长按二维码，快速返回店铺公众号</p>
                        <img src={this.props.s_qrCode}/>
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = {
    show(s_qrCode){
        if(!e_contactSeller){
            e_contactSeller = document.createElement('div');
            document.body.appendChild(e_contactSeller);
            e_contactSeller.addEventListener('touchmove',function(e){
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            e_contactSeller.addEventListener('mousemove',function(e){
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
        }
        ReactDOM.render(<ContactSeller s_qrCode={s_qrCode}/>,e_contactSeller);
    },
    hide(){
        if(e_contactSeller){
            ReactDOM.unmountComponentAtNode(e_contactSeller);
        }
    }
};