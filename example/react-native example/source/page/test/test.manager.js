'use strict';
import Com from './common';
import Component from './test.component';
import BaseManager from './baseManager';

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"test");
        let _manager = this;
        //初始状态
        //this.initialState={};
        //动作
        this.actions = {
            init(){
                return (dispatch, getState) => {
                    
                };
            }
        };
        //处理
        //this.reducers = (state,action)=>{
            //switch( action.type ){
               //default:
                   //return state;
            //}
        //};
    }
}
