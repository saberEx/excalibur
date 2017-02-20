/*
 * @Author: 黄权
 * @Date:   2016-11-3 14:03:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-11-3 14:15:00
 */
'use strict';
require("minPostCss");
window.$ = window.jQuery = require("jquery-1.10.2");
require("jquery-sinaEmotion-2.1.0Css");
require("jquery-sinaEmotion-2.1.0");
class MinPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {b_show:false};
        this.f_show = ()=>{this.setState({b_show:true})};
    }
    f_bgOnClick(ev){
        ev.stopPropagation();
        ev.preventDefault();
        this.setState({b_show:false});
    }
    submitClick(ev){
        ev.stopPropagation();
        let s_value = this.refs.replyText.value;
        this.setState({b_show:false});
        $('.minPost .parseContent').html(s_value).parseEmotion();
        s_value =  $('.minPost .parseContent').html();
        this.props.submitClick && this.props.submitClick(s_value);
    }
    componentDidMount(){
        $('.clickEmoj').click(function(event){
            $(this).sinaEmotion($('.minPost .form-control'));
            event.stopPropagation();
        });
    }
    render(){
        let {b_show} = this.state;
        let s_class = b_show ? 'minPost' : 'minPost base-hide';
        return <div className={s_class}>
                    <div className="fixed_bg" onClick={(ev)=>this.f_bgOnClick(ev)}></div>
                    <div className="commentForm">
                        <textarea ref="replyText" className="form-control" placeholder="内容，10-100个字"></textarea>
                        <div className="commentSetting">
                            <span className="base-fl clickEmoj"></span>
                            <div className="base-btn btn-primary base-fr" onClick={(ev)=>this.submitClick(ev)}>发表</div>
                        </div>
                    </div>
                    <div className="base-hide parseContent"></div>
                </div>;
    }
}
module.exports = MinPost;
