'use strict';

(function() {
	// Parcelas Controller Spec
	describe('Parcelas Controller Tests', function() {
		// Initialize global variables
		var ParcelasController,
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

			// Initialize the Parcelas controller.
			ParcelasController = $controller('ParcelasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Parcela object fetched from XHR', inject(function(Parcelas) {
			// Create sample Parcela using the Parcelas service
			var sampleParcela = new Parcelas({
				name: 'New Parcela'
			});

			// Create a sample Parcelas array that includes the new Parcela
			var sampleParcelas = [sampleParcela];

			// Set GET response
			$httpBackend.expectGET('parcelas').respond(sampleParcelas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parcelas).toEqualData(sampleParcelas);
		}));

		it('$scope.findOne() should create an array with one Parcela object fetched from XHR using a parcelaId URL parameter', inject(function(Parcelas) {
			// Define a sample Parcela object
			var sampleParcela = new Parcelas({
				name: 'New Parcela'
			});

			// Set the URL parameter
			$stateParams.parcelaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/parcelas\/([0-9a-fA-F]{24})$/).respond(sampleParcela);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parcela).toEqualData(sampleParcela);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Parcelas) {
			// Create a sample Parcela object
			var sampleParcelaPostData = new Parcelas({
				name: 'New Parcela'
			});

			// Create a sample Parcela response
			var sampleParcelaResponse = new Parcelas({
				_id: '525cf20451979dea2c000001',
				name: 'New Parcela'
			});

			// Fixture mock form input values
			scope.name = 'New Parcela';

			// Set POST response
			$httpBackend.expectPOST('parcelas', sampleParcelaPostData).respond(sampleParcelaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Parcela was created
			expect($location.path()).toBe('/parcelas/' + sampleParcelaResponse._id);
		}));

		it('$scope.update() should update a valid Parcela', inject(function(Parcelas) {
			// Define a sample Parcela put data
			var sampleParcelaPutData = new Parcelas({
				_id: '525cf20451979dea2c000001',
				name: 'New Parcela'
			});

			// Mock Parcela in scope
			scope.parcela = sampleParcelaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/parcelas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/parcelas/' + sampleParcelaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid parcelaId and remove the Parcela from the scope', inject(function(Parcelas) {
			// Create new Parcela object
			var sampleParcela = new Parcelas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Parcelas array and include the Parcela
			scope.parcelas = [sampleParcela];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/parcelas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleParcela);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.parcelas.length).toBe(0);
		}));
	});
}());