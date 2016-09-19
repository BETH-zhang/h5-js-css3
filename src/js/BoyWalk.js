function BoyWalk() {
    var $boy = $("#boy");
    var boyWidth = $boy.width();
    var boyHeight = $boy.height();
    $boy.css({ 
        top: pathY - boyHeight + 25 
    });

    function pauseWalk() {
        $boy.addClass("pauseWalk")
    }

    function restoreWalk() {
        $boy.removeClass("pauseWalk")
    }

    function slowWalk() {
        $boy.addClass("slowWalk")
    }

    function stratRun(options, runTime) {
        var dfdPlay = $.Deferred();
        restoreWalk();
        $boy.transition(options, runTime, "linear", function() {
            dfdPlay.resolve()
        });
        return dfdPlay
    }

    function walkRun(time, dist, disY) {
        time = time || 3000;
        slowWalk();
        var d1 = stratRun({ 
            "left": dist + "px",
            "top": disY ? disY : undefined 
        }, time);
        return d1
    }

    function walkToShop(doorObj, runTime) {
        var defer = $.Deferred();
        var doorObj = $(".door");
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        var offsetBoy = $boy.offset();
        var boyOffetLeft = offsetBoy.left;
        instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
        var walkPlay = stratRun({ transform: "translateX(" + instanceX + "px),scale(0.3,0.3)", opacity: 0.1 }, 2000);
        walkPlay.done(function() {
            $boy.css({ opacity: 0 });
            defer.resolve()
        });
        return defer
    }

    function walkOutShop(runTime) {
        var defer = $.Deferred();
        restoreWalk();
        var walkPlay = stratRun({ transform: "translate(" + instanceX + "px,0px),scale(1,1)", opacity: 1 }, runTime);
        walkPlay.done(function() {
            defer.resolve()
        });
        return defer
    }

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
            $boy.removeClass("slowWalk slowFlolerWalk").addClass("boyOriginal")
        },
        toShop: function() {
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