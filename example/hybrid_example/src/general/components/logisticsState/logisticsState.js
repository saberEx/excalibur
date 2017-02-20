/*
* @Author: 卢旺
* @Date:   2016-08-18 09:28:01
* @Last Modified by:   卢旺
* @Last Modified time: 2016-12-05 14:49:59
* 根据传入的参数显示对应的物流信息
*/

'use strict';
require("logisticsStateCss");
let CallEl = require('callEl');
class LogisticsState extends React.Component{
    static propTypes = {
        i_method:React.PropTypes.number.isRequired,//配送方式 店员配送0，物流配送1，自提3
        //物流状态 未发货0，店员配送发货中1，店员配送已签收\自提已签收2，自提待备货3，自提未备货4，待自提5，
        i_state:React.PropTypes.number.isRequired,
        s_state:React.PropTypes.string,//物流状态
        s_manInfo:React.PropTypes.string,//配送员信息
        i_phone:React.PropTypes.string,//配送员电话
        s_time:React.PropTypes.string,//配送、签收、物流时间
        s_info:React.PropTypes.string,//物流信息
        i_zitiNum:React.PropTypes.number,//自提码
        s_erCode:React.PropTypes.string,//二维码
        f_callBack:React.PropTypes.func,//物流配送时点击查看
    }
    handleClick(){
            document.querySelector(".base-mask").style.display="block";
    }
    closeBtn(){
        document.querySelector(".base-mask").style.display="none";
    }
    wlClick(){
        this.props.f_callBack && this.props.f_callBack();
    }
    render(){
        let {i_method,i_state,s_state,s_manInfo,s_time,s_info,i_zitiNum,s_erCode,i_phone} = this.props;
        let info = [];
        if (s_info) {
            info = s_info.split("&nbsp;&nbsp;");
        }else{
            info= null;
        }
        let dyItem = <div>
                            <p className="d">配送员：<em >{s_manInfo}</em></p>
                            <p className="d">{i_state===1 ? '配送时间：' :'验证时间：'}<em >{s_time}</em></p>
                            <CallEl mobile={i_phone}>
                                <img className="codeImg" src={require('store_phoneImg')} alt=""/>
                            </CallEl>
                    </div>;
        let dyPart = <div className="record_warp">
                            <p className="d">物流状态：{s_state}</p>
                            {i_state===1 ? dyItem : null}
                     </div>;
        let wlItem = <div>
                            <div>
                                {info ? info[1] : "暂无"}
                            </div>
                            <p>{info ? info[0] : ""}</p>
                     </div>;
        let wlPart = <div className="record_warp" onClick={this.wlClick.bind(this)}>
                        { wlItem}
                     </div>;

        let dztItem = <div>
                            <p className="d">自提号：<em className="c_r">{i_zitiNum}</em></p>
                            <img className="codeImg" onClick={this.handleClick.bind(this)} src={s_erCode}  alt=""/>
                            <div className="base-mask">
                                <div className="imgFixed">
                                    <img src={s_erCode} alt=""/>
                                    <span onClick={this.closeBtn.bind(this)}>X</span>
                                </div>
                            </div>
                      </div>;
        let ztItem = <div>
                            <p className="d">自提号：<em className="c_r">{i_zitiNum}</em></p>
                            <p className="d">签收时间：<em >{s_time}  (扫描签收/店员签收)</em></p>

                     </div>;
        let ztPart = <div className="record_warp">
                            <p className="d">物流状态：{s_state}</p>
                            {i_state===5 ? dztItem : null}
                            {i_state===2 ? ztItem : null}
                     </div>;

        let items;
        if(i_method===0){
            items = wlPart;
        }else if(i_method===1){
            items = dyPart;
        }else{
            items = ztPart;
        }
        return(
            <div>
                {items}
            </div>

        );
    }
}
module.exports = LogisticsState;
