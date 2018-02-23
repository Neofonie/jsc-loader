/**
 * Author: Willy Woitas
 */
define(
    ["jquery", "underscore",
        "util/display-mode", "consts/global-const", "util/logger", "jquery-ui"],
    function ($, _,
              DisplayMode, GlobalConst, Logger) {
        var CONST = {
                COMPONENT_NAME: "ScrollTo",
                DEBUG: false,

                HTML_BODY: "html,body",
                SELECTOR_IS_STICKY: "." + GlobalConst.IS_STICKY,
                DELAY_DEBOUNCE: 10,
                THRESHOLD_SCROLL: 16,
                SELECTOR_HEADER: ".header__inner",
                SELECTOR_HEADER_INFOBAR: ".header__infobar",
                SELECTOR_EXTRA_STICKY: ".jsPlaceholder.is-sticky .jsStickyHeader"
            },
            ScrollTo;

        /**
         * scrolls with a js animation to the given position
         * with the given speed in milliseconds
         * See https://api.jqueryui.com/easings/ for supported easing values.
         * By default only "linear" and "swing" are supported. For other
         * easing effects jquery.ui is needed.
         *
         * @param position (integer)
         * @param speed (integer)
         */
        function scrollDo(position, speed, withoutHeaderAddition) {
            position = typeof position === "number" ? position : 0;
            speed = typeof speed === "number" ? speed : 1000;
            // delete sticky elements height
            if (!withoutHeaderAddition) {
                position -= ScrollTo.getHeaderHeightSummary(true);
            }

            $(CONST.HTML_BODY).stop().animate({
                scrollTop: position
            }, speed, "easeInOutQuad");
        }

        /**
         * stops a previous started animation
         * when the mouse wants to scroll
         */
        $(CONST.HTML_BODY).on("DOMMouseScroll mousewheel", function (event) {
            //alternative options for wheelData: wheelDeltaX & wheelDeltaY
            //if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
            //    // scroll down
            //
            //} else {
            //    //scroll up
            //}
            $(CONST.HTML_BODY).stop();
        });

        ScrollTo = {
            /**
             * scroll to top
             *
             * @param speed (integer)
             */
            top: function (speed) {
                scrollDo(0, speed);
            },
            /**
             * scroll to a pixel position without "px"
             *
             * @param position (integer)
             * @param speed (integer)
             */
            position: function (position, speed) {
                this.log(position, speed);

                // scroll in mobile 0 and desktop with animation
                if (_.isBoolean(speed) && speed === true) {
                    speed = DisplayMode.isMobile() ? 0 : GlobalConst.SCROLL_DURATION_DESKTOP;
                }

                scrollDo(position, speed);
            },

            element: function (element, speed) {
                var $element = $(element),
                    position = $element.offset().top;

                this.log(position);
                scrollDo(position, speed);
            },

            elementsBottom: function (element, speed) {
                var $element = $(element),
                    $w = $(window),
                    topOfViewport = $w.scrollTop(),
                    bottomOfElement = Math.round($element.offset().top + $element.height()),
                    bottomOfViewport = topOfViewport + $w.height(),
                    diffTop = bottomOfElement - bottomOfViewport;

                this.log("diffTop", diffTop);

                // if bottom of element is outside, scroll to it
                if (diffTop > 0) {
                    this.log("newTop", diffTop + topOfViewport);
                    // 16px threshold
                    scrollDo(diffTop + topOfViewport + CONST.THRESHOLD_SCROLL, speed, true);
                }
            },
            /**
             * Returns true if given $element (jqueryElement) is complete in viewport
             * return false if $element is not complete in viewport
             *
             * @param $element (object)
             * @returns (boolean)
             */
            isInViewport: function ($element) {
                if (!($element instanceof jQuery) || ($element instanceof jQuery && $element.length === 0)) {
                    return false;
                }

                // jquery $(window).height() returns wrong value so we use pure js
                var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName("body")[0],
                    y = w.innerHeight || e.clientHeight || g.clientHeight,
                    viewport = {},
                    bounds = {};
                // set viewport
                viewport.top = $(w).scrollTop();
                viewport.bottom = viewport.top + y;
                // set bounds
                bounds.top = $element.offset().top;
                bounds.bottom = bounds.top + $element.outerHeight();

                return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top))
                    && (viewport.top <= bounds.top)
                    && (viewport.bottom >= bounds.bottom);
            },

            getViewport: function () {
                var $w = $(window);
                return {
                    left: $w.scrollLeft(),
                    // add mobile sticky header
                    top: $w.scrollTop() + this.getHeaderHeight(),
                    width: $w.width(),
                    height: $w.height()
                };
            },

            isAtTop: function () {
                return $(window).scrollTop() < 5;
            },
            // payload function
            // first call returns for all follower the same value
            getHeaderHeightSummary: _.debounce(function (withExtraStickyElements) {
                var headerHeight = this.getHeaderHeight(),
                    atTop = this.isAtTop();

                if (atTop) {
                    headerHeight += this.getHeaderInfobarHeight();
                }

                if (withExtraStickyElements && $(CONST.SELECTOR_EXTRA_STICKY).length > 0) {
                    headerHeight += $(CONST.SELECTOR_EXTRA_STICKY).height();
                }

                this.log("getHeaderHeightSummary()", headerHeight);

                return headerHeight;
            }, 5000, true),

            getHeaderInfobarHeight: function () {
                return $(CONST.SELECTOR_HEADER_INFOBAR).height();
            },

            getHeaderHeight: function () {
                return $(CONST.SELECTOR_HEADER).outerHeight();
            }
        };

        Logger.init(ScrollTo, CONST.DEBUG, CONST.COMPONENT_NAME);
        // public api
        window.ScrollTo = ScrollTo;

        return ScrollTo;
    });
