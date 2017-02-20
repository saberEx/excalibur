 
'use strict';
require('headerNavCss');
// var ZayImg = require('zayImg');
var TopicImg = require('topicIconImg');
var CardImg = require('cardIconImg');
var HeaderNav = React.createClass({ 
	render:function(){
        let {fdata,sdata} = this.props.data;
        let {posts=0,threads=0} = fdata;
        let {bbs_name="",bbs_logo=""} = sdata;
        return (
			<div>
			  	<header className="bbsIndex">
                    <div className="bbsWarp">
                        <img className="bbsLogo" src={`${Com.UPLOAD_PATH}/bbsimg/bbs_logo/${bbs_logo}`}/>
                        <div className="bbsInfo">
                            <span className="topic"><img src={TopicImg}/>帖子{threads}</span>
                            <span className="card"><img src={CardImg}/>评论{posts}</span>
                            <p>{bbs_name}</p>
                        </div>
                    </div> 
                </header>
			</div>
		);
	}
});
module.exports = HeaderNav;
