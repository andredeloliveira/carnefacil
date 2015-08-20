'use strict';

// Clientes controller
angular.module('clientes').controller('ClientesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clientes',
	function($scope, $stateParams, $location, Authentication, Clientes) {
		$scope.authentication = Authentication;
		$scope.showClientes = 0;
		$scope.clientesBusca = [];

		$scope.searchClientes = function(nomeCliente){	
			console.log('entered the damn function');
			var newNomeCliente = nomeCliente.toLowerCase();
			if(this.nomeCliente === ''){
				$scope.showClientes =0;
			}
			if(this.clientesBusca.length > 0){
				this.clientesBusca = [];
			}
			for (var i = 0; i< $scope.clientes.length; i++) {
				
				var newName = $scope.clientes[i].name.toLowerCase();
				var contain = newName.indexOf(newNomeCliente);
				if(contain > -1)
					$scope.clientesBusca.push($scope.clientes[i]);
			}
			if($scope.clientesBusca.length > 0){
				$scope.showClientes = 1;
				this.nomeCliente = '';
			}else{
				$scope.showClientes = 0;
				this.nomeCliente ='';
			}
			console.log($scope.clientesBusca);
		};
		//function to control the 'showing' of all the Clientes
		$scope.toShowClientes = function(number){
			if(number === $scope.showClientes){
				return true;
			}else{
				return false;
			}
		};

		//function to control the showing of all the Clientes collection
		$scope.mostrarTodosOsClientes = function(){
			$scope.showClientes = 0;
		};

		// Create new Cliente
		$scope.create = function() {
			

			// Create new Cliente object
			var enderecocompleto = this.rua + ' , ' + this.numero + ' ' + this.complemento;
			var cliente = new Clientes ({
				name: this.name,
				endereco: enderecocompleto,
				cpf: this.cpf,
				rg: this.rg,
				telefones: []
				//create a new instance for telefones in here (it might be tricky!)
			});
			cliente.telefones.push(this.telefone);
			cliente.telefones.push(this.celular);

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