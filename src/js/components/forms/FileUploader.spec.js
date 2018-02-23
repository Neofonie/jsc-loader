define(
    ["jquery", "util/unit", "components/forms/FileUploader.jsc"],
    function ($, UnitUtil, FileUploader) {
        describe("JSC FileUploader", function () {
            var instance = null

            UnitUtil.healthCheck(
                FileUploader,
                20,
                "\
                onRegister initFileUploader initDragArea \
                onOpenUploader reset \
                handleSelectedFile clearBase64 hideNotes \
            ")

            beforeEach(function () {
                instance = UnitUtil.createInstance(FileUploader)
                instance.onRegister()
            })

            afterEach(function(){
                instance = null
            })

            xit("TODO: write tests")
        })
    })
