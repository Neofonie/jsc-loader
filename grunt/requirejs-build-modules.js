module.exports = function (grunt) {
    var globalConfig = grunt.config("globalConfig");
    /*
    arrModules =
     [{
         name: "bundles/app-start.bundle",
         exclude: ["main"]
     },
     {
         "name": "components/accordion/Accordion.jsc",
         "exclude": ["main"]
     }]
     */
    grunt.registerTask("requirejsBuildModules", function () {
        var walk = require("walk"),
            include = [],
            done = this.async(),
            scanDir = globalConfig.srcFolder + "/js",
            jsExtension = ".js",
            jsSpecExtension = ".spec" + jsExtension,
            options = {
                followLinks: false,
                filters: [
                    "consts",
                    "core",
                    "tpl",
                    "vendor",
                    "vendor_custom"
                ]
            };
        // add jsc's and bundles
        var walker = walk.walk(scanDir, options);
        walker.on("file", function (root, file, next) {
            var isSpec = ~file.name.indexOf(jsSpecExtension),
                isJs = ~file.name.indexOf(jsExtension),
                isScanDir = !root.replace(scanDir, "").length,
                name;

            if (isJs && !isSpec && !isScanDir) {
                name = root
                    .replace(/\\/g, "/") // convert windows slashes to normal
                    .replace(scanDir + "/", "") // remove scanDir with slashes
                    + "/"
                    + file.name.replace(/\.js$/, ""); // remove extension

                include.push(name);
            }

            next();
        });

        walker.on("end", function () {
            grunt.config("requirejs.dist.options.include", include);
            grunt.log.writeln(
                "main module ("[globalConfig.logColor] +
                include.length +
                " files included) is ready for build, "[globalConfig.logColor] +
                "this could take longer than 30secs"[globalConfig.logColor]);
            done();
        });
    });
};
