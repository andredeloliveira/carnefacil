'use strict';

// Configuring the Articles module
angular.module('clientes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Clientes', 'clientes', 'dropdown', '/clientes(/create)?');
		Menus.addSubMenuItem('topbar', 'clientes', 'List Clientes', 'clientes');
		Menus.addSubMenuItem('topbar', 'clientes', 'New Cliente', 'clientes/create');
	}
]);