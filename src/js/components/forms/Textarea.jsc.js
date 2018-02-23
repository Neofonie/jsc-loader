/**
 * Util for Textarea functionallity
 * Here we can do also auto resize
 *
 * But now only a cursor switch for chrome is implemented
 * http://stackoverflow.com/questions/9932569/css-to-change-the-cursor-style-of-the-resize-button-on-a-textarea
 */
define(
    ["jquery", "underscore", "backbone", "autosize"],
    function ($, _, Backbone, autosize) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "Textarea",
                DEBUG: false,

                CLASS_AUTORESIZE: "has-autoresize",
                DATA_MAX_LENGTH: "max-length",
                CLS_COUNTER: "textarea--counter"
            },

            maxLength: 0,
            $counter: null,

            onRegister: function () {
                this.log("onRegister");
                autosize(this.$el);
                this.$el.addClass(this.CONST.CLASS_AUTORESIZE);

                this.maxLength = this.$el.data(this.CONST.DATA_MAX_LENGTH);
                this.log("hasMaxLength", this.maxLength);
                if (this.maxLength) {
                    this.$counter = $('<span class="' + this.CONST.CLS_COUNTER + '">'
                        + this.maxLength + " / " + this.maxLength + '</span>');
                    this.$el.after(this.$counter);

                    this.$el.keydown(_.bind(this.checkMaxLength, this));
                    this.$el.keyup(_.bind(this.checkMaxLength, this));
                    this.$el.blur(_.bind(this.checkMaxLength, this));
                }
            },

            checkMaxLength: function () {
                this.log("checkMaxLength");
                var maxLength = parseInt(this.maxLength, 10);
                if (this.$el.val().length > maxLength) {
                    this.$el.val(this.$el.val().substr(0, maxLength));
                    return false;
                }
                this.$counter.html((maxLength - this.$el.val().length) + " / " + maxLength);
            }
        });
    });
