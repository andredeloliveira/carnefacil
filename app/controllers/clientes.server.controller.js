'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cliente = mongoose.model('Cliente'),
	_ = require('lodash');

/**
 * Create a Cliente
 */
exports.create = function(req, res) {
	var cliente = new Cliente(req.body);
	cliente.user = req.user;

	cliente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/**
 * Show the current Cliente
 */
exports.read = function(req, res) {
	res.jsonp(req.cliente);
};

/**
 * Update a Cliente
 */
exports.update = function(req, res) {
	var cliente = req.cliente ;

	cliente = _.extend(cliente , req.body);

	cliente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/**
 * Delete an Cliente
 */
exports.delete = function(req, res) {
	var cliente = req.cliente ;

	cliente.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/**
 * List of Clientes
 */
exports.list = function(req, res) { 
	Cliente.find().sort('-created').populate('user', 'displayName').exec(function(err, clientes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clientes);
		}
	});
};

/**
 * Cliente middleware
 */
exports.clienteByID = function(req, res, next, id) { 
	Cliente.findById(id).populate('user', 'displayName').exec(function(err, cliente) {
		if (err) return next(err);
		if (! cliente) return next(new Error('Failed to load Cliente ' + id));
		req.cliente = cliente ;
		next();
	});
};

/**
 * Cliente authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cliente.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
