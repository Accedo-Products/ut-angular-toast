/*!
 * ut-angular-toast
 * https://github.com/untemps/ut-angular-toast
 * Version: 1.0.0 - 2018-03-10T01:19:45.911Z
 * License: MIT
 */


(function () {
    'use strict';

    var module = angular.module('untemps.utToast', []);
    module.constant('utToastType', ['success', 'error', 'warning', 'info', 'neutral']);
    module.factory('Toast', ['utToastType', Toast]);
    module.controller('utToastController', ['utToast', utToastController]);
    module.provider('utToast', [utToast]);
    module.service('utToastService', ['$rootScope', '$window', '$compile', '$timeout', 'Toast', utToastService]);

    /**
     * @ngdoc service
     * @name Toast
     * @description Toast object.
     *
     */
    function Toast(utToastType) {
        return function (type, message, delay, showCloseButton, animationClass) {
            var __this = this;

            var resolveType = function (type) {
                var result = 5;
                if (angular.isNumber(type)) {
                    result = Math.max(0, Math.min(utToastType.length, Math.floor(type)));
                } else if (angular.isString(type)) {
                    var index = utToastType.indexOf(type);
                    if (index > -1) {
                        result = index + 1;
                    }
                }
                return result;
            };

            __this.uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                /*jslint bitwise: true */
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16).toLocaleUpperCase();
            });
            __this.type = resolveType(type);
            __this.message = message;
            __this.delay = delay || 0;
            __this.showCloseButton = showCloseButton || false;
            __this.animationClass = animationClass;
        };
    }

    /**
     * @ngdoc controller
     * @name utToastController
     * @description Controller for the toast container.
     *
     */
    function utToastController(utToast) {
        /*jshint validthis: true */
        var __this = this;

        __this.toasts = utToast.toasts;

        /**
         * Remove toast.
         * @param toast Toast to remove.
         */
        __this.remove = function (toast) {
            utToast.remove(toast);
        };
    }

    function utToast() {
        /*jshint validthis: true */
        var __this = this;

        __this.config = {};
        __this.config.toastDelay = 5000;
        __this.config.showCloseButton = true;
        __this.config.animationClass = 'fade';
        __this.config.stackToast = true;

        __this.setConfig = function(config) {
            __this.config = angular.extend(__this.config, config);
        };

        __this.$get = ['utToastService',function(utToastService){
            var service = utToastService;

            __this.toasts = service.toasts;
            __this.append = function(toastType, toastMessage, toastDelay, showCloseButton, animationClass, stackToast) {
                toastDelay = toastDelay || __this.config.toastDelay;
                showCloseButton = angular.isDefined(showCloseButton) ? showCloseButton : __this.config.showCloseButton;
                animationClass = animationClass || __this.config.animationClass;
                stackToast = angular.isDefined(stackToast) ? stackToast : __this.config.stackToast;

                return service.append(toastType, toastMessage, toastDelay, showCloseButton, animationClass, stackToast);
            };
            __this.remove = service.remove;
            __this.removeAll = service.removeAll;
            __this.clear = service.clear;

            return this;
        }];
    }

    /**
     * @ngdoc service
     * @name utToast
     * @description Manage the toasts.
     *
     */
    function utToastService($rootScope, $window, $compile, $timeout, Toast) {
        /*jshint validthis: true */
        var __this = this;

        __this.toasts = [];

        /**
         * Append a toast.
         * @param toastType         Type of the toast ('success', 1, 'error', 2, 'warning', 3, 'info', 4, 'neutral', 5) (default: 1). Use the utToastType constant to be sure to pass a valid value.
         * @param toastMessage      Message of the toast. You can use HTML in the message.
         * @param toastDelay        Delay of the toast in milliseconds (default: 5000).
         * @param showCloseButton   True if the toast has to display a close button.
         * @param animationClass    CSS class to be used as animation. You need to inject the ngAnimate module tu use this feature.
         * @param stackToast        True if the new toast has to be stacked on the current ones. False if the toast has to replace the current ones.
         */
        __this.append = function (toastType, toastMessage, toastDelay, showCloseButton, animationClass, stackToast) {
            var toasterElements = $window.document.getElementsByClassName('toaster');
            if(toasterElements.length === 0) {
                var scope = $rootScope.$new();
                var template = '<div class="toaster" ng-controller="utToastController as ctrl">' +
                    '<div ng-repeat="toast in ctrl.toasts" ng-class="[toast.animationClass,' +
                    '{success: toast.type===1, error: toast.type===2, warning: toast.type===3, info: toast.type===4, neutral: toast.type===5}]">' +
                    '<span class="close" ng-click="ctrl.remove(toast)" ng-if="toast.showCloseButton"></span>' +
                    '<span class="text" ng-bind-html="toast.message"></span>' +
                    '</div>' +
                    '</div>';
                var linkFn = $compile(template)(scope);
                angular.element($window.document.body).append(linkFn);
            }

            if(!stackToast) {
                __this.removeAll();
            }

            var toast = new Toast(toastType, toastMessage, toastDelay, showCloseButton, animationClass);
            if(toast.delay > 0) {
                toast.timeout = $timeout(function () {
                    __this.remove(toast);
                }, toast.delay);
            }
            __this.toasts.unshift(toast);

            return toast;
        };

        /**
         * Remove toast.
         * @param toast Toast to remove.
         */
        __this.remove = function (toast) {
            $timeout.cancel(toast.timeout);
            toast.timeout = undefined;
            __this.toasts.splice(__this.toasts.indexOf(toast), 1);

            return __this.toasts.indexOf(toast) === -1;
        };

        /**
         * Remove all current toasts.
         */
        __this.removeAll = function () {
            while (__this.toasts.length > 0) {
                __this.remove(__this.toasts[0]);
            }

            return __this.toasts.length === 0;
        };

        /**
         * Clear the HTML by dropping the toast container.
         */
        __this.clear = function() {
            __this.removeAll();
            var toasterElements = $window.document.getElementsByClassName('toaster');
            if(toasterElements.length > 0) {
                angular.element(toasterElements).remove();
            }

            return toasterElements.length === 0;
        };

        $rootScope.$on('destroy', function() {
            __this.clear();
        });
    }
})();