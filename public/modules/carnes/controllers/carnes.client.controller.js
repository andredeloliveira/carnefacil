'use strict';

// Carnes controller
angular.module('carnes').controller('CarnesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Carnes',
	function($scope, $stateParams, $location, Authentication, Carnes) {
		$scope.authentication = Authentication;

		// Create new Carne
		$scope.create = function() {
			// Create new Carne object
			var carne = new Carnes ({
				name: this.name
			});

			// Redirect after save
			carne.$save(function(response) {
				$location.path('carnes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Carne
		$scope.remove = function(carne) {
			if ( carne ) { 
				carne.$remove();

				for (var i in $scope.carnes) {
					if ($scope.carnes [i] === carne) {
						$scope.carnes.splice(i, 1);
					}
				}
			} else {
				$scope.carne.$remove(function() {
					$location.path('carnes');
				});
			}
		};

		// Update existing Carne
		$scope.update = function() {
			var carne = $scope.carne;

			carne.$update(function() {
				$location.path('carnes/' + carne._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Carnes
		$scope.find = function() {
			$scope.carnes = Carnes.query();
		};

		// Find existing Carne
		$scope.findOne = function() {
			$scope.carne = Carnes.get({ 
				carneId: $stateParams.carneId
			});
		};
	}
]);