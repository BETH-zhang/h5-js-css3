function BoyWalk() {
        var $boy = $("#boy");
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();
        $boy.css({ top: pathY - boyHeight + 25 });

        function pauseWalk() { $boy.addClass("pauseWalk") }

        function restoreWalk() { $boy.removeClass("pauseWalk") }

        function slowWalk() { $boy.addClass("slowWalk") }

        function stratRun(options, runTime) {
            var dfdPlay = $.Deferred();
            restoreWalk();
            $boy.transition(options, runTime, "linear", function() { dfdPlay.resolve() });
            return dfdPlay }

        function walkRun(time, dist, disY) { time = time || 3000;
            slowWalk();
            var d1 = stratRun({ "left": dist + "px", "top": disY ? disY : undefined }, time);
            return d1 }

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

        function walkOutShop(runTime) {
            var defer = $.Deferred();
            restoreWalk();
            var walkPlay = stratRun({ transform: "translate(" + instanceX + "px,0px),scale(1,1)", opacity: 1 }, runTime);
            walkPlay.done(function() { defer.resolve() });
            return defer }

        function calculateDist(direction, proportion) {
            return (direction == "x" ? visualWidth : visualHeight) * proportion }
        return { walkTo: function(time, proportionX, proportionY) {
                var distX = calculateDist("x", proportionX);
                var distY = calculateDist("y", proportionY);
                return walkRun(time, distX, distY) }, stopWalk: function() { pauseWalk() }, resetOriginal: function() { this.stopWalk();
                $boy.removeClass("slowWalk slowFlolerWalk").addClass("boyOriginal") }, toShop: function() {
                return walkToShop.apply(null, arguments) }, outShop: function() {
                return walkOutShop.apply(null, arguments) }, rotate: function(callback) { restoreWalk();
                $boy.addClass("boy-rotate");
                if (callback) { $boy.on(animationEnd, function() { callback();
                        $(this).off() }) } }, getWidth: function() {
                return $boy.width() }, getDistance: function() {
                return $boy.offset().left }, talkFlower: function() { $boy.addClass("slowFlolerWalk") } }
    }
    var BoyToShop = function(boyObj) {
        var defer = $.Deferred();
        var $door = $(".door");
        var doorLeft = $(".door-left");
        var doorRight = $(".door-right");

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

        function openDoor(time) {
            return doorAction("-50%", "100%", time) }

        function shutDoor(time) {
            return doorAction("0%", "50%", time) }

        function talkFlower() {
            var defer = $.Deferred();
            boyObj.talkFlower();
            setTimeout(function() { defer.resolve() }, confi.setTime.waitFlower);
            return defer }
        var lamp = {
            elem: $(".b_background"),
            bright: function() {
                this.elem.addClass("lamp-bright")
            },
            dark: function() { this.elem.removeClass("lamp-bright") }
        };
        var waitOpen = openDoor(confi.setTime.openDoorTime);
        waitOpen.then(function() { lamp.bright();
            return boyObj.toShop($door, confi.setTime.walkToShop) }).then(function() {
            return talkFlower() }).then(function() {
            return boyObj.outShop(confi.setTime.walkOutShop) }).then(function() { shutDoor(confi.setTime.shutDoorTime);
            lamp.dark();
            defer.resolve() });
        return defer
    };

    function snowflake() {
        var $flakeContainer = $("#snowflake");

        function getImagesName() {
            return confi.snowflakeURl[[Math.floor(Math.random() * 6)]] }

        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({ "width": 41, "height": 41, "position": "absolute", "backgroundSize": "cover", "zIndex": 100000, "top": "-41px", "backgroundImage": "url(" + url + ")" }).addClass("snowRoll") }
        setInterval(function() {
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1;
            endPositionTop = visualHeight - 40, endPositionLeft = startPositionLeft - 100 + Math.random() * 500, duration = visualHeight * 10 + Math.random() * 5000;
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;
            var $flake = createSnowBox();
            $flake.css({ left: startPositionLeft, opacity: randomStart });
            $flakeContainer.append($flake);
            $flake.transition({ top: endPositionTop, left: endPositionLeft, opacity: 0.7 }, duration, "ease-out", function() { $(this).remove() }) }, 200) }

    function Hmlt5Audio(url, loop) {
        var audio = new Audio(url);
        audio.autoplay = true;
        audio.loop = loop || false;
        audio.play();
        return { end: function(callback) { audio.addEventListener("ended", function() { callback() }, false) } } }