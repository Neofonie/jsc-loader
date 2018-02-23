// load common config
require.config({
    paths: "<%= requireConfig.paths %>"
});
// start up app
require(
    [
        "jquery", "underscore", "core/core-main",
        "fastclick", "util/logger", "consts/notification-const"
    ],
    function ($, _, core,
              FastClick, Logger, notificationConst) {
        // start jsc core
        core.startUp();
        core.startUpAjaxJSCWatcher();
        core.beforeOnRegister(function (component) {
            // add to every jsc the logger
            Logger.init(component);
        });
        core.bindAppToWindow();

        // add ie class to html if internet explorer.
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("MSIE ") > -1
            || userAgent.indexOf("Trident/") > -1
            || userAgent.indexOf("Edge/") > -1) {
            $("html").addClass("is-ie");
        }

        // dispatch application wide WINDOW_RESIZE event
        var cachedWidth = $(window).width();
        $(window).resize(_.debounce(function () {
            var newWidth = $(window).width();
            if (newWidth !== cachedWidth) {
                core.getAppFacade().sendNotification(notificationConst.WINDOW_RESIZE,
                    {"event": notificationConst.WINDOW_RESIZE});
                cachedWidth = newWidth;
            }
        }, 100));
        // dispatch application wide WINDOW_ORIENTATION_CHANGE event
        $(window).on("orientationchange", function () {
            core.getAppFacade().sendNotification(notificationConst.WINDOW_ORIENTATION_CHANGE,
                {"event": notificationConst.WINDOW_ORIENTATION_CHANGE});
        });
        // make click avaialbe for touch devices, avoid 300ms due touch event on click
        FastClick.attach(document.body);
    });