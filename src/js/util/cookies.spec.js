define(
    ["jquery", "util/cookies"], function ($, Cookies) {
    describe("Util Cookies", function () {

        var object

        beforeEach(function () {
            object = Cookies
        })

        describe("has methods", function () {
            var methods = "set get delete".split(" ")

            it("length match", function () {
                expect(methods.length).toEqual(Object.keys(object).length)
            })

            $.each(methods, function (index, method) {
                it(method, function () {
                    expect(object[method]).toBeDefined()
                })
            })
        })

        describe("set()", function () {
            it("default", function () {
                expect(object.set()).toBeFalsy()
                expect(object.set(undefined)).toBeFalsy()
                expect(object.set({})).toBeFalsy()
                expect(object.set([])).toBeFalsy()
                expect(object.set("", undefined)).toBeFalsy()
                expect(object.set("", {})).toBeFalsy()
                expect(object.set("", [])).toBeFalsy()
                expect(object.set("", "")).toBeFalsy()
            })

            it("valid params", function () {
                expect(object.set("name", "value")).toBeTruthy()
                expect(object.set("name2", "value2")).toBeTruthy()
            })
        })

        describe("get()", function () {
            it("default", function () {
                expect(object.get()).toBeFalsy()
                expect(object.get(undefined)).toBeFalsy()
                expect(object.get({})).toBeFalsy()
                expect(object.get([])).toBeFalsy()
            })

            it("valid params", function () {
                expect(object.get("name")).toBe("value")
                expect(object.get("name2")).toBe("value2")
            })
        })

        describe("delete()", function () {
            it("default", function () {
                expect(object.delete()).toBeFalsy()
                expect(object.delete(undefined)).toBeFalsy()
                expect(object.delete({})).toBeFalsy()
                expect(object.delete([])).toBeFalsy()
            })

            it("valid params", function () {
                expect(object.delete("name")).toBeTruthy()
                expect(object.delete("name2")).toBeTruthy()

                expect(object.get("name")).toBeFalsy()
                expect(object.get("name2")).toBeFalsy()
            })
        })
    })
})