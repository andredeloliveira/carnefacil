'use strict';

// Configuring the Articles module
angular.module('parcelas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Parcelas', 'parcelas', 'dropdown', '/parcelas(/create)?');
		Menus.addSubMenuItem('topbar', 'parcelas', 'List Parcelas', 'parcelas');
		Menus.addSubMenuItem('topbar', 'parcelas', 'New Parcela', 'parcelas/create');
	}
]);