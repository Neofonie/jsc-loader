/*jslint maxlen: 250 */
define(["util/body-tag"],
    function (BodyTagUtil) {

        var _isAuthor = function () {
            return BodyTagUtil.hasAttr("data-is-author");
        };

        return {
            isAuthor: _isAuthor
        };
    });
