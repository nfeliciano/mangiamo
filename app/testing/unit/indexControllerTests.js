describe('Unit: indexController', function() {
    beforeEach(module('mangiamo'));

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
    it('should start with things completely uninitialized and empty', function() {
        expect(scope.startEating).toBe(true);
        expect(scope.mealBuddyRequests.length).toEqual(0);
        expect(scope.mealBuddies.length).toEqual(0);
        expect(scope.mealBuddySuggestions.length).toEqual(0);
        expect(scope.loginButtonVisible).toBeFalsy();
        expect(scope.logoutButtonVisible).toBeFalsy();
        expect(scope.linksButtonVisible).toBeFalsy();
        expect(scope.sidebarVisible).toBeFalsy();
        expect(scope.linksVisible).toBeFalsy();
        expect(scope.mealsVisible).toBeFalsy();
        expect(scope.introVisible).toBeFalsy();
    });

    //check that setSidebarContent(links) shows the links and nothing else
    it('should show the links sidebar and nothing else', function() {
        expect(scope.linksVisible).toBeFalsy();
        scope.setSidebarContent('links');
        expect(scope.linksVisible).toBe(true);
        expect(scope.mealsVisible).toBeFalsy();
        expect(scope.introVisible).toBeFalsy();
    });

    //check that setSidebarContent(intro) shows the links and nothing else
    it('should show the intro sidebar and nothing else', function() {
        expect(scope.introVisible).toBeFalsy();
        scope.setSidebarContent('intro');
        expect(scope.introVisible).toBe(true);
        expect(scope.mealsVisible).toBeFalsy();
        expect(scope.linksVisible).toBeFalsy();
    });

    //check that setSidebarContent(meals) shows the links and nothing else
    it('should show the intro sidebar and nothing else', function() {
        expect(scope.mealsVisible).toBeFalsy();
        scope.setSidebarContent('meals');
        expect(scope.mealsVisible).toBe(true);
        expect(scope.introVisible).toBeFalsy();
        expect(scope.linksVisible).toBeFalsy();
    });

    //check that togglesidebar hides the sidebar
    it('should hide the sidebar and show none of them', function() {
        scope.setSidebarContent('meals');
        scope.toggleSidebar(false);
        expect(scope.mealsVisible).toBeFalsy();
        expect(scope.introVisible).toBeFalsy();
        expect(scope.linksVisible).toBeFalsy();
        expect(scope.sidebarVisible).toBeFalsy();
    });

    //THIS WILL CHANGE: init

    //check that logout does everything we want

    //inject a key into populate meal buddies and check that it populates the arrays

    //not sure yet how to check facebook stuff
});
