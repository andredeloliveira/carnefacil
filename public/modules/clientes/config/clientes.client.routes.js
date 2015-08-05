'use strict';

//Setting up route
angular.module('clientes').config(['$stateProvider',
	function($stateProvider) {
		// Clientes state routing
		$stateProvider.
		state('listClientes', {
			url: '/clientes',
			templateUrl: 'modules/clientes/views/list-clientes.client.view.html'
		}).
		state('createCliente', {
			url: '/clientes/create',
			templateUrl: 'modules/clientes/views/create-cliente.client.view.html'
		}).
		state('viewCliente', {
			url: '/clientes/:clienteId',
			templateUrl: 'modules/clientes/views/view-cliente.client.view.html'
		}).
		state('editCliente', {
			url: '/clientes/:clienteId/edit',
			templateUrl: 'modules/clientes/views/edit-cliente.client.view.html'
		});
	}
]);