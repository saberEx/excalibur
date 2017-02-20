'use strict';
Com.ready(function(){
    let TopBar = require('topBar');
    TopBar.create("选择地址");
    let Address = require('address');
    let NotData = require('notData');
    let BlockFixedBtn = require('blockFixedBtn');
    require("address_selectCss");
    //页面组件
    class PageEl extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                data:this.props.data,
            }
        }
        componentDidMount(){
            let self = this;
            Com.addEvt('address_edit',(res)=>{
                if(parseInt(res.b_update) === 1){
                    requestData((data)=>{
                        self.setState({data:data});
                    })
                }
            })
        }
        f_add(){
            Com.openWin('address_edit');
        }
        selectHandler(data){
            Com.sendEvt('address_select',{data:data});
            Com.closeWin();
        }
        render(){
            let {address_list} = this.state.data;
            let e_items = null;
            let _self = this;
            if(address_list.length > 0){
                let els = address_list.map((item,index)=>{
                    return <Address key={index} b_right={false} b_address={true} data={item} callback={(data)=>_self.selectHandler(data)}/>;
                })
                e_items = <div>{els}</div>
            }else{
                e_items = <NotData s_content='您需要设置收货地址哦'/>;
            }
            return (
                <div className="address_select">
                    {e_items}
                    <BlockFixedBtn s_label={'添加地址'} onClick={this.f_add}/>
                </div>
             );
        }
    };
    function requestData(f_callback){
        Com.getVerify({act:"member_address",op:"address_list"},function(res){
           if(res.code === 0){
                Com.setLocalData('address_edit',null);
                f_callback(res.data);
           }else{
               Com.toast(res.msg);
           }
        });
    }
    requestData((data)=>{
        ReactDOM.render(<PageEl data={data}/>,document.getElementById('pageCon'));
    });
});
