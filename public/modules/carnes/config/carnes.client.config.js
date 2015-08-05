'use strict';

// Configuring the Articles module
angular.module('carnes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Carnes', 'carnes', 'dropdown', '/carnes(/create)?');
		Menus.addSubMenuItem('topbar', 'carnes', 'List Carnes', 'carnes');
		Menus.addSubMenuItem('topbar', 'carnes', 'New Carne', 'carnes/create');
	}
]);