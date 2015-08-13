'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Parcela = mongoose.model('Parcela'),
	_ = require('lodash');

/**
 * Create a Parcela
 */
exports.create = function(req, res) {
	var parcela = new Parcela(req.body);
	parcela.user = req.user;

	parcela.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcela);
		}
	});
};

/**
 * Show the current Parcela
 */
exports.read = function(req, res) {
	res.jsonp(req.parcela);
};

/**
 * Update a Parcela
 */
exports.update = function(req, res) {
	var parcela = req.parcela ;

	parcela = _.extend(parcela , req.body);

	parcela.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcela);
		}
	});
};

/**
 * Delete an Parcela
 */
exports.delete = function(req, res) {
	var parcela = req.parcela ;

	parcela.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcela);
		}
	});
};

/**
 * List of Parcelas
 */
exports.list = function(req, res) { 
	
	Parcela.find().sort('-created').populate('carne').exec(function(err, parcelas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcelas);
		}
	});
};

/**
 * Parcela middleware
 */
exports.parcelaByID = function(req, res, next, id) { 
	/*Parcela.findById(id).populate('user','carne').exec(function(err, parcela) {
		if (err) return next(err);
		if (! parcela) return next(new Error('Failed to load Parcela ' + id));
		req.parcela = parcela ;
		next();
	});*/
	var x = Parcela.findById(id);
	x.populate('user');
	x.populate('carne');
	x.exec(function(err,parcela){
		if(err) return next(err);
		if(! parcela) return next(new Error('Failed to load Parcela' + id));
		req.parcela = parcela;
		next();
	});
};

/**
 * Parcela authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.parcela.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
