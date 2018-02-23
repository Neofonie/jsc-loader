(function () {
    module.exports.register = function (Handlebars, options) {

        /*
         * ifEqual helper.
         *
         * compare two variables
         *
         * Example:
         * {{#ifEqual ../../../active index}}
         * block content
         * {{/ifEqual}}
         *
         * @return block content
         */

        Handlebars.registerHelper("ifEqual", function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        /*
         * ifGreaterThan helper.
         *
         * check value 1 greater than value 2
         *
         * Example:
         * {{#ifLowerThan ../../buttons index}}
         * block content
         * {{/if}
         *
         * @return block content
         */

        Handlebars.registerHelper("ifGreaterThan", function (v1, v2, options) {
            if (v1 >= v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        /*
         * ifLowerThan helper.
         *
         * check value 1 lower than value 2
         *
         * Example:
         * {{#ifLowerThan ../../buttons index}}
         * block content
         * {{/if}
         *
         * @return block content
         */

        Handlebars.registerHelper("ifLowerThan", function (v1, v2, options) {
            if (v1 <= v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }
}).call(this);