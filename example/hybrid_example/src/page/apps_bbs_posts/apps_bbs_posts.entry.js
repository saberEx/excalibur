/*
 * @Author: 黄权
 * @Date:   2016-10-28 17:50:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-11-29 10:38:27
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("发帖");
    require("apps_bbs_postsCss");
    window.$ = window.jQuery = require("jquery-1.10.2");
    require("jquery-sinaEmotion-2.1.0Css");
    require("jquery-sinaEmotion-2.1.0");
    let closeImg = require("closeImg");
    class PostImg extends React.Component {
        f_close(){
            let {index,f_close} = this.props;
            f_close(index);
        }
        render(){
            return <div className="base-fl imgCon">
                <img className="postsImg" src={this.props.url} />
                <img className="closeImg" src={closeImg} onClick={()=>this.f_close()}/>
            </div>;
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state={index:0,a_image:[]};
            this._fid = this.props.data.length>0?this.props.data[0].fid:0;
            this.reader = new FileReader();
            this.reader.onload = ()=>{
                this.state.a_image.push(this.reader.result);
                this.setState({a_image:this.state.a_image});
            }
        }
        f_option(fid){
            this._fid = fid;
        }
        f_onClick(index){
            this.setState({index:index});
        }
        f_submit(){
            let {title,content} = this.refs;
            let {a_image} = this.state;
            if(!this._fid){
                return Com.toast("请选择帖子所属模块");
            }
            if(!title.value){
                return Com.toast("标题不能为空!");
            }
            if(title.value.length<4){
                return Com.toast("标题长度至少为4个字");
            }
            let s_value = content.value;
            if(!s_value){
                return Com.toast("内容不能为空!");
            }
            $('.parseContent').html(s_value).parseEmotion();
            s_value =  $('.parseContent').html();
            Com.postVerify({act:'bbs_thread',op:'create',subject:title.value,content:s_value,fid:this._fid,file:a_image},(res)=>{
                if(parseInt(res.code) === 0){
                    Com.openWin("apps_bbs_tips");
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        f_change(ev){
            this.reader.readAsDataURL(ev.target.files[0]);
            ev.target.value = "";
        }
        f_close(key){
            let {a_image} = this.state;
            a_image.splice(key,1);
            this.setState({a_image:a_image});
        }
        componentDidMount(){
            let self = this;
            $('.postsCont .clickEmoj').click(function(event){
                self.setState({index:1},()=>{
                    $(this).sinaEmotion($('.postsCont .content'));
                    event.stopPropagation();
                });

            });
        }
        render(){
            let data = this.props.data;
            let {index,a_image} = this.state;
            let e_option = null;
            if(data && data.length>0){
                e_option = data.map((item,key)=>{
                    let {fid,fname} = item;
                    return <option key={key} value={fid} onClick={()=>this.f_option(fid)}>{fname}</option>
                });
            }
            let e_image = null;
            if(a_image.length>0){
                e_image = a_image.map((item,key)=>{
                    return <PostImg key={key} url={item} index={key} f_close={(key)=>this.f_close(key)}/>
                });
            }
            return (
                <div className="apps_bbs_posts">
                    <ul className="postsCont">
                        <li className="industry">
                            <label>所属模块：</label>
                            <select>
                                {e_option}
                            </select>
                        </li>
                        <li>
                            <input ref="title" className="form-control" type="text" maxLength='25' placeholder="标题，4-25个字" />
                        </li>
                        <li>
                            <textarea ref="content" className="form-control content" rows="3" placeholder="内容" ></textarea>
                        </li>
                        <li className="postSeting">
                            <span className={`base-fl clickPhoto ${index===0?"active":""}`} onClick={()=>this.f_onClick(0)}>
                                <input type="file" className="clickPhotoInput" onChange={(ev)=>this.f_change(ev)} accept="image/*" />
                            </span>
                            <span className={`base-fl clickEmoj ${index===1?"active":""}`}></span>
                            <div className="base-btn btn-primary base-fr" onClick={()=>this.f_submit()}>发表</div>
                        </li>
                        <li className="addPhoto">
                            {/*<div className="addAction base-fl">
                                <input type="file" className="addActionInput" onChange={(ev)=>this.f_change(ev)} ref="fileInput" accept="image/*" />
                                <h3>+</h3>
                            </div>*/}
                            <div className="photoList">
                                {e_image}
                            </div>
                        </li>
                    </ul>
                    <div className="base-hide parseContent"></div>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:'bbs_forum',op:'categorylist'},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
