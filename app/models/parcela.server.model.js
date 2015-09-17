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
	parcelaAtual:{
		type:String,
		default:'',
		required:'é necessário para criar a parcela saber qual é a parcela referencial'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Parcela', ParcelaSchema);