'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("我的余额");
    require("member_balanceCss");
    let BalanceList = require('balanceList');
    let NotData = require('notData');
    let cardCode = Com.getPageParams("card_code");
    let PAGE_SIZE = 15;
    let curPage = 1;
    let Scroll = require('scroll');
    let _self = null;
    let scroll_h = document.body.offsetHeight - Com.getPxReality(120);
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {datas:this.props.list};
        }
        f_pullUpScroll(scroll){
            requestData((o_data)=>{
                let curList = o_data;
                let totalList = _self.state.datas.concat(curList);
                let b_hasmore = curList.length === 0 ? true : false;
                _self.setState({datas:totalList});
                scroll.endScroll(b_hasmore);
            },true);
        }
        render(){
            let {datas} = this.state;
            let items = null;
            if (datas.length == 0) {
                items = <NotData/>;
            }else{
                items = <Scroll f_pullUpScroll={this.f_pullUpScroll} style={{height:scroll_h}}>
                            <BalanceList a_data={datas}/>
                        </Scroll>;
            }
            return (
                <div className="member_balance">
                    <div className="myInt base-mB10">
                        <p className="newInt">当前余额</p>
                        <h3 className="intNum"><em>￥</em>{this.props.balance}</h3>
                    </div>
                    {items}
                </div>
             );
        }
    };
    //请求数据
    function requestData(f_callBack,b_noShow){
        Com.getNormal({act:"member_wx_card",op:"balance",card_code:cardCode,pagesize:PAGE_SIZE,curpage:curPage},function(res){
            if(res.code === 0){
                 if (res.data.list) {
                    let list = res.data.list;
                    if (list.length != 0) {
                        curPage++;
                    }
                    f_callBack(list);
                }
            }else{
                Com.toast(res.msg);
            }
        },b_noShow);
    }
    Com.getNormal({act:"member_wx_card",op:"index",card_code:cardCode},(res)=>{
        if(res.code === 0){
            let total_balance = res.data.total_balance;
            requestData((list)=>{
                _self = ReactDOM.render(<PageEl balance={total_balance} list={list}/>,document.getElementById('pageCon'));
            },false);
        }else{
            Com.toast(res.msg);
        }
    },false,true);
});
