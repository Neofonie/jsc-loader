/**
 * Author: Matthias John, Willy Woitas
 */
define(
    ["jquery", "underscore"], function ($, _) {
        return {
        /**
         * Lower the first letter of a word or sentence.
         *
         * @param string <string>
         * @returns {string}
         */
            lowerCaseFirstLetter: function (string) {
                var returnString = "";
                if (_.isString(string)) {
                    returnString = string.charAt(0).toLowerCase() + string.slice(1);
                } else {
                    throw new Error(string + " is not a String.");
                }
                return returnString;
            },

            ucFirst: function (string) {
                return string && typeof string === "string" ? string.charAt(0).toUpperCase() + string.slice(1) : "";
            },
            /**
         * Checks whether one of the following conditions are fulfilled:
         * 1) the specified string starts with the specified substring and ends with /
         * 2) the specified string is equal to the substring
         * @param str the string to check
         * @param sub the substring
         * @returns {boolean}
         */
            startsWith: function (haystack, needle) {
                return (haystack !== undefined) && (haystack === needle || haystack.indexOf(needle) === 0);
            },
            /**
         * Checks if
         * @param str string to check
         * @returns {boolean}
         */
            endsWith: function (str, suffix) {
                return _.isString(str) && _.isString(suffix) &&
                str.length >= suffix.length && str.substr(str.length - suffix.length) === suffix;
            },

            removeWhitespaceChain: function (str) {
                if (!_.isString(str)) {
                    throw new TypeError("Attribute is not a String.");
                }
                return $.trim(str.replace(/\s+/g, " "));
            },

            has: function (haystack, needle) {
                return haystack && needle ? haystack.indexOf(needle) > 0 : false;
            }
        };
    });
