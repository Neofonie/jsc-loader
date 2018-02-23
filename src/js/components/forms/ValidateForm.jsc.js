/*jslint white:true*/
/**
 *
 * Author: UNKNOWN
 *         Willy Woitas
 *         Martin Anders
 *
 * This class validates input fields. If there is an error then the input field is highlighted.
 *
 usage:

 <from class="jsc" data-jsc-name="formValidate" data-jsc-namespace="validate">
 <!-- text-field, password-field: all attributes are optional -->
 <div
 data-validate-is-mail
 data-validate-min-length="2"
 data-validate-max-length="7"
 data-validate-regex="[A-Z]"
 data-validate-remote="Add error-message here..."
 data-validate-confirm="<other input-filed name>"

 data-validate-is-mail-msg="Add error-message here..."
 data-validate-min-length-msg="Add error-message here..."
 data-validate-max-length-msg="Add error-message here..."
 data-validate-regex-msg="Add error-message here..."
 data-validate-confirm-msg="Add error-message here..."

 data-validate-success-class="success"
 data-validate-error-class="error"
 >
 <input type="text">
 <span class="input-error-msg" data-validate-msg-output></span>
 </div>

 <!-- checkbox -->
 <div data-validate-is-checked="true">
 <input type="checkbox">
 </div>


 <button type="submit">Submit</button>
 <button type="reset" data-validate-reset-btn>Reset</button>
 </form>
 */
