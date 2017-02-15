
'use strict';
require('labelCellCss');

var LabelCellEl = React.createClass({
    propTypes:{
        o_left:React.PropTypes.object.isRequired,
        o_right:React.PropTypes.object.isRequired,
    },
	render:function(){
        var o_left = this.props.o_left;
        var o_right = this.props.o_right;
		return (
			<div className="labelCell">
			  	<ul className="base-after-line base-line-left">
                    <li>
                        <img src={o_left.s_img} alt=""/>
                        <div className="myInt" onClick={o_left.onClick}>
                            {o_left.s_title}
                            <p>{o_left.s_label}</p>
                        </div>
                    </li>
                    <li>
                        <img src={o_right.s_img} alt=""/>
                        <div className="myInt" onClick={o_right.onClick}>
                            {o_right.s_title}
                            <p>{o_right.s_label}</p>
                        </div>
                    </li>
                </ul>
			</div>
		);
	}
});
module.exports = LabelCellEl;
