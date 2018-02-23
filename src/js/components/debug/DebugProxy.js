define(
    ["jquery"],
    function ($) {
        var init,
            entered,
            $entrance,
            count = 0;

        function toggleEntrance(forceFalse) {
            if ($entrance) {
                var style = $entrance.css("font-style");
                if (!forceFalse && style === "normal") {
                    $entrance.css("font-style", "italic");
                } else if (forceFalse || style === "italic") {
                    $entrance.css("font-style", "");
                }
            }
        }

        function enter() {
            if (!entered) {
                require(["components/debug/DebugCore"], function (DebugCore) {
                    count = 0;
                    DebugCore.enter();
                    entered = true;
                });
            }
        }

        return {
            enter: function () {
                if (!init) {
                    init = true;
                    $entrance = $(".glyph.glyph--ifolor").parent();

                    toggleEntrance(true);

                    $entrance.click(function (event) {
                        event.preventDefault();
                        toggleEntrance();
                        count++;
                        if (count === 5) {
                            enter();
                        }
                    });
                }
            },
            leave: function () {
                toggleEntrance(true);
                if ($entrance) {
                    $entrance.off("click");
                    $entrance = null;
                }
                init = false;
                require(["components/debug/DebugCore"], function (DebugCore) {
                    count = 0;
                    DebugCore.leaveIt();
                    entered = null;
                });
            }
        };
    });