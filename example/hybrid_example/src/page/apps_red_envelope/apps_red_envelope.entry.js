'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("微信红包");
    require("apps_red_envelopeCss");
    let t_h,t_m,t_s,hour,mimute,second,interval;
    let _self = null;
    let btn_style;//按钮样式
    let rid = Com.getPageParams('rid');
    let tipsTitle = "";
    let tipsContent = "";
    let r_color = "";
    let isWordImg = true;
    let WxShare = require('wxShare');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                isShow : false,
            }
        }
        setShowTime() {//倒计时
            second = second - 1;
            if(second<0){
                second = 59;
                mimute = mimute - 1;
                if(mimute<0){
                    mimute = 59;
                    hour = hour - 1;
                    if(hour<0){
                        // if(i_day){
                        //     hour = 23;
                        //     i_day = i_day - 1;
                        //     if(i_day == 0){
                        //         t_d.classList.add("mui-hidden");
                        //         document.getElementById("t_d_info").classList.add("mui-hidden");
                        //     }else if(i_day<0){
                        //         hour = 0;
                        //         mimute = 0;
                        //         second = 0;
                        //         clearInterval(interval);
                        //         window.location.reload();
                        //     }
                        //  }else {
                            hour = 0;
                            mimute = 0;
                            second = 0;
                            clearInterval(interval);
                            window.location.reload();
                        // }
                    }
                }
            }
            t_h.innerText = hour<10?"0"+hour:hour;
            t_m.innerText = mimute<10?"0"+mimute:mimute;
            t_s.innerText = second<10?"0"+second:second;
        }
        calculateTime(time){
            if(time<0 || time < parseInt(new Date().getTime()/1000)){
                return;
            }
            time = time - parseInt(new Date().getTime()/1000);
            hour = parseInt(time/60/60%24);
            mimute = parseInt(time/60%60);//  (time-hour*60*60)/60
            second = parseInt(time%60); //time-hour*60*60-mimute*60
            if(hour>23){
                hour = 24;
            }
            // else {
            //     t_d.classList.add("mui-hidden");
            //     document.getElementById("t_d_info").classList.add("mui-hidden");
            // }
            _self.setShowTime();
            interval = setInterval(function () {
                _self.setShowTime();
            },1000);
        }
        componentDidMount(){
            _self = this;
            if (this.refs.t_h) {
                t_h = this.refs.t_h;
                t_m = this.refs.t_m;
                t_s = this.refs.t_s;
                this.calculateTime(this.props.data.start_time);
            }
        }
        commandInput(){//输入口令
            if (this.refs.commandInput) {
                if (this.refs.commandInput.value == this.props.data.command) {
                    isWordImg = false;
                }else{
                    isWordImg = true;
                }
                this.setState({isShow:false});
            }
        }
        pack(rp_type){
            if (btn_style) {
                if (rp_type === 2) {
                    if (this.refs.commandInput) {
                        if (this.refs.commandInput.value != this.props.data.command) {
                            tipsTitle = "";
                            tipsContent = "口令有误";
                            this.setState({isShow:!this.state.isShow});
                            return;
                        }
                    }
                }
                Com.getNormal({act:"activity_red_envelope",op:"_red_envelope",rid:rid},function(res){
                    tipsTitle = "";
                    if(res.data.succ){
                        r_color = "r_color";
                        tipsTitle = res.data.succ;
                        tipsContent = "";
                    }else{
                        tipsContent = res.msg;
                    }
                    _self.setState({isShow:!_self.state.isShow});
                });
            }else{
                tipsTitle = "";
                tipsContent = "活动还没开始，请耐心等待";
                this.setState({isShow:!this.state.isShow});
            }
        }
        closeTips(){
            this.setState({isShow:!this.state.isShow});
        }
        render(){
            let {rp_type,start_time,status,command} = this.props.data;
            let e_time = <div className="packTime show">
                                <span className="h"><i ref='t_h'>00</i></span>
                                <span className="n_D"><i>时</i></span>
                                <span className="m"><i ref="t_m">00</i></span>
                                <span className="n_D"><i>分</i></span>
                                <span className="s"><i ref="t_s">00</i></span>
                                <span className="n_D"><i>秒</i></span>
                            </div>;
            let title = "";
            let nowTime = parseInt(new Date().getTime()/1000);
            if (parseInt(rp_type) === 1) {//普通红包
                isWordImg = false;
                if (start_time > nowTime) {//还没到时间
                    title = "还剩";
                    btn_style = false;
                }else{
                    title = "时间到";
                    btn_style = true;
                    e_time = <div className="packWriting show"><img src={require('robImg')} /></div>;
                }
            }else{//口令红包
                if (start_time > nowTime) {
                    title = "还剩";
                    isWordImg = true;
                    btn_style = false;
                }else{
                    title = "时间到";
                    btn_style = true;
                    e_time = <div className="packPassword show">
                                <input onChange={()=>this.commandInput()} ref="commandInput" className="password" type="text" placeholder="请输入口令" />
                             </div>;
                }
            }
            if (status || !rp_type) {
                e_time = <div className="packWriting show">活动不存在</div>;
            }
            /*红包提示*/
            let maskStyle = this.state.isShow ? "base-mask" :"base-mask anim";
            let redStyle = this.state.isShow ? "red_tips anim" :"red_tips";
            let e_item = null;
            if (isWordImg) {
                e_item = <div className="wordImg show">
                            <img src={require('robImg')} />
                        </div>;
            }else{
                e_item = <div className={btn_style ? "clickBtn yesBtn" : "clickBtn noBtn"} onClick={()=>this.pack(rp_type)}></div>;
            }
            return (
                <div className="apps_red_envelope">
                    <div className="red_envelopeBg">
                        <div className="red_cont">
                            <h1 className="packTitle">{title}</h1>
                            {e_time}
                        </div>
                        {e_item}
                        <div className={maskStyle}>
                            <div className={redStyle}>
                                <h2>消息提示 <img className="tipsClose" src={require('tips_closeImg')}  onClick={()=>this.closeTips()} /></h2>
                                <div className="tips_cont">
                                    <h3 className={r_color}>{tipsTitle}</h3>
                                    <p>{tipsContent}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"activity_red_envelope",op:"_on_time",rid:rid},function(res){
        if(res.code === 0){
            var shareParams = {title: "微信抢红包", desc:"微信抢红包", imgUrl: "",
                        baseURL: document.location.href+"&channel=21"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
