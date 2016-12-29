angular.module('starter', [
        'ionic',
        'ionic.rating',
        'ionic-material',
        'ionMdInput',
        'pascalprecht.translate',
        'config',
        'AppCtrl',
        'LoginCtrl',
        'OrderCtrl',
        'OrderStatusCtrl',
        'EvaluateCtrl',
        'RegisterCtrl',
    ])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {

        // Turn off caching for demo simplicity's sake
        $ionicConfigProvider.views.maxCache(0);

        /*
         // Turn off back button text
         $ionicConfigProvider.backButton.previousTitleText(false);
         */

        $translateProvider.translations('en', {
            //the following translation should be transferred in a separate json file
            loginName: "Username",
            loginPassword: "Password",
            loginStore: "Remember my user and password (will skip this screen next time)",
            loginButton: "Login",
            loginTitle: "Sign-In or Register",

            toRegisterButton: "I am new -> Register",
            registerTitle: "Register your user",
            registerFirstName: "First Name",
            registerLastName: "Last Name",
            registerEmail: "Email",
            registerPass: "Password",
            registerPass2: "Repeat Password",
            registerTel: "Telephone",
            registerCel: "Cellphone",
            registerCPF: "CPF",
            registerCep: "ZIP Code",
            registerStreet: "Street",
            registerNr: "Nr",
            registerApp: "Appartment",
            registerDist: "District",
            registerCity: "City",
            registerState: "State",
            registerButton: "Save",
            logoutButton: "Log Out",

            orderTitle: "Compare Prices of different brands",
            orderSupplierRating: "Supplier Rating",
            orderPlaceOrder: "place Order",
            orderButtonProfile: "Your Account",
            orderButtonHistory: "Order History",
            orderItemDesc: "(per unit)",
            orderDeliveryTimeDesc1: "expected Deliver time is ",
            orderDeliveryTimeDesc2: " minutes",

            accountTitle: "Your Account",

            statusTitle: "Status of your Order",
            statusSubTitle1: "Driver Information",
            statusSubTitle2: "Items in Order",
            statusButtonConfirm: "Confirm Order",
            statusButtonCancel: "Cancel Order",

            evaluationTitle: "Evaluation of Delivery",
            evaluationRangeSpeed: "Speed of delivery",
            evaluationRangePrice: "Price",
            evaluationRangeNice: "Friendliness of Staff",
            evaluationButtonSend: "Send Evaluation",

            menuOrder: "Order",
            status: 'Status',
            sequenceOrder: 'Sequence of Order',
            tableName: 'Name',
            tableQuantity: 'Quantity',
            tablePrice: 'Price',
            tableTotal: 'Total',

            selOrderBy: 'Order By',
            selPrice: 'Price',
            selDeliveryTime: 'Delivery Time',

            firstNameRequired: 'First name is required.',
            lastNameRequired: 'Last name is required.',
            emailRequired: 'Email is required.',
            invalidEmail: 'Invalid email address.',
            passwordNotMatch: 'Password does not match.',
            passwordRequired: 'Password is required.',
            telephoneRequired: 'Telephone is required.',
            cellphoneRequired: 'Cellphone is required.',
            cpfRequired: 'CPF is required.',
            zipcodeRequired: 'Zip code is required.',
            streetRequired: 'Street is required.',
            nrRequired: 'Nr is required.',
            appartmentRequired: 'Appartment is required.',
            districtRequired: 'District is required.',
            cityRequired: 'City is required.',
            stateRequired: 'State is required.',
        });

        $translateProvider.translations('pt', {
            loginName: 'Nombre de usario',
            loginPassword: 'Senha',
            loginStore: "Recordar usario e senha (will skip this screen next time)",
            loginButton: "fazer o login",
            loginTitle: "Sign-In or Register",
            toRegisterButton: "I am new -> Register",

            registerTitle: "Registar o seu usario",
            registerFirstName: "First Name",
            registerLastName: "Last Name",
            registerEmail: "Email",
            registerPass: "Password",
            registerPass2: "Repeat Password",
            registerTel: "Telephone",
            registerCel: "Cellphone",
            registerCPF: "CPF",
            registerCep: "ZIP Code",
            registerStreet: "Street",
            registerNr: "Nr",
            registerApp: "Appartment",
            registerDist: "District",
            registerCity: "City",
            registerState: "State",
            registerButton: "Save",
            logoutButton: "Log Out",

            orderTitle: "Comparar Precos ",
            orderPlaceOrder: "Pedir",
            orderSupplierRating: "Supplier Rating",
            orderButtonProfile: "Your Account",
            orderButtonHistory: "Order History",
            orderItemDesc: " (por unidade) ",
            orderDeliveryTimeDesc1: "tempo estimado pela entrega: ",
            orderDeliveryTimeDesc2: " minutos",

            accountTitle: "Your Account",

            statusTitle: "Status of your Order",
            statusSubTitle1: "Driver Information",
            statusSubTitle2: "Items in Order",
            statusButtonConfirm: "Confirm Order",
            statusButtonCancel: "Cancel Order",

            evaluationTitle: "Evaluation of Delivery",
            evaluationRangeSpeed: "Speed of delivery",
            evaluationRangePrice: "Price",
            evaluationRangeNice: "Friendliness of Staff",
            evaluationButtonSend: "Send Evaluation",

            menuOrder: "Order",
            status: 'Status',
            sequenceOrder: 'Sequence of Order',
            tableName: 'Name',
            tableQuantity: 'Quantity',
            tablePrice: 'Price',
            tableTotal: 'Total',

            selOrderBy: 'Order By',
            selPrice: 'Price',
            selDeliveryTime: 'Delivery Time',

            firstNameRequired: 'First name is required.',
            lastNameRequired: 'Last name is required.',
            emailRequired: 'Email is required.',
            invalidEmail: 'Invalid email address.',
            passwordNotMatch: 'Password does not match.',
            passwordRequired: 'Password is required.',
            telephoneRequired: 'Telephone is required.',
            cellphoneRequired: 'Cellphone is required.',
            cpfRequired: 'CPF is required.',
            zipcodeRequired: 'Zip code is required.',
            streetRequired: 'Street is required.',
            nrRequired: 'Nr is required.',
            appartmentRequired: 'Appartment is required.',
            districtRequired: 'District is required.',
            cityRequired: 'City is required.',
            stateRequired: 'State is required.',
        });


        if (window.localStorage.getItem('lang')) {
            $translateProvider.preferredLanguage(window.localStorage.getItem('lang'));
        } else {
            $translateProvider.preferredLanguage('pt');
        }

        $translateProvider.useSanitizeValueStrategy('escape');


        $stateProvider.state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })

            .state('app.account', {
                url: '/account',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account.html',
                        controller: 'RegisterCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends" class="button button-fab button-fab-top-right expanded button-energized-900 spin" ng-click="register();"><i class="icon ion-ios-download"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })

            .state('app.order', {
                url: '/order',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/order.html',
                        controller: 'OrderCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-refresh" class="button button-fab button-fab-top-right expanded button-energized-900 spin" ng-click="refresh();"><i class="icon ion-refresh"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-refresh').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })

            .state('app.status', {
                url: '/status',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/status.html',
                        controller: 'OrderStatusCtrl'
                    }
                }
            })

            .state('app.evaluation', {
                url: '/evaluation',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/evaluation.html',
                        controller: 'EvaluateCtrl'
                    }
                }
            })

            .state('app.register',{
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/login');
    })

    .service('searchCepService', function ($http) {
        console.log("Service called");

        function createAddressObject(scope, address) {
            scope[address] = {
                Zipcode: "",
                Street: "",
                District: "",
                City: "",
                State: ""
            };
            scope.$watch(address + ".Zipcode", function (newValue) {
                searchCEP(scope[address], newValue);
            });
        }


        function toNumbers(str) {
            if (!str) {
                return "";
            }
            return str.toString().replace(/\D/g, "").substr(0, 8);
        }

        function maskedCEP(cep) {
            var formattedCEP = "";
            var cn = toNumbers(cep);
            if (cn.length > 5) {
                formattedCEP = cn.substr(0, 5) + "-" + cn.substr(5, 3);
            } else {
                formattedCEP = cn;
            }
            return formattedCEP;
        }

        function clearAddress(address) {
            address.Street = "";
            address.District = "";
            address.City = "";
            address.State = "";
        }

        function fillAddress(address, result) {
            address.Street = result.logradouro;
            address.District = result.bairro;
            address.City = result.cidade;
            address.State = result.uf;
        }

// this function does the real work
        function searchCEP(address, cep) {
            var cepNumbers = toNumbers(cep);
            address.Zipcode = maskedCEP(cep);
            if (cepNumbers.length !== 8) {
                return;
            }

            var config = {
                params: {
                    cep: cep,
                    formato: 'json'
                }
            };

            $http.get('http://cep.republicavirtual.com.br/web_cep.php', config).then(
                function (response) {
                    if (!response.data.resultado || response.data.resultado == 0) {
                        clearAddress(address);
                        return;
                    }
                    fillAddress(address, response.data);
                });
        }


        return {createAddressObject: createAddressObject};

    });

