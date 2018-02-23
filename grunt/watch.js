module.exports = function (grunt) {

    require("json5/lib/require");
    var config = require("./connect/config.json5");

    grunt.registerTask("watchPrototype", function () {
        grunt.config.merge(generateConfigPrototype());
        grunt.task.run("watch");
    });

    function generateConfigPrototype () {
        return {
            watch: {
                options: {
                    livereload: config.livereload
                },
                // If SASS files are changed then compile and copy css to AEM
                sassPrototype: {
                    files: [
                        "<%= globalConfig.srcFolder %>/styles/*.{scss,sass,css}",
                        "<%= globalConfig.srcFolder %>/styles/**/*.{scss,sass,css}",
                        "!<%= globalConfig.srcFolder %>/styles/_extern-vars.scss"
                    ],
                    tasks: [
                        "buildTemplate",
                        "sass:<%= globalConfig.deployType %>",
                        "sasslint"
                    ],
                    options: {
                        livereload: config.livereload
                    }
                },

                // IF JS files are changed bundle or copy files.
                requirejsPrototype: {
                    files: [
                        "grunt/requirejs/*.{js,json}",
                        "<%= globalConfig.srcFolder %>/js/**/*",
                        "!<%= globalConfig.srcFolder %>/js/vendor/**/*",
                        "!<%= globalConfig.srcFolder %>/js/main.config.js",
                        "!<%= globalConfig.srcFolder %>/js/main.mod.js",
                        "!<%= globalConfig.srcFolder %>/js/main.js",
                        "!<%= globalConfig.srcFolder %>/js/require.config.js"
                    ],
                    tasks: [
                        "buildTemplate",
                        "newer:babel:js",
                        "requirejsBuild",
                        "newer:eslint"
                    ],
                    options: {
                        livereload: config.livereload
                    }
                },

                    // compile templates
                assemble: {
                    files: [
                        "<%= globalConfig.srcFolder %>/templates/**/*.{hbs,json}",
                        "<%= globalConfig.srcFolder %>/templates/helpers/*.js"
                    ],
                    tasks: [
                        "assemble"
                    ],
                    options: {
                        livereload: config.livereload
                    }
                },

                // compile templates
                dummyData: {
                    files: [
                        "<%= globalConfig.srcFolder %>/dummy/**/*"
                    ],
                    tasks: [
                        "newer:copy:assetsToDeploy"
                    ],
                    options: {
                        livereload: config.livereload
                    }
                },

                bowerUpdatesPrototype: {
                    files: [
                        "<%= globalConfig.bowerFolder %>/**/*"
                    ],
                    tasks: [
                        "copyBowerToSrc",
                        "requirejsBuild",
                        "copy:jsVendorToDeploy"
                    ]
                }
            }
        };
    }

    return {};
};