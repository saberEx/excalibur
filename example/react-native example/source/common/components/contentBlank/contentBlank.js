'use strict';
import React, { Component,PropTypes } from 'react';
import {View,Image,Text} from 'react-native';
import o_style from './contentBlank.style';
let {container,contentBlankImg,contentBlankText} = o_style;
export class ContentBlank extends Component{
    constructor(props) {
        super(props);

    }
    static propTypes = {
        s_textContent: PropTypes.string.isRequired, //空白页文本内容
        style: PropTypes.any, //空白页容器样式
        textStyle:PropTypes.any, //空白页文本样式,
        imageStyle: PropTypes.any, //空白页图片样式
        logo:PropTypes.any, //空白页logo,
    };
    static defaultProps = {
        s_textContent:"当前内容为空",
        logo:require("./contentBlank.png")
    };
    render(){
        let {style,imageStyle,logo,textStyle,s_textContent} = this.props;
        return (
            <View style={[container,style]}>
                <Image style={[contentBlankImg,imageStyle]} source={logo} />
                <Text style={[contentBlankText,textStyle]}>{s_textContent}</Text>
            </View>

        );
    }
}