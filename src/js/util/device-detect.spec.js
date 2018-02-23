define(
    ["jquery", "util/device-detect", "util/unit"],
    function ($, DeviceDetection, UnitUtil) {
        describe("Util DeviceDetection", function () {
            var object

            beforeEach(function () {
                object = DeviceDetection
            })

            describe("has methods", function () {
                var methods = "isDesktop isMobile isAndroid isiOS isiPad isMac isWin isWin7 isWin8 isWin10 isWinPhone isIE isTouch getMobileOS getCurrentDevice getOSAndBrowser".split(" ")
                $.each(methods, function (index, method) {
                    it(method, function () {
                        expect(object[method]).toBeDefined()
                    })
                })
            })

            describe("getBrowserAndOS() with different useragents", function () {
                var differentBrowser = [
                    {
                        dv: "Willy Chrome Laptop",
                        ua: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36",
                        be: "Windows 7 / Google Chrome",
                        is: "isDesktop",
                        ty: "win"

                    },
                    {
                        dv: "Willy Firefox Laptop",
                        ua: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0",
                        be: "Windows 7 / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "win"
                    },
                    {
                        dv: "Reimer Chrome Laptop",
                        ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36",
                        be: "Unix / Google Chrome",
                        is: "isDesktop",
                        ty: "unix"
                    },
                    {
                        dv: "Reimer Firefox Laptop",
                        ua: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:31.0) Gecko/20100101 Firefox/31.0package...8362888 (line 5581)",
                        be: "Unix / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "unix"
                    },
                    {
                        dv: "Reimer SP App Chrome",
                        ua: "Mozilla/5.0 (Linux; U; Android 4.3.1; en-gb; One Build/JWR66V.H10) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 CyanogenMod/10.2.1/m7ul",
                        be: "Android / Native Browser",
                        is: "isMobile",
                        ty: "android"
                    },
                    {
                        dv: "Reimer SP Native Browser",
                        ua: "Mozilla/5.0 (Linux; U; Android 4.3.1; en-gb; One Build/JWR66V.H10) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 CyanogenMod/10.2.1/m7ul",
                        be: "Android / Native Browser",
                        is: "isMobile",
                        ty: "android"
                    },
                    {
                        dv: "Reimer SP Opera Browser",
                        ua: "Mozilla/5.0 (Linux; Android 4.3.1; One Build/JWR66V.H10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36 OPR/22.0.1485.78487",
                        be: "Android / Opera",
                        is: "isMobile",
                        ty: "android"
                    },
                    {
                        dv: "MacMini Chrome",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
                        be: "Mac OS X / Google Chrome",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "MacMini Firefox",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:30.0) Gecko/20100101 Firefox/30.0",
                        be: "Mac OS X / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "MacMini Safari",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4",
                        be: "Mac OS X / Safari",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "iPod #14",
                        ua: "Mozilla/5.0 (iPod touch; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53",
                        be: "iOS / Safari",
                        is: "isMobile",
                        ty: "iphone"
                    },
                    {
                        dv: "Samsung #1 Native Browser",
                        ua: "Mozilla/5.0 (Linux; U; Android 4.1.2; en-gb; GT-I9100 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
                        be: "Android / Native Browser",
                        is: "isMobile",
                        ty: "android"
                    },
                    {
                        dv: "Björn IE 11",
                        ua: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko",
                        be: "Windows 8 / Internet Explorer",
                        is: "isDesktop",
                        ty: "win8"
                    },
                    {
                        dv: "Nokia Lumia 925 WP8.1",
                        ua: "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 925) like gecko",
                        be: "Windows / IEMobile",
                        is: "isMobile",
                        ty: "wp"
                    },
                    {
                        dv: "Willy IE11",
                        ua: "mozilla/5.0 (windows nt 6.1; wow64; trident/7.0; slcc2; .net clr 2.0.50727; .net clr 3.5.30729; .net clr 3.0.30729; media center pc 6.0; .net4.0c; .net4.0e; rv:11.0) like gecko",
                        be: "Windows 7 / Internet Explorer",
                        is: "isDesktop",
                        ty: "win"
                    },
                    {
                        dv: "Willy Chrome Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36",
                        be: "Windows 7 / Google Chrome",
                        is: "isDesktop",
                        ty: "win"
                    },
                    {
                        dv: "Ender Safari Neofonie",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12",
                        be: "Mac OS X / Safari",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "Daniel Chrome Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36",
                        be: "Windows 8 / Google Chrome",
                        is: "isDesktop",
                        ty: "win8"
                    },
                    {
                        dv: "Mike Chrome Neofonie",
                        ua: "Chrome unter Linux(nerd) Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36",
                        be: "Unix / Google Chrome",
                        is: "isDesktop",
                        ty: "unix"
                    },
                    {
                        dv: "Peter Firefox Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",
                        be: "Windows 7 / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "win"
                    },
                    {
                        dv: "Tim Iphone Neofonie",
                        ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143",
                        be: "iOS / Safari",
                        is: "isMobile",
                        ty: "iphone"
                    },
                    {
                        dv: "Ender Chrome Neofonie",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36",
                        be: "Mac OS X / Google Chrome",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "Daniel WIN8 IE11 Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; Media Center PC 6.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; rv:11.0) like Gecko",
                        be: "Windows 8 / Internet Explorer",
                        is: "isDesktop",
                        ty: "win8"
                    },
                    {
                        dv: "Daniel WIN8 Firefox Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0",
                        be: "Windows 8 / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "win8"
                    },
                    {
                        dv: "Daniel Ipad Neofonie",
                        ua: "Ipad 8.1.3: Mozilla/5.0 (iPad; CPU OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/41.0.2272.56 Mobile/12B466 Safari/600.1.4 (000751)",
                        be: "iOS / Safari",
                        is: "isDesktop",
                        ty: "ipad"
                    },
                    {
                        dv: "Mike Firefox Neofonie",
                        ua: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0",
                        be: "Unix / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "unix"
                    },
                    {
                        dv: "Ender Firefox Neofonie",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0",
                        be: "Mac OS X / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "Daniel Win Lumia 640 Neofonie",
                        ua: "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; Microsoft; Lumia 640 LTE) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537",
                        be: "Windows / IEMobile",
                        is: "isMobile",
                        ty: "wp"
                    },
                    {
                        dv: "Surface Win8 Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 6.3: WIN64; x64 trident/7.0; touch; rv:11.0) like gecko",
                        be: "Windows 8 / Internet Explorer",
                        is: "isMobile",
                        ty: "win8"
                    },
                    {
                        dv: "Nexus 9 Neofonie",
                        ua: "mozilla/5.0 (linux; android 5.1.1; nexus 9 build/Imy47x) applewebkit/537.36 (khtml, like gecko) chrome/44.0.2403.133 safari/537.36",
                        be: "Android / Google Chrome",
                        is: "isDesktop",
                        ty: "android"
                    },
                    {
                        dv: "iPad mini Neofonie",
                        ua: "mozilla/5.0 (ipad; cpu os 8_3 like mac os x) applewebkit/600.1.4 (khtml, like gecko) version/8.0 mobile/12f69 safari/600.1.4",
                        be: "iOS / Safari",
                        is: "isDesktop",
                        ty: "ipad"
                    },
                    {
                        dv: "ender ie11",
                        ua: "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
                        be: "Windows 7 / Internet Explorer",
                        is: "isDesktop",
                        ty: "win"
                    },
                    {
                        dv: "win10 edge",
                        ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
                        be: "Windows 10 / Internet Explorer",
                        is: "isDesktop",
                        ty: "win10"
                    },
                    {
                        dv: "Windows 10 Neofonie",
                        ua: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
                        be: "Windows 10 / Google Chrome",
                        is: "isDesktop",
                        ty: "win10"
                    },
                    {
                        dv: "Christoph's Chrome auf Mac Neofonie",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
                        be: "Mac OS X / Google Chrome",
                        is: "isDesktop",
                        ty: "mac"
                    },
                    {
                        dv: "Christoph's Fleischman Firefox auf Mac",
                        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:51.0) Gecko/20100101 Firefox/51.0",
                        be: "Mac OS X / Mozilla Firefox",
                        is: "isDesktop",
                        ty: "mac"
                    }
                ]

                function createUserAgents() {
                    // create device its
                    differentBrowser.sort(function (a, b) {
                        var textA = a.be.toUpperCase(),
                            textB = b.be.toUpperCase()
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                    });
                    // write every useragent expect
                    differentBrowser.forEach(function (device) {
                        it(device.be + " | " + device.dv, function () {
                            UnitUtil.mock.userAgent(device.ua)

                            var detect = object.getOSAndBrowser(),
                                currentDevice = object.getCurrentDevice()
                            expect(detect.os + " / " + detect.browser).toBe(device.be)
                            expect(currentDevice).toBe(device.ty)
                        })
                    })
                }

                describe("getOSAndBrowser()", function () {
                    afterEach(function(){
                        UnitUtil.mock.resetUserAgent()
                    })

                    createUserAgents()
                })
            })
        })
    })
