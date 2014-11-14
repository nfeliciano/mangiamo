describe('Unit: indexController', function() {
    //beforeEach(module('mangiamo'));

    var ctrl, scope, location;
    beforeEach(inject(function($controller, $rootScope, $location) {
        scope = $rootScope.$new();
        location = $location;
        ctrl = $controller('indexController', {
            $scope: scope
        });
    }));

    /*Tests to do*/
    //check that all global data is as it should be to start

    //check that togglesidebar shows the sidebar

    //check that togglesidebar hides the sidebar

    //check that setSidebarContent(links) shows the links and nothing else

    //check that setSidebarContent(intro) shows the links and nothing else

    //check that setSidebarContent(meals) shows the links and nothing else

    //THIS WILL CHANGE: init

    //check that logout does everything we want

    //inject a key into populate meal buddies and check that it populates the arrays

    //not sure yet how to check facebook & google stuff
});
