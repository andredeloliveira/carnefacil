'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//modelagem para o subdocument de telefone, para formar um array disso ai.
var PhoneSchema = new Schema({
	numero: {
		type: String,
		default: '',
		trim: true
	}
});

/**
 * Cliente Schema
 */

var ClienteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor, Preencha o nome completo do cliente!',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	//endereco vai ser concatenado na view para formar o endereco completo, sem erros (ou com erros minimizados, fazer altas coisas la)
	endereco: {
		type: String,
		default: '',
		required: 'Por favor, preencha o endereco completo do cliente!',
		trim: true
	},
	cpf: {
		type: String,
		default: '',
		required: 'O CPF é obrigatório!',
		trim: true
	},
	rg: {
		type:String,
		default:'',
		required: 'O RG é obrigatório!'
	},
	telefones: {
		type: [PhoneSchema]
	}

});

mongoose.model('Cliente', ClienteSchema);