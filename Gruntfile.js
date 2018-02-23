"use strict";

/**
 * Default task is "serve". That means at first all files are build and than a server will be opened.
 *
 * Usage:
 *      grunt
 *      grunt --env=dev
 *      grunt --env=dist
 *
 * To run jasmine test in browser:
 *      grunt testUnitServer
 */
require("json5/lib/require");

module.exports = function (grunt) {
    // show elapsed time at the end
    if (process.env.showTimes || grunt.option("showTimes")) {
        require("time-grunt")(grunt);
    }
    // can be "dev" or "dist"
    var _ = require("lodash"),
        rawDeployType = process.env.deployType || process.env.gruntEnv || process.env.GRUNT_ENV || grunt.option("env"),
        deployType =  rawDeployType === "dist" ? rawDeployType : "dev",
        optBuildVersion = process.env.buildVersion || grunt.option("buildVersion"),
        emptyBuildVersionParams = "${build.git.hash} unknown",
        buildVersion = optBuildVersion && optBuildVersion !== "" && emptyBuildVersionParams.indexOf(optBuildVersion) === -1
            ? optBuildVersion
            : deployType + "-" + (new Date()).getTime(),

        tmpFolder = "tmp",
        gruntFolder = "grunt",
        configHost = require("./grunt/connect/config.json5"),

        /* Test config */
        phantomJS = process.env.phantomJS || grunt.option("phantomJS"),
        optionSpec = process.env.spec || grunt.option("spec"),
        optionDisplay = process.env.display || grunt.option("display") || "full",
        specExtension = ".spec.js",
        gruntPath = ".grunt/grunt-contrib-jasmine",
        specRunnerName = "_SpecRunner.html",
        // spec=*/Flyouthandler -> src/*/FlyoutHandler.spec.js

        /* End: Test config */
        globalConfig = {
            logColor: "cyan", //'white', 'black', 'grey', 'blue', 'cyan', 'green', 'magenta', 'red', 'yellow', 'rainbow'
            logErrorColor: "red",
            logWarningColor: "yellow",
            port: process.env.port || configHost.port,
            hostName: process.env.hostName || configHost.hostName,
            // can be "dev" | "dist"
            deployType: deployType,
            buildVersion: buildVersion,
            tmpFolder: tmpFolder,
            gruntFolder: gruntFolder,
            // base source folder containing JS, SASS and HBS files
            srcFolder: "src",
            // _dev | _dist
            deployFolder: tmpFolder + "/_" + deployType,
            testFolder: tmpFolder + "/test",
            bowerFolder: "node_modules/@bower_components",
            buildForAem: false
        };

    globalConfig.test = {
        optionDisplay: optionDisplay,
        phantomJS: phantomJS,
        optionSpec: optionSpec,
        gruntPath: gruntPath,
        specRunnerName: specRunnerName,
        specRunnerPath: globalConfig.deployFolder + "/" + specRunnerName,
        specPath: (!phantomJS ? globalConfig.deployFolder : "src") + "/js/**"
    };

    globalConfig.test.srcFiles = globalConfig.test.specPath + "/*.jsc.js";
    globalConfig.test.specsLoadPath = globalConfig.test.specPath + "/" +
        (
            !optionSpec
                ? "*" + specExtension
                : optionSpec + (!_.endsWith(optionSpec, specExtension) ? specExtension : "")
        );

    grunt.config("env", globalConfig.deployType);
    grunt.config("buildVersion", globalConfig.buildVersion);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        globalConfig: globalConfig
    });

    grunt.log.writeln(["deployType ::::: " + globalConfig.deployType]);
    grunt.log.writeln(["buildVersion ::::: " + globalConfig.buildVersion]);
    grunt.log.writeln(["hostName ::::: " + globalConfig.hostName + ":" + globalConfig.port]);

    // Load grunt configurations automatically
    require("load-grunt-config")(grunt, {
        jitGrunt: {
            staticMappings: {
                "scsslint": "grunt-scss-lint",
                "sasslint": "grunt-sass-lint"
            }
        },
        init: true,
        // data passed into config.  Can use with <%= globalConfig %>
        data: {
            globalConfig: globalConfig
        }
    });

    // task are under ./grunt/tasks.js
};
