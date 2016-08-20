>背景音乐很简单，可以直接用HTML5的audio元素播放。在HTML5标准网页里面，我们可以运用audio标签来完成我们对声音的调用及播放。

使用：

    var audio = new Audio(url);   //创建一个音频对象并传入地址
    audio.loop  = loop ||  false; //是否循环
    audio.play(); //开始播放
传递一个视频的地址，创建一个Audio对象，设置属性loop是否循环播放，然后调用play方法就可以实现播放了

在七夕的主题效果中，音乐跟随主题页面不断的切换而变化，一共会有四段不同背景音乐+一个循环音乐， 在配音上给人的感觉是跟主题页面的切换是比较吻合的，主要是因为主题的的动画时间，都是按照音频的音乐设置的，这样在实现上是最简单的，当然带来的问题就是不灵活了

如果要实现一个页面独立配一段音频也是可以的，在Swipe.js中预留了watch的接口，可以通过页面的left坐标改动来计算是否已经切换了一个新的且页面

在右边的代码区域，把video封装到了Hmlt5Audio函数中，暴露了一个end的接口，音频有一个ended的事件，用来得到音频是放播放完毕的通知，通过事件监听从可以处理多个音频的连续调用

    var audio1 = Hmlt5Audio(audioConfig.playURl)
    audio1.end(function() {
        Hmlt5Audio(audioConfig.cycleURL, true)
    })
任务
打开index.html文件，在代码的126行填入相应代码，这样可以开始第一段音乐的循环播放

    Hmlt5Audio(audioConfig.cycleURL, true);