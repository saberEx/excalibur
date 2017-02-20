/*
* @Author: 黄权
* @Date:   2016-10-17 16:52:27
* @Last Modified by:   黄权
* @Last Modified time: 2016-10-17 16:52:27
*/
'use strict';
require("magic_cubeCss");
let {Component} = React;
// var Slider = require("slider");
class MagicCube extends Component {
    render() {
        let {list} = this.props.data;
        var e_list = null;
        e_list = list.map((item,key)=>{
            return (
                <tr key={key}>
                    {item.map((o_td,index)=>{
                        let e_td = null;
                        if(o_td && o_td.imgUrl){
                            let {colspan,rowspan,dataIndex,imgUrl,link} = o_td;
                            e_td = <td key={index} className={`cols-${colspan}`} rowSpan={rowspan} data-index={dataIndex}
                                    colSpan={colspan} data-x="0" data-y={key}><img onClick={()=>Com.openWin(link)} src={imgUrl.replace(/_240/,"")}
                                     />
                                </td>;
                        }else if(o_td && o_td !=="null"){
                            let {colspan,rowspan,dataIndex} = o_td;
                            e_td = <td key={index} className={`cols-${colspan}`} rowSpan={rowspan} data-index={dataIndex}
                                   colSpan={colspan} data-x="0" data-y={key}>
                            </td>;
                        }
                        return e_td;
                    })}
                </tr>
            );
        });
        return <form className="form-horizontal" >
                    <div className="controls" name="layout_map">
                        <table className="custom-cube2-table">
                            <tbody>
                                {e_list}
                            </tbody>
                        </table>
                    </div>
                </form>;
    }
}
class SwiperMagicCube extends Component {
    render() {
        let {list,carouselRow} = this.props.data;
        let e_list = null;
        let e_tbody = [];

        e_list = list.map((item,key)=>{
            if(key%carouselRow===0){
                for(let k=key,k_len=key+carouselRow;k<k_len;k++ ){
                    e_tbody.push(
                        <tr key={k}>
                            {item.map((o_td,index)=>{
                                let e_td = null;
                                if(o_td && o_td.imgUrl){
                                    let {colspan,imgUrl,link} = o_td;
                                    e_td = <td className={`cols-${colspan}`} key={index}>
                                             <a onClick={()=>Com.openWin(link)}>
                                            <img src={imgUrl.replace(/_240/,"")}  />
                                            </a>
                                        </td>;
                                }
                                return e_td;
                            })}
                        </tr>
                    );
                }
                return (
                    <form className="form-horizontal" >
                        <div className="controls" name="layout_map">
                            <table className="custom-cube2-table">
                                <tbody>
                                {e_tbody}
                                </tbody>
                            </table>
                        </div>
                    </form>
                );
            }
        });
        return <Slider i_time={5} b_bullet={true}>
                {e_list}
            </Slider>;
    }
}
class Magic_Cube extends Component{
    render(){
        let {isCarousel} = this.props.data;
        let Sub = parseInt(isCarousel) == 1 ? SwiperMagicCube : MagicCube;
        return <div className="magic_cube com-diyControl">
                    <Sub data={this.props.data}></Sub>
                </div>;
    }
}
module.exports = Magic_Cube;
