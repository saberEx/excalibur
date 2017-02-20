/*
 * @Author: 黄权
 * @Date:   2016-10-26 17:15:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-10-31 10:43:57
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("商品搜索");
    require("search_pageCss");
    var LabelInput = require('labelInput');
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {s_left:""}
        }
        //输入
        f_input(value){
            this.setState({s_left:value});
        }
        //清除
        f_clear(){
            this.refs.searchInput.value = "";
            this.setState({s_left:""});
        }
        //点击搜索
        f_search(){
            Com.openWin("search_result",{type:1,value:this.state.s_left});
        }
        render(){
            let {s_left} = this.state;
            var e_search = s_left?<LabelInput onClick={()=>this.f_search()} s_left={s_left} s_right={"搜商品"} b_right={true} b_after={true}  b_line={false}/>:null;
            return (
                <div className="search_page">
                    <header className="">
                        <div className='imgCon' onClick={()=>this.f_clear()}>
                            <img src={require('closeIconImg')} className="search_back"/>
                        </div>
                        <input ref="searchInput" type="text" onInput={(ev)=>this.f_input(ev.target.value)} autoFocus="autofocus" placeholder="搜索商品"/>
                    </header>
                    <div className="searchList">
                        {e_search}
                    </div>
                </div>
             );
        }
    };
    ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
});
