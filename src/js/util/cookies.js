/*jslint maxlen: 250 */
define(
    [],
    function () {
        var _setCookie = function (name, value, days) {
                if (!name || typeof name !== "string" || name === "" || !value || typeof value !== "string" || (
                    (value === "") && !days )) {
                    return false;
                }

                var date,
                    expires,
                    cookieStr;
                if (days) {
                    date = new Date();
                    date.setTime(date.getTime() + (
                        parseInt(days, 0) * 24 * 60 * 60 * 1000
                    ));
                    expires = "; expires=" + date.toGMTString();
                } else {
                    expires = "";
                }

                cookieStr = name + "=" + encodeURIComponent(value) + expires + "; path=/";
                document.cookie = cookieStr;
                return true;
            },

            _getCookie = function (name) {
                if (!name || typeof name !== "string") {
                    return null;
                }

                var allCookies,
                    singleCookie,
                    i;
                name = name + "=";
                allCookies = document.cookie.split(";");

                for (i = 0; i < allCookies.length; i++) {
                    singleCookie = allCookies[i];
                    while (singleCookie.charAt(0) === " ") {
                        singleCookie = singleCookie.substring(1, singleCookie.length);
                    }
                    if (singleCookie.indexOf(name) === 0) {
                        return decodeURIComponent(singleCookie.substring(name.length, singleCookie.length));
                    }
                }
                return null;
            },

            _deleteCookie = function (name) {
                if (_getCookie(name) !== null) {
                    return _setCookie(name, name, -1);
                }
                return false;
            };

        return {
            /*
             name = unique string
             value = string
             days = int, if 0 -> the cookie will be deleted asa user closes browser
             */
            set: function (name, value, days) {
                return _setCookie(name, value, days);
            },
            /*
             name = String
             return NULL if name not exists
             return String if name exists
             */
            get: function (name) {
                return _getCookie(name);
            },
            /*
             name = String
             */
            delete: function (name) {
                return _deleteCookie(name);
            }
        };
    });