/*jslint white:true*/
/**
 * Author: Willy Woitas
 *         Martin Anders
 * 20.08.2015
 *
 * This class is used to show labels for input fields over the fields if there is a value in it.
 *
 * If the "data-servlet-path" is set the form will not be submitted direclty.
 * Instead the form data is send with AJAX and the return is displayed as a success or error message in the same form.
 */
define(
    ["jquery", "underscore", "backbone", "util/history-api"],
    function ($, _, Backbone, HistoryApi) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "FormHandler",
                DEBUG: false,

                CLASS_SUCCESS_MESSAGE: "jsSuccessMessage",
                CLASS_ERROR_MESSAGE: "jsErrorMessage",
                SEL_MESSAGE: ".jsMessage",
                SEL_SUBMIT_BUTTON: 'button[type="submit"]',
                SEL_SPINNER: ".jsLoadingSpinner",
                SEL_RECAPTCHA: ".g-recaptcha",
                SEL_NEWSLETTER_WISH: ".jsNewsletterWish",
                SEL_NEWSLETTER_REQUIRED: ".jsNewsletterRequired",
                DATA_NEWSLETTER_PATH: "newsletter-path",
                DATA_NEWSLETTER_METHOD: "newsletter-method",
                SEL_RADIOLIST: ".jsRadioList",
                SEL_RADIOLIST_ITEM: ".jsRadioListItem",
                SEL_RADIOLIST_INPUT: ".input__radio",
                CLS_IS_SELECTED: "is-selected",
                DATA_IS_RADIOLIST: "is-radio-list",
                CLASS_WATCH_INPUT: "jsWatchInput",
                CLASS_DATE_FORMAT_PLACEHOLDER: "jsDateFormatPlaceholder",
                CLASS_RESET_SELECT: "jsResetSelect",
                CLASS_INPUT_FILLED: "input--filled",
                CLASS_INPUT_WRONG: "input--wrong",
                CLASS_IS_VISIBLE: "is-visible",
                CLS_BTN_DISABLED: "button--disabled",
                DATA_FILEUPLOAD_NECESSARY: "file-upload-necessary",
                METHOD: "POST"
            },

            events: {
                // ATTENTION: we use here the bubbled submit event from the form. If we attach the event directly to the
                // form, then the event handler is fired before the handler in ValidateForm.jsc.js
                "submit": "onFormSubmit",
                "click .jsResetButton": "onResetClick"
            },

            recaptchaSolved: false,

            /**
             * Component registered.
             */
            onRegister: function () {
                this.log("onRegister()");
                this.watchInputs();
                // add open callback for recaptcha
                window.recaptchaCallback = _.bind(this.recaptchaCallback, this);
            },

            onResetClick: function () {
                this.log("reset clicked");
            },

            resetForm: function () {
                this.log("resetForm");
                this.log(this);
                this.$("form").get(0).reset();
                // reset selects
                this.$(".select").each(_.bind(function (index, element) {
                    var id = $(element).data("jsc-intern-id");
                    this.app.getJSC(id).reset();
                }, this));
                // reset radiolist
                this.$el.find("." + this.CONST.CLS_IS_SELECTED).each(_.bind(function (index, element) {
                    if (!$(element).data("default-checked")) {
                        $(element).removeClass(this.CONST.CLS_IS_SELECTED);
                    }
                }, this));
                // reset uploader
                this.$(".formcontainer__uploader").each(_.bind(function (index, element) {
                    var id = $(element).data("jsc-intern-id");
                    this.app.getJSC(id).reset();
                }, this));
            },

            watchInputs: function () {
                var toggleInputDateFormatPlaceholder = _.bind(function ($elm) {
                    var $dfp = $elm.parent().find("." + this.CONST.CLASS_DATE_FORMAT_PLACEHOLDER);
                    if ($elm.val() === "") {
                        $dfp.fadeIn();
                    } else {
                        $dfp.hide();
                    }
                }, this);

                this.log("watchInputs");
                // watch inputs and its user input
                this.$el.find("." + this.CONST.CLASS_WATCH_INPUT).each(_.bind(function (index, element) {
                    var $elm = $(element);
                    $elm
                        .on("focus change", _.bind(function () {
                            $elm.parent().addClass(this.CONST.CLASS_INPUT_FILLED);
                            toggleInputDateFormatPlaceholder($elm);
                        }, this))
                        .on("keyup", _.bind(function () {
                            toggleInputDateFormatPlaceholder($elm);
                        }, this))
                        .on("blur", _.bind(function () {
                            if ($elm.val() === "") {
                                $elm.parent().removeClass(this.CONST.CLASS_INPUT_FILLED);
                            }
                            $elm.parent().find("." + this.CONST.CLASS_DATE_FORMAT_PLACEHOLDER).hide();
                        }, this));
                }, this));

                // radio buttons
                var $radioList = this.$el.find(this.CONST.SEL_RADIOLIST),
                    isRadioList = $radioList.data(this.CONST.DATA_IS_RADIOLIST);
                this.log("$radioList", $radioList, isRadioList);
                if ($radioList.length === 1) {
                    $radioList.find(this.CONST.SEL_RADIOLIST_ITEM).each(_.bind(function (index, element) {
                        var $radioLabel = $(element),
                            isSelected = $radioLabel.find(this.CONST.SEL_RADIOLIST_INPUT).is(":checked");
                        // on change set class
                        $radioLabel.on("change", _.bind(function () {
                            isSelected = $radioLabel.find(this.CONST.SEL_RADIOLIST_INPUT).is(":checked");
                            this.toggleLabelClass($radioList, $radioLabel, isSelected, isRadioList);
                        }, this));
                        // init set class
                        this.toggleLabelClass($radioList, $radioLabel, isSelected, isRadioList);
                    }, this));
                }

                this.checkInputs();
            },

            toggleLabelClass: function ($list, $label, isSelected, isRadioList) {
                this.log("toggleLabelClass", $list, $label, isSelected);

                if (!$list && !$label) {
                    return false;
                }

                if (isSelected) {
                    // unset all the other
                    if (isRadioList) {
                        $list.find(this.CONST.SEL_RADIOLIST_ITEM).removeClass(this.CONST.CLS_IS_SELECTED);
                    }
                    $label.addClass(this.CONST.CLS_IS_SELECTED);
                } else {
                    $label.removeClass(this.CONST.CLS_IS_SELECTED);
                }
            },

            checkInputs: function () {
                this.log("checkInputs()");
                // check inputs on init
                this.$("." + this.CONST.CLASS_WATCH_INPUT).each(_.bind(function (index, element) {
                    if ($(element).val() !== "") {
                        $(element).parent().addClass(this.CONST.CLASS_INPUT_FILLED);
                    } else {
                        $(element).parent().removeClass(this.CONST.CLASS_INPUT_FILLED);
                    }
                }, this));
            },
            /**
             * Form "submit" event handler. If there is a servletPath defined then don't submit the form.
             * Instead send the form data with AJAX.
             * @param e
             */
            onFormSubmit: function (event) {
                this.log("submit clicked");
                var pathServlet = this.$el.data("servletPath");

                if (this.$el.find(this.CONST.SEL_RECAPTCHA).length === 1 && !this.recaptchaSolved) {
                    return false;
                }

                this.disableSubmitButton();
                if (this.$el.find(this.CONST.SEL_SPINNER).length === 1) {
                    this.$el.find(this.CONST.SEL_SPINNER).addClass(this.CONST.CLASS_IS_VISIBLE);
                }

                if (pathServlet && pathServlet !== "") {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    // check newsletter syncronous
                    this.checkNewsletter();
                    // send form after newsletter
                    this.submitFormWithAJAX();
                } else {
                    this.log("There is no servletPath, send form regulary");

                    // get value from all select components and write value to hidden input field before
                    $(".select", this.$el).each(_.bind(function (index, element) {
                        var $input = $(element),
                            name = $input.attr("name"),
                            value = $input.val();

                        this.$("input[name='" + name + "']").val(value);

                    }, this));
                }
            },

            disableSubmitButton: function () {
                // show spinner, remove padding-right for nice rotation
                var $submitButton = this.$(this.CONST.SEL_SUBMIT_BUTTON);
                $submitButton.addClass(this.CONST.CLS_BTN_DISABLED);
            },

            enableSubmitButton: function () {
                // show spinner, remove padding-right for nice rotation
                var $submitButton = this.$(this.CONST.SEL_SUBMIT_BUTTON);
                $submitButton.removeClass(this.CONST.CLS_BTN_DISABLED);

                this.$el.find(this.CONST.SEL_SPINNER).removeClass(this.CONST.CLASS_IS_VISIBLE);
            },

            /**
             * Send the form data with AJAX to the url specified in "servletPath"
             * @returns {boolean}
             */
            submitFormWithAJAX: function () {
                this.log("submitFormWithAJAX()");
                var dataObj = {},
                    pathServlet = this.$el.data("servletPath"),
                    $inputs = this.$el.find("input,.select,textarea"),
                    $attachment = this.$el.find("input[type=hidden][name*='attachment']"),
                    isFileuploadNecessary = this.$el.data(this.CONST.DATA_FILEUPLOAD_NECESSARY),
                    isValid = true;

                this.log("isFileuploadNecessary", isFileuploadNecessary);
                // get data
                $inputs.each(_.bind(function (index, element) {
                    var $input = $(element),
                        name = $input.attr("name"),
                        type = $input.attr("type");
                    if (!name) {
                        this.log($input);
                    }
                    // stop iteration in this cases
                    if (name === ":cq_csrf_token"
                        || (type !== "file" && $input.val() === "")
                        || (!isFileuploadNecessary && type === "file" && $input.val() === "")
                        || (type === "checkbox" && !$input.is(":checked"))
                        || (type === "radio" && !$input.is(":checked"))) {
                        return;
                        // if fileupload is necessary invalidate the submit
                    }

                    if (isFileuploadNecessary && type === "file" && $input.val() === "") {
                        // check if there is at least one attachment
                        return $attachment.length > 0;
                    }
                    // add input and value to the ajax data
                    dataObj[name] = $input.val();
                }, this));

                // concated data from all inputs
                this.log(dataObj);

                if (!isValid || Object.keys(dataObj).length === 0) {
                    this.enableSubmitButton();
                    return false;
                }

                $.ajax(pathServlet, {
                    method: this.CONST.METHOD,
                    data: dataObj,
                    type: "json"
                }).success(_.bind(function (response) {
                    this.log("response success");
                    this.log(response);

                    this.enableSubmitButton();

                    if (response.hasOwnProperty("success") && response.success) {
                        this.showSuccessMessage(this.$el.data("custom-success-message") || response.message);
                        this.resetForm();

                        this.checkNewsletter();

                        if (this.$el.data("success-path")) {
                            var url = this.$el.data("success-path");
                            if (HistoryApi.hasEnvironmentWCMDisabled()) {
                                url = HistoryApi.addWCMDisabledToHref(url, false);
                            }
                            HistoryApi.setWindowLocationHref(url);
                        }
                    } else {
                        this.log("error sending");
                        this.showErrorMessage(this.$el.data("custom-error-message") || response.message);
                    }
                }, this)).error(_.bind(function (response) {
                    this.log("response error");

                    this.enableSubmitButton();

                    var defaultErrorMessage = this.$el.data("default-error-message");
                    this.showErrorMessage(defaultErrorMessage);

                    this.warn(JSON.stringify(response));

                }, this));
            },
            /**
             * Show the success message to the user
             * @param message
             */
            showSuccessMessage: function (message) {
                this.$("." + this.CONST.CLASS_ERROR_MESSAGE)
                    .removeClass(this.CONST.CLASS_IS_VISIBLE)
                    .find(this.CONST.SEL_MESSAGE)
                    .html("");
                this.$("." + this.CONST.CLASS_SUCCESS_MESSAGE)
                    .addClass(this.CONST.CLASS_IS_VISIBLE)
                    .find(this.CONST.SEL_MESSAGE)
                    .html(message);
            },

            showErrorMessage: function (errorMessage) {
                this.log("showError()");
                this.$("." + this.CONST.CLASS_SUCCESS_MESSAGE)
                    .removeClass(this.CONST.CLASS_IS_VISIBLE)
                    .find(this.CONST.SEL_MESSAGE)
                    .html("");

                this.$("." + this.CONST.CLASS_ERROR_MESSAGE)
                    .addClass(this.CONST.CLASS_IS_VISIBLE)
                    .find(this.CONST.SEL_MESSAGE)
                    .html(errorMessage);
            },

            checkNewsletter: function () {
                this.log("checkNewsletter");
                var $checkboxParent = this.$el.find(this.CONST.SEL_NEWSLETTER_WISH),
                    $checkbox = $checkboxParent.find("[type='checkbox']"),
                    dataUrl = $checkboxParent.data(this.CONST.DATA_NEWSLETTER_PATH),
                    data = {},
                    dataMapping = {
                        "firstname": "vorname",
                        "salutation": "anrede"
                    };
                this.log($checkbox, $checkbox.is(":checked"));
                if ($checkbox.length === 1 && $checkbox.is(":checked") && dataUrl) {
                    // parse data for newsletter
                    this.$el.find(this.CONST.SEL_NEWSLETTER_REQUIRED).each(function () {
                        var key = $(this).attr("name");
                        data[dataMapping[key] || key] = $(this).val();
                    });
                    this.log(dataUrl, data);
                    // send call against newsletter
                    $.ajax({
                        url: dataUrl,
                        data: data,
                        method: "POST",
                        async: false
                    });
                }
            },

            recaptchaCallback: function () {
                this.log("recaptchaCallback");
                this.recaptchaSolved = true;
                this.$("form").trigger("submit");
                this.onFormSubmit();
            }
        });
    });
