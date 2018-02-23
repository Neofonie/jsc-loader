module.exports = function (grunt) {

    return {
        options: {
            quiet: true //errors only
            //format: "checkstyle",
            //outputFile: "<%= globalConfig.tmpFolder %>/xml/server-checkstyle.xml"*/
        },
        files : [
            "<%= globalConfig.srcFolder %>/js/**/*.js",
            "!<%= globalConfig.srcFolder %>/js/main.js",
            "!<%= globalConfig.srcFolder %>/js/main.*.js",
            "!<%= globalConfig.srcFolder %>/js/require.config.js",
            "!<%= globalConfig.srcFolder %>/js/require.config-tpl.js",
            "!<%= globalConfig.srcFolder %>/js/vendor*/**/*.js",
            "!<%= globalConfig.srcFolder %>/js/util/unit.js",
            "!<%= globalConfig.srcFolder %>/js/**/*.spec.js",
            "!<%= globalConfig.srcFolder %>/js/**/*.xspec.js",
            "!<%= globalConfig.srcFolder %>/js/**/*.bundle.js"
        ]
    }
};
