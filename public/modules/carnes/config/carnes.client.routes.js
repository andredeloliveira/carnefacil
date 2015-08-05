'use strict';

//Setting up route
angular.module('carnes').config(['$stateProvider',
	function($stateProvider) {
		// Carnes state routing
		$stateProvider.
		state('listCarnes', {
			url: '/carnes',
			templateUrl: 'modules/carnes/views/list-carnes.client.view.html'
		}).
		state('createCarne', {
			url: '/carnes/create',
			templateUrl: 'modules/carnes/views/create-carne.client.view.html'
		}).
		state('viewCarne', {
			url: '/carnes/:carneId',
			templateUrl: 'modules/carnes/views/view-carne.client.view.html'
		}).
		state('editCarne', {
			url: '/carnes/:carneId/edit',
			templateUrl: 'modules/carnes/views/edit-carne.client.view.html'
		});
	}
]);