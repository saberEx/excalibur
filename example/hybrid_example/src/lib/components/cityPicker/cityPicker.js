/*
 * @Author: 黄权
 * @Date:   2016-10-26 10:50:00
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-10-26 15:26:00
 * 城市三级选择器
 */

'use strict';
import Picker from 'react-mobile-picker';
require("cityPickerCss");
require('city.data');
let a_province = [],a_city = [],a_area = {};
cityData.forEach((item,index)=>{
    a_province.push(item.text);
    a_city[index] = [];
    item.children.forEach((item1,index1)=>{
        a_city[index].push(item1.text);
        a_area[`${index}_${index1}`] = [];
        item1.children.forEach((item2)=>{
            a_area[`${index}_${index1}`].push(item2.text);
        });
    });
});
class CityPicker extends React.Component {
        static propTypes = {
            f_confirm:React.PropTypes.func,//确定选择回调
        }
        constructor(props){
        super(props);
        this.state = {
            b_show:false,
            i_province:0,
            i_city:0,
            i_area:0,
            valueGroups: {
                province: a_province[0],
                city: a_city[0][0],
                area: a_area['0_0'][0]
            },
            optionGroups: {
                province: a_province,
                city: a_city[0],
                area: a_area['0_0']
            }
        };
    }
    handleChange(name, value){
        let {valueGroups,optionGroups,i_province,i_city} = this.state;
        valueGroups[name] = value;
        if(name === "province"){
            let index = a_province.indexOf(value);
            optionGroups["city"] = a_city[index];
            optionGroups["area"] = a_area[`${index}_0`];
            valueGroups["city"] = a_city[index][0];
            valueGroups["area"] = a_area[`${index}_0`][0];
            this.setState({valueGroups,optionGroups,i_province:index,i_city:0});
        }else if(name === "city"){
            let index = a_city[i_province].indexOf(value);
            optionGroups["area"] = a_area[`${i_province}_${index}`];
            valueGroups["area"] = a_area[`${i_province}_${index}`][0];
            this.setState({valueGroups,optionGroups,i_city:index});
        }else {
            let index = a_area[`${i_province}_${i_city}`].indexOf(value);
            this.setState({valueGroups,i_area:index});
        }
    };
    //取消
    f_cancel(){
        this.setState({b_show:false});
    }
    //确定
    f_confirm(){
        this.setState({b_show:false});
        let {f_confirm} = this.props;
        let {i_province,i_city,i_area} = this.state;
        f_confirm && f_confirm(a_province[i_province],a_city[i_province][i_city],a_area[`${i_province}_${i_city}`][i_area],
            cityData[i_province]["children"][i_city].value,cityData[i_province]["children"][i_city]["children"][i_area].value);
    }
    toggle(){
        let {b_show} = this.state;
        this.setState({b_show:!b_show});
    }
    render(){
        let {optionGroups, valueGroups,b_show} = this.state;
        return <div ref="cityPicker" className={`cityPicker ${b_show?"":"base-hide"}`}>
                <div className="picker-backdrop"></div>
                <div className="picker-body">
                    <div className="picker-header">
                        <button className="picker-btn-cancel" onClick={()=>this.f_cancel()}>取消</button>
                        <button className="picker-btn-ok"  onClick={()=>this.f_confirm()}>确定</button>
                        <div className="picker-clear"></div>
                    </div>
                    <Picker
                        optionGroups={optionGroups}
                        valueGroups={valueGroups}
                        onChange={this.handleChange.bind(this)} />
                </div>
             </div>;
    }
}
module.exports = CityPicker;