/*
 * @Author: 黄权
 * @Date:   2016-10-22 16:00:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-12-28 15:15:22
 */
'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    let CityPicker = require('cityPicker');
    TopBar.create("新增收货地址");
    require("address_editCss");
    let LabelInput = require('labelInput');
    let BlockFixedBtn = require('blockFixedBtn');
    let data = Com.getPageParams("data");
    data = data? JSON.parse(data):{};
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                s_areaInfo:""
            };
        }
        f_submit(){
            let {address_id,true_name,mob_phone="",area_info,address,city_id,area_id} = data;
            let {trueName,mobPhone,e_address} = this.refs;
            true_name = trueName.getValue();
            mob_phone = mobPhone.getValue();
            address = e_address.getValue();
            if(!true_name){
                return Com.toast("收货人不能为空!");
            }
            if(!mob_phone){
                return Com.toast("联系电话不能为空!");
            }
            if(!Com.checkMobile(mob_phone)){
                return Com.toast("请填写11位手机号码!");
            }
            if(!area_info){
                return Com.toast("请选择省市区!");
            }
            if(!address){
                return Com.toast("详细地址不能为空");
            }
            var o_params = {act:'member_address',true_name:true_name,mob_phone:mob_phone,area_info:area_info,address:address,tel_phone:0,city_id:city_id,area_id:area_id}
            if(data.hasOwnProperty("address_id")){ //编辑
                o_params['address_id'] = address_id;
                o_params['op'] = 'address_edit';
            }else {  //新增
                o_params['op'] = 'address_add';
            }
            Com.postVerify(o_params,(res)=>{
                if(parseInt(res.code) === 0){
                    Com.sendEvt('address_edit',{b_update:1});
                    Com.closeWin();
                }else {
                    Com.toast(res.msg);
                }
            });
        }
        f_input(value){
            if(value.length>11){
                this.refs.mobPhone.setValue(value.slice(0,11));
            }
        }
        f_confirm(province,city,area,city_id,area_id){
            data["area_info"] = `${province}${city}${area}`;
            data["city_id"] = city_id;
            data["area_id"] = area_id;
            this.refs.cityPicker.toggle();
            this.setState({s_areaInfo:`${province}${city}${area}`});
        }
        f_showPicker(){
            this.refs.cityPicker.toggle();
        }
        render(){
            let {true_name="",mob_phone="",area_info="",address=""} = data;
            let {s_areaInfo} = this.state;
            return (
                <div className="address_edit">
                    <LabelInput s_left="收货人：" ref="trueName" b_isInput={true} b_line={true} s_value={true_name} s_right="您的姓名"/>
                    <LabelInput s_left="联系电话：" ref="mobPhone" b_isInput={true} s_inputType="number" b_line={true} s_value={mob_phone} s_right="您的电话" onInput={(value)=>this.f_input(value)}/>
                    <LabelInput s_left="省、市、区：" onClick={()=>this.f_showPicker()} b_line={true} b_right={true} s_right={s_areaInfo?s_areaInfo:area_info}/>
                    <LabelInput s_left="详细地址：" ref="e_address" b_isInput={true} s_value={address} s_right="详细地址"/>
                    <CityPicker ref="cityPicker" f_confirm={this.f_confirm.bind(this)}/>
                    <BlockFixedBtn s_label={'保存'} onClick={()=>this.f_submit()}/>
                </div>
             );
        }
    };
    //请求数据
    ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
});
