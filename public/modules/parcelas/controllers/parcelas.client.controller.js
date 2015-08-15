'use strict';

// Parcelas controller
angular.module('parcelas').controller('ParcelasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parcelas','Carnes','Clientes',
	function($scope, $stateParams, $location, Authentication, Parcelas, Carnes, Clientes) {
		$scope.authentication = Authentication;
		$scope.newValor = 0;
		$scope.auxParcelas = [];
		$scope.showParcelasAll = 0;
		
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
			//before updating physically, first it will gather the data from the forms
			var parcela = $scope.parcela;
			
			/*
				* for the valor field that must be updated using taxaJuros to calculate the new value of the parcela
			*/

			var oldValor = $scope.parcela.valor;
			var newValor = (oldValor * $scope.parcela.taxaJuros) / 100;
			console.log('novo valor '+newValor);
			parcela.valor = oldValor + newValor;
			if($scope.isPaga === 0){
				parcela.isPaga = false;
			}else{
				$scope.isPaga = true;
			}
			console.log(parcela);
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
			console.log($scope.parcela);
			
			
		};

		$scope.filterFunction = function(parcela){
			return parcela.isPaga === false;
		};

		/*Need to transform into a query statement. If I had billions of carnes it would be bad!*/
		$scope.filterParcelasByCarne = function(idCarne){	
			console.log('entered the damn function');
			if(this.idCarne === ''){
				$scope.showParcelasAll =0;
			}	
			for (var i = 0; i< $scope.parcelas.length; i++) {
					if($scope.parcelas[i].carne._id === idCarne)
						$scope.auxParcelas.push($scope.parcelas[i]);
			}
			if($scope.auxParcelas.length > 0){
				$scope.showParcelasAll = 1;
				this.idCarne = '';
			}else{
				$scope.showParcelasAll = 0;
				this.idCarne ='';
			}
		};

		$scope.showParcelas = function(number){
			if(number === $scope.showParcelasAll){
				return true;
			}else{
				return false;
			}
		};

	}
]);