/*
* @Author: 代汉桥
* @Date:   2016-10-17 14:55:06
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-20 17:07:10
*/
'use strict';
Com.ready(function(){
    document.title = ' ';
    let TopBar = require('topBar');
    TopBar.create("");
    let WxLocation = require('wxLocation');
    let store_alias = Com.getPageParams('store_alias');
    let redirect = Com.getPageParams('redirect');
    let store_url = './index.html?store_alias='+store_alias+'&curUrl='+encodeURIComponent('./storeIndex.html?store_alias='+store_alias);
    Com.removeLocalData("locationData");
    Com.removeLocalData("locationPos");
    Com.removeLocalData("shop_img_url");
    Com.showProgress(true);
    WxLocation.init((res)=>{
        if(res){
            let {lat,lon} = res;
            Com.getNormal({act:'location',op:'index',lat:lat,long:lon,redirect:redirect},(res)=>{
                if(parseInt(res.code) === 0){
                    let shop_id = Com.getPageParams('shop_id',res.data.redirect) || 0;
                    let list = res.data.list;
                    let shop_img = res.data.shop_img;
                    let redirect = res.data.redirect;
                    Com.getAddress(lat,lon,(res)=>{
                        let address = '获取地理位置失败';
                        let city = '';
                        if(res.status === 0){
                            city = res.result.ad_info.city;
                            address = res.result.address_component.street_number;
                        }
                        Com.setLocalData('curCity',city);
                        Com.setLocalData('address',address);
                        Com.setLocalData('locationData',list);
                        Com.setLocalData('locationPos',{lat:lat,lon:lon});
                        Com.setLocalData('shop_img_url',shop_img);
                        Com.openWin(redirect,{shop_id:shop_id});
                    });
                }else{
                    Com.openWin(store_url);
                }
            },true,true);
        }else{
            Com.openWin(store_url);
        }
    })
    // window.f_isParent = (callback)=>{
    //     callback();
    // }
    //页面组件
    class PageEl extends React.Component {
        render(){
            return (
                <div className="main">
                </div>
             );
        }
    };
    ReactDOM.render(<PageEl/>,document.getElementById('pageCon'));
});

