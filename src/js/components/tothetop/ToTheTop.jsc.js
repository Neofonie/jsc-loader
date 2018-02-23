/**
 * handle the 'ToTheTop' link button
 *
 * @author michael@neofonie.de
 */
define(
    ["jquery", "underscore", "backbone", "util/scroll-to"],
    function ($, _, Backbone, ScrollTo) {
        "use strict";
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "ToTheTop",
                DEBUG: false,
                // pixel to scroll to to see the link
                SCROLL_LIMIT_PX: 1500,
                // adapted bottom for the trusted shop container
                TRUSTEDSHOP_CONTAINER_BOTTOM: "89px",
                // identifier to find the trusted shop container
                TRUSTEDSHOP_CONTAINER_IDENTIFIER: "[data-tb-element='trustbadge_minimised_container']",
                // key name to save the old bottom value of the trusted shop container
                TRUSTEDSHOP_REMINDER: "default_bottom",
                // css class name to make the link visible
                TP_LINK_VISIBLE: "is-visible"
            },

            events: {
                "click": "onClick"
            },

            onRegister: function () {
                this.log("onRegister()");
                $(window).scroll( _.bind(this.onScrollFn, this));
            },

            onClick: function() {
                ScrollTo.top(500);
            },

            onScrollFn: function () {
                // get the current scroll position
                var curScroll = $(window).scrollTop();
                if (curScroll > this.CONST.SCROLL_LIMIT_PX) {
                    this.$el.addClass(this.CONST.TP_LINK_VISIBLE);
                } else {
                    this.$el.removeClass(this.CONST.TP_LINK_VISIBLE);
                }
                // check the trusted shop icon
                var $trustBadge = $(this.CONST.TRUSTEDSHOP_CONTAINER_IDENTIFIER);
                if ($trustBadge.length > 0) {
                    var $badge = $trustBadge.parent();
                    if (!$badge.data(this.CONST.TRUSTEDSHOP_REMINDER)) {
                        $badge.data(this.CONST.TRUSTEDSHOP_REMINDER, $badge.css("bottom"));
                    }
                    if (curScroll > this.CONST.SCROLL_LIMIT_PX) {
                        $badge.css("bottom", this.CONST.TRUSTEDSHOP_CONTAINER_BOTTOM);
                    } else {
                        $badge.css("bottom", $badge.data(this.CONST.TRUSTEDSHOP_REMINDER));
                    }
                }
            }
        });
    });
