/**
 * 倒计时
 * @type {Object}
 */
module.exports = {
	countdown:function(time,eleh,elem,eles,callback,isstrig){
		var interVal;
		function GetRTime(){
            var EndTime= new Date(time);
            var NowTime = new Date();
            var t =EndTime.getTime() - NowTime.getTime();
            var d=0;
            var h=0;
            var m=0;
            var s=0;
            if(t>=0){
              d=Math.floor(t/1000/60/60/24);
              h=Math.floor(t/1000/60/60%24);
              m=Math.floor(t/1000/60%60);
              s=Math.floor(t/1000%60);
            }
            if (d==0 && h==0 && m==0 && s==0) {
                callback&&callback(interVal);
            };
            if (isstrig) {
                if (document.getElementById(eleh)) {
                    document.getElementById(eleh).innerHTML = (h < 10 ? '0'+h : h)+"时"+(m < 10 ? '0'+m : m)+"分"+(s < 10 ? '0'+s : s)+"秒";
                }
            }else{
                document.getElementById(eleh).innerHTML = h < 10 ? '0'+h : h;
                document.getElementById(elem).innerHTML = m < 10 ? '0'+m : m;
                document.getElementById(eles).innerHTML = s < 10 ? '0'+s : s;
            }
        }
        interVal=setInterval(GetRTime,200);
	}
}
