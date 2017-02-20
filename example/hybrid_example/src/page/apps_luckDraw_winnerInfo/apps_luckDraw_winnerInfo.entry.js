/*
 * @Author: 黄权
 * @Date:   2016-11-9 10:10:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-02 14:18:37
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("中奖记录");
    let NotData = require('notData');
    require("apps_luckDraw_winnerInfoCss");
    let LabelInput = require('labelInput');
    let i_drawId = Com.getPageParams("id");
    class Item extends React.Component {
        _clickHandler(){
            let {issue,status,id} = this.props.data;
            if(parseInt(issue) === 1 && parseInt(status) === 0){
                Com.openWin('apps_luckDraw_winnerInfoUp',{id:i_drawId,winnerId:id});
            }
        }
        render(){
            let {issue,status,levelName,reawardName,addtime,expressInfo} = this.props.data;
            status = parseInt(status);
            let info = "";
            if(parseInt(issue) === 1){
                if(status === 1){
                    info = "奖品待发货";
                }else if(status === 2) {
                    info = expressInfo?expressInfo:"奖品已发货";
                }else{
                    info = "点击完善收货资料 >>";
                }
            }else{
                info = "现场发奖";
            }
            return <div className="itemWinning" onClick={()=>this._clickHandler()}>
                    <h3 className="rewardDetail"> 
                        <LabelInput s_left={levelName} s_right={reawardName} b_right={true} />
                    </h3>
                    <p className="rewardInfos">
                        <span>{info}</span>
                        <span className="base-fr">{Com.getTimeFormat(addtime,2)}</span>
                    </p>
                </div>;
        }
    }
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {data:this.props.data};
        }
        componentDidMount(){
            let self = this;
            Com.addEvt('apps_luckDraw_winnerInfoUp',(res)=>{
                if(parseInt(res.b_update) === 1){
                    requestData((data)=>{
                        self.setState({data:data});
                    })
                }
            })
        }
        render(){
            let {data} = this.state;
            let e_list = null;
            let i_len = 0;
            if(data && data.length>0){
                i_len = data.length;
                e_list = data.map((item,key)=>{
                    return <Item key={key} data={item}/>;
                });
            }else{
                return <NotData s_content="暂无中奖纪录"/>;
            }
            return (
                <div className="apps_luckDraw_winnerInfo">
                    <section className="history base-mB10">
                        <LabelInput s_left={"我的历史中奖记录"} s_right={`我的奖品${i_len}件`} b_right={true}  />
                    </section>
                    <section className="winningList">
                        {e_list}
                    </section>
                </div>
             );
        }
    };
    //请求数据
    function requestData(f_callback){
        Com.postVerify({act:"activity_luck",op:"winnerData",id:i_drawId,memberId:Com.getCookie("member_id")},function(res){
            if(parseInt(res.code) === 0 || parseInt(res.code) === 1){
                f_callback(res.data.data);
            }else{
                Com.toast(res.msg);
            }
        });
    }
    requestData((data)=>{
        Com.setLocalData('apps_luckDraw_winnerInfoUp',null);
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});
