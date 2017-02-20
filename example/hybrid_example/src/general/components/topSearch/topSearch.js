/*
* @Author: 代汉桥
* @Date:   2016-07-28 09:19:59
* @Last Modified by:   卢旺
* @Last Modified time: 2016-10-18 15:38:37
* 多选列表
*/
'use strict';
require("topSearchCss");
class TopSearch extends React.Component{
    render(){
        let tyleAbc = {
            background: '#ECECEC url('+require('shopC_searchImg')+') no-repeat'
        }
        return (
            <div className="headerSearch">
                <span className="shearchBack base-transY">
                    <img src={require('backImg')} alt=""/>
                </span>
                <input style={styleAbc} className="searchInput" type="search" placeholder={this.props.s_placeholder} />
            </div>
        )
    }
}
module.exports = TopSearch;
