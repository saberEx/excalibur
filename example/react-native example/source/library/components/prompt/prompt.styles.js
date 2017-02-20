/*
* @Author: 卢旺
* @Date:   2016-06-23 17:40:36
* @Last Modified by:   卢旺
* @Last Modified time: 2016-07-04 16:56:59
*/
'use strict';
import Base from './base';

let o_styles = {
  dialog: {
    flex: 1,
    alignItems: 'center'
  },
  dialogOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  dialogContent: {
    elevation: 5,
    marginTop: 150,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden'
  },
  dialogTitle: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogTitleText: {
    fontSize: 18,
    fontWeight: '600'
  },
  dialogBody: {
    flex: 1,
    paddingHorizontal: 5
  },
  dialogBodyText:{
    flex:1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogInput: {
    flex: 1,
    height: 40,
    fontSize: 18
  },
  dialogFooter: {
    borderTopWidth: 1,
    flexDirection: 'row',
    flex: 1
  },
  dialogAction: {
    flex: 1,
    padding: 15
  },
  dialogActionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#006dbf'
  },
  pInputStyle:{
    borderRadius:Base.px2dp(8),
    borderColor:Base.mainColor,
    borderWidth:Base.px2dp(2),
    marginRight:Base.px2dp(20),
    marginLeft:Base.px2dp(10),
    }
};
export default Base.genStyle(o_styles);
