/*eslint no-console:off */
module.exports = function (grunt) {
    var globalConfig = grunt.config("globalConfig");

    /**
     * WORK WITH PROTOTYPE
     * Main task, used to show _dev or _dist on server, includes watcher.
     * Default is dev mode.
     *
     * Usage:
     *      grunt serve:prototype
     *      grunt serve:prototype --env=dev
     *      grunt serve:prototype --env=dist
     */
    grunt.registerTask("serve:prototype", function () {
        grunt.task.run([
            "clean",
            "buildTemplate",
            "sass:" + globalConfig.deployType,
            "copyToDeploy",
            "assemble",
            "concurrent:lint",
            "concurrent:prototypeServerWatch"
        ]);
    });

    /**
     * Browser Jasmine Unit test runner.
     * Everything is build on start. Server is opened and watch task checks for changes of JS files.
     *
     * spec=* /Flyouthandler -> src/* /FlyoutHandler.spec.js
     */
    grunt.registerTask("serve:test", function () {
        grunt.task.run([
            "test:printSpecs",
            "clean",
            "buildTemplate",
            "sass:" + globalConfig.deployType,
            "copyToDeploy",
            "copy:jsSpecsToDeploy",
            "copy:gruntFolderToDeploy",
            "jasmine:server:" + globalConfig.test.optionDisplay + ":build",
            "test:repairRunner",
            "concurrent:testServerWatch"
        ]);
    });

    grunt.registerTask("copyToDeploy", function () {
        grunt.task.run([
            "copyBowerToSrc",
            "babel:js",
            "copy:jsVendorToDeploy",
            "copy:assetsToDeploy",
            "requirejsBuild"
        ]);
    });

    /**
     * This task uses the templates from grunt/requirejs and the data in each grunt plugin
     */
    grunt.registerTask("buildTemplate", function () {
        grunt.task.run([
            "string-replace:build"
        ]);
    });

    /**
     * Default task is "serve"
     *
     * Usage:
     *      grunt
     *      grunt --env=dev
     *      grunt --env=dist
     */
    grunt.registerTask("default", [
        "serve:prototype"
    ]);
};
