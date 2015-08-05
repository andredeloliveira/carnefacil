'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Carne = mongoose.model('Carne'),
	_ = require('lodash');

/**
 * Create a Carne
 */
exports.create = function(req, res) {
	var carne = new Carne(req.body);
	carne.user = req.user;

	carne.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carne);
		}
	});
};

/**
 * Show the current Carne
 */
exports.read = function(req, res) {
	res.jsonp(req.carne);
};

/**
 * Update a Carne
 */
exports.update = function(req, res) {
	var carne = req.carne ;

	carne = _.extend(carne , req.body);

	carne.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carne);
		}
	});
};

/**
 * Delete an Carne
 */
exports.delete = function(req, res) {
	var carne = req.carne ;

	carne.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carne);
		}
	});
};

/**
 * List of Carnes
 */
exports.list = function(req, res) { 
	Carne.find().sort('-created').populate('user', 'displayName').exec(function(err, carnes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carnes);
		}
	});
};

/**
 * Carne middleware
 */
exports.carneByID = function(req, res, next, id) { 
	Carne.findById(id).populate('user', 'displayName').exec(function(err, carne) {
		if (err) return next(err);
		if (! carne) return next(new Error('Failed to load Carne ' + id));
		req.carne = carne ;
		next();
	});
};

/**
 * Carne authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.carne.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
