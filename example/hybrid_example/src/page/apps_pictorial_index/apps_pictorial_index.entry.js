/*
 * @Author: 黄权
 * @Date:   2017-01-11 10:32:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2017-01-11 15:10:09
 * 微场景
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("微场景");
    require("apps_pictorial_indexCss");
    require('swiper');
	require('swiper.animate.min');
    let i_id = Com.getPageParams("id");
    let arrow_pic = require('arrowImg');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {o_videData:null,b_play:Com.getSysType()==1?false:true};
        }
        componentDidMount(){
        	let {music_str,page_data,pic_data,vide_data} = this.props.data;
        	let _self = this;
        	if(document.getElementById("media")){
        		document.getElementById("media").oncanplay=()=>{
        			document.getElementById("media").play();
        		}
        	}

        	//每页下方的图片
            let imgEls = document.querySelectorAll(".arrow_pic");
	     	for (let i=0,len=imgEls.length;i<len;i++) {
	     		if(imgEls[i]){
	     			imgEls[i].src = arrow_pic;
	     		}
			}
			let a_vide = document.querySelectorAll(".vide");
			for(let i =0,len=a_vide.length;i<len;i++){
				if(a_vide[i]){
					a_vide[i].addEventListener("click", function(){
						let data_id = this.getAttribute("data-id");
						if(document.getElementById("media")){
							document.getElementById("media").pause();
						}
						_self.setState({o_videData:vide_data[data_id],b_play:false},()=>{
							document.querySelector("iframe").classList.add("vide_css");
						});
					});
				}
			}
			let mySwiper = new Swiper ('.swiper-container', {
		           direction : 'vertical',
		           freeMode : false,
		           touchRatio : 0.5,
		           loop : true,
		           mousewheelControl : true,
		           onInit: function(swiper){
		        	   swiperAnimateCache(swiper);
		        	   swiperAnimate(swiper);
		           },
		           onSlideChangeEnd: function(swiper){
		        	   swiperAnimate(swiper);
		           },
		           onTransitionEnd: function(swiper){
		        	   swiperAnimate(swiper);
		           }
	          });
	    	let scaleW=window.innerWidth/320;
	    	let scaleH=window.innerHeight/480;
	    	let resizes = document.querySelectorAll('.resize');
	    	  //              魅族手机
	    	 if(window.innerWidth == 384 || window.innerWidth == 432){
	    	    for (let j=0,len=resizes.length; j<len; j++) {
	    	      resizes[j].style.width=parseInt(resizes[j].style.width)*scaleW-24+'px';
	    	      resizes[j].style.height=parseInt(resizes[j].style.height)*scaleH-24+'px';
	    	      resizes[j].style.top=parseInt(resizes[j].style.top)*scaleH+'px';
	    	      resizes[j].style.left=parseInt(resizes[j].style.left)*scaleW+12+'px'; 
	    	    }
	    	}else{
	    	    //标准手机
	    	    for (let j=0,len=resizes.length; j<len; j++) {
	    	        resizes[j].style.width=parseInt(resizes[j].style.width)*scaleW+'px';
	    	        resizes[j].style.height=parseInt(resizes[j].style.height)*scaleH+'px';
	    	        resizes[j].style.top=parseInt(resizes[j].style.top)*scaleH+'px';
	    	        resizes[j].style.left=parseInt(resizes[j].style.left)*scaleW+'px'; 
	    	    }
	    	}
        }
        f_closeVide(){
        	this.setState({o_videData:null});
        }
        //歌曲播放\暂停
        f_controlMusic(){
        	let b_play = this.state.b_play;
        	this.setState({b_play:!b_play},()=>{
        		if(b_play){
        			if(document.getElementById("media")){
        				document.getElementById("media").pause();
        			}
        		}else {
        			if(document.getElementById("media")){
						document.getElementById("media").play();
        			}
        		}
        	});
        }
        render(){
        	let {music_str,page_data,pic_data,vide_data} = this.props.data;
        	let {o_videData,b_play} = this.state;
            return (
                <div className="apps_pictorial_index">
                {music_str?<div id="#audio_btn" className={`video_exist ${(o_videData || !b_play)?"off":"play_yinfu"}`} onClick={()=>this.f_controlMusic()}>
                	<div className={(o_videData || !b_play)?"":"rotate"} dangerouslySetInnerHTML={{__html:music_str}}></div>
                </div>:null}
                {page_data?<div className="swiper-container">
	                <div className="swiper-wrapper" data-triggerLoop={true} dangerouslySetInnerHTML={{__html:page_data}}>
     
    				</div>
	            </div>:null}
            	<div className={o_videData?"":"base-hide"}>
            		<div className='hidden_bg'></div>
					<div className="margin-bottom_10" onClick={()=>this.f_closeVide()}>X</div>
					<div className='hidden_charid' dangerouslySetInnerHTML={{__html:o_videData?o_videData:""}}></div>
            	</div>
                </div>
             );
        }
    };
    //请求数据
    Com.postNormal({act:"activity_pictorial",op:"getIndexDate",id:i_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});