define(
    ["jquery", "underscore", "util/unit",
        "components/forms/FormHandler.jsc"],
    function ($, _, UnitUtil, FormHandler) {
        describe("FormHandler", function () {

            var instance = null

            UnitUtil.healthCheck(
                FormHandler,
                26,
                "\
                onRegister resetForm watchInputs \
                checkInputs onFormSubmit disableSubmitButton onResetClick \
                enableSubmitButton submitFormWithAJAX showSuccessMessage \
                showErrorMessage checkNewsletter recaptchaCallback toggleLabelClass \
            ")

            beforeEach(function () {
                instance = UnitUtil.createInstance(FormHandler)
            })

            afterEach(function(){
                instance = null
            })

            xit("TODO: write tests")
        })
    })
