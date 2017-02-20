/*
 * @Author: 黄权
 * @Date:   2016-12-09 16:08:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-09 16:57:10
 * 全部门店列表
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("物流详情");
    require("order_logisticsDetailsCss");
    let LabelInput = require('labelInput');
    let up_listImg = require('up_listImg');
    let Scroll = require('scroll');
    let order_id = Com.getPageParams("order_id");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        render(){
            let {express_name,shipping_code,deliver_info} = this.props.data;
            let e_list = null;
            if(deliver_info && deliver_info.length>0){
                deliver_info.reverse();
                e_list = deliver_info.map((item,key)=>{
                    item = item.split("&nbsp;&nbsp;");
                   return  <tr key={key}>
                               <td className="f_one">{key===0?"物流跟踪：":""}</td>
                               <td className="f_two">
                                   {item[0]}
                                   <p>{item[1]?item[1]:""}</p>
                                   <div className="logIco">
                                       <img src={up_listImg} />
                                   </div>
                               </td>
                           </tr>;
                });
            }
            return (
                <div className="order_logisticsDetails">
                    <LabelInput s_left={"物流公司："} s_right={express_name?express_name:"暂无数据"} b_right={true} b_line={true} />
                    <LabelInput s_left={"物流单号："} s_right={shipping_code?shipping_code:"暂无数据"} b_right={true} b_line={true} />
                    <Scroll>
                        <table className="logistics_list">
                            <tbody>
                            {e_list}
                            </tbody>
                        </table>
                    </Scroll>
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"member_order",op:"search_deliver",order_id:order_id},function(res){
        if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl data={res.data}/>,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});