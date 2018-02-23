/**
 * Config data parser
 * Author: Martin Anders
 */

define(
    ["jquery", "underscore"],
    function ($, _) {
        /**
         * convert html attr data {key: 'value', key2: 'value2'}
         * to valid json {"key": "value", "key2": "value2"}
         */
        return {
            parse: function ($el, defaults) {
                var externConfig = "{}";
                defaults = defaults || {};
                if ($el.data("config")) {
                    externConfig = $el.data("config")
                        .replace(/'/g, '"')
                        .replace(/\{/g, '{"')
                        .replace(/:/g, '":')
                        .replace(/, /g, ', "');
                }

                return _.extend({}, defaults, $.parseJSON(externConfig));
            }
        };
    });
