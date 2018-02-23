/**
 * @author: Willy Woitas
 * @author: Matthias John
 *
 * https://aclaes.com/responsive-background-images-with-srcset-and-sizes/
 */
define(
    ["util/intersection-observer"],
    function (IntersectionObserverProxy) {
        const TransformImage = function () {
            //used for testing to create new instances
            this.__klass = TransformImage;
            this.CONST = {
                COMPONENT_NAME: "TransformImage",
                DEBUG: false,

                DATA_LAZYLOAD: "data-lazyload",

            };
            this.lazyLoadConfig = {
                rootMargin: "500px"
            };
            this.src = "";
        };

        TransformImage.prototype.onRegister = function () {
            this.log("onRegister", this.$el);
            this.$img = this.$el.find("img");

            if (this.$el.attr(this.CONST.DATA_LAZYLOAD)) {
                IntersectionObserverProxy.observeElement(this.$el, this.lazyLoadConfig, () => {
                    this.$img.attr("sizes", this.$img.data("sizes"))
                        .attr("srcset", this.$img.data("srcset"))
                        .attr("src", this.$img.data("src"));
                    // remove attr
                    this.$img.attr("data-sizes", null)
                        .attr("data-srcset", null)
                        .attr("data-src", null);
                });
            }

            this.$img.on("error", () => {
                this.finishedObserved();
            });

            this.$img.on("load", () => {
                this.log("onLoad");
                this.update();
            });

            if (this.$img.prop("complete")) {
                this.update();
            }
        };

        TransformImage.prototype.update = function () {
            this.log("update");
            let src = typeof this.$img.prop("currentSrc") !== "undefined"
                ? this.$img.prop("currentSrc") : this.$img.attr("src");
            if (this.src !== src) {
                this.src = src;
                this.$el.css("backgroundImage", "url(" + this.src + ")");
            }

            this.finishedObserved();
        };

        TransformImage.prototype.finishedObserved = function () {
            IntersectionObserverProxy.unObserveElement(this.$el);
        };

        return TransformImage;
    });