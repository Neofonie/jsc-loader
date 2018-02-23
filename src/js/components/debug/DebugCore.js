define(
    ["jquery", "underscore", "handlebars", "text!tpl/debugCore.hbs"],
    function ($, _, Handlebars, tpl) {
        var path = "/etc/designs/ifolor/img/products/",
            data,
            shown,
            $slider,
            $backdrop,
            template = Handlebars.compile(tpl),
            comp;

        function show() {
            $slider.removeClass("fade-out").addClass("fade-in");
            shown = true;
        }

        function mouseWheelEvt(event, delta) {
            var $content = $slider.find(".jsContent");

            if ((event.originalEvent.wheelDelta || event.originalEvent.detail) > 0) {
                $content[0].scrollLeft -= 250;
            } else {
                $content[0].scrollLeft += 250;
            }

            event.preventDefault();
        }

        function render() {
            $slider = $(template(data));
            $(document.body).append($slider);

            $backdrop = $slider.find(".jsBackdrop");

            $backdrop.click(function () {
                comp.leave();
            });

            $("body").on("mousewheel", mouseWheelEvt);

            _.delay(function () {
                show();
            }, 250);
        }

        comp = {
            enter: function () {
                if (!data) {
                    $.ajax(path + "data.json").success(function (_data_) {
                        data = _data_;

                        var products = data.products,
                            productKeys = data.order,
                            sortedProducts = [];

                        productKeys.forEach(function (key) {
                            var product = products[key];

                            sortedProducts.push({
                                key: key,
                                image: path + (product.noimg ? "00" : key) + ".png",
                                name: product.name,
                                type: product.type,
                                description: data.legend[product.type]
                            });
                        });

                        data.products = sortedProducts;

                        render();
                    });
                } else {
                    render();
                }
            },
            leave: function () {
                if ($slider) {
                    $slider.addClass("fade-out");

                    $("body").off("mousewheel", mouseWheelEvt);

                    _.delay(function () {
                        $slider.remove();
                        $slider = null;
                        shown = false;
                    }, 250);
                }
            },
            leaveIt: function () {
                if (!shown) {
                    this.leave();
                }
            }
        };

        return comp;
    });
