'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Parcela Schema
 */
var ParcelaSchema = new Schema({
	carne: {
		type: Schema.ObjectId,
		ref: 'Carne'
	},
	created: {
		type: Date,
		default: Date.now
	},
	dataVencimento: {
		type: Date,
		default: Date.now,
	},
	valor: {
		type: Number,
		default: 0.0,
		required: 'Por favor, preencha o valor das parcelas'
	},
	taxaJuros: {
		type: Number,
		default: 0.0
	},
	isPaga: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Parcela', ParcelaSchema);