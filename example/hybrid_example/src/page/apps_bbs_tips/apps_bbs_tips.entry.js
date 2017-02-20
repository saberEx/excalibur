/*
 * @Author: 黄权
 * @Date:   2016-11-2 10:07:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-11-2 10:20:00
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("发帖成功");
    require("apps_bbs_tipsCss");
    var TipsImg = require('tipsImg');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {i_time:3};
        }
        componentDidMount(){
            this._interval = setInterval(()=>{
                let {i_time} = this.state;
                if(i_time === 0){
                    window.clearInterval(this._interval);
                    Com.openWin("apps_bbs_index");
                }else {
                    this.setState({i_time:i_time-1});
                }
            },1000);
        }
        render(){
            let {i_time} = this.state;
            return (
                <div className="apps_bbs_tips">
                    <img src={TipsImg} alt="" />
                    <p className="tipsTitle">
                        您的帖子提交成功
                    </p>
                    <p>{i_time}秒后自动跳转到首页</p>
                </div>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"apps_bbs_tips",op:"apps_bbs_tips"},function(res){
    //     if(res.code === 0){
            ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});