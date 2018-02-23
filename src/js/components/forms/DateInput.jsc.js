/*jslint white:true*/

/**
 *
 * Author: Matthias John
 *
 * This class modifies the input to receive date strings in the format
 * you configured.
 *
 */

define(
    ["jquery", "underscore", "backbone", "cleave"],
    function ($, _, Backbone, Cleave) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "DateInput",
                DEBUG: false,

                DATE_PATTERN_ATTR: "data-date-pattern",
                DATE_DELIMITER_ATTR: "data-date-delimiter",

                CLASS_DATE_OUTPUT: "jsDateOutput",

                DEFAULT_DATE_PATTERN: "dmY",
                DEFAULT_DATE_DELIMITER: "/"
            },

            /**
             * Register hook of Backbone View
             */
            onRegister: function () {
                this.log("onRegister");
                this.loadAttributes();
                this.registerListener();
            },

            /**
             * Load component attributes or use default ones
             */
            loadAttributes: function () {
                this.datePattern = this.$el.attr(this.CONST.DATE_PATTERN_ATTR) ||
                    this.CONST.DEFAULT_DATE_PATTERN;
                this.dateDelimiter = this.$el.attr(this.CONST.DATE_DELIMITER_ATTR) ||
                    this.CONST.DEFAULT_DATE_DELIMITER;
            },

            /**
             * Register for events happen on view element
             */
            registerListener: function () {
                this.cleave = new Cleave(this.$el, {
                    date: true,
                    datePattern: this.datePattern.split(""),
                    delimiter: this.dateDelimiter
                });

                this.$el.on("blur.dateInput", _.bind(this.outputFormattedDate, this));
                this.$el.on("keyup.dateInput", _.bind(this.setDateYearAttribute, this));
            },

            /**
             * Reads cleave.js raw date and returns a selligent formatted date string.
             * Selligent format: yyyy-mm-dd
             */
            getSelligentFormattedDate: function () {
                var rawDateValue = this.cleave.getRawValue();
                var blocks = this.cleave.properties.dateFormatter.blocks;
                var datePattern = this.cleave.properties.dateFormatter.datePattern;

                var rawValueSplit = _.map(blocks, function (val, idx, list) {
                    var sliceIndex = 0;
                    for (var i = 0; i < idx; i++) {
                        sliceIndex = sliceIndex + list[i];
                    }
                    return rawDateValue.toString().slice(sliceIndex, sliceIndex + val);
                });

                return rawValueSplit[datePattern.indexOf("Y")] + "-" +
                       rawValueSplit[datePattern.indexOf("m")] + "-" +
                       rawValueSplit[datePattern.indexOf("d")];
            },

            /**
             * Output the formatted date to a hidden input
             */
            outputFormattedDate: function () {
                var $dateOutput = this.$el.parent().find("." + this.CONST.CLASS_DATE_OUTPUT);
                $dateOutput.val(this.getSelligentFormattedDate());
            },

            /**
             * output date year attribute for year validation
             */
            setDateYearAttribute: function () {
                this.$el.attr("data-date-year", this.getSelligentFormattedDate().slice(0,4));
            }
        });
    });
