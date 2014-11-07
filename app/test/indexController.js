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

	it('should have showMealBuddiesButton as true', function() {
		expect(scope.showMealBuddiesButton).toBe(false);
		scope.showSuppBuddiesButton();
		expect(scope.showMealBuddiesButton).toBe(true);
	});

	it('should have showMealBuddiesButton as false', function() {
		scope.showSuppBuddiesButton();
		expect(scope.showMealBuddiesButton).toBe(true);
		scope.hideSuppBuddiesButton();
		expect(scope.showMealBuddiesButton).toBe(false);
	});


});