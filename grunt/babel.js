module.exports = function (grunt, options) {
    return {
        options: {
            sourceMap: false
        },
        js: {
            expand: true,
            cwd: "<%= globalConfig.srcFolder %>",
            src: [
                "js/**/*.js",
                "!js/vendor/**"
            ],
            dest: "<%= globalConfig.deployFolder %>"
        }
    };
};