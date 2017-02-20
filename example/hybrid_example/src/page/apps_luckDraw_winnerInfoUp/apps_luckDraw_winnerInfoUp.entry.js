/*
 * @Author: 黄权
 * @Date:   2016-11-9 10:52:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-11-29 15:45:03
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("中奖详情");
    require("apps_luckDraw_winnerInfoUpCss");
    let LabelInput = require('labelInput');
    let BlockBtn = require('blockBtn');
    let member_id = Com.getCookie("member_id");
    let LuckDetail = require('luckDetail');
    let i_drawId = Com.getPageParams("id");
    let winnerId = Com.getPageParams("winnerId");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        f_submit(){
            let {name,phone,address} = this.refs;
            if(!name.getValue()){
                return Com.toast("请输入你的姓名");
            }
            if(!Com.checkMobile(phone.getValue())){
                return Com.toast("请输入正确的手机号");
            }
            if(!address.getValue()){
                return Com.toast("请输入您的地址");
            }
            Com.postNormal({act:"activity_luck",op:"applySubmit",id:i_drawId,memberId:member_id,winnerId:winnerId,
                receiveName:name.getValue(),receiveMobile:phone.getValue(),receiveAddress:address.getValue()},(res)=>{
                    if(parseInt(res.code) === 0){
                        let {msg,type} = res.data;
                        Com.sendEvt('apps_luckDraw_winnerInfoUp',{b_update:1});
                        Com.toast(msg,()=>{
                            Com.closeWin();
                        },3,1);
                    }else{
                        Com.toast(res.msg);
                    }
            });
        }
        render(){
            let {intro} = this.props.data;
            return (
                <div className="apps_luckDraw_winnerInfoUp">
                    <div className="infoTips ">ps：请填写您的基本信息，方便我们寄出奖品。</div>
                    <LabelInput s_left={"姓名："} ref="name" s_right={"请输入您的姓名"} b_isInput={true} b_line={true} />
                    <LabelInput s_left={"手机："} ref="phone" s_right={"请输入您的手机"} b_isInput={true} b_line={true} />
                    <LabelInput s_left={"地址："} ref="address" s_right={"请输入您的地址"} b_isInput={true} />
                    <BlockBtn s_label={"提交信息"} onClick={()=>this.f_submit()}/>
                    <section className="base-mT10">
                        <LuckDetail data={intro}/>
                    </section>
                </div>
             );
        }
    };
    //请求数据
    Com.postNormal({act:"activity_luck",op:"apply",id:i_drawId,memberId:member_id,winnerId:winnerId},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
