module.exports = function (grunt) {
    var globalConfig = grunt.config("globalConfig");

    grunt.registerTask("requirejsBuild", function () {
        if (globalConfig.deployType !== "dev") {
            grunt.task.run([
                "requirejsBuildModules",
                //"requirejsPrintOutIncludes",
                "requirejs:" + globalConfig.deployType
            ]);
        }
    });

    grunt.registerTask("requirejsPrintOutIncludes", function () {
        grunt.log.writeln(
            JSON.stringify(grunt.config("requirejs.dist.options.include"), null, 2)[globalConfig.logColor]
        );
    });

    return {
        dist: {
            options: {
                name: "main",
                include: "overwritten",
                mainConfigFile: "<%= globalConfig.srcFolder %>/js/main.config.js",
                baseUrl: "<%= globalConfig.deployFolder %>/js",
                dir: "<%= globalConfig.deployFolder %>/js",
                allowSourceOverwrites: true,
                keepBuildDir: true,

                optimize: "uglify2",
                preserveLicenseComments: false,

                uglify2: {
                    // Comment out the output section to get rid of line
                    // returns and tabs spacing.
                    output: {
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        pure_funcs: [
                            "console.log",
                            "console.debug",
                            "this.log_",
                            "this.log",
                            "this.$log",
                            "that.log"
                        ]
                    },
                    mangle: false
                }
            }
        }
    };
};