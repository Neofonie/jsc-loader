module.exports = function (grunt) {
    var indent = 4,
        configMainPath = "./requirejs/config-main.json";

    return {
        build: {
            options: {
                replacements: [
                    {
                        pattern: /"<%= requireConfig %>"/ig, replacement: function () {
                            var requireConfig = require(configMainPath);
                            return JSON.stringify(requireConfig, null, indent);
                        }
                    },
                    {
                        pattern: /"<%= requireConfig.shim %>"/ig, replacement: function () {
                            var requireConfig = require(configMainPath);
                            return JSON.stringify(requireConfig.shim, null, indent);
                        }
                    },
                    {
                        pattern: /"<%= requireConfig.paths %>"/ig, replacement: function () {
                            var requireConfig = require(configMainPath);
                            return JSON.stringify(requireConfig.paths, null, indent);
                        }
                    },
                    {
                        pattern: /"<%= requireConfig.urlArgs %>"/ig, replacement: function () {
                            var globalConfig = grunt.config("globalConfig");
                            return JSON.stringify("v=" + globalConfig.buildVersion, null, indent);
                        }
                    }
                ]
            },
            files: {
                "<%= globalConfig.srcFolder %>/js/main.js":
                    "<%= globalConfig.gruntFolder %>/requirejs/main.tpl.js",
                "<%= globalConfig.srcFolder %>/js/main.config.js":
                    "<%= globalConfig.gruntFolder %>/requirejs/main.config-tpl.js"
            }
        }
    }
};
