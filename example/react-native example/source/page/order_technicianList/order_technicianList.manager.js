'use strict';
import Com from './common';
import Component from './order_technicianList.component';
import BaseManager from './baseManager';

//actionType
const {ACTION_206} = Com;

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'order_technicianList');
		//动作
		this.actions = {
			submit(self){
				return (dispatch,getState) =>{
					let curTechIndex = parseInt(self._radio.value);
					dispatch({ type : ACTION_206 ,"curTechIndex":curTechIndex});
					Com.closeWin();
				};
			}
		};
	}
}
