/*
* @Author: 代汉桥
* @Date:   2016-07-28 09:19:59
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-12-06 17:11:11
* 会员卡
*/
'use strict';
require("memberItemCss");

class MemberItem extends React.Component {
        static proptypes = {
            s_cardName:React.PropTypes.string,//会员卡名称
            s_storeName:React.PropTypes.string,//店铺名称
            s_cardCode:React.PropTypes.string,//会员卡号
            i_balance:React.PropTypes.number,//余额
            s_qrcode:React.PropTypes.string,//二维码
            s_icon:React.PropTypes.string,//图标
            f_callBack:React.PropTypes.func,//点击回调
            f_erCodeBack:React.PropTypes.func,//二维码回调
            s_background:React.PropTypes.string,//背景颜色
        }
        f_onClick(e){
            this.props.f_callBack && this.props.f_callBack(this.props.s_cardCode);
            e.stopPropagation();
        }
        f_erClick(e){
            this.props.f_erCodeBack && this.props.f_erCodeBack(this.props.s_cardCode);
            e.stopPropagation();
        }
        render(){
            let {s_cardName,s_storeName,s_cardCode,i_balance,s_qrcode,s_icon,s_background} = this.props;
            return (
                <div className="memberItem" onClick={(e)=>this.f_onClick(e) } style={{background:s_background}}>
                    <div className="card_wrap">
                        <img src={s_icon} alt="" />
                        <div className="mermber_info">
                            <p className="carName">{s_cardName}</p>
                            <p>{s_storeName}</p>
                        </div>
                    </div>
                    <div className="card_number">
                        {s_cardCode}
                    </div>
                    <div className="card_price base-tr">
                        <span>余额：</span>
                        <span className="price"><em>￥</em>{i_balance}</span>
                    </div>
                    <img className="qrcode" src={s_qrcode} alt="" onClick={(e)=>this.f_erClick(e)}/>
                </div>
             );
        }
    };
module.exports = MemberItem;
