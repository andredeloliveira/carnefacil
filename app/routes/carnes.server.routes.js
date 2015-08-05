'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var carnes = require('../../app/controllers/carnes.server.controller');

	// Carnes Routes
	app.route('/carnes')
		.get(carnes.list)
		.post(users.requiresLogin, carnes.create);

	app.route('/carnes/:carneId')
		.get(carnes.read)
		.put(users.requiresLogin, carnes.hasAuthorization, carnes.update)
		.delete(users.requiresLogin, carnes.hasAuthorization, carnes.delete);

	// Finish by binding the Carne middleware
	app.param('carneId', carnes.carneByID);
};
