/*
 * @Author: 黄权
 * @Date:   2016-12-09 11:15:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-12 14:50:10
 * 全部门店列表
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("评价");
    require("order_evaluateCss");
    let LabelInput = require('labelInput');
    let Star = require('star');
    let commonDefault = require('commonDefaultImg');
    let radio_bg = require('radio_bgImg');
    let radio_sed_bg = require('radio_sed_bgImg');
    let a_param = Com.getPageParams("evaluation");
    let order_id = Com.getPageParams("order_id");
    a_param = a_param?JSON.parse(a_param):[];
    if(a_param.length<=0){
        return Com.toast("页面参数错误");
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this._goodsCode = [];
            this.state = {b_check:false};
        }
        //商品评分
        f_star(value,index,good_id){
            this._goodsCode[index] = `${good_id}%hsy%${value}` ;
        }
        //描述评分
        f_desStar(value){
            this._desCode = value;
        }
        //服务评分
        f_serverStar(value){
            this._serverCode = value;
        }
        //发货评分
        f_shipStar(value){
            this._shipCode = value;
        }
        //匿名
        f_check(){
            let {b_check} = this.state;
            this.setState({b_check:!b_check});
        }
        //提交
        f_submit(){
            let a_goods = [];
            for(let i=0,len=a_param.length;i<len;i++){
                if(!this._goodsCode[i]){
                    return Com.toast("请给商品评分");
                }
                if(!this.refs[`area${i}`].value){
                    return Com.toast("请输入商品评价");
                }
                a_goods.push(`${this._goodsCode[i]}%hsy%${this.refs[`area${i}`].value}`);
            }
            if(!this._desCode){
                return Com.toast("请给商品与描述相符项评分");
            }
            if(!this._serverCode){
                return Com.toast("请给卖家的服务态度项评分");
            }
            if(!this._shipCode){
                return Com.toast("请给卖家的发货速度项评分");
            }
            let anony = this.state.b_check ? 1: 0;
            Com.postVerify({act:'member_order',op:'evaluate',type:3,order_id:order_id,goods:a_goods.join("%bdhs%"),anony:anony,
                store_desccredit:this._desCode,store_servicecredit:this._serverCode,store_deliverycredit:this._shipCode},function(ret){
                if( parseInt(ret.code) === 0){
                    Com.toast("评论成功!",()=>{
                        Com.closeWin();
                    },3,1);
                }else{
                    Com.toast(ret.msg);
                }
            });
        }
        render(){
            let e_goods = null;
            let {b_check} = this.state;
            e_goods = a_param.map((item,key)=>{
                return <li key={key} className="base-after-line">
                            <img className="goods_img" src={item[1]} onError={(ev)=>ev.target.src=commonDefault}/>
                            <div className="goods_appraise appraise">
                                <div className="good_starWrap base-mB10">
                                    评价：<Star onClick={(value)=>this.f_star(value,key,item[0])} forName={`goods_${item[0]}`} />
                                </div>
                                <textarea ref={`area${key}`} placeholder="与小伙伴分享你的感受，是对他人最大的帮助哦！">

                                </textarea>
                            </div>
                        </li>;
            });
            return (
                <div className="order_evaluate">
                    <section className="appraise base-after-line base-line-left">
                        对商品的评价：
                    </section>
                    <section>
                        <ul className="goodsGroup">
                            {e_goods}
                        </ul>
                    </section>
                    <LabelInput s_left={"对本次服务打分"} b_line={true} />
                    <section className="appraise">
                        商品与描述相符：
                        <div className="starWrap">
                            <Star forName={"des"} onClick={(value)=>this.f_desStar(value)}/>
                        </div>
                    </section>
                    <section className="appraise">
                        卖家的服务态度：
                        <div className="starWrap">
                            <Star forName={"sever"} onClick={(value)=>this.f_serverStar(value)}/>
                        </div>
                    </section>
                    <section className="appraise">
                        卖家的发货速度：
                        <div className="starWrap">
                            <Star forName={"shipments"} onClick={(value)=>this.f_shipStar(value)}/>
                        </div>
                    </section>
                    <nav className="bar-footer">
                        <div className="checkbox base-before-line base-line-left">
                            <img src={b_check?radio_sed_bg:radio_bg} onClick={()=>{this.f_check()}}/>
                            <label>匿名评价</label>
                        </div>
                        <div className="btn" onClick={()=>{this.f_submit()}}>提交</div>
                    </nav>
                </div>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"appraise_goods",op:"appraise_goods"},function(res){
    //     if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});