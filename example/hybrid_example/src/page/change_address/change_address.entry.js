'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("选择地址");
    require("change_addressCss");
    // let redirect = Com.getPageParams('redirect');
    let curShop_id = Com.getPageParams('shop_id');
    let Scroll = require('scroll');
    let scroll_h = document.body.offsetHeight;
    // let curUrl = Com.getPageParams('curUrl',unescape(window.parent.location.href));
    let _self = null;
    let region = Com.getPageParams('region') || "深圳市";
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                data:null
            }
        }
        componentDidMount(){
            //软键盘搜索事件
            this.refs.search.addEventListener("keypress",(e)=>{
                if(parseInt(e.keyCode) === 13){
                    if (this.refs.search.value) {
                      this.f_search();
                    }else{
                      Com.toast("请输入地址");
                    }
                }
            });
        }
        f_search(){
            if (this.refs.search.value) {
                Com.searchKey(this.refs.search.value,region,function(res){
                    _self.setState({data:res});
                });
            } else{
                _self.setState({data:null});
            }
        }
        addressSelect(item){
           if (item) {
              let {lat,lng} = item.location;
              Com.getNormal({act:'location',op:'index',lat:lat,long:lng},(res)=>{
                 if(parseInt(res.code) === 0){
                     Com.setLocalData('locationData',res.data.list);
                     Com.setLocalData('locationPos',{lat:lat,lon:lng});
                     Com.setLocalData('address',item.title);
                     // Com.sendEvt('change_address',{data:item});
                     let list = res.data.list;
                     if (list && list.hasOwnProperty("length") && list.length >0) {
                            Com.openWin("index",{shop_id:list[0].shop_id});
                     }else{
                        Com.openWin("index",{shop_id:0});
                     }
                 }else{
                    Com.setLocalData('locationData',[]);
                    Com.setLocalData('address',item.title);
                    // Com.sendEvt('change_address',{data:item});
                    Com.openWin("index",{shop_id:0});
                 }
              });
           }
        }
        render(){
            let {data} = this.state;
            let e_list = null;
            if (data && data.status === 0) {
                e_list = data.data.map((item,key)=>{
                    return  <div key={key} onClick={()=>_self.addressSelect(item)} className="addressList base-iconRight">
                                 {item.title}
                              </div>

                });
            }
            return (
                <div className="change_address">
                    <div className="fixedSearch anim">
                        <input type="search" ref="search" onChange={()=>this.f_search()} placeholder={"输入地址关键字"}/>
                        <img src={require('searchIconImg')} className="searchBtn base-transY" onClick={()=>this.f_search()}/>
                    </div>
                    <Scroll style={{height:scroll_h}}>
                        {e_list}
                    </Scroll>
                </div>
             );
        }
    };

    //请求数据
    // Com.getNormal({act:"change_address",op:"change_address"},function(res){
    //     if(parseInt(res.code) === 0){
           _self = ReactDOM.render(<PageEl/>,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});




