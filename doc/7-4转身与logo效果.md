>转身效果与慕课logo的效果都是通过css3的animation动画实现的

人物转身

具体代码调用部分：通过定时器模拟一个暂停的时间，这样感觉人物会有一个等待转身的效果

    setTimeout(function() {
        girl.rotate();
        boy.rotate(function() {
            //开始logo动画
            logo.run()
        });
    }, 1000)
girl与boy都增加一个rotate的方法。这是通过增加一个rotate的样式调用CSS3动画，我们在pageC文件中找到对应的rotate样式

    -webkit-animation-name: girl-rotate;
    -webkit-animation-duration: 850ms;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-timing-function: step-start;
    -webkit-animation-fill-mode: forwards;
定义了一个keyframes的规则，原理同样也是通过position不断更换帧图的坐标，这里会有一个animation-fill-mode的属性，forwards的意思就是保留在最终的状态，也就是我们转身后的最终状态

在转身以后还会继续执行其他的动画，那么转身动作到底多久可以完成？虽然这个动画是850ms的运行时间，但是为了保证精确，一般采用事件监听的方法处理

boy.rotate方法传递一个回调，内部通过jQuery.on方法监听一个动画结束的事件，转身动画结束后会调用这个回调函数

    $boy.on(animationEnd, function() {
       callback()
       $(this).off();
    })
慕课网Logo

loge动画处理的原理与rotate是一样的，区别就是logo是2组CSS3的animation动画组成。这里需要注意的，不能同时给一个元素增加2个CSS3的关键帧动画，所以需要一个结束后，在增加下一个，这里需要通过事件监听的方式处理

代码调用部分：

    this.elem.addClass('logolightSpeedIn')
        .on(animationEnd, function() {
            $(this).addClass('logoshake').off();
        })
增加一个logolightSpeedIn的类执行一个动画，等待这个动画结束后，在增加一个logoshake的动画，具体的关键帧的写法，可以参考下源码部分

任务
在代码编辑器pageC.css样式文件中第370、374行补充代码，使慕课网logo出现左右晃动的效果。

    0%, 100% {
        -moz-transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        -moz-transform: translate3d(-5px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
        -moz-transform: translate3d(10px, 0, 0);
    }