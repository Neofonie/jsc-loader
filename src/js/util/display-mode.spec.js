define(
    ["jquery", "util/display-mode", "util/unit"],
    function ($, DisplayMode, UnitUtil) {
        describe("Util DisplayMode", function () {
            var object,
                style

            function createStyle(mode, json) {
                removeStyle()

                var after = ""
                if (json) {
                    after = "body:after{content:'" + json + "'}"
                }

                style = $('<style>body:before{content:\'' + mode + '\'}' + after + '</style>').appendTo("head")
            }

            function removeStyle() {
                if (style) {
                    style.remove()
                }
            }

            beforeEach(function () {
                object = DisplayMode
            })

            afterEach(function () {
                removeStyle()
            })

            it("check default", function () {
                expect(object.MODE_DESKTOP).toBe("desktop")
                expect(object.MODE_TABLET).toBe("tablet")
                expect(object.MODE_MOBILE).toBe("mobile")
                expect(object.allModes).toBe(null)
            })

            describe("has methods", function () {
                var methods = "getMode getWidth isDesktop isTablet isMobile isTouch".split(" ")

                $.each(methods, function (index, method) {
                    it(method, function () {
                        expect(object[method]).toBeDefined()
                    })
                })
            })

            describe("getMode()", function () {
                it("default is empty", function () {
                    expect(object.getMode()).toBe("")
                })

                it("body has :before get its content", function () {
                    createStyle(object.MODE_DESKTOP)
                    expect(object.getMode()).toBe(object.MODE_DESKTOP)

                    removeStyle()
                    expect(object.getMode()).toBe("")
                })
            })

            describe("getWidth()", function () {
                it("default is empty", function () {
                    expect(object.getWidth()).toBe(0)
                    expect(object.getWidth(undefined)).toBe(0)
                    expect(object.getWidth(null)).toBe(0)
                    expect(object.getWidth("moep")).toBe(0)
                    expect(object.getWidth([])).toBe(0)
                    expect(object.getWidth({})).toBe(0)
                    expect(object.getWidth(undefined, undefined)).toBe(0)
                    expect(object.getWidth(undefined, {})).toBe(0)
                    expect(object.getWidth(undefined, [])).toBe(0)
                })

                it("body has :after get all widths and mode is desktop", function () {
                    createStyle(object.MODE_DESKTOP, '{"mobile":{"maxWidth":320},"tablet":{"minWidth":650,"maxWidth":987},"desktop":{"minWidth":988}}')

                    expect(object.getWidth()).toBe(0)
                    // get active mode data
                    expect(object.getWidth("minWidth")).toBe(988)
                    expect(object.getWidth("maxWidth")).toBe(0)
                    // same as above
                    expect(object.getWidth("minWidth", object.MODE_DESKTOP)).toBe(988)
                    expect(object.getWidth("maxWidth", object.MODE_DESKTOP)).toBe(0)
                    // get mode data
                    expect(object.getWidth("minWidth", object.MODE_MOBILE)).toBe(0)
                    expect(object.getWidth("maxWidth", object.MODE_MOBILE)).toBe(320)
                    expect(object.getWidth("minWidth", object.MODE_TABLET)).toBe(650)
                    expect(object.getWidth("maxWidth", object.MODE_TABLET)).toBe(987)
                })
            })

            describe("isDesktop()", function () {
                it("default is false", function () {
                    expect(object.isDesktop()).toBeFalsy()
                })

                it("check boolean", function () {
                    createStyle(object.MODE_DESKTOP)
                    expect(object.isDesktop()).toBeTruthy()

                    createStyle(object.MODE_TABLET)
                    expect(object.isDesktop()).toBeFalsy()

                    createStyle(object.MODE_MOBILE)
                    expect(object.isDesktop()).toBeFalsy()

                    removeStyle()
                    expect(object.isDesktop()).toBeFalsy()
                })
            })

            describe("isTablet()", function () {
                it("default is false", function () {
                    expect(object.isTablet()).toBeFalsy()
                })

                it("check boolean", function () {
                    createStyle(object.MODE_DESKTOP)
                    expect(object.isTablet()).toBeFalsy()

                    createStyle(object.MODE_TABLET)
                    expect(object.isTablet()).toBeTruthy()

                    createStyle(object.MODE_MOBILE)
                    expect(object.isTablet()).toBeFalsy()

                    removeStyle()
                    expect(object.isTablet()).toBeFalsy()
                })
            })

            describe("isMobile()", function () {
                it("default is false", function () {
                    expect(object.isMobile()).toBeFalsy()
                })

                it("check boolean", function () {
                    createStyle(object.MODE_DESKTOP)
                    expect(object.isMobile()).toBeFalsy()

                    createStyle(object.MODE_TABLET)
                    expect(object.isMobile()).toBeFalsy()

                    createStyle(object.MODE_MOBILE)
                    expect(object.isMobile()).toBeTruthy()

                    removeStyle()
                    expect(object.isMobile()).toBeFalsy()
                })
            })

            describe("isTouch()", function () {
                beforeEach(function () {
                    UnitUtil.mock.modrnizr()
                })

                afterEach(function () {
                    UnitUtil.mock.resetModrnizr()
                })

                it("default is false", function () {
                    expect(object.isTouch()).toBeFalsy()
                })

                it("check boolean", function () {
                    UnitUtil.mock.modrnizrTouch(true)
                    expect(object.isTouch()).toBeTruthy()
                    UnitUtil.mock.modrnizrTouch(false)
                    expect(object.isTouch()).toBeFalsy()
                })
            })
        })
    })
