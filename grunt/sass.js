module.exports = function (grunt) {
    var files = {
        "<%= globalConfig.deployFolder %>/styles/main.css":
            ["<%= globalConfig.srcFolder %>/styles/main.scss"],
        "<%= globalConfig.deployFolder %>/styles/main-critical.css":
            ["<%= globalConfig.srcFolder %>/styles/main-critical.scss"]
    };

    return {
        options: {
            // include compass to get all mixins
            includePaths: [".compass", "node_modules/compass-sass-mixins/lib"]
        },

        dev: {
            options: {
                sourceMap: false
            },
            files: files
        },

        dist: {
            options: {
                outputStyle: "compressed"
            },
            files: files
        }
    };
};