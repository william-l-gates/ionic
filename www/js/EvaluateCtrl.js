angular.module('EvaluateCtrl', ['ionic', 'pascalprecht.translate'])

    .controller('EvaluateCtrl', function ($scope, $ionicLoading, $http, $q, $state, $rootScope, API_URL, ionicMaterialMotion, ionicMaterialInk, $ionicNavBarDelegate, $timeout) {

        /**
         * Evaluate Delivery  - evaluation object {speed, price, nice}
         */

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        $ionicNavBarDelegate.showBackButton(false);

        // Set Motion
        $timeout(function() {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        // Set Ink
        ionicMaterialInk.displayEffect();

        $scope.evaluateDelivery = function (orderID, evaluation) {

            var token = $rootScope.customerToken;

            console.log("Data for sending is " + token + " ID " + orderID + " eva " + evaluation.nice);

            $ionicLoading.show();

            $http.post(API_URL + '/evaluateDelivery', {
                    access_token: token,
                    orderID: orderID,
                    evaluation: evaluation
                })
                .success(function (data, status) {
                    console.log(JSON.stringify(data));
                    $ionicLoading.hide();
                    $rootScope.activeCustomerOrder = "";
                    $state.go('app.order');
                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                    $rootScope.activeCustomerOrder = "";
                    $state.go('app.order');
                });
        };

    });



