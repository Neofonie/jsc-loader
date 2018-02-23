define(
    ["jquery", "underscore", "backbone",
        "util/display-mode", "util/scroll-to",
        "consts/notification-const"],
    function ($, _, Backbone,
              DisplayMode, ScrollTo,
              NotificationConst) {
        return Backbone.View.extend({
            CONST: {
                COMPONENT_NAME: "BurgerMenu",
                DEBUG: false,

                CLASS_SHOW: "show-burger-menu",
                CLASS_SHOW_ANIMATE: "show-burger-menu--animate",
                CLASS_ANIMATION: "with-animation",
                SELECTOR_BURGER_MENU_BTN: "jsBurgerMenuBtn",
                SELECTOR_MENU_LIST: ".jsMenuList",
                SELECTOR_BACKDROP: ".jsBackdrop",
                TIMEOUT_OPEN: 10,
                TIMEOUT_CLOSE: 300,
                TIMEOUT_DEBOUNCE: 50
            },

            events: {
                "click .jsBackdrop": "onBackdropClick"
            },

            $button: null,
            /**
             * init this component
             * on desktop remove animation and show
             * on mobile add animation and activate togglebility
             */
            onRegister: function () {
                // disabled scrolling via backdrop on touch device
                $(document).on("touchmove", _.bind(function (event) {
                    var $target = $(event.target);
                    // on backdrop touchmove close menu
                    if (this.isMenuOpen() && $target.hasClass(this.CONST.SELECTOR_BACKDROP.replace(".", ""))) {
                        this.toggleMenu(true);
                    }

                    if (this.isMenuOpen() && !$target.closest(this.CONST.SELECTOR_MENU_LIST).length) {
                        // on touchmove inside the menu stop touch move
                        event.preventDefault();
                    }
                }, this));

                this.handleToggleable();
            },

            onBackdropClick: function () {
                this.toggleMenu(true);
            },
            /**
             * specifications for jsc communication
             * @returns {array}
             */
            listNotificationInterests: function () {
                return [
                    NotificationConst.WINDOW_RESIZE,
                    NotificationConst.WINDOW_ORIENTATION_CHANGE,
                    NotificationConst.MENU_OPEN_SUBMENU,
                    NotificationConst.MENU_TOGGLE_BURGERMENU
                ];
            },
            /**
             * listener for the communication between jsc components
             * @param notificationName (string)
             * @param notifcationData (object)
             */
            handleNotification: function (notificationName, notifcationData) {
                this.log("handleNotification()", notificationName);
                switch (notificationName) {
                    case NotificationConst.WINDOW_RESIZE:
                        this.handleToggleable();
                        break;
                    case NotificationConst.WINDOW_ORIENTATION_CHANGE:
                        this.toggleMenu(true);
                        break;
                    case NotificationConst.MENU_OPEN_SUBMENU:
                        this.scrollTop();
                        break;
                    case NotificationConst.MENU_TOGGLE_BURGERMENU:
                        this.onClickBurgerMenuButton({target: notifcationData.target});
                        break;
                }
            },

            isMenuOpen: function () {
                return this.$el.hasClass(this.CONST.CLASS_SHOW);
            },

            /**
             * toggle a class on the main element
             * @param forceClose boolean
             * @param callback function
             */
            toggleMenu: function (forceClose, callback) {
                this.log("toggleMenu()");
                if (!forceClose) {
                    if (!this.isMenuOpen()) {
                        this.app.sendNotification(NotificationConst.MENU_TOOGLE_OPEN);
                        this.openMenu(callback);
                    } else {
                        this.closeMenu(callback);
                        this.app.sendNotification(NotificationConst.MENU_TOOGLE_CLOSE);
                    }
                } else {
                    this.closeMenu(callback);
                }
            },

            scrollTop: function () {
                // scroll list back to begin
                this.$(this.CONST.SELECTOR_MENU_LIST).stop().animate({
                    scrollTop: 0
                }, 0);
            },

            openMenu: function (callback) {
                this.log("openMenu()");
                this.$el.addClass(this.CONST.CLASS_SHOW);
                // add class to body because of prevent scrolling inside the body
                $(document.body).addClass(this.CONST.CLASS_SHOW);

                this.scrollTop();

                window.clearTimeout(this.delayMenu);

                this.delayMenu = _.delay(_.bind(function () {
                    this.$el.addClass(this.CONST.CLASS_SHOW_ANIMATE);
                    if (_.isFunction(callback)) {
                        callback();
                    }
                }, this), this.CONST.TIMEOUT_OPEN);
            },

            closeMenu: function (callback) {
                this.$el.removeClass(this.CONST.CLASS_SHOW_ANIMATE);

                window.clearTimeout(this.delayMenu);

                this.delayMenu = _.delay(_.bind(function () {
                    this.$el.removeClass(this.CONST.CLASS_SHOW);
                    // add class to body because of prevent scrolling inside the body
                    $(document.body).removeClass(this.CONST.CLASS_SHOW);
                    if (_.isFunction(callback)) {
                        callback();
                    }
                }, this), this.CONST.TIMEOUT_CLOSE);
            },

            /**
             * this method handles the togglebility of the menu
             * on desktop remove animation and close menu
             * on mobile it is togglable
             */
            handleToggleable: function () {
                if (DisplayMode.isMobile()) {
                    this.$el.addClass(this.CONST.CLASS_ANIMATION);
                } else {
                    this.$el.removeClass(this.CONST.CLASS_ANIMATION);
                    this.toggleMenu(true);
                }
            },

            onClickBurgerMenuButton: function (event) {
                this.$button = $(event.target);
                // is visible element / mobile mediaquery should make this visible
                if (this.$button.is(":visible")) {
                    this.toggleMenu();
                }
            }
        });
    });