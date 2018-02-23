module.exports = function (grunt) {
    var globalConfig = grunt.config("globalConfig"),
        mkdirp = require("mkdirp"),
        fs = require("fs"),
        getDirName = require("path").dirname,
        _ = require("lodash"),
        countFiles = 0,
        countFilesInner = 0;

    function copyFile(source, target, cb) {
        var cbCalled = false;

        function done(err) {
            if (!cbCalled) {
                cb(err);
                cbCalled = true;
            }
        }

        mkdirp(getDirName(target), function (err) {
            if (err) return cb(err);

            var rd = fs.createReadStream(source);
            rd.on("error", function (err) {
                done(err);
            });
            var wr = fs.createWriteStream(target);
            wr.on("error", function (err) {
                done(err);
            });
            wr.on("close", function () {
                done();
            });
            rd.pipe(wr);
        });
    }

    grunt.registerTask("copyBowerToSrc", function () {
        var mainConfig = require("./requirejs/config-main.json"),
            vendorConfig = require("./requirejs/config-vendor.json"),
            done = this.async(),
            srcFolder = globalConfig.bowerFolder,
            destFolder = globalConfig.srcFolder + "/" + mainConfig.baseUrl,
            customIdentifier = "_custom",
            extension = ".js";

        countFiles = 0;
        countFilesInner = 0;

        function parseFiles(array) {
            array.each(function (vendorFile, key) {
                var srcFile = srcFolder + "/" + vendorFile.replace("vendor/", "") + extension,
                    destFile = destFolder + "/" + vendorFile + extension;

                if (srcFile.indexOf(customIdentifier) === -1 && destFile.indexOf("/vendor") !== -1) {
                    // copy from src to deploy
                    copyFile(srcFile, destFile,
                        function (error) {
                            countFiles++;

                            if (error) {
                                //grunt.log.writeln(error[globalConfig.logErrorColor]);
                            }

                            if (countFiles === countFilesInner) {
                                if (countFiles > 0) {
                                    grunt.log.writeln(countFiles + " file(s) copied to srcFolder");
                                } else {
                                    grunt.log.writeln("0 files copied to srcFolder"[globalConfig.logErrorColor]);
                                }

                                done();
                            }
                        }
                    );
                    countFilesInner++;
                }
            });
        }

        // iterate vendor files
        parseFiles(_(vendorConfig));
        parseFiles(_(mainConfig.paths));
    });
};
