/*
 * @Author: 黄权
 * @Date:   2016-12-09 10:58:26
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-13 17:56:14
 * 全部门店列表
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    let PAGE_SIZE = 10;
    TopBar.create("门店列表");
    require("shop_allCss");
    let address_sed_infoImg = require('all_shop_iconImg');
    let store_home_telImg = require('store_home_telImg');
    let Scroll = require('scroll');
    let wxLocation = require('wxLocation');
    let NotData = require('notData');
    let n_lat = "";
    let n_lon = "";
    let s_from = Com.getPageParams("from") || 0;
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            let {shop_list,page} = this.props.data;
            this.state = {b_index:true,b_search:false,a_list:shop_list,b_allLoaded:page<=1,s_location:"获取当前位置信息中..."};
            this.f_requestName = (callBack,curPage=1,b_isNoShowProgress)=>{
                let s_value = this.s_searchValue || "";
                if(!s_value){
                    return Com.toast("请输入门店搜索关键字");
                }
                Com.postNormal({act:'shop_list',op:'getShopListByName',shop_name:s_value,curpage:curPage,pagesize:PAGE_SIZE},function(res){
                    if(parseInt(res.code) === 0){
                        callBack(res.data);
                    }else{
                        Com.toast(res.msg);
                    }
                },b_isNoShowProgress);
            };
        }
        show_search(){
            this.refs.search.value = '';
            this.setState({b_search:true});
        }
        f_search(){
            let s_value = this.refs.search.value;
            if(!s_value){
                return Com.toast("请输入门店搜索关键字");
            }
            this.s_searchValue = s_value;
            let {b_index} = this.state;
            this.f_requestName((data)=>{
                if(!data.data){
                    this.setState({a_list:[],b_allLoaded:true,b_index:!b_index});
                    return;
                }
                let list = data.data.data || [];
                let pageCount = data.data.pageCount;
                this.setState({a_list:list,b_allLoaded:pageCount<=1,b_index:!b_index});
            });
        }
        componentDidMount(){
            if(n_lat && n_lon){
                let s_json = `http://apis.map.qq.com/ws/geocoder/v1/?location=${n_lat},${n_lon}&coord_type=1&key=${Com.MAP_KEY}&callback=setLocation&output=jsonp`;
                window.setLocation = (ret)=>{
                    if(parseInt(ret.status) === 0){
                        let address = ret.result.address || "";
                        if(address){
                            this.setState({s_location:address});
                        }
                    }else {
                        this.setState({s_location:'获取当前位置信息失败'});
                    }
                }
                Com.jsonP(s_json);
                //软键盘搜索事件
                this.refs.search.addEventListener("keypress",(e)=>{
                    if(parseInt(e.keyCode) === 13){
                        this.f_search();
                    }
                });
            }else {
                this.setState({s_location:'获取当前位置信息失败'});
            }
        }
        //进入门店首页
        f_toShopIndex(shop_id,data){
            if(s_from != 1){
                Com.openWin("index",{shop_id:shop_id,isFrom:1});
            }else{
                Com.sendEvt('shop_all_select',{data:data});
                Com.closeWin();
            }
        }
        //查看店铺位置
        f_openMap(shop_map_x,shop_map_y,shop_name,shop_address){
            Com.openMap(shop_map_x,shop_map_y,shop_name,shop_address);
        }
        //上拉
        f_pullUpScroll(scroll,i_curPage){
            let {a_list,b_allLoaded,b_search} = this.state;
             let s_value = this.s_searchValue;
            let f_scroll = (b_search && s_value)?this.f_requestName:requestData;
            f_scroll((data)=>{
                let {shop_list,page} = data;
                if(b_search && s_value){
                    shop_list = data.data.data ||[];
                    page = data.data.pageCount;
                }
                a_list = a_list.concat(shop_list);
                b_allLoaded = i_curPage==page;
                this.setState({a_list:a_list,b_allLoaded:b_allLoaded});
                scroll.endScroll(i_curPage==page);
            },i_curPage,true);
        }
        render(){
            let {a_list,b_allLoaded,b_search,s_location,b_index} = this.state;
            let e_list = null;
            if(a_list && a_list.length>0){
                e_list = a_list.map((item,key)=>{
                    let {shop_name,distance="",shop_address="",shop_fixed_phone,shop_map_x,shop_map_y,shop_id,shop_img} = item;
                    return <section key={key} className="shopList base-mT10 base-mB10">
                            <div className="shopHeader" onClick={()=>this.f_toShopIndex(shop_id,item)}>
                                <img className="base-transY" src={Com.XBOX_UPLOAD_PATH+shop_img} onError={(ev)=>ev.target.src=require('store_indexIconImg')}/>
                                {shop_name}
                                <span className="base-fr">{distance?parseFloat(distance/1000).toFixed(2)+"km":""}</span>
                            </div>
                            <div className="shopAddress">
                                {shop_address}
                            </div>
                            <div className="shopType">
                                <span onClick={()=>this.f_openMap(shop_map_x,shop_map_y,shop_name,shop_address)}>
                                    <img src={address_sed_infoImg} />查看门店位置
                                </span>

                                <span> <a href={`tel:${shop_fixed_phone}`} /><img src={store_home_telImg} />电话</span>
                            </div>
                        </section>;
                });
                e_list = <Scroll i_index={`${b_index}`} b_allLoaded={b_allLoaded} f_pullUpScroll={(scroll,i_curPage)=>this.f_pullUpScroll(scroll,i_curPage)}>
                            {e_list}
                        </Scroll>;
            }else if(a_list && a_list.length===0){
                e_list = <NotData />;
            }
            return (
                <div className="shop_all">
                    <div className="comSearch">
                        <div className={b_search?"location opacity_0":"location"}>
                            <img src={require('address_iconImg')} className="addIcon" />{s_location}
                            <img src={require('searchIconImg')} className="searchBtn base-fr" onClick={()=>this.show_search()} />
                        </div>
                        <div className={b_search ? "fixedSearch anim" :"fixedSearch n_anim"}>
                            <input type="search" ref="search" placeholder={"输入门店名关键字"}/>
                            <img src={require('searchIconImg')} className="searchBtn base-transY" onClick={()=>this.f_search()}/>
                        </div>
                    </div>
                    {e_list}
                </div>
             );
        }
    };
    //请求数据
    function requestData(callBack,curPage=1,b_isNoShowProgress) {
        Com.postNormal({act:'shop_list',op:'getShopList',lat:n_lat,lon:n_lon,curpage:curPage,pagesize:PAGE_SIZE},function(res){
            if(parseInt(res.code) === 0){
                callBack(res.data);
            }else{
                Com.toast(res.msg);
            }
        },b_isNoShowProgress);
    }
    wxLocation.init((o_data)=>{
        if(o_data){
            n_lat = o_data.lat;
            n_lon = o_data.lon;
        }
        requestData((data)=>{
            ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
        });
    });
});
