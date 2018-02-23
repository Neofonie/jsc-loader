define(
    ["jquery", "util/unit", "components/forms/DateInput.jsc"],
    function ($, UnitUtil, DateInput) {
        describe("JSC DateInput", function () {
            var instance = null,
                dummyElement = null

            UnitUtil.healthCheck(
                DateInput,
                7,
                "\
                onRegister \
                loadAttributes \
                registerListener \
                getSelligentFormattedDate \
                outputFormattedDate \
                setDateYearAttribute \
            ")

            beforeEach(function () {
                dummyElement = $('<input data-date-pattern="dmY" data-date-delimiter="."\>');
                instance = UnitUtil.createInstance(DateInput)
                instance.$el = dummyElement;
            })

            afterEach(function () {
                instance = null
                dummyElement = null
            })

            describe("loadAttributes()", function () {
                it("should load datePattern", function () {
                    instance.loadAttributes();
                    expect(instance.datePattern).toBe("dmY");

                    instance.$el.attr("data-date-pattern", "xxx");
                    instance.loadAttributes();
                    expect(instance.datePattern).toBe("xxx");
                });

                it("should load dateDelimiter", function () {
                    instance.loadAttributes();
                    expect(instance.dateDelimiter).toBe(".");

                    instance.$el.attr("data-date-delimiter", "/");
                    instance.loadAttributes();
                    expect(instance.dateDelimiter).toBe("/");
                });
            });

            describe("registerEventListener()", function () {
                it("should instantiate cleave.js", function () {
                    instance.loadAttributes();
                    expect(instance.cleave).toBeUndefined();
                    instance.registerListener();
                    expect(instance.cleave).toBeDefined();
                });

                it("should set cleave options", function () {
                    instance.loadAttributes();
                    instance.registerListener();
                    expect(instance.cleave.properties.datePattern).toEqual(['d','m','Y']);
                    expect(instance.cleave.properties.delimiter).toBe(".");
                });

                it("should add blur listener to element", function () {
                    spyOn(instance, "outputFormattedDate");

                    instance.loadAttributes();
                    instance.registerListener();

                    instance.$el.blur();
                    expect(instance.outputFormattedDate).toHaveBeenCalled();
                });
            });

            describe("getSelligentFormattedDate()", function () {
                it("should return a selligent formatted date string", function () {
                    instance.loadAttributes();
                    instance.registerListener();
                    instance.cleave.onInput("18.02.1985");
                    expect(instance.getSelligentFormattedDate()).toBe("1985-02-18");
                });
            });

            describe("outputFormattedDate()", function () {
                it("should output formatted date to dom element", function () {
                    spyOn(instance, "getSelligentFormattedDate").and.returnValue("1985-02-18");

                    var $parent = $("<div></div>");
                    var $output = $('<input class="jsDateOutput" value="X"/>');
                    instance.$el.wrap($parent);
                    instance.$el.parent().append($output);

                    instance.outputFormattedDate();
                    expect($output.val()).toBe("1985-02-18");
                })
            });

            describe("setDateYearAttribute()", function () {
                it("should add attribute with year value to date input", function () {
                    spyOn(instance, "getSelligentFormattedDate").and.returnValue("1985-02-18");

                    instance.setDateYearAttribute();
                    expect(instance.$el.attr("data-date-year")).toBe("1985");
                })
            });
        })
    })
