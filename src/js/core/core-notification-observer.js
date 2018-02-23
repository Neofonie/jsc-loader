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
    ["underscore"],
    function (_) {
        var observeMap = {},
            _detectNotificationInterestsFn;

        /** PRIVATE FUNCTIONS **/
        /**
         * Detect and clean-up notification-interests for the component
         *         * @param component
         * @return {Array}
         */
        _detectNotificationInterestsFn = function (component) {
            var notificationInterests;

            if (_.isFunction(component.listNotificationInterests) !== true) {
                return [];
            }

            notificationInterests = component.listNotificationInterests();

            if (_.isArray(notificationInterests) !== true) {
                return [];
            }

            return _.uniq(notificationInterests);
        };

        /** PUBLIC FUNCTIONS **/
        return {
            /**
             * Register a component.
             * @param component
             */
            registerComponent: function (component) {
                var notificationInterests,
                    notificationInterest,
                    i,
                    len;

                notificationInterests = _detectNotificationInterestsFn(component);

                for (i = 0, len = notificationInterests.length; i < len; i++) {
                    notificationInterest = notificationInterests[i];
                    if (_.isString(notificationInterest) === true) {
                        if (_.isArray(observeMap[notificationInterest]) === true) {
                            observeMap[notificationInterest].push(component);
                        } else {
                            observeMap[notificationInterest] = [component];
                        }
                    }
                }
            },

            /**
             * Unregister a component.
             * @param component
             */
            unregisterComponent: function (component) {
                var notificationInterests,
                    observerList,
                    i,
                    j,
                    len,
                    removeIndex;

                notificationInterests = _detectNotificationInterestsFn(component);

                for (i = 0, len = notificationInterests.length; i < len; i++) {
                    observerList = observeMap[notificationInterests[i]];
                    if (_.isArray(observerList) === true) {
                        j = observerList.length;
                        while (--j > -1) {
                            removeIndex = observerList.indexOf(component);
                            if (removeIndex > -1) {
                                observerList.splice(removeIndex, 1);
                            }
                        }
                    }
                }
            },

            /**
             * Send a notification to all interested observers
             * @param notificationName
             * @param notificationData
             */
            sendNotification: function (notificationName, notificationData) {
                var interestedComponents = observeMap[notificationName],
                    interestedComponent,
                    i,
                    len;

                if (_.isArray(interestedComponents) === true) {
                    for (i = 0, len = interestedComponents.length; i < len; i++) {
                        interestedComponent = interestedComponents[i];
                        if (_.isFunction(interestedComponent.handleNotification) === true) {
                            interestedComponent.handleNotification(notificationName, notificationData);
                        }
                    }
                }
            }
        };
    });