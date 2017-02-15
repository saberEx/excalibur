/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-26 09:24:56
* 拨打电话组件
*/

'use strict';
class CallEl extends React.Component{
    static propTypes = {
        mobile:React.PropTypes.string.isRequired,
    }
    callPhone(e){
        if(this.props.mobile){
            if (this.props.mobile != 0) {
                Base.call(this.props.mobile);
                e.stopPropagation();
            }
        }
    }
    _stopHandler(e){
        e.stopPropagation();
    }
    render(){
        let el = null;
        if(Base.isApp){
            el = <a className='callEl' onClick={this.callPhone.bind(this)}>
                {this.props.children}
            </a>;
        }else{
            let s_mobile = this.props.mobile;
            if(s_mobile){
                el = <a className='callEl' href={"tel:"+s_mobile} onClick={this._stopHandler.bind(this)}>
                    {this.props.children}
                </a>;
            }else{
                el = <a className='callEl'>
                    {this.props.children}
                </a>;
            }
        }
        return  el;
    }
}
module.exports = CallEl;
