/*
 * @Author: 黄权
 * @Date:   2016-10-20 16:30:27
 * @Last Modified by:   黄权
 * @Last Modified time: 2016-10-20 16:52:27
 */
let NumBox = require("numBox");
let ApposeBtn = require("apposeBtn");
let classSet = require("classnames");
require("diyGoodsLayerCss");
class Layer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            b_show:false,
            o_data:null
        }
    }
    render(){
        let {b_show,o_data} = this.state;
        if(!o_data){
            return null;
        }
        let {goods_name,goods_price,goods_image,goods_storage=0} = this.props.data;
        let s_layer = classSet("layer",{"base-hide":b_show});
        let s_content = classSet("layerCont",{"no-storage":goods_storage>0});
        return <div className={s_layer}>
                <div className={s_content}>
                    <section className="layout-item goodInfoItem">
                        <div className="goodsCont">
                            <div className="goodsImg"><img src={goods_image} /></div>
                            <div className="goodsTitle">
                                <p className="gTit" >{goods_name}</p>
                                <p className="com-color-red">￥{goods_price}</p>
                            </div>
                            <div className="closeBtn" onClick={()=>{this.setState({b_show:!b_show})}}></div>
                        </div>
                    </section>
                    <section className="layout-item text-Right">
                        <span className="f-l">数量：</span>
                        <span >{goods_storage>0?`剩余：${goods_storage}`:"库存不足"}</span>
                        <NumBox i_value={1} i_min={1} i_max={goods_storage}/>
                    </section>
                    <section className="layout-item">
                        <ApposeBtn s_leftLabel="立即购买" s_rightLabel="加入购物车" f_leftClick={()=>{}} f_rightClick={()=>{}}/>
                    </section>
                </div>
            </div>
    }
}
module.exports = Layer;