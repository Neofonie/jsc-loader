define(
    ["jquery", "util/logger"], function ($, Logger) {
    describe("Util Logger", function () {

        var object,
            strAllMethods = "log info warn error",
            allMethods = strAllMethods.split(" "),
            allInjectMethods = allMethods.map(function (method) {
                return method + " " + method + "_"
            }).join(" ").split(" "),
            allObjectMethods = allMethods.map(function (method) {
                return method + " " + method + "WithRef"
            }).join(" ").split(" ")

        beforeEach(function () {
            object = Logger
        })

        describe("has methods", function () {
            $.each($.extend(["init"], allObjectMethods), function (index, method) {
                it(method, function () {
                    expect(object[method]).toBeDefined()
                })
            })
        })

        describe("init()", function () {
            it("default should be false and warn", function () {
                spyOn(console, "warn")
                expect(object.init()).toBeFalsy()
                expect(console.warn).toHaveBeenCalledWith("instance is undefined")
            })

            it("init with params return true", function () {
                expect(object.init({}, false, "jsc")).toBeTruthy()
            })

            describe("debugFlag", function () {
                it("false is false", function(){
                    var instanceInner = {}
                    object.init(instanceInner, false, "jsc")
                    expect(instanceInner.debugFlag_).toBeFalsy()
                })

                it("true is true", function(){
                    var instanceInner = {}
                    object.init(instanceInner, true, "jsc")
                    expect(instanceInner.debugFlag_).toBeTruthy()
                })

                it("false is true", function(){
                    var instanceInner = {$el:$("<div data-log-enabled='true'></div>")}
                    object.init(instanceInner, false, "jsc")
                    expect(instanceInner.debugFlag_).toBeTruthy()
                })

                it("false is false", function(){
                    var instanceInner = {$el:$("<div data-log-enabled='false'></div>")}
                    object.init(instanceInner, false, "jsc")
                    expect(instanceInner.debugFlag_).toBeFalsy()
                })
            })
        })

        describe("check injected methods", function () {
            function createMethodCalls(component, isDebug, componentName) {
                describe("in " + componentName + " with DEBUG '" + (isDebug ? "true" : "false") + "'", function () {
                    $.each(allInjectMethods, function (index, method) {
                        it(" -> " + method, function () {
                            object.init(component, isDebug, componentName)
                            expect(component[method]).toBeDefined()

                            var oriMethodName = method.replace("_", "")
                            spyOn(console, oriMethodName)

                            // call component injected method
                            component[method]("1337")
                            // check if console.METHOD got response
                            if (isDebug === false && oriMethodName === "log") {
                                expect(console[oriMethodName]).not.toHaveBeenCalled()
                            } else {
                                if (oriMethodName === method || !component.canStackTrace) {
                                    expect(console[oriMethodName]).toHaveBeenCalledWith(componentName + ":", "1337")
                                } else {
                                    expect(console[oriMethodName]).toHaveBeenCalledWith(componentName + ":", "1337", jasmine.any(String))
                                }
                            }
                        })
                    })
                })
            }

            createMethodCalls({}, false, "jsc2")
        })

        it("check stackTrace", function () {
            if (object.canStackTrace) {
                //console.log("this browser can stack trace")
                expect(object.canStackTrace).toBeTruthy()
            } else {
                //console.log("this browser can't stack trace")
                expect(object.canStackTrace).toBeFalsy()
            }
        })

        $.each(allObjectMethods, function (index, method) {
            describe(method + "()", function () {
                it("with no params", function () {
                    expect(object[method]()).toBeFalsy()
                })

                it("with param", function () {
                    var oriMethodName = method.replace("WithRef", "")
                    spyOn(console, oriMethodName)

                    object[method]("huhu")
                    if (oriMethodName === method || !object.canStackTrace) {
                        expect(console[oriMethodName]).toHaveBeenCalledWith("huhu")
                    } else {
                        expect(console[oriMethodName]).toHaveBeenCalledWith("huhu", jasmine.any(String))
                    }

                    object[method]("huhu2", "huhu3")
                    if (oriMethodName === method || !object.canStackTrace) {
                        expect(console[oriMethodName]).toHaveBeenCalledWith("huhu2", "huhu3")
                    } else {
                        expect(console[oriMethodName]).toHaveBeenCalledWith("huhu", jasmine.any(String))
                    }

                    object[method](undefined)
                    if (oriMethodName === method || !object.canStackTrace) {
                        expect(console[oriMethodName]).toHaveBeenCalledWith(undefined)
                    } else {
                        expect(console[oriMethodName]).toHaveBeenCalledWith(undefined, jasmine.any(String))
                    }
                })
            })
        })

        it("test force $log()", function(){
            // debug flag is false
            var instance = {},
                log = "oida is doch false"
            object.init(instance, false, "jsc")

            spyOn(console, "log")
            instance.$log(log)
            expect(console.log).toHaveBeenCalledWith("jsc:", log)
        })
    })
})