/*global FileReader */
/*jslint white:true*/
/**
 * Author: Willy Woitas
 * 26.08.2015
 */
define(
    ["jquery", "underscore", "backbone", "handlebars",
        "util/device-detect",
        "text!tpl/fileUploadAttachment.hbs"],
    function ($, _, Backbone, Handlebars,
              DeviceDetect,
              tplFileUploadAttachment) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "FileUploader",
                DEBUG: false,

                MAX_FILES: 3,

                MAX_FILESIZE: (1024 * 1024),// 1MB = 1048576Bytes

                ACCEPT_TYPES: "image/*",

                BASE_64_REGEXP: "^(data:(.*?);?base64,)(.*)$",

                CLASS_DRAG_AREA: "jsDragArea",
                CLASS_FILE_UPLOADER: "jsFileUploader",
                CLASS_UPLOAD_OPENER: "jsUploaderOpener",
                CLASS_ATTACHMENT_AREA: "jsAttachmentArea",
                CLASS_ATTACHMENT: "jsAttachment",
                CLASS_IS_DRAGGED: "is-dragged",
                CLASS_IS_LOADING: "is-loading",
                CLASS_INIT_HIDDEN: "init-hidden",
                CLASS_NO_ACCEPT_TYPE: "jsNoteNoAcceptType",
                CLASS_MAX_FILES_EXCEEDED: "jsNoteMaxFileExceeded",
                CLASS_SEL_FILE_SIZE_EXCEEDED: "jsNoteFileSizeExceeded",
                CLASS_INPUT_WRONG: "input--wrong",
                DATA_PATH_FORMCONFIG: "data-path-formconfig"
            },

            events: {
                "click .jsUploaderOpener": "onOpenUploader"
            },

            /**
             * Component registered.
             */
            onRegister: function () {
                if (DeviceDetect.isiOS()) {
                    this.$el.find("." + this.CONST.CLASS_UPLOAD_OPENER).on("touchstart", _.bind(function (event) {
                        event.stopPropagation();
                        this.onOpenUploader();
                    }, this));
                    this.$el.find("." + this.CONST.CLASS_UPLOAD_OPENER).off("click");
                }

                var pagePath = this.$el.attr(this.CONST.DATA_PATH_FORMCONFIG),
                    servletPath = this.CONST.FORMCONFIG_SERVLET_PATH,
                    requestConfig;

                if (pagePath) {
                    this.log("page path", pagePath);
                    this.log("servlet path", servletPath);
                    requestConfig = {
                        url: servletPath,
                        data: {
                            path: pagePath
                        }
                    };
                    $.ajax(requestConfig).success(_.bind(function (data) {
                        if (data.hasOwnProperty("maxFiles") && $.isNumeric(data.maxFiles)
                                && data.maxFiles !== this.CONST.MAX_FILES) {
                            this.log("override MAX_FILES", this.CONST.MAX_FILES, "to", data.maxFiles);
                            this.CONST.MAX_FILES = data.maxFiles;
                        }
                        if (data.hasOwnProperty("maxBytes") && $.isNumeric(data.maxBytes)
                                && data.maxBytes !== this.CONST.MAX_FILESIZE) {
                            this.log("override MAX_FILESIZE", this.CONST.MAX_FILESIZE, "to", data.maxBytes);
                            this.CONST.MAX_FILESIZE = data.maxBytes;
                        }
                    }, this));
                }

                this.initFileUploader();
                this.initDragArea();
                this.hideNotes();
            },

            /**
             * init the upload button
             * and register his change event
             */
            initFileUploader: function () {
                this.$el.find("." + this.CONST.CLASS_FILE_UPLOADER)
                    .on("change", _.bind(function () {
                        this.log("fileuploader change");
                        this.handleSelectedFile(this.$el.find("." + this.CONST.CLASS_FILE_UPLOADER)
                            .prop("files"));
                    }, this));
            },

            /**
             * init the drag area and his events
             */
            initDragArea: function () {
                this.log("initDragArea");
                var $dragArea = this.$el.find("." + this.CONST.CLASS_DRAG_AREA),
                    counter = 0;

                this.$el
                    // event for drag file into window
                    .on("dragenter", _.bind(function (event) {
                        this.log("dragenter");
                        event.preventDefault();
                        event.stopPropagation();
                        counter++;
                        $dragArea.addClass(this.CONST.CLASS_IS_DRAGGED);
                    }, this))
                    // event for drag file out of window
                    .on("dragleave", _.bind(function (event) {
                        this.log("dragleave");
                        event.preventDefault();
                        event.stopPropagation();
                        counter--;
                        if (counter === 0) {
                            $dragArea.removeClass(this.CONST.CLASS_IS_DRAGGED);
                        }
                    }, this))
                    // event for let the file into the window
                    .on("dragover", _.bind(function (event) {
                        this.log("dragover");
                        event.preventDefault();
                        event.stopPropagation();
                    }, this))
                    // event for drag file into dragarea
                    .on("drop", _.bind(function (event) {
                        this.log("drop");
                        this.log(arguments);
                        event.preventDefault();
                        event.stopPropagation();
                        $dragArea.removeClass(this.CONST.CLASS_IS_DRAGGED);
                        this.handleSelectedFile(event.originalEvent.dataTransfer.files);
                    }, this));
            },

            /**
             * callback for the upload button
             */
            onOpenUploader: function () {
                this.log("onOpenUploader");
                this.$el.find("." + this.CONST.CLASS_FILE_UPLOADER).click();
            },

            reset: function () {
                var $area = this.$el.find("." + this.CONST.CLASS_ATTACHMENT_AREA);
                $area.html("");
                this.$el.find("." + this.CONST.CLASS_DRAG_AREA).removeClass(this.CONST.CLASS_INPUT_WRONG);
            },

            /**
             * end function for upload button and dragarea
             * expected a array of files or filelist
             * @param files
             */
            handleSelectedFile: function (files) {
                this.log("handleSelectedFile " + files.length);
                var template = Handlebars.compile(tplFileUploadAttachment),
                    $area = this.$el.find("." + this.CONST.CLASS_ATTACHMENT_AREA),
                    $filesExists = this.$el.find("." + this.CONST.CLASS_ATTACHMENT),
                    $i18nMaxFiles,
                    $i18nMaxFileSize,
                    maxFileSize;

                this.log(files);

                this.hideNotes();

                $.each(files, _.bind(function (i, file) {
                    // only accepct files we want and not more than we want
                    this.log(
                        "ACCEPT_TYPES: " + (!file.type.match(this.CONST.ACCEPT_TYPES)),
                        "MAX_FILES: " + (($filesExists.length + i) >= this.CONST.MAX_FILES),
                        "MAX_FILESIZE: " + (file.size > this.CONST.MAX_FILESIZE)
                    );

                    // throw notes
                    if (!file.type.match(this.CONST.ACCEPT_TYPES)) {
                        this.$el.find("." + this.CONST.CLASS_NO_ACCEPT_TYPE)
                            .removeClass(this.CONST.CLASS_INIT_HIDDEN);
                        return;
                    }

                    if (($filesExists.length + i) >= this.CONST.MAX_FILES) {
                        $i18nMaxFiles = this.$el.find("." + this.CONST.CLASS_MAX_FILES_EXCEEDED);
                        if(!$i18nMaxFiles.cacheI18n) {
                            $i18nMaxFiles.cacheI18n = $i18nMaxFiles.html();
                        }
                        $i18nMaxFiles.html($i18nMaxFiles.cacheI18n.replace("{0}", this.CONST.MAX_FILES));
                        $i18nMaxFiles.removeClass(this.CONST.CLASS_INIT_HIDDEN);
                        return;
                    }

                    if (file.size > this.CONST.MAX_FILESIZE) {
                        $i18nMaxFileSize = this.$el.find("." + this.CONST.CLASS_SEL_FILE_SIZE_EXCEEDED);
                        if(!$i18nMaxFileSize.cacheI18n) {
                            $i18nMaxFileSize.cacheI18n = $i18nMaxFileSize.html();
                        }
                        maxFileSize = Number((this.CONST.MAX_FILESIZE/1048576).toFixed(2));
                        $i18nMaxFileSize.html($i18nMaxFileSize.cacheI18n.replace("{0}", maxFileSize));
                        $i18nMaxFileSize.removeClass(this.CONST.CLASS_INIT_HIDDEN);
                        return;
                    }

                    var reader = new FileReader(),
                        $element = $(template({
                            index: $filesExists.length + i + 1,
                            image: "",
                            filename: file.name,
                            base64: ""
                        }));
                    // register remove event
                    $element.click(function () {
                        $(this).remove();
                    });

                    this.log($element);

                    // append template
                    $area.append($element);

                    // wait till the file is loaded
                    reader.onload = _.bind(function ($element, event) {
                        var base64 = event.target.result;
                        $("img", $element).attr("src", base64);
                        $($("input", $element)[1]).attr("value", this.clearBase64(base64));
                        $element.removeClass(this.CONST.CLASS_IS_LOADING);
                        this.$el.find("." + this.CONST.CLASS_DRAG_AREA).removeClass(this.CONST.CLASS_INPUT_WRONG);
                    }, this, $element);

                    // start reading
                    reader.readAsDataURL(file);
                }, this));
            },
            /**
             * remove from the browser given base64
             *
             * @param b64Data
             * @returns {*}
             */
            clearBase64: function (b64Data) {
                if (typeof b64Data !== "string") {
                    return "";
                }

                var clearBase64 = b64Data
                    .replace(/\r?\n|\r| /g, "")
                    .replace(
                        new RegExp(this.CONST.BASE_64_REGEXP, "i"),
                        function (all, base64Header, mimeType, clearBase64) {
                            return clearBase64;
                        }
                    );

                return clearBase64;
            },

            hideNotes: function () {
                // hide all notes
                this.$el.find("." + this.CONST.CLASS_NO_ACCEPT_TYPE).addClass(this.CONST.CLASS_INIT_HIDDEN);
                this.$el.find("." + this.CONST.CLASS_MAX_FILES_EXCEEDED).addClass(this.CONST.CLASS_INIT_HIDDEN);
                this.$el.find("." + this.CONST.CLASS_SEL_FILE_SIZE_EXCEEDED).addClass(this.CONST.CLASS_INIT_HIDDEN);
            }
        });
    });
