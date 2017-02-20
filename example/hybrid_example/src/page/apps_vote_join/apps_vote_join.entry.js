/*
 * @Author: 卢旺
 * @Date:   2016-11-24 10:00:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-05 15:19:28
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("投票报名");
    let id = Com.getPageParams('id');
    let ApposeFixedBtn = require('apposeFixedBtn');
    let VoteForm = require('voteForm');
    let BlockBtn = require('blockBtn');
    let LabelInput = require('labelInput');
    let Radio = require('radio');
    require("apps_vote_joinCss");
    let name,sex,phone,age,work,area,info;
    let _self = null;
    let _imgList = [];
    let _fileList = [];
    let fileState = 0;
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            _self = this;
            this.state = {
                imgList : [],
                isAdd: true,
            }
        }
        _clickLeft(){
            Com.openWin("apps_vote_index",{id:id});
        }
        _clickRight(){
            Com.openWin('apps_vote_explain',{id:id});
        }
        _submit(){
            let {formRequireAge,formRequireArea,formRequireIntro,formRequireJob,formRequireSex,formRequireMinPic,is_applay} = this.props.data;
            if(parseInt(is_applay)===1){
                return ;
            }
            name = this.refs.name ? this.refs.name.getValue() : "";
            phone = this.refs.phone ? this.refs.phone.getValue() : "";
            age = this.refs.age ? this.refs.age.getValue() : "";
            work = this.refs.work ? this.refs.work.getValue() : "";
            area = this.refs.area ? this.refs.area.getValue() : "";
            info = this.refs.info ? this.refs.info.getValue() : "";
            if(!name){
                return Com.toast("请输入您的姓名");
            }
            if(parseInt(formRequireSex) === 2 && !sex){
                return Com.toast("请选择您的性别");
            }
            if(!phone){
                return Com.toast("请输入您的手机号码");
            }else {
                if(!Com.checkMobile(phone)){
                    return Com.toast("手机号码格式不正确");
                }
            }
            if (_fileList.length < parseInt(formRequireMinPic)) {
                return Com.toast("最少上传"+formRequireMinPic+"张图片，谢谢配合");
            }
            if (fileState === 1) {
                return Com.toast("图片还在上传中");
            }
            if(formRequireAge==2 && !age){
                return Com.toast("请输入您的年龄");
            }
            if(formRequireJob==2 && !work){
                return Com.toast("请输入您的职业");
            }
            if(formRequireArea==2 && !area){
                return Com.toast("请输入您的区域");
            }
            if(formRequireIntro==2 && !info){
                return Com.toast("请输入您的简介");
            }
            let o_param = {id:id,name:name,mobile:phone,age:age,job:work,area:area,intro:info,sex:sex,imgList:_fileList};
            Com.postVerify({act:"apps_vote",op:"applySubmit",...o_param},function(res){
                if(parseInt(res.code) === 0){
                    _fileList = [];
                    Com.openWin('apps_vote_userInfo',{id:res.data.id,candidateId:res.data.cid});
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        _onChange(v){
            if (parseInt(v) === 1) {
                sex = 1;//男
            }else{
                sex = 2;//女
            }
        }
        addImg(e){
            let length = _imgList.length;
            let maxPic = parseInt(this.props.data.formRequireMaxPic);
            if (length >= maxPic) {
                return Com.toast("最多上传"+maxPic+"张图片，谢谢配合");
            }
            let files = e.target.files;
            if(files && files.item(0)){
                let file = files.item(0);
                if((/^image\/.*$/i.test(file.type))){
                    let freader = new FileReader();
                    freader.readAsDataURL(file);
                    fileState = 1;
                    if(length + 1 === maxPic){
                        this.setState({isAdd:false});
                    }
                    freader.onload=function(e){
                        //在此上传图片
                        let camera = e.target.result;
                        _imgList.push(camera);
                        Com.sendFile({act:"apps_vote",op:"pic_upload",post_pic:file},(res)=>{
                            if(parseInt(res.code) === 0){
                                fileState = 2;
                                _fileList.push(res.data.fileName);
                            }
                        },true);
                        _self.setState({imgList:_imgList});
                    }
                }
            }
        }
        delImg(index){
            _imgList.splice(index,1);
            Com.postVerify({act:"apps_vote",op:"del_pic",fileName:_fileList[index]},null,true);
            _fileList.splice(index,1);
            _self.setState({imgList:_imgList});
            this.setState({isAdd:true});
        }
        render(){
            let {formRequireMaxPic,formRequireMinPic,formRequireAge,formRequireArea,formRequireIntro,formRequireJob,formRequireSex,is_applay} = this.props.data;
            let img_item = this.state.imgList.map((item,index)=>{
                return <li key={index}>
                        <div className="imgWrap">
                            <img className="newsImg" src={item} />
                            <div className="delInImg" onClick={()=>this.delImg(index)}></div>
                        </div>
                    </li>;
            });
            let sexEl = null; 
            if(parseInt(formRequireSex) === 2){
                sexEl = <div className="sexItem">
                            <span className="jName base-transY">性别：</span>
                            <div className="sexWrap">
                                <Radio f_changeHandler={(value)=>this._onChange(value)} s_value="1" s_label="男"/>
                                <Radio f_changeHandler={(value)=>this._onChange(value)} s_value="2" s_label="女"/>
                            </div>
                        </div>;
            }
            let isShow = this.state.isAdd ? " " : "noAdd";
            return (
                <div className="apps_vote_join">
                    <LabelInput ref="name" s_left="姓名：" s_right="请输入您的姓名" b_isInput={true} b_line={true}/>
                    <LabelInput ref="phone" s_left="手机：" s_right="请输入您的手机号码" b_isInput={true} b_line={true}/>
                    {parseInt(formRequireAge) === 2? <LabelInput ref="age" s_left="年龄：" s_right="请输入您的年龄" b_isInput={true} b_line={true}/>:null}
                    {parseInt(formRequireJob) === 2?<LabelInput ref="work" s_left="职业：" s_right="请输入您的职业" b_isInput={true} b_line={true}/>:null}
                    {parseInt(formRequireArea) === 2?<LabelInput ref="area" s_left="区域：" s_right="请输入您的区域" b_isInput={true} b_line={true}/>:null}
                    {parseInt(formRequireIntro) === 2?<LabelInput ref="info" s_left="简介：" s_right="请输入您的介绍" b_isInput={true} b_line={true}/>:null}
                    {sexEl}
                    <div className="base-pd10">
                        添加图片：
                    </div>
                    <section className="voteImgDiv">
                        <div className="leftSec">

                            <ul className="voteImg" ref="imgList">
                                {img_item}
                                <li className={isShow}>
                                    <input ref="input" onChange={(e)=>this.addImg(e)} className="multiPic" type="file" accept="image/*"/>
                                    <img className="imgBtn" src={require('file_uoloadImg')} />
                                </li>
                            </ul>
                            <span><em>*</em>最少<em>{formRequireMinPic}</em>张,最多<em>{formRequireMaxPic}</em>张</span>
                        </div>

                        <BlockBtn s_label={`${parseInt(is_applay)===1?"已报名":"提交信息"}`} onClick={()=>this._submit()}/>
                    </section>
                    <ApposeFixedBtn s_leftLabel="活动首页" s_rightLabel="活动说明" f_leftClick={this._clickLeft} f_rightClick={this._clickRight}/>
                </div>
             );
        }
    };
    //请求数据
    Com.getVerify({act:"apps_vote",op:"apply",id:id},function(res){
        if(parseInt(res.code) === 0){
            let data = res.data;
            ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
