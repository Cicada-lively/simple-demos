
function marTop(ele){
  var body_width=$(window).width();
  if(body_width<768){
     ele.css({"margin-left":"0","left":"0"});
  }else{   
     ele.css({"margin-left":"-384px","left":"50%"});   
  } 
}


//定义外围黑色背景弹框的高度和宽度
function popupDiv(element) {
    element.width($(window).width());
    //此处用document是因为出现滚动条之后，也需要获取隐藏的document
    element.height($(document).height());
    element.css({"left": 0, "top": 0});
}

//弹出窗口居中函数
function centerPopup(ele) {
    centerFun(ele);
    //浏览器窗口大小改变时
    $(window).resize(function () {centerFun(ele);});
    //浏览器有滚动条时的操作、
    $(window).scroll(function () {centerFun(ele);});
}
function centerFun(ele){
    //这里是获取window的宽和高，不是可视窗口document 切记
    var screenWidth = window.innerWidth || $(window).width();
    var screenHeight = window.innerHeight || $(window).height();
    //此处是获取当前可视窗口距离页面顶部高度
    var scrollTop = $(document).scrollTop();
    var eleLeft = (screenWidth - ele.width()) / 2;
    var eleTop = (screenHeight - ele.height()) / 2 + scrollTop;
    ele.css({"left": eleLeft + "px", "top": eleTop + "px"});
}
function largeTop(ele){
    var body_width=$(window).width();
    if(body_width<1080){
        ele.css({"margin-left":"0","left":"0"});
    }else{
        ele.css({"margin-left":"-540px","left":"50%"});
    }
}
var time = 120;//设置手机验证码时间 
var blug;

//获取手机验证码倒计时(当点击按钮是input标签时使用)
function teleCodeTimer(id){
    blug = id;
    timer();
}
//手机验证码重新获取时间间隔
function timer(){
    blug.attr("disabled", true);
    time = time - 1;
    blug.val(time+"秒后获取");
    
    if(time == 0){
       blug.val("免费获取");
       time = 120;
       blug.attr("disabled", false);
    }else{
       setTimeout('timer()',1000);
    }
}

/*删除所有空白*/
String.prototype.trim = function() {
    return this.replace(/(^\s+)|(\s+$)/g,"");
}

/*是否为空白*/
String.prototype.isBlank = function() {
    return this == null || this.trim() == "";
}

/**是否有效的手机号码*/
String.prototype.isMobileNum = function() {
    return (new RegExp(/^((13[0-9])|(14[4,7])|(15[^4,\D])|(17[0-9])|(18[0-9]))(\d{8})$/)
            .test(this));
}

/**是否有效的邮箱*/
String.prototype.isEmail = function() {
    return (
            new RegExp(/^([a-zA-Z0-9])+([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+((\.([a-zA-Z0-9_-]){2,3}){1,2})$/).test(this)
           );
}


