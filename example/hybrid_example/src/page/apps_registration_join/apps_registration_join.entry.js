/*
 * @Author: 黄权
 * @Date:   2016-11-9 17:36:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 10:56:41
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("微活动报名");
    require("apps_registration_joinCss");
    let LabelInput = require('labelInput');
    let i_id = Com.getPageParams("id");
    let WxShare = require('wxShare');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        f_submit(){
            let a_value = [];
            for(let i=0;i<6;i++){
                if(this.refs["input_"+i]){
                    a_value[i] = this.refs["input_"+i].getValue();
                }else{
                    a_value[i] = "";
                }
            }
            Com.postVerify({act:"apps_wei",op:"applySubmit",id:i_id,memberId:Com.getCookie("member_id"),username:a_value[0],
                phone:a_value[1],email:a_value[2],qqnumber:a_value[3],wxnumber:a_value[4],companyname:a_value[5]},(res)=>{
                if(parseInt(res.code) === 0){
                    Com.toast("报名成功",()=>{
                        Com.closeWin();
                    },3,1);
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {email,qq_num,qy_name,wx_num} = this.props.data;
            return (
                <div className="apps_registration_join">
                    <LabelInput ref="input_0" s_left="姓名：" s_right="请输入姓名" b_isInput={true} b_line={true}/>
                    <LabelInput ref="input_1" s_left="手机号码：" s_right="请输入您的手机号码" b_isInput={true} b_line={true}/>
                    {email ==1?<LabelInput ref="input_2" s_left="邮箱：" s_right="请输入您的邮箱" b_isInput={true} b_line={true}/>:null}
                    {qq_num ==1?<LabelInput ref="input_3" s_left="QQ号码：" s_right="请输入您的QQ号码" b_isInput={true} b_line={true}/>:null}
                    {wx_num ==1?<LabelInput ref="input_4" s_left="微信号：" s_right="请输入您的微信号" b_isInput={true} b_line={true}/>:null}
                    {qy_name ==1?<LabelInput ref="input_5" s_left="企业名称：" s_right="请输入您的企业名称" b_isInput={true} b_line={true}/>:null}
                    <div className="join_Btn" onClick={()=>{this.f_submit()}}>
                        <a href="javascript:void(0);" className="base-btn r_btn">报名</a>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.getVerify({act:"apps_normal",op:"weibaoApply",id:i_id},function(res){
        if(parseInt(res.code) === 0){
            var shareParams = {title: "微活动报名", desc:"来报名参加微活动吧", imgUrl: "", baseURL: document.location.href+"&channel=15"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
