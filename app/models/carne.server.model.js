'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Carne Schema
 */
var CarneSchema = new Schema({
	
	cliente: {
		type: Schema.ObjectId,
		ref: 'Cliente'
	},
	nparcelas: {
		type: Number,
		default: 1
	},
	total: {
		type: Number,
		default: 0.0,
		required: 'Por favor, preencha o valor total da dívida!'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Carne', CarneSchema);