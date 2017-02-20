'use strict';
//拼团成功后的拼团详情
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("拼团详情");
    require("group_detailCss");
    require("goodDetailsCss");
    let GroupGoods = require('groupGoods');
    let GroupMenber = require('groupMenber');
    let GroupList = require('groupList');
    let GroupBottoMenu = require('groupBottoMenu');
    let GoodShare = require('goodShare');
    let open_sn = Com.getPageParams('open_sn');
    let store_alias = Com.getPageParams('store_alias');
    let isShare = Com.getPageParams('isShare');
    let WxShare = require('wxShare');

    //页面组件
    class PageEl extends React.Component{
        f_callBack(){
            Com.openWin('group_flow');
        }
        bottomClick(){
            this.refs.goodShare.open();
        }
        render(){
            let datas= this.props.data;
            let s_price="拼团立省"+(datas.spell_info.spell_goods_price - datas.spell_info.spell_price).toFixed(2) +"元";
            let b_over = false;
            if (parseInt(datas.spell_info.spell_number- datas.open_total) <= 0 || compare(datas.spell_info.validity)) {
                b_over = true;
            }
            let share_num = datas.spell_info.spell_number- datas.open_total;
            return (
                <div className="groupDetail goodDetails">
                    <div className="base-mB10">
                        <GroupGoods goodsImg={datas.spell_info.goods_image}
                            goodsName={datas.spell_info.spell_goods_name}
                            groupBuyNum={datas.spell_info.spell_number}
                            groupBuyPrice={datas.spell_info.spell_price}
                            buyPrice={datas.spell_info.spell_goods_price}
                            isTips={true}
                            isDetial={true}
                            tips={s_price}
                            spell_id={datas.spell_info.spell_id}
                            open_sn={open_sn}
                            goods_alias={datas.spell_info.spell_goods_alias}/>
                    </div>
                    <div className="base-mB10">
                        <GroupMenber i_state={parseInt(datas.spell_info.open_state)}
                            i_buyNum={datas.spell_info.spell_number- datas.open_total}
                            s_time={datas.spell_info.validity}
                            s_spell_time={datas.spell_info.spell_time_length}
                            f_callBack={this.f_callBack}/>
                    </div>
                    <div className ="base-mB10">
                        <GroupList data={datas}/>
                    </div>
                    <div className="base-tabH"></div>
                    <GroupBottoMenu data={datas.spell_info} open_sn={open_sn} s_isShare={isShare} b_over={b_over} f_callBack={()=>this.bottomClick()}/>
                    <GoodShare ref='goodShare' i_number={parseInt(share_num) < 0 ? 0 : share_num}/>
                </div>
             );
        }
    }
    //请求数据
    if (isShare) {//分享进入
        Com.getNormal({act:"normal_index",op:"go_spell",open_sn:open_sn},function(res){
            console.log(res);
            if(res.code === 0){
                let buy_num = res.data.spell_info.spell_number - res.data.open_total;
                let image = Com.getGoodsImg(res.data.spell_info.goods_image);
                wx(res.data.store_name,res.data.spell_info.spell_goods_name,buy_num,res.data.spell_info.spell_time_length,image);
                ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
            }else{
                Com.toast(res.msg);
            }
        });
    }else{
        Com.getNormal({act:"activity_spell_group",op:"spell_group_info",open_sn:open_sn},function(res){
            if(res.code === 0){
                let buy_num = res.data.spell_info.spell_number - res.data.open_total;
                let image = Com.getGoodsImg(res.data.spell_info.goods_image);
                wx(res.data.store_name,res.data.spell_info.spell_goods_name,buy_num,res.data.spell_info.spell_time_length,image);
                ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
            }else{
                Com.toast(res.msg);
            }
        });
    }
    function wx(stroe_name,shop_name,buy_num,time,imgUrl){
        let num = buy_num < 0 ? 0 : buy_num;
        let shareParams = {
            baseURL : window.location.href+"&isShare=1",
            title : "我参加了"+stroe_name+"的"+shop_name+"商品拼团，赶快和我一起吧!还差"+num+"人"+time+"小时成团即可发货，优惠多多，品质保证",
            desc : "",
            imgUrl : ""
        };
        WxShare.showShare(shareParams);
    }
    function compare(date){
        var oDate1 = new Date(date);
        var oDate2 = new Date();
        if(oDate1.getTime() > oDate2.getTime()){
            return false;
        } else {
            return true;
        }
    }
});
