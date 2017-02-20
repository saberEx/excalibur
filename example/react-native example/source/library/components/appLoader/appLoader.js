/*
 * loading组件
 */
'use strict';
import React, { Component , PropTypes} from 'react';
import {View,Image,Animated} from 'react-native';
import o_styles from './appLoader.style';
const {container,loadingLogo,loadingWarp} = o_styles;
export default class AppLoader extends Component {
    static propTypes = {
        s_logo: PropTypes.number, //logo
        s_warp: PropTypes.number, //圆圈
    };
    static defaultProps = {
        s_logo:require("./loading-logo.png"),
        s_warp:require("./loading-warp.png")
    };
    constructor(props) {
        super(props);
        let _rotateValue = new Animated.Value(0);
        this.state = {
            rotateValue: _rotateValue,
        };
        this._rotateZ = _rotateValue.interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']});
    }
    startAnimation() {
        this.state.rotateValue.setValue(0);
        this._animated = Animated.timing(this.state.rotateValue, {
            toValue: 1,
            duration: 800,
        });
        this._animated.start((animatedState) =>{
            if(animatedState.finished){
                this.startAnimation();
            }
        });
    }
    componentDidMount(){
        this.startAnimation();
    }
    componentDidUpdate(){
        this.props.b_isShow ? this.startAnimation() : this._animated.stop();
    }
    componentWillUnmount() {
        this._animated.stop();
    }
    render() {
        let {b_isShow,s_logo,s_warp} = this.props;
        let e_view = null;
        if(b_isShow){
            e_view = <View style = {[container]} >
                <Image style = {loadingLogo} source={s_logo}/>
                <Animated.Image style = {[loadingWarp,{transform:[{rotateZ:this._rotateZ}]}]} source={s_warp} ></Animated.Image>
            </View>;
        }
        return (
            e_view
        );
    }
}
