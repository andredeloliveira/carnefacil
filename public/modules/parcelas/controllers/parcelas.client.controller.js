'use strict';

// Parcelas controller
angular.module('parcelas').controller('ParcelasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parcelas',
	function($scope, $stateParams, $location, Authentication, Parcelas) {
		$scope.authentication = Authentication;

		// Create new Parcela
		$scope.create = function() {
			// Create new Parcela object
			var parcela = new Parcelas ({
				name: this.name
			});

			// Redirect after save
			parcela.$save(function(response) {
				$location.path('parcelas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Parcela
		$scope.remove = function(parcela) {
			if ( parcela ) { 
				parcela.$remove();

				for (var i in $scope.parcelas) {
					if ($scope.parcelas [i] === parcela) {
						$scope.parcelas.splice(i, 1);
					}
				}
			} else {
				$scope.parcela.$remove(function() {
					$location.path('parcelas');
				});
			}
		};

		// Update existing Parcela
		$scope.update = function() {
			var parcela = $scope.parcela;

			parcela.$update(function() {
				$location.path('parcelas/' + parcela._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Parcelas
		$scope.find = function() {
			$scope.parcelas = Parcelas.query();
		};

		// Find existing Parcela
		$scope.findOne = function() {
			$scope.parcela = Parcelas.get({ 
				parcelaId: $stateParams.parcelaId
			});
		};
	}
]);