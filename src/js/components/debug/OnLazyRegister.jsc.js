define(
    ["jquery", "backbone"],
    function ($, Backbone) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "OnLazyRegister",
                DEBUG: false
            },

            lazyRegisterConfig: {
                rootMargin: "500px"
            },

            onRegister: function () {
                this.log("onRegister");
                this.$el.css("height", "500px");
                this.$el.html(this.$el.html() + this.$el.attr("data-jsc-intern-id"));
            },

            onLazyRegister: function () {
                this.$log("onLazyRegister");
                this.$el.css("backgroundColor", "#ff0000");
            }
        });
    }
);