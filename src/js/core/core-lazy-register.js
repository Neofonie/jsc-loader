/*jslint white:true*/
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
 */

define(
    ["jquery",
        "underscore",
        "core/core-const",
        "util/intersection-observer"],
    function ($, _, coreConst, IntersectionObserverProxy) {
        var registerComponentFn,
            unregisterComponentFn,
            isVisibleForHumanFn;

        /** PRIVATE FUNCTIONS **/
        /**
         * check if the component is really visible
         * @param $el
         * @returns {boolean}
         */
        isVisibleForHumanFn = function ($el) {
            return !!($el[0].offsetWidth || $el[0].offsetHeight || $el[0].getClientRects().length);
        };
        /**
         * observe the element
         * @param component
         */
        registerComponentFn = function (component) {
            var hasMethod = _.isObject(component[coreConst.COMPONENT_ELEMENT_NAME]) === true
                && _.isFunction(component.onLazyRegister);

            if (hasMethod) {
                // onLazyRegister is called when it is visible, it depends on 'component.lazyRegisterConfig',
                // which 'rootMargin' or 'threshold' is setted
                IntersectionObserverProxy.observeElement(component.$el,
                    component.lazyRegisterConfig,
                    function () {
                        if (isVisibleForHumanFn(component.$el)) {
                            component.$el.addClass("jsc-lazy-initialized");
                            component.onLazyRegister();
                            IntersectionObserverProxy.unObserveElement(component.$el);
                        }
                    });
            }
        };
        /**
         * unobserve the element
         * @param component
         */
        unregisterComponentFn = function (component) {
            IntersectionObserverProxy.unObserveElement(component.$el);
        };

        /** PUBLIC FUNCTIONS **/
        return {
            /**
             * Register a component.
             * @param component
             */
            registerComponent: function (component) {
                registerComponentFn(component);
            },

            /**
             * Unregister a component.
             * @param component
             */
            unregisterComponent: function (component) {
                unregisterComponentFn(component);
            }
        };
    });