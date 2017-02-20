
'use strict';
Com.ready(function(){
    let store_alias = Com.getPageParams("store_alias");
    let privew = Com.getPageParams("privew");
    let tid = Com.getPageParams("tid");
    let shop_id = Com.getPageParams("shop_id");
    let Goods_list = require('goods_list');
    let Scroll = require('scroll');
    let GoodsSpecLayer = require('goodsSpecLayer');
    let e_goodsSpecLayer = null;
    let WxLocation = require('wxLocation');
    let isFrom = Com.getPageParams('isFrom',window.parent.location.href);
    let offsetHeight = document.body.offsetHeight;
    let localHeight = parseInt(Com.getLocalData('index_offsetHeight')) || 0;
    if(offsetHeight < localHeight){
        offsetHeight = localHeight;
    }
    Com.setLocalData('index_offsetHeight',offsetHeight);
    // let redirect;
    let isPc = Com.b_pc;
    let o_outPut = {
        colums:require('colums'),
        goods:Goods_list,
        goods_list:Goods_list,
        image_gg:require('image_gg'),
        link:require('link'),
        'link-wrap':require('link_wrap'),
        nav:require('nav'),
        notice:require('notice'),
        rich_text:require('rich_text'),
        search:require('search'),
        showcase_selection:require('showcase_selection'),
        text_nav:require('text_nav'),
        store:require('store'),
        title:require('title'),
        white:require('white'),
        magic_cube:require('magic_cube')
    };
    let TopBar = require('topBar');
    TopBar.create("商城首页");
    require("storeIndexCss");
    let AttendHeader = require("attendHeader");
    let BottomNav = require('bottomNav');
    let b_hasSetHead = false;
    let rem_tid;
    let shop_name;
    let locationPos = Com.getLocalData('locationPos');

    class ShopCon extends  React.Component {
        constructor(props){
            super(props);
            this.state = {
                list:Com.getLocalData('locationData'),
                address:Com.getLocalData('address') || '地址获取中...',
            }
        }
        componentDidMount(){
            // let {is_homepage} = this.props;  || parseInt(is_homepage) === 0
            if (parseInt(isFrom) === 1) {
                return null;
            }
            let _this = this;
            if(!Com.getLocalData('locationData') || !window.parent.f_wxLocation){//微页面
                  WxLocation.init((res)=>{
                        if(res){
                            let {lat,lon} = res;
                            Com.getNormal({act:'location',op:'index',lat:lat,long:lon},(res)=>{
                                if(parseInt(res.code) === 0){
                                    let list = res.data.list;
                                     Com.getAddress(lat,lon,(res)=>{
                                         if(res.status === 0){
                                            Com.setLocalData('curCity',res.result.ad_info.city);
                                            Com.setLocalData('address',res.result.address_component.street_number);
                                            _this.setState({list:list,address:res.result.address_component.street_number});
                                        }else{
                                            _this.setState({address:'获取地理位置失败'});
                                        }
                                    });
                                    Com.setLocalData('locationPos',{lat:lat,lon:lon});
                                    Com.setLocalData('locationData',res.data.list);
                                }
                            },true,true);
                        }
                    });
            }
        }
        change(){
            Com.openWin('change_address');
        }
        render(){
            let {is_homepage} = this.props;
            if (parseInt(isFrom) === 1 || parseInt(is_homepage) === 0) {
                return null;
            }
            let {address,list} = this.state;
            if(list && list.hasOwnProperty("length") && list.length > 0){
                if (parseInt(shop_id) !== 0) {
                    shop_name = list[0].shop_name;
                }
            }
            let e_locationIcon = address? <img src={require('shopC_shopIndex_locationImg')} /> : null;
            return <div className="location" onClick={()=>this.change()}>
                    <div className="addressInfo">
                        {e_locationIcon}
                        <span className="addStoreName base-ellipsis">{address || '获取地理位置失败'}</span>（{shop_name || "附近门店：无"}）
                        <img src={require('icon_downImg')} alt=""/>
                    </div>
                </div>;
        }
    }
    function f_buy(goods_alias) {
        if(e_goodsSpecLayer){
            e_goodsSpecLayer.setState({b_show:true,goods_alias:goods_alias});
        }
    }
    //页面组件
    class PageEl extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                a_pageData:null,
                a_bottomNav: null,
                is_homepage:!window.parent.f_wxLocation ? 1: 0,//微页面显示头部
            }
        }
        componentDidUpdate(prevProps,prevState){
            let i_attendHeader = 0;
            if(document.querySelector(".storeIndex .attendHeader")){
                i_attendHeader = document.querySelector(".storeIndex .attendHeader").offsetHeight;
            }
            let i_bottom = 0;
            if(document.querySelector(".storeIndex .bottomNav")){
                i_bottom = document.querySelector(".storeIndex .bottomNav").offsetHeight;
            }
            document.querySelector(".storeIndex .scroll").style.height = offsetHeight - i_attendHeader - i_bottom +"px";
        }
        componentDidMount(){
            //请求数据
            e_goodsSpecLayer = this.refs.goodsSpecLayer;
            let o_params = {op:"page",store_alias:store_alias,privew:privew,tid:tid};
            let shop_id = this.props.shop_id || Com.getPageParams("shop_id");
            if(shop_id>0){
                o_params['act'] = "custom_shop";
                o_params['shop_id'] = shop_id;
            }else{
                o_params['act'] = "custom";
            }
            Com.getJsonP(o_params,(res)=>{
                let {content,is_homepage} = res;
                this.setState({a_pageData:res,is_homepage:is_homepage});
                //作为父窗口时底部若有菜单
                if(window.self === window.top && content[0] && (content[0].data.hasMenu==="true" || content[0].data.hasMenu === true)){
                    Com.getJsonP({act:"custom",op:"page_nav",store_alias:store_alias,shop_id:shop_id},(ret)=>{
                        let list = ret.list?ret.list:[];
                        this.setState({a_bottomNav:list});
                    });
                }
                if(isPc){
                    document.documentElement.style.fontSize = '32px';
                    window.addEventListener('resize', function(e) {
                        clearTimeout(rem_tid);
                        rem_tid = setTimeout(()=>{
                            document.documentElement.style.fontSize = '37.5px';
                        }, 310);
                    }, false);
                    window.addEventListener('pageshow', function(e) {
                        if (e.persisted) {
                            clearTimeout(rem_tid);
                            rem_tid = setTimeout(()=>{
                                document.documentElement.style.fontSize = '37.5px';
                            }, 310);
                        }
                    }, false);
                }
            });
        }
        render(){
            let {a_pageData,a_bottomNav,is_homepage} = this.state;
            let e_content = null;
            let e_bottom = null;
            let s_globalBackGroundColor = null;
            let s_qrcode = a_pageData && a_pageData.wechat.qrcode;
            //自定义页面数据
            if(a_pageData){
                let {content,goods,goods_class} = a_pageData;
                if(content && content.length>0){
                    e_content = content.map((item,index)=>{
                        let {data,type} = item;
                        if(type === "config"){
                            let {title,background,desc} = data;
                            if(!b_hasSetHead){
                                window.parent.document.title = document.title = title;
                                s_globalBackGroundColor = background || "#ffffff";
                                let e_style = document.createElement("style");
                                e_style.type = "text/css";
                                e_style.innerHTML = `.diy-container>div{background:${s_globalBackGroundColor}}`;
                                document.querySelector("head").appendChild(e_style);
                                document.querySelector("head").insertAdjacentHTML("beforeEnd",'<meta name="description" content='+desc+'>');
                                b_hasSetHead = true;
                            }
                            return null;
                        }else {
                            let Component = null;
                            if(o_outPut[type]){
                                Component = o_outPut[type];
                                //处理数据
                                if(type === 'goods'){
                                    let {goods_list} = data;
                                    data["f_buy"] = f_buy;
                                    if(goods_list && goods_list.length !==0){
                                        goods_list.forEach((item1,index1)=>{
                                            let goods_alias = item1.goods_alias;
                                            goods[goods_alias] && (goods_list[index1] = goods[goods_alias]);
                                        });
                                    }
                                }
                                if(type === 'goods_list'){
                                    let class_id = data.goods_class.id;
                                    data.goods_list = [];
                                    data["f_buy"] = f_buy;
                                    if(class_id && goods_class[class_id]){
                                        let goods_count = data.goods_count || 0;
                                        let a_goodsList = goods_class[class_id].slice(0,goods_count);
                                        a_goodsList.forEach((item1,index1)=>{
                                            let o_goods = goods[a_goodsList[index1]];
                                            if(o_goods){
                                                data.goods_list.push(o_goods);
                                            }
                                        });
                                    }
                                }
                                if(type === 'link'){
                                    let list = data.list;
                                    list.forEach((item1,index1)=>{
                                        let {stc_id,source_type,count} = item1;
                                        if(source_type === 'link'){
                                            return;
                                        }
                                        item1.goods_list = [];
                                        if(stc_id && goods_class[stc_id]){
                                            let goods_count = count || 0;
                                            let a_goodsList = goods_class[stc_id].slice(0,goods_count);
                                            a_goodsList.forEach((item2,index2)=>{
                                                let o_goods = goods[a_goodsList[index2]];
                                                if(o_goods){
                                                    let {goods_name,goods_alias} = o_goods;
                                                    item1.goods_list.push({goods_name,goods_alias});
                                                }
                                            });
                                        }
                                    });
                                }
                                return <Component key={index} data={data} background={s_globalBackGroundColor}/>;
                            }
                            return null;
                        }
                    });
                }
            }
            let shop_id = this.props.shop_id || Com.getPageParams("shop_id",window.parent.location.href);
            //若有底部菜单
            if(a_bottomNav && a_bottomNav.length>0){
                e_bottom = <BottomNav list={a_bottomNav} shop_id={shop_id} isFrom={isFrom}/>;
            }
            return (
                <div className="storeIndex">
                    <AttendHeader />
                    <Scroll b_needRefresh={true}>
                        <ShopCon is_homepage={is_homepage}/>
                        <div className="diy-container">
                            {e_content}
                        </div>
                    </Scroll>
                    {e_bottom}
                    <GoodsSpecLayer ref="goodsSpecLayer" all_com_goods={a_pageData?a_pageData.goods:{}} goods_alias="" i_type={2} b_twoBtn={true}/>
                    <div className="store_code">
                        <img src={s_qrcode} />
                        <p className="base-tc">欢迎扫码关注官方微信公众号</p>
                    </div>
                </div>
             );
        }
    };
    if(!window.parent.f_wxLocation){//微页面
        WxLocation.init((res)=>{
            if(res){
                let {lat,lon} = res;
                Com.getNormal({act:'location',op:'index',lat:lat,long:lon},(res)=>{
                    if(parseInt(res.code) === 0){
                        let list = res.data.list;
                        let shop_id = 0;
                        if(list && list.hasOwnProperty("length") && list.length > 0){
                            shop_id = list[0].shop_id;
                        }
                        ReactDOM.render(<PageEl shop_id={shop_id}/>,document.getElementById('pageCon'));
                    }else{
                        ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
                    }
                },true,true);
            }else{
                ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
            }
        });
    }else{
        ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    }
});
