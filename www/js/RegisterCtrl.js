angular.module('RegisterCtrl', ['ionic', 'pascalprecht.translate'])

    .controller('RegisterCtrl', function (searchCepService, $scope, $ionicHistory, $state, $ionicLoading, $http, $q, $ionicPopup, $rootScope, API_URL, ionicMaterialMotion, ionicMaterialInk, $timeout) {


        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        console.log("In RegisterCtrl");


        /**
         * Going to Account Settings
         */
        $scope.$on('$ionicView.enter', function (event, viewData) {
            $rootScope.currentView = "Account";
            $ionicLoading.show();

            // Store DB info on both scopes as the templates have bth
            //		$scope.data = $rootScope.user;  //should become obsolete in time
            $scope.address = $rootScope.user;

            console.log($scope.address);

            if (typeof $scope.address == "undefined") {
                $scope.address = {
                    Password: "",
                    pass2: ""
                };
            }

            $scope.address.Password = window.localStorage.getItem("password");
            $scope.address.pass2 = window.localStorage.getItem("password");
            $ionicLoading.hide();

        });


        searchCepService.createAddressObject($scope, 'address');
        /**
         * Geolocation lookup an dstoring of results
         */

        function storeAddress(address, input, newUser) {
            console.log("getting here");
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("Address found: " + results[0].geometry.location.lat() + results[0].geometry.location.lng());

                    input.Latitude = results[0].geometry.location.lat();
                    input.Longitude = results[0].geometry.location.lng();
                    input.CityCode = 15;
                    input.Country = 'Brazil';


                    var routing = '/modifyCustomer';
                    if (newUser) {
                        routing = '/registerAsCustomer';
                    }

                    $ionicLoading.show();

                    $http
                        .post(API_URL + routing, {
                            data: input,
                            access_token: $rootScope.customerToken
                        })
                        .success(function (data, status) {
                            data.rememberUser = true;
                            $ionicLoading.hide();
                        })
                        .error(function (data, status) {
                            console.error(JSON.stringify(data));
                            $ionicPopup.alert({
                                title: 'Register Error',
                                template: data.mensagem
                            });
                            $ionicLoading.hide();
                        });

                } else {
                    console.log("Address could not be found: " + status);

                    $ionicPopup.alert({
                        title: 'Register Error',
                        template: 'The address could not be found, please verify your address data'
                    });
                }
            });
        }

        /**
         * create and modify customer accound
         */
        $scope.register = function (input, newUser) {
            var address = input.Street + " , " + input.Number + " , " + input.City + " / " + input.State;
            storeAddress(address, input, newUser);
        };

        $scope.$on('save-user-account', function(event, args) {
            var input = $scope.address;
            var address = input.Street + " , " + input.Number + " , " + input.City + " / " + input.State;
            storeAddress(address, input, false);
        });

    });





