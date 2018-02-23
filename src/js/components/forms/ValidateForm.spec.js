define(
    ["jquery", "underscore", "util/unit",
        "components/forms/ValidateForm.jsc"],
    function ($, _, UnitUtil, ValidateForm) {
        describe("ValidateForm", function () {
            var instance = null

            UnitUtil.healthCheck(
                ValidateForm,
                35,
                "\
                onRegister _validateNow _onSubmit \
                _onReset _displayErrorLabel _validateMail \
                _validateMaxLength _validateMinLength _validateRegex \
                _validateConfirm _validateIsChecked _validateDateYear \
            ")

            beforeEach(function () {
                var $el = $($("<div></div>"))
                instance = UnitUtil.createInstance(ValidateForm, {
                    el: $el
                })
                instance.el = $el
                instance.$el = $el
                instance.onRegister()
            })

            afterEach(function () {
                instance = null
            })

            xit("TODO: write tests")
        })
    })
