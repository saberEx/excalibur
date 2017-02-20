'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("选择日期");
    require('datePickerCss');
    require('react-day-picker/lib/style.css');
    let DayPicker = require('react-day-picker');

    const MONTHS = ['一月', '二月', '三月', '四月', '五月',
      '六月', '七月', '八月', '九月', '十月', '十一月',
      '十二月'];

    const WEEKDAYS_LONG = ['星期一', '星期二', '星期三',
      '星期四', '星期五', '星期六', '星期天'];

    const WEEKDAYS_SHORT = ['周一', '周二 ', '周三', '周四', '周五', '周六', '周日'];

    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
        }
        dateSelect(e,day,{ selected, disabled }){
            if (disabled) {
              return;
            }
            if (selected) {
              return;
            } else {
              let value = day.getFullYear()+"/"+(day.getMonth()+1)+"/"+day.getDate();
              Com.sendEvt('date_picker',{date:value});
            }
            Com.closeWin();
        }
        render(){
            return (
                <div className="datePicker">
                    <DayPicker
                        initialMonth={new Date()}
                        locale="cn"
                        months={ MONTHS }
                        weekdaysLong={ WEEKDAYS_LONG }
                        weekdaysShort={ WEEKDAYS_SHORT }
                        onDayClick={this.dateSelect}
                    />
                </div>
             );
        }
    };
    //请求数据
    // Com.getNormal({act:"datePicker",op:"datePicker"},function(res){
    //     if(parseInt(res.code) === 0){
            ReactDOM.render(<PageEl />,document.getElementById('pageCon'));
    //     }else{
    //         Com.toast(res.msg);
    //     }
    // });
});
