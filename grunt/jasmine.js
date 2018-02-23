/*
 * jasmine is behavior driven javascript
 * it is required for js unit testing,
 * it generates a _SpecRunner.html where the javascript can run in a browser
 * */
module.exports = function (grunt) {
    var globalConfig = grunt.config("globalConfig"),
        requireConfig = require("./requirejs/config-main.json");
    // set baseurl for coverage
    requireConfig.baseUrl = "js/";

    return {
        full: {
            options: {
                display: "full",
                summary: true
            }
        },

        short: {
            options: {
                display: "short"
            }
        },

        none: {
            options: {
                display: "none"
            }
        },

        server: {
            options: {
                junit: {
                    path: globalConfig.tmpFolder + "/junit",
                    consolidate: true
                },
                outfile: globalConfig.test.specRunnerPath,
                coverage: globalConfig.tmpFolder + "/coverage/coverage.json",
                report: globalConfig.tmpFolder + "/coverage",
                template: require("grunt-template-jasmine-requirejs"),
                src: globalConfig.test.srcFiles,
                specs: globalConfig.test.specsLoadPath,
                vendor: [
                    "js/vendor/jquery/dist/jquery.js",
                    "js/vendor_custom/require.js",
                    "js/main.config.js",
                    "js/main.js"
                ]
            }
        },

        coverage: {
            src: "src/js/**/*.jsc.js",
            options: {
                display: globalConfig.test.testOptionDisplay,
                summary: true,
                specs: globalConfig.test.specsLoadPath,
                outfile: "src/" + globalConfig.test.specRunnerName,
                junit: {
                    path: globalConfig.tmpFolder + "/junit",
                    consolidate: true
                },
                vendor: "src/js/vendor/jquery/dist/jquery.js",
                template: require("grunt-template-jasmine-istanbul"),
                templateOptions: {
                    coverage: globalConfig.tmpFolder + "/coverage/coverage.json",
                    report: [
                        {
                            type: "text-summary"
                        },
                        {
                            type: "lcov",
                            options: {
                                dir: globalConfig.tmpFolder + "/coverage/lcov"
                            }
                        }
                    ],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: requireConfig
                    }
                }
            }
        }
    };
};
