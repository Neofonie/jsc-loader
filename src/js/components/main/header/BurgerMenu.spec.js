define(
    ["jquery", "util/unit", "components/main/header/BurgerMenu.jsc", "consts/notification-const"],
    function ($, UnitUtil, BurgerMenu, NotificationConst) {
        describe("JSC BurgerMenu", function () {
            var instance = null,
                style,
                originalTimeout

            UnitUtil.healthCheck(
                BurgerMenu,
                11,
                "\
                onRegister listNotificationInterests handleNotification \
                scrollTop toggleMenu handleToggleable openMenu closeMenu \
                onClickBurgerMenuButton onBackdropClick isMenuOpen \
            ")

            function createMenu(classNames) {
                return $('<nav ' + (classNames ? 'class="' + classNames + '"' : '') + '>menu</nav>')
            }

            function mockDisplayMode(mode) {
                removeDisplayMode()
                style = $('<style>body:before{content:"' + mode + '"}</style>').appendTo('head')
            }

            function removeDisplayMode() {
                if (style)
                    style.remove()
            }

            beforeEach(function () {
                instance = UnitUtil.createInstance(BurgerMenu)
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
            })

            afterEach(function () {
                removeDisplayMode()
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
            })

            describe("onRegister()", function () {
                it("default none mobile", function () {
                    // prepare classNames and check if they removed
                    instance.$el = createMenu(instance.CONST.CLASS_ANIMATION + " " + instance.CONST.CLASS_SHOW)
                        .append('<div class="' + instance.CONST.SELECTOR_BURGER_MENU_BTN + '" style="display:none">burgermenu</div>')

                    instance.onRegister()

                    // hasnt animation class
                    expect(instance.$el.hasClass(instance.CONST.CLASS_ANIMATION)).toBeFalsy()
                })

                xit("mobile case", function () {
                    mockDisplayMode("mobile")
                    // no class preparation nessesary
                    instance.$el = createMenu()
                        .append('<div class="' + instance.CONST.SELECTOR_BURGER_MENU_BTN + '">burgermenu</div>')

                    instance.$el.appendTo("body")

                    instance.onRegister()

                    // has animation class
                    expect(instance.$el.hasClass(instance.CONST.CLASS_ANIMATION)).toBeTruthy()
                    // hasnt show class
                    expect(instance.$el.hasClass(instance.CONST.CLASS_SHOW)).toBeFalsy()

                    // not before changes scope in backbone
                    spyOn(instance, "toggleMenu")

                    // click button and toggleMenu is called because it is visible
                    var $mainBtn = instance.$("." + instance.CONST.SELECTOR_BURGER_MENU_BTN)
                    $mainBtn.triggerHandler("click")
                    expect(instance.toggleMenu).toHaveBeenCalled()
                    // button invisible and toggle isnt called

                    instance.toggleMenu.calls.reset()

                    $mainBtn.hide()
                    $mainBtn.triggerHandler("click")
                    expect(instance.toggleMenu).not.toHaveBeenCalled()

                    // click backdrop but it isnt visible
                    instance.$el.triggerHandler("click")
                    expect(instance.toggleMenu).not.toHaveBeenCalledWith(true)
                    // menu is open and backdrop is visible
                    instance.$el.addClass(instance.CONST.CLASS_SHOW).triggerHandler("click")
                    expect(instance.toggleMenu).toHaveBeenCalledWith(true)

                    instance.$el.remove()
                })
            })

            describe("listNotificationInterests()", function () {
                it("default return object", function () {
                    expect(instance.listNotificationInterests()).toEqual([
                        NotificationConst.WINDOW_RESIZE,
                        NotificationConst.WINDOW_ORIENTATION_CHANGE,
                        NotificationConst.MENU_OPEN_SUBMENU,
                        NotificationConst.MENU_TOGGLE_BURGERMENU
                    ])
                })
            })

            describe("handleNotification()", function () {
                it("default return undefined", function () {
                    expect(instance.handleNotification()).toBe(undefined)
                })

                it("on resize bubble to handleToggleable", function () {
                    spyOn(instance, "handleToggleable")

                    instance.handleNotification()
                    expect(instance.handleToggleable).not.toHaveBeenCalled()

                    instance.handleNotification(NotificationConst.WINDOW_RESIZE)
                    expect(instance.handleToggleable).toHaveBeenCalled()
                })
            })

            describe("toggleMenu()", function () {
                it("default toggle on element", function (done) {
                    instance.$el = createMenu()

                    // have show class
                    instance.toggleMenu(null, function () {
                        expect(instance.$el.hasClass(instance.CONST.CLASS_SHOW)).toBeTruthy()
                    })

                    // hasn"t show class
                    instance.toggleMenu(null, function () {
                        expect(instance.$el.hasClass(instance.CONST.CLASS_SHOW)).toBeFalsy()
                        done()
                    })
                })

                it("with forceClose param", function (done) {
                    instance.$el = createMenu(instance.CONST.CLASS_SHOW)
                    // hasnt show class
                    instance.toggleMenu(true, function () {
                        expect(instance.$el.hasClass(instance.CONST.CLASS_SHOW)).toBeFalsy()
                        done()
                    })
                })
            })

            describe("handleToggleable()", function () {
                it("default none mobile", function (done) {
                    instance.$el = createMenu(instance.CONST.CLASS_ANIMATION + " " + instance.CONST.CLASS_SHOW)

                    instance.handleToggleable()
                    // hasnt animation class
                    expect(instance.$el.hasClass(instance.CONST.CLASS_ANIMATION)).toBeFalsy()

                    setTimeout(function () {
                        // hasnt show class
                        expect(instance.$el.hasClass(instance.CONST.CLASS_SHOW)).toBeFalsy()
                        done()
                    }, instance.CONST.TIMEOUT_CLOSE)

                })

                it("mobile case", function () {
                    mockDisplayMode("mobile")

                    instance.$el = createMenu()

                    instance.handleToggleable()
                    expect(instance.$el.hasClass(instance.CONST.CLASS_ANIMATION)).toBeTruthy()
                })
            })
        })
    })
