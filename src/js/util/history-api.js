/*jslint white:true*/
/**
 * Author: Willy Woitas
 *
 * Good pages for some basic knowledge:
 * http://diveintohtml5.info/history.html
 * https://developer.mozilla.org/de/docs/Web/Guide/DOM/Manipulating_the_browser_history
 * http://html5.gingerhost.com/
 */
define(
    ["jquery", "underscore", "util/string", "util/logger", "util/device-detect",
        "core/core-notification-observer", "consts/notification-const"],
    function ($, _, StringUtil, Logger, DeviceDetect,
              NotificationObserver, NotificationConst) {
        var isApiAvailable = window.history !== undefined,
            questionMark = "?",
            hashMark = "#",
            wcmParam = "wcmmode=disabled",
            HistoryApi = {
                /**
                 * href: "http://localhost:4502/content/ch/de/fotobuch/deluxe.html?wcmmode=disabled#anchor123"
                 * @returns {string}
                 */
                getWindowLocationHref: function () {
                    return window.location.href;
                },
                /**
                 * search: "?wcmmode=disabled"
                 * @returns {string}
                 */
                getWindowLocationSearch: function () {
                    return window.location.search;
                },
                /**
                 * origin: "http://localhost:4502"
                 * @returns {string}
                 */
                getWindowLocationOrigin: function () {
                    return window.location.origin;
                },
                /**
                 * hash: "#anchor123"
                 * @param _withoutRue_
                 * @returns {string}
                 */
                getWindowLocationHash: function (_withoutRue_) {
                    var hash = window.location.hash;
                    if (_withoutRue_) {
                        hash = hash.replace(hashMark, "");
                    }
                    return hash;
                },
                /**
                 * get current browser uri
                 * pathname: "/content/ch/de/fotobuch/deluxe.html"
                 * @returns {string}
                 */
                getWindowLocationPathName: function () {
                    return window.location.pathname;
                },
                /**
                 * Get current state from history
                 * @returns {*}
                 */
                getCurrentState: function () {
                    if (isApiAvailable) {
                        return window.history.state;
                    }
                    return {};
                },

                setWindowLocationHref: function (href) {
                    window.location.href = href;
                },

                setWindowLocationHash: function (hash) {
                    window.location.hash = hash;
                },

                setWindowHistoryPushState: function (stateObject, title, href) {
                    this.log("setWindowHistoryPushState");
                    // fix the url destroy bug
                    if(DeviceDetect.isIE() && href === " ") {
                        href = "#";
                    }
                    window.history.pushState(stateObject, title, href);
                },

                setWindowHistoryReplaceState: function (stateObject, title, href) {
                    window.history.replaceState(stateObject, title, href);
                },

                openNewWindow: function (href, target, focus) {
                    var win = window.open(href, target);
                    if (focus) {
                        win.focus();
                    }
                },

                /**
                 * returned a given or the active url without .html
                 * @param _path_
                 * @returns {string}
                 */
                getPath: function (_path_) {
                    var path = this.removeParamsFromHref(_path_) || this.getWindowLocationPathName(),
                        clearPath = path.replace(".html", "").replace(wcmParam, "");

                    if (StringUtil.endsWith(clearPath, questionMark)) {
                        clearPath = clearPath.replace(questionMark, "");
                    }

                    clearPath = clearPath.replace(this.getWindowLocationOrigin(), "");

                    return clearPath;
                },
                /**
                 * change the url in the browser.
                 * example for an uri (root & domain not included)/photobook/deluxe.html
                 * @param href (string)
                 * @param _forceHref_ (boolean)
                 * @param _stateObject_ (object) state object that passed to all events
                 * @param _title_ (string)
                 * @param _doSilent_ (boolean) default false. If true replace state instead of push state
                 * @returns {boolean}
                 */
                goTo: function (href, _forceHref_, _stateObject_, _title_, _doSilent_) {
                    if (!href) {
                        return false;
                    }

                    this.log("goTo", href);

                    var leadingSlash,
                        regexp,
                        stateObject = _stateObject_ || "",
                        title = _title_ || "";
                    // push url to browser history
                    if (isApiAvailable) {
                        // only for sensitve href's
                        if (!_forceHref_) {
                            // clear absolute pathes, if the href starts with and the param forceHref isnt set
                            if (href.indexOf("http") === 0) {
                                regexp = new RegExp("^https?://.*?/");
                                href = href.replace(regexp, "/");
                            }
                            // check if leading slash exists
                            leadingSlash = href.indexOf("/");
                            if (leadingSlash !== 0) {
                                href = "/" + href;
                            }
                        }
                        // aem wcm parameter if the page has already wcmmode
                        if (this.hasEnvironmentWCMDisabled()) {
                            href = this.addWCMDisabledToHref(href, false);
                        }

                        // clear empty hash
                        if (StringUtil.endsWith(href, hashMark)) {
                            href = href.replace(hashMark, "");
                            // clear the url to get rid of old #params
                            if (href === "") {
                                href = " ";
                            }
                        }

                        this.log("href", href);

                        // update the url or replace the url without history update
                        if (!_doSilent_) {
                            // means url update with history entry
                            this.setWindowHistoryPushState(stateObject, title, href);
                        } else {
                            this.log("doSilent", href);
                            // means silent url update without history entry
                            this.setWindowHistoryReplaceState(stateObject, title, href);
                        }
                        // let all jcs's know that their was a change
                        NotificationObserver.sendNotification(NotificationConst.BROWSER_NEW_URL, href, stateObject);
                    } else {
                        // fallback if browser api isnt available
                        this.setWindowLocationHref(href);
                    }
                    return true;
                },
                /**
                 * Replace the current state.
                 * @param href
                 * @param forceHref
                 * @param stateObj
                 * @param title
                 */
                goToSilent: function (href, forceHref, stateObj, title) {
                    this.goTo(href, forceHref, stateObj, title, true);
                },
                /**
                 * http(s)://www.url.tl#anchor
                 * @param anchorName
                 */
                addAnchor: function (anchorName) {
                    if (anchorName) {
                        this.goTo(hashMark + anchorName);
                    } else {
                        this.goTo(hashMark);
                    }
                },
                /**
                 * update url silently because we don't want to jump to the anchor
                 * @param anchorName
                 */
                addAnchorSilent: function (anchorName) {
                    this.log("addAnchorSilent()", anchorName);
                    if (anchorName) {
                        this.goTo(hashMark + anchorName, true);
                    } else {
                        this.goTo(hashMark, true);
                    }
                },

                addParam: function (paramName, paramValue) {
                    var href = this.getWindowLocationHref(),
                        newHref = this.handleParamInHref(href, paramName, paramValue);
                    this.goTo(newHref);
                },

                getParam: function (paramName, _href_) {
                    var href = _href_ || this.getWindowLocationHref(),
                        reg = new RegExp('[?&]' + paramName + '=([^&#]*)', 'i'),
                        string = reg.exec(href);
                    return string ? string[1] : null;
                },

                keepParam: function (paramName, href) {
                    if (this.hasEnvironmentParam(paramName)) {
                        var paramValue = HistoryApi.getParam(paramName);
                        href = this.handleParamInHref(href, paramName, paramValue, false, true);
                    }
                    return href;
                },

                addOnlyOneParam: function(paramName, url, encodeAddition){
                    if (this.hasEnvironmentParam(paramName)) {
                        var addition = questionMark + paramName + "=" + this.getParam(paramName);
                        url += encodeAddition ? encodeURIComponent(addition) : addition;
                    }
                    return url;
                },

                removeParam: function (paramName, _doSilent_) {
                    var href = this.getWindowLocationHref(),
                        newHref = this.handleParamInHref(href, paramName, null, true);
                    this.goTo(newHref, null, null, null, _doSilent_);
                },
                /**
                 * get a clear path without hashbang or get parameters
                 **/
                removeParamsFromHref: function (href) {
                    var hrefPartsQuestionMark = href ? href.split(questionMark) : [],
                        hrefPartsHash;

                    if (hrefPartsQuestionMark.length > 1) {
                        href = hrefPartsQuestionMark[0];
                    }

                    hrefPartsHash = href ? href.split(hashMark) : [];

                    if (hrefPartsHash.length > 1) {
                        href = hrefPartsHash[0];
                    }

                    return href;
                },

                hasParam: function (href, paramName) {
                    var hasParam = _.isString(href) && href.indexOf(paramName) >= 0 ? true : false;
                    return hasParam;
                },

                hasEnvironmentWCMDisabled: function () {
                    return this.hasHrefWCMDisabled(this.getWindowLocationHref());
                },

                hasHrefWCMDisabled: function (href) {
                    return this.hasParam(href, wcmParam);
                },

                hasEnvironmentParam: function (paramName) {
                    return this.hasParam(this.getWindowLocationHref(), paramName);
                },

                addWCMDisabledToHref: function (href, _removeOtherParams_) {
                    if (_.isString(href) && href !== ""
                        && !this.hasHrefWCMDisabled(href)
                        && !StringUtil.startsWith(href, hashMark)) {
                        var wcmParamSeperated = wcmParam.split("="),
                            removeParams = _removeOtherParams_ !== undefined ? _removeOtherParams_ : true;
                        return this.handleParamInHref(
                            href,
                            wcmParamSeperated[0],
                            wcmParamSeperated[1],
                            false,
                            removeParams
                        );
                    }
                    return href;
                },

                addWCMDisabledToAllLinks: function ($elements) {
                    if ($elements && this.hasEnvironmentWCMDisabled()) {
                        $elements.each(function () {
                            if (this.tagName.toLowerCase() === "a") {
                                $(this).attr("href", HistoryApi.addWCMDisabledToHref($(this).attr("href")));
                            }
                        });
                    }
                },
                /**
                 * Helper function to add or replace a specific url parameter
                 * @returns new Url
                 */
                handleParamInHref: function (_url_, _paramName_, _paramValue_, _removeParam_, _removeOtherParams_) {
                    var newHref = _url_,
                        hash,
                        clearParams,
                        otherParams = [];
                    // save existing hash
                    if (StringUtil.has(newHref, hashMark)) {
                        // get hash
                        hash = newHref.substring(newHref.indexOf(hashMark), newHref.length);
                        // clear href
                        newHref = newHref.replace(hash, "");
                    }
                    // has the url params
                    if (StringUtil.has(newHref, questionMark)) {
                        // get all params
                        clearParams = newHref.substring(newHref.indexOf(questionMark), newHref.length);
                        // remove ? and split by &
                        otherParams = clearParams.substring(1, clearParams.length).split("&");
                        // filter all other params
                        otherParams = otherParams.filter(function (param) {
                            return !StringUtil.startsWith(param, _paramName_);
                        });
                        // clear href
                        newHref = newHref.replace(clearParams, "");
                    }

                    // add other params at first
                    if (otherParams.length > 0 && !_removeOtherParams_) {
                        newHref += (!StringUtil.has(newHref, questionMark) ? questionMark : "&");
                        // add the other params
                        newHref += otherParams.join("&");
                    }
                    // add new param or remove it
                    if (!_removeParam_) {
                        // add ? or & at the end
                        newHref += (!StringUtil.has(newHref, questionMark) ? questionMark : "&");
                        // add param with new value
                        newHref += _paramName_ + "=" + encodeURIComponent(_paramValue_);
                    }
                    // add hash at the end
                    if (hash && hash !== hashMark) {
                        newHref += hash;
                    }
                    return newHref;
                }
            };

        // this event makes sure that the back/forward buttons work as well
        $(window).on("popstate", function () {
            NotificationObserver.sendNotification(
                NotificationConst.BROWSER_BACK_BUTTON,
                {
                    path: HistoryApi.getWindowLocationPathName(),
                    fullHref: HistoryApi.getWindowLocationHref()
                }
            );
        });

        Logger.init(HistoryApi, false, "HistoryApi");

        return HistoryApi;
    });