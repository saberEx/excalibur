/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("searchCss");
class Search extends React.Component {
	render() {
		let {text} = this.props.data;
		return <div className="search com-diyControl">
				<div className="search-container">
					<form action="/">
						<a onClick={()=>Com.openWin("search_page")}>
							<div className="search-text-title">{text}</div>
							<button className="custom-search-button"></button>
						</a>
					</form>
				</div>
			</div>
	}
}
module.exports = Search;

