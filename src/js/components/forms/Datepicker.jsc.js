/*jslint white:true*/
// http://t1m0n.name/air-datepicker/docs/

define(
    ["jquery", "underscore", "backbone", "util/history-api", "datepicker"],
    function ($, _, Backbone, HistoryApi) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "Datepicker",
                DEBUG: false,

                SEL_INPUT: ".jsDatePicker",
                DATA_LOCALE: "locale",
                DATA_POSITION: "position",
                DATA_STARTDATE: "startdate"
            },

            locale: "",
            startDate: null,
            loadResourceDelay: 100,

            onRegister: function () {
                this.log("onRegister");
                this.locale = this.$el.data(this.CONST.DATA_LOCALE) || "en";
                this.position = this.$el.data(this.CONST.DATA_POSITION) || "bottom left";
                // element attr: data-startdate = "14.08.2017"
                // jcr: dateForDatepicker = "14.08.2017"
                this.startDate = this.$el.data(this.CONST.DATA_STARTDATE);
                this.data = window.dataForDatepicker;

                this.log("locale", this.locale, "position", this.position,
                    "startDate", this.startDate, "data", this.data);

                if (!this.startDate) {
                    return;
                }

                this.loadResource();
            },

            loadResource: function () {
                this.log("loadResource");
                if($.fn.datepicker) {
                    if (this.locale !== "en") {
                        require(["datepicker." + this.locale], () => {
                            this.initDatepicker();
                        });
                    } else {
                        this.initDatepicker();
                    }
                } else {
                    _.delay(() => this.loadResource(), this.loadResourceDelay);
                    this.loadResourceDelay = this.loadResourceDelay * 2;
                }

            },

            initDatepicker: function () {
                this.log("initDatepicker");
                var $datepicker = this.$el.find(this.CONST.SEL_INPUT),
                    datepicker,
                    onLoadSelectReady = false,
                    startDate,
                    bounds = this.parseMinMaxDate();

                this.log(bounds);

                $datepicker.datepicker({
                    language: this.locale,
                    position: this.position,
                    minDate: new Date(
                        parseInt(bounds.minDate.year, 10),
                        parseInt(bounds.minDate.month, 10) - 1,
                        parseInt(bounds.minDate.day, 10)
                    ),
                    maxDate: new Date(
                        parseInt(bounds.maxDate.year, 10),
                        parseInt(bounds.maxDate.month, 10) - 1,
                        parseInt(bounds.maxDate.day, 10)
                    ),
                    onShow: (inst, animationCompleted) => {
                        this.log("onShow", inst, animationCompleted);
                        !animationCompleted && _.delay(() => {
                            inst.$el.on("click", () => {
                                inst.$el.blur();
                            });
                        }, 150);
                    },
                    onHide: (inst) => {
                        this.log("onHide");
                        inst.$el.off("click");
                    },
                    onRenderCell: (date, cellType) => {
                        var day = this.pad(date.getDate()),
                            monthInt = date.getMonth(),
                            month = this.pad(monthInt + 1),
                            monthsHR = $.fn.datepicker.language[this.locale].monthsShort,
                            year = date.getFullYear(),
                            returnObj = {};

                        if (cellType === "day"
                            && this.data
                            && this.data[year]
                            && this.data[year][month]
                            && this.data[year][month][day]) {
                            returnObj = {
                                html: day + "<span class=\"has-entries\"></span>"
                            };
                        } else if (cellType === "month"
                            && this.data
                            && this.data[year]
                            && this.data[year][month]
                        ) {
                            returnObj = {
                                html: monthsHR[monthInt] + "<span class=\"has-entries\"></span>"
                            };
                        } else if (cellType === "year"
                            && this.data
                            && this.data[year]
                        ) {
                            returnObj = {
                                html: year + "<span class=\"has-entries\"></span>"
                            };
                        } else {
                            returnObj = {
                                disabled: true
                            };
                        }

                        return returnObj;
                    },
                    onSelect: (cellDate, date) => {
                        var day = this.pad(date.getDate()),
                            month = this.pad(date.getMonth() + 1),
                            year = date.getFullYear(),
                            path;

                        if (onLoadSelectReady
                            && this.data
                            && this.data[year]
                            && this.data[year][month]
                            && this.data[year][month][day]) {
                            path = this.data[year][month][day];
                            HistoryApi.setWindowLocationHref((HistoryApi.hasEnvironmentWCMDisabled()
                                ? HistoryApi.addWCMDisabledToHref(path) : path));
                        }
                    }
                });
                // get instance
                datepicker = $datepicker.data("datepicker");
                startDate = this.parseDate(this.startDate, "dd.mm.yyyy");
                this.log(this.startDate, startDate, datepicker);
                if (startDate) {
                    datepicker.selectDate(startDate);
                    onLoadSelectReady = true;
                }
            },

            parseMinMaxDate: function () {
                this.log("parseMinMaxDate");
                var minDate = {year: "0000", month: "00", day: "00"},
                    maxDate = {year: "0000", month: "00", day: "00"},
                    yearKeys = Object.keys(this.data).sort(),
                    monthKeys, dayKeys;

                // get first year
                minDate.year = yearKeys[0] || "0000";
                // get first month
                monthKeys = Object.keys(this.data[minDate.year] || {}).sort();
                minDate.month = monthKeys[0] || "00";
                // get first day
                dayKeys = Object.keys(this.data[minDate.year][minDate.month] || {}).sort();
                minDate.day = dayKeys[0] || "00";

                // get last year
                maxDate.year = yearKeys[yearKeys.length - 1] || "0000";
                // get last month
                monthKeys = Object.keys(this.data[maxDate.year] || {}).sort();
                maxDate.month = monthKeys[monthKeys.length - 1] || "00";
                // get last day
                dayKeys = Object.keys(this.data[maxDate.year][maxDate.month] || {}).sort();
                maxDate.day = dayKeys[dayKeys.length - 1] || "00";

                this.log(this.data, minDate, maxDate);

                return {
                    minDate: minDate,
                    maxDate: maxDate
                };
            },

            parseDate: function (input, format) {
                format = format || "yyyy-mm-dd"; // default format
                var parts = input.match(/(\d+)/g),
                    i = 0,
                    fmt = {};
                // extract date-part indexes from the format
                format.replace(/(yyyy|dd|mm)/g, function (part) {
                    fmt[part] = i++;
                });

                return parts ? new Date(parts[fmt.yyyy], parts[fmt.mm] - 1, parts[fmt.dd]) : new Date();
            },

            pad: function (n, width, z) {
                z = z || 0;
                width = width || 2;
                n = String(n);
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }
        });
    });