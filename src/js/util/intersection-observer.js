/*jslint white:true*/
/*global IntersectionObserver */

/**
 * IntersectionObserver Proxy
 *
 * Author: Willy Woitas
 *
 * This Proxy allows to listen to from a native IntersectionObserver.
 *
 * polyfill: https://github.com/WICG/intersectionobserver
 * polyfill: https://cdn.polyfill.io/v2/polyfill.js?features=IntersectionObserver&ua=ie/11.0.0
 *
 * docs: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * docs: https://wicg.github.io/IntersectionObserver/
 *
 * tutorial: https://github.com/matuzo/IntersectionObserver-Examples/blob/master/threshold.html
 *
 * zwei kleine Fallstricke:
 * 1. wenn man auf die changes hört, nimmt man meistens change.isIntersecting -
 * das wird aber wiederum von den meisten Polyfills und von Edge nich implementiert,
 * obwohl es cooler als Intersectionratio >0 ist (die verhält sich manchmal nämlich weird:
 * https://github.com/WICG/IntersectionObserver/issues/211#issuecomment-309144669)
 *
 * 2. rootMargin funzt nur, wenn du ein DOM-Element als root übergibst.
 * Wenn du den default-root, also den Viewport nimmst, failed die Margin silently
 */
define(
    ["jquery", "underscore"],
    function ($, _) {
        var canObserve = window.hasOwnProperty("IntersectionObserver"),
            observerIsReady = $.Deferred(),
            observerIsReadyPromise = observerIsReady.promise();

        if (canObserve) {
            observerIsReady.resolve();
        } else {
            require(["vendor_custom/polyfill/intersection-observer"],
                function () {
                    observerIsReady.resolve();
                });
        }

        /**
         * Instanciate Observer and return reference
         * @param callback_ Reference to callback function (should be bound in and to origin)
         * @param config_ Configuration Object for IntersectionObserver
         * @returns IntersectionObserver
         */
        function _getObserver (callback_, config_) {
            return new IntersectionObserver(callback_, config_);
        }

        /**
         * Set Config for IntersectionObserver and pass it and function args to _observeChange
         * @param $element $-Object to be observed
         * @param callback_ Reference to callback function (should be bound in and to origin)
         */
        function _observeElement ($element_, config_, callback_) {
            // no element or callback, do nothing!
            if (!$element_ || $element_.length === 0 || !_.isFunction(callback_)) {
                return false;
            }

            var threshold = $element_.data("lazy-threshold") || 0,
                config = _.extend({
                    threshold: threshold,
                    // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
                    rootMargin: "300px"
                }, config_),
                observer;

            // if api or polyfill ready
            observerIsReadyPromise.then(function () {
                // get intersection observer
                observer = _getObserver(function (entries) {
                    // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
                    entries.forEach(function(entry) {
                        // modern browser use "entry.isIntersecting"
                        // ie edge can only "entry.intersectionRatio > 0"
                        if (entry.isIntersecting || entry.intersectionRatio > 0) {
                            callback_();
                        }
                    });
                }, config);
                // observe the element
                observer.observe($element_[0]);
                // add observer for unregister
                $element_.intersectionObserver = observer;
            });
        }

        /**
         * Set Config for IntersectionObserver and pass it and function args to _observeChange
         * @param $element $-Object to be observed
         */
        function _unObserveElement ($element) {
            // unobserve and garbage collection
            if ($element.hasOwnProperty("intersectionObserver")) {
                $element.intersectionObserver.unobserve($element[0]);
                $element.intersectionObserver.disconnect();
                $element.intersectionObserver = null;
                delete $element.intersectionObserver;
            }
        }

        /**
         * Disconnect IntersectionObserver. Should be called from JSC.onUnregister()
         * @returns public functions
         */
        return {
            canObserve: canObserve,
            observeElement: function ($el_, config_, callback_) {
                _observeElement($el_, config_, callback_);
            },
            unObserveElement: function ($el_, callback_) {
                _unObserveElement($el_, callback_);
            }
        };
    });
