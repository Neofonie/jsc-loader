define(
    ["jquery", "underscore"],
    function ($, _) {
        describe("ComponentName", function () {

            var instance = null

            beforeEach(function () {
                //instance = new Conmponent();
            })

            afterEach(function () {
                instance = null
            })

            // check for Constants
            describe("do something", function () {

                it("and expect this", function () {
                    expect(1).toEqual(1)
                    expect(true).toBeTruthy();
                    expect(false).toBeFalsy();
                })
            })

            /*
             // check for Constants
             describe("has CONST", function () {
             it("and and debug = false", function () {
             expect(instance.CONST).toBeDefined()
             expect(instance.CONST.DEBUG).toBeFalsy()
             expect(Object.keys(instance.CONST).length).toEqual(2)
             });
             });

             // check for methods
             describe("has methods", function () {
             var methods = [
             "onRegister",
             "listNotificationInterests",
             "handleNotification"
             ]

             $.each(methods, function (index, method) {
             it(method, function () {
             expect(instance[method]).toBeDefined()
             })
             })
             });
             */
        })
    })