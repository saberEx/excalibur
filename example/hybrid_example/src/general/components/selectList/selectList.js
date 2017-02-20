/*
* @Author: 代汉桥
* @Date:   2016-07-28 09:19:59
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-26 09:21:00
* 多选列表
*/
'use strict';
require("selectListCss");
const ClassNames = require("classnames");
const SelectedIcon = require("selectedIconImg");
class Item extends React.Component{
    _selectHandler(){
        let f_callBack = this.props.f_callBack;
        let index = this.props.index;
        f_callBack && f_callBack(index);
    },
    render(){
        let data = this.props.data;
        let s_cls = ClassNames({"base-hide":!data.selected});
        let s_color = ClassNames('colorValue',{'base-hide':!data.colorValue});
        return (
            <div className="selectItem" onClick={this._selectHandler.bind(this)}>
                <div className="colorShow">
                    <div className={s_color} style={{background:data.colorValue}}></div>
                    <div>{data.text}</div>
                </div>
                <img className={s_cls} src={SelectedIcon}/>
            </div>
        )
    }
}
class SelectList extends React.Component{
    constructor(){
        super();
        this.state = {
            a_list:this.props.a_list
        }
    }
    _changeHandler(index){
        let a_list = this.state.a_list.concat();
        a_list[index].selected = !a_list[index].selected;
        this.setState({a_list:a_list});
    }
    render(){
        let self = this;
        let a_list = this.state.a_list;
        let e_items = a_list.map(function(item,index){
            return <Item key={index} index={index} data={item} f_callBack={self._changeHandler}/>
        })
        return (
            <div className="selectList">
                {e_items}
            </div>
        )
    }
}
module.exports = SelectList;
