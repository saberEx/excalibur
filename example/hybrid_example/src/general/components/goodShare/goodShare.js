 //拼团分享浮层
'use strict';
require('goodShareCss');
class GoodShare extends React.Component{
    constructor(props){
        super(props);
        this.state = {isShow:this.props.isShow};
    }
    static defaultProps = {
        isShow:false,//是否显示
        i_number:0
    }
    open(){
        this.setState({isShow:true});
    }
    toogleFX(){
        this.setState({isShow:!this.state.isShow});
    }
    render(){
    	let {i_number} = this.props;
        let {isShow} = this.state;
    	var ishowcss=  isShow ? 'GoodShare_wrap' :'GoodShare_wrap shide';
        return(
            <div className={ishowcss} onClick={()=>this.toogleFX()}>
                <img src={require("e5d91dImg")} alt="" />
                <div className="cont_wrap">
	                <p className="tips">点击右上角发送给朋友</p>
	                <p>还差<span className="p_number">{i_number}</span>人就<span className="t_success">完成拼团</span></p>
                </div>
            </div>
        );

    }
}
module.exports = GoodShare;
