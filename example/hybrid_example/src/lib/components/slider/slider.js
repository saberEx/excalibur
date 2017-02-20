/*
* @Author: 代汉桥
* @Date:   2016-07-12 09:35:30
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-19 09:31:31
* 轮播组件
* 用法：
* var a_list = [imgSrc,imgSrc];
* var e_slide = a_list.map(function(item,index){
*    return <li key={index}><img src={item} /></li>
* })
* <Slider i_time={3}>
*    {e_slide}
* </Slider>
*/
'use strict';
require('sliderCss');
let lory = require('lory').lory;
import Timing from 'timing';
let timing = new Timing();
let classSet = require('classnames');
let styleW = {width:Base.getScreenWidth()};
let loryImgFunc = (self)=>{
    if(React.Children.count(self.props.children) <=1){
        return null;
    }
    timing.stop();
    if(self.o_slide){
        self.o_slide.reset();
        self.o_slide.destroy();
    }
    let e_node = ReactDOM.findDOMNode(self);
    self.o_slide = lory(e_node, {infinite: 1});
    let i_time = self.props.i_time;
    if(i_time){
        timing.start(Number.MAX_VALUE/1000,function(){
            self.o_slide.next();
        },i_time);
    }
    if(self.props.b_bullet){
        e_node.addEventListener('after.lory.slide', function(e){
            document.querySelector('.bullet.active').classList.remove('active');
            self.refs['bullet_'+e.detail.currentSlide].classList.add('active');
        });
    }
};
class Slider extends React.Component{
    componentDidMount(){
        loryImgFunc(this);
    }
    componentDidUpdate(){
        loryImgFunc(this);
    }
    componentWillUnmount(){
        timing.stop();
        if(this.o_slide){
            this.o_slide.destroy();
        }
    }
    static propTypes = {
        i_time: React.PropTypes.number,//是否自动轮播
        b_bullet: React.PropTypes.bool,//是否需要底部页面指示器
        e_adorn : React.PropTypes.element,//装饰元素
    }
    render(){
        let self = this;
        //轮播元素
        let e_items = null;
        e_items = this.props.children;
        let e_bullet = [];
        if(this.props.b_bullet){
            for(var i = 0,len=e_items.length;i<len;i++){
                var s_activeCls = classSet("bullet",{'active':(i===0)});
                e_bullet.push(<span key={i} ref={'bullet_'+(i+1)} className={s_activeCls}></span>);
            }
        }
        if(e_bullet.length <= 1){
            e_bullet = [];
        }
        return (
            <div key={Math.random()} className="slider" style={styleW}>
                <div ref="sliderFrame" className="js_frame" style={styleW}>
                    <ul ref="sliderUl" className="js_slides">
                        {e_items}
                    </ul>
                    <div className="pagination">
                        {e_bullet}
                    </div>
                </div>
                {this.props.e_adorn}
            </div>
        );
    }
}
module.exports = Slider;
