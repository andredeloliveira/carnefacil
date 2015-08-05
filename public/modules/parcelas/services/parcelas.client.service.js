'use strict';

//Parcelas service used to communicate Parcelas REST endpoints
angular.module('parcelas').factory('Parcelas', ['$resource',
	function($resource) {
		return $resource('parcelas/:parcelaId', { parcelaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);