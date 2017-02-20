/*
 * @Author: 黄权
 * @Date:   2016-12-15 09:22:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-15 09:59:39
 * 评论回复页
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("评论回复");
    require("order_assessCss");
    let order_id = Com.getPageParams("order_id") || 0;
    let GoodsGroup = require('goodsGroup');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        render(){
            let data = this.props.data;
            let e_list = null;
            if(data && data.length>0){
                e_list = data.map((item,key)=>{
                   let {geval_goodsimage,geval_goodsname,geval_ordertime,geval_frommembername,geval_addtime,geval_storename,explain_time,geval_content,geval_explain} = item;
                    geval_frommembername = Com.replaceName(geval_frommembername);
                    return <div key={key} className="base-mB10">
                            <div className="buyGoods">
                                <GoodsGroup s_time={"交易成功时间："+Com.getTimeFormat(geval_ordertime,2)} a_goodsList={[{goods_image:geval_goodsimage,goods_name:geval_goodsname,goods_num:"1",goods_price:"0.00"}]} />
                            </div>
                            <ul className="evaList ">
                                <li>
                                    <div className="evaUser">
                                        {geval_frommembername}
                                        <span className="base-fr">{Com.getTimeFormat(geval_addtime,2)}</span>
                                    </div>
                                    <div className="eavDetail">{geval_content}</div>
                                    <div className="store">
                                        <div className="evaUser">{geval_storename}@{geval_frommembername}
                                            <span className="base-fr">{Com.getTimeFormat(explain_time,2)}</span>
                                        </div>
                                        <div className="eavDetail">{geval_explain || ""}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>;
                });
            }
            return (
                <div className="order_assess">
                    {e_list}
                </div>
             );
        }
    };
    //请求数据
    Com.postVerify({act:"member_order",op:"evaluate_reply",order_id:order_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});