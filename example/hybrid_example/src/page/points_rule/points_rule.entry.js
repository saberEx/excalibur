/*
 * @Author: 黄权
 * @Date:   2016-12-16 11:05:26
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-16 11:20:10
 * 积分规则
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("积分规则");
    require("points_ruleCss");
    //页面组件
    class PageEl extends React.Component {
        render(){
            let {poster,sign,shoping_return_rate} = this.props.data;
            let {is_start,points_num,points_num_second} = poster;
            let {rule,states} = sign;
            let e_section = null;
            if(is_start == 1 ){
                if(points_num_second >0){
                    e_section = <section className="ruleWrap">            
                            <h4>分享海报获取积分</h4>
                            <h6>通过分享海报，如果您的朋友关注了公众号，则你可以获取相应的积分</h6>
                            <h6>支持分销机制，如果您朋友分享您的海报发展的下级，则您也可以获得相应的积分</h6>
                            <h6>计算规则：一级分享积分为{points_num}积分，二级分享积分为{points_num_second}积分</h6>
                        </section>;
                }else {
                    e_section = <section className="ruleWrap">            
                            <h4>分享海报获取积分</h4>
                            <h6>通过分享海报，如果您的朋友关注了公众号，则你可以获取相应的积分</h6>
                            <h6>计算规则：分享获取{points_num}积分</h6>
                        </section>;
                }
            }
            let e_sign = null;
            if(states==1){
                let s_rule = "";
                rule.forEach((item,key)=>{
                    s_rule += (key+1)+".连续签到"+item["days"]+"天，获得"+item["points"]+"积分奖励；"
                });
                e_sign = <section className="ruleWrap">            
                        <h4>签到获取积分</h4>
                            <h6>通过设置签到活动，连续签到可以获得一定的积分</h6>
                            <h6>计算规则：{s_rule}</h6>
                        </section>;
            }

            return (
                <div className="points_rule">
                    <h2>如何获取积分</h2>
                    <section className="ruleWrap">                        
                        <h4>消费获取积分</h4>
                        <h6>消费者每次消费则可以获得一定的积分，消费越多积分越多</h6>
                        <h6>计算规则：（舍去取整）订单金额 * {shoping_return_rate*100}% = 返积分数</h6>
                    </section>
                    {e_sign}
                    {e_section}

                    <h2>如何消费积分</h2>
                    <section className="ruleWrap">            
                        <h4>兑换礼品</h4>
                        <h6>消费者可以在用户中心中进行兑换礼品，填写地址后，商家可以直接发送到指定地址，也可以到门店进行自提</h6>
                    </section>          
                </div>
             );
        }
    };
    //请求数据
    Com.getNormal({act:"member_points",op:"member_points_rule"},(res)=>{
        if(res.code === 0){
            ReactDOM.render(<PageEl data={res.data} />,document.getElementById('pageCon'));
        }else{
            Com.toast(res.msg);
        }
    });
});