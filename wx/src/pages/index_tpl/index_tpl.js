//index.js
//获取应用实例
let app = getApp();
Page({
    data: {
        i_tabIndex:0,
        motto: 'Hello World',
        goodsList: [{
            goods_name:'11汽车一直不停可以跑多远 99%司机都不知道汽车一直不停可以跑多远 99%司机都不知道汽车一直不停可以跑多远 99%司机都不知道汽车一直不停可以跑多远 99%司机都不知道',
            goods_img:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2675312959,277329866&fm=80&w=179&h=119&img.JPEG',
            goods_price:'336.00'
        },{
            goods_name:'222汽车一直不停可以跑多远 99%司机都不知道',
            goods_img:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2675312959,277329866&fm=80&w=179&h=119&img.JPEG',
            goods_price:'336.00'
        },{
            goods_name:'333汽车一直不停可以跑多远 99%司机都不知道',
            goods_img:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2675312959,277329866&fm=80&w=179&h=119&img.JPEG',
            goods_price:'336.00'
        },{
            goods_name:'444汽车一直不停可以跑多远 99%司机都不知道',
            goods_img:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2675312959,277329866&fm=80&w=179&h=119&img.JPEG',
            goods_price:'336.00'
        }],
        advImgList:[{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        }],
        title:{
            s_bgcolor:'',
            s_textalign:'left',
            b_sub_title:true,
            title:'哈哈哈哈哈哈', 
            s_sub_title:'副标题' ,
            wx_title_date:'2016年12月27日 16:46:30',
            wx_title_author:"move",
            wx_title_link:'链接的标题'
        },
        custom_nav_list:[{
            title:'以字节为单位返回文件夹中包含的所有子文件夹中的所有文件和子文件夹的大小'
        },{
            title:'以字节为单位返回文件夹中包含的所有子文件夹中的所有文件和子文件夹的大小'
        },{
            title:'以字节为单位返回文件夹中包含的所有子文件夹中的所有文件和子文件夹的大小'
        }],
        custom_navImg_list:[{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        }],
        showcase_img_list:[{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        },{
            image_scr:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2652555614,4088113893&fm=80&w=179&h=119&img.JPEG'
        }],
        noticescroll_value:0,
        isAnim: false, //规格弹出层是否展示
    },
    onClick_menuLink:function(){ console.log(22)},
    onClick_wxLink:function(){console.log(55)},
    onClick_customnavItem:function(){console.log('onClick_customnavItem')},
    onClick_customImgnavItem:function(){console.log('onClick_customImgnavItem')},
    onClick_showcaseImgItem:function(){console.log('onClick_showcaseImgItem')},
    onClick_Search:function(){console.log('onClick_Search')},
    onClick_custom_store:function(){console.log('onClick_custom_store')},
    notice_scroll:function(){
        var notice_interver,that=this;  
        notice_interver=setInterval(function(){
            if (Math.abs(that.data.noticescroll_value) >= 300) {
                that.setData({
                    noticescroll_value:0
                });
                return;
            };
            var scroll_value= parseInt(that.data.noticescroll_value) -2
            that.setData({
                noticescroll_value:scroll_value
            });
        },40);
    },
    aaaa() {
        console.log(this);
    },
    send_order(e){
        console.log(e);
    },
    click_item(e){
        console.log('click_item',e);
    },
    f_tabCallBack(e){
        this.setData({i_tabIndex:e.currentTarget.dataset.index});
    },
    //事件处理函数
    bindViewTap() {
        app.openWin('test_list');
    },
    onLoad() {
        app.assign(this,app.baseHandler);
        var notice_interver,that=this;
        //notice_interver=setInterval(function(){
            that.notice_scroll(); 
        //},20);
        //console.log(this.data);
    },
    onShow(){
        app.getNormal({act:'normal_index',op:"getGoodDetails",goods_alias:'ulz4vru8',shop_id:'228749299'},(res)=>{
            console.log(res);
        });
        app.addEvt(app.TAB_BTN_GROUP,(data)=>{
            this.setData({i_tabIndex:data});
        });
        app.addEvt(app.MEDIA_ITEM,(data)=>{
        });
    },
    onHide(){
        app.removeEvt(app.TAB_BTN_GROUP);
        app.removeEvt(app.MEDIA_ITEM);
    },
    default(){ 
        this.setData({ isAnim: true });
    }
})
