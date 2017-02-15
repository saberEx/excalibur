/**
 * 组件交互处理类
 */
let Base = require('base.js');
let BaseHandler = {
    tabBtnGroup_handler(e) {
        Base.sendEvt(Base.TAB_BTN_GROUP, e.currentTarget.dataset.index);
    },
    labelItem_handler(e) {
        Base.sendEvt(Base.LABEL_ITEM, { value: e.detail.value, id: e.currentTarget.id });
    },
    mediaItem_handler(e) {
        let currentTarget = e.currentTarget;
        Base.sendEvt(Base.MEDIA_ITEM, { params: currentTarget.dataset.params, id: currentTarget.id });
    },
    fixedBlockBtn_handler(e) {
        let currentTarget = e.currentTarget;
        Base.sendEvt(Base.FIXED_BLOCK_BTN, { params: currentTarget.dataset.params, id: currentTarget.id });
    },
    apposeFixedBtn_handler(e) {
        let currentTarget = e.currentTarget;
        Base.sendEvt(Base.APPOSE_FIXED_BTN, { params: currentTarget.dataset.params, id: currentTarget.id });
    },
    scrollBottom_handler(e) {
        let currentTarget = e.currentTarget;
        Base.sendEvt(Base.SCROLL_BOTTOM, { id: currentTarget.id });
    },
    numBox_handler(e) {
        let currentTarget = e.currentTarget;
        let s_value = parseInt(currentTarget.dataset.value);
        switch (parseInt(currentTarget.dataset.type)) {
            case 0:
                s_value = s_value - 1;
                break;
            case 1:
                s_value = e.detail.value;
                break;
            case 2:
                s_value = s_value + 1;
                break;
        }
        if (parseInt(currentTarget.dataset.type) === 1) {
            s_value = parseInt(e.detail.value);
        }
        Base.sendEvt(Base.NUM_BOX, { value: s_value, id: currentTarget.id, oldValue: parseInt(currentTarget.dataset.value) || 0, params: currentTarget.dataset.params });
    },
    selectItem_handle(e) {
        Base.sendEvt(Base.SELECT_ITEM, { value: e.detail.value, id: e.currentTarget.id });
    },
    actionsheet_handle(e) {
        let currentTarget = e.currentTarget;
        Base.sendEvt(Base.ACTION_SHEET, { b_isMask: currentTarget.dataset.mask, id: currentTarget.id, params: currentTarget.dataset.params });
    }
}
module.exports = BaseHandler;