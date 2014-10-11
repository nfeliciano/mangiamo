var app = angular.module('mangiamo', ['ngResource', 'ui.router'])
//here we need to inject ui.router as we using it for routing

//$stateprovider is the service procided by ui.router
app.config(['$stateProvider', function ($stateProvider) {
//create route object
    var home= {
        url: '/home',
        templateUrl: 'views/Home.html',
        controller: 'HomeCtrl'
    },
    aboutUs= {
        url: '/aboutus',
        templateUrl: 'views/AboutUs.html',
        controller: 'AboutUsCtrl'
    },
    contactUs= {
        url: '/contactus',
        templateUrl: 'views/ContactUs.html',
        controller: 'ContactUsCtrl'
    };

//Now add these route state privider
    $stateProvider
       .state('home', home)
       .state('aboutus', aboutUs)
       .state('contactUs', contactUs);
}]);

app.controller('HomeCtrl', function ($scope) {
    $scope.message = 'Hello! we are on Home Page';
})
.controller('AboutUsCtrl', function ($scope) {
    $scope.message = 'Hello! we are on About Us Page';
})
.controller('ContactUsCtrl', function ($scope) {
    $scope.message = 'Hello! we are on Contact Us Page';
});