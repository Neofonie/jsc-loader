/*jslint maxlen: 250 */
/*global Modernizr */
/**
 * (c) Neofonie GmbH
 *
 * Author: Martin Anders
 *
 * The class provides information about the viewport modes defined in css.
 * We save data in the body pseudo elements to transfer data from CSS to JS, because it's better to have the values for
 * the display modes only in one place.
 *
 * The body:before element contains the name of the current display mode. Currently we use "desktop", "tablet" or
 * "mobile".
 * The body:after element contains the boundings (min and mayx width) of the different display modes.
 *
 * Examples:
 *
 * // get current Display mode
 * var mode = DisplayModes.getMode(); // returns "desktop"
 *
 * // use shorthand functions to check for specific mode
 * console.log(DisplayModes.isDesktop()) // true
 * console.log(DisplayModes.isTablet()) // false
 *
 * // you can get the boundings of a mode
 * var minWidthOfDesktop = DisplayMode.getWidth('minWidth', 'desktop');
 * var maxWidth = DisplayMode.getWidth('maxWidth',);
 */
define(
    ["jquery"],
    function ($) {

        /**
         * Get the css content property of body pseudo elements.
         * @param pseudoEl {string} The pseudo element selector like ":after" or ":before"
         * @returns {string} The value of the css content property
         *
         * @example
         * var content = getWindowStyle(":before");
         */
        function getWindowStyle(pseudoEl) {
            var styles = window.getComputedStyle(document.body, pseudoEl),
                content = styles.getPropertyValue("content");
            // remove first and last quote, webkit has ' and ie "
            if (content.indexOf('\'') === 0 || content.indexOf('"') === 0) {
                content = content.substring(1, styles.getPropertyValue("content").length - 1).replace(/\\"/g, '"');
            }
            // browser makes pseudo elements with empty content to none
            if (content === "none") {
                content = "";
            }

            return content;
        }

        return {
            // viewport modes
            MODE_DESKTOP: "desktop",
            MODE_TABLET: "tablet",
            MODE_MOBILE: "mobile",
            MODE_LANDSCAPE: "landscape",

            // contains information about all 3 viewport modes
            allModes: null,

            /**
             * Get the viewport mode as string.
             * @returns string The current mode. (desktop|tablet|mobile)
             */
            getMode: function () {
                var activeMode = getWindowStyle("::before");

                return activeMode;
            },
            /**
             * Get the boundings (min width and max width) of a display mode. If no mode defined then use the current
             * mode.
             * @param {string} minOrMax Can be "minWidth" or "maxWidth" the define which value you want.
             * @param {string} [mode] The display mode. If no mode defined then use the current mode.
             *
             * @example
             * // Get the min width for current display mode:
             * var minWidth = DisplayMode.getWidth("minWidth");
             *
             * // Get the max width for current display mode:
             * var maxWidth = DisplayMode.getWidth("maxWidth");
             *
             * // Get the max width for "desktop" display mode:
             * var minWidthOfDesktop = DisplayMode.getWidth("minWidth", "desktop");
             *
             * @returns {int} The width as number.
             */
            getWidth: function (minOrMax, mode) {
                // save modes for later use
                if (this.allModes === null) {
                    var allModes = getWindowStyle("::after");
                    try {
                        this.allModes = $.parseJSON(allModes || null);
                    } catch (e) {
                        this.allModes = {};
                    }
                }
                // if no mode defined use current one
                if (!mode) {
                    mode = this.getMode();
                }

                // if minOrMax not defined or not found then return 0
                if (this.allModes === null || !minOrMax || !this.allModes.hasOwnProperty(mode) ||
                    !this.allModes[mode].hasOwnProperty(minOrMax)) {
                    return 0;
                }
                return this.allModes[mode][minOrMax];
            },
            /**
             * Returns true if display mode is "desktop"
             * @returns {boolean}
             */
            isDesktop: function () {
                return this.getMode() === this.MODE_DESKTOP;
            },
            /**
             * Returns true if display mode is "tablet".
             * @returns {boolean}
             */
            isTablet: function () {
                return this.getMode().indexOf(this.MODE_TABLET) >= 0;
            },
            /**
             * Returns true if display mode is "mobile".
             * @returns {boolean}
             */
            isMobile: function () {
                return this.getMode().indexOf(this.MODE_MOBILE) >= 0;
            },

            isLandscape: function () {
                return this.getMode().indexOf(this.MODE_LANDSCAPE) >= 0;
            },
            /**
             * Returns true if display has touch.
             * @returns {boolean}
             */
            isTouch: function () {
                return window.Modernizr && window.Modernizr.touch;
            },

            isRetina: function () {
                return window.devicePixelRatio >= 2;
            }
        };
    });
