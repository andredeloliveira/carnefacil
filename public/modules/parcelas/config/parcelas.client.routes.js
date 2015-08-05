'use strict';

//Setting up route
angular.module('parcelas').config(['$stateProvider',
	function($stateProvider) {
		// Parcelas state routing
		$stateProvider.
		state('listParcelas', {
			url: '/parcelas',
			templateUrl: 'modules/parcelas/views/list-parcelas.client.view.html'
		}).
		state('createParcela', {
			url: '/parcelas/create',
			templateUrl: 'modules/parcelas/views/create-parcela.client.view.html'
		}).
		state('viewParcela', {
			url: '/parcelas/:parcelaId',
			templateUrl: 'modules/parcelas/views/view-parcela.client.view.html'
		}).
		state('editParcela', {
			url: '/parcelas/:parcelaId/edit',
			templateUrl: 'modules/parcelas/views/edit-parcela.client.view.html'
		});
	}
]);