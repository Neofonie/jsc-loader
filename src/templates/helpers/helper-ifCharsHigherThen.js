(function () {
    /*
    {{#ifCharsHigherThen cta_label 25}}button--lower-letter-spacing{{/ifCharsHigherThen}}
    */

    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("ifCharsHigherThen", function (string, maxChars, options) {
            if (string && (string.length >= maxChars)) {
                return options.fn(this);
            }
            return "";
        });
    }
}).call(this);