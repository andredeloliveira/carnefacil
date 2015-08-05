'use strict';

//Carnes service used to communicate Carnes REST endpoints
angular.module('carnes').factory('Carnes', ['$resource',
	function($resource) {
		return $resource('carnes/:carneId', { carneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);