module.exports = {
    options: {
        force: true
    },
    deploy: {
        files: [
            {
                dot: true,
                src: [
                    "<%= globalConfig.srcFolder %>/js/vendor/*",
                    "<%= globalConfig.deployFolder %>/*",
                    "<%= globalConfig.srcFolder %>/js/main.config.js",
                    "<%= globalConfig.srcFolder %>/js/main.mod.js",
                    "<%= globalConfig.srcFolder %>/js/main.js",
                    "<%= globalConfig.srcFolder %>/js/require.config.js",
                    "!<%= globalConfig.deployFolder %>/.git*"
                ]
            }
        ]
    }
};
