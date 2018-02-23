module.exports = function (grunt) {
    require("json5/lib/require");

    var rewrite = require("connect-modrewrite"),
        config = require("./connect/config.json5"),
        rules = require("./connect/rewrite-rules.json5"),
        serveStatic = require("serve-static"),
        globalConfig = grunt.config("globalConfig"),
        returnConfig;

    function middleware (connect, options, middlewares) {
        // allow post
        middlewares.unshift(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Credentials", true);
            res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            if (req.method.toUpperCase() === "POST") req.method = "GET";

            return next();
        });

        // 1. mod-rewrite behavior
        middlewares.unshift(rewrite(rules));

        // 2. original middleware behavior
        var base = typeof options == "object" && options.base[0].hasOwnProperty("path")
            ? options.base[0].path : options.base;
        if (!Array.isArray(base)) {
            base = [base];
        }

        base.forEach(function (path) {
            middlewares.unshift(serveStatic(path));
        });

        return middlewares;
    }

    returnConfig = {
        options: {
            port: globalConfig.port,
            livereload: config.livereload,
            hostname: globalConfig.hostName,
            middleware: middleware,
            keepalive: true
        },
        /**
         * Server in deploy folder.
         */
        deploy: {
            options: {
                open: true,
                base: [
                    "<%= globalConfig.deployFolder %>"
                ]
            }
        },
        /**
         * Server for unit tests in deploy folder.
         */
        specRunner: {
            options: {
                open: {
                    target: "http://" + globalConfig.hostName + ":" + globalConfig.port + "/_SpecRunner.html"
                },
                base: {
                    path: "<%= globalConfig.deployFolder %>"
                }
            }
        }
    };

    return returnConfig;
};
