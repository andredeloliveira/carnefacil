'use strict';

(function() {
	// Carnes Controller Spec
	describe('Carnes Controller Tests', function() {
		// Initialize global variables
		var CarnesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Carnes controller.
			CarnesController = $controller('CarnesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Carne object fetched from XHR', inject(function(Carnes) {
			// Create sample Carne using the Carnes service
			var sampleCarne = new Carnes({
				name: 'New Carne'
			});

			// Create a sample Carnes array that includes the new Carne
			var sampleCarnes = [sampleCarne];

			// Set GET response
			$httpBackend.expectGET('carnes').respond(sampleCarnes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carnes).toEqualData(sampleCarnes);
		}));

		it('$scope.findOne() should create an array with one Carne object fetched from XHR using a carneId URL parameter', inject(function(Carnes) {
			// Define a sample Carne object
			var sampleCarne = new Carnes({
				name: 'New Carne'
			});

			// Set the URL parameter
			$stateParams.carneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/carnes\/([0-9a-fA-F]{24})$/).respond(sampleCarne);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carne).toEqualData(sampleCarne);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Carnes) {
			// Create a sample Carne object
			var sampleCarnePostData = new Carnes({
				name: 'New Carne'
			});

			// Create a sample Carne response
			var sampleCarneResponse = new Carnes({
				_id: '525cf20451979dea2c000001',
				name: 'New Carne'
			});

			// Fixture mock form input values
			scope.name = 'New Carne';

			// Set POST response
			$httpBackend.expectPOST('carnes', sampleCarnePostData).respond(sampleCarneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Carne was created
			expect($location.path()).toBe('/carnes/' + sampleCarneResponse._id);
		}));

		it('$scope.update() should update a valid Carne', inject(function(Carnes) {
			// Define a sample Carne put data
			var sampleCarnePutData = new Carnes({
				_id: '525cf20451979dea2c000001',
				name: 'New Carne'
			});

			// Mock Carne in scope
			scope.carne = sampleCarnePutData;

			// Set PUT response
			$httpBackend.expectPUT(/carnes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/carnes/' + sampleCarnePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid carneId and remove the Carne from the scope', inject(function(Carnes) {
			// Create new Carne object
			var sampleCarne = new Carnes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Carnes array and include the Carne
			scope.carnes = [sampleCarne];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/carnes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCarne);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.carnes.length).toBe(0);
		}));
	});
}());