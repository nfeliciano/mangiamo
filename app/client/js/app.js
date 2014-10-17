var app = angular.module('mangiamo', ['ngResource', 'ui.router', 'ui.bootstrap'])
//here we need to inject ui.router as we using it for routing

//$stateprovider is the service procided by ui.router
app.config(['$stateProvider', function ($stateProvider) {
	//create route object
    var login = {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginController'
    },
    main = {
        url: '/main',
        templateUrl: 'views/main.html',
        controller: 'mainController'
    };

	//Now add these route state privider
    $stateProvider
       .state('login', login)
       .state('main', main);
}]);