/*jslint maxlen: 250 */
define(
    [],
    function () {

        var _jsLinWeirdConditionTrue = true,
            _unknown = "unknown",
            _getUserAgent = function () {
                var nAgt = "";

                // ODOT: iOS8 Bug: Deprecated attempt to access property "userAgent" on a non-Navigator object.
                // http://stackoverflow.com/questions/24784541/cordova-2-9-x-ios-8-useragent-bug
                // https://github.com/apache/cordova-js/blob/26e3e49e49b2fb61ca836572af85c7a776ea9f1c/src/common/init.js#L46-L65

                nAgt =
                    ((window.navigator.userAgent || window.navigator.vendor || window.opera).toString()).toLowerCase();

                return nAgt;
            },
            _isDesktop = function (whoIs) {
                function multilineRegExp(regs, options) {
                    return new RegExp(regs.map(
                        function (reg) {
                            return reg.source;
                        }
                    ).join(''), options);
                }

                // self detection
                var userAgent = _getUserAgent(),
                    checkOne = userAgent.match(multilineRegExp([
                        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal/,
                        /|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo/,
                        /|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker/,
                        /|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/g
                    ])),
                    checkTwo = userAgent.substr(0, 4).match(multilineRegExp([
                        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)/,
                        /|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )/,
                        /|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa/,
                        /|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica/,
                        /|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)/,
                        /|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-/,
                        /(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i/,
                        /-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)/,
                        /a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg/,
                        /( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)/,
                        /|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )/,
                        /|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)/,
                        /|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))/,
                        /|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)/,
                        /|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)/,
                        /|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)/,
                        /|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel/,
                        /(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi/,
                        /(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )/,
                        /|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/g
                    ]));

                if (checkOne !== null || checkTwo !== null) {
                    return false;
                }
                return true;
            },

            _isMobile = function (where) {
                return !_isDesktop(where + " isMobile");
            },

            _isAndroid = function () {
                return _getUserAgent().match(/android/) !== null;
            },

            _isiOS = function () {
                return _getUserAgent().match(/ip(ad|hone|od)/g) !== null;
            },

            _isiPad = function () {
                return _getUserAgent().match(/ipad/g) !== null;
            },

            _isiPhone = function () {
                return _getUserAgent().match(/ip(hone|od)/g) !== null;
            },

            _isMac = function () {
                return _getUserAgent().match(/mac/g) !== null;
            },

            _isWin = function () {
                return _getUserAgent().match(/win/g) !== null;
            },

            _isWin7 = function () {
                return _getUserAgent().match(/windows nt 6\.1/g) !== null;
            },

            _isWin8 = function () {
                return _getUserAgent().match(/windows nt 6\.3/g) !== null;
            },

            _isWin10 = function () {
                return _getUserAgent().match(/windows nt 10\.0/g) !== null;
            },

            _isWinPhone = function () {
                return _getUserAgent().match(/iemobile/g) !== null;
            },

            _isIE = function () {
                var msie = "msie ";
                // _getUserAgent().match return matching values
                // !!_getUserAgent().match converts result to boolean
                return (
                    _getUserAgent().indexOf(msie) >= 0
                    || !!_getUserAgent().match(/trident.*rv:11\./)
                    || !!_getUserAgent().match(/edge\//)
                );
            },

            _isTouch = function () {
                return _getUserAgent().match(/touch/g) !== null;
            },

            _isUnix = function () {
                return _getUserAgent().match(/x11/g) !== null;
            },

            _getMobileOS = function () {
                switch (_jsLinWeirdConditionTrue) {
                    case _isAndroid():
                        return "and";
                    case _isWinPhone():
                        return "win";
                    case _isiOS():
                        return "ios";
                    default:
                        return _unknown;
                }
            },

            _getCurrentDevice = function () {
                switch (_jsLinWeirdConditionTrue) {
                    case _isWin() && !_isWin8() && !_isWinPhone() && !_isWin10():
                        return "win";
                    case _isWin8():
                        return "win8";
                    case _isWin10():
                        return "win10";
                    case _isWinPhone():
                        return "wp";
                    case _isMac() && !_isiOS():
                        return "mac";
                    case _isiOS() && !_isiPad():
                        return "iphone";
                    case _isiOS() && _isiPad():
                        return "ipad";
                    case _isiOS():
                        return "ios";
                    case _isAndroid():
                        return "android";
                    case _isUnix():
                        return "unix";
                    default:
                        return _unknown;
                }
            },

            _getOSAndBrowser = function () {
                var nAgt = _getUserAgent(),
                    OSName = _unknown + " OS",
                    browserName = _unknown + " Browser",
                    nameOffset,
                    verOffset,
                    detecable = {
                        os: {
                            win: "Windows",
                            win7: "Windows 7",
                            win8: "Windows 8",
                            win10: "Windows 10",
                            sym: "Symbian",
                            ios: "iOS",
                            mac: "Mac OS X",
                            and: "Android",
                            uni: "Unix",
                            lin: "Linux"
                        },
                        browser: {
                            opr: "Opera",
                            iex: "Internet Explorer",
                            iem: "IEMobile",
                            nab: "Native Browser",
                            chr: "Google Chrome",
                            saf: "Safari",
                            mff: "Mozilla Firefox",
                            app: "App"
                        }
                    };

                function has(needle) {
                    return nAgt.indexOf(needle) !== -1;
                }

                // os detection
                switch (_jsLinWeirdConditionTrue) {
                    case _isWin7():
                        OSName = detecable.os.win7;
                        break;
                    case _isWin8():
                        OSName = detecable.os.win8;
                        break;
                    case _isWin10():
                        OSName = detecable.os.win10;
                        break;
                    case _isWin():
                        OSName = detecable.os.win;
                        break;
                    case has("symbianos"):
                        OSName = detecable.os.sym;
                        break;
                    case _isiOS() && has("like mac os x"):
                        OSName = detecable.os.ios;
                        break;
                    case _isMac():
                        OSName = detecable.os.mac;
                        break;
                    case _isAndroid():
                        OSName = detecable.os.and;
                        break;
                    case _isUnix():
                        OSName = detecable.os.uni;
                        break;
                    case has("linux"):
                        OSName = detecable.os.lin;
                        break;
                }

                // browser detection
                switch (_jsLinWeirdConditionTrue) {
                    case (has("opera") || has("opr")):
                        browserName = detecable.browser.opr;
                        break;
                    case has("iemobile"):
                        browserName = detecable.browser.iem;
                        break;
                    case _isIE():
                        browserName = detecable.browser.iex;
                        break;
                    case (has("linux; u; android")):
                        browserName = detecable.browser.nab;
                        break;
                    case (has("chrome")):
                        browserName = detecable.browser.chr;
                        break;
                    case (has("safari") || has("like mac os x")):
                        browserName = detecable.browser.saf;
                        break;
                    case (has("firefox")):
                        browserName = detecable.browser.mff;
                        break;
                    case ((nAgt.lastIndexOf(" ") + 1) < nAgt.lastIndexOf("/")):
                        nameOffset = nAgt.lastIndexOf(" ") + 1;
                        verOffset = nAgt.lastIndexOf("/");
                        browserName = nAgt.substring(nameOffset, verOffset);
                        if (browserName.toLowerCase() === browserName.toUpperCase()) {
                            browserName = _unknown + " Browser";
                        }
                        break;
                }

                return {
                    givenBrowserUserAgent: nAgt,
                    os: OSName,
                    browser: browserName
                };
            };

        return {
            isDesktop: _isDesktop,
            isMobile: _isMobile,

            isAndroid: _isAndroid,
            isiOS: _isiOS,
            isiPad: _isiPad,
            isiPhone: _isiPhone,
            isMac: _isMac,
            isWin: _isWin,
            isWin7: _isWin7,
            isWin8: _isWin8,
            isWin10: _isWin10,
            isWinPhone: _isWinPhone,

            isIE: _isIE,
            isTouch: _isTouch,

            getMobileOS: _getMobileOS,
            getCurrentDevice: _getCurrentDevice,
            getOSAndBrowser: _getOSAndBrowser
        };
    });