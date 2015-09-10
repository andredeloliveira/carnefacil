'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'carnefacil';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('carnes');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('clientes');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('parcelas');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

// Carnes controller
angular.module('carnes').controller('CarnesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Carnes','Clientes','Parcelas',
	function($scope, $stateParams, $location, Authentication, Carnes, Clientes, Parcelas) {
		$scope.authentication = Authentication;
		$scope.clientes = Clientes.query();
		$scope.carnesBusca = [];
		$scope.showParcelas = 0;
		$scope.showCarnes = 0;
		$scope.parcelasCarne = Parcelas.query();

		//function to filter all carnes by id, client name, etc etc
		$scope.filterParcelasByCarne = function(idCarne){	
			console.log('entered the damn function');
			if(this.idCarne === ''){
				$scope.showCarnes =0;
			}
			if($scope.carnesBusca.length > 0){
				$scope.carnesBusca = [];
			}
			for (var i = 0; i< $scope.carnes.length; i++) {
					if($scope.carnes[i]._id === idCarne)
						$scope.carnesBusca.push($scope.carnes[i]);
			}
			if($scope.carnesBusca.length > 0){
				$scope.showCarnes = 1;
				this.idCarne = '';
			}else{
				$scope.showCarnes = 0;
				this.idCarne ='';
			}
			console.log($scope.carnesBusca);
		};
		//function to control the 'showing' of all the carnes
		$scope.toShowCarnes = function(number){
			if(number === $scope.showCarnes){
				return true;
			}else{
				return false;
			}
		};
		//function to control the showing of all the carnes collection
		$scope.mostrarTodosOsCarnes = function(){
			$scope.showCarnes = 0;
		};

		//Create all the parcelas from a carne
		$scope.createParcelas = function(id){
			var valorParcelas = this.total / this.nparcelas;
			var dataAtual = Date.now();
			for(var i =1; i<= this.nparcelas; i++){
				var parcela = new Parcelas({
					carne: id,
					dataVencimento: dataAtual + 2.62974e9,
					valor : valorParcelas
				});
				dataAtual = dataAtual + 2.62974e9;
				parcela.$save();
			}
			console.log($scope.parcelasImpressao);
		};
		// Create new Carne
		$scope.create = function() {
			// Instantiate a new Carne global object
			var carne = new Carnes ({
				cliente: this.cliente._id,
				nparcelas: this.nparcelas,
				total: this.total
			});
			
			// Redirect after save
			carne.$save(function(response) {
				$location.path('carnes/' + response._id);
				$scope.createParcelas(response._id);
				// Clear form fields
				$scope.nparcelas = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			
		};

		// Remove existing Carne
		$scope.remove = function(carne) {
			if ( carne ) { 
				carne.$remove();

				for (var i in $scope.carnes) {
					if ($scope.carnes [i] === carne) {
						$scope.carnes.splice(i, 1);
					}
				}
			} else {
				$scope.carne.$remove(function() {
					$location.path('carnes');
				});
			}
		};

		// Update existing Carne
		$scope.update = function() {
			var carne = $scope.carne;

			carne.$update(function() {
				$location.path('carnes/' + carne._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Carnes
		$scope.find = function() {
			$scope.carnes = Carnes.query();
		};

		// Find existing Carne
		$scope.findOne = function() {
			$scope.carne = Carnes.get({ 
				carneId: $stateParams.carneId
			});
		};

		$scope.filtrarPorCarnes = function(parcela){
			return parcela.carne._id === $scope.carne._id;
		};
	}
]);
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
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

// Parcelas controller
angular.module('parcelas').controller('ParcelasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parcelas','Carnes','Clientes',
	function($scope, $stateParams, $location, Authentication, Parcelas, Carnes, Clientes) {
		$scope.authentication = Authentication;
		$scope.newValor = 0;
		$scope.auxParcelas = [];
		$scope.showParcelasAll = 0;
		
		// Create new Parcela
		$scope.create = function() {
			// Create new Parcela object
			var parcela = new Parcelas ({
				name: this.name
			});

			// Redirect after save
			parcela.$save(function(response) {
				$location.path('parcelas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Parcela
		$scope.remove = function(parcela) {
			if ( parcela ) { 
				parcela.$remove();

				for (var i in $scope.parcelas) {
					if ($scope.parcelas [i] === parcela) {
						$scope.parcelas.splice(i, 1);
					}
				}
			} else {
				$scope.parcela.$remove(function() {
					$location.path('parcelas');
				});
			}
		};

		// Update existing Parcela
		$scope.update = function() {
			//before updating physically, first it will gather the data from the forms
			var parcela = $scope.parcela;
			
			/*
				* for the valor field that must be updated using taxaJuros to calculate the new value of the parcela
			*/

			var oldValor = $scope.parcela.valor;
			var newValor = (oldValor * $scope.parcela.taxaJuros) / 100;
			console.log('novo valor '+newValor);
			parcela.valor = oldValor + newValor;
			if($scope.isPaga === 0){
				parcela.isPaga = false;
			}else{
				$scope.isPaga = true;
			}
			console.log(parcela);
			parcela.$update(function() {
				$location.path('parcelas/' + parcela._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Parcelas
		$scope.find = function() {
			$scope.parcelas = Parcelas.query();
		};

		// Find existing Parcela
		$scope.findOne = function() {
			$scope.parcela = Parcelas.get({ 
				parcelaId: $stateParams.parcelaId
			});
			console.log($scope.parcela);
			
			
		};

		$scope.filterFunction = function(parcela){
			return parcela.isPaga === false;
		};

		/*Need to transform into a query statement. If I had billions of carnes it would be bad!*/
		$scope.filterParcelasByCarne = function(idCarne){	
			console.log('entered the damn function');
			if(this.idCarne === ''){
				$scope.showParcelasAll =0;
			}	
			if($scope.showParcelasAll.length > 0){
				$scope.showParcelasAll = [];
			}
			for (var i = 0; i< $scope.parcelas.length; i++) {
					if($scope.parcelas[i]._id === idCarne)
						$scope.auxParcelas.push($scope.parcelas[i]);
			}
			if($scope.auxParcelas.length > 0){
				$scope.showParcelasAll = 1;
				this.idCarne = '';
			}else{
				$scope.showParcelasAll = 0;
				this.idCarne ='';
			}
			console.log($scope.auxParcelas);
		};

		$scope.showParcelas = function(number){
			if(number === $scope.showParcelasAll){
				return true;
			}else{
				return false;
			}
		};

		$scope.mostrarTodasAsParcelas = function(){
			$scope.showParcelasAll = 0;
		};

	}
]);
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);