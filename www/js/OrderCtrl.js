angular.module('OrderCtrl', ['ionic', 'pascalprecht.translate'])

    .controller('OrderCtrl', function ($scope, $ionicHistory, $state, $ionicLoading, $http, $q, $ionicPopup, $rootScope, API_URL, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicNavBarDelegate) {

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');
        $ionicNavBarDelegate.showBackButton(false);

        $scope.placeOrder = function (item) {
      //              console.log(JSON.stringify(item));
            createOrder($rootScope.customerToken, item.CompanyID, item.DriverID, item.delTime, item.Items);
        };

        /**
         * When getting here, should check if there is already an open order in which case we will not search for offers
         */

        $scope.orderType = 0;

        $scope.$on('$ionicView.enter', function (event, viewData) {
            $rootScope.currentView = "appMenu";
            loadCustomerAccountData($rootScope.customerToken);
        });

        $scope.doRefresh = function () {
            loadCustomerAccountData($rootScope.customerToken);
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.resortItems = function(orderType) {
            console.log(orderType);
            $scope.orderType = orderType;
            $scope.sortItems(0, $scope.items.length - 1);
        };

        $scope.sortItems = function(start, end) {
            var aItems = [];
            var sIndex = start;
            var eIndex = end;

            for (var i = start + 1; i <= end; i ++) {
                if ($scope.orderType == 0) {
                    if ($scope.items[start].pri >= $scope.items[i].pri) {
                        insertFirst(i);
                    }else {
                        insertEnd(i);
                    }
                }else {
                    if ($scope.items[start].delTime >= $scope.items[i].delTime) {
                        insertFirst(i);
                    }else {
                        insertEnd(i);
                    }
                }
            }

            aItems[sIndex] = $scope.items[start];

            function insertFirst(index) {
                aItems[sIndex] = $scope.items[index];
                sIndex ++;
            }

            function insertEnd(index) {
                aItems[eIndex] = $scope.items[index];
                eIndex --;
            }

            for (var i = start; i <= end; i ++) {
                $scope.items[i] = aItems[i];
            }


            if (start < sIndex - 1) {
                $scope.sortItems(start, sIndex - 1);
            }
            if (sIndex + 1 < end) {
                $scope.sortItems(sIndex + 1, end);
            }
        };

        $scope.$on('refresh-order', function(event, args) {
            $scope.doRefresh();
        });


        /**
         * Searching for "all" offers of all "active" drivers within a certain distance of customers address
         */

        Number.prototype.padLeft = function (base, chr) {
            var len = (String(base || 10).length - String(this).length) + 1;
            return len > 0 ? new Array(len).join(chr || '0') + this : this;
        };

        function searchForOffers(token, location, searchClasses) {

            var distanceService = new google.maps.DistanceMatrixService();
            var customerLatLng = new google.maps.LatLng(location.Latitude, location.Longitude);

            $ionicLoading.show();

            $http
                .post(API_URL + '/findOffers', {
                    access_token: token,
                    location: location,
                    searchClasses: searchClasses
                })
                .success(function (data, status) {
                    console.log(JSON.stringify(data));
                    $scope.items = [];

                    for (var i = 0; i < data.offers.length; i++) {
                        var imgPath = '/img/' + data.offers[i].Brand + '.jpg';

                        /*
                         var supplierReliabilityStr;
                         // BETTER WOULD BE TO WORK WITH STARS
                         switch (data.offers[i].Rating) {
                         case 0:	supplierReliabilityStr = 'Supplier is not reliable'; break;
                         case 1: supplierReliabilityStr = 'Supplier is not always reliable'; break;
                         case 2: supplierReliabilityStr = 'Good and reliable Supplier'; break;
                         case 3:	supplierReliabilityStr = 'Excellent and reliable Supplier'; break;
                         }
                         */

                        //          var priceStr = data.offers[i].UnitPrice + " R$ (per unit)";
                        var deliveryTimeStr = "Minumum Delivery time will be 45 minutes ";
                        var durationDirectLeg = 1200;
                        var startTime = new Date();

                        $scope.items.push({
                            DriverID: data.offers[i].DriverID,
                            CompanyID: data.offers[i].CompanyID,
                            LatitudeCurrent: data.offers[i].LatitudeCurrent,
                            LongitudeCurrent: data.offers[i].LongitudeCurrent,
                            Active: data.offers[i].Active,
                            Rating: data.offers[i].Rating,
                            minDuration: Math.ceil(durationDirectLeg / 60) + 2,
                            SequenceOrder: 0,
                            StartTime: startTime,
                            LatitudeStart: data.offers[i].LatitudeCurrent,
                            LongitudeStart: data.offers[i].LongitudeCurrent,
                            Items: [
                                {
                                    ProductID: data.offers[i].ProductID,
                                    Quantity: 1, UnitPrice: data.offers[i].UnitPrice
                                }
                            ],
                            img: imgPath,
                            pri: data.offers[i].UnitPrice,
                            curr: data.offers[i].Currency,
                            decr: data.offers[i].DescriptionShort,
                            //           rel: supplierReliabilityStr, //stars are enough
                            delTime: deliveryTimeStr
                        });

                        // maybe it would be "better" to loop $scope
                        for (var v = 0; v < data.relevantRoutes.length; v++) {
                            if (data.offers[i].DriverID == data.relevantRoutes[v].DriverID) {
                                $scope.items[i].SequenceOrder = data.relevantRoutes[v].SequenceOrder;
                                $scope.items[i].StartTime = data.relevantRoutes[v].EstimatedDeliveryTime;
                                $scope.items[i].LatitudeStart = data.relevantRoutes[v].Latitude;
                                $scope.items[i].LongitudeStart = data.relevantRoutes[v].Longitude;
                            }
                        }
                    }

                    // claculating the minimum and probable delivery time

                    var origins = [];
                    var destinations = [customerLatLng];

                    // Build the input for he distances matrix,
                    for (var j = 0; j < $scope.items.length; j++) {

                        //current driver ṕosition
                        var origin = new google.maps.LatLng($scope.items[j].LatitudeCurrent, $scope.items[j].LongitudeCurrent);
                        origins.push(origin);

                        // position of last delivery
                        var futureOrigin = new google.maps.LatLng($scope.items[j].LatitudeStart, $scope.items[j].LongitudeStart);
                        origins.push(futureOrigin);
                    }

                    distanceService.getDistanceMatrix({
                        origins: origins,
                        destinations: destinations,
                        travelMode: google.maps.TravelMode.DRIVING
                    }, callback);

                    function callback(response, status) {

                        if (status == google.maps.DistanceMatrixStatus.OK) {
                            console.log(JSON.stringify(response));
                            var origins = response.originAddresses;
                            var destinations = response.destinationAddresses;

                            for (var i = 0; i < origins.length; i++) {

                                var results = response.rows[i].elements;
                                var temp;

                                for (var j = 0; j < results.length; j++) {

                                    var element = results[j];
                                    var distance = element.distance.text;
                                    var duration = element.duration.text;
                                    var durationV = element.duration.value;
                                    var from = origins[i];
                                    var to = destinations[j];

                                    var actualTime = new Date();


                                    // even "i" (0, 2, 4, 6 ...)  refers to the distance of the  driver i CURRENT location to the customer
                                    // odd "i" (1, 3, 5...) refers to the distance of the driver i latest delivery location to the customer (in case that the driver has no deliveries his/her current position was used instead
                                    var x = Math.floor((i) / 2);
                                    if (x == i) {
                                    }
                                    else {
                                        // should be current time in case that the driver has no route already planned
                                        var timeAtLastDeliveryLocation = new Date($scope.items[x].StartTime);
                                        var timeToAdd = new Date(timeAtLastDeliveryLocation - actualTime).getTime();
                                        console.log("Time at last delivery location" + timeAtLastDeliveryLocation + " means we need to add add" + Math.ceil(timeToAdd / 60 / 1000) + " minutes to the duration of " + Math.ceil(durationV / 60));


                                        // use apply to ensure that the binding is updated
                                        $scope.$apply(function () {
                                            $scope.items[x].delTime = Math.ceil(durationV / 60) + Math.ceil(timeToAdd / 60 / 1000);
                                        });
                                        //			console.log("DeliveryTime is " + $scope.items[x].delTime );

                                    }


                                    /*


                                     // need to take in account the different ETA, Not Working yet
                                     var startTime = new Date ($scope.items[x].StartTime);
                                     var diff = new Date(startTime - actualTime).getTime();
                                     var probDuration = Math.ceil((diff + durationV)/1000/60) ;
                                     var delTime = new Date(actualTime.getTime() + diff);
                                     var delTimeFormat =
                                     [(delTime.getMonth()+1).padLeft(),
                                     delTime.getDate().padLeft(),
                                     delTime.getFullYear()].join('/')+
                                     ' ' +
                                     [ delTime.getHours().padLeft(),
                                     delTime.getMinutes().padLeft(),
                                     delTime.getSeconds().padLeft()].join(':');

                                     // use apply to ensure that the binding is updated
                                     $scope.$apply(function () {
                                     //                   console.log("Start Time " +  $scope.items[x].StartTime + " vs. " + actualTime + "res time difference " + probDuration);
                                     $scope.items[x].delTime = temp;
                                     $scope.items[x].probDelTime = delTimeFormat;
                                     });*/
                                    //
                                }
                            }
                        }
                    }

                    $ionicLoading.hide();
                    console.log($scope.items);

                    $timeout(function() {
                        ionicMaterialMotion.fadeSlideIn({
                            selector: '.animate-fade-slide-in .item'
                        });
                    }, 200);

                    // Activate ink for controller
                    ionicMaterialInk.displayEffect();
                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        }

        function createOrder(token, companyID, driverID, duration, items) {
            $ionicLoading.show();
            $http.post(API_URL + '/createOrder', {
                    access_token: token,
                    companyID: companyID,
                    items: items
                })
                .success(function (data, status) {

                    if (driverID) { // also a driverID has been provided so we can associate directly the delivery

                        $http.post(API_URL + '/associaEntrega', {
                                access_token: token,
                                driverID: driverID,
                                orderID: data.orderID
                            })
                            .success(function (data2, status) {
                                console.error(JSON.stringify(data));
                                $rootScope.activeCustomerOrder = data2.OrderID;

                                var currentTime = new Date();
                                var eta = new Date();
								eta.setSeconds(currentTime.getSeconds() + duration*60);


								updateEstimatedDeliveryTime(token, data2.OrderID, driverID, eta);
                            })
                            .error(function (data, status) {
                                console.error(JSON.stringify(data));
                            });


                    }
                    else {


                    }
                    $ionicLoading.hide();

                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        }

		function updateEstimatedDeliveryTime (token, orderID, driverID, eta) {
				console.log("Posting paramaters " + token + " " +eta + " dr" + driverID + " or " + orderID);

			$http.post(API_URL + '/updateEstimatedDeliveryTime', {
				access_token: token,
                orderID: orderID,
                driverID: driverID,
                estimatedArrivalTime: eta
                })
			.success(function (data, status) {
				$state.go('app.status');
			})
			.error(function (data, status) {
				console.error(JSON.stringify(data));
			});
		}

        function loadCustomerAccountData(token) {
            console.log("Load account data, link is " + API_URL);

            $http.post(API_URL + '/loadCustomerAccountData', {
                    access_token: token
                })
                .success(function (data, status) {

                    console.log(data.user);

                    // store in $rootScope to make it available to RegisterCtrl
                    $rootScope.user = data.user;
                    $rootScope.customerLocation = {Latitude: data.user.Latitude, Longitude: data.user.Longitude};
                    $ionicLoading.hide();

                    // as we are currently receiving only one line

                    if (data.user.Status == "Assigned" || data.user.Status == "Unassigned") {
                        $ionicLoading.hide();
                        $rootScope.activeCustomerOrder = data.user.OrderID;
                        $state.go('app.status');
                        return;
                    }

                    // no active order
                    console.log("Start search for offers");
                    searchForOffers($rootScope.customerToken, $rootScope.customerLocation, {class: 'all'});
                })
                .error(function (data, status) {
                    console.error(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        }

    });
