define(
    ["jquery", "util/history-api", "util/unit"],
    function ($, HistoryApi, UnitUtil) {
        describe("Util HistoryApi", function () {
            var object

            beforeEach(function () {
                object = HistoryApi
            })

            afterEach(function () {
                object = null
            })

            describe("has methods", function () {
                HistoryApi.__dontUseProto__ = true
                UnitUtil.expect.methods(
                    HistoryApi,
                    "\
                    getWindowLocationHref getWindowLocationSearch goTo getCurrentState getPath \
                    hasEnvironmentWCMDisabled hasHrefWCMDisabled addWCMDisabledToHref handleParamInHref \
                    getWindowLocationOrigin getWindowLocationHash getWindowLocationPathName \
                    setWindowLocationHref setWindowLocationHash setWindowHistoryPushState setWindowHistoryReplaceState \
                    openNewWindow goToSilent addAnchor addAnchorSilent addParam removeParam removeParamsFromHref hasParam \
                    addWCMDisabledToAllLinks getParam keepParam addOnlyOneParam hasEnvironmentParam \
                    ",
                    UnitUtil.getIgnoreObjectMethods() + " " + UnitUtil.getIgnoreCommonMethods()
                )
            })

            describe("goTo()", function () {
                var store = {}

                beforeEach(function () {
                    spyOn(object, "setWindowHistoryPushState").and.callFake(function (key) {
                        return store[key]
                    })
                })

                it("default should be false", function () {
                    expect(object.goTo()).toBeFalsy()
                })

                it("with params", function () {
                    object.goTo("href", false, "", "hallo")
                    expect(object.setWindowHistoryPushState).toHaveBeenCalledWith("", "hallo", "/href")

                    object.goTo("/href2", false, "", "hallo2")
                    expect(object.setWindowHistoryPushState).toHaveBeenCalledWith("", "hallo2", "/href2")
                })
            })

            describe("goToSilent()", function () {
                it("should call goTo internally", function () {
                    spyOn(object, "goTo")

                    object.goToSilent("replace/", false, "", "replace")
                    expect(object.goTo).toHaveBeenCalledWith("replace/", false, "", "replace", true)
                })
            })

            describe("hasEnvironmentWCMDisabled", function () {
                var href
                it("default is false", function () {
                    expect(object.hasEnvironmentWCMDisabled()).toBeFalsy()
                })

                it("with url without is false", function () {
                    href = "http://localhost:4502/cf#/content/ch/de/fotobuch.html"

                    spyOn(object, "getWindowLocationHref").and.callFake(function () {
                        return href
                    })

                    expect(object.hasEnvironmentWCMDisabled()).toBeFalsy()
                })

                it("with url and wcm is true", function () {
                    href = "http://localhost:4502/cf#/content/ch/de/fotobuch.html?wcmmode=disabled"

                    spyOn(object, "getWindowLocationHref").and.callFake(function () {
                        return href
                    })

                    expect(object.hasEnvironmentWCMDisabled()).toBeTruthy()
                })
            })

            describe("hasHrefWCMDisabled", function () {
                it("default, return false", function () {
                    expect(object.hasHrefWCMDisabled()).toBeFalsy()
                    expect(object.hasHrefWCMDisabled("")).toBeFalsy()
                    expect(object.hasHrefWCMDisabled(false)).toBeFalsy()
                    expect(object.hasHrefWCMDisabled("hallimasch")).toBeFalsy()
                })

                it("default, return false", function () {
                    expect(object.hasHrefWCMDisabled("?wcmmode=disabled")).toBeTruthy()
                    expect(object.hasHrefWCMDisabled("http://localhost:4502/cf#/content/ch/de/fotobuch.html?wcmmode=disabled")).toBeTruthy()
                    expect(object.hasHrefWCMDisabled(".html?bla=pusp&wcmmode=disabled")).toBeTruthy()
                })
            })

            describe("addWCMDisabledToHref", function () {
                var href,
                    search

                it("default, return the same wrong not strings", function () {
                    expect(object.addWCMDisabledToHref()).toBe(undefined)
                    expect(object.addWCMDisabledToHref("")).toBe("")
                    expect(object.addWCMDisabledToHref(false)).toBe(false)
                })

                it("with href without wcm", function () {
                    search = "?wcmmode=disabled"
                    href = "http://localhost:4502/cf#/content/ch/de/fotobuch.html"
                    spyOn(object, "getWindowLocationSearch").and.callFake(function () {
                        return search
                    })
                    expect(object.addWCMDisabledToHref(href)).toBe("http://localhost:4502/cf?wcmmode=disabled#/content/ch/de/fotobuch.html")
                })

                it("with href with wcm", function () {
                    search = "?wcmmode=disabled"
                    href = "http://localhost:4502/cf#/content/ch/de/fotobuch.html" + search
                    expect(object.addWCMDisabledToHref(href)).toBe(href)
                })

                it("test with anchor", function () {
                    href = "#blablalb"
                    expect(object.addWCMDisabledToHref(href)).toBe(href)
                })
            })

            describe("handleParamInHref()", function () {
                it("add the param", function () {
                    expect(object.handleParamInHref("", "vid", "12312")).toBe("?vid=12312")
                    expect(object.handleParamInHref("asdas?buschi=12", "vid", "12312")).toBe("asdas?buschi=12&vid=12312")
                })

                it("replace the param", function () {
                    expect(object.handleParamInHref("dasdasd?vid=xxxx", "vid", "12312")).toBe("dasdasd?vid=12312")
                    expect(object.handleParamInHref("asdas?buschi=12&vid=xxxx&horst=123", "vid", "12312")).toBe("asdas?buschi=12&horst=123&vid=12312")
                })
            })

            describe("removeParamsFromHref()", function () {
                it("default", function () {
                    expect(object.removeParamsFromHref()).toBe(undefined)
                    expect(object.removeParamsFromHref("")).toBe("")
                })

                it("should be right", function () {
                    expect(object.removeParamsFromHref("hallimasch?vid=inasd")).toBe("hallimasch")
                    expect(object.removeParamsFromHref("hallimasch#oida")).toBe("hallimasch")
                    expect(object.removeParamsFromHref("hallimasch?dasd=dasd#oida")).toBe("hallimasch")
                    expect(object.removeParamsFromHref("hallimasch#oida?dasdda=dasd")).toBe("hallimasch")
                })
            })

            xit("TODO: write more tests")
        })
    })
