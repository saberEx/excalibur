'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("会员卡详情");
    require("member_cardDetailCss");
    let cardId = Com.getPageParams("card_id");
    let LabelInput=require("labelInput");
    let FoldItem=require("foldItem");

    //页面组件
    class PageEl extends React.Component {
        render(){
            let {description,prerogative,date_info} = this.props.data;
            let items = null;
            if (date_info.type == "DATE_TYPE_FIX_TIME_RANGE") {
                let begin_time = Com.getTimeFormat(date_info.begin_timestamp,0);
                let end_time = Com.getTimeFormat(date_info.end_timestamp,0);
                items = begin_time+" 至 "+end_time;
            }else{
                items = "永久有效";
            }
            return (
                <div className="member_cardDetail">
                    <LabelInput s_left="有效期" s_right={items} b_right={true}  b_isInput={false}  b_line={true} />
                    <FoldItem s_title="特权说明" >
                        {prerogative || "暂无"}
                    </FoldItem>
                    <FoldItem s_title="使用说明" >
                        {description || "暂无"}
                    </FoldItem>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"member_wx_card",op:"details",card_id:cardId},(res)=>{
        if(res.code === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});
