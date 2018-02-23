module.exports = function (grunt) {
    return {
        options: {
            logColor: "<%= globalConfig.logErrorColor %>",
            configFile: "./grunt/sasslint.yml"
            //,formatter: "junit",
            //outputFile: "<%= globalConfig.tmpFolder %>/xml/sass-lint-report.xml"
        },
        target: [
            "<%= globalConfig.srcFolder %>/styles/**/*.scss",
            // don't lint vendor and generated files because its not our job
            "!<%= globalConfig.srcFolder %>/styles/vendor/**/*.scss",
            "!<%= globalConfig.srcFolder %>/styles/breakpoint/**/*.scss"
        ]
    }
};
