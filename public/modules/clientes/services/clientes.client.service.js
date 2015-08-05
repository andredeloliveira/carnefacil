'use strict';

//Clientes service used to communicate Clientes REST endpoints
angular.module('clientes').factory('Clientes', ['$resource',
	function($resource) {
		return $resource('clientes/:clienteId', { clienteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);