/*jslint white:true*/
/**
 * Author: Martin Anders
 *
 * This class is used to set a click listener on an element.
 * The url can be defined as data-url attribute.
 *
 * Also if the element has children with the class name "jsLink", then this children
 * are clickable as well.
 *
 */
define(
    ["jquery", "underscore", "backbone",
        "util/history-api", "util/string", "util/scroll-to"],
    function ($, _, Backbone,
              HistoryApi, StringUtil, ScrollTo) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "JSLinks",
                DEBUG: false,

                CLASS_DISABLED: "jsc-disabled",
                SEL_LINKS_ADD_WCM: ".jsAddWCM"
            },

            events: {
                "click .jsLink": "onLinkClick",
                "click .jsLinkStopPropagation": "onLinkStopPropagation"
            },

            anchorLink: null,

            /**
             * Get config from html and update the position of the callout
             */
            onRegister: function () {
                this.log("JSLinks.onRegister()");

                if (this.$el.data("url")) {
                    this.log(this.$el.data("url"));
                }

                if (this.$el.hasClass(this.CONST.CLASS_DISABLED)) {
                    return false;
                }

                _.bindAll(this, "onLinkClick");

                // if element has url defined, add listener to element
                if (this.$el.data("url")) {
                    this.$el.click(this.onLinkClick);
                }

                this.addWCMDisabledToAllLinks(this.$el.find(this.CONST.SEL_LINKS_ADD_WCM));
            },
            /**
             * event function for all links inside this jsc
             * @param event
             */
            onLinkClick: function (event) {
                this.log("onLinkClick");
                var $element = $(event.currentTarget),
                    url = $element.data("url"),
                    target = $element.data("target");

                if (this.isAnchorLinkInside()) {
                    this.log("isAnchorLinkInside()", this.anchorLink);
                    this.jumpToAnchor(this.anchorLink);
                    event.stopPropagation();
                    return false;
                }

                if (url
                    && url !== ""
                    && url !== "#") {
                    if (HistoryApi.hasEnvironmentWCMDisabled()) {
                        url = HistoryApi.addWCMDisabledToHref(url, false);
                    }

                    if (target !== "_blank") {
                        HistoryApi.setWindowLocationHref(url);
                    } else {
                        HistoryApi.openNewWindow(url, target, true);
                    }
                }
            },

            isAnchorLinkInside: function () {
                var links = this.$el.find("a");
                if (links.length === 1 && StringUtil.startsWith(links.attr("href"), "#")) {
                    this.anchorLink = links.attr("href");
                    return true;
                }
                return false;
            },

            jumpToAnchor: function (anchorId) {
                if (anchorId && StringUtil.startsWith(anchorId, "#")) {
                    var anchorElement = $(anchorId);
                    if (anchorElement.length === 1) {
                        ScrollTo.element(anchorElement);
                    }
                }
            },
            /**
             * event function for all links inside this jsc
             * @param event
             */
            onLinkStopPropagation: function (event) {
                this.log("onLinkStopPropagation");
                event.stopPropagation();
            },

            addWCMDisabledToAllLinks: function ($links) {
                if ($links.length > 0) {
                    $links.each(function(){
                        var $link = $(this),
                            href = $link.attr("href");
                        $link.attr("href", (HistoryApi.hasEnvironmentWCMDisabled()
                            ? HistoryApi.addWCMDisabledToHref(href) : href));
                    });
                }
            }
        });
    });
