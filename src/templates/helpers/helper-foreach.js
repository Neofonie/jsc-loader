(function () {
    module.exports.register = function (Handlebars, options) {

        /*
         {{#foreach foo}}
         <div class='{{#if $first}} first{{/if}}{{#if $last}} last{{/if}}'></div>
         {{/foreach}}
         */
        Handlebars.registerHelper("foreach", function (arr, options) {
            if (options.inverse && !arr.length)
                return options.inverse(this);

            return arr.map(function (item, index) {
                item.$index = index;
                item.$first = index === 0;
                item.$last = index === arr.length - 1;

                return options.fn(item);
            }).join("");
        });
    };
}).call(this);