angular.module('LoginCtrl', ['ionic', 'pascalprecht.translate'])

.controller('LoginCtrl', function ($scope, $state, $ionicLoading, $http, $q, $ionicPopup, $rootScope, API_URL, $timeout, ionicMaterialInk, ionicMaterialMotion) {


    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $timeout(function () {
        $scope.$parent.hideHeader();
    }, 0);

    var currentView = $rootScope.currentView;
    var customerToken = $rootScope.customerToken;

    $scope.$on('$ionicView.enter', function (event, viewData) {

        window.localStorage.setItem("custToken", "");

        if (currentView == "appMenu") { // comming from the app Menu

            var user = window.localStorage.getItem("username");
            var pass = window.localStorage.getItem("password");

            $scope.user = {
                user: user,
                pass: pass,
                rememberUser: true
            };
            $rootScope.currentView = currentView;
        }
        else {
            if (window.localStorage.getItem("custToken")) {
                $rootScope.customerToken = window.localStorage.getItem("custToken");
                $state.go('app.order');
            }
        }
    });

    /**
     * authenticateCustomer
     */

    $scope.login = function (user) {

        $ionicLoading.show();

        $http
            .post(API_URL + '/authenticateCustomer', {
                user: user
            })
            .success(function (data, status) {

                console.log(data);

                console.log("in authenticate, storring" + user.user + " " + user.pass + "token" + data.token);

                if (user.rememberUser) {
                    window.localStorage.setItem("username", user.user);
                    window.localStorage.setItem("password", user.pass);
                    window.localStorage.setItem("custToken", data.token);
                }

                $rootScope.customerToken = data.token;

                $ionicLoading.hide();
                $state.go('app.order');
            })
            .error(function (data, status) {
                console.error(JSON.stringify(data));
                $ionicPopup.alert({
                    title: 'Login Error',
                    template: data.mensagem
                });
                $ionicLoading.hide();
            });

    };

    $scope.toRegister = function () {
        $state.go('register');
    };

});
