/*
 * @Author: 黄权
 * @Date:   2016-11-5 17:00:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-07 15:39:23
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("抽奖");
    require("apps_luckDraw_indexCss");
    let $ = require('jquery-1.10.2');
    require("awardRotate");
    let WxShare = require('wxShare');
    let drawBtnImg = require('drawBtnImg')
    let BlockTitle = require('blockTitle');
    let LuckDetail = require('luckDetail');
    let BlockFixedBtn = require('blockFixedBtn');
    let BlockBtn = require('blockBtn');
    let i_drawId = Com.getPageParams("id");
    let turnplate={
        restaraunts:[],				//大转盘奖品名称
        colors:[],					//大转盘奖品区块对应背景颜色
        outsideRadius:190,			//大转盘外圆的半径
        textRadius:160,				//大转盘奖品位置距离圆心的距离
        insideRadius:55,			//大转盘内圆的半径
        startAngle:0,				//开始角度
        bRotate:false				//false:停止;ture:旋转
    };
    //执行drawRouletteWheel()方法对转盘进行渲染
    function drawRouletteWheel() {
        let canvas = document.querySelector(".canvas-container");
        let len = turnplate.restaraunts.length;
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            let arc = Math.PI / (len/2);
            let ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0,0,422,422);
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "#FFBE04";  //圆弧的边的颜色
            //font 属性设置或返回画布上文本内容的当前字体属性
            ctx.font = '20px 微软雅黑';
            for(let i = 0; i < len; i++) {
                let angle = turnplate.startAngle + i * arc;
                ctx.fillStyle = turnplate.colors[i];
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();
                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //----绘制奖品开始----
                ctx.fillStyle = "#AD5F1F"; // 文字颜色
                let text = turnplate.restaraunts[i];
                let line_height = 23; //文字间距
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2 );

                /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                if(text.length>6){//奖品名称长度超过一定范围
                    text = text.substring(0,6);
                    for(let j = 0; j<text.length; j++){
                        ctx.fillText(text[j], -ctx.measureText(text[j]).width / 2, j * line_height);
                    }
                }else{
                    //在画布上绘制填色的文本。文本的默认颜色是黑色
                    //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                    for(let j = 0; j<text.length; j++){
                        ctx.fillText(text[j], -ctx.measureText(text[j]).width / 2, j * line_height);
                    }
                }

                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();
                //----绘制奖品结束----
            }
        }
    }
    let a_lever =[]; //奖品数组
    let a_restaraunts =[]; //转盘数组
    let a_ramdom =[]; //没中奖数组
    let a_color =[]; //颜色数组
    let i_limit = 0; //总抽奖次数
    let i_draw = 0; //已抽奖次数
    let a_recordDate = [];
    function rnd(m){
        var random = Math.floor(Math.random()*m);
        return random;

    }
    class Layer extends React.Component {
        constructor(props){
            super(props);
            this.state = {b_show:false,type:1,winnerId:"",serial:0};
            this.toggle = (type,winnerId,serial)=>{
                if(winnerId){
                    this.setState({b_show:!this.state.b_show,type:type,winnerId:winnerId,serial:serial});
                }else{
                    this.setState({b_show:!this.state.b_show,type:type});
                }
            };
        }
        f_submit(){
            this.toggle(2);
            Com.openWin('apps_luckDraw_winnerInfoUp',{id:i_drawId,winnerId:this.state.winnerId});
        }
        render(){
            let {b_show,type,serial} = this.state;
            let e_container = null;
            if(type === 1){
                e_container =  <div className="lost-container n_w_p_bg">
                                <div className="lostBody base-mB10">
                                    可惜
                                    <p>没中奖</p>
                                </div>
                                <div className="lostBody2">
                                    最重要的就是开心咯
                                </div>
                                <img src={require("noWinPrizeImg")} className="base-mB10 base-mT10 tipsImg" />
                                <BlockBtn s_label={"下次再来"} onClick={()=>{this.toggle(1)}}/>
                            </div>;
            }else {
                serial = parseInt(serial);
                e_container = <div className="lost-container w_p_bg">
                    <img src={require("winningPrizeTitImg")} className="base-mB10 w_p_tit"/>
                    <div className="lostBody2">
                        {a_recordDate[serial].levelName}
                        <p>{a_recordDate[serial].reawardName}</p>
                    </div>
                    <img src={require("winningPrizeImg")} className="tipsImg"/>
                    <BlockBtn s_label={"完善资料"} onClick={()=>{this.f_submit()}}/>
                </div>;
            }
            return  <div className={`lostPrize_layer ${b_show?"":"base-hide"}`}>
                        {e_container}
                    </div>
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {i_drawCount:this.props.data.luckDate.timeLeft || 0};
        }
        componentDidMount(){
            let {list_word,luckDate,recordDate} = this.props.data;
            a_recordDate = recordDate;
            let {limit,timeLeft} = luckDate;
            document.title = luckDate.title || '抽奖';
            i_limit = parseInt(limit);
            i_draw = parseInt(timeLeft);
            if(list_word.length>0){
                list_word.forEach((item,key)=>{
                    let {levelName,id} = item;
                    a_restaraunts.push(levelName);
                    if(key%2 === 0){
                        a_color.push("#FFD478");
                    }else{
                        a_color.push("#FFEB92");
                    }
                    if(!id){
                        a_ramdom.push(key);
                    }else{
                        a_lever[key] = levelName;
                    }
                });
            }
            turnplate.restaraunts = a_restaraunts;
            turnplate.colors = a_color;
            drawRouletteWheel();
            let e_layer =  this.refs.layer;
            this.f_rotateFn = (item,serial)=>{
                let angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
                if(angles<270){
                    angles = 270 - angles;
                }else{
                    angles = 360 - angles + 270;
                }
                $('.canvas-container').stopRotate();
                $('.canvas-container').rotate({
                    angle:0,
                    animateTo:angles+1800,
                    duration:8000,
                    callback:()=>{
                        turnplate.bRotate = !turnplate.bRotate;
                        if (serial != -1) {
                            e_layer.toggle(2,this._winnerId,serial);
                            // Com.openWin('apps_luckDraw_winnerInfoUp',{id:i_drawId,winnerId:this._winnerId});
                        }else{
                            e_layer.toggle(1);
                        }
                    }
                });
            };
        }
        //抽奖
        f_draw(){
            if(i_draw<i_limit){
                if(turnplate.bRotate){
                    return;
                }
                turnplate.bRotate = !turnplate.bRotate;
                Com.postVerify({act:"activity_luck",op:"lottery",id:i_drawId,memberId:Com.getCookie("member_id")},(res)=>{
                    if(parseInt(res.code)===0){
                        if (res.data.type==1) {
                            let {winnerId,serial} = res.data.data;
                            this._winnerId = winnerId;
                            serial = parseInt(serial);
                            i_draw++;
                            this.setState({i_drawCount:i_draw});
                            if (serial == -1) {  //没中奖
                                let index = rnd(a_ramdom.length);
                                this.f_rotateFn(a_ramdom[index]+1,serial);
                            }else{ //中奖
                                this.f_rotateFn(serial*2+2,serial);
                            }
                        }else{
                            turnplate.bRotate = false;
                            Com.toast(res.data.msg);
                        }
                    }else{
                        Com.toast(res.msg);
                    }
                });
            }else{
                Com.toast("您的抽奖次数已用完");
            }
        }
        render(){
            let {list_word,luckDate} = this.props.data;
            let e_ward = null;
            if(list_word.length>0){
                e_ward = list_word.map((item,key)=>{
                    let {levelName,reawardName,quantity,id} = item;
                    if(!id){
                        return null;
                    }
                    return  <li key={key}>
                               <span>{levelName}</span>
                               <span>{reawardName}</span>
                               <span>数量：{quantity}</span>
                           </li>;
                });
            }
            return (
                <div className="apps_luckDraw_index">
                    <section className="rotaryTable">
                        <div className="turnplate">
                            <canvas className="canvas-container"  width="422px" height="422px" >
                            </canvas>
                            <img className="draw-pointer" src={require('drawBtnImg')} onClick={()=>{this.f_draw()}}/>
                        </div>
                    </section>
                    <section className="luckDetail">
                        <div className="giantInfo">
                            本次抽奖一共可以转<em>{luckDate.limit}</em>次转盘，你已转了<em>{this.state.i_drawCount}</em>次
                        </div>
                        <div className="award base-mB10">
                            <BlockTitle s_title={"奖励设置"} >
                                <ul className="awardList">
                                    {e_ward}
                                </ul>
                            </BlockTitle>
                        </div>
                        <LuckDetail data={luckDate.intro}/>
                    </section>
                    <BlockFixedBtn s_label={"查看中奖记录"} onClick={()=>{Com.openWin('apps_luckDraw_winnerInfo',{id:i_drawId})}}/>
                    <Layer ref="layer"/>
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:"activity_luck",op:"getLuckDate",id:i_drawId},function(res){
        if(parseInt(res.code) === 0){
            let recordData = res.data.recordDate;
            let shareParams = {
                baseURL : document.location.href+"&channel=18",
                title : recordData.title,
                desc : recordData.intro,
                imgUrl : ""
            };
            WxShare.showShare(shareParams);
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
