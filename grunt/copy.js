module.exports = function () {
    return {
        jsSpecsToDeploy: {
            expand: true,
            cwd: "<%= globalConfig.srcFolder %>",
            dest: "<%= globalConfig.deployFolder %>",
            src: [
                "js/**/*.spec.js"
            ]
        },

        jsVendorToDeploy: {
            expand: true,
            cwd: "<%= globalConfig.srcFolder %>",
            dest: "<%= globalConfig.deployFolder %>",
            src: [
                "js/vendor/**",
                "js/vendor_custom/**"
            ]
        },

        // copy all assets like images, fonts, dummy jsons etc. to deploy folder
        assetsToDeploy: {
            files: [
                {
                    expand: true,
                    dot: true,
                    cwd: "<%= globalConfig.srcFolder %>",
                    dest: "<%= globalConfig.deployFolder %>",
                    src: [
                        "js/**/*.{json,hbs,swf,map}",
                        "*.{ico,png,txt}",
                        ".htaccess",
                        "img/**/*.*",
                        "dummy/**/*.*", // all dummy files

                        //"styles/**/*.!{scss,txt,xml}",   // font files
                        "styles/**/*.{eot,svg,ttf,woff,woff2}",   // font files

                        // these both files are needed and are not included in module bundles
                        "js/vendor/zeroclipboard/dist/zeroclipboard.js",
                        "js/vendor/zeroclipboard/dist/zeroclipboard.swf"
                    ]
                }
            ]
        },

        // copy grunt folder to deploy. Used from jasmine
        gruntFolderToDeploy: {
            expand: true,
            cwd: "./",
            src: [".grunt/**/*"],
            dest: "<%= globalConfig.deployFolder %>"
        }
    };
};