define(
    ["jquery", "underscore", "util/scroll-to"],
    function ($, _, ScrollTo) {
        var ATTRIBUTE_PREFIX = "data-validate-",
            CONST = {
                COMPONENT_NAME: "ValidateForm",
                DEBUG: false,

                // validation type attributes
                REMOTE_ERROR_ATTRIBUTE: ATTRIBUTE_PREFIX + "remote",
                MIN_LENGTH_ATTRIBUTE: ATTRIBUTE_PREFIX + "min-length",
                MAX_LENGTH_ATTRIBUTE: ATTRIBUTE_PREFIX + "max-length",
                MAIL_ATTRIBUTE: ATTRIBUTE_PREFIX + "is-mail",
                REGEX_ATTRIBUTE: ATTRIBUTE_PREFIX + "regex",
                DATA_DATE_YEAR_ATTRIBUTE: ATTRIBUTE_PREFIX + "data-date-year",
                INPUT_CONFIRM: ATTRIBUTE_PREFIX + "confirm",
                IS_CHECKED_ATTRIBUTE: ATTRIBUTE_PREFIX + "is-checked",

                // validation option attributes
                OPTION_IS_OPTIONAL: ATTRIBUTE_PREFIX + "option-is-optional",

                // validation message attributes
                MIN_LENGTH_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "min-length-msg",
                MAX_LENGTH_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "max-length-msg",
                MAIL_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "is-mail-msg",
                REGEX_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "regex-msg",
                DATA_DATE_YEAR_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "data-date-year-msg",
                INPUT_CONFIRM_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "confirm-msg",

                // for dynamically created forms it is difficult to choose the correct error message.
                // in this case it's more easy to use this attribute
                GENERIC_ERROR_MSG_ATTRIBUTE: ATTRIBUTE_PREFIX + "generic-error-msg",

                // atrribute for message output field
                MSG_OUTPUT_ATTRIBUTE: ATTRIBUTE_PREFIX + "msg-output",

                // alternative display of error message, use the data attribute instead of html content
                MSG_OUTPUT_ALTERNATIVE: "data-content",
                MSG_OUTPUT_ORIGINAL: "data-original-content",

                // CSS-classes for error/success
                ERROR_CLASS_ATTRIBUTE: ATTRIBUTE_PREFIX + "error-class",
                SUCCESS_CLASS_ATTRIBUTE: ATTRIBUTE_PREFIX + "success-class",

                // specify which tags are an input
                HTML_TAGS: "input,textarea",

                // Buttons
                //BTN_SUBMIT: ATTRIBUTE_PREFIX + "submit-btn",
                BTN_RESET: ATTRIBUTE_PREFIX + "reset-btn",

                // Events
                EVENT_CHANGE: "blur.formValidate",
                EVENT_DURING_THE_INPUT: "keyup.formValidate",
                EVENT_CLICK: "click.formValidate",

                ACTION_TYPE_CHANGE: "change",
                ACTION_TYPE_DURING_THE_INPUT: "duringTheInput",
                ACTION_TYPE_SILENT: "silent",

                SEL_WATCHUPLOADER: ".jsWatchUploader",
                SEL_ATTACHMENT: ".jsAttachment",
                SEL_DRAGAREA: ".jsDragArea",
                CLASS_INPUT_WRONG: "input--wrong"
            },
            InputValidate = function () {
                return true;
            };

        InputValidate.prototype.onRegister = function () {
            this.log("onRegister()");
            var jValidateElements,
                isFrontendValidationDirty = false,
                $alternativeOutput;

            this._jValidateElementList = [];
            this._jInputFieldList = [];

            jValidateElements = this.$el.find("[" +
                CONST.MIN_LENGTH_ATTRIBUTE + "],[" +
                CONST.MAX_LENGTH_ATTRIBUTE + "],[" +
                CONST.MAIL_ATTRIBUTE + "],[" +
                CONST.IS_CHECKED_ATTRIBUTE + "],[" +
                CONST.REMOTE_ERROR_ATTRIBUTE + "],[" +
                CONST.REGEX_ATTRIBUTE + "],[" +
                CONST.INPUT_CONFIRM + "]");
            // iterate mandatory fields
            $.each(jValidateElements, _.bind(function (i, element) {
                var $validateElement = $(element),
                    $validateElementInput;
                // fin input field
                if ($validateElement.is("input") === true || $validateElement.is("textarea") === true) {
                    $validateElementInput = $validateElement;
                } else {
                    $validateElementInput = $validateElement.find(CONST.HTML_TAGS);
                }
                // message output
                $alternativeOutput = $validateElement.find("[" + CONST.MSG_OUTPUT_ALTERNATIVE + "]");
                $alternativeOutput.attr("data-original-content", $alternativeOutput.attr(CONST.MSG_OUTPUT_ALTERNATIVE));
                // set events
                $validateElementInput.attr("validationId", i);
                this.log($validateElementInput, $validateElementInput.attr("validationId"));
                $validateElementInput.on(CONST.EVENT_CHANGE, _.bind(function () {
                    this.log("onChange()", $validateElementInput.attr("validationId"), i);
                    this._validateNow($validateElementInput, CONST.ACTION_TYPE_CHANGE);
                }, this));
                // add it to the global list
                this._jValidateElementList.push($validateElement);
                this._jInputFieldList.push($validateElementInput);
                // do some css
                if (_.isString($validateElement.attr(CONST.REMOTE_ERROR_ATTRIBUTE))) {
                    $validateElement.addClass($validateElement.attr(CONST.ERROR_CLASS_ATTRIBUTE));
                    this._displayErrorLabel($validateElement, CONST.REMOTE_ERROR_ATTRIBUTE);
                }
                // is it already filled?
                isFrontendValidationDirty = this._validateNow($validateElementInput, CONST.ACTION_TYPE_SILENT)
                    || false;
            }, this));

            // use the form "sumbit" event instead of button click event.
            this.$el.on("submit", _.bind(this._onSubmit, this));
            this.$el.on("reset", _.bind(this._onReset, this));

            this._jResetButton = this.$el.find("[" + CONST.BTN_RESET + "]");
            this._jResetButton.on(CONST.EVENT_CLICK, _.bind(this._onReset, this));

            return isFrontendValidationDirty;
        };

        InputValidate.prototype.CONST = CONST;

        InputValidate.prototype._validateNow = function (jCurrentInputField, actionType) {
            this.log("_validateNow", actionType);
            var thisScope = this,
                validationId = jCurrentInputField.attr("validationId"),
                jValidateElement = this._jValidateElementList[validationId],
                errorClass = jValidateElement.attr(CONST.ERROR_CLASS_ATTRIBUTE),
                successClass = jValidateElement.attr(CONST.SUCCESS_CLASS_ATTRIBUTE),
                isDirty = false,
                isOptional = jValidateElement.get(0).hasAttribute(CONST.OPTION_IS_OPTIONAL),
                errorMsgAttr,
                $alternativeOutput;

            if (isOptional && jCurrentInputField.val() === "") {
                isDirty = false;
            } else {
                // validate mail
                if (jValidateElement.is("[" + CONST.MAIL_ATTRIBUTE + "]") === true) {
                    if (isDirty === false) {
                        errorMsgAttr = CONST.MAIL_MSG_ATTRIBUTE;
                    }
                    isDirty = (!this._validateMail(jCurrentInputField.val())) || isDirty;
                }

                // validate max length
                if (jValidateElement.is("[" + CONST.MAX_LENGTH_ATTRIBUTE + "]") === true) {
                    if (isDirty === false) {
                        errorMsgAttr = CONST.MAX_LENGTH_MSG_ATTRIBUTE;
                    }
                    isDirty = (!this._validateMaxLength(jCurrentInputField.val(),
                        jValidateElement.attr(CONST.MAX_LENGTH_ATTRIBUTE))) || isDirty;
                }

                // validate min length
                if (jValidateElement.is("[" + CONST.MIN_LENGTH_ATTRIBUTE + "]") === true) {
                    if (isDirty === false) {
                        errorMsgAttr = CONST.MIN_LENGTH_MSG_ATTRIBUTE;
                    }
                    isDirty = (!this._validateMinLength(jCurrentInputField.val(),
                        jValidateElement.attr(CONST.MIN_LENGTH_ATTRIBUTE))) || isDirty;
                }

                // validate regex
                if (jValidateElement.is("[" + CONST.REGEX_ATTRIBUTE + "]") === true) {
                    if (isDirty === false) {
                        errorMsgAttr = CONST.REGEX_MSG_ATTRIBUTE;
                    }
                    isDirty = (!this._validateRegex(jCurrentInputField.val(),
                        jValidateElement.attr(CONST.REGEX_ATTRIBUTE))) || isDirty;
                }

                // validate data-date-year
                if (jValidateElement.is("[" + CONST.DATA_DATE_YEAR_ATTRIBUTE + "]") === true) {
                    if (isDirty === false) {
                        errorMsgAttr = CONST.DATA_DATE_YEAR_MSG_ATTRIBUTE;
                    }
                    isDirty = (!this._validateDateYear(jCurrentInputField.attr("data-date-year"),
                        jValidateElement.attr(CONST.DATA_DATE_YEAR_ATTRIBUTE))) || isDirty;
                }

                // validate confirm
                if (jValidateElement.is("[" + CONST.INPUT_CONFIRM + "]") === true) {
                    if (isDirty === false) {
                        errorMsgAttr = CONST.INPUT_CONFIRM_MSG_ATTRIBUTE;
                    }
                    isDirty = (!this._validateConfirm(jCurrentInputField.val(),
                        jValidateElement.attr(CONST.INPUT_CONFIRM))) || isDirty;
                }

                // validate is checkbox checked
                if (jCurrentInputField.is("input:checkbox")
                    && jValidateElement.is("[" + CONST.IS_CHECKED_ATTRIBUTE + "]") === true) {
                    isDirty = (!this._validateIsChecked(jCurrentInputField.is(":checked"),
                        jValidateElement.attr(CONST.IS_CHECKED_ATTRIBUTE))) || isDirty;
                }
            }

            if (actionType === CONST.ACTION_TYPE_SILENT) {
                return isDirty;
            }

            if (jValidateElement.is("[" + CONST.GENERIC_ERROR_MSG_ATTRIBUTE + "]") === true) {
                errorMsgAttr = CONST.GENERIC_ERROR_MSG_ATTRIBUTE;
            }

            this._displayErrorLabel(jValidateElement, errorMsgAttr);

            if (isDirty) {
                this.log("isDirty", jValidateElement);
                jValidateElement.addClass(errorClass);
                jValidateElement.removeClass(successClass);
                if (jCurrentInputField.is("input:checkbox") === false) {
                    jCurrentInputField.off(CONST.EVENT_DURING_THE_INPUT).on(CONST.EVENT_DURING_THE_INPUT, function (e) {
                        thisScope._validateNow($(e.currentTarget), CONST.ACTION_TYPE_DURING_THE_INPUT);
                    });
                }
            } else {
                jValidateElement.removeClass(errorClass);
                jValidateElement.find("[" + CONST.MSG_OUTPUT_ATTRIBUTE + "]").empty();

                $alternativeOutput = jValidateElement.find("[" + CONST.MSG_OUTPUT_ALTERNATIVE + "]");
                $alternativeOutput.attr(CONST.MSG_OUTPUT_ALTERNATIVE,
                    $alternativeOutput.attr(CONST.MSG_OUTPUT_ORIGINAL));

                if (actionType === CONST.ACTION_TYPE_DURING_THE_INPUT) {
                    jValidateElement.addClass(successClass);
                } else {
                    jValidateElement.removeClass(successClass);
                    jCurrentInputField.off(CONST.EVENT_DURING_THE_INPUT);
                }
            }

            return isDirty;
        };

        InputValidate.prototype._onSubmit = function (event) {
            this.log("_onSubmit");
            var i,
                len,
                isDirty = false,
                firstDirtyElement,
                $uploader;

            for (i = 0, len = this._jInputFieldList.length; i < len; i++) {
                this._validateNow(this._jInputFieldList[i], CONST.ACTION_TYPE_CHANGE);
                isDirty = this._validateNow(this._jInputFieldList[i], CONST.ACTION_TYPE_CHANGE) || isDirty;

                if (isDirty === true && !firstDirtyElement) {
                    firstDirtyElement = this._jInputFieldList[i];
                }
            }

            // check fileupload
            $uploader = this.$el.find(this.CONST.SEL_WATCHUPLOADER);
            if ($uploader.length === 1) {
                if ($uploader.find(this.CONST.SEL_ATTACHMENT).length === 0) {
                    $uploader.find(this.CONST.SEL_DRAGAREA).addClass(this.CONST.CLASS_INPUT_WRONG);
                } else {
                    $uploader.find(this.CONST.SEL_DRAGAREA).removeClass(this.CONST.CLASS_INPUT_WRONG);
                }
            }

            if (isDirty === true) {
                event.stopPropagation();
                event.preventDefault();
                this.log("isDirty", firstDirtyElement);
                ScrollTo.element(firstDirtyElement, 500);
                firstDirtyElement.focus();
            }
        };

        InputValidate.prototype._onReset = function () {
            this.log("_onReset");
            var i,
                len,
                jValidateElement,
                $alternativeOutput;

            for (i = 0, len = this._jValidateElementList.length; i < len; i++) {
                jValidateElement = this._jValidateElementList[i];
                jValidateElement.removeClass(jValidateElement.attr(CONST.ERROR_CLASS_ATTRIBUTE));
                jValidateElement.removeClass(jValidateElement.attr(CONST.SUCCESS_CLASS_ATTRIBUTE));
                jValidateElement.find(CONST.HTML_TAGS).off(CONST.EVENT_DURING_THE_INPUT).val("");
                jValidateElement.find("[" + CONST.MSG_OUTPUT_ATTRIBUTE + "]").empty();
                $alternativeOutput = jValidateElement.find("[" + CONST.MSG_OUTPUT_ALTERNATIVE + "]");
                $alternativeOutput.attr(CONST.MSG_OUTPUT_ALTERNATIVE,
                    $alternativeOutput.attr(CONST.MSG_OUTPUT_ORIGINAL));
            }
        };

        InputValidate.prototype._displayErrorLabel = function (jValidateElement, msgArrtibute) {
            this.log("_displayErrorLabel");
            if (_.isUndefined(msgArrtibute) === true) {
                return;
            }

            var msg = jValidateElement.attr(msgArrtibute);
            if (_.isString(msg) === false) {
                msg = "";
            }

            jValidateElement.find("[" + CONST.MSG_OUTPUT_ATTRIBUTE + "]").html(msg);
            if (msg.length > 0) {
                jValidateElement.find("[" + CONST.MSG_OUTPUT_ALTERNATIVE + "]").attr(CONST.MSG_OUTPUT_ALTERNATIVE, msg);
            }
        };

        InputValidate.prototype._validateMail = function (val) {
            var re = /[0-9a-zA-Z.+_-]+@[0-9a-zA-Z.+_-]+\.[a-zA-Z]{2,}/;
            return re.test(val);
        };

        InputValidate.prototype._validateMaxLength = function (val, maxLen) {
            return (val.trim().length <= maxLen);
        };

        InputValidate.prototype._validateMinLength = function (val, minLen) {
            return (val.trim().length >= minLen);
        };

        InputValidate.prototype._validateRegex = function (val, regEx) {
            var re = new RegExp(regEx);
            return re.test(val);
        };

        InputValidate.prototype._validateDateYear = function (val, yearSpan) {
            var currentYear = (new Date()).getFullYear() - 1; //current - 1
            var inputYear = parseInt(val, 10);
            var inputYearSpan = parseInt(yearSpan, 10) || 0;
            var isEqualLessTopBorder = inputYear <= currentYear;
            var isEqualGreaterBottomBorder = inputYear >= currentYear - inputYearSpan;

            return  inputYearSpan === 0 ? isEqualLessTopBorder :
                isEqualLessTopBorder && isEqualGreaterBottomBorder;
        };

        InputValidate.prototype._validateConfirm = function (val, confirmFieldName) {
            this.log("_validateConfirm");
            var jOriginField;

            if (_.isString(confirmFieldName) === false) {
                return true;
            }

            jOriginField = this.$el.find("[name=" + confirmFieldName + "]");
            if (jOriginField.length === 0) {
                return true;
            }

            return ($(jOriginField[0]).val() === val);
        };

        InputValidate.prototype._validateIsChecked = function (val, wantedVal) {
            this.log("_validateIsChecked", val, wantedVal);
            if (_.isString(wantedVal) === true) {
                wantedVal = (wantedVal === "true") ? true : false;
            }

            if (val === wantedVal) {
                return true;
            }
            return false;
        };

        return InputValidate;
    });
