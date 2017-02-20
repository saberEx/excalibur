/*
 * @Author: 卢旺
 * @Date:   2016-11-24 10:00:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-07 10:55:48
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("优惠券列表");
    let VoucheItem = require('voucheItem');
    require("my_vouche_listCss");
    //从提交订单页面进入，可以支持点击选择使用卡券
    let submit = Com.getPageParams('submit');
    let Scroll = require('scroll');
    let scroll_h = document.body.offsetHeight;
    let NotData = require('notData');
    //页面组件
    class PageEl extends React.Component{
        _clickHandler(data){
            if (parseInt(submit) === 1) {
                Com.sendEvt("shopC_vouche_list",data);
                Com.closeWin();
            }
        }
        render(){
            let list = [];
            let style = "";
            let _self = this;
            if (this.props.data && this.props.data.card_info) {
                let card_info = JSON.parse(this.props.data.card_info) || [];
                list = card_info.map(function(val,key){
                        let {end_timestamp,logo_url,brand_name,card_alias_name} = val;
                        let data = {end_time:end_timestamp,logo_url:logo_url,store_name:brand_name,card_name:card_alias_name}
                        return <VoucheItem key={key} data={data} callBack={()=>_self._clickHandler(val)}/>
                    });
            }
            if(list.length === 0){
                style = "my_vouche_list";
                list = <NotData></NotData>;
            }
            return (
                <div className={style}>
                    <Scroll style={{height:scroll_h}}>
                        {list}
                    </Scroll>
                </div>
            );
        }
    };

    //请求数据
    Com.getVerify({act:"member_wx_card",op:"card_list",ucenter:1},function(res){
        if(res.code === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            ReactDOM.render(<PageEl/>,document.getElementById('pageCon'));
        }
        // else{
        //     Com.toast(res.msg);
        // }
    });
});
