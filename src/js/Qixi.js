var Qixi = function() {
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
        ]};
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

    // 初始化场景布局
    var swipe = Swipe(container);

    // 调试，切换场景
    swipe.scrollTo(visualWidth*2);

    // 滚动，场景滚动
    function scrollTo(time, proportionX) {
        var distX = visualWidth * proportionX;
        swipe.scrollTo(distX, time) 
    }

    // 女孩定义
    var girl = {
        elem: $(".girl"),
        getHeight: function() {
            return this.elem.height() 
        },
        rotate: function() {
            this.elem.addClass("girl-rotate")
        },
        setOffset: function() { 
            this.elem.css({ 
                left: visualWidth / 2, 
                top: bridgeY - this.getHeight() 
            }) 
        },
        getOffset: function() {
            return this.elem.offset() 
        },
        getWidth: function() {
            return this.elem.width() 
        }
    };

    // 鸟的定义
    var bird = { 
        elem: $(".bird"), 
        fly: function() { 
            this.elem.addClass("birdFly");
            this.elem.transition({ 
                right: visualWidth 
            }, 15000, "linear") 
        } 
    };

    // logo定义
    var logo = { 
        elem: $(".logo"), 
        run: function() { 
            this.elem.addClass("logolightSpeedIn").on(animationEnd, function() { 
                $(this).addClass("logoshake").off() 
            }) 
        } 
    };

    // 定义男孩走路
    function BoyWalk() {
        var $boy = $("#boy");
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();
        $boy.css({ top: pathY - boyHeight + 25 });

        // 停止走路
        function pauseWalk() { 
            $boy.addClass("pauseWalk") 
        }

        // 重新走路
        function restoreWalk() { 
            $boy.removeClass("pauseWalk") 
        }

        // 慢走路
        function slowWalk() { 
            $boy.addClass("slowWalk") 
        }

        // 开始跑步
        function stratRun(options, runTime) {
            var dfdPlay = $.Deferred();
            restoreWalk();
            $boy.transition(options, runTime, "linear", function() { 
                dfdPlay.resolve() 
            });
            return dfdPlay 
        }

        // 走路跑
        function walkRun(time, dist, disY) { time = time || 3000;
            slowWalk();
            var d1 = stratRun({ "left": dist + "px", "top": disY ? disY : undefined }, time);
            return d1 
        }

        // 走路进商店
        function walkToShop(doorObj, runTime) {
            var defer = $.Deferred();
            var doorObj = $(".door");
            var offsetDoor = doorObj.offset();
            var doorOffsetLeft = offsetDoor.left;
            var offsetBoy = $boy.offset();
            var boyOffetLeft = offsetBoy.left;
            instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
            var walkPlay = stratRun({ transform: "translateX(" + instanceX + "px),scale(0.3,0.3)", opacity: 0.1 }, 2000);
            walkPlay.done(function() { $boy.css({ opacity: 0 });
                defer.resolve() });
            return defer
        }

        // 走路出商店
        function walkOutShop(runTime) {
            var defer = $.Deferred();
            restoreWalk();
            var walkPlay = stratRun({ transform: "translate(" + instanceX + "px,0px),scale(1,1)", opacity: 1 }, runTime);
            walkPlay.done(function() { 
                defer.resolve() 
            });
            return defer 
        }

        // 计算距离
        function calculateDist(direction, proportion) {
            return (direction == "x" ? visualWidth : visualHeight) * proportion 
        }

        return { 
            walkTo: function(time, proportionX, proportionY) {
                var distX = calculateDist("x", proportionX);
                var distY = calculateDist("y", proportionY);
                return walkRun(time, distX, distY) 
            }, 
            stopWalk: function() { 
                pauseWalk() 
            }, 
            resetOriginal: function() { 
                this.stopWalk();
                $boy.removeClass("slowWalk slowFlolerWalk").addClass("boyOriginal") }, toShop: function() {
                return walkToShop.apply(null, arguments) 
            }, 
            outShop: function() {
                return walkOutShop.apply(null, arguments) 
            }, 
            rotate: function(callback) { 
                restoreWalk();
                $boy.addClass("boy-rotate");
                if (callback) { 
                    $boy.on(animationEnd, function() { 
                        callback();
                        $(this).off() 
                    }) 
                } 
            }, 
            getWidth: function() {
                return $boy.width() 
            }, 
            getDistance: function() {
                return $boy.offset().left 
            }, 
            talkFlower: function() { 
                    $boy.addClass("slowFlolerWalk") 
            } 
        }
    }

    // 男孩进商店
    var BoyToShop = function(boyObj) {
        var defer = $.Deferred();
        var $door = $(".door");
        var doorLeft = $(".door-left");
        var doorRight = $(".door-right");

        // 门动作
        function doorAction(left, right, time) {
            var defer = $.Deferred();
            var count = 2;
            var complete = function() {
                if (count == 1) { defer.resolve();
                    return }
                count-- };
            doorLeft.transition({ "left": left }, time, complete);
            doorRight.transition({ "left": right }, time, complete);
            return defer }

        // 开门
        function openDoor(time) {
            return doorAction("-50%", "100%", time) }

        // 关门
        function shutDoor(time) {
            return doorAction("0%", "50%", time) }

        // 抱花
        function talkFlower() {
            var defer = $.Deferred();
            boyObj.talkFlower();
            setTimeout(function() { 
                defer.resolve() 
            }, confi.setTime.waitFlower);
            return defer 
        }
        var lamp = {
            elem: $(".b_background"),
            bright: function() {
                this.elem.addClass("lamp-bright")
            },
            dark: function() { 
                this.elem.removeClass("lamp-bright") 
            }
        };
        var waitOpen = openDoor(confi.setTime.openDoorTime);

        waitOpen.then(function() {
            lamp.bright();
            return boyObj.toShop($door, confi.setTime.walkToShop) 
        }).then(function() {
            return talkFlower()
        }).then(function() {
            return boyObj.outShop(confi.setTime.walkOutShop) 
        }).then(function() { 
            shutDoor(confi.setTime.shutDoorTime);
            lamp.dark();
            defer.resolve() 
        });
        return defer
    };

    // 雪花
    function snowflake() {
        var $flakeContainer = $("#snowflake");

        // 得到图片名字
        function getImagesName() {
            return confi.snowflakeURl[[Math.floor(Math.random() * 6)]] 
        }

        // 创建雪花盒子
        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({ 
                "width": 41, 
                "height": 41, 
                "position": "absolute", 
                "backgroundSize": "cover", 
                "zIndex": 100000, 
                "top": "-41px", 
                "backgroundImage": "url(" + url + ")" 
            }).addClass("snowRoll") 
        }

        // 定时
        setInterval(function() {
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1;
            endPositionTop = visualHeight - 40, endPositionLeft = startPositionLeft - 100 + Math.random() * 500, duration = visualHeight * 10 + Math.random() * 5000;
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;
            var $flake = createSnowBox();
            $flake.css({ 
                left: startPositionLeft, 
                opacity: randomStart 
            });
            $flakeContainer.append($flake);
            $flake.transition({ 
                top: endPositionTop, 
                left: endPositionLeft, 
                opacity: 0.7 
            }, duration, "ease-out", function() { 
                $(this).remove() 
            }) 
        }, 200) 
    }

    // h5音频
    function Hmlt5Audio(url, loop) {
        var audio = new Audio(url);
        audio.autoplay = true;
        audio.loop = loop || false;
        audio.play();
        return { 
            end: function(callback) { 
                audio.addEventListener("ended", function() { 
                    callback() 
                }, false) 
            } 
        } 
    }
};

$(function() { 
    Qixi() 
    // 初始化男孩走路
    // var boy = BoyWalk();

    // boy.walkTo(
    //     confi.setTime.walkToThird, 0.6).then(function() { 
    //         scrollTo(confi.setTime.walkToMiddle, 1);
    //     return boy.walkTo(confi.setTime.walkToMiddle, 0.5) 

    // }).then(function() { 
    //     bird.fly() 
    // }).then(function() { 
    //     boy.stopWalk();
    //     return BoyToShop(boy) 
    // }).then(function() { 
    //     girl.setOffset();
    //     scrollTo(confi.setTime.walkToEnd, 2);
    //     return boy.walkTo(confi.setTime.walkToEnd, 0.15) 
    // }).then(function() {
    //     return boy.walkTo(confi.setTime.walkTobridge, 0.25, (bridgeY - girl.getHeight()) / visualHeight) 
    // }).then(function() {
    //     var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
    //     return boy.walkTo(confi.setTime.bridgeWalk, proportionX) 
    // }).then(function() { boy.resetOriginal();
    //     setTimeout(function() { 
    //         girl.rotate();
    //         boy.rotate(function() { 
    //             logo.run();
    //             snowflake() 
    //         }) }, confi.setTime.waitRotate) 
    // });
});
