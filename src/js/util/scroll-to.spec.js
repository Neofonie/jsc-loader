define(
    ["jquery", "underscore", "util/scroll-to"], function ($, _, ScrollTo) {
    describe("Util ScrollTo", function () {

        var object

        beforeEach(function () {
            object = ScrollTo
        })

        describe("has methods", function () {
            var methods = "top position isInViewport".split(" ")

            $.each(methods, function (index, method) {
                it(method, function () {
                    expect(object[method]).toBeDefined()
                })
            })
        })

        it("dom scroll event handles a stop animation function", function () {
            var $htmlBody = $("html,body")
            spyOn($.fn, "stop")

            $htmlBody.triggerHandler("DOMMouseScroll")
            expect($.fn.stop).toHaveBeenCalled()

            $htmlBody.triggerHandler("mousewheel")
            expect($.fn.stop).toHaveBeenCalled()
        })

        describe("top()", function () {
            it("default return nothing", function () {
                expect(object.top()).toBe(undefined)
            })

            it("should scroll to 0", function () {
                spyOn($.fn, "animate")

                object.top()

                expect($.fn.animate).toHaveBeenCalledWith({
                    scrollTop: 0
                }, 1000, "easeInOutQuad")
            })

            it("should scroll to 0 in 500ms", function () {
                spyOn($.fn, "animate")

                object.top(500)

                expect($.fn.animate).toHaveBeenCalledWith({
                    scrollTop: 0
                }, 500, "easeInOutQuad")
            })
        })

        describe("position()", function () {
            it("default return nothing", function () {
                expect(object.position()).toBe(undefined)
            })

            describe("should scroll to", function () {
                beforeEach(function () {
                    spyOn($.fn, "animate")
                })

                it("0 without params", function (done) {
                    object.position()

                    setTimeout(function () {
                        expect($.fn.animate).toHaveBeenCalledWith({scrollTop: 0}, 1000, "easeInOutQuad")
                        done()
                    }, 50)
                })

                it("100 in 500ms with params", function (done) {
                    object.position(100, 500)

                    setTimeout(function () {
                        expect($.fn.animate).toHaveBeenCalledWith({scrollTop: 100}, 500, "easeInOutQuad")
                        done()
                    }, 50)
                })
            })
        })

        describe("isInViewport()", function () {
            it("default should return false", function () {
                expect(object.isInViewport()).toBeFalsy()
                expect(object.isInViewport(undefined)).toBeFalsy()
                expect(object.isInViewport($())).toBeFalsy()
                expect(object.isInViewport({})).toBeFalsy()
                expect(object.isInViewport([])).toBeFalsy()
            })

            describe("with given element return", function () {
                it("true", function () {
                    expect(object.isInViewport($("body"))).toBeTruthy()
                })

                it("false it isnt complete visible and return true while it is visible", function () {
                    var $element = $('<div style="position:absolute;left:0;">huhu</div>').appendTo("body")
                    $element.css("top", 10000)
                    expect(object.isInViewport($element)).toBeFalsy()
                    $element.css("top", 100)
                    expect(object.isInViewport($element)).toBeTruthy()
                    $element.remove()
                })
            })
        })
    })
})
