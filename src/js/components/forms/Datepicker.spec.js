define(
    ["jquery", "util/unit", "components/forms/Datepicker.jsc"],
    function ($, UnitUtil, Datepicker) {
        describe("JSC Datepicker", function () {
            var instance = null

            UnitUtil.healthCheck(
                Datepicker,
                6,
                "\
                onRegister \
                loadResource initDatepicker \
                parseMinMaxDate parseDate pad \
            ")

            beforeEach(function () {
                instance = UnitUtil.createInstance(Datepicker)
            })

            afterEach(function () {
                instance = null
            })

            xit("TODO: write tests")

            describe("parseMinMaxDate()", function () {
                it("get correct bounds", function () {
                    window.dataForDatepicker =  {
                        "2019": {},
                        "2017": {
                            "06": {
                                "26": "",
                                "06": ""
                            },
                            "05": {
                                "31": "",
                                "30": "",
                                "25": ""
                            },
                            "03": {"24": ""}
                        }
                    }
                    instance.onRegister()
                    var bounds = instance.parseMinMaxDate()

                    expect(bounds.minDate.year).toBe("2017")
                    expect(bounds.minDate.month).toBe("03")
                    expect(bounds.minDate.day).toBe("24")

                    expect(bounds.maxDate.year).toBe("2019")
                    expect(bounds.maxDate.month).toBe("00")
                    expect(bounds.maxDate.day).toBe("00")
                })

                it("get correct bounds", function () {
                    window.dataForDatepicker =  {
                        "2017": {
                            "06": {
                                "26": "",
                                "06": ""
                            },
                            "05": {
                                "31": "",
                                "30": "",
                                "25": ""
                            },
                            "03": {"24": ""}
                        }
                    }
                    instance.onRegister()
                    var bounds = instance.parseMinMaxDate()

                    expect(bounds.minDate.year).toBe("2017")
                    expect(bounds.minDate.month).toBe("03")
                    expect(bounds.minDate.day).toBe("24")

                    expect(bounds.maxDate.year).toBe("2017")
                    expect(bounds.maxDate.month).toBe("06")
                    expect(bounds.maxDate.day).toBe("26")
                })
            })

            it("parseDate()", function () {
                var date,
                    newDate = new Date()
                date = instance.parseDate("2017-06-30")
                expect(date.getFullYear()).toBe(2017)
                expect(date.getDate()).toBe(30)
                expect(date.getMonth()).toBe(5)

                date = instance.parseDate("30.06.2017", "dd.mm.yyyy")
                expect(date.getFullYear()).toBe(2017)
                expect(date.getDate()).toBe(30)
                expect(date.getMonth()).toBe(5)

                date = instance.parseDate("30062017", "dd.mm.yyyy")
                expect(date.getFullYear()).toBeNaN()
                expect(date.getDate()).toBeNaN()
                expect(date.getMonth()).toBeNaN()

                date = instance.parseDate("", "dd.mm.yyyy")
                expect(date.getFullYear()).toBe(newDate.getFullYear())
                expect(date.getDate()).toBe(newDate.getDate())
                expect(date.getMonth()).toBe(newDate.getMonth())
            })

            it("pad()", function () {
                expect(instance.pad(1)).toBe("01")
                expect(instance.pad(23)).toBe("23")
                expect(instance.pad(133)).toBe("133")
                expect(instance.pad(1,1)).toBe("1")
                expect(instance.pad(1,4)).toBe("0001")
                expect(instance.pad(1,4,"x")).toBe("xxx1")
            })
        })
    })
