 
'use strict';
require('minTitCss'); 
var MinTit = React.createClass({    
	render:function(){      
		return (		  	
            <div className="commonTitleNav base-after-line base-line-left">
                <h2>{this.props.title}</h2>
            </div>
		);
	}
});
module.exports = MinTit;
