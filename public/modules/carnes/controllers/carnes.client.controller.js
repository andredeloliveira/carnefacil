'use strict';

// Carnes controller
angular.module('carnes').controller('CarnesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Carnes','Clientes','Parcelas',
	function($scope, $stateParams, $location, Authentication, Carnes, Clientes, Parcelas) {
		$scope.authentication = Authentication;
		$scope.clientes = Clientes.query();
		$scope.carnesBusca = [];
		$scope.showParcelas = 0;
		$scope.showCarnes = 0;
		$scope.parcelasCarne = Parcelas.query();

		//function to filter all carnes by id, client name, etc etc
		$scope.filterParcelasByCarne = function(idCarne){	
			console.log('entered the damn function');
			if(this.idCarne === ''){
				$scope.showCarnes =0;
			}
			if($scope.carnesBusca.length > 0){
				$scope.carnesBusca = [];
			}
			for (var i = 0; i< $scope.carnes.length; i++) {
					if($scope.carnes[i]._id === idCarne)
						$scope.carnesBusca.push($scope.carnes[i]);
			}
			if($scope.carnesBusca.length > 0){
				$scope.showCarnes = 1;
				this.idCarne = '';
			}else{
				$scope.showCarnes = 0;
				this.idCarne ='';
			}
			console.log($scope.carnesBusca);
		};
		//function to control the 'showing' of all the carnes
		$scope.toShowCarnes = function(number){
			if(number === $scope.showCarnes){
				return true;
			}else{
				return false;
			}
		};
		//function to control the showing of all the carnes collection
		$scope.mostrarTodosOsCarnes = function(){
			$scope.showCarnes = 0;
		};

		//Create all the parcelas from a carne
		$scope.createParcelas = function(id){
			var valorParcelas = this.total / this.nparcelas;
			var dataAtual = Date.now();
			for(var i =1; i<= this.nparcelas; i++){
				var parcela = new Parcelas({
					carne: id,
					dataVencimento: dataAtual + 2.62974e9,
					valor : valorParcelas
				});
				dataAtual = dataAtual + 2.62974e9;
				parcela.$save();
			}
			console.log($scope.parcelasImpressao);
		};
		// Create new Carne
		$scope.create = function() {
			// Instantiate a new Carne global object
			var carne = new Carnes ({
				cliente: this.cliente._id,
				nparcelas: this.nparcelas,
				total: this.total
			});
			
			// Redirect after save
			carne.$save(function(response) {
				$location.path('carnes/' + response._id);
				$scope.createParcelas(response._id);
				// Clear form fields
				$scope.nparcelas = '';
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

		$scope.filtrarPorCarnes = function(parcela){
			return parcela.carne._id === $scope.carne._id;
		};
	}
]);