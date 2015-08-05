'use strict';

// Clientes controller
angular.module('clientes').controller('ClientesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clientes',
	function($scope, $stateParams, $location, Authentication, Clientes) {
		$scope.authentication = Authentication;

		// Create new Cliente
		$scope.create = function() {
			// Create new Cliente object
			var cliente = new Clientes ({
				name: this.name
			});

			// Redirect after save
			cliente.$save(function(response) {
				$location.path('clientes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cliente
		$scope.remove = function(cliente) {
			if ( cliente ) { 
				cliente.$remove();

				for (var i in $scope.clientes) {
					if ($scope.clientes [i] === cliente) {
						$scope.clientes.splice(i, 1);
					}
				}
			} else {
				$scope.cliente.$remove(function() {
					$location.path('clientes');
				});
			}
		};

		// Update existing Cliente
		$scope.update = function() {
			var cliente = $scope.cliente;

			cliente.$update(function() {
				$location.path('clientes/' + cliente._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Clientes
		$scope.find = function() {
			$scope.clientes = Clientes.query();
		};

		// Find existing Cliente
		$scope.findOne = function() {
			$scope.cliente = Clientes.get({ 
				clienteId: $stateParams.clienteId
			});
		};
	}
]);