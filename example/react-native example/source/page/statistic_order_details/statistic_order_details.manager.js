'use strict';
import Com from './common';
import Component from './statistic_order_details.component';
import BaseManager from './baseManager';

export default class Manager extends BaseManager{
    constructor(props){
        super(Component,"statistic_order_details");
        let _manager = this;
    }
}
