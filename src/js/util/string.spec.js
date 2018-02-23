define(
    ["jquery", "util/string"], function ($, StringUtil) {
    describe("Util StringFormatter", function () {
        var object

        beforeEach(function () {
            object = StringUtil
        })

        describe("has methods", function () {
            var methods = "lowerCaseFirstLetter".split(" ")

            $.each(methods, function (index, method) {
                it(method, function () {
                    expect(object[method]).toBeDefined()
                })
            })
        })

        describe("lowerCaseFirstLetter()", function () {
            it("should lower case the first letter when it is a capital", function () {
                expect(object.lowerCaseFirstLetter("Foo Bar")).toBe("foo Bar")
            })

            it("should keep first letter low when it is not a capital", function () {
                expect(object.lowerCaseFirstLetter("foo Bar")).toBe("foo Bar")
            })
        })

        describe("ucFirst()", function () {
            it("should uppercase the first", function () {
                expect(object.ucFirst("berlin")).toBe("Berlin")
                expect(object.ucFirst("foo Bar")).toBe("Foo Bar")
            })

            it("should return empty", function () {
                expect(object.ucFirst()).toBe("")
                expect(object.ucFirst(null)).toBe("")
                expect(object.ucFirst(undefined)).toBe("")
                expect(object.ucFirst({})).toBe("")
            })
        })


        describe("startsWith()", function () {
            it("return true when asterisk found", function () {
                expect(object.startsWith("*ab 20%", "*")).toBeTruthy()
                expect(object.startsWith("bis 20%", "*")).toBeFalsy()
                expect(object.startsWith("bis 20%*", "*")).toBeFalsy()
            })
        })

        describe("endsWith()", function () {
            it("return true when asterisk found", function () {
                expect(object.endsWith("ab 20%*", "*")).toBeTruthy()
                expect(object.endsWith("ab 20%", "*")).toBeFalsy()
                expect(object.endsWith("*ab 20%", "*")).toBeFalsy()
            })
        })

        describe("removeWhitespaceChain()", function () {
            it("remove unnecessary whitespaces", function () {
                expect(object.removeWhitespaceChain("    ab        20%*     Rabatt     ")).toBe("ab 20%* Rabatt")
                expect(function(){object.removeWhitespaceChain(100)}).toThrow(new TypeError("Attribute is not a String."))
            })
        })
    })
})
