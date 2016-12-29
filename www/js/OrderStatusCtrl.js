angular.module('OrderStatusCtrl', ['ionic', 'pascalprecht.translate'])

    .controller('OrderStatusCtrl', function ($scope, $ionicHistory, $ionicLoading, $http, $q, $state, $rootScope, API_URL, ionicMaterialInk, $ionicNavBarDelegate, $timeout, ionicMaterialMotion) {

        console.log("In OrderStatusCtrl");

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        $ionicNavBarDelegate.showBackButton(false);


        $scope.$on('$ionicView.enter', function (event, viewData) {
            $rootScope.currentView = "orderStatus";
            getOrderInformation($rootScope.customerToken, $rootScope.activeCustomerOrder);
        });

        /**
         * Confirm/Cancel Order
         */

        $scope.confirmCancelOrder = function (orderID, driverID, action) {
            console.log("Button pressed");
            var token = $rootScope.customerToken;
            var postlink = '/confirmarEntrega';
            if (action == "cancel") {
                postlink = '/cancelaEntrega';
            }

            $ionicLoading.show();
            $http.post(API_URL + postlink, {
                    access_token: token,
                    orderID: orderID,
                    driverID: driverID
                })
                .success(function (data, status) {
                    console.log('Order Cancelled/Confirmed');
                    console.log(JSON.stringify(data));
                    if (action == "cancel") { //could also use the return data
                        $rootScope.activeCustomerOrder = "";
                        $state.go('app.order');
                    } else {
                        $rootScope.evaluation = {OrderID: orderID, speed: 3, price: 3, nice: 3, comment: ""};
                        console.log("Order " + orderID + " and global " + $rootScope.evaluation.OrderID);
                        $state.go('app.evaluation');
                    } //OPEN clean the gloable variable

                    $ionicLoading.hide();

                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        };

        /**
         * Check Order status
         *
         * returns position of driverre
         */

        function getOrderInformation(token, orderID) {
            console.log("getOrderInformation with " + orderID + " and " + token);

            $ionicLoading.show();
            $http.post(API_URL + '/getOrderInformation', {
                    access_token: token,
                    orderID: orderID
                })
                .success(function (data, status) {
                    console.log(data);
                    $scope.orderHeader = data.orderHeader[0];
                    $scope.orderItems = data.orderItems;

                    var deliveryTime = new Date($scope.orderHeader.EstimatedDeliveryTime);
                    var formatTime = [deliveryTime.getHours(), deliveryTime.getMinutes(), deliveryTime.getSeconds()].join(' : ');


                    $scope.orderHeader.EstimatedDeliveryTime = formatTime;
                    $rootScope.currentView = "Status";
                    $state.go('app.status');
                    $ionicLoading.hide();
                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        }


        /**
         * Modify the Order, at this time only the following changes are supported
         * - Add/Delete Item
         * - Change Item Quantity
         *
         * action: addOrderItems, modifyOrderItems, deleteOrderItems
         * itemObject [{ProductID, Quantity, UnitPrice, Status}]
         */

        function modifyOrder(token, orderID, action, items) {

            var postlink = '/addOrderItems';
            if (action == "modifyOrderItems") {
                postlink = '/modifyOrderItems';
            }

            $ionicLoading.show();
            $http
                .post(API_URL + postlink, {
                    access_token: token,
                    orderID: orderID,
                    items: items
                })
                .success(function (data, status) {
                    console.log('Success');
                    console.log(JSON.stringify(data));

                    $ionicLoading.hide();

                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        }

    });
