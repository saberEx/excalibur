/*
 * @Author: 卢旺
 * @Date:   2016-11-24 10:00:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-06 10:17:12
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("我要参选");
    require("apps_payvote_runningCss");
    let Config = require(__CONFIG__);
    let VoteHeader = require('voteHeader');
    let roundid = Com.getPageParams('roundid');
    let logoFile = "";
    let WxShare = require('wxShare');
    let self = null;
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            self = this;
            this.state = {
                logo : "",
            }
        }
        componentDidMount(){
            if(this.refs.phone){
                this.refs.phone.setSelectionRange = null;
            }
        }
        addImg(e){
            let files = e.target.files;
            if(files && files.item(0)){
                var file = files.item(0);
                if((/^image\/.*$/i.test(file.type))){
                    var freader = new FileReader();
                    freader.readAsDataURL(file);
                    logoFile = 1;
                    freader.onload=function(e){
                        Com.sendFile({act:"pay_vote",op:"pic_upload",roundid:roundid,logourl:file},(res)=>{
                            console.log("提交",res);
                            if(parseInt(res.code) === 0){
                                logoFile = res.url;
                            }
                        },true);
                        self.setState({logo:e.target.result});
                    }
                }
            }
        }
        submit(){
            let oname = this.refs.oname.value;
            let introduce = this.refs.introduce.value;
            let phone = this.refs.phone.value;
            let weburl = this.refs.weburl.value;
            if(!logoFile){
                return Com.toast("请先上传企业logo");
            }
            if(logoFile === 1){
                return Com.toast("图片还在上传中");
            }
            if(!oname){
                return Com.toast("名称不能为空");
            }
            if(!introduce){
                return Com.toast("简介不能为空");
            }
            if(!phone){
                return Com.toast("请填写正确的手机号码");
            }
            if (!Com.checkMobile(phone)) {
                return Com.toast("手机号码格式不正确");
            }
            Com.postNormal({act:'pay_vote',op:'join',roundid:roundid,oname:oname,introduce:introduce,phone:phone,
                logourl:logoFile,weburl:weburl},(res)=>{
                if(res.code==0){
                    Com.toast(res.msg,()=>{
                        Com.openWin("apps_payvote_ranking",{roundid:roundid});
                    },3,2);
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        render(){
            let {title} = this.props.data;
            let img_item = null;
            if (this.state.logo) {
                img_item = <div className="upload">
                              <img className="uploadImg" src={this.state.logo} alt=""/>
                           </div>;
            }else{
               img_item = <div>
                            <input className="multiPic" onChange={(e)=>this.addImg(e)} type="file" id="logoUpload" value="" />
                            <div className="upload">
                                <p>点击<br />上传企业LOGO<br />500K以内</p>
                            </div>
                           </div>;
            }
            return (
                <div className="apps_payvote_running">
                    <VoteHeader title={title}/>
                    <div className="baomin_box">
                        <p className="line"></p>
                        <span>企业报名通道</span>
                    </div>
                    <div className="upload_logo_box">
                        {img_item}
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <input ref="oname" type="text" className="form-control" placeholder="填写企业/品牌名称" />
                        </div>
                        <div className="form-group">
                            <textarea ref="introduce" className="form-control" rows="5" placeholder="填写企业/品牌简介"></textarea>
                        </div>
                        <div className="form-group">
                            <input ref="phone" type="tel" className="form-control" placeholder="填写企业/品牌联系人手机号" />
                        </div>
                        <div className="form-group">
                            <input ref="weburl" type="text" className="form-control" placeholder="填写企业/品牌网址" />
                        </div>
                        <div className="form-group">
                            <a onClick={()=>this.submit()} className="btn_submit">提交</a>
                        </div>
                    </div>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:'pay_vote',op:'round',roundid:roundid},function(res){
        if(parseInt(res.code) === 0){
            let data = res.data.round;
            var shareParams = {title: data.title, desc:data.rule, imgUrl: "",
                        baseURL: document.location.href+"&channel=17"};
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
