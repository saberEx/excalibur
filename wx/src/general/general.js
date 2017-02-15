let Config = require('config0.js');
let General = {
    //获取商品图片
    getGoodsImg(imageName, size) {
        var imagePath;
        if (imageName) {
            //店铺ID(图片目录)
            var store_id = imageName.substring(imageName.lastIndexOf("/") + 1, imageName.indexOf("_"));
            //图片尺寸
            var dotIndex = imageName.lastIndexOf(".");
            var sizeNum = size || 640;
            var imageName_new = imageName.substring(0, dotIndex) + "_" + sizeNum + imageName.substring(dotIndex);
            imagePath = Config.UPLOAD_PATH + "shop/store/goods/" + store_id + "/" + imageName_new;
        } else {
            imagePath = 'commonDefault.png';
        }
        return imagePath;
    },
    //将名称后五位数字去掉
    replaceName(s_name) {
        s_name = s_name || "";
        return s_name.replace(/_\d{5}$/, '');
    },
    //匿名
    anonymousName(s_name) {
        s_name = s_name || "";
        return s_name.substr(0, 1) + "*****";
    }
}
module.exports = General;