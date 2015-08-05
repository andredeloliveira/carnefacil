'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var parcelas = require('../../app/controllers/parcelas.server.controller');

	// Parcelas Routes
	app.route('/parcelas')
		.get(parcelas.list)
		.post(users.requiresLogin, parcelas.create);

	app.route('/parcelas/:parcelaId')
		.get(parcelas.read)
		.put(users.requiresLogin, parcelas.hasAuthorization, parcelas.update)
		.delete(users.requiresLogin, parcelas.hasAuthorization, parcelas.delete);

	// Finish by binding the Parcela middleware
	app.param('parcelaId', parcelas.parcelaByID);
};
