/*
 * (c) Neofonie GmbH
 *
 * This computer program is the sole property of Neofonie GmbH
 * (http://www.neofonie.de) and is protected under the German Copyright Act
 * (paragraph 69a UrhG). All rights are reserved. Making copies,
 * duplicating, modifying, using or distributing this computer program
 * in any form, without prior written consent of Neofonie, is
 * prohibited. Violation of copyright is punishable under the
 * German Copyright Act (paragraph 106 UrhG). Removing this copyright
 * statement is also a violation.
 *
 * author: mathias kotowski
 *
 * @usage
 *
 *      <!-- simple -->
 *      <div    class="jsc"
 *              data-jsc-name="MyComponent [, MyComponent2]">
 *           ...
 *      </div>
 *
 *      <!-- advanced -->
 *      <div    class="jsc"
 *              data-jsc-name="my.namespace:MyComponent [, my.namespace:MyComponent2]"
 *              data-jsc-bundle="MyBundle [, MyBundle]">
 *           ...
 *      </div>
 *
 *      <!-- more advanced -->
 *      <div    class="jsc"
 *              data-jsc-name="my.namespace:MyComponent [, my.namespace:MyComponent2]"
 *              data-jsc-bundle="my.namespace:MyBundle [, my.namespace:MyBundle]">
 *           ...
 *      </div>
 *
 * more under: https://confluence.neofonie.de/display/KB/Frontend%3A+JavaScript-Components
 */
