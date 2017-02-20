/*
 * @Author:
 * @Date:
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-29 10:10:15
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("兑换商品详情");
    require("apps_integral_detailCss");
    let LabelInput = require('labelInput');
    let AddGoodsNum = require('addGoodsNum');
    let pgoods_id = Com.getPageParams('pgoods_id');
    let member_id = Com.getCookie("member_id");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        f_exchange(){//兑换
            if(this.b_noCanSubmit){
                return;
            }
            let {pgoods_islimit,pgoods_limitnum,pgoods_storage} = this.props.prod_info;
            let  changeCount = this.refs.goodsNum.value;
            if(pgoods_storage<=0){
                return Com.toast("库存不足");
            }
            if(changeCount<=0){
                return Com.toast("请选择兑换数量");
            }
            if (parseInt(pgoods_islimit) === 1) {
                if(changeCount > parseInt(pgoods_limitnum)){
                    return Com.toast("最大兑换数量为"+pgoods_limitnum);
                }else{
                    if(changeCount >parseInt(pgoods_storage)){
                        return Com.toast("库存为"+pgoods_storage);
                    }
                }
            }else{
                if(changeCount >parseInt(pgoods_storage)){
                    return Com.toast("库存为"+pgoods_storage);
                }
            }
            Com.postVerify({act:"activity_pointshop",op:"exchange_limit",pgoods_id:pgoods_id,quantity:changeCount},function(ret){
                if(ret.code==0){
                    Com.openWin("apps_integration_convert",{pgoods_id:pgoods_id,pgoods_num:changeCount});
                }else {
                    Com.toast(ret.msg);
                }
            });
        }
        render(){
            let {pgoods_body,pgoods_points,pgoods_name,pgoods_storage,pgoods_image_max,pgoods_islimit,pgoods_limitnum,pgoods_islimittime,pgoods_starttime,
                pgoods_endtime,pgoods_image,is_logistics,is_selfpick} = this.props.prod_info;
            let i_max = pgoods_storage;
            if(parseInt(pgoods_islimit)===1){
                i_max = parseInt(pgoods_limitnum)<parseInt(pgoods_storage)?pgoods_limitnum:pgoods_storage;
            }
            let i_curtime = parseInt(new Date().getTime()/1000);
            let s_btn = "马上兑换";
            let s_btnCls = "base-btn";
            if(pgoods_islimittime!=0 && pgoods_starttime && i_curtime<pgoods_starttime){
                s_btn = "未开始";
                s_btnCls = "base-btn disabled";
                this.b_noCanSubmit = true;
            }
            if(pgoods_islimittime!=0 && pgoods_endtime && pgoods_endtime<i_curtime){
                s_btn = "已结束";
                s_btnCls = "base-btn disabled";
                this.b_noCanSubmit = true;
            }
            if(pgoods_storage == 0){
                s_btn = "库存不足";
                s_btnCls = "base-btn disabled";
                this.b_noCanSubmit = true;
            }
            return (
                <div className="apps_integral_detail">
                    <section className="goods_img">
                        
                    </section>
                    <section className="intGoods base-mB10">
                        <img src={pgoods_image} alt="" />
                        <h2>{pgoods_name}</h2>
                        <p>所需积分：<em>{pgoods_points+"积分"}</em></p>
                        <LabelInput s_left={`限兑数量：${parseInt(pgoods_islimit) === 1?pgoods_limitnum:"不限"}`} s_right={"库存："+pgoods_storage} b_right={true} />
                       {/* {pgoods_islimittime!=0?<LabelInput s_left={"兑换开始时间："} s_right={`${Com.getTimeFormat(pgoods_starttime,2)}`} b_right={true} />:null}
                        {pgoods_islimittime!=0?<LabelInput s_left={"兑换结束时间："} s_right={`${Com.getTimeFormat(pgoods_endtime,2)}`} b_right={true} />:null}*/}
                    </section>
                    <section className={`base-mT10 ${this.b_noCanSubmit?"base-hide":""}`}>
                        <AddGoodsNum ref="goodsNum" s_tit={"兑换数量："} i_max={parseInt(i_max)} i_value={pgoods_storage>0?1:0}/>
                    </section>
                    <section>
                        {(is_logistics!=0 || is_selfpick!=0)?<LabelInput s_left="配送方式：" b_right={true} s_right={`${is_logistics==1?"物流配送 ":""}${is_selfpick==1?"门店自提":""}`} b_line={true}/>:null}
                        {pgoods_islimittime!=0?<LabelInput s_left="兑换日期：" b_right={true} s_right={`${Com.getTimeFormat(pgoods_starttime,0).replace(/-/g,"/")}-${Com.getTimeFormat(pgoods_endtime,0).replace(/-/g,"/")}`} b_line={true}/>:null}
                    </section>
                    <section className="base-mT10 detial_cont">
                        <LabelInput s_left="商品详情"  b_line={true}/>
                        <div className="goodsDetail">
                            <div dangerouslySetInnerHTML={{__html:pgoods_body}}></div>
                        </div>
                    </section>
                    <footer className="fixedChange">
                        <button className={s_btnCls} onClick={()=>this.f_exchange()}>{s_btn}</button>
                    </footer>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"activity_pointshop",op:"point_details",pgoods_id:pgoods_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl prod_info={res.data.prod_info}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
