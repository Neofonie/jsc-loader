/*jslint bitwise:true*/
/**
 * Author: Martin Anders
 * 21.09.2015
 *
 * This class should be used ONLY in clients folder for testing purposes.
 *
 * IF you add this component in the html you can send notifications in the console like this:
 *
 * window.appDebug.sendNotification( "noteName", dataObject);
 *
 * Example usage und dialog_banner.html
 */
define(
    ["jquery", "backbone", "consts/notification-const"],
    function ($, Backbone, NotificationConst) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "Debug",
                DEBUG: false,

                ENTRANCE: (5 << 8) + (462 >> 3)
            },

            entrance: false,
            /**
             * Component registered.
             */
            onRegister: function () {
                this.log("onRegister()");
                window.appDebug = this;
                this.handleReallyDebug();
            },

            /**
             * Register for Notifications
             * @returns {*[]}
             */
            listNotificationInterests: function () {
                return [
                    NotificationConst.WINDOW_RESIZE
                ];
            },

            /**
             * Handle notifications.
             *
             * @param notificationName
             * @param notificationData
             */
            handleNotification: function (notificationName, notificationData) {
                this.log("handleNotification()", notificationName, notificationData);
                switch (notificationName) {
                    case NotificationConst.WINDOW_RESIZE:
                        this.handleReallyDebug();
                        break;
                }
            },

            handleReallyDebug: function () {
                var windowWidth = $(window).width();
                if (windowWidth >= this.CONST.ENTRANCE - 1
                    && windowWidth <= this.CONST.ENTRANCE + 1) {
                    this.entrance = true;
                    require(["components/debug/DebugProxy"], function (DebugProxy) {
                        DebugProxy.enter();
                    });
                } else if (this.entrance) {
                    this.entrance = false;
                    require(["components/debug/DebugProxy"], function (DebugProxy) {
                        DebugProxy.leave();
                    });
                }
            },

            /**
             * Send notification to the app.
             * @param notificationName
             * @param notificationData
             */
            sendNotification: function (notificationName, notificationData) {
                this.app.sendNotification(notificationName, notificationData);
            }
        });
    });
