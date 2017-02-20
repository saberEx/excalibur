/*
 * @Author: 黄权
 * @Date:   2016-10-22 16:00:00
 * @Last Modified by:   代汉桥
 * @Last Modified time: 2016-12-09 10:20:11
 */
'use strict';
Com.ready(function(){
    var TopBar = require('topBar');
    TopBar.create("收货地址管理");
    let deleteImg = require("deleteImg");
    let compileImg = require('compileImg');
    let delete_onImg = require("delete_onImg");
    let compile_onImg = require('compile_onImg');
    let isDefault = require('radio_sed_bgImg');
    let notDefault = require('radio_bgImg');
    let BlockFixedBtn = require('blockFixedBtn');
    let NotData = require('notData');
    require("address_manageCss");
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
        //设置默认
        f_setDefault(index){
            let self = this;
            let {address_list} = this.state.data;
            let {address_id,true_name,mob_phone,area_info,address,tel_phone,city_id,area_id} = address_list[index];
            Com.getVerify({act:'member_address',op:'address_edit',address_id:address_id,true_name:true_name,mob_phone:mob_phone,
                area_info:area_info,address:address,tel_phone:tel_phone,city_id:city_id,area_id:area_id,is_default:1},(ret)=>{
                if(parseInt(ret.code) === 0){
                    address_list[0].is_default = 0;
                    address_list[index].is_default = 1;
                    self.setState({data:self.state.data});
                }else{
                    Com.toast(ret.msg);
                }
            })
        }
        //删除
        f_delete(index){
            if(index === 0){
                return Com.toast("默认地址不能删除哦!");
            }
            let {address_list} = this.state.data;
            let {address_id} = address_list[index];
            Com.getVerify({act:'member_address',op:'address_del',address_id:address_id},(ret)=>{
                if(parseInt(ret.code) === 0){
                    address_list.splice(index,1);
                    this.setState({data:this.state.data});
                }else{
                    Com.toast(ret,msg);
                }
            });
        }
        //编辑
        f_edit(index){
            Com.openWin("address_edit",{data:JSON.stringify(this.state.data.address_list[index])});
        }
        _sortList(a,b){
            if(parseInt(a.is_default) === 1){
                return -1
            }
            return 1;
        }
        render(){
            let {address_list} = this.state.data;
            let e_list = null;
            if(address_list && address_list.length>0){
                address_list.sort(this._sortList);
                e_list = address_list.map((item,key)=>{
                    let {true_name,mob_phone,area_info,address,is_default} = item;
                    let b_default = parseInt(is_default) === 1;
                    let defaultStyle = b_default ? "addr_item active" :"addr_item";
                    return  <section className={defaultStyle} key={key}>
                               <div className="user_info">
                                   {true_name}
                                   <span className="base-fr">{mob_phone}</span>
                               </div>
                               <div className="user_addr base-after-line">
                                   {`${area_info}${address}`}
                               </div>
                               <div className="addr_type">
                                   <span className="base-fr" onClick={()=>this.f_delete(key)}>{b_default?<img src={delete_onImg} />:<img src={deleteImg} />}删除</span>
                                   <span onClick={()=>this.f_edit(key)} className="base-fr">{b_default?<img src={compile_onImg} />:<img src={compileImg} />}编辑</span>
                               </div>
                               {b_default?<img className="setDefault" src={isDefault}/>:<img className="setDefault" src={notDefault} onClick={()=>this.f_setDefault(key)}/>}
                           </section>;
                });
            }else{
                //空白页
                e_list = <NotData s_content='您需要设置收货地址哦'/>;
            }
            return (
                <div className="address_manage">
                    {e_list}
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
