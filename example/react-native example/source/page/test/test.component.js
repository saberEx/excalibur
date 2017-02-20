'use strict';
import React,{ Component } from 'react';
import { View ,ListView,StyleSheet,Text,TouchableOpacity,ProgressBarAndroid} from 'react-native';
import Com from './common';
import {TopBar} from './components';
let {baseFlex} = Com;
import {MyListView} from './myListView';
import o_styles from './test.style';
const {baseContent} = Com;
class SectionHeader extends Component {
    render(){
        let {sectionID} = this.props;
        return (<TouchableOpacity style={styles.section}>
                <Text style={styles.text}>
                    {sectionID}
                </Text>
            </TouchableOpacity>);
    }
}
class RowView extends Component {
    render(){
        let {rowData, sectionID, rowID, highlightRow} = this.props;
        return (<Text>{rowData}</Text>);
    }
}
class Test extends Component {
    constructor(props) {
        super(props);
        this.dataBlob = [];
        this.sectionIDs = [];
        for (let ii = 0; ii < 3; ii++) {
            let sectionName = 'Section ' + ii;
            this.sectionIDs.push(sectionName);
            this.dataBlob[ii] = this.dataBlob[ii] || [];

            for (let jj = 0; jj < 5; jj++) {
                let rowName = 'S' + ii + ', R' + jj;
                this.dataBlob[ii][jj] = rowName;
            }
        }
    }
   componentDidMount(){
       this.props.init();
   }
    _f_paginate(page, callback){
       /* let {o_options} = this.props;
        if(o_options){
            callback(this.dataBlob,o_options);
        }else {
            callback(this.dataBlob);
        }*/
        setTimeout(()=>{
            callback(this.dataBlob.concat(this.dataBlob),{allLoaded:true});
        },2000)
    }
  	render() {
	    return (
           <View style={baseFlex}>
               <View style={[baseContent,baseFlex]}>
                   <MyListView
                       style={styles.listView}
                       SectionHeaderView={SectionHeader}
                       RowView={RowView}
                       f_paginate={this._f_paginate.bind(this)}
                       f_firstLoad={(page, callback,)=>{callback(this.dataBlob)}}
                   />
               </View>
               <TopBar s_title="测试"/>
           </View>
       );
   }
}
let styles = StyleSheet.create({
    listView: {
        backgroundColor: '#B0C4DE',
    },
    header: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3B5998',
        flexDirection: 'row',
    },
    text: {
        color: 'white',
        paddingHorizontal: 8,
    },
    rowText: {
        color: '#888888',
    },
    thumbText: {
        fontSize: 20,
        color: '#888888',
    },
    buttonContents: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 3,
        padding: 5,
        backgroundColor: '#EAEAEA',
        borderRadius: 3,
        paddingVertical: 10,
    },
    img: {
        width: 64,
        height: 64,
        marginHorizontal: 10,
        backgroundColor: 'transparent',
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#5890ff',
    },
});
export default Test;