/*jslint maxlen:250*/
/*jslint white:true*/
/*eslint no-console: "off" */
/**
 * Author: Willy Woitas
 * Date 08.10.2015
 *
 * usecase for a jsc:
 *
 * require(["util/logger"], function(Logger){
 *  return {
 *      onRegister: function () {
 *          Logger.init(this); // <- this is set automaticly by jsc core before onRegister is called
 *      },
 *
 *      doAnything: function () {
 *          this.log("String", "infinity Arguments possible"); ->
 *          console.log -> output: COMPONENT_NAME, JSC_ID: "String", "infinity Arguments possible"
 *
 *          this.log_("String with file and linenumber reference"); ->
 *          console.log -> output: COMPONENT_NAME, JSC_ID: "String with file and linenumber reference",
 *          "at JSC (logger.js) 21:18"
 *
 *          this.$log() a.k.a evil log, ignore DEBUG_FLAG
 *
 *          // also possible
 *          this.warn
 *          this.warn_
 *          this.info
 *          this.info_
 *          this.error
 *          this.error_
 *      }
 *  }
 * });
 */
define(
    ["jquery", "underscore"],
    function ($, _) {
        var isConsole = window.console,
            consoleMethodsExists = {},
            canStackTrace = null,
            unknown = "unknown",
            withRef = "WithRef",
            forceRef = "ForceRef",
            consoleMethods = [
                "log",
                "info",
                "warn",
                "error"
            ],
            Logger;

        function checkStackTrace() {
            var error = new Error();
            return error.hasOwnProperty("stack") && error.stack !== "";
        }

        function getComponentName(componentName) {
            var nameof = function (exp) {
                var matches = exp.toString().replace(/\t/g, "").replace(/\s{2}/g, "");
                return (matches && matches.length > 2) ? $.trim(matches[2]) : unknown;
            };
            return nameof(componentName);
        }

        function handleDebugFlag(debugFlag) {
            return _.isBoolean(debugFlag) ? debugFlag : unknown;
        }

        function handleComponentName(_componentName_) {
            var componentName;
            if (_.isFunction(_componentName_)) {
                componentName = getComponentName(_componentName_);
            } else {
                componentName = _.isString(_componentName_) ? _componentName_ : unknown;
            }
            return componentName;
        }

        canStackTrace = checkStackTrace();
        Logger = {
            canStackTrace: canStackTrace,
            /**
             * init for a component the debug methods
             * @param instance object
             * @param debugFlag boolean
             * @param componentName string
             */
            init: function (instance, debugFlag, componentName) {
                var boolean,
                    logEnabled;

                if (instance) {
                    // already init the console
                    if (instance.hasOwnProperty("consoleInit_")) {
                        return false;
                    }

                    // jsc html enabler
                    if (instance.hasOwnProperty("$el")) {
                        logEnabled = instance.$el.data("log-enabled");
                        if (logEnabled) {
                            debugFlag = logEnabled;
                        }
                    }
                    // add all logger methods to the instance
                    $.each(consoleMethods, function (index, method) {
                        // method with reference to callee (this.log_)
                        instance[method + "_"] = Logger[method + withRef];
                        // method with ignorance of debug flag (this.$log)
                        instance["$" + method] = Logger[method + forceRef];
                        // normal methods (this.log)
                        instance[method] = Logger[method];
                    });
                    // instance vars
                    instance.canStackTrace = canStackTrace;
                    instance.consoleInit_ = true;
                    instance.whoIsParent_ = false;
                    instance.showFullStack_ = false;
                    instance.activateWhoIsParent = function (index, showFullStack) {
                        instance.whoIsParent_ = true;
                        instance.whoIsParentIndex_ = index || 3;
                        instance.showFullStack_ = showFullStack || false;
                    };
                    instance.forceLog_ = false;

                    if (debugFlag) {
                        instance.debugFlag_ = handleDebugFlag(debugFlag);
                    } else if (!_.isUndefined(instance.CONST) && !_.isUndefined(instance.CONST.DEBUG)) {
                        instance.debugFlag_ = handleDebugFlag(instance.CONST.DEBUG);
                    } else {
                        instance.debugFlag_ = false;
                    }

                    if (componentName) {
                        instance.componentName_ = handleComponentName(componentName);
                    } else if (!_.isUndefined(instance.CONST) && !_.isUndefined(instance.CONST.COMPONENT_NAME)) {
                        instance.componentName_ = handleComponentName(instance.CONST.COMPONENT_NAME);
                    } else {
                        instance.componentName_ = unknown;
                    }

                    boolean = true;
                } else {
                    this.warn("instance is undefined");
                    boolean = false;
                }
                return boolean;
            },
            /**
             * $init is force init for a component which is available for dist
             * @param instance
             * @param debugFlag
             * @param componentName
             */
            $init: function (instance, debugFlag, componentName) {
                this.init(instance, debugFlag, componentName);
            }
        };

        /**
         * push to the log the reference of thrown log
         *
         * example of log:
         ...rmat"}     at Backbone.View.extend.onStageDataChanged (http://localhost:9000/js/components/product/ProductImage.jsc.js:40:22)
         *
         * example of stacktrace:
         0 Error
         1 at lineRef (http://localhost:9000/js/util/logger.js:10:26)
         2 at logWithRef [as log_] (http://localhost:9000/js/util/logger.js:30:27)
         3***component called method***
         *
         * @returns {string}
         */
        function addLineRef(args, instance) {
            if (!canStackTrace) {
                return false;
            }
            var stack = new Error().stack,
                exceptionLine = 3, // index who called this.log
                lineReference;
            if (stack) {
                // index who called a method with this.log inside activate via activateWhoIsParent
                if (instance.whoIsParent_) {
                    exceptionLine = instance.whoIsParentIndex_ || 4;
                }
                // to find which line is the callee activate via activateWhoIsParent
                if (instance.showFullStack_) {
                    console.log(stack);
                }
                lineReference = stack.split("\n")[exceptionLine];
                args.push("\n" + lineReference);
            }
        }

        /**
         * unshift to the log message the component name and jsc id
         *
         * example: ProductImage, jsc-10: Obj...
         *
         * @param thisScope
         * @param args
         */
        function addComponentHint(thisScope, args) {
            if (!thisScope || !thisScope.hasOwnProperty("componentName_")) {
                return false;
            }
            var id = thisScope.hasOwnProperty("$el")
                ? thisScope.$el.attr("data-jsc-intern-id")
                : undefined;
            if (thisScope.componentName_ !== unknown) {
                args.unshift(thisScope.componentName_ + (id ? ", " + id : "") + ":");
            }
        }

        /**
         * build all methods for this logger
         */
        $.each(consoleMethods, function (index, method) {
            consoleMethodsExists[method] = window.console[method];
            /**
             * Method like a console.ANY but
             * prints out the caller method at the end with file reference
             */
            Logger[method + withRef] = function () {
                if (arguments.length === 0) {
                    return false;
                }

                var args = Array.prototype.slice.call(arguments);
                // add line reference out of exception
                addLineRef(args, this);
                this.whoIsParent_ = false;
                this[method].apply(this, args);
            };
            /**
             *  Method to force output without debug flag
             */
            Logger[method + forceRef] = function () {
                if (arguments.length === 0) {
                    return false;
                }

                var args = Array.prototype.slice.call(arguments);
                if (this.whoIsParent_) {
                    addLineRef(args, this);
                }
                this.whoIsParent_ = false;
                // set force
                this.forceLog_ = true;
                this[method].apply(this, args);
            };

            /**
             * special case log method
             */
            if (method === "log") {
                Logger[method] = function () {
                    if (arguments.length === 0) {
                        return false;
                    }

                    var args = Array.prototype.slice.call(arguments),
                        existsConsoleMethod = isConsole && window.console.log;
                    if (this.forceLog_
                        || !this.hasOwnProperty("componentName_") // directly use Logger.log || .logWithRef
                        || (existsConsoleMethod && this.debugFlag_ !== unknown && this.debugFlag_ === true) // Logger.init(this, DEBUGFLAG=true)
                        || (existsConsoleMethod && this.debugFlag_ === unknown)) {// Logger.init(this)
                        addComponentHint(this, args);
                        console.log.apply(console, args);
                        // reset force for all the other
                        this.forceLog_ = false;
                    }
                };
                /**
                 * normal method
                 */
            } else {
                Logger[method] = function () {
                    if (arguments.length === 0) {
                        return false;
                    }

                    var args = Array.prototype.slice.call(arguments);
                    if (isConsole && consoleMethodsExists[method]) {
                        addComponentHint(this, args);
                        console[method].apply(console, args);
                    }
                };
            }
        });

        return Logger;
    });
