'use strict';

(function() {
	// Clientes Controller Spec
	describe('Clientes Controller Tests', function() {
		// Initialize global variables
		var ClientesController,
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

			// Initialize the Clientes controller.
			ClientesController = $controller('ClientesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cliente object fetched from XHR', inject(function(Clientes) {
			// Create sample Cliente using the Clientes service
			var sampleCliente = new Clientes({
				name: 'New Cliente'
			});

			// Create a sample Clientes array that includes the new Cliente
			var sampleClientes = [sampleCliente];

			// Set GET response
			$httpBackend.expectGET('clientes').respond(sampleClientes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clientes).toEqualData(sampleClientes);
		}));

		it('$scope.findOne() should create an array with one Cliente object fetched from XHR using a clienteId URL parameter', inject(function(Clientes) {
			// Define a sample Cliente object
			var sampleCliente = new Clientes({
				name: 'New Cliente'
			});

			// Set the URL parameter
			$stateParams.clienteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/clientes\/([0-9a-fA-F]{24})$/).respond(sampleCliente);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cliente).toEqualData(sampleCliente);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Clientes) {
			// Create a sample Cliente object
			var sampleClientePostData = new Clientes({
				name: 'New Cliente'
			});

			// Create a sample Cliente response
			var sampleClienteResponse = new Clientes({
				_id: '525cf20451979dea2c000001',
				name: 'New Cliente'
			});

			// Fixture mock form input values
			scope.name = 'New Cliente';

			// Set POST response
			$httpBackend.expectPOST('clientes', sampleClientePostData).respond(sampleClienteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cliente was created
			expect($location.path()).toBe('/clientes/' + sampleClienteResponse._id);
		}));

		it('$scope.update() should update a valid Cliente', inject(function(Clientes) {
			// Define a sample Cliente put data
			var sampleClientePutData = new Clientes({
				_id: '525cf20451979dea2c000001',
				name: 'New Cliente'
			});

			// Mock Cliente in scope
			scope.cliente = sampleClientePutData;

			// Set PUT response
			$httpBackend.expectPUT(/clientes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/clientes/' + sampleClientePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid clienteId and remove the Cliente from the scope', inject(function(Clientes) {
			// Create new Cliente object
			var sampleCliente = new Clientes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Clientes array and include the Cliente
			scope.clientes = [sampleCliente];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/clientes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCliente);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.clientes.length).toBe(0);
		}));
	});
}());