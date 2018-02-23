define(
    ["underscore"],
    function (_) {
        return function (callbackFn) {
            if (_.isFunction(window.requestAnimationFrame) === true) {
                window.requestAnimationFrame(callbackFn);
            } else {
                window.setTimeout(callbackFn, 0);
            }
        };
    });