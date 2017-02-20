/*
 * @Author: 黄权
 * @Date:   2016-12-15 10:05:26
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-19 15:28:33
 * 所有商品页
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("全部商品");
    require("goods_allCss");
    let Scroll = require('scroll');
    let NumBox = require('numBox');
    let addGoodsImg = require('addGoodsImg');
    let error_img = require('shopC_goodDefaultImg');
    let member_id = Com.getCookie("member_id");
    let ActionSheet = require("actionSheet");
    let NotData = require('notData');
    let e_cartEl = null;
    let e_actionSheet = null;
    let stc_header = [];
    let r_scroll_y=null;
    let is_scroll=false;
    let WxShare = require('wxShare');
    //左侧分类组件
    class StcEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {index:0};
        }
        //点击分类回调
        f_click(key){
            this.setState({index:key},()=>{
                if(stc_header[key] || stc_header[key]===0){
                    this.props.f_rightScroll(stc_header[key]);
                }
            });
        }
        render(){
            let {index} = this.state;
            //类名
            let e_stc = this.props.data.map((item,key)=>{
                let {stc_name} = item;
                return <li key={key} className={`${index===key?"active":""}`} onClick={()=>{this.f_click(key)}}>
                    <a className="base-ellipsis" href="javascript:void(0)">{stc_name}</a>
                </li>;
            });
            return <div className="leftMenu">
                <Scroll >
                    <ul className="classList">
                        {e_stc}
                    </ul>
                </Scroll>
            </div>;
        }
    }
    //商品组件
    class GoodsItem extends React.Component {
        constructor(props){
            super(props);
            this.state={b_click:false};
        }
        f_check(e,index,data){
            /*function getXY(Obj)  {
              var h = Obj.offsetHeight;
              for (var sumTop=0,sumLeft=0;Obj!=document.body;sumTop+=Obj.offsetTop,sumLeft+=Obj.offsetLeft, Obj=Obj.offsetParent);
              sumTop = h+sumTop;
              return {left:sumLeft,top:sumTop}
            }
            let imgEle=document.getElementById('img_'+index);
            let img_width=imgEle.width;
            let img_height=imgEle.height;
            let img_postion=getXY( imgEle ); console.log(img_postion);
            let top;
            if (r_scroll_y &&r_scroll_y !=0) {
                top=img_postion.top - Math.abs(r_scroll_y) -img_height;
            }else{

                top=img_postion.top-img_height;
            }
            alert(top);
            var animate_img=document.createElement('img');
            animate_img.className="img_anim_key";
            animate_img.src=Com.getGoodsImg(data.goods_image);
            animate_img.style.cssText="left:"+img_postion.left+"px;top:"+top+"px;width:"+img_width + 'px;height:'+img_height+"px;";
            document.body.appendChild(animate_img);
            setTimeout(function(){
                document.querySelector(".img_anim_key").remove();
            }, 600);// document.body.scrollHeight*/
            let {goods_alias} = this.props.data;
            this.setState({b_click:true},()=>{
                if(e_cartEl){
                    let {i_addNum,o_goodsAdd} = e_cartEl.state;
                    o_goodsAdd[goods_alias] = 1;
                    e_cartEl.setState({i_addNum:parseInt(i_addNum)+ 1,o_goodsAdd:o_goodsAdd});
                }
            });
        }
        //点击看商品详情
        f_goodsDetails(){
            let {goods_alias} = this.props.data;
            Com.openWin("goodDetails",{goods_alias:goods_alias});
        }
        //数量改变
        f_changeNum(value){
            value = parseInt(value);
            let {goods_alias} = this.props.data;
            if(value === 0){
                this.setState({b_click:false});
            }
            if(e_cartEl){
                let {i_addNum,o_goodsAdd} = e_cartEl.state;
                let i_curGoodOldAddNum = 0; //当前商品上一次已加入的数量
                if(o_goodsAdd[goods_alias]){
                    i_curGoodOldAddNum = parseInt(o_goodsAdd[goods_alias]);
                }
                o_goodsAdd[goods_alias] = value;
                e_cartEl.setState({i_addNum:parseInt(i_addNum)+ value - i_curGoodOldAddNum,o_goodsAdd:o_goodsAdd});
            }
        }
        render(){
            let {goods_image,goods_name,goods_storage,goods_price,goods_spec} = this.props.data;
            goods_spec = goods_spec || {};
            let {b_click} = this.state;
            let s_spec = "";
            for(let i in goods_spec){
                if (goods_spec.hasOwnProperty(i)) {
                    s_spec += goods_spec[i]+' ';
                }
            }
            return <li >
                <a onClick={()=>this.f_goodsDetails()}>
                    <img className="goodsImg" data-index={this.props.data_index} id={'img_'+this.props.data_index} src={Com.getGoodsImg(goods_image)} onError={(ev)=>ev.target.src=error_img}/>
                    <div className="goodsTit base-ellipsis">{goods_name}</div>
                    <div className="goodsType base-ellipsis">
                        库存：{goods_storage} {s_spec?" 规格："+s_spec:s_spec}
                    </div>
                    <div className="goodsPrice"><em>￥</em> {goods_price}</div>
                </a>
                <div className="fixedAdd base-transY">
                    {goods_storage>0?(b_click? <NumBox i_max={parseInt(goods_storage)} i_value={1} f_callBack={(value)=>this.f_changeNum(value)}/>:<img src={addGoodsImg} onClick={(e,index,data)=>this.f_check(this,this.props.data_index,this.props.data)}/>):null}
                </div>
            </li>;
        }
    }
    //加入购物车组件
    class CartEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {i_addNum:0,o_goodsAdd:{},b_notShow:this.props.b_notShow,cart_num:parseInt(this.props.cart_num) || 0};
        }
        //批量加入购物车
        f_addCart(){
            let {o_goodsAdd,i_addNum,cart_num} = this.state;
            if(i_addNum<=0){
                if(cart_num<=0){
                    return Com.toast("请选择商品");
                }else {
                    Com.openWin('myShopCart');
                }
            }
            let a_goods = [];
            for(let i in o_goodsAdd){
                let num = o_goodsAdd[i];
                if(num>0){
                    a_goods.push(`${i}-${num}`);
                }
            }
            Com.postVerify({act:"member_cart",op:"cart_add_batch",goods_list:a_goods.join(",")},(res)=>{
                if(parseInt(res.code)===0){
                    let shop_id = parseInt(res.data.shop_id);
                    if(!shop_id && shop_id !== 0){
                        Com.openWin('myShopCart');
                    }else{
                        if(e_actionSheet){
                            e_actionSheet.shopCar_goods = a_goods.join(",");
                            e_actionSheet.toggle();
                        }
                    }
                }else if(parseInt(res.code)===1) { //库存不足商品列表
                    let a_data = res.data;
                    let s_info = "";
                    if(a_data.length>0){
                        a_data.forEach((item)=>{
                            s_info = s_info + Com.getSpliceStr(item.goods_name,6) + " 库存："+item.goods_storage+";\n";
                        });
                    }
                    Com.confirm("以下商品库存不足：\n"+ s_info,()=>{
                        Com.postVerify({act:"member_cart",op:"cart_add_batch",goods_list:a_goods.join(","),is_delete:1},(ret)=>{
                            if(parseInt(ret.code) === 0){
                                let shop_id = parseInt(res.data.shop_id);
                                if(!shop_id && shop_id !== 0){
                                    Com.openWin('myShopCart');
                                }else{
                                    if(e_actionSheet){
                                        e_actionSheet.shopCar_goods = a_goods.join(",");
                                        e_actionSheet.toggle();
                                    }
                                }
                            }else {
                                Com.toast(ret.msg);
                            }
                        });
                    });
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        componentDidMount(){
            e_cartEl = this;
        }
        render(){
            let {i_addNum,cart_num,b_notShow} = this.state;
            return <div className={`shopCar ${b_notShow?"base-hide":""}`}>
                    <div className="base-positionRel">
                        <span className="shopNum">{parseInt(i_addNum)+cart_num}</span>
                        <img src={require('shopC_shopCarImg')} onClick={()=>this.f_addCart()}/>
                    </div>
                </div>;
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state={isList:true,b_search:false,};
        }
        //将来等添加的头部
      /*  tabClick(e){
            this.setState({isList:!this.state.isList});
        }
        pullUpScroll(){
            console.log(123);
        }
        show_search(){
            this.refs.search.value = '';
            this.setState({b_search:true});
        }
        f_search(){
            let s_value = this.refs.search.value;
            this.setState({b_search:false});
        }*/
        componentDidMount(){
            e_actionSheet = this.refs.actionSheet;
            let a_header = document.querySelectorAll(".stc_header");
            for(let i in a_header){
                if(a_header.hasOwnProperty(i)){
                    stc_header.push(a_header[i].offsetTop);
                }
            }
            let _self = this;
            let l_stc_header = stc_header.length;
            this.refs.r_scroll.myScroll.on("scrollEnd",function(){
                let l_con = _self.refs.l_con;
               /* if (this.y) {
                    r_scroll_y=this.y;
                    is_scroll=true;
                }*/
                for(let i =0;i<l_stc_header;i++){
                    if(i<l_stc_header-1){
                        if(-stc_header[i]<this.y){
                            l_con.setState({index:i-1});
                            break;
                        }else if(-stc_header[i] == this.y){
                            l_con.setState({index:i});
                            break;
                        }
                    }else {
                        if(-stc_header[i]>=this.y){
                            l_con.setState({index:i});
                        }else {
                            l_con.setState({index:i-1});
                        }
                    }
                }
            });
        }
        f_deleteCard(){
            Com.postVerify({act:"member_cart",op:"cart_add_batch",is_drop:1,goods_list:e_actionSheet.shopCar_goods},(res)=>{
                if(res.code === 0){
                    Com.openWin('myShopCart');
                }else{
                    Com.toast(res.msg);
                }
            });
        }
        f_toCard(){
            Com.openWin("myShopCart")
        }
        f_rightScroll(y){
            if(this.refs.r_scroll){
                this.refs.r_scroll.scrollTo(0,-y);
            }
        }
        render(){
            let {stc_list,goods_list,cart_num} = this.props.data;
           /* let aaa = this.state.isList ? "base-trans" :"base-trans hide";
            let bbb = !!this.state.isList ? "base-trans hide" :"base-trans";
            let show_search = this.state.b_search ? "fixedSearch anim" :"fixedSearch n_anim";*/
           console.log(stc_list);
            //商品组
            let e_goods = null;
            if(goods_list.length>0){
                e_goods = goods_list.map((item,key)=>{
                    let {stc_name,list} = item;
                    let e_list = list.map((goodItem,index)=>{
                        return <GoodsItem data={goodItem} key={index} data_index={key+'_'+index}/>;
                    });
                    if (key === goods_list.length-1) {
                        e_list.push(<div className ='blankDiv'></div>);
                    }
                    return <div key={key}>
                        <h2 className="stc_header">{stc_name}</h2>
                        <ul className="goodsList">
                            {e_list}
                        </ul>
                    </div>
                });
            }else {
                e_goods = <NotData />;
            }
            return (
                <div className="goods_all">
                    {/*<div className="goodsHeader">
                        <div className={show_search}>
                            <input type="search" ref="search" placeholder={"输入姓名或编号搜索"}/>
                            <img src={require('searchIconImg')} className="searchBtn base-transY" onClick={()=>this.f_search()}/>
                        </div>
                        <div className="gItem" onClick={()=>this.show_search()}>
                            <img className="base-trans" src={require('all_searchImg')} />
                        </div>
                        <div className="gItem">
                            销量
                        </div>
                        <div className="gItem">
                            时间
                        </div>
                        <div className="gItem">
                            价格
                        </div>
                        <div className="gItem" onClick={()=>this.tabClick()} >
                            <img className={aaa} src={require('tab_offImg')} />
                            <img className={bbb} src={require('tab_onImg')} />
                        </div>
                    </div>*/}
                    <div className="category">
                        <StcEl ref="l_con" data={stc_list} f_rightScroll={(y)=>this.f_rightScroll(y)}/>
                        <div className="rightMenu">
                            <Scroll ref="r_scroll" >
                                {e_goods}
                             </Scroll>
                        </div>
                        <CartEl cart_num={cart_num} b_notShow={goods_list.length===0}/>
                    </div>
                    <ActionSheet ref="actionSheet" a_list={[{s_title:'删除原门店商品',f_onClick:()=>this.f_deleteCard()},{s_title:'进入购物车',f_onClick:this.f_toCard}]}/>
                </div>
             );
        }
    };
    function setGoodsStc(data) {
        let {stc_list,goods_list} = data;
        stc_list = stc_list || [];
        goods_list = goods_list || [];
        stc_list.push({stc_id:'0',stc_name:'未分组'});
        let a_newList = [];
        let a_newStc = [];
        stc_list.forEach((item)=>{
            let {stc_id,stc_name} = item;
            let len = a_newList.length;
            goods_list.forEach((goodData)=>{
                let {goods_stcids} = goodData;
                if(goods_stcids.indexOf(`,${stc_id},`) !== -1 || (stc_id === '0' && goods_stcids === '')){
                    if(!a_newList[len]){
                        a_newStc[len] = item;
                        a_newList[len] = {stc_id:stc_id,stc_name:stc_name,list:[]};
                    }
                    a_newList[len].list.push(goodData);
                }
            });
        });
        data["goods_list"] = a_newList;
        if(a_newStc.length === 0){
            a_newStc.push({stc_id:'0',stc_name:'未分组'});
        }
        data["stc_list"] = a_newStc;
        return data;
    }
    //请求数据
    Com.postNormal({act:"goods",op:"list",mod:"openapi",member_id:member_id},function(res){
        if(parseInt(res.code) === 0){
            let shareParams = {
                baseURL : window.location.href,
                title : "全部商品",
                desc : "全部商品",
                imgUrl : ""
            };
            WxShare.showShare(shareParams);
            let data = setGoodsStc(res.data);
            ReactDOM.render(<PageEl  data={data} />,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