define(
    ["jquery",
        "underscore",
        "core/core-const",
        "core/core-notification-observer",
        "core/core-lazy-register"],
    function ($, _, coreConst, notificationObserver, lazyInitialize) {
        var registeredComponents = [],
            appFacade = {},
            componentCounter = 0,
            _onLoading = false,
            _onBeforeRegisterFn,
            _requireBundlesFn,
            _requireComponentsFn,
            _loadComponentsFn,
            _loadAjaxJSCWatcher,
            _createRequirePathsForComponentFn,
            _createRequirePathsForBundleFn,
            _createRequirePathsFn;

        /** PRIVATE FUNCTIONS **/
        /**
         * Require component-bundles and components for known jsc-jquery-objects.
         * @param bundleList
         * @param requireList {Array} requireList List with PATHs to require.
         * @param requireMap {Object} requireMap Keys are require-paths. Values are arrays with jQuery-objects.
         * @return void
         * @private
         */
        _requireBundlesFn = function (bundleList, requireList, requireMap) {
            if (bundleList.length > 0) {
                require(bundleList, function () {
                    _requireComponentsFn(requireList, requireMap);
                });
            } else {
                _requireComponentsFn(requireList, requireMap);
            }
        };

        /**
         * Require jsc-code for known jsc-jquery-objects.
         * @param requireList {Array} requireList List with PATHs to require.
         * @param requireMap {Object} requireMap Keys are require-paths. Values are arrays with jQuery-objects.
         * @return void
         * @private
         */
        _requireComponentsFn = function (requireList, requireMap) {
            require(requireList, function () {
                var i,
                    len,
                    i2,
                    len2,
                    componentList,
                    component,
                    jComponent,
                    componentsRegistred = [];

                // iterate through components list and call register function
                for (i = 0, len = requireList.length; i < len; i++) {
                    componentList = requireMap[requireList[i]];
                    for (i2 = 0, len2 = componentList.length; i2 < len2; i2 += 1) {
                        jComponent = componentList[i2];
                        if (_.isObject(jComponent) && _.isFunction(arguments[i])) {
                            // this adds $el to the component
                            component = new arguments[i]({el: jComponent}); // compatible to backbone-view
                            if (_.isObject(component[coreConst.COMPONENT_ELEMENT_NAME]) !== true) {
                                component[coreConst.COMPONENT_ELEMENT_NAME] = jComponent;
                            }
                            componentCounter += 1;
                            component.jscId = coreConst.COMPONENT_CLASS + "-" + componentCounter;
                            if (_.isUndefined(jComponent.attr(coreConst.COMPONENT_DATA_ID)) === true) {
                                jComponent.attr(coreConst.COMPONENT_DATA_ID, component.jscId);
                            } else {
                                jComponent.attr(coreConst.COMPONENT_DATA_ID,
                                    jComponent.attr(coreConst.COMPONENT_DATA_ID) + "," + component.jscId);
                            }
                            registeredComponents.push(component);
                            component.app = appFacade;
                            notificationObserver.registerComponent(component);
                            lazyInitialize.registerComponent(component);
                            // add something to all the jsc's
                            if (_.isFunction(_onBeforeRegisterFn)) {
                                _onBeforeRegisterFn(component);
                            }
                            if (_.isFunction(component.onRegister)) {
                                component.onRegister();
                                componentsRegistred.push(component);
                            }
                        }
                    }
                }

                // iterate through components list and call onRegisterFinish function
                // this is usefull, if a component wants to use another component and to ensure onRegister is already
                // called.
                for (i = 0, len = componentsRegistred.length; i < len; i++) {
                    component = componentsRegistred[i];
                    //console.log("call register() on component ", component );
                    if (_.isFunction(component.onRegisterFinish)) {
                        component.onRegisterFinish();
                    }
                }

                _onLoading = false;
            });
        };

        /**
         * Detect js-components in DOM and require jsc-code.
         * @param {jQuery} jParent Optional. Root-note for detect components.
         * @return void
         * @private
         */
        _loadComponentsFn = function (jParent) {
            if (_onLoading) {
                //console.log("############## too many loads at the same time");
                return 0;
            }

            var jComponents,
                i,
                len,
                k,
                lenScriptPerElement,
                lenBundlePerElement,
                jComponent,
                bundleNameStr,
                bundleNamesList,
                bundleRequirePathList,
                bundlePath,
                componentNamesStr,
                componentNamesList,
                componentRequirePathList,
                componentPath,
                bundleList = [],
                requireList = [],
                requireMap = {};

            _onLoading = true;

            if (_.isObject(jParent) && (jParent instanceof $)) {
                jComponents = jParent.find("." + coreConst.COMPONENT_CLASS);
            } else {
                jComponents = $("." + coreConst.COMPONENT_CLASS);
            }

            for (i = 0, len = jComponents.length; i < len; i += 1) {
                jComponent = $(jComponents[i]);

                if (_.isUndefined(jComponent.attr(coreConst.COMPONENT_DATA_ID)) === false) {
                    throw new Error("The attribute \"" + coreConst.COMPONENT_DATA_ID_ATTR + "\" is reserved.");
                }

                // detect bundles
                bundleNameStr = jComponent.attr(coreConst.BUNDLE_DATA_NAME);
                if (_.isString(bundleNameStr) === true && bundleNameStr.length > 0) {
                    bundleNamesList = bundleNameStr.replace(/,/g, " ").split(" ");
                    bundleRequirePathList = _createRequirePathsForBundleFn(bundleNamesList);

                    for (k = 0, lenBundlePerElement = bundleRequirePathList.length; k < lenBundlePerElement; k++) {
                        bundlePath = bundleRequirePathList[k];
                        if (bundleList.indexOf(bundlePath) === -1) {
                            bundleList.push(bundlePath);
                        }
                    }
                }

                // detect components
                componentNamesStr = jComponent.attr(coreConst.COMPONENT_DATA_NAME);
                if (_.isString(componentNamesStr) === true && componentNamesStr.length > 0) {

                    componentNamesList = componentNamesStr.replace(/,/g, " ").split(" ");
                    componentRequirePathList = _createRequirePathsForComponentFn(componentNamesList);

                    for (k = 0, lenScriptPerElement = componentRequirePathList.length; k < lenScriptPerElement; k++) {
                        componentPath = componentRequirePathList[k];

                        if (requireList.indexOf(componentPath) === -1) {
                            requireList.push(componentPath);
                        }

                        if (_.isArray(requireMap[componentPath]) === true) {
                            requireMap[componentPath].push(jComponent);
                        } else {
                            requireMap[componentPath] = [jComponent];
                        }
                    }

                    jComponent.removeClass(coreConst.COMPONENT_CLASS);
                    jComponent.addClass(coreConst.COMPONENT_CLASS_INITIALIZED);
                }
            }

            _requireBundlesFn(bundleList, requireList, requireMap);
        };

        /**
         * detect ajax calls and after every check up all jsc they are not initalized
         * @private
         */
        _loadAjaxJSCWatcher = function () {
            var proxied = window.XMLHttpRequest.prototype.send,
                timeout = null;

            // proxies all ajax calls
            window.XMLHttpRequest.prototype.send = function () {
                var pointer = this,
                    intervalId = window.setInterval(function () {
                        if (pointer.readyState !== 4) {
                            return;
                        }
                        clearInterval(intervalId);
                        clearTimeout(timeout);
                        timeout = window.setTimeout(function () {
                            var length = _loadComponentsFn();
                            if (length > 0) {
                                appFacade.sendNotification();
                            }
                        }, 100);
                    }, 1);
                return proxied.apply(this, [].slice.call(arguments));
            };
            // call directly from fast ajax calls
            window.ajaxRequestJSCinit = function () {
                _onLoading = false;
            };
        };

        /**
         * Convert component-names (and namespaces) to requireJS-paths
         * @param componentNameList {Array} raw component-names with namespaces (my.namespace:name)
         * @returns {Array} list of paths for requireJS
         * @private
         */
        _createRequirePathsForComponentFn = function (componentNameList) {
            return _createRequirePathsFn(componentNameList, {
                path: coreConst.COMPONENT_PATH,
                postfix: coreConst.COMPONENT_FILE_POSTFIX,
                forceNamespace: true
            });
        };

        /**
         * Convert bundle-names (and namespaces) to requireJS-paths
         * @param bundleNameList {Array} raw component-names with namespaces (my.namespace:name)
         * @returns {Array} list of paths for requireJS
         * @private
         */
        _createRequirePathsForBundleFn = function (bundleNameList) {
            return _createRequirePathsFn(bundleNameList, {
                path: coreConst.BUNDLE_PATH,
                postfix: coreConst.BUNDLE_FILE_POSTFIX,
                forceNamespace: false
            });
        };

        /**
         * Convert component-names or bundle-names to requireJS-path
         * @param componentNameList {Array} raw component/bundle-names with namespaces (my.namespace:name)
         * @param options {Object}
         *             - path: {String}
         *             - postfix: {String}
         *             - forceNamespace {Boolean}
         * @return {Array} list of paths for requireJS
         * @private
         */
        _createRequirePathsFn = function (componentNameList, options) {
            var i,
                len,
                componentFullName,
                componentFullNameSplit,
                componentName,
                componentNamespace,
                componentFullPath,
                requirePathList = [],
                componentNameReplaceFn = function (match, pos) {
                    if (pos === 0) {
                        return match.toLowerCase();
                    }
                    return "-" + match.toLowerCase();
                };

            for (i = 0, len = componentNameList.length; i < len; i++) {
                componentFullName = componentNameList[i];
                componentFullName = componentFullName.trim();

                if (componentFullName.length === 0) {
                    continue;
                }

                if (componentFullName.indexOf(":") > -1) {
                    componentFullNameSplit = componentFullName.split(":");
                    if (componentFullNameSplit.length !== 2) {
                        throw new Error("Invalid component name \"" + componentFullName + "\"");
                    }
                    componentNamespace = componentFullNameSplit[0];
                    componentName = componentFullNameSplit[1];
                } else if (options.forceNamespace === true) {
                    componentNamespace = componentFullName;
                    componentName = componentFullName;
                } else {
                    componentNamespace = "";
                    componentName = componentFullName;
                }

                if (coreConst.USE_JSC_KEBAP_STYLE) {
                    componentName = componentName.replace(/[A-Z]/g, componentNameReplaceFn);
                }
                componentName += options.postfix;

                if (coreConst.USE_JSC_KEBAP_STYLE) {
                    componentNamespace = componentNamespace.toLowerCase();
                }
                componentNamespace = componentNamespace.replace(/\./g, "/");
                if (componentNamespace.length > 0) {
                    componentNamespace = componentNamespace + "/";
                }

                componentFullPath = options.path + componentNamespace + componentName;

                if (requirePathList.indexOf(componentFullPath) === -1) {
                    requirePathList.push(componentFullPath);
                }
            }
            return requirePathList;
        };

        /** APP FACADE **/
        /**
         * Send notification to observers.
         * @param notificationName
         * @param notificationData
         * @return void
         */
        appFacade.sendNotification = function (notificationName, notificationData) {
            notificationObserver.sendNotification(notificationName, notificationData);
        };

        /**
         * Unregister registered component.
         * @param component
         * @return void
         */
        appFacade.unregisterComponent = function (component) {
            if (_.isObject(component) === false) {
                return;
            }

            var componentIndex = registeredComponents.indexOf(component);
            if (componentIndex > -1) {
                registeredComponents.splice(componentIndex, 1);
            }

            notificationObserver.unregisterComponent(component);
            lazyInitialize.unregisterComponent(component);

            if (_.isFunction(component.onUnregister) === true) {
                component.onUnregister();
            }
        };

        /**
         * Detect js-components in DOM and require jsc-code.
         * @param {jQuery} jParent Optional. Root-note for detect components.
         * @return void
         */
        appFacade.loadComponents = function (jParent) {
            _loadComponentsFn(jParent);
        };

        /**
         * Get the used css-class for detecting components in DOM
         * @param initialized {Boolean}
         * @returns {*}
         */
        appFacade.getComponentCssClass = function (initialized) {
            if (initialized === true) {
                return coreConst.COMPONENT_CLASS_INITIALIZED;
            }
            return coreConst.COMPONENT_CLASS;
        };

        /**
         * Get JSC by ID
         * @param jscId ID of the component to retrieve
         * @return component
         */
        appFacade.getJSC = function (jscId) {
            var grepResults = $.grep(registeredComponents, function (e) {
                return e.jscId === jscId;
            });

            if (grepResults.length > 0) {
                return grepResults[0];
            }

            return null;
        };

        /** PUBLIC FUNCTIONS **/
        return {
            /**
             * Initialize core.
             * @return void
             */
            startUp: function () {
                _loadComponentsFn();
            },

            /**
             * Initialize jsc's comming through ajax calls
             *
             * @return void
             */
            startUpAjaxJSCWatcher: function () {
                _loadAjaxJSCWatcher();
            },

            /**
             * Return the app-facade object
             * @return {Object} app-facade
             */
            getAppFacade: function () {
                return appFacade;
            },

            beforeOnRegister: function (fn) {
                _onBeforeRegisterFn = fn;
            },

            bindAppToWindow: function () {
                window.app = appFacade;
            }
        };
    });