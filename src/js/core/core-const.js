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
    [],
    function () {
        return {
            COMPONENT_CLASS: "jsc",
            COMPONENT_CLASS_INITIALIZED: "jsc-initialized",
            COMPONENT_DATA_ID: "data-jsc-intern-id",

            COMPONENT_PATH: "components/",
            COMPONENT_DATA_NAME: "data-jsc-name",
            COMPONENT_FILE_POSTFIX: ".jsc",

            COMPONENT_ELEMENT_NAME: "$el",
            USE_JSC_KEBAP_STYLE: false,

            BUNDLE_PATH: "bundles/",
            BUNDLE_DATA_NAME: "data-jsc-bundle",
            BUNDLE_FILE_POSTFIX: ".bundle",

            SCROLL_EVENT: "scroll.coreLazyInitialize"
        };
    });
