 
'use strict';
require('minNavCss'); 


var NavItem = React.createClass({
    itemHandle:function(){
        if(this.props.f_callBack){
            this.props.f_callBack(this.props.i_index);
        }
    },
    render:function(){
        var s_cls = this.props.b_active ? "userMenuItem active" : "userMenuItem";
        return (
            <div className={s_cls} onClick={this.itemHandle}>{this.props.i_item}</div>
        )
    }
});

var MinNav = React.createClass({ 
    getInitialState:function(){
        return { 
            currentIndex : 0 
        }
    },
    callBack:function(index){
        this.setState({currentIndex:index});
        if(this.props.f_clickHandler){
            this.props.f_clickHandler(index);
        }
    },
	render:function(){      
        var navItem = this.props.navIndex.map(function(res,key){
            var b_active = false;
            if(this.state.currentIndex === key){
                b_active = true;
            }
            return <NavItem  key={key} b_active={b_active} i_item={res} i_index={key} f_callBack={this.callBack} />
        }.bind(this));       
		return (
			<div>			  	
                <nav className="userMenu">
                    {navItem}
                </nav>
			</div>
		);
	}
});
module.exports = MinNav;
