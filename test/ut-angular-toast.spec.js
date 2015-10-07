'use strict';

describe('ut-angular-toast append()', function () {
    var service,
        toastType = 1,
        toastContent = 'Test',
        toastDelay = 500,
        showCloseButton = true,
        useStack = true,
        $rootScope,
        $timeout;

    beforeEach(module('ngSanitize', 'untemps.utToast'));
    beforeEach(inject(function (utToast, _$rootScope_, _$timeout_) {
        service = utToast;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }));

    afterEach(function () {
        service.removeAll();
        service.toasts = [];
        var toaster = document.getElementsByClassName('toaster');
        angular.element(toaster).remove();
    });

    it('Append method with usStack=true should display all appended elements', function () {
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        $rootScope.$digest();

        var toaster = document.getElementsByClassName('toaster');
        var element = angular.element(toaster);

        expect(toaster).toBeDefined();
        expect(element).toBeDefined();
        expect(service.toasts.length).toEqual(3);
        expect(element.children().length).toEqual(3);
    });

    it('Append method with usStack=false should display one element only', function () {
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        service.append(toastType, toastContent, toastDelay, showCloseButton, false);
        $rootScope.$digest();

        var toaster = document.getElementsByClassName('toaster');
        var element = angular.element(toaster);

        expect(service.toasts.length).toEqual(1);
        expect(element.children().length).toEqual(1);
    });

    it('Append method should return the appended toast object', function () {
        var toast = service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);

        expect(toast).toBeDefined();
        expect(toast.type).toEqual(toastType);
        expect(toast.text).toEqual(toastContent);
        expect(toast.delay).toEqual(toastDelay);
    });

    it('Appended toast should display a close button', function () {
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        $rootScope.$digest();

        var closeButton = document.getElementsByClassName('close');
        expect(closeButton.length).toEqual(1);
    });

    it('Appended toast should not display a close button', function () {
        service.append(toastType, toastContent, toastDelay, false, useStack);
        $rootScope.$digest();

        var closeButton = document.getElementsByClassName('close');
        expect(closeButton.length).toEqual(0);
    });

    it('Appended toast should be removed after delay expiration', function () {
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        $rootScope.$digest();

        var toaster = document.getElementsByClassName('toaster');
        var element = angular.element(toaster);

        $timeout.flush(toastDelay + 1);

        expect(service.toasts.length).toEqual(0);
        expect(element.children().length).toEqual(0);
    });
});

describe('ut-angular-toast remove()', function () {
    var service,
        toastType = 1,
        toastContent = 'Test',
        toastDelay = 500,
        showCloseButton = true,
        useStack = true,
        $rootScope;

    beforeEach(module('ngSanitize', 'untemps.utToast'));
    beforeEach(inject(function (utToast, _$rootScope_) {
        service = utToast;
        $rootScope = _$rootScope_;
    }));

    it('Remove method should remove the specified toast', function () {
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        var toast = service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);

        var toaster = document.getElementsByClassName('toaster');
        var element = angular.element(toaster);

        service.remove(toast);
        $rootScope.$digest();

        expect(service.toasts.length).toEqual(1);
        expect(element.children().length).toEqual(1);

        service.remove(service.toasts[0]);
        $rootScope.$digest();

        expect(service.toasts.length).toEqual(0);
        expect(element.children().length).toEqual(0);
    });
});

describe('ut-angular-toast removeAll()', function () {
    var service,
        toastType = 1,
        toastContent = 'Test',
        toastDelay = 500,
        showCloseButton = true,
        useStack = true,
        $rootScope;

    beforeEach(module('ngSanitize', 'untemps.utToast'));
    beforeEach(inject(function (utToast, _$rootScope_) {
        service = utToast;
        $rootScope = _$rootScope_;
    }));

    it('RemoveAll method should remove all the current toasts', function () {
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);
        service.append(toastType, toastContent, toastDelay, showCloseButton, useStack);

        var toaster = document.getElementsByClassName('toaster');
        var element = angular.element(toaster);

        service.removeAll();
        $rootScope.$digest();

        expect(service.toasts.length).toEqual(0);
        expect(element.children().length).toEqual(0);
    });
});