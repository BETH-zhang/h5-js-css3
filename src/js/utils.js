 // 基本配置
 var confi = {
     keepZoomRatio: false,
     layer: {
         "width": "100%",
         "height": "100%",
         "top": 0,
         "left": 0
     },
     audio: {
         enable: false,
         playURl: "./music/happy.wav",
         cycleURL: "./music/circulation.wav"
     },
     setTime: {
         walkToThird: 6000,
         walkToMiddle: 6500,
         walkToEnd: 6500,
         walkTobridge: 2000,
         bridgeWalk: 2000,
         walkToShop: 1500,
         walkOutShop: 1500,
         openDoorTime: 800,
         shutDoorTime: 500,
         waitRotate: 850,
         waitFlower: 800
     },
     snowflakeURl: [
         "./images/snowflake/snowflake1.png",
         "./images/snowflake/snowflake2.png",
         "./images/snowflake/snowflake3.png",
         "./images/snowflake/snowflake4.png",
         "./images/snowflake/snowflake5.png",
         "./images/snowflake/snowflake6.png"
     ]
 };
 var debug = 1;
 // 循环时间
 if (debug) {
     $.each(confi.setTime, function(key, val) {
         confi.setTime[key] = 2000
     })
 }
 // 保持比例缩放
 if (confi.keepZoomRatio) {
     var proportionY = 900 / 1440;
     var screenHeight = $(document).height();
     var zooomHeight = screenHeight * proportionY;
     var zooomTop = (screenHeight - zooomHeight) / 2;
     confi.layer.height = zooomHeight;
     confi.layer.top = zooomTop
 }
 var instanceX; // 间距
 var container = $("#content"); // 内容容器
 container.css(confi.layer); // 设置页面布局

 var visualWidth = container.width(); // 获取可视范围宽度
 var visualHeight = container.height(); // 获取可视范围高度

 // 获取元素的高度，和top值
 var getValue = function(className) {
     var $elem = $("" + className + "");
     return {
         height: $elem.height(),
         top: $elem.position().top
     }
 };

 // 获取路的Y轴路径
 var pathY = function() {
     var data = getValue(".a_background_middle");
     return data.top + data.height / 2
 }();

 // 获取桥的Y轴路径
 var bridgeY = function() {
     var data = getValue(".c_background_middle");
     return data.top
 }();

 // 获取动画结束
 var animationEnd = (function() {
     var explorer = navigator.userAgent;
     if (~explorer.indexOf("WebKit")) {
         return "webkitAnimationEnd"
     }
     return "animationend"
 })();

 // 播放音乐
 if (confi.audio.enable) {
     var audio1 = Hmlt5Audio(confi.audio.playURl);
     audio1.end(function() {
         Hmlt5Audio(confi.audio.cycleURL, true)
     })
 